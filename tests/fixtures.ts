import { test as base, expect, chromium, type BrowserContext, type Page, type Worker } from '@playwright/test';
import { GetGemsHomePage } from './pom/testnet.getgems.io/get-gems-home-page';
import { TonWalletPage } from './pom/ton-wallet-page';
import path from 'path';
import { TonWalletPageActions } from './poa/ton-wallet-page-actions';


const findPageByTitle = (title: string, pages: Page[]) => pages.find(async item => await item.title() === title)

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  getGemsHomePage: GetGemsHomePage;
  tonWalletPage: TonWalletPage;
  walletActions: TonWalletPageActions;
  background: Worker;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, '../userData/tonwallet/1.1.42_0');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      bypassCSP: true,
      args: [
        '--window-size=1920,1080',
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--disable-web-security'
      ],
    });
    await use(context);
    // await context.close();
  },
  background: async ({context}, use) => {
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    await use(background)  
  },
  extensionId: async ({ context }, use) => {
    /*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
  getGemsHomePage: async ({ context }, use) => {
    let home: GetGemsHomePage;
    let page;
    // const pages = context.pages();

    // if (pages.length > 1) {
    //   page = pages[0];
    // }

    page = await context.newPage();
    // if (pages.length === 1) {
    //   page = await context.newPage();
    // }
    // let page = findPageByTitle('', context.pages())
    // if (!page) 
    //   page = context.pages()[0];
      
    home = new GetGemsHomePage(page);
    await use(home);
  },
  tonWalletPage: async ({ context, extensionId }, use) => {
    // const [,page] = context.pages();
    const tonWalletPage = new TonWalletPage(context.pages()[0], extensionId);

    await use(tonWalletPage);
  },
  walletActions: async ({ context, extensionId }, use) => {
    const pages = context.pages();

    const tonWalletPage = new TonWalletPage(pages[0], extensionId);
    const actions = new TonWalletPageActions(tonWalletPage);

    await use(actions);
  },
});
