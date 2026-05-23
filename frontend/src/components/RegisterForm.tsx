import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { AuthApi } from "../api/auth.api";

interface RegisterFormProps {
  onSuccess?: () => void;
}

interface RegisterValues {
  userName: string;
  email: string;
  password: string;
}

const initialValues: RegisterValues = {
  userName: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  userName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const handleSubmit = async (values: RegisterValues, { resetForm }: { resetForm: () => void }) => {
    try {
      await AuthApi.post("/auth/register", values);

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
          <Field type="text" name="userName" placeholder="Username" />
          <ErrorMessage name="userName" component="div" />
        </div>

        <div>
          <Field type="email" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
        </div>

        <div>
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
        </div>

        <button type="submit">Register</button>
      </Form>
    </Formik>
  );
}
