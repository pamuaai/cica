import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { Issue } from "../components/Issue";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IssueType } from "./Issues.types";

export default function Issues() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { auth } = useAuth() as { auth: any };
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [showMyIssues, setShowMyIssues] = useState<boolean>(
    searchParams.has("showMyIssues")
  );
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function loadIssues() {
      try {
        const { data, status } = await axiosPrivate.get("/issues");
        if (status === 200) {
          if (data) {
            setIssues(data.results);
          }
        } else {
          console.log("asdasdasdasd");
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

    if (!auth.accessToken) {
      navigate("/");
    } else {
      // GET THE ISSUES
      loadIssues();
    }
  }, [auth.accessToken, navigate, axiosPrivate]);

  function onShowMyIssuesChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const target = event.target;
    const value = target.checked;
    setShowMyIssues(value);
  }

  return (
    <Container>
      <Row className="py-4">
        <Form>
          <Form.Check
            type="switch"
            id="my-issues-filter"
            name="my-issues-filter"
            label="Saját issue-k"
            onChange={onShowMyIssuesChange}
          />
        </Form>
      </Row>
      {showMyIssues && "SHOULD SHOW ONLY MY ISSUES"}
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
