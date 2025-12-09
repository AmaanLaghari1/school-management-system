import { Form, Formik } from "formik";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import { FC } from "react";

// Define props interface
interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (values: any) => void | Promise<void>;
    loading: boolean;
}

const SchoolForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {
    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <Input
                            name="school_name"
                            type="text"
                            placeholder="Enter school name"
                            label="School Name"
                            required
                        />
                        <Input
                            name="branch"
                            type="text"
                            placeholder="Enter branch"
                            label="Branch"
                            required
                        />
                        <Input
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            label="Email"
                            required
                        />
                        <Input
                            name="contact_no_1"
                            type="tel"
                            placeholder="Enter contact no. 1"
                            label="Contact No. 1"
                            required
                        />
                        <Input
                            name="contact_no_2"
                            type="tel"
                            placeholder="Enter contact no. 2"
                            label="Contact No. 2"
                        />
                        <Input
                            name="address"
                            type="text"
                            placeholder="Enter address"
                            label="Address"
                            required
                        />

                        <Button
                            size="sm"
                            variant="success"
                            className="mt-5"
                            endIcon={<BoxIcon className="size-5" />}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SchoolForm;
