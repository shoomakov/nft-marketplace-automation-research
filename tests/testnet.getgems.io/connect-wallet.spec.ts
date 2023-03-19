import { TonWallet } from '../utils/ton-wallet';
import { test } from '../fixtures';

test.describe('getgems.io', () => {

  let mainWallet: TonWallet;
  let createdWallet: TonWallet;

  let address;
  test.beforeAll(async ({ walletActions }) => {
    await walletActions.runCreateWalletOperations();
    mainWallet = walletActions.buildMainWallet();
    createdWallet = walletActions.buildCreatedWallet();

    await mainWallet.sendTransaction(walletActions.createdAddress, '0.5');     
    await mainWallet.logBalance();    

    // temp
    address = walletActions.createdAddress;
  });

  test.afterEach(async ({ context }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    const pages = context.pages();

    if (pages.length > 0) {
      for (let i = 0; i < pages.length; i++) {
        const screenshot = await pages[i].screenshot();
        const title = await pages[i].title();
        await testInfo.attach(`Screenshot #${i}: "${title}"`, { body: screenshot, contentType: 'image/png' });   
      } 
    } 
  });

  test.afterAll(async ({ walletActions }) => {
    await createdWallet.sendTransaction(walletActions.mainAddress, '0.4'); 
    await createdWallet.logBalance(); 
  });

  test('should connect Ton Wallet correctly', async ({ getGemsHomePage, tonWalletPage, context, extensionId }) => {
    await test.step('Loaded home page', async () => {
      await getGemsHomePage.bringToFront();
      await getGemsHomePage.goto();
      await test.expect(getGemsHomePage.page).toHaveURL('https://testnet.getgems.io');
    });

    await test.step('Click on "Connect Wallet"', async () => {
      await getGemsHomePage.header().openConnectWalletModal();
    });

    await test.step('should be 2 pages on context', async () => {
      const pages = context.pages();
      await test.expect(pages.length).toBe(2);
    });
    
    await test.step('refresh TON Wallet page', async () => {
      await tonWalletPage.bringToFront();
      await tonWalletPage.page.reload();
      await tonWalletPage.page.locator('#main_refreshBtn').click();
    });

    await test.step('Select wallet on modal', async () => {
      await getGemsHomePage.bringToFront();
      await getGemsHomePage.walletConnect().selectWalletInModal('TON Wallet');
    });

    await test.step('should be visible signConfirm modal on TON Wallet page', async () => {
      await tonWalletPage.bringToFront();
      await test.expect(tonWalletPage.signConfirmPopup).toBeVisible();
    });
    
    await test.step('Sign confirm selected wallet on TON Wallet extension', async () => {
      await tonWalletPage.bringToFront();
      await tonWalletPage.signConfirm();
    });    

    await test.step('On homepage should be visible header profile avatar', async () => {
      await getGemsHomePage.bringToFront();
      await test.expect(getGemsHomePage.headerProfile.first()).toBeVisible();
    });

    await test.step('should be visible piece of current address on tooltip', async () => {
      const addressPiece = address.slice(0, -43);

      await getGemsHomePage.bringToFront();
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
