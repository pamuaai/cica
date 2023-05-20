import { Card } from "react-bootstrap";
import { IssueType } from "../pages/Issues.types";
export function Issue({ issue }: { issue: IssueType }) {
  return (
    <Card className="mb-3">
      <Card.Header>{issue.name}</Card.Header>
      <Card.Body>{issue.description}</Card.Body>
    </Card>
  );
}
