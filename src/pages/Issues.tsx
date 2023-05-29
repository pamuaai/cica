import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Issue } from "../components/Issue";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ISSUE_STATE_NAMES, IssueType } from "./Issues.types";

export default function Issues() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth() as { auth: any };
  const [issues, setIssues] = useState<IssueType[]>([]);

  const [filters, setFilters] = useState({
    showMyIssues: false,
    showNew: true,
  });
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFilters({ ...filters, [event.target.name]: newValue });
  };
  const axiosPrivate = useAxiosPrivate();

  const loadIssues = useCallback(async () => {
    const issueSearchParams: Record<string, any> = {};
    if (filters.showMyIssues) {
      issueSearchParams.user = auth.user.id;
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
  }, [auth, axiosPrivate, filters]);

  useEffect(() => {
    console.log("HASDAD", searchParams.get("showMyIssues") === "true", filters);

    setFilters({
      ...filters,
      showMyIssues: searchParams.get("showMyIssues") === "true",
    });
  }, []);

  useEffect(() => {
    searchParams.set("showMyIssues", String(filters.showMyIssues));
    setSearchParams(searchParams);
  }, [filters, searchParams, setSearchParams]);

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/");
    } else {
      loadIssues();
    }
  }, [navigate, auth, loadIssues]);

  function updateIssueList(): void {
    loadIssues();
  }

  function renderFilterForm() {
    return (
      <Form>
        <Form.Check
          type="switch"
          id="showMyIssues"
          name="showMyIssues"
          label="Saját issue-k"
          checked={filters.showMyIssues}
          onChange={handleFilterChange}
        />
      </Form>
    );
  }

  return (
    <Container>
      <Row className="py-4">{renderFilterForm()}</Row>
      <Row>
        {!!issues.length ? (
          <>
            {ISSUE_STATE_NAMES.map((issueState) => (
              <>
                {!!issues.find((i) => i.state === issueState.state) && (
                  <Col key={`column-${issueState.name}`}>
                    <Card border={issueState.color}>
                      <Card.Header className={`bg-${issueState.color}`}>
                        {issueState.name}
                      </Card.Header>
                      <Card.Body>
                        {issues
                          .filter((i) => i.state === issueState.state)
                          .map((i) => (
                            <Issue
                              issue={i}
                              updateIssueList={updateIssueList}
                              key={i.id}
                            />
                          ))}
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </>
            ))}
          </>
        ) : (
          <Alert variant="warning">
            Nem találtunk a keresésnek megfelelő issuet
          </Alert>
        )}
      </Row>
    </Container>
  );
}
