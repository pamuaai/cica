import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Container, Alert, Button, Form } from "react-bootstrap";

const Login = () => {
  // const dispatch = useDispatch();
  const emailRef = useRef() as RefObject<HTMLInputElement>;

  // const [loginFn] = useLoginMutation();

  const [values, setValues] = useState({ password: "", email: "" });
  const [err, setErr] = useState<string | undefined>(undefined);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [event.target.name]: event.target.value });

  const { password, email } = values;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log(values);
    // Gonna have to hash the password before sending
    // Result will probably contain more strict auth stuff, like some token or something similar
    if (!values) {
      setErr("Unexpected error");
    }
    try {
      //   const result = await loginFn({
      //     strategy: "local",
      //     email: email,
      //     password: password,
      //   });
      //   if (result.data) {
      //     dispatch(setCredentials(result.data));
      //   }
      //   if (result.error) {
      //     console.error(
      //       result.error.data?.errors[0]?.message || "Unexpected error"
      //     );
      //     setErr(result.error.data?.errors[0]?.message || "Unexpected error");
      //     return;
      //   }
    } catch (err) {
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
