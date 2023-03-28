export interface Data<T> {
  nft: T
}

export interface CreateNftDraftResult {
  nft: Nft
  deploy: Deploy
  alphaDeployInfo: AlphaDeployInfo
  tx: Tx
  __typename: string
}

export interface Nft {
  id: string
  index: number
  contentUri: string
  baseContentUri: any
  __typename: string
}

export interface Deploy {
  contractAddress: string
  stateInit: string
  recommendedValue: string
  messageBody: any
  __typename: string
}

export interface AlphaDeployInfo {
  __typename: string
  contractAddress: string
  recommendedValue: string
  stateInit: string
}

export interface Tx {
  deadlineTimestamp: number
  uuid: string
  tonkeeperLink: string
  to: string
  amount: string
  payload: any
  payloadType: string
  check: string
  stateInit: string
  context: any[]
  list: List[]
  __typename: string
}

export interface List {
  to: string
  amount: string
  payload: any
  payloadType: string
  check: string
  stateInit: string
  context: any[]
  __typename: string
}