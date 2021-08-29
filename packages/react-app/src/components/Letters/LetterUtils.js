const { BufferList } = require("bl");

const ipfsAPI = require("ipfs-http-client");
const ipfs = ipfsAPI({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

const LetterUtils = {

    async getMetadata (tokenId, letterContract, setter) {

        const tokenURI = await letterContract.tokenURI(tokenId);

        if (tokenURI.length < 25) {
            console.warn('no ipfsHash for tokenId:', tokenId, '=>', tokenURI);
            return {}
        }

        console.log('getMetaData:', { tokenId, tokenURI });

        let metadata = {}
        try {
            const jsonManifestBuffer = await LetterUtils.getFromIPFS(tokenId);
            metadata = JSON.parse(jsonManifestBuffer.toString());
        } catch (e) {
            console.log('parseManifest error', e);
        }
        console.log("metadata", metadata);
        setter(metadata);
        return metadata
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