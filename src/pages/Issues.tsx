import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Issue } from "../components/Issue";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IssueType } from "./Issues.types";

export default function Issues() {
  const navigate = useNavigate();
  const { auth } = useAuth() as { auth: any };
  const [issues, setIssues] = useState<IssueType[]>([]);
  const axiosPrivate = useAxiosPrivate();

  async function loadIssues() {
    const { data, status } = await axiosPrivate.get("/issues");
    if (status === 200) {
      if (data) {
        setIssues(data.results);
      }
    } else {
      console.error("Unexpected error", status);
    }
  }

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/");
    } else {
      // GET THE ISSUES
      loadIssues();
    }
  });
  return (
    <Container className="pt-4">
      <Row>
        <Col>
          <Card border="warning">
            <Card.Header className="bg-warning">New</Card.Header>
            <Card.Body>
              {issues
                .filter((i) => i.state === "NEW")
                .map((i) => (
                  <Issue issue={i} />
                ))}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card border="info">
            <Card.Header className="bg-info">In progress</Card.Header>
            <Card.Body>
              {issues
                .filter((i) => i.state === "INPROGRESS")
                .map((i) => (
                  <Issue issue={i} />
                ))}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card border="danger">
            <Card.Header className="bg-danger">Review</Card.Header>
            <Card.Body>
              {issues
                .filter((i) => i.state === "REVIEW")
                .map((i) => (
                  <Issue issue={i} />
                ))}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card border="success">
            <Card.Header className="bg-success">Done</Card.Header>
            <Card.Body>
              {issues
                .filter((i) => i.state === "DONE")
                .map((i) => (
                  <Issue issue={i} />
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
