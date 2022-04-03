# NFT
 
Contract is deployed at 0x57C171B1709ff2bbda5D3c32A53691Ce3668c314

Images address is "https://bafybeibxiaykx3x4riib7wvydkzrtbnwyvy46swnopdsrnqq6outrchwra.ipfs.dweb.link/images/{id}.jpg"
where _id_ is 1-4

Metadata is at "https://bafybeiacwm7gbjuwvr3t45sh7kp4mi2cr3qvcmift5qeiufjhxgylcn7ye.ipfs.dweb.link/metadata/{id}"
where _id_ is 1-4

Image displayed on Opensea:
https://testnets.opensea.io/assets/0x57c171b1709ff2bbda5d3c32a53691ce3668c314/3
Seems like only images of 350 x 350 px are displayed properly...

```
npx hardhat compile
npx hardhat deploy
npx hardhat set-base-token-uri --base-url "https://bafybeiacwm7gbjuwvr3t45sh7kp4mi2cr3qvcmift5qeiufjhxgylcn7ye.ipfs.dweb.link/metadata/"
npx hardhat mint --address 0xAbF78864415e71466DBBB0Bef55ba98F22e468cA
```
