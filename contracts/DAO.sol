//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";

contract DAO {
    address owner;
    Token public token;
    uint256 public quorum;

    struct Proposal {
        uint256 id;
        string name;
        uint256 amount;
        address payable recipient;
        uint256 votes;
        bool finalized;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) votes;

    event Propose(uint id, uint256 amount, address recipient, address creator);

    event Vote(uint id, address investor);

    event Finalize(uint256 id);

    constructor(Token _token, uint256 _quorum) {
        owner = msg.sender;
        token = _token;
        quorum = _quorum;
    }

    // External can only be called outside the contract. Public could be called in or out.
    receive() external payable {}

    modifier onlyInvestor() {
        require(token.balanceOf(msg.sender) > 0, "must be token holder");
        _;
    }

    function createProposal(
        string memory _name,
        uint256 _amount,
        address payable _recipient
    ) external onlyInvestor {
        require(address(this).balance >= _amount);

        proposalCount++;

        proposals[proposalCount] = Proposal(
            proposalCount,
            _name,
            _amount,
            _recipient,
            0,
            false
        );

        emit Propose(proposalCount, _amount, _recipient, msg.sender);
    }

    function vote(uint256 _id) external onlyInvestor {
        Proposal storage proposal = proposals[_id];

        require(!votes[msg.sender][_id], "already voted");

        proposal.votes += token.balanceOf(msg.sender);

        votes[msg.sender][_id] = true;

        emit Vote(_id, msg.sender);
    }

    function finalizeProposal(uint _id) external onlyInvestor {
        Proposal storage proposal = proposals[_id];

        require(proposal.finalized == false, "proposal already finalized");
        require(
            proposal.votes >= quorum,
            "must reach quorum to finalixe proposal"
        );
        proposal.finalized = true;

        require(address(this).balance >= proposal.amount);

        // These are similar:
        // proposal.recipient.transfer(proposal.amount);
        (bool sent, ) = proposal.recipient.call{value: proposal.amount}("");
        require(sent);

        emit Finalize(_id);
    }
}
