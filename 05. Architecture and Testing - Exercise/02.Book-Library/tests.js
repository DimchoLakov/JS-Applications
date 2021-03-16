//@ts-check
const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let url = 'localhost:5500/02.Book-Library/index.html';
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
        it('should load all books', async () => {
            await page.goto(url);
            
            await page.click("text=LOAD ALL BOOKS");

            const tbody = await page.$eval('table tbody', (el) => el.textContent);
            expect(tbody).to.contain('Harry Potter');
        });

        it('should add book', async () => {
            
        });

        it('should edit a book', async () => {
            
        });

        it('should delete a book', async () => {
            
        });
    });
});
