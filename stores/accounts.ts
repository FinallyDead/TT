import { defineStore } from 'pinia'

interface StoreType {
  accounts: Ref<Account[]>
  addAccount: (Account: Account) => void
  removeAccount: (Account: Account) => void
  setAccounts: (newAccounts: Account[]) => void
}

export const useAccountStore = defineStore('accountsStore', (): StoreType => {
  const accounts = ref<Account[]>([])

  function addAccount(account: Account): void {
    accounts.value.push(account)
  }

  function setAccounts(newAccounts: Account[]): void {
    accounts.value = [...newAccounts]
  }

  function removeAccount(account: Account): void {
    const index = accounts.value.indexOf(account)
    accounts.value.splice(index, 1)
  }

  return { accounts, addAccount, removeAccount, setAccounts }
}, { persist: true })
