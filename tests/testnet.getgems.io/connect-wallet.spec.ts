import { TonWalletPage } from '../pom/ton-wallet-page';
import { saveSecretWords } from '../utils/save-secret-words';
import { test } from '../fixtures';

test.describe('Homepage', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only!');

  let address;
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
    await tonWalletPage.openReceivePopup();
    address = await tonWalletPage.getAddress();
    await tonWalletPage.closeReceivePopup();
    debugger
  });

  test.afterEach(async ({ context }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    const pages = context.pages();

    debugger
    console.log(pages)  
    const screenshot = await pages[0].screenshot();
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });      
    const screenshot1 = await pages[1].screenshot();
    await testInfo.attach('screenshot', { body: screenshot1, contentType: 'image/png' });          
  });  

  test('should connect Ton Wallet correctly', async ({ getGemsHomePage, tonWalletPage }) => {
    await test.step('Loaded home page', async () => {
      await getGemsHomePage.bringToFront();
      await getGemsHomePage.goto();
      await test.expect(getGemsHomePage.page).toHaveURL('https://testnet.getgems.io');
    });

    await test.step('Click on "Connect Wallet"', async () => {
      await getGemsHomePage.header().openConnectWalletModal();
    });
    
    await test.step('Select wallet on modal', async () => {
      await getGemsHomePage.walletConnect().selectWalletInModal('TON Wallet');
    });
    
    await test.step('Sign confirm selected wallet on TON Wallet extension', async () => {
      await tonWalletPage.bringToFront();
      await tonWalletPage.signConfirm();
    });    

    await test.step('On homepage should be visible header profile avatar', async () => {
      getGemsHomePage.bringToFront();
      await test.expect(getGemsHomePage.headerProfile.first()).toBeVisible();
    });

    await test.step('should be visible piece of current address on tooltip', async () => {
      const addressPiece = address.slice(0, -43);
      await getGemsHomePage.header().openTooltip();
      await test.expect(getGemsHomePage.header().tooltipUserName.first()).toContainText(addressPiece);
    });    

    await test.step('wallet balance should displayed correctly', async () => {
      const balance = await tonWalletPage.getBalance();
      await getGemsHomePage.header().openTooltip();
      await test.expect(getGemsHomePage.header().cryptoPriceAmount.first()).toContainText(balance);
    });  
    
    await test.step('link to create single NFT should works', async () => {
      await getGemsHomePage.bringToFront();
      await getGemsHomePage.header().selectNFTBtn.hover();
      await getGemsHomePage.page.getByRole('link', { name: 'Single NFT' }).click();
      await test.expect(getGemsHomePage.page).toHaveURL('https://testnet.getgems.io/nft/create?nft_type=single_nft');
    });       
  });
});
