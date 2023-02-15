import { GetGemsHomePage } from './pom/get-gems-home-page';
import { TonWalletPage } from './pom/ton-wallet-page';
import { saveSecretWords } from './utils/save-secret-words';
import { test } from './fixtures';

test.describe('Homepage', () => {
  // test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only!');

  test.beforeAll(async ({ page, extensionId }) => {
    const tonWalletPage = new TonWalletPage(page, extensionId);
    await tonWalletPage.goto();
    await tonWalletPage.createWallet();
    await tonWalletPage.continueOnCreated();
    await tonWalletPage.getSecretWords();

    saveSecretWords(tonWalletPage.secretWords.join(' '));
    await tonWalletPage.continueOnBackup();
    await tonWalletPage.imSure();
    await tonWalletPage.fillSecretWords();
    await tonWalletPage.createPassword('password');
    await tonWalletPage.viewMyWallet();
    await tonWalletPage.viewAbout();
    await tonWalletPage.toggleNetwork();
  });

  test('should connect Ton Wallet correctly', async ({ context, getGemsHomePage, extensionId }) => {
    const pages = context.pages();
    const tonWalletPage = new TonWalletPage(pages[1], extensionId);

    await test.step('Loaded home page', async () => {
      await getGemsHomePage.bringToFront();
      await getGemsHomePage.goto();
      await test.expect(getGemsHomePage.page).toHaveURL('https://testnet.getgems.io');
    });

    await test.step('Click on "Connect Wallet"', async () => {
      await getGemsHomePage.openWalletConnectModal();
    });
    
    await test.step('Select wallet on modal', async () => {
      await getGemsHomePage.selectWallet('TON Wallet');
    });
    
    await test.step('Sign confirm selected wallet on TON Wallet extension', async () => {
      await tonWalletPage.bringToFront();
      await tonWalletPage.signConfirm();
    });    

    await test.step('On homepage should be visible header profile avatar', async () => {
      getGemsHomePage.bringToFront();
      await test.expect(getGemsHomePage.headerProfile.first()).toBeVisible();
    });
  });

});
