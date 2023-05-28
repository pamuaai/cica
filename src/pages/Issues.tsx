import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { Issue } from "../components/Issue";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IssueType } from "./Issues.types";

export default function Issues() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth() as { auth: any };
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [myIssuesFilter, setMyIssuesFilter] = useState<boolean>(
    searchParams.get("showMyIssues") === "true"
  );
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    searchParams.set("showMyIssues", String(myIssuesFilter));
    setSearchParams(searchParams);
  }, [myIssuesFilter, searchParams, setSearchParams]);

  useEffect(() => {
    async function loadIssues() {
      const issueSearchParams: Record<string, any> = {};
      if (myIssuesFilter) {
        try {
          const { data, status } = await axiosPrivate.get("/users", {
            params: { username: auth.username },
          });
          if (status === 200) {
            if (data) {
              issueSearchParams.user = data.results[0].id;
            }
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

      try {
        const { data, status } = await axiosPrivate.get("/issues", {
          params: issueSearchParams,
        });
        if (status === 200) {
          if (data) {
            setIssues(data.results);
          }
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
    if (!auth.accessToken) {
      navigate("/");
    } else {
      // GET THE ISSUES
      loadIssues();
    }
  }, [navigate, axiosPrivate, auth, myIssuesFilter]);

  function onShowMyIssuesChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const target = event.target;
    const value = target.checked;
    setMyIssuesFilter(value);
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
            checked={myIssuesFilter}
            onChange={onShowMyIssuesChange}
          />
        </Form>
      </Row>
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
