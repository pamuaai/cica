import { Card, Form } from "react-bootstrap";
import { ISSUE_STATE_NAMES, IssueType } from "../pages/Issues.types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export function Issue({
  issue,
  updateIssueList,
}: {
  issue: IssueType;
  updateIssueList: () => void;
}) {
  const axiosPrivate = useAxiosPrivate();

  async function updateIssueState(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const { status } = await axiosPrivate.patch(`/issues/${issue.id}`, {
        state: event.target.value,
      });
      if (status === 200) {
        updateIssueList();
      } else {
        console.error("Unexpected error", status);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Váratlan hiba történt", err);
      }
    }
  }

  function renderStateSelect() {
    return (
      <div>
        <Form.Label htmlFor="state-select">Státusz</Form.Label>
        <Form.Select defaultValue={issue.state} onChange={updateIssueState}>
          {ISSUE_STATE_NAMES.map((i, id) => (
            <option value={i.state} key={id}>
              {i.name}
            </option>
          ))}
        </Form.Select>
      </div>
    );
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        <h3>{issue.name}</h3>
        {renderStateSelect()}
      </Card.Header>
      <Card.Body>{issue.description}</Card.Body>
    </Card>
  );
}
