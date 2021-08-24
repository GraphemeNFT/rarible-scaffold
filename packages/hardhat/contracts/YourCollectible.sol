pragma solidity 0.7.5;
//  pragma solidity ^0.8.0;
// pragma abicoder v2;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract YourCollectible is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string customBaseUri = "http://website.com/id/";
    mapping(uint256 => ItemDetail) private _items;
    mapping(uint256 => ItemPosition[]) private _itemPositions;

    struct ItemDetail {
        bool isPrimitive;
        uint256 identifier;
    }

    struct ItemPosition {
        uint256 tokenId;
        uint256 row;
        uint256 column;
    }

    constructor() public ERC721("YourCollectible", "YCB") {
        _setBaseURI("https://ipfs.io/ipfs/");
    }

    function mintItem(address to, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        _setTokenURI(id, tokenURI);

        return id;
    }

    function mintCharacterToken(address to, uint256 identifier)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        _setTokenURI(
            id,
            string(abi.encodePacked(customBaseUri, Strings.toString(id)))
        );
        _items[id] = ItemDetail({isPrimitive: true, identifier: identifier});
        return id;
    }

    /*
    // Fails as it will not accept struct[] as argument. Need to figure how to set this.
    function mintComplexCharacterToken(
        address to,
        ItemPosition[] memory itemPositions
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        _setTokenURI(
            id,
            string(abi.encodePacked(customBaseUri, Strings.toString(id)))
        );
        _items[id] = ItemDetail({isPrimitive: false, identifier: _identifier});
        _itemPositions[id] = itemPositions;
        return id;
    }
    */

    function getLetterDNA(uint256 tokenId) public view returns (uint256) {
        return _items[tokenId].identifier;
    }

    function rollDiceToMint(address to) public payable {
        // should mint 'n' tokens.
        // should some funds go to DAO/Owner as creation fee??
        uint256 i = 0;
        uint256 prc = getRandomness();
        for (i = 0; i <= 5; i++) {
            //  uint random = uint(keccak256(prc + i));
            uint256 random = uint256(prc);
            mintCharacterToken(to, random);
        }
    }

    function getRandomness() private returns (uint256) {
        // do this as a temp measure. Investigate VRF options
        return uint256(blockhash(block.number));
    }
}
