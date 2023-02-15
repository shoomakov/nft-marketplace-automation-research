import { test as base, expect, chromium, type BrowserContext } from '@playwright/test';
import { GetGemsHomePage } from './pom/get-gems-home-page';
import { TonWalletPage } from './pom/ton-wallet-page';
import path from 'path';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  getGemsHomePage: GetGemsHomePage;
  tonWalletPage: TonWalletPage;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, '../userData/tonwallet/1.1.42_0');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
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
    const pages = context.pages();
    const home = new GetGemsHomePage(pages[0]);
    await use(home);
  },
  tonWalletPage: async ({ context, extensionId }, use) => {
    const pages = context.pages();
    const tonWalletPage = new TonWalletPage(pages[1], extensionId);
    await use(tonWalletPage);
  },
});
