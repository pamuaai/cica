import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { register } from "../api/auth";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function Register() {
  const navigate = useNavigate();
  const usernameRef = useRef() as RefObject<HTMLInputElement>;

  const [values, setValues] = useState({
    password: "",
    username: "",
    email: "",
    matchPassword: "",
  });

  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [validMatchPassword, setValidMatchPassword] = useState<boolean>(false);
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [event.target.name]: event.target.value });

  const { password, username, email, matchPassword } = values;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDisabled(true);
    if (!values) {
      setErr("Unexpected error");
    }
    try {
      const { data, status } = await register(username, password, email);
      if (status < 300) {
        setErr(undefined);
        if (data) {
          setSuccess(true);
        }
      } else {
        setErr("Váratlan hiba történt");
        setDisabled(false);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        setErr(err.message);
      } else {
        console.error("Váratlan hiba történt", err);
        setErr("Váratlan hiba történt");
      }
      setDisabled(false);
    }
  }

  const canSubmit =
    validUsername &&
    validEmail &&
    validPassword &&
    validMatchPassword &&
    !disabled;

  useEffect(() => {
    if (usernameRef.current != null) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setValidUsername(username.length > 3);
  }, [username]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(password.length > 3);
    setValidMatchPassword(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErr("");
  }, [username, password, email, matchPassword]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate(`/login?username=${username}`);
      }, 4000);
    }
  }, [success, navigate, username]);

  return (
    <Container className="pt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Header>
              <h1>Regisztráció</h1>
            </Card.Header>
            <Card.Body className="p-3">
              {success ? (
                <Alert variant="success">
                  Sikeres regisztráció! <br /> Átirányítás...
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {err && <Alert variant="danger">{err}</Alert>}
                  <Form.Label htmlFor="username">Felhasználónév: </Form.Label>
                  <Form.Control
                    ref={usernameRef}
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    isValid={validUsername}
                    disabled={disabled}
                    required
                  />
                  <Form.Label htmlFor="email">Email: </Form.Label>
                  <Form.Control
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    isValid={validEmail}
                    disabled={disabled}
                    required
                  />
                  <Form.Label htmlFor="password">Jelszó: </Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    isValid={validPassword}
                    disabled={disabled}
                    required
                  />
                  <Form.Label htmlFor="matchPassword">
                    Jelszó mégegyszer:{" "}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    id="matchPassword"
                    name="matchPassword"
                    value={matchPassword}
                    onChange={handleChange}
                    isValid={
                      !!password.length && validPassword && validMatchPassword
                    }
                    disabled={disabled}
                    required
                  />

                  <Button
                    variant="success"
                    type="submit"
                    className="mt-2"
                    disabled={!canSubmit}
                  >
                    Regisztráció
                  </Button>
                </Form>
              )}
            </Card.Body>
            <Card.Footer>
              Már regisztráltál?{" "}
              <NavLink to="/login">Itt tudsz belépni!</NavLink>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
