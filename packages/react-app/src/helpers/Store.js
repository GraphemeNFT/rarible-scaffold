import create from 'zustand'

// state and store
const useStore = create(set => ({
    letters: [],
    wallet: null,
    balance: 0,
    name: '',
    contractAddress: '0x1725eab2faa1e9b97487b818318ba2310334e029',
    raribleHome: '',
    // claimedLetters: letters.

    setWallet: (wallet) => set({ wallet }),
    setBalance: (balance) => set({ balance }),
    setName: (name) => set({ name }),
    setLetters: (letters) => set({ letters }),
    setContractAddress: (contractAddress) => set({ contractAddress }),
    setRaribleHome: (raribleHome) => set({ raribleHome }),

    // getLetterByTokenId: (state, tokenId) => {
    //     if (state.letters) {
    //         return state.letters.find(letter => letter.tokenId === tokenId)
    //     }
    // }

}))

// const letters = useStore(state => state.letters);
// const claimedLetters = letters.filter(l => l.info.isPrimitive && l.info.isClaimed)


export {
    useStore,
    // claimedLetters, letters
}
