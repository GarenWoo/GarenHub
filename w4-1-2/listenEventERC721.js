const { ethers } = require("ethers");

const ERC721TokenAbi = require(`./deployments/abi/ERC721Token.json`)
const ER721TokenDev = require(`./deployments/dev/ERC721Token.json`)

async function parseTransferEvent(event) {
    const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from, address indexed to, uint256 tokenId)"]);
    let decodedData = TransferEvent.parseLog(event);
    console.log("from:" + decodedData.args.from);
    console.log("to:" + decodedData.args.to);
    console.log("tokenId:" + decodedData.args.tokenId.toString());
    console.log("event signature: " + event.topics[0]);
    console.log("event data: " + event.data);

}

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
    let ERC721TokenContract = new ethers.Contract(ER721TokenDev.address, ERC721TokenAbi, provider);
    let filter = ERC721TokenContract.filters.Transfer();

    //In fact, transactions occured in the range of 8837212~8837306, which is obtained on Goerli etherscan.
    filter.fromBlock = 8837200;
    filter.toBlock = 8837400;

    let events = await provider.getLogs(filter);
    for (let i = 0; i < events.length; i++) {
        console.log(events[i]);
        parseTransferEvent(events[i]);
    }
}

main()