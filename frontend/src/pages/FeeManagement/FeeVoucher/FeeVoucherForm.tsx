import { Form, Formik, FormikHelpers } from "formik";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import React, { FC, useEffect, useMemo, useState } from "react";
import DatePicker from "../../../components/form/date-picker";
import { getEnrolmentBySchoolId } from "../../../api/EnrolmentRequest";
import { useSelector } from "react-redux";
import Select from "../../../components/form/Select";
import { getSessionBySchoolId } from "../../../api/SessionRequest";
import { getStandardBySchoolId } from "../../../api/StandardRequest";

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

const FeeVoucherForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {

    const [enrolments, setEnrolments] = useState<[]>([])
    const [sessions, setSessions] = useState<[]>([])
    const [standards, setStandards] = useState<[]>([])
    const user = useSelector((state: {auth: {authData: {user: any}}}) => state.auth.authData.user)

    const fetchEnrolments = async (standardId: any) => {
        try {
            const response = await getEnrolmentBySchoolId(standardId)
            console.log(response)
            setEnrolments(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const enrolOptions = useMemo(() => {
        return enrolments.map(item => ({ label: item['student']['NAME'], value: item['ENROLMENT_ID'] }))
    }, [enrolments])

    const fetchSessions = async () => {
        try {
            const response = await getSessionBySchoolId(user.SCHOOL_ID)
            // console.log(response)
            setSessions(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchStandards = async () => {
        try {
            const response = await getStandardBySchoolId(user.SCHOOL_ID)
            // console.log(response)
            setStandards(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const standardOptions = useMemo(() => {
        return standards.map(item => ({ label: item['STANDARD_NAME']+" ("+item['SECTION']+")", value: item['STANDARD_ID'] }))
    }, [standards])

    const handleStandardChange = (e: any, setFieldValue: any) => {
        setFieldValue('standard_id', e)
        fetchEnrolments(e)
    }

    useEffect(() => {
        // fetchEnrolments()
        fetchSessions()
        fetchStandards()
    }, [])

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
                enableReinitialize={true}
            >
                {({ setFieldValue, values }) => {

                    if(values.standard_id != '' && enrolments.length === 0) {
                        fetchEnrolments(values.standard_id)
                    }

                    return <Form>
                        <div className="grid sm:grid-cols-2 gap-2">
                            <Select
                                label="Session"
                                name="session_id"
                                options={sessions.map(item => ({ label: item['SESSION_NAME'], value: item['SESSION_ID'] }))}
                                required={true}
                            />
                            <Select
                                label="Standard"
                                name="standard_id"
                                options={standardOptions}
                                onChange={(e: any) => handleStandardChange(e, setFieldValue)}
                                required={true}
                            />
                            <Select
                                label="Student"
                                name="enrolment_id"
                                options={enrolOptions}
                                required={true}
                            />
                            <Input
                                name="fee_month"
                                type="text"
                                placeholder="Enter fee month"
                                label="Fee Month"
                                required={true}
                            />
                            <DatePicker
                                id="date"
                                name="date"
                                label="Date"
                                placeholder="Pick a date"
                            />
                            <Input
                                name="total_amount"
                                type="text"
                                placeholder="Enter total amount"
                                label="Total Amount"
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

export default React.memo(FeeVoucherForm);
