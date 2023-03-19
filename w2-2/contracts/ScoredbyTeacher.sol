//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Score {
    mapping(address => uint) private scores;
    Teacher private teacher;

    // To save gas, declare all the errors as follows instead of using require():
    error NotTeacher();
    error ScoreExceed100();

    constructor(address TeacherAddr) {
        teacher = Teacher(TeacherAddr);
    }

    // Only the contract Teacher can set score, so declare such a modifier as follows:
    modifier OnlyTeacher {
        if(msg.sender != address(teacher)) revert NotTeacher();
        _;
    }
    
    // SetScore is only for the contract Teacher.
    function SetScore(address _student, uint _score) public OnlyTeacher {
        if(_score > 100) revert ScoreExceed100(); 
        scores[_student] = _score;
    }
    
    // GetScore is open to anyone to check their scores. There's no need to invoke this fucntion via an interface.
    function GetScore(address _student) public view returns(uint) {
        return scores[_student];
    }

}

interface IScore {
    function SetScore(address _student, uint _score) external;
}

contract Teacher {
    address public owner;            
    mapping(address => bool) public isteacher;

    error NotOwner();
    error NotTeacher();

    // Assume that the contract is created by the teacher. The teacher is the only one to invoke contract Score.
     constructor() {
        owner = msg.sender;
    }
  
    modifier OnlyOwner {
        if(msg.sender != owner) revert NotOwner();
        _;
    }

    modifier OnlyTeacher {
        if(isteacher[msg.sender] != true) revert NotTeacher();
        _;
    }

    // There may be more than 1 teacher. The owner can set or delete teachers by invoking the following functions:
    function SetTeacher(address _newTeacher) external OnlyOwner {
        isteacher[_newTeacher] = true;
    }
    function DelTeacher(address _newTeacher) external OnlyOwner {
        isteacher[_newTeacher] = false;
    }

    function SetScoreByTeacher(address _scoreContractAddr, address _student, uint _score) external OnlyTeacher {
        IScore(_scoreContractAddr).SetScore(_student, _score);
    }
}