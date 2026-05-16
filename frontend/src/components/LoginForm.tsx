import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthApi } from "../api/auth.api";

interface LoginValues {
    email: string;
    password: string;
}

const initialValues: LoginValues = {
    email: "",
    password: "",
};

const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email")
        .required("Required"),

    password: Yup.string()
        .min(6, "Too short")
        .required("Required"),
});

export default function LoginForm() {
    const handleSubmit = async (
        values: LoginValues,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            await AuthApi.post("/auth/login", values);

            console.log("Success");

            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            <Form>
                <div>
                    <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                    />

                    <ErrorMessage
                        name="email"
                        component="div"
                    />
                </div>

                <div>
                    <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                    />

                    <ErrorMessage
                        name="password"
                        component="div"
                    />
                </div>

                <button type="submit">
                    Login
                </button>
            </Form>
        </Formik>
    );
}