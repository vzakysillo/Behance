import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthApi } from "../api/auth.api";

interface RegisterValues {
    username: string;
    email: string;
    password: string;
}

const initialValues: RegisterValues = {
    username: "",
    email: "",
    password: "",
};

const validationSchema = Yup.object({
    username: Yup.string()
        .required("Required"),

    email: Yup.string()
        .email("Invalid email")
        .required("Required"),

    password: Yup.string()
        .min(6, "Too short")
        .required("Required"),
});

export default function RegisterForm() {
    const handleSubmit = async (
        values: RegisterValues,
        { resetForm }: { resetForm: () => void }
    ) => {
        try {
            await AuthApi.post("/auth/register", values);

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
                        type="text"
                        name="username"
                        placeholder="Username"
                    />
                    <ErrorMessage name="username" component="div" />
                </div>

                <div>
                    <Field
                        type="email"
                        name="email"
                        placeholder="Email"
                    />
                    <ErrorMessage name="email" component="div" />
                </div>

                <div>
                    <Field
                        type="password"
                        name="password"
                        placeholder="Password"
                    />
                    <ErrorMessage name="password" component="div" />
                </div>

                <button type="submit">
                    Register
                </button>
            </Form>
        </Formik>
    );
}