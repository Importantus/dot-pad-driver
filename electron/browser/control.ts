import { createRequire } from 'node:module'
import open from 'open'

const require = createRequire(import.meta.url)
const { Hardware } = require('keysender')

const browser = new Hardware(null, "MozillaWindowClass");

async function openBrowser(url: string): Promise<void> {
    try {
        await open(url);
        console.log(`Opened browser with URL: ${url}`);
    } catch (err) {
        console.error('Failed to open the browser:', err);
    }
}

export async function launchBrowser() {
    if (browser) {
        console.log("Browser already open");
        browser.workwindow.setForeground();
        browser.workwindow.setView({ x: 0, y: 0 });
    } else {
        await openBrowser('www.google.com');
        browser.workwindow.refresh();
        browser.workwindow.setForeground();
    }
}

export async function closeBrowser() {
    if (!browser) {
        await launchBrowser();
    }
    await browser.keyboard.sendKey(['alt', 'f4']);
}

export async function newTab() {
    if (!browser) {
        await launchBrowser();
    }
    await browser.keyboard.sendKey(['ctrl', 't']);
}

export async function closeTab() {
    if (!browser) {
        await launchBrowser();
    }
    await browser.keyboard.sendKey(['ctrl', 'w']);
}

export async function tabHistoryForward() {
    if (!browser) {
        await launchBrowser();
    }
    await browser.keyboard.sendKey(['alt', 'right']);
}

export async function tabHistoryBackward() {
    if (!browser) {
        await launchBrowser();
    }
    await browser.keyboard.sendKey(['alt', 'left']);
}

export async function tabSwitchForward() {
    if (!browser) {
        await launchBrowser();
    }
    await browser.keyboard.sendKey(['ctrl', 'pageDown']);
}

export async function tabSwitchBackward() {
    if (!browser) {
        await launchBrowser();
    }
    await browser.keyboard.sendKey(['ctrl', 'pageUp']);
}