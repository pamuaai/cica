import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { auth } = useAuth() as { auth: any };
  const [issues, setIssues] = useState<IssueType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [err, setErr] = useState<string | undefined>(undefined);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const didMount = useRef(false);

  const [filters, setFilters] = useState<FilterState>({
    showMyIssues: undefined,
  });

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFilters({ ...filters, [event.target.name]: newValue });

    searchParams.set(event.target.name, String(newValue));
    setSearchParams(searchParams);
  };

  useEffect(() => {
    // Return early, if this is the first render:
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    loadIssues();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const axiosPrivate = useAxiosPrivate();

  const loadIssues = useCallback(async () => {
    const issueSearchParams: Record<string, any> = {};
    setLoading(true);
    if (filters.showMyIssues) {
      issueSearchParams.user = auth?.user?.id;
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
        console.error("Váratlan hiba történt:", status);
        setErr("Váratlan hiba történt");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err instanceof Error) {
        console.error(err.message);
        setErr(err.message);
      } else {
        console.error("Váratlan hiba történt:", err);
        setErr("Váratlan hiba történt");
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
        console.error("Váratlan hiba történt: ", status);
        setErr("Váratlan hiba történt");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setErr(err.message);
      } else {
        console.error("Váratlan hiba történt: ", err);
        setErr("Váratlan hiba történt");
      }
    }
  }, [axiosPrivate]);

  const loadFilters = useCallback(async () => {
    setFilters({
      ...filters,
      showMyIssues: searchParams.get("showMyIssues") === "true",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (auth?.accessToken) {
      setLoggedIn(true);
      loadFilters();
      loadUsers();
      loadIssues();
      return;
    } else {
      setLoggedIn(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

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
      {!loggedIn ? (
        <Alert variant="danger mt-3">Hozzáférés megtagadva!</Alert>
      ) : (
        <>
          <div className="py-4 d-flex justify-content-between">
            <div>{renderFilterForm()}</div> <div>{renderNewIssueButton()}</div>{" "}
          </div>
          <Row>
            {err && <Alert variant="danger">{err}</Alert>}
            {loading ? (
              <Alert variant="warning">Betöltés...</Alert>
            ) : (
              <>
                {!!issues.length ? (
                  ISSUE_STATE_NAMES.map((issueState) =>
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
                  )
                ) : (
                  <Alert variant="warning">
                    Nem találtunk a keresésnek megfelelő issuet
                  </Alert>
                )}
              </>
            )}
          </Row>
        </>
      )}
    </Container>
  );
}
