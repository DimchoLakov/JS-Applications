//@ts-check
const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let url = 'localhost:5500/01.Messenger/index.html';
let browser;
let page;

describe('E2E tests', function () {
    this.timeout(6000);

    before(async () => {
        browser = await chromium.launch();
        // browser = await chromium.launch({headless: false, slowMo: 700});
    });
    after(async () => {
        await browser.close();
    });
    beforeEach(async () => {
        page = await browser.newPage();
    });
    afterEach(async () => {
        await page.close();
    });

    describe('Test Messenger', async () => {
        it('should load all messages when Refresh button is clicked', async () => {
            await page.goto(url);
            await page.click('#refresh');
            const messagesContent = await page.$eval('#messages', (el) => el.value);

            expect(messagesContent).to.contain('Spami: Hello, are you there?\nGarry: Yep, whats up :?\nSpami: How are you? Long time no see? :)\nGeorge: Hello, guys! :))');
        });

        it('should receive new message', async () => {
            await page.goto(url);
            
            const author = 'Goshou';
            const content = 'Hello';

            await page.fill('#author', author);
            await page.fill('#content', content);
            
            await page.click("text=Send");
            await page.click("text=Refresh");

            const messagesContent = await page.$eval("#messages", (el) => el.value);
            expect(messagesContent).to.contains(`${author}: ${content}`);
        });
    });
});
