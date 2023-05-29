import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Container,
  Alert,
  Button,
  Form,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { login } from "../api/auth";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { setAuth } = useAuth() as { setAuth: any };
  const navigate = useNavigate();
  const usernameRef = useRef() as RefObject<HTMLInputElement>;
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState({
    password: "",
    username: searchParams.get("username") || "",
  });
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [err, setErr] = useState<string | undefined>(undefined);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const { password, username } = values;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDisabled(true);
    if (!values) {
      setErr("Unexpected error");
    }
    try {
      const { data, status } = await login(username, password);
      if (status === 200) {
        setErr(undefined);
        if (data) {
          localStorage.removeItem("auth");
          console.log(data.user);
          const authObject = { user: data.user, accessToken: data.token };
          localStorage.setItem("auth", JSON.stringify(authObject));
          setAuth(authObject);
          setSuccess(true);
        }
      } else {
        setErr("Unexpected error");
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

  const canSubmit = validPassword && validUsername && !disabled;

  useEffect(() => {
    if (usernameRef.current != null) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setValidUsername(username.length > 3);
  }, [username]);

  useEffect(() => {
    setValidPassword(password.length > 3);
  }, [password]);

  useEffect(() => {
    setErr("");
  }, [username, password]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate(`/issues`);
      }, 4000);
    }
  }, [success, navigate]);

  return (
    <Container className="pt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card>
            <Card.Header>
              <h1>Belépés</h1>
            </Card.Header>
            <Card.Body className="p-3">
              {success ? (
                <Alert variant="success">
                  Sikeres belépés! <br /> Átirányítás...
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

                  <Button
                    variant="success"
                    type="submit"
                    className="mt-2"
                    disabled={!canSubmit}
                  >
                    Belépés
                  </Button>
                </Form>
              )}
            </Card.Body>
            <Card.Footer>
              Nincs még fiókod?{" "}
              <NavLink to="/register">Itt tudsz regisztrálni!</NavLink>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
