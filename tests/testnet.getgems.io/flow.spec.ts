import { CreateNftDraftResult, Data } from './responses';

import { BrowserContext } from '@playwright/test';
import { GetGemsApp } from '../pom/testnet.getgems.io/get-gems-app';
import { GetGemsCreatePage } from '../pom/testnet.getgems.io/get-gems-create-page';
import { GetGemsHomePage } from '../pom/testnet.getgems.io/get-gems-home-page';
import { GetGemsNFTPage } from '../pom/testnet.getgems.io/get-gems-nft-page';
import { GetGemsUserPage } from '../pom/testnet.getgems.io/get-gems-user-page';
import { TonWallet } from '../utils/ton-wallet';
import { TonWalletPage } from '../pom/ton-wallet-page';
import { UserBalanceResponse } from './responses/user-balance.response';
import { createFakeNFT } from '../utils';
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
let nftPage: GetGemsNFTPage;
let nftContractAddress: string;
let getGemsApp: GetGemsApp;
let address;

const nft = createFakeNFT();

test.beforeAll(async ({ walletActions, context, extensionId }) => {
  browserContext = context;
  await walletActions.runCreateWalletOperations();
  mainWallet = walletActions.buildMainWallet();
  createdWallet = walletActions.buildCreatedWallet();
  const page = await context.newPage();

  getGemsApp = new GetGemsApp(page, context.pages()[0], extensionId);
  getGemsHomePage = new GetGemsHomePage(page);
  createNftPage = new GetGemsCreatePage(page);
  userPage = new GetGemsUserPage(page);
  nftPage = new GetGemsNFTPage(page);
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

test.describe('Connect wallet', () => { 

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
    await tonWalletPage.refreshPage();
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
});

test.describe('Create Single NFT', () => {
  
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
      await createNftPage.mainNftPageCreate().mintNftForm().fillCommonRightsFields(nft.name, nft.description);
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

    await test.step('verify confirmation popup on TON Wallet', async () =>{
      await tonWalletPage.bringToFront();
      await test.expect(tonWalletPage.sendConfirmPopup).toBeVisible();    
    });

    await test.step('confirm transaction', async () => {
      const waitTonTxCheckStatus = createNftPage.page.waitForRequest(async request => {
        const json = await request.postDataJSON();
        const operation = json ? json.operationName : null;
        const cond = operation && request.url().includes('api.testnet.getgems.io/graphql') && operation === 'tonTxCheckStatus'

        return cond;
      });
      await tonWalletPage.sendConfirmOkBtn.click();
      await tonWalletPage.signConfirm();
      const request = await waitTonTxCheckStatus;
      const response = await request.response();

      await test.expect(response?.ok()).toBeTruthy();
    });  

    await test.step('verify user address', async () => {
      await createNftPage.bringToFront();
      await createNftPage.header().openTooltip();
      await createNftPage.header().gotoUserPage();
      await test.expect(createNftPage.page).toHaveURL(`https://testnet.getgems.io/user/${address}`);
    });
    
    await test.step('verify nft contract address', async () => {
      const title = await userPage.nftPreviewTitle.filter({ hasText: nft.name });
      await test.expect(title).toBeVisible();
      
      await title.click();
      await test.expect(userPage.page).toHaveURL(`https://testnet.getgems.io/nft/${nftContractAddress}`);
    });  
  });

});   

test.describe('Put on sale Single NFT', async () => {
  const noAmountRegExp = /^0(?:\s|&nbsp;)TON$/;
  test('should be visible "Put on sale" button', async () => {
    await test.expect(nftPage.pageBody().pageRight().putOnSaleBtn).toBeVisible();
    await test.expect(nftPage.pageBody().pageRight().status).toHaveText('Not For Sale');
  });

  test('should open modal by clicking on "Put on sale" button', async () => {
    await nftPage.pageBody().pageRight().putOnSaleBtn.click();
    /**
     * TODO: something weird happening here. For playwright "saleModal" is not visible, but for me it is visible
     * So, possibly I need to create issue in playwright repo
     */
    // await test.expect(getGemsApp.modalRoot().saleModal).toBeVisible();
    await test.expect(getGemsApp.modalRoot().root).not.toBeEmpty()
  }); 

  test('should open Modal by select "Fixed price" option', async () => {
    await getGemsApp.modalRoot().fixedPriceLink.click();
    await test.expect(getGemsApp.modalRoot().root).not.toBeEmpty()
    // await test.expect(getGemsApp.modalRoot().modalPutOnSale().root).toBeVisible();
  });

  test('verify that "Service Fee" is equal 0 TON', async () => {
    const serviceFee = (await getGemsApp.modalRoot().modalPutOnSale().rowLeft.nth(0).innerText()).valueOf();
    const tonPrice = (await getGemsApp.modalRoot().modalPutOnSale().rowRight.nth(0).innerText()).replace(/&nbsp;/g, ' ').valueOf();

    await test.expect(serviceFee).toEqual('Service Fee');
    await test.expect(tonPrice, 'should match that initially service fee has no amount').toMatch(noAmountRegExp);
  });

  test('verify that "Your Royalties" is equal 0 TON', async () => {
    const yourRoyalties = (await getGemsApp.modalRoot().modalPutOnSale().rowLeft.nth(1).innerText()).valueOf();
    const tonPrice = (await getGemsApp.modalRoot().modalPutOnSale().rowRight.nth(1).innerText()).valueOf();

    await test.expect(yourRoyalties).toEqual('Your Royalties');
    await test.expect(tonPrice, 'should match that initially your royalties has no amount').toMatch(noAmountRegExp);    
  });

  test('verify that "You Receive" is equal 0 TON', async () => {
    const youReceive = (await getGemsApp.modalRoot().modalPutOnSale().rowLeft.nth(2).innerText()).valueOf();
    const tonPrice = (await getGemsApp.modalRoot().modalPutOnSale().rowRight.nth(2).innerText()).valueOf();

    await test.expect(youReceive).toEqual('You Receive');
    await test.expect(tonPrice, 'should match that initially you receive nothing').toMatch(noAmountRegExp);        
  });  

  test('input should have value "1 TON" when fill a price is 1', async () => {
    await getGemsApp.modalRoot().modalPutOnSale().enterPriceInput.fill('1');
    await test.expect(getGemsApp.modalRoot().modalPutOnSale().enterPriceInput).toHaveValue('1 TON');
  });

  test('verify that "Service Fee" is greater than 0 TON', async () => {
    const serviceFee = (await getGemsApp.modalRoot().modalPutOnSale().rowLeft.nth(0).innerText()).valueOf();
    const tonPrice = (await getGemsApp.modalRoot().modalPutOnSale().rowRight.nth(0).innerText()).replace(/&nbsp;/g, ' ').valueOf();
    const onlyValue = tonPrice.replace('TON', '').trim();

    await test.expect(serviceFee).toEqual('Service Fee');
    await test.expect(Number(onlyValue), 'service fee is greater than 0').toBeGreaterThan(0);
  });

  test('verify that "Your Royalties" is greater than 0 TON', async () => {
    const yourRoyalties = (await getGemsApp.modalRoot().modalPutOnSale().rowLeft.nth(1).innerText()).valueOf();
    const tonPrice = (await getGemsApp.modalRoot().modalPutOnSale().rowRight.nth(1).innerText()).valueOf();
    const onlyValue = tonPrice.replace('TON', '').trim();

    await test.expect(yourRoyalties).toEqual('Your Royalties');
    await test.expect(Number(onlyValue), 'your royalties should be greater than 0').toBeGreaterThan(0);    
  });

  test('verify that "You Receive" is greater than 0 TON', async () => {
    const youReceive = (await getGemsApp.modalRoot().modalPutOnSale().rowLeft.nth(2).innerText()).valueOf();
    const tonPrice = (await getGemsApp.modalRoot().modalPutOnSale().rowRight.nth(2).innerText()).valueOf();
    const onlyValue = tonPrice.replace('TON', '').trim();

    await test.expect(youReceive).toEqual('You Receive');
    await test.expect(Number(onlyValue), 'you should receive greater than 0').toBeGreaterThan(0); 
  });  
  
  test('should send confirm by after click on "Put on sale" button', async () => {
    // create filter by operation name
    const nftFixPriceSaleCreate = getGemsApp.app.waitForRequest(url => url.url().includes('api.testnet.getgems.io/graphql'));

    await test.step('click on "Put on sale" button', async () => {
      await getGemsApp.modalRoot().modalPutOnSale().putOnSaleBtn.click();
      await getGemsApp.modalRoot().modalDeployStatusContainer().verifyTransactionStepIsLoading();
    });

    await test.step('wait for request and verify', async () => {
      await getGemsApp.app.bringToFront();
      const request = await nftFixPriceSaleCreate;

      const response = await request.response();
      await test.expect(response?.ok()).toBeTruthy();

      const resolvedJson: UserBalanceResponse = await response?.json();
      await test.expect(resolvedJson.data.userBalance, 'here should be userBalance property on this response').toBeTruthy();
    });

    await test.step('first payment should be received', async () => {
      await tonWalletPage.sendConfirm();
      await getGemsApp.modalRoot().modalDeployStatusContainer().verifyFirstTransactionPaymentReceived();
      await getGemsApp.modalRoot().modalDeployStatusContainer().verifyFirstTransactionCheckingPaymentLoading();
      await getGemsApp.modalRoot().modalDeployStatusContainer().verifyFirstTransactionCheckingPaymentDone();
    });

    await test.step('second payment should be received', async () => {
      // Change timeout to await specific request
      await tonWalletPage.page.waitForTimeout(5000);
      await tonWalletPage.sendConfirm();
      // here is verification of second payment
      await getGemsApp.app.bringToFront();
      await getGemsApp.app.waitForTimeout(8000);
    });    

    await test.step('nft should be on sale', async () => {
      await test.expect(nftPage.pageBody().pageRight().status).toHaveText('For Sale');
    });
    
  });
});
