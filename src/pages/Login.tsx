import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Container, Alert, Button, Form } from "react-bootstrap";
import { login } from "../api/auth";
import { setCredentials } from "../functions/auth";

const Login = () => {
  // const dispatch = useDispatch();
  const emailRef = useRef() as RefObject<HTMLInputElement>;

  const [values, setValues] = useState({ password: "", email: "" });
  const [err, setErr] = useState<string | undefined>(undefined);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [event.target.name]: event.target.value });

  const { password, email } = values;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values) {
      setErr("Unexpected error");
    }
    try {
      const { data, status } = await login(email, password);
      if (status === 200) {
        console.log("STATUS:", status);
        if (data) {
          setCredentials(data);
        }
      } else {
        console.error("STATUS:", status);
        setErr("Unexpected error");
      }
    } catch (err) {
      // console.log(err.response.data);
      // console.log(err.response.status);
      // console.log(err.response.headers);
      console.error(err);
    }
  }

  const canSubmit = password && email;

  useEffect(() => {
    if (emailRef.current != null) {
      emailRef.current.focus();
    }
  }, []);

  return (
    <Container className="p-3">
      <h1>Bejelentkezés</h1>
      <Form onSubmit={handleSubmit}>
        {err && <Alert variant="danger">{err}</Alert>}
        <Form.Label>Email: </Form.Label>
        <Form.Control
          ref={emailRef}
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
        />
        <Form.Label>Jelszó: </Form.Label>
        <Form.Control
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
          required
        />

        <Button
          variant="success"
          type="submit"
          className="mt-2"
          disabled={!canSubmit}
        >
          Bejelentkezés
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
