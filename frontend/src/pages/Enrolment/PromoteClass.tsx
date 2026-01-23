import { Form, Formik, FormikHelpers } from "formik"
import { useEffect, useMemo, useState } from "react"
import { mapOptions } from "../../helpers/helper"
import { getSchool } from "../../api/SchoolRequest"
import Select from "../../components/form/Select"
import { getStandardBySchoolId } from "../../api/StandardRequest"
import { getSession } from "../../api/SessionRequest"
import Button from "../../components/ui/button/Button"
import SubHeading from "../../components/custom/SubHeading"
import * as Yup from 'yup'
import { promoteStudents } from "../../api/EnrolmentRequest"
import AlertConfirm from "../../components/custom/AlertConfirm"
import Alert from "../../components/custom/Alert"
import Input from "../../components/form/input/InputField"
import { useUser } from "../../hooks/useUser"

const PromoteClass = () => {
    const [loading, setLoading] = useState(false)
    const [schools, setSchools] = useState<[]>([])
    const [sessions, setSessions] = useState<[]>([])
    const [standards, setStandards] = useState<[]>([])
    const {user} = useUser()

    const fetchSchools = async () => {
        try {
            const response = await getSchool()
            // console.log(response)
            setSchools(response.data.filter((item: { SCHOOL_ID: any }) => item.SCHOOL_ID == user.SCHOOL_ID))
        } catch (error: any) {
            console.log(error)
        }
    }

    const schoolOptions = useMemo(() => {
        return mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
    }, [schools])

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
        return standards?.map((item: any) => ({
            label: item.SECTION ? `${item.STANDARD_NAME} (${item.SECTION})` : item.STANDARD_NAME,
            value: item.STANDARD_ID
        })) || [];
    }, [standards]);

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


    useEffect(() => {
        fetchSchools()
    }, [])

    const initialValues = {
        school_id: '',
        standard_id: '',
        previous_standard_id: '',
        session_id: '',
        previous_session_id: '',
        detail: '',
        remarks: '',
    }

    const validationSchema = Yup.object().shape({
        school_id: Yup.string().required('Required!'),
        standard_id: Yup.string().required('Required!'),
        previous_standard_id: Yup.string().required('Required!'),
        session_id: Yup.string().required('Required!'),
        previous_session_id: Yup.string().required('Required!'),
    })

    const handleSubmit = async (values: any, {resetForm}: FormikHelpers<any>) => {
        setLoading(true)
        try {
            const confirm = await AlertConfirm({})
            if(confirm){
                const response = await promoteStudents(values)
                Alert({status: true, text: response.data.message || 'Students promoted...'})
            }
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.response?.data?.error_message || 'Promotion failed!'})
        }
        resetForm()
        setLoading(false)
    }
    return (
        <div>
            <SubHeading>
                Promote Students
            </SubHeading>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
            >
                {
                    ({ }) => {
                        return (
                            <Form>
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
                                <div className="grid sm:grid-cols-2 gap-2">


                                    <Select
                                        label="Previous Session"
                                        name="previous_session_id"
                                        options={sessionOptions}
                                        required={true}
                                    />
                                    <Select
                                        label="Current Session"
                                        name="session_id"
                                        options={sessionOptions}
                                        required={true}
                                    />
                                    <Select
                                        label="Previous Standard"
                                        name="previous_standard_id"
                                        options={standardOptions}
                                        required={true}
                                    />
                                    <Select
                                        label="Current Standard"
                                        name="standard_id"
                                        options={standardOptions}
                                        required={true}
                                    />
                                    <Input
                                        label="Detail"
                                        name="detail"
                                        type="text"
                                        placeholder="Enter detail (optional)"
                                    />
                                    <Input
                                        label="Remarks"
                                        name="remarks"
                                        type="text"
                                        placeholder="Enter remarks (optional)"
                                    />

                                </div>
                                <Button
                                    size="sm"
                                    variant="success"
                                    className="mt-5"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Promoting..." : "Promote"}
                                </Button>
                            </Form>
                        )
                    }
                }
            </Formik >
        </div >
    )
}

export default PromoteClass