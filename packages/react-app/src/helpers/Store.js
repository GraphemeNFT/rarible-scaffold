import create from 'zustand'

// state and store
const useStore = create(set => ({
    letters: [],
    wallet: null,
    balance: 0,
    name: '',

    setWallet: (wallet) => set({ wallet }),
    setBalance: (balance) => set({ balance }),
    setName: (name) => set({ name }),
    setLetters: (letters) => set({ letters }),
}))

export default useStore
