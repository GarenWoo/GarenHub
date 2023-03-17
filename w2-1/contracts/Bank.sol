//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Bank {
    mapping(address => uint256) public balance;
    bool private locked;

    constructor () payable {               
        locked = false;
    }

    modifier noReentrant() {            
        require(!locked, "Reentrant call detected");
        locked = true;
        _;
        locked = false;
    }

    function deposit() public payable {
        require(msg.value > 0, "value should be more than 0");
        balance[msg.sender] += msg.value;
    }

    // Check balance of the caller
    function checkBalance() public view returns (uint256) {
        return balance[msg.sender];
    }
    // Transfer money under safety
    function safeTransfer(address _to, uint256 _value) internal {
        require(_to != address(0), "Invalid address");                                  // check address invalidity
        require(_value > 0, "Value should be larger than 0");                           // check value of transfered money
        require(balance[msg.sender] >= _value, "Insufficient balance");                 // check if balance is enough
        balance[msg.sender] -= _value;
        (bool success,) = _to.call{value : _value}(new bytes(0));
        require(success, "transfer failed");
    }
    
    // withdraw money (custom value)
    function withdraw(uint256 _value) public noReentrant {
        safeTransfer(msg.sender, _value);
    }

    // withdraw all money in caller's account
    function withdrawAll() public noReentrant {
        safeTransfer(msg.sender, balance[msg.sender]);
        balance[msg.sender] = 0;
    }

}
contract Pay {
    constructor () payable {               

    }
    receive() external payable {
      
    }
    function pay(address _to, uint256 _value) payable public {
        (bool success,) = _to.call{value : _value}(new bytes(0));
        require(success, "transfer failed");
    }

    function withdraw(Bank b, uint256 _value) public  {
        b.withdraw( _value);
    }
    function withdrawall(Bank b) public  {
        b.withdrawAll();
    }
}