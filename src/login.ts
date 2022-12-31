import puppeteer, { type Protocol, type Page } from "puppeteer";

export default async function login(): Promise<Protocol.Network.Cookie[]> {
    const viewport = {
        width: 800,
        height: 600
    }
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false,
        defaultViewport: viewport,
        args: [`--window-size=${viewport.width},${viewport.height+133}`]
    });
    browser.pages().then(pages => pages.forEach(page => page.close())); // close all pages that were opened by default

    const page = await browser.newPage();

    try {
        await promptLogin(page); // wait for login to complete

        const client = await page.target().createCDPSession();
        const cookies = (await client.send("Network.getAllCookies"))["cookies"];
        return cookies;
    } finally {
        await browser.close();
    }
}

function promptLogin(page: Page) {
    return new Promise<void>(async (resolve, reject) => {
        await page.goto("https://bing.com/", { waitUntil: "networkidle2" });

        const container = await page.waitForSelector("aria/Account Rewards and Preferences");
        if (!container) return reject("Could not find login button container.");

        const signInButton = await container.waitForSelector("a#id_l");
        if (!signInButton) return reject("Could not find login button.");

        await signInButton.click(); // navigate to login page
        signInButton.dispose();
        container.dispose();

        page.on("response", e => { // listen for response that happens when login is completed
            if (!e.ok()) return;

            const url = new URL(e.url());
            if (url.hostname === "login.live.com" && url.pathname === "/ppsecure/post.srf" && url.searchParams.has("opid")) {
                page.removeAllListeners("response");

                page.on("response", e => {
                    if (!e.ok()) return;
                    const url = new URL(e.url());
                    if (url.hostname === "login.microsoftonline.com" && url.pathname === "/common/oauth2/authorize") {
                        page.removeAllListeners("response");
                        page.removeAllListeners("load");
                        page.removeAllListeners("close");
                        resolve();
                    }
                })
            }
        });

        page.once("close", () => reject("Login page was closed"));

        page.on("load", () => {
            const url = new URL(page.url());
            if (["login.live.com", "www.bing.com"].includes(url.hostname)) return;

            page.removeAllListeners("response");
            page.removeAllListeners("load");
            page.removeAllListeners("close");
            reject("Navigated away from login page");
        });
    });
}
