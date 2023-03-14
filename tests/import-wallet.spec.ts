import { readSecretWords } from './utils';
import { test } from './fixtures';

test.describe('Import wallet', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only!');

  test.afterEach(async ({ context }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    const [,page] = context.pages();

    const screenshot = await page.screenshot();
    await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });          
  });  

  test('should import Ton Wallet correctly', async ({ tonWalletPage, extensionId }) => {
    await test.step('should load wallet extension correctly', async () => {
      await tonWalletPage.goto();
      await test.expect(tonWalletPage.page).toHaveURL(`chrome-extension://${extensionId}/index.html`);
    });

    await test.step('should navigate by click on continue', async () => {
      await tonWalletPage.startImportBtn.click();
      await test.expect(tonWalletPage.importScreen).toBeVisible();
    });    

    await test.step('should fill all secret words and continue', async () => {
      const words = await readSecretWords();
      const wordsArray = words ? words.split(' ') : [];
      await tonWalletPage.fillAllSecretWords(wordsArray);
      await test.expect(tonWalletPage.createPasswordScreen).toBeVisible();
    });        

    await test.step('should fill your new password', async () => {
      await tonWalletPage.createPassword('password');
      await test.expect(tonWalletPage.readyToGoScreen).toBeVisible();
    });  
    
    await test.step('should view my wallet after click', async () => {
      await tonWalletPage.viewMyWallet();
      await test.expect(tonWalletPage.mainScreen).toBeVisible();
    });      
  });
});
