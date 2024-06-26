import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

const Proposals = ({ provider, dao, proposals, quorum, setIsLoading }) => {
  const handleVote = async (id) => {
    try {
      const signer = await provider.getSigner();
      const transaction = await dao.connect(signer).vote(id);
      await transaction.wait();

      setIsLoading(true);
    } catch (err) {
      console.log(err);
      window.alert("User rejected or transaction reverted")
    }
  };
  const handleFinalize = async (id) => {
    try {
      const signer = await provider.getSigner();
      const transaction = await dao.connect(signer).finalizeProposal(id);
      await transaction.wait();

      setIsLoading(true);
    } catch (err) {
      console.log(err);
      window.alert("User rejected or transaction reverted")
    }
  };
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Proposal Name</th>
          <th>Recipient Address</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Total Votes</th>
          <th>Cast Vote</th>
          <th>Finalize</th>
        </tr>
      </thead>
      <tbody>
        {proposals.map((proposal, idx) => (
          <tr key={idx}>
            <td>{proposal.id.toString()}</td>
            <td>{proposal.name}</td>
            <td>{proposal.recipient.toString()}</td>
            <td>{ethers.utils.formatUnits(proposal.amount, "ether")} ETH</td>
            <td>{proposal.finalized ? "Approved" : "In Progress"}</td>
            <td>{proposal.votes.toString()}</td>
            <td>
              {!proposal.finalized ? (
                <Button
                  onClick={() => handleVote(proposal.id)}
                  variant="primary"
                  style={{ width: "100%" }}
                >
                  Vote
                </Button>
              ) : null}
            </td>
            <td>
              {!proposal.finalized && proposal.votes > quorum ? (
                <Button onClick={() => handleFinalize(proposal.id)} variant="primary" style={{ width: "100%" }}>
                  Finalize
                </Button>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Proposals;
