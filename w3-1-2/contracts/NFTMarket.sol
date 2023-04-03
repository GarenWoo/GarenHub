//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarket is IERC721Receiver {
    mapping(uint => uint) public price;
    mapping(address => uint) public income;
    mapping(uint => address) public realOwner;
    address public immutable tokenAddr;
    address public immutable nftAddr;
    error InvalidPrice();
    error NotOwner();
    error insufficientBidding();
    error NotOnSale();
    error withdrawalExceedIncome();

    constructor(address _tokenAddr, address _nftAddr) {
        tokenAddr = _tokenAddr;
        nftAddr = _nftAddr;
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
      return this.onERC721Received.selector;
    }

    function list(uint _tokenId, uint _price) external {
        if (msg.sender != IERC721(nftAddr).ownerOf(_tokenId)) revert NotOwner();
        if (_price == 0) revert InvalidPrice();
        // in order to realize the function of delist, set a mapping to record the real owner.
        // if not, the real owner cannot be captured by ownerOf() after the completion of list.
        realOwner[_tokenId] = msg.sender;
        IERC721(nftAddr).safeTransferFrom(msg.sender, address(this), _tokenId, "list success");
        price[_tokenId] = _price;
    }

    function delist(uint256 _tokenId) external {
        // only the real owner can delist the NFT.
        if (msg.sender != realOwner[_tokenId]) revert NotOwner();    
        if (IERC721(nftAddr).ownerOf(_tokenId) != address(this)) revert NotOnSale(); 
        IERC721(nftAddr).safeTransferFrom(address(this), msg.sender, _tokenId, "delist success");
        delete price[_tokenId];  
    }

    function buy(uint _tokenId, uint _bid) external {
        if (IERC721(nftAddr).ownerOf(_tokenId) != address(this)) revert NotOnSale(); 
        if (_bid < price[_tokenId]) revert insufficientBidding();
        bool _success = IERC20(tokenAddr).transferFrom(msg.sender, address(this), _bid);
        realOwner[_tokenId] = msg.sender;          // update the real owner when NFT was bought.
        if (_success) {
            income[IERC721(nftAddr).ownerOf(_tokenId)] += _bid;
        }
        IERC721(nftAddr).transferFrom(address(this), msg.sender, _tokenId);

    }

    function getPrice(uint _tokenId) external view returns (uint) {
        return price[_tokenId];
    }

    function getIncome() external view returns (uint) {
        return income[msg.sender];
    }

    function withdrawIncome(uint _value) external {
        if (_value > income[msg.sender]) revert withdrawalExceedIncome();
        IERC20(tokenAddr).transfer(msg.sender, _value);
        income[msg.sender] -= _value;
    }
}
