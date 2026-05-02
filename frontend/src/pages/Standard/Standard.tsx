import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router";
import * as API from '../../api/StandardRequest'
import DataTable, { Column } from "../../components/custom/DataTable";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/custom/Alert";
import Select from "../../components/form/Select";
import { Form, Formik } from "formik";
import { getSchool } from "../../api/SchoolRequest";
import { filterSchoolsForUser, isAllSchoolsUser, mapOptions } from "../../helpers/helper";
import AlertConfirm from "../../components/custom/AlertConfirm";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useUser } from "../../hooks/useUser";

interface Standard {
    STANDARD_ID: string;
    SCHOOL_ID: string;
    STANDARD_NAME: string;
    SECTION: string;
    ACTIVE: string;
    REMARKS: string;
    ACTIONS: string;
}

const Standard = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [standards, setStandards] = useState<Standard[]>([])
    const [schools, setSchools] = useState<[]>([])
    const navigate = useNavigate()
    const { user } = useUser()
    const canViewAllSchools = isAllSchoolsUser(user)

    const fetchSchools = async () => {
        try {
            const response = await getSchool()
            setSchools(filterSchoolsForUser(response.data || [], user) as [])
        } catch (error: any) {
            console.log(error)
        }
    }

    const schoolOptions = useMemo(() => {
        const options = mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
        return canViewAllSchools ? [{ label: 'All Schools', value: '' }, ...options] : options
    }, [schools, canViewAllSchools])

    const fetchStandards = async (schoolId: any) => {
        setLoading(true)
        try {
            const response = canViewAllSchools && !schoolId
                ? await API.getStandard()
                : await API.getStandardBySchoolId(schoolId)
            setStandards(response.data)
            // console.log(response)
        } catch (error: any) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: '') => {
        try {
            const response = await API.deleteStandard(id)
            Alert({ status: true, text: response.data?.message || 'Standard deleted...' })
            setStandards(standards.filter(item => item.STANDARD_ID != id))
        }
        catch (error: any) {
            console.log(error)
            Alert({ status: false, text: error.data?.error_message || 'Unable to delete the standard' })
        }
    }

    useEffect(() => {
        fetchSchools()
    }, [])

    const columns: Column<Standard>[] = [
        {
            key: 'school.SCHOOL_NAME',
            header: 'School Name',
            sortable: true
        },
        {
            key: 'STANDARD_NAME',
            header: 'Standard Name',
            sortable: true
        },
        {
            key: 'SECTION',
            header: 'Section',
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
                    <div className="flex flex-wrap space-x-2">
                        <button className="text-blue-600 hover:underline text-sm"
                            onClick={() => {
                                navigate('/standard/edit', {
                                    state: {
                                        prevValues: row
                                    }
                                })
                            }}
                        >Edit</button>
                        {/* Optional: Add delete or other actions here */}
                        <button disabled={loading} onClick={async () => {
                            const confirm = await AlertConfirm({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                            })
                            if (confirm) {
                                handleDelete(row.STANDARD_ID)
                            }
                        }
                        } className="text-red-600 hover:underline text-sm">Delete</button>
                    </div >
                )
            }
        },
    ]

    const handleSubmit = (values: any) => {
        fetchStandards(values.school_id)
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-center">
                <PageBreadcrumb pageTitle="Standards" />
                <Link to="/standard/add">
                    <Button size="sm" variant="primary">
                        Add New +
                    </Button>
                </Link>
            </div>
            <div className="flex flex-wrap">
                <div className="w-md mx-2">
                    <Formik
                        initialValues={{
                            school_id: canViewAllSchools ? '' : user?.SCHOOL_ID || ''
                        }}
                        onSubmit={handleSubmit}
                    >
                        {
                            ({ setFieldValue, validateForm, submitForm }) => {
                                useEffect(() => {
                                    submitForm();
                                }, []);
                                return (
                                    <Form>
                                        <Select
                                            name="school_id"
                                            label="Select School"
                                            options={schoolOptions}
                                            required={true}
                                            onChange={async (e) => {
                                                await setFieldValue("school_id", e);

                                                const errors = await validateForm();
                                                if (Object.keys(errors).length === 0) {
                                                    submitForm();
                                                }
                                            }}
                                        />
                                    </Form>
                                )
                            }
                        }
                    </Formik>
                </div>
            </div>
            {
                standards.length > 0 &&
                <>
                    <DataTable data={standards} columns={columns} itemsPerPage={10} />
                </>
            }
        </div>
    )
}

export default Standard
