export interface NftFixPriceSaleCreateResponse {
  data: Data
}

export interface Data {
  nftFixPriceSaleCreate: NftFixPriceSaleCreate
}

export interface NftFixPriceSaleCreate {
  deadlineTimestamp: number
  uuid: string
  tonkeeperLink: string
  to: string
  amount: string
  payload: string
  payloadType: string
  check: string
  stateInit: any
  context: Context[]
  list: List[]
  __typename: string
}

export interface Context {
  key: string
  value: string
  __typename: string
}

export interface List {
  to: string
  amount: string
  payload: string
  payloadType: string
  check: string
  stateInit: any
  context: ListContext[]
  __typename: string
}

export interface ListContext {
  key: string
  value: string
  __typename: string
}
