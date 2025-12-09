import { Form, Formik } from "formik"
import Input from "../../components/form/input/InputField"
import { FC } from "react";
import * as Yup from 'yup'
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";

interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (values: any) => void | Promise<void>;
    loading: boolean;
}


const SessionForm: FC<FormProps> = ({ initialValues, validationSchema, handleSubmit, loading }) => {
    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {
                    () => <Form>
                        <Input
                            name="session_name"
                            type="text"
                            placeholder="Enter session name"
                            label="Session Name"
                            required
                        />
                        <Input
                            name="year"
                            type="text"
                            placeholder="Enter session year"
                            label="Year"
                            required
                        />
                        <Input
                            name="remarks"
                            type="text"
                            placeholder="Enter remarks"
                            label="Remarks"
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
                }

            </Formik>
        </div>
    )
}

export default SessionForm