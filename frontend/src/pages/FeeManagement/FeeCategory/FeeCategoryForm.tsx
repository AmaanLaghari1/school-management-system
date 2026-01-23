import { Form, Formik, FormikHelpers } from "formik";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import { FC } from "react";

// Define props interface
interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (
        values: any,
        helpers: FormikHelpers<any>
    ) => void | Promise<void>;
    loading: boolean;
    disableFields?: { [key: string]: boolean };
}

const FeeCategoryForm: FC<FormProps> = ({
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
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
                enableReinitialize={true}
            >
                {({}) => {

                    return <Form>
                        <div className="grid sm:grid-cols-2 gap-2">

                            <Input
                                name="cat_title"
                                type="text"
                                placeholder="Enter fee category title"
                                label="Title"
                                required={true}
                            />
                            <Input
                                name="remarks"
                                type="text"
                                placeholder="Enter remarks"
                                label="Remarks"
                            />
                        </div>

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
                }
            </Formik>
        </div>
    );
};

export default FeeCategoryForm;
