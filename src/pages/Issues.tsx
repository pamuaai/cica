import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Issue } from "../components/Issue";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ISSUE_STATE_NAMES, IssueType, UserType } from "./Issues.types";
import { NewIssueCreator } from "../components/NewIssueCreator";

interface FilterState {
  showMyIssues?: boolean;
}

export default function Issues() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth() as { auth: any };
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    showMyIssues: undefined,
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFilters({ ...filters, [event.target.name]: newValue });
    console.log("Setting parameters after change");
    
    searchParams.set(event.target.name, String(newValue));
    setSearchParams(searchParams);
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

  const loadUsers = useCallback(async () => {
    try {
      const { data, status } = await axiosPrivate.get("/users");
      if (status === 200) {
        if (data) {
          setUsers(data.results);
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
  }, [axiosPrivate]);

  const loadFilters = useCallback(async () => {
    console.log("Initial filter setup", JSON.stringify({
      ...filters,
      showMyIssues: searchParams.get("showMyIssues") === "true",
    }), searchParams.get("showMyIssues"));
    
    setFilters({
      ...filters,
      showMyIssues: searchParams.get("showMyIssues") === "true",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!auth.accessToken) {
      navigate("/");
    } else {
      console.log("Startup");
      
      loadFilters();
      loadUsers();
      loadIssues();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function renderNewIssueButton() {
    return <NewIssueCreator updateIssueList={loadIssues} />;
  }

  return (
    <Container>
      <div className="py-4 d-flex justify-content-between">
        <div>{renderFilterForm()}</div> <div>{renderNewIssueButton()}</div>{" "}
      </div>
      <Row>
        {!!issues.length ? ISSUE_STATE_NAMES.map((issueState) =>
              issues.find((i) => i.state === issueState.state) ? (
                <Col key={`column-${issueState.name}`} className="mw-25">
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
                            updateIssueList={loadIssues}
                            userList={users}
                            key={i.id}
                          />
                        ))}
                    </Card.Body>
                  </Card>
                </Col>
              ) : null
            ) : (
          <Alert variant="warning">
            Nem találtunk a keresésnek megfelelő issuet
          </Alert>
        )}
      </Row>
    </Container>
  );
}
