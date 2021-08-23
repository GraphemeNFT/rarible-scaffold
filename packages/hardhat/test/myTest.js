const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("YourCollectible", function () {

  describe("YourCollectible", function () {
    it("Should deploy contract", async function () {
      const YourCollectible = await ethers.getContractFactory("YourCollectible");
      yourCollectible = await YourCollectible.deploy();
      [owner, addr1, addr2, _] = await ethers.getSigners();
    });

    describe("mint()", function () {
      it("Should be able to set a mint", async function () {
        // console.log(owner);
        let receipt = await yourCollectible.mintItem(owner.address, "testuri");
        let tokenId = receipt.value.toNumber();
        expect((await yourCollectible.balanceOf(owner.address)).toNumber()).to.equal(1);
        expect(await yourCollectible.ownerOf(1)).to.equal(owner.address);
      });
    });

    describe("assignChildren()", function () {
      it("Should be able to assign children", async function () {
        let children = [2, 3, 4];
        let receipt = await yourCollectible.assignChildren(1, children);

        let result = await yourCollectible.getChildren(1);

        for (var i = 0; i < children.length; i++) {
          expect(children[i]).to.equal(result[i].toNumber());
        }
      });
    });

  });
});
