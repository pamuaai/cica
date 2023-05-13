import { useEffect } from "react";
import { checkLoggedIn } from "../functions/auth";
import { useNavigate } from "react-router-dom";

export function Issues() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!checkLoggedIn()) {
      navigate("/");
    }
  }, []);
  return <h1>Issues</h1>;
}
