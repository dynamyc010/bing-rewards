import { type Page } from "puppeteer";
import words from "an-array-of-english-words";

// the number of searches required to get the maximum points based on the account level
const requiredSearches: Record<number, number> = {
    1: 10,
    2: 50,
};

export default async function getPoints(authenticatedPage: Page) {
    console.log("Getting today's points...");

    if (!await isSessionValidOnPage(authenticatedPage)) throw new Error("invalid session");
    
    const level = await getLevel(authenticatedPage);
    const numberOfSearches = requiredSearches[level] || 10;

    for (let i = 0; i < numberOfSearches; i++) {
        const url = new URL("https://bing.com/search");
        const randomWord = words[Math.floor(Math.random() * words.length)];
        url.searchParams.set("q", randomWord);

        console.log(`(#${i + 1}) Searching for ${randomWord}...`);
        await authenticatedPage.goto(url.toString());
        await sleep(5000);
    }

    console.log("Got the points.");
}

async function getLevel(authenticatedPage: Page) {
    await authenticatedPage.goto("https://rewards.bing.com/");

    const levelText = await authenticatedPage.waitForSelector("mee-rewards-user-status-banner-profile p.profileDescription");
    if (!levelText) throw new Error("Could not find level text.");

    const level = await levelText?.evaluate(e => e.innerHTML?.split("&nbsp;")[1]);
    levelText.dispose();

    return Number(level);
}

async function isSessionValidOnPage(page: Page) {
    await page.goto("https://bing.com/");

    const container = await page.waitForSelector("aria/Account Rewards and Preferences");
    if(!container) throw new Error("Could not find login button container.");

    const nameText = await container.waitForSelector("a#id_l > span#id_n");
    if(!nameText) throw new Error("Could not find name text.");
    
    const username = await nameText.evaluate(e => e.innerHTML);

    container.dispose();
    nameText.dispose();

    return username !== "";
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

