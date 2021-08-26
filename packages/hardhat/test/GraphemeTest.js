const { ethers } = require("hardhat");
const { use, expect, assert } = require("chai");
const { solidity } = require("ethereum-waffle");

use(solidity);

describe("Grapheme Tests", function () {

    let Grapheme;
    let graphemeInstance;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    describe("Contact stuff", function () {
        it("should deploy contract", async function () {
            const Grapheme = await ethers.getContractFactory("Grapheme");
            graphemeInstance = await Grapheme.deploy();
            [owner, addr1, addr2, _] = await ethers.getSigners();
        });
    });

    describe("Minting", function () {
        describe("rollToMint", function () {
            let n = 6;
            it("Should mint 'n' tokens", async function () {
                // console.log(owner);
                expect(await graphemeInstance.balanceOf(addr1.address)).to.equal(0);
                let receipt = await graphemeInstance.rollToMint(addr1.address);
                // console.log(receipt);
                expect(await graphemeInstance.balanceOf(addr1.address)).to.equal(6);

                for (let i = 1; i <= n; i++) {
                    // console.log(await graphemeInstance.getDna(i));
                    expect(await graphemeInstance.getDna(i)).to.not.equal(0);
                }

            });

            it("Should have dna not equal to 0", async function () {
                for (let i = 1; i <= n; i++) {
                    // console.log(await graphemeInstance.getDna(i));
                    expect(await graphemeInstance.getDna(i)).to.not.equal(0);
                }
            });

            it("Should not have repetitive dna", async function () {
                let dna = await graphemeInstance.getDna(1);
                let copyDna = await graphemeInstance.getDna(1);
                expect(dna).to.equal(copyDna);

                let arr = [];
                for (let i = 1; i <= n; i++) {
                    dna = await graphemeInstance.getDna(i);

                    expect(arr.includes(dna)).to.be.false;
                    arr.push(await graphemeInstance.getDna(i));
                }
            });

            it("Should not have claimed tokens", async function () {
                for (let i = 1; i <= n; i++) {
                    // console.log(await graphemeInstance.getDna(i));
                    expect(await graphemeInstance.isClaimed(i)).to.be.false;
                }
            });

            it("Should emit relevant events", async function () {
                await expect(graphemeInstance.rollToMint(addr2.address))
                    .to.emit(graphemeInstance, 'Transfer')
                    .withArgs(function () {}, addr2.address, 7)
                    .withArgs(function () {}, addr2.address, 8)
                    .withArgs(function () {}, addr2.address, 9)
                    .withArgs(function () {}, addr2.address, 10)
                    .withArgs(function () {}, addr2.address, 11)
                    .withArgs(function () {}, addr2.address, 12)
                    .to.emit(graphemeInstance, 'Roll')
                    .withArgs(addr2.address, function () {});
            });

        });

    });


    describe("Claiming", function () {
        it("Token owner should able to claim a minted token", async function () {
            expect(await graphemeInstance.isClaimed(1)).to.be.false;
            await graphemeInstance.connect(addr1).claimToken(1, 'testUri1');
            expect(await graphemeInstance.isClaimed(1)).to.be.true;
            expect(await graphemeInstance.tokenURI(1)).to.contain('testUri1');
        });
    });
    
});
