import { CreateNftDraftResult, Data } from './responses';

import { BrowserContext } from '@playwright/test';
import { GetGemsCreatePage } from '../pom/testnet.getgems.io/get-gems-create-page';
import { GetGemsHomePage } from '../pom/testnet.getgems.io/get-gems-home-page';
import { GetGemsUserPage } from '../pom/testnet.getgems.io/get-gems-user-page';
import { TonWallet } from '../utils/ton-wallet';
import { TonWalletPage } from '../pom/ton-wallet-page';
import { test } from '../fixtures';

interface UploadMediaResponse {
  fileId: string;
  fileUrl: string;
}

interface CreateNftDraftResultResponse {
  data: Data<CreateNftDraftResult>
}
test.describe.configure({ mode: 'serial' });

let mainWallet: TonWallet;
let createdWallet: TonWallet;
let browserContext: BrowserContext;
let getGemsHomePage: GetGemsHomePage;
let tonWalletPage: TonWalletPage;
let createNftPage: GetGemsCreatePage;
let userPage: GetGemsUserPage;
let nftContractAddress: string;

let address;
test.beforeAll(async ({ walletActions, context, extensionId }) => {
  browserContext = context;
  await walletActions.runCreateWalletOperations();
  mainWallet = walletActions.buildMainWallet();
  createdWallet = walletActions.buildCreatedWallet();
  const page = await context.newPage();

  getGemsHomePage = new GetGemsHomePage(page);
  createNftPage = new GetGemsCreatePage(page);
  userPage = new GetGemsUserPage(page);
  tonWalletPage = new TonWalletPage(context.pages()[0], extensionId);

  await mainWallet.sendTransaction(walletActions.createdAddress, '0.5');     
  await mainWallet.logBalance();    

    // temp
  address = walletActions.createdAddress;
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

test.afterAll(async ({ walletActions }) => {
  await createdWallet.sendTransaction(walletActions.mainAddress, '0.3'); 
  await createdWallet.logBalance(); 

  await browserContext.close();
});


test('should be loaded getgems.io home page', async () => {
  await getGemsHomePage.bringToFront();
  await getGemsHomePage.goto();
  await test.expect(getGemsHomePage.page).toHaveURL('https://testnet.getgems.io');
});

test('Click on "Connect Wallet"', async () => {
  await getGemsHomePage.header().openConnectWalletModal();
});

test('should be 2 pages on context', async () => {
  const pages = browserContext.pages();
  await test.expect(pages.length).toBe(2);
});
    
test('refresh TON Wallet page', async () => {
  await tonWalletPage.bringToFront();
  await tonWalletPage.page.reload();
  await tonWalletPage.page.locator('#main_refreshBtn').click();
});

test('Select wallet on modal', async () => {
  await getGemsHomePage.bringToFront();
  await getGemsHomePage.walletConnect().selectWalletInModal('TON Wallet');
});

test('should be visible signConfirm modal on TON Wallet page', async () => {
  await tonWalletPage.bringToFront();
  await test.expect(tonWalletPage.signConfirmPopup).toBeVisible();
});
    
test('Sign confirm selected wallet on TON Wallet extension', async () => {
  await tonWalletPage.bringToFront();
  await tonWalletPage.signConfirm();
});    

test('On homepage should be visible header profile avatar', async () => {
  await getGemsHomePage.bringToFront();
  await test.expect(getGemsHomePage.headerProfile.first()).toBeVisible();
});

test('should be visible piece of current address on tooltip', async () => {
  const addressPiece = address.slice(0, -43);

  await getGemsHomePage.bringToFront();
  await getGemsHomePage.header().openTooltip();
  await test.expect(getGemsHomePage.header().tooltipUserName.first()).toContainText(addressPiece);
});    

test('wallet balance should displayed correctly', async () => {
  const balance = await tonWalletPage.getBalance();
  await getGemsHomePage.header().openTooltip();
  await test.expect(getGemsHomePage.header().cryptoPriceAmount.first()).toContainText(balance);
});  
    
test('link to create single NFT should works', async () => {
  await getGemsHomePage.bringToFront();
  await getGemsHomePage.header().selectNFTBtn.hover();
  await getGemsHomePage.page.getByRole('link', { name: 'Single NFT' }).click();
  await test.expect(getGemsHomePage.page).toHaveURL('https://testnet.getgems.io/nft/create?nft_type=single_nft');
});   

test('should upload files', async () => {
  const waitForUploadMediaReq = createNftPage.page.waitForRequest(url => url.url().includes('api.testnet.getgems.io/upload-media?type=Nft&sign='));

  await createNftPage.mainNftPageCreate().mintNftForm().uploadFiles('image.jpeg');
  const request = await waitForUploadMediaReq;
  const response = await request.response();
  
  await test.expect(response?.ok()).toBeTruthy();
  const json: UploadMediaResponse = await response?.json();
  await test.expect(json).toHaveProperty('fileUrl');
});

test('should create single nft', async () => {
  await test.step('Fill fields', async () => {
    await createNftPage.mainNftPageCreate().mintNftForm().fillCommonRightsFields('Test name', 'Test description');
  });
  
  await test.step('should open modal by submitting form', async () => {
    await createNftPage.mainNftPageCreate().mintNftForm().submitForm();
    await test.expect(createNftPage.modalRoot().modalSingleNftWarning).toBeVisible();
  });

  await test.step('click on "Create Single NFT" button', async () => {
    await tonWalletPage.bringToFront();
    await tonWalletPage.page.reload();

    await createNftPage.bringToFront();
    const waitForCreateNftDraftResultReq = createNftPage.page.waitForRequest(url => url.url().includes('api.testnet.getgems.io/graphql'));
    await createNftPage.modalRoot().createSingleNft();
    const request = await waitForCreateNftDraftResultReq;
    await test.expect(createNftPage.modalRoot().modalDeployStatus).toBeVisible();
    const response = await request.response();
    await test.expect(response?.ok()).toBeTruthy();

    const resolvedJson: CreateNftDraftResultResponse = await response?.json();
    nftContractAddress = resolvedJson.data.nft.alphaDeployInfo.contractAddress;
  });

  await test.step('should be visible confirm popup on TON Wallet', async () =>{
    await tonWalletPage.bringToFront();
    await test.expect(tonWalletPage.sendConfirmPopup).toBeVisible();    
  });

  await test.step('confirm transaction', async () => {
    const waitTonTxCheckStatus = createNftPage.page.waitForRequest(url => url.url().includes('api.testnet.getgems.io/graphql'));
    await tonWalletPage.sendConfirmOkBtn.click();
    await tonWalletPage.signConfirm();
    const request = await waitTonTxCheckStatus;
    const response = await request.response();
    await test.expect(tonWalletPage.processingPopup).toBeVisible();
    await test.expect(response?.ok()).toBeTruthy();
  });  

  await test.step('go to user page', async () => {
    await createNftPage.bringToFront();
    await createNftPage.header().openTooltip();
    await createNftPage.header().gotoUserPage();
    await test.expect(createNftPage.page).toHaveURL(`https://testnet.getgems.io/user/${address}`);
  });
  
  await test.step('go to nft page', async () => {
    const title = await userPage.nftPreviewTitle.filter({ hasText: 'Test name' });
    await test.expect(title).toBeVisible();
    
    await title.click();
    await test.expect(userPage.page).toHaveURL(`https://testnet.getgems.io/nft/${nftContractAddress}`);
  });  
});
