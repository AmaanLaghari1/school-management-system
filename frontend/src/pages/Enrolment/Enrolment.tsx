import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router";
import * as API from '../../api/EnrolmentRequest'
import DataTable, { Column } from "../../components/custom/DataTable";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/custom/Alert";
import MainHeading from "../../components/custom/MainHeading";
import { Form, Formik } from "formik";
import { getSchool } from "../../api/SchoolRequest";
import { mapOptions } from "../../helpers/helper";
import Select from "../../components/form/Select";
import { getSession } from "../../api/SessionRequest";
import * as Yup from 'yup'
import { getStandardBySchoolId } from "../../api/StandardRequest";
import Checkbox from "../../components/form/input/Checkbox";

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
    const [loading, setLoading] = useState<boolean>(false)
    const [enrolments, setEnrolments] = useState<Enrolment[]>([])
    const navigate = useNavigate()

    const [schools, setSchools] = useState<[]>([])
    const [sessions, setSessions] = useState<[]>([])
    const [standards, setStandards] = useState<[]>([])

    const fetchSchools = async () => {
        try {
            const response = await getSchool()
            console.log(response)
            setSchools(response.data)
        } catch (error: any) {
            console.log(error)
        }
    }

    const schoolOptions = useMemo(() => {
        return mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
    }, [schools])

    const fetchSessions = async () => {
        try {
            const response = await getSession()
            // console.log(response)
            setSessions(response.data)
        } catch (error: any) {
            console.log(error)
        }
    }

    const sessionOptions = useMemo(() => {
        return mapOptions(sessions, 'SESSION_NAME', 'SESSION_ID')
    }, [sessions])

    const fetchStandards = async (schoolId: '') => {
        try {
            const response = await getStandardBySchoolId(schoolId)
            // console.log(response)
            setStandards(response.data)
        } catch (error: any) {
            console.log(error)
        }
    }

    const standardOptions = useMemo(() => {
        return mapOptions(standards, 'STANDARD_NAME', 'STANDARD_ID')
    }, [standards])

    // const fetchEnrolments = async () => {
    //     setLoading(true)
    //     try {
    //         const response = await API.getEnrolment()
    //         setEnrolments(response.data)
    //         // console.log(response)
    //     } catch (error: any) {
    //         console.log(error)
    //     }
    //     finally {
    //         setLoading(false)
    //     }
    // }

    const handleDelete = async (id: '') => {
        try {
            const response = await API.deleteEnrolment(id)
            Alert({ status: true, text: response.data?.message || 'Enrolment deleted...' })
            setEnrolments(enrolments.filter(item => item.ENROLMENT_ID != id))
        }
        catch (error: any) {
            console.log(error)
            Alert({ status: false, text: error.data?.error_message || 'Unable to delete the Enrolment' })
        }
    }

    useEffect(() => {
        // fetchEnrolments()
        fetchSchools()
    }, [])

    const handleFilters = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.getEnrolment(values)
            setEnrolments(response.data)
            // console.log(response)
        } catch (error: any) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const columns: Column<Enrolment>[] = [
        {
            key: 'ENROLMENT_ID',
            header: 'ID',
            sortable: true
        },
        {
            key: 'student.NAME',
            header: 'Student Name',
            sortable: true
        },
        {
            key: 'session.SESSION_NAME',
            header: 'Session Name',
            sortable: true
        },
        {
            key: 'standard.school.SCHOOL_NAME',
            header: 'School Name',
            sortable: true
        },
        {
            key: 'standard.STANDARD_NAME',
            header: 'Standard',
            sortable: true
        },
        {
            key: 'DETAIL',
            header: 'Detail',
            sortable: true
        },
        {
            key: 'REMARKS',
            header: 'Remarks',
            sortable: true
        },
        {
            key: 'ACTIONS',
            header: 'Actions',
            render: (row: any) => {
                return (
                    <div className="flex space-x-2">
                        <button className="text-blue-600 hover:underline text-sm"
                            onClick={() => {
                                navigate('/enrolment/edit', {
                                    state: {
                                        prevValues: row
                                    }
                                })
                            }}
                        >Edit</button>
                        {/* Optional: Add delete or other actions here */}
                        <button disabled={loading} onClick={() => handleDelete(row.Enrolment_ID)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <MainHeading>
                    All Enrolments
                </MainHeading>
                <Link to="/enrolment/add">
                    <Button size="sm" variant="primary">
                        Add New +
                    </Button>
                </Link>

            </div>

            <Formik
                initialValues={{
                    school_id: '',
                    session_id: '',
                    standard_id: '',
                    active: false
                }}
                validationSchema={Yup.object().shape({
                    school_id: Yup.string().required('Required!'),
                    session_id: Yup.string().required('Required!'),
                    standard_id: Yup.string().required('Required!')
                })}
                onSubmit={handleFilters}>
                {
                    ({values, setFieldValue}) => (
                        <Form>
                            <div className="flex flex-wrap items-end">
                                <div className="w-xs mx-2">
                                    <Select
                                        name="school_id"
                                        label="Select School"
                                        options={schoolOptions}
                                        onChange={(e: any) => {
                                            // console.log(e)
                                            fetchSessions()
                                            fetchStandards(e)
                                        }
                                        }
                                        required={true}
                                    />
                                </div>
                                <div className="w-xs mx-2">
                                    <Select
                                        name="session_id"
                                        label="Select Session"
                                        options={sessionOptions}
                                        required={true}
                                    />
                                </div>
                                <div className="w-xs mx-2">
                                    <Select
                                        name="standard_id"
                                        label="Select Standard"
                                        options={standardOptions}
                                        required={true}
                                    />
                                </div>
                                <div className="w-xs m-2">
                                    <Checkbox
                                        name="active"
                                        label="Active"
                                        checked={values.active}
                                        onChange={(checked) =>
                                            setFieldValue("active", checked)
                                        }
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
                    )
                }
            </Formik>

            <DataTable data={enrolments} columns={columns} itemsPerPage={10} />
        </div>
    )
}

export default Enrolment