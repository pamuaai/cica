import { Alert, Button, Card, Form, Modal } from "react-bootstrap";
import { ISSUE_STATE_NAMES, IssueType, UserType } from "../pages/Issues.types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
export function Issue({
  issue,
  userList,
  updateIssueList,
}: {
  issue: IssueType;
  userList: UserType[];
  updateIssueList: () => void;
}) {
  const axiosPrivate = useAxiosPrivate();

  const [values, setValues] = useState({
    title: issue.name,
    description: issue.description,
  });
  const [validTitle, setValidTitle] = useState<boolean>(true);
  const [validDescription, setValidDescription] = useState<boolean>(true);
  const [err, setErr] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
    handleReset();
  };

  const handleReset = () => {
    setSuccess(undefined);
    setErr(undefined);
    setDisabled(false);
    setValidTitle(true);
    setValidDescription(true);
  };
  const handleShow = () => setShowModal(true);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  const { title, description } = values;
  useEffect(() => {
    setValidTitle(title.length > 3);
  }, [title]);

  useEffect(() => {
    setValidDescription(description.length > 3);
  }, [description]);

  async function updateIssueState(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const { status } = await axiosPrivate.patch(`/issues/${issue.id}`, {
        state: event.target.value,
      });
      if (status === 200) {
        updateIssueList();
        setSuccess("Státusz frissítve!");
        setTimeout(() => {
          handleReset();
        }, 1000);
      } else {
        console.error("Váratlan hiba történt", status);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Váratlan hiba történt", err);
      }
    }
  }

  async function updateIssueUser(event: React.ChangeEvent<HTMLSelectElement>) {
    try {
      const { status } = await axiosPrivate.patch(`/issues/${issue.id}`, {
        user: event.target.value,
      });
      if (status === 200) {
        updateIssueList();
        setSuccess("Felelős frissítve!");
        setTimeout(() => {
          handleReset();
        }, 1000);
      } else {
        console.error("Váratlan hiba történt", status);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Váratlan hiba történt", err);
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDisabled(true);
    if (!values) {
      setErr("Unexpected error1");
    }
    try {
      const { data, status } = await axiosPrivate.patch(`/issues/${issue.id}`, {
        name: title,
        description,
      });
      if (status === 200) {
        setErr(undefined);
        if (data) {
          setSuccess("Issue frissítve!");
          updateIssueList();
          setTimeout(() => {
            handleReset();
          }, 1000);
        }
      } else {
        setErr("Unexpected error2");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setErr(err.message);
      } else {
        console.error("Váratlan hiba történt", err);
        setErr("Váratlan hiba történt");
      }
    }
  }

  function renderStateAndUserSelect() {
    return (
      <div>
        <Form.Label htmlFor="state-select">Státusz</Form.Label>
        <Form.Select
          id="state-select"
          defaultValue={issue.state}
          onChange={updateIssueState}
        >
          {ISSUE_STATE_NAMES.map((i, id) => (
            <option value={i.state} key={id}>
              {i.name}
            </option>
          ))}
        </Form.Select>
        <Form.Label htmlFor="user-select">Felelős</Form.Label>
        <Form.Select
          id="user-select"
          defaultValue={issue.owner.id}
          onChange={updateIssueUser}
        >
          {userList.map((u, id) => (
            <option value={u.id} key={id}>
              {u.username}
            </option>
          ))}
        </Form.Select>
      </div>
    );
  }

  function renderEditModal() {
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Issue módosítása</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {err && (
              <Alert variant="danger" className="mb-2">
                {err}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="mb-2">
                {success}
              </Alert>
            )}
            {renderStateAndUserSelect()}
            <Form.Label htmlFor="title">Cím: </Form.Label>
            <Form.Control
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              isValid={validTitle}
              disabled={disabled}
              required
            />

            <Form.Label htmlFor="title">Leírás: </Form.Label>
            <Form.Control
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              isValid={validDescription}
              disabled={disabled}
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose} disabled={disabled}>
              Mégsem
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={disabled || !validDescription || !validTitle}
            >
              Mentés
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }

  return (
    <>
      <Card className="mb-3 cursor-pointer" onClick={handleShow}>
        <Card.Header>
          <h3>{issue.name}</h3>
          <h5>Felelős: {issue.owner.username}</h5>
        </Card.Header>
        <Card.Body>{issue.description}</Card.Body>
      </Card>
      {renderEditModal()}
    </>
  );
}
