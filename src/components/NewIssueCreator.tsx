import { Alert, Button, Form, Modal } from "react-bootstrap";
import {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";

export function NewIssueCreator({
  updateIssueList,
}: {
  updateIssueList: () => void;
}) {
  const [showModal, setShowModal] = useState(false);

  const titleRef = useRef() as RefObject<HTMLInputElement>;
  const { auth } = useAuth() as { auth: any };
  const axiosPrivate = useAxiosPrivate();

  const [values, setValues] = useState({ title: "", description: "" });
  const [validTitle, setValidTitle] = useState<boolean>(false);
  const [validDescription, setValidDescription] = useState<boolean>(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  const handleClose = () => {
    setShowModal(false);
    setValues({ title: "", description: "" });
    setSuccess(undefined);
    setErr(undefined);
    setDisabled(false);
    setValidTitle(false);
    setValidDescription(false);
  };
  const handleShow = () => setShowModal(true);
  const { title, description } = values;

  useEffect(() => {
    if (showModal && titleRef.current != null) {
      titleRef.current.focus();
    }
  }, [showModal]);

  useEffect(() => {
    setValidTitle(title.length > 3);
  }, [title]);

  useEffect(() => {
    setValidDescription(description.length > 3);
  }, [description]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDisabled(true);
    if (!values) {
      setErr("Váratlan hiba történt");
    }
    try {
      const { data, status } = await axiosPrivate.post("/issues", {
        name: title,
        description,
        user: auth.user.id,
      });
      if (status === 201) {
        setErr(undefined);
        if (data) {
          setSuccess("Issue létrehozva!");
          updateIssueList();
          setTimeout(() => {
            handleClose();
          }, 1000);
        }
      } else {
        setErr("Váratlan hiba történt");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setErr(err.message);
      } else {
        console.error("Váratlan hiba történt:", err);
        setErr("Váratlan hiba történt");
      }
    }
  }

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Új issue
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Új issue</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {err && <Alert variant="danger">{err}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form.Label htmlFor="title">Cím: </Form.Label>
            <Form.Control
              ref={titleRef}
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
    </>
  );
}
