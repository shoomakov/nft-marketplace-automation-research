export interface UserBalanceResponse {
  data: Data
}

export interface Data {
  userBalance: UserBalance
}

export interface UserBalance {
  value: string
  __typename: string
}
