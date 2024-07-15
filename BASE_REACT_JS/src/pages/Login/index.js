import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "utils/validate";
import { getToken } from "utils/storage";
import BaseLayout from "base/BaseLayout";
import LoginForm from "./section/LoginForm";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmpty(getToken())) navigate("/dashboard");
  }, []);

  return (
    <BaseLayout>
      <LoginForm />
    </BaseLayout>
  );
}

export default Login;
