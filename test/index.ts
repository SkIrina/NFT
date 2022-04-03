import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { NFT, NFT__factory } from "../typechain";

describe("My awesome NFT contract", function () {
  let NFT: NFT__factory;
  let nft: NFT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  const baseURI = "https://bafybeiacwm7gbjuwvr3t45sh7kp4mi2cr3qvcmift5qeiufjhxgylcn7ye.ipfs.dweb.link/metadata/";


  beforeEach(async function () {
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    // 4 images and metadata exist for the collection
    await nft.setBaseTokenURI(baseURI);
    // 2 tokens minted id=1, id=2
    await nft.mintTo(owner.address);
    await nft.mintTo(owner.address);
  });

  describe("constructor, symbol, name", function () {
    it("Should set correct name and symbol on construction", async function () {

      const symbol = await nft.symbol();
      expect(symbol).to.equal("NFT");
      const name = await nft.name();
      expect(name).to.equal("NFTTutorial");
    });
  });

  describe("ownerOf", function () {
    it("Should correctly get owner of specifies token", async function () {
      const addressOwner = await nft.ownerOf(1);
      expect(addressOwner).to.equal(owner.address);
    });

    it("Should be reverted for non-existent token id", async function () {
      await expect(nft.ownerOf(10)).to.be.reverted;
    });

    it("Should be reverted for not minted tokens", async function () {
      await expect(nft.ownerOf(3)).to.be.reverted;
    });
  });

  describe("balanceOf", function () {
    it("Should correctly get balance", async function () {
      const balance = await nft.balanceOf(owner.address);
      expect(balance).to.equal(2);

      const balance1 = await nft.balanceOf(addr1.address);
      expect(balance1).to.equal(0);
    });
  });

  describe("tokenURI", function () {
    it("Should correctly get tokenURI", async function () {
      const uri = await nft.tokenURI(1);
      expect(uri).to.equal(baseURI + "1");
    });
  });

  describe("approve, getApproved", function () {
    it("Should let owner of the token approve transfer", async function () {
      await nft.approve(addr1.address, 1);
      const approvedAddress = await nft.getApproved(1);
      expect(approvedAddress).to.equal(addr1.address);
    });

    it("Should be reverted if sender doesn't own the token", async function () {
      await expect(nft.connect(addr2).approve(addr1.address, 1)).to.be.reverted;
    });

    it("Should be reverted for for non-existent token id", async function () {
      await expect(nft.approve(addr1.address, 10)).to.be.reverted;
    });
  });

  describe("setApprovalForAll, isApprovedForAll", function () {
    it("Should let owner of the token set approval for all tokens for some address ", async function () {
      await nft.connect(addr2).setApprovalForAll(addr1.address, true);
      const isApprovedForAll = await nft.isApprovedForAll(addr2.address, addr1.address);
      expect(isApprovedForAll).to.equal(true);
    });

    it("Should let owner of the token remove approval for all tokens for some address ", async function () {
      await nft.connect(addr2).setApprovalForAll(addr1.address, false);
      const isApprovedForAll = await nft.isApprovedForAll(addr2.address, addr1.address);
      expect(isApprovedForAll).to.equal(false);
    });

    it("Should not let operator be the caller", async function () {
      await expect(nft.setApprovalForAll(owner.address, true)).to.be.reverted;
    });

    it("Should emit ApprovalForAll event", async function () {
      const approveAll = await nft.connect(addr2).setApprovalForAll(addr1.address, true);
      expect(approveAll).to.emit(nft, "ApprovalForAll")
      .withArgs(addr2.address, addr1.address, true);
    });
  });

  describe("transferFrom", function () {
    it("Should let owner of the token transfer it to another address", async function () {
      await nft.transferFrom(owner.address, addr1.address, 1);
      const owner1 = await nft.ownerOf(1);
      expect(owner1).to.equal(addr1.address);
    });

    it("Should let non-owner of the token transfer token if it was approved", async function () {
      await nft.approve(addr1.address, 1);
      await nft.connect(addr1).transferFrom(owner.address, addr1.address, 1);
      const owner1 = await nft.ownerOf(1);
      expect(owner1).to.equal(addr1.address);
    });

    it("Should let non-owner of the token transfer token if it was approvedAll", async function () {
      await nft.setApprovalForAll(addr1.address, true);
      await nft.connect(addr1).transferFrom(owner.address, addr1.address, 1);
      const owner1 = await nft.ownerOf(1);
      expect(owner1).to.equal(addr1.address);
    });

    it("Should not let from or to be zero address", async function () {
      await expect(nft.transferFrom("0x0", addr1.address, 1)).to.be.reverted;
      await expect(nft.transferFrom(owner.address, "0x0", 1)).to.be.reverted;
    });

    it("Should not let transfer token which sender doesn't own", async function () {
      await expect(nft.transferFrom(owner.address, addr1.address, 3)).to.be.reverted;
    });

    it("Should emit ApprovalForAll event", async function () {
      expect(nft.transferFrom(owner.address, addr1.address, 1)).to.emit(nft, "Transfer")
        .withArgs(owner.address, addr1.address, 1);
    });
  });
});