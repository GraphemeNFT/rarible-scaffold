
const zebra = {
    "description": "What is it so worried about?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/zebra.jpg",
    "name": "Zebra",
    "attributes": [
        {
            "trait_type": "BackgroundColor",
            "value": "blue"
        },
        {
            "trait_type": "Eyes",
            "value": "googly"
        },
        {
            "trait_type": "Stamina",
            "value": 38
        }
    ]
}
console.log("Uploading zebra...")
const uploadedzebra = await ipfs.add(JSON.stringify(zebra))

console.log("Minting zebra with IPFS hash (" + uploadedzebra.path + ")")
await yourCollectible.mintItem(toAddress, uploadedzebra.path, { gasLimit: 400000 })



await sleep(delayMS)


const rhino = {
    "description": "What a horn!",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/rhino.jpg",
    "name": "Rhino",
    "attributes": [
        {
            "trait_type": "BackgroundColor",
            "value": "pink"
        },
        {
            "trait_type": "Eyes",
            "value": "googly"
        },
        {
            "trait_type": "Stamina",
            "value": 22
        }
    ]
}
console.log("Uploading rhino...")
const uploadedrhino = await ipfs.add(JSON.stringify(rhino))

console.log("Minting rhino with IPFS hash (" + uploadedrhino.path + ")")
await yourCollectible.mintItem(toAddress, uploadedrhino.path, { gasLimit: 400000 })



await sleep(delayMS)


const fish = {
    "description": "Is that an underbyte?",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/fish.jpg",
    "name": "Fish",
    "attributes": [
        {
            "trait_type": "BackgroundColor",
            "value": "blue"
        },
        {
            "trait_type": "Eyes",
            "value": "googly"
        },
        {
            "trait_type": "Stamina",
            "value": 15
        }
    ]
}
console.log("Uploading fish...")
const uploadedfish = await ipfs.add(JSON.stringify(fish))

console.log("Minting fish with IPFS hash (" + uploadedfish.path + ")")
await yourCollectible.mintItem(toAddress, uploadedfish.path, { gasLimit: 400000 })



await sleep(delayMS)


const flamingo = {
    "description": "So delicate.",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/flamingo.jpg",
    "name": "Flamingo",
    "attributes": [
        {
            "trait_type": "BackgroundColor",
            "value": "black"
        },
        {
            "trait_type": "Eyes",
            "value": "googly"
        },
        {
            "trait_type": "Stamina",
            "value": 6
        }
    ]
}
console.log("Uploading flamingo...")
const uploadedflamingo = await ipfs.add(JSON.stringify(flamingo))

console.log("Minting flamingo with IPFS hash (" + uploadedflamingo.path + ")")
await yourCollectible.mintItem(toAddress, uploadedflamingo.path, { gasLimit: 400000 })





const godzilla = {
    "description": "Raaaar!",
    "external_url": "https://austingriffith.com/portfolio/paintings/",// <-- this can link to a page for the specific file too
    "image": "https://austingriffith.com/images/paintings/godzilla.jpg",
    "name": "Godzilla",
    "attributes": [
        {
            "trait_type": "BackgroundColor",
            "value": "orange"
        },
        {
            "trait_type": "Eyes",
            "value": "googly"
        },
        {
            "trait_type": "Stamina",
            "value": 99
        }
    ]
}
console.log("Uploading godzilla...")
const uploadedgodzilla = await ipfs.add(JSON.stringify(godzilla))

console.log("Minting godzilla with IPFS hash (" + uploadedgodzilla.path + ")")
await yourCollectible.mintItem(toAddress, uploadedgodzilla.path, { gasLimit: 400000 })


