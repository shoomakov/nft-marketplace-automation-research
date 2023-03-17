abstract class EnvProperties {
  mainMnemonic: string;
  password: string;
  mainAddress: string;
  transactionCost: string;    
}

export class SharedProperties {
  private static instance: SharedProperties;
  generatedMnemonic: string;
  mainMnemonic: string;
  password: string;
  createdAddress: string | null;
  mainAddress: string | null;
  transactionCost: string;

  private constructor() {
    this.mainMnemonic = process.env.MAIN_MNEMONIC || '';
    this.password = process.env.EXTENSION_PASSWORD || '';
    this.createdAddress = null;
    this.mainAddress = process.env.MAIN_ADDRESS || '';
    this.transactionCost = process.env.TRANSACTION_COST || '';
  }

  static getInstance(): SharedProperties {
    if (!SharedProperties.instance) {
      SharedProperties.instance = new SharedProperties();
    }

    return SharedProperties.instance;
  }

  setCreatedAddress(address: string) {
    this.createdAddress = address;
  }

  setMainAddress(address: string) {
    this.mainAddress = address;
  }

  setGeneratedMnemonic(words: string) {
    this.generatedMnemonic = words;
  }
}

const sharedProperties = SharedProperties.getInstance();

export { sharedProperties };
