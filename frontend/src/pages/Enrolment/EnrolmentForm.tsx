import { Form, Formik, FormikHelpers } from "formik";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import { FC, useEffect, useMemo, useState } from "react";
import Select from "../../components/form/Select";
import { getStudent, getStudentBySchoolId } from "../../api/StudentRequest";
import { getSession, getSessionBySchoolId } from "../../api/SessionRequest";
import { getStandard, getStandardBySchoolId } from "../../api/StandardRequest";
import { filterSchoolsForUser, isAllSchoolsUser, mapOptions } from "../../helpers/helper";
import { getSchool } from "../../api/SchoolRequest";
import { useUser } from "../../hooks/useUser";

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

const EnrolmentForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {

    const [schools, setSchools] = useState<[]>([])
    const [students, setStudents] = useState<[]>([])
    const [standards, setStandards] = useState<[]>([])
    const [sessions, setSessions] = useState<[]>([])
    const { user } = useUser()
    const canViewAllSchools = isAllSchoolsUser(user)

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

    const fetchSchools = async () => {
        try {
            const response = await getSchool()
            setSchools(filterSchoolsForUser(response.data || [], user) as [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSessions = async (schoolId?: any) => {
        try {
            const response = schoolId
                ? await getSessionBySchoolId(schoolId)
                : await getSession()
            setSessions(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const schoolOptions = useMemo(() => {
        return mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
    }, [schools])

    const fetchStudents = async (schoolId: any) => {
        try {
            const response = await getStudentBySchoolId(schoolId)
            setStudents(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchStandards = async (schoolId: any) => {
        try {
            const response = await getStandardBySchoolId(schoolId)
            setStandards(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSchools()
        fetchSessions(canViewAllSchools ? undefined : user?.SCHOOL_ID)
    }, [])

    const studentOptions = useMemo(() => {
        return mapOptions(students, 'NAME', 'STUDENT_ID') || []
    }, [students])

    const standardOptions = useMemo(() => {
        return standards?.map((item: any) => ({
            label: item.SECTION ? `${item.STANDARD_NAME} (${item.SECTION})` : item.STANDARD_NAME,
            value: item.STANDARD_ID
        })) || [];
    }, [standards]);

    const sessionOptions = useMemo(() => {
        return mapOptions(sessions, 'SESSION_NAME', 'SESSION_ID') || []
    }, [sessions])

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
                enableReinitialize={true}
            >
                {({ setFieldValue, values }) => {
                    useEffect(() => {
                        if (values.school_id) {
                            fetchStudents(values.school_id);
                            fetchStandards(values.school_id);
                        }
                    }, []);

                    return <Form>
                        <div className="grid sm:grid-cols-2 gap-2">

                            <Select
                                label="School"
                                name="school_id"
                                options={schoolOptions}
                                onChange={(e) => {
                                    setFieldValue('school_id', e)
                                    fetchSessions(e)
                                    fetchStudents(e)
                                    fetchStandards(e)
                                }}
                                required={true}
                                disabled={values.school_id ? true : false}
                            />
                            <Select
                                label="Student"
                                name="student_id"
                                options={studentOptions}
                                required={true}
                                disabled={values.student_id ? true : false}
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

export default EnrolmentForm;
