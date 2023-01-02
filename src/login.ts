import type { Protocol, Page, PuppeteerLaunchOptions, Browser } from "puppeteer";
import puppeteer from "./puppeteer-fix";

export default async function launchLogin(): Promise<Protocol.Network.Cookie[]> {
    const launchArgs: PuppeteerLaunchOptions = {
        headless: false,
        devtools: false,
        defaultViewport: {
            width: 800,
            height: 600
        }
    }
    launchArgs.args = [`--window-size=${launchArgs.defaultViewport!.width},${launchArgs.defaultViewport!.height + 133}`];

    let browser = await puppeteer.launch(launchArgs) as Browser;

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

        const signInButton = await page.waitForSelector("[aria-label=\"Account Rewards and Preferences\"] > a#id_l");
        if (!signInButton) return reject("Could not find login button.");

        await signInButton.click(); // navigate to login page
        signInButton.dispose();

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
