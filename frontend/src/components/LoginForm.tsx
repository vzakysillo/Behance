import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { AuthApi } from "../api/auth.api";

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginValues {
  email: string;
  password: string;
}

const initialValues: LoginValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const handleSubmit = async (values: LoginValues, { resetForm }: { resetForm: () => void }) => {
    try {
      const response = await AuthApi.post<{ token: string }>("/auth/login", values);

      localStorage.setItem("token", response.data.token);
      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      <Form>
        <div>
          <Field type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
        </div>

        <div>
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
        </div>

        <button type="submit">Login</button>
      </Form>
    </Formik>
  );
}
