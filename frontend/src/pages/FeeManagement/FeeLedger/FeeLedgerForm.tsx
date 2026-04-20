import { Form, Formik, FormikHelpers } from "formik";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import React, { FC } from "react";
import DatePicker from "../../../components/form/date-picker";

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

const FeeLedgerForm: FC<FormProps> = ({
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
                {({ }) => {

                    return <Form>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {/* <Select
                                label="Session"
                                name="session_id"
                                options={sessionOptions}
                                onChange={(e) => {
                                    setFieldValue('session_id', e)
                                }}
                                required={true}
                                disabled={values.session_id ? true : false}
                            />
                            <Select
                                label="Standard"
                                name="standard_id"
                                options={standardOptions}
                                onChange={(e) => {
                                    setFieldValue('standard_id', e)
                                }}
                                required={true}
                                disabled={values.standard_id ? true : false}
                            />
                            <Select
                                label="Fee Category"
                                name="fee_cat_id"
                                options={categoryOptions}
                                onChange={(e) => {
                                    setFieldValue('fee_cat_id', e)
                                }}
                                required={true}
                                disabled={values.fee_cat_id ? true : false}
                            /> */}
                            <Input
                                name="student_name"
                                type="text"
                                placeholder="Enter student name"
                                label="Student Name"
                                required={true}
                            />
                            <Input
                                name="detail"
                                type="text"
                                placeholder="Enter detail"
                                label="Detail"
                                required={true}
                            />
                            <DatePicker
                                id="date"
                                name="date"
                                label="Date"
                                placeholder="Pick a date"
                            />
                            <Input
                                name="voucher_amount"
                                type="text"
                                placeholder="Enter voucher amount"
                                label="Voucher Amount"
                                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
                                }
                                required={true}
                            />
                            <Input
                                name="paid_amount"
                                type="text"
                                placeholder="Enter paid amount"
                                label="Paid Amount"
                                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
                                }
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

export default React.memo(FeeLedgerForm);
