import { BrowserContext } from '@playwright/test';
import { TonWallet } from '../utils/ton-wallet';
import { TonWalletPage } from '../pom/ton-wallet-page';
import { TonWalletPageActions } from '../poa/ton-wallet-page-actions';
import { test } from '../fixtures';

test.describe.configure({ mode: 'serial' });

let tonWalletPage: TonWalletPage;
let walletActions: TonWalletPageActions;
let mainWallet: TonWallet;
let createdWallet: TonWallet;
let browserContext: BrowserContext;

test.beforeAll(async ({ context, extensionId }) => {
  browserContext = context
  tonWalletPage = new TonWalletPage(context.pages()[0], extensionId);
  walletActions = new TonWalletPageActions(tonWalletPage);
});

test.afterEach(async ({}, testInfo) => {
  console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
  const pages = browserContext.pages();
    
  if (pages.length > 0) {
    for (let i = 0; i < pages.length; i++) {
      const screenshot = await pages[i].screenshot();
      const title = await pages[i].title();
      await testInfo.attach(`Screenshot #${i}: "${title}"`, { body: screenshot, contentType: 'image/png' });   
    } 
  }     
});  


test('run create wallet operations', async () => {
  await walletActions.runCreateWalletOperations();
  mainWallet = walletActions.buildMainWallet();
  createdWallet = walletActions.buildCreatedWallet();
});

test('send tokens to created wallet', async () => {
  await mainWallet.sendTransaction(walletActions.createdAddress, '0.5');     
  await mainWallet.logBalance();
});

test('send tokens back from created wallet', async () => {
  await createdWallet.sendTransaction(walletActions.mainAddress, '0.4'); 
  await createdWallet.logBalance();    
});  
