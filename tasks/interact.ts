import { task } from "hardhat/config";

const contractAddress = "0x57C171B1709ff2bbda5D3c32A53691Ce3668c314";

task("mint", "Mints from the NFT contract")
.addParam("address", "The address to receive a token")
.setAction(async function ({ address }, { ethers }) {
    const NFT = await ethers.getContractAt("NFT", contractAddress);
    const transactionResponse = await NFT.mintTo(address, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
.addParam("baseUrl", "The base of the tokenURI endpoint to set")
.setAction(async function (taskArguments, { ethers }) {
    const contract = await ethers.getContractAt("NFT", contractAddress);
    const transactionResponse = await contract.setBaseTokenURI(taskArguments.baseUrl, {
        gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
});


task("token-uri", "Fetches the token metadata for the given token ID")
.addParam("tokenId", "The tokenID to fetch metadata for")
.setAction(async function (taskArguments, { ethers }) {
    const contract = await ethers.getContractAt("NFT", contractAddress);
    const response = await contract.tokenURI(taskArguments.tokenId, {
        gasLimit: 500_000,
    });
    
    const metadata_url = response;
    console.log(`Metadata URL: ${metadata_url}`);

    const metadata = await fetch(metadata_url).then(res => res.json());
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
});