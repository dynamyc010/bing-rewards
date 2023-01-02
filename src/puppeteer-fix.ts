// need this for it to work on arm based linux
async function launch(options: any = {}) {
    let browser: unknown;
    try {
        const puppeteer = await import("puppeteer");
        browser = await puppeteer.launch(options);
    } catch (e) {
        // puppeteer's built-in chromium is not supported on this platform
        try {
            const puppeteer = require("puppeteer-core");
            browser = await puppeteer.launch({
                executablePath: "chromium-browser", // needs to be installed and in PATH
                ...options,
            });
        }
        catch (e) {
            throw new Error("Puppeteer's browser is not supported on this platform and 'chromium-browser' is not installed, not added to PATH, or you're running as superuser. Please try again after fixing these.");
        }
    }

    return browser;
}


export default { launch };
