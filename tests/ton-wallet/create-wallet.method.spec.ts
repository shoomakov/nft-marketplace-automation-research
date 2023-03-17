import { TonWallet } from '../utils/ton-wallet';
import { test } from '../fixtures';

test.describe('TON Wallet (only method)', () => {
  let createdAddress: string;

  test.beforeAll(async ({ walletActions }) => {
    walletActions.initialized();
  });

  test.afterEach(async ({ context }, testInfo) => {
    console.log(`Finished ${testInfo.title} with status ${testInfo.status}`);
    const pages = context.pages();

    for (let i = 0; i < pages.length; i++) {
      const screenshot = await pages[i].screenshot();
      const title = await pages[i].title();
      await testInfo.attach(`Screenshot #${i}: ${title}`, { body: screenshot, contentType: 'image/png' });   
    }      
  });  

  test.afterAll(async ({ walletActions }) => {

    // console.log('Watch on Tonscan: ', `https://testnet.tonscan.org/address/${walletActions.createdAddress}`);
  });  

  test('should create Wallet correctly', async ({ walletActions }) => {

    let mainWallet: TonWallet;
    let createdWallet: TonWallet;

    await test.step('run create wallet operations', async () => {
      await walletActions.runCreateWalletOperations('1');
      mainWallet = walletActions.buildMainWallet();
      createdWallet = walletActions.buildCreatedWallet();
    });

    await test.step('send tokens to created wallet', async () => {
      await mainWallet.sendTransaction(walletActions.createdAddress, '0.5');     
      await mainWallet.logBalance();
    });

    await test.step('send tokens back from created wallet', async () => {
      await createdWallet.sendTransaction(walletActions.mainAddress, '0.4'); 
      await createdWallet.logBalance();    
    });
  });

  // test('should create Wallet correctly', async ({ walletActions }) => {
  //   await walletActions.wallets.created.sendTransaction
  // });
});
