import { getBalanceByMnemonic, saveSecretWords, sendTransaction } from '../utils';

import { TonWalletPage } from '../pom/ton-wallet-page';
import { test } from '../fixtures';

test.describe('TON Wallet', () => {
  let createdAddress: string;
  let generatedMnemonic: string;
  const mainMnemonic: string = process.env.MAIN_MNEMONIC || '';
  const password: string = process.env.EXTENSION_PASSWORD || '';
  const mainAddress: string = process.env.MAIN_ADDRESS || '';
  const approximateFee = 0.003 + 0.000009999;


  test.afterEach(async ({ context }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    const pages = context.pages();

    for (let i = 0; i < pages.length; i++) {
      const screenshot = await pages[i].screenshot();
      const title = await pages[i].title();
      await testInfo.attach(`Screenshot #${i}: ${title}`, { body: screenshot, contentType: 'image/png' });   
    }      
  });  

  test.afterAll(async () => {
    console.log('Watch on Tonscan: ', `https://testnet.tonscan.org/address/${createdAddress}`);
  });

  test('should create Wallet correctly', async ({ page, extensionId }) => {
    const tonWalletPage = new TonWalletPage(page, extensionId);

    await test.step('should be defined MAIN_MNEMONIC variable', async () => {
      await test.expect(mainMnemonic).toBeTruthy();  
    });      

    await test.step('should be defined EXTENSION_PASSWORD variable', async () => {
      await test.expect(password).toBeTruthy();  
    });  

    await test.step('should have balance on main address', async () => {
      const balance = await getBalanceByMnemonic(mainMnemonic);

      await test.expect(Number(balance)).toBeTruthy();  
    });    

    await test.step('wallet should be opened', async () => {
      await tonWalletPage.goto();
      await test.expect(tonWalletPage.startScreen).toBeVisible();
    });

    await test.step('after select Create Wallet should be visible 24 secret words', async () => {
      await tonWalletPage.createWallet();
      await tonWalletPage.continueOnCreated();
      await tonWalletPage.getSecretWords();

      await test.expect(tonWalletPage.secretWords.length).toBe(24);
    });

    await test.step('secret words should be saved', async () => {
      generatedMnemonic = tonWalletPage.secretWords.join(' ');

      await test.expect(tonWalletPage.secretWords.length).toBe(24);
      await test.expect(generatedMnemonic).toBeTruthy();
    });    

    await test.step('should fill secret words', async () => {
      await tonWalletPage.continueOnBackup();
      await tonWalletPage.imSure();
      await tonWalletPage.fillSecretWords();

      await test.expect(tonWalletPage.createPasswordScreen).toBeVisible();
    });

    await test.step('should fill passwords inputs', async () => {
      await tonWalletPage.createPassword(password);

      await test.expect(tonWalletPage.readyToGoScreen).toBeVisible();
    });   
    
    await test.step('should navigate to wallet', async () => {
      await tonWalletPage.viewMyWallet();

      await test.expect(tonWalletPage.mainScreen).toBeVisible();
    });    

    await test.step('should switch network', async () => {
      await tonWalletPage.viewAbout();
      await tonWalletPage.toggleNetwork();

      await test.expect(tonWalletPage.page.locator('.your-balance')).toContainText('testnet');
    });


    await test.step('should receive tokens', async () => {
      await tonWalletPage.openReceivePopup();
      createdAddress = await tonWalletPage.getAddress();
      await sendTransaction(mainMnemonic, createdAddress, '1');
      await saveSecretWords(tonWalletPage.secretWords.join(" "), createdAddress);
    });  

    await test.step('should have balance on new address', async () => {
      const balance = await getBalanceByMnemonic(generatedMnemonic);

      console.log('new balance: ', balance);
      await test.expect(Number(balance)).toBeTruthy();  
    });    
    
    await test.step('should be defined env variable MAIN_ADDRESS', async () => {
      await test.expect(mainAddress).toBeTruthy();
    });       
    
    await test.step('should send tokens back', async () => {
      const fee = Number(process.env.TRANSACTION_COST) * 2;
      const backAmount = 1 - fee + approximateFee;
      await tonWalletPage.bringToFront();

      await sendTransaction(generatedMnemonic, mainAddress, String(backAmount));

      const balance = await getBalanceByMnemonic(generatedMnemonic);

      console.log('new balance: ', balance);

      await test.expect(Number(balance)).toBeFalsy();
    });             
  });
});
