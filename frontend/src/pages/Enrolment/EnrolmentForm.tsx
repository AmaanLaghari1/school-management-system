import { Form, Formik } from "formik";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import { FC, useEffect, useMemo, useState } from "react";
import Select from "../../components/form/Select";
import { getStudent } from "../../api/StudentRequest";
import { getSession } from "../../api/SessionRequest";
import { getStandard } from "../../api/StandardRequest";
import { mapOptions } from "../../helpers/helper";

// Define props interface
interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (values: any) => void | Promise<void>;
    loading: boolean;
}

const EnrolmentForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {
    const [students, setStudents] = useState<[]>([])
    const [standards, setStandards] = useState<[]>([])
    const [sessions, setSessions] = useState<[]>([])

    const fetchData = async () => {
        try {
            const [studentRes, standardRes, sessionRes] = await Promise.all([
                getStudent(),
                getStandard(),
                getSession(),
            ]);

            // Assuming each API returns data in `.data`
            setStudents(studentRes.data || []);
            setStandards(standardRes.data || []);
            setSessions(sessionRes.data || []);
        } catch (err) {
            console.error("Failed to fetch data:", err);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const studentOptions = useMemo(() => {
        return mapOptions(students, 'NAME', 'STUDENT_ID') || []
    }, [students])

    const standardOptions = useMemo(() => {
        return mapOptions(standards, 'STANDARD_NAME', 'STANDARD_ID') || []
    }, [standards])

    const sessionOptions = useMemo(() => {
        return mapOptions(sessions, 'SESSION_NAME', 'SESSION_ID') || []
    }, [sessions])

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <Select
                            label="Student"
                            name="student_id"
                            options={studentOptions}
                            required={true}
                        />
                        <Select
                            label="Session"
                            name="session_id"
                            options={sessionOptions}
                            required={true}
                        />
                        <Select
                            label="Standard"
                            name="standard_id"
                            options={standardOptions}
                            required={true}
                        />
                        <Input
                            name="detail"
                            type="text"
                            placeholder="Enter detail"
                            label="Detail"
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
                )}
            </Formik>
        </div>
    );
};

export default EnrolmentForm;
