import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { ethers } from "ethers";

const Proposals = ({ provider, dao, proposals, quorum, setIsLoading }) => {
  return (
    <Table striped border hover responsive>
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
            <td>{proposal.amount.toString()}</td>
            <td>{proposal.finalized.toString()}</td>
            <td>{proposal.votes.toString()}</td>
            <td>
              <Button>Vote</Button>
            </td>
            <td>
              <Button>Finalize</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default Proposals;
