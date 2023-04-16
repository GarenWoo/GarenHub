# 第四周第一次课第 2 个作业
![w4-1-2](./IMG/Assignment_w4-1-2.png)

## 前置条件与工作
   之前已完成 w3-1-2 作业：已部署的三个合约 ERC20 token(GTT), ERC721 token 和 NFTMarket。<br>
   
ERC20TokenGTT: https://goerli.etherscan.io/address/0xf29da8b25afa9db70542416e948597a0be57ec23#code

ERC721Token: https://goerli.etherscan.io/address/0x892802283c1ec35f5327065edcd7db3d6ad17628#code

NFTMarket: https://goerli.etherscan.io/address/0x6315e37AaE5D61F5a2e0dAe3423B46BF1bE9677b#

在ERC721 token转账前：<br>
1). 让购买者账户拥有足够金额的 ERC20 token(GTT)，用于调用 NFTMarmket 合约购买 ERC721 token。<br>
2). 购买者账户为 NFTMarket 合约地址授权足够的  ERC20 token(GTT)。<br>
3). ERC721 token 的持有者授权 NFTMarket 合约地址作为待转账 ERC721 token 的 operator。<br>
<br>
## ERC721 token 转账
   本次作业用到的 ERC721 token 为新 mint 的 NFT(Garen's Collection, #2)。在合约 NFTMarket 中进行转账，使用 GTT 作为交易 token。<br>
      
   NFT(Garen's Collection, #2):<br>
   metadata: ipfs://QmYZTLMirkutn3WmGT7vcCaCMaScYXrdhh5jng3z9tqYdz<br>
   https://testnets.opensea.io/assets/goerli/0x892802283c1ec35f5327065edcd7db3d6ad17628/2<br>
   ![w4-1-2](./IMG/1_mintNFT.png)<br>
   ![w4-1-2](./IMG/3_NFT_OpenSea.png)



----------------------------- 正在完成中，预计 4.14 完成该作业 -----------------------------
