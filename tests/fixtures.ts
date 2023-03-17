import { test as base, expect, chromium, type BrowserContext, type Page } from '@playwright/test';
import { GetGemsHomePage } from './pom/get-gems-home-page';
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
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, '../userData/tonwallet/1.1.42_0');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        '--window-size=1920,1080',
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
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
    let home;
    let page;
    const pages = context.pages();

    if (pages.length > 1) {
      page = pages[0];
    }

    if (pages.length === 1) {
      page = await context.newPage();
    }
    // let page = findPageByTitle('', context.pages())
    // if (!page) 
    //   page = context.pages()[0];
      
    home = new GetGemsHomePage(page);
    await use(home);
  },
  tonWalletPage: async ({ context, extensionId }, use) => {
    const [,page] = context.pages();
    const tonWalletPage = new TonWalletPage(page, extensionId);

    await use(tonWalletPage);
  },
  walletActions: async ({ context, extensionId }, use) => {
    const pages = context.pages();
    debugger
    const [,page] = context.pages();
    const tonWalletPage = new TonWalletPage(pages[0], extensionId);
    const actions = new TonWalletPageActions(tonWalletPage);

    await use(actions);
  },
});
