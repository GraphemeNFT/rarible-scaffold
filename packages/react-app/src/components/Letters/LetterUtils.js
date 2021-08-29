const { BufferList } = require("bl");

const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

const LetterUtils = {

    async getMetadata (tokenId, letterContract, setter) {

        const tokenURI = await letterContract.tokenURI(tokenId);
        // debugger

        if (tokenURI.length < 25) {
            console.warn('no ipfsHash for tokenId:', tokenId, '=>', tokenURI);
            return {}
        }

        console.log('getMetaData:', { tokenId, tokenURI });

        let metadata = {}
        try {
            const jsonManifestBuffer = await LetterUtils.getFromIPFS(tokenURI);
            metadata = JSON.parse(jsonManifestBuffer.toString());
        } catch (e) {
            console.log('parseManifest error', e);
        }
        console.log("set metadata", tokenId, '=>', metadata);
        if (setter) { setter(metadata); }
        return metadata
    },

    async getInfo (tokenId, letterContract) {
        const info = await letterContract.getInfo(tokenId);
        // returns an array of dna, isClaimed
        const [dna,
            isClaimed,
            tokenUri,
            owner,
            isPrimitive] = info

        // const [dnaObj, isClaimed] = info
        const hex = dna.toHexString()
        const sig = LetterUtils.calcDna(hex)
        const result = {
            isClaimed,
            owner,
            isPrimitive,
            ...sig
        }
        return result

        // setItemSig(sig)
        // setClaimed(isClaimed)
        // makeGrid(sig)
        // setReady(true)
    },

    calcDna (hex) {
        const firstHex = hex.slice(2, 10) // 8 numbers max?
        const num = parseInt(firstHex, 16)  // eg 6016001671988620
        const digits = num.toString().split('').slice(0, 8) // first 8 digits
        const dna = digits.map(digit => parseInt(digit))
        const result = { hex, dna, firstHex, digits }
        // console.log('calcDna', firstHex, dna)
        return result
    },

    // helper function to "Get" from IPFS
    // you usually go content.toString() after this...
    async getFromIPFS (tokenURI) {
        const ipfsHash = tokenURI.replace("https://ipfs.io/ipfs/", "");

        for await (const file of ipfs.get(ipfsHash)) {
            console.log(file.path);
            if (!file.content) continue;
            const content = new BufferList();
            for await (const chunk of file.content) {
                content.append(chunk);
            }
            console.log(content);
            return content;
        }
    }

};

export default LetterUtils;