import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as API from '../../api/EnrolmentRequest';
import DataTable, { Column } from "../../components/custom/DataTable";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/custom/Alert";
import MainHeading from "../../components/custom/MainHeading";
import { Form, Formik } from "formik";
import { getSchool } from "../../api/SchoolRequest";
import { mapOptions } from "../../helpers/helper";
import Select from "../../components/form/Select";
import { getSession } from "../../api/SessionRequest";
import * as Yup from 'yup';
import { getStandardBySchoolId } from "../../api/StandardRequest";
import Checkbox from "../../components/form/input/Checkbox";
import AlertConfirm from "../../components/custom/AlertConfirm";

interface Enrolment {
    ENROLMENT_ID: string;
    STUDENT_ID: string;
    SESSION_ID: string;
    SCHOOL_NAME: string;
    STANDARD_ID: string;
    DETAIL: string;
    ACTIVE: string;
    REMARKS: string;
    ACTIONS: string;
}

const Enrolment = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
    const navigate = useNavigate();

    const [schools, setSchools] = useState<[]>([]);
    const [sessions, setSessions] = useState<[]>([]);
    const [standards, setStandards] = useState<[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    // Restore filters from URL
    const initialFilters = {
        school_id: searchParams.get("school_id")?.toString() || "",
        session_id: searchParams.get("session_id") || "",
        standard_id: searchParams.get("standard_id") || "",
        active: searchParams.get("active") === "true"
    };

    const fetchSchools = async () => {
        try {
            const response = await getSchool();
            setSchools(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await getSession();
            setSessions(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchStandards = async (schoolId: '') => {
        try {
            const response = await getStandardBySchoolId(schoolId);
            setStandards(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const schoolOptions = useMemo(() => {
        return mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID');
    }, [schools]);

    const sessionOptions = useMemo(() => {
        return mapOptions(sessions, 'SESSION_NAME', 'SESSION_ID');
    }, [sessions]);

    const standardOptions = useMemo(() => {
        return standards?.map((item: any) => ({
            label: item.SECTION ? `${item.STANDARD_NAME} (${item.SECTION})` : item.STANDARD_NAME,
            value: item.STANDARD_ID
        })) || [];
    }, [standards]);

    const handleDelete = async (id: '') => {
        try {
            const confirm = await AlertConfirm({});
            if (confirm) {
                const response = await API.deleteEnrolment(id);
                Alert({ status: true, text: response.data?.message || 'Enrolment deleted...' });
                setEnrolments(enrolments.filter(item => item.ENROLMENT_ID !== id));
            }
        } catch (error: any) {
            console.log(error);
            Alert({ status: false, text: error.data?.error_message || 'Unable to delete the Enrolment' });
        }
    };

    useEffect(() => {
        if (initialFilters.school_id) {
            fetchSessions();
            fetchStandards(initialFilters.school_id);
        }
    }, [initialFilters.school_id]);

    // Fetch data ONCE when coming back
    useEffect(() => {
        fetchSchools();
        if (initialFilters.school_id && initialFilters.session_id && initialFilters.standard_id) {
            handleFilters(initialFilters);
        }
    }, []);   // ← run once on mount

    const handleFilters = async (values: any) => {
        setLoading(true);

        // Save values to URL for persistence
        setSearchParams({
            school_id: values.school_id || "",
            session_id: values.session_id || "",
            standard_id: values.standard_id || "",
            active: String(values.active)
        });

        try {
            const response = await API.getEnrolment(values);
            setEnrolments(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Table columns
    const columns: Column<Enrolment>[] = [
        { key: 'ENROLMENT_ID', header: 'ID', sortable: true },
        { key: 'student.NAME', header: 'Student Name', sortable: true },
        { key: 'DETAIL', header: 'Detail', sortable: true },
        {   
            key: 'CREATED_AT',
            header: 'Created At', 
            sortable: true,
            render: (row: any) => new Date(row.CREATED_AT).toLocaleDateString([], { hour: "2-digit", minute: "2-digit" })
        },
        {
            key: 'ACTIVE',
            header: 'Active',
            sortable: true,
            render: (row: any) => {
                return <>
                    <Formik
                    initialValues={{
                        enrolment_id: row.ENROLMENT_ID,
                        active: row.ACTIVE
                    }}
                    enableReinitialize={true}
                    onSubmit={async (values) => {
                        try {
                            const response = await API.toggleActive(values);
                            console.log(response)
                            Alert({status: true, text: response.data?.message || 'Status updated...'})
                        } catch (error) {
                            console.log(error)
                        }
                    }}
                    >
                        {
                            ({setFieldValue, submitForm, values}) => {
                                return <Form>
                                    <div className="form-switch">
                                        <input 
                                        type="checkbox" 
                                        name="active"
                                        checked={Boolean(values.active)} 
                                        className="form-switch-input" 
                                        onChange={
                                            (e) => {
                                                setFieldValue('active', e.target.checked ? 1 : 0);
                                                submitForm();
                                            }
                                        }
                                        />
                                        <div className="form-switch-toggle"></div>
                                        
                                    </div>
                                </Form>
                            }
                        }

                    </Formik>
                </>
            }
        },
        { key: 'REMARKS', header: 'Remarks', sortable: true },
        {
            key: 'ACTIONS',
            header: 'Actions',
            render: (row: any) => (
                <div className="flex space-x-2">
                    <button
                        className="text-blue-600 hover:underline text-sm"
                        onClick={() => {
                            navigate('/enrolment/edit', {
                                state: { prevValues: row, searchParams: searchParams.toString() }
                            });
                        }}
                    >
                        Edit
                    </button>

                    <button
                        disabled={loading}
                        onClick={() => handleDelete(row.ENROLMENT_ID)}
                        className="text-red-600 hover:underline text-sm"
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <MainHeading>All Enrolments</MainHeading>

                <Link to="/enrolment/promote/class" className="ms-auto me-2">
                    <Button size="sm" variant="primary">
                        Promote Class
                    </Button>
                </Link>

                <Link to="/enrolment/add">
                    <Button size="sm" variant="primary">
                        Add New +
                    </Button>
                </Link>
            </div>

            <Formik
                initialValues={initialFilters}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                    school_id: Yup.string().required('Required!'),
                    session_id: Yup.string().required('Required!'),
                    standard_id: Yup.string().required('Required!')
                })}
                onSubmit={handleFilters}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="flex flex-wrap items-end">
                            <div className="w-xs mx-2">
                                <Select
                                    name="school_id"
                                    label="Select School"
                                    options={schoolOptions}
                                    onChange={(schoolId: any) => {
                                        fetchSessions();
                                        fetchStandards(schoolId);
                                        setFieldValue("school_id", schoolId);
                                    }}
                                    required
                                />
                            </div>

                            <div className="w-xs mx-2">
                                <Select
                                    name="session_id"
                                    label="Select Session"
                                    options={sessionOptions}
                                    required
                                />
                            </div>

                            <div className="w-xs mx-2">
                                <Select
                                    name="standard_id"
                                    label="Select Standard"
                                    options={standardOptions}
                                    required
                                />
                            </div>

                            <div className="w-xs m-2">
                                <Checkbox
                                    name="active"
                                    label="Active"
                                    checked={values.active}
                                    onChange={(checked) => setFieldValue("active", checked)}
                                />
                            </div>
                        </div>

                        <Button
                            size="sm"
                            variant="success"
                            className="mt-5"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Fetching..." : "Fetch"}
                        </Button>
                    </Form>
                )}
            </Formik>

            <DataTable data={enrolments} columns={columns} itemsPerPage={10} />
        </div>
    );
};

export default Enrolment;
