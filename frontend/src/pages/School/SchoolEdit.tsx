import { useState } from "react"
import * as Yup from 'yup'
import { updateSchool } from '../../api/SchoolRequest'
import Alert from "../../components/custom/Alert"
import SchoolForm from "./SchoolForm"
import { useLocation, useNavigate } from "react-router"
import AlertConfirm from "../../components/custom/AlertConfirm"

const SchoolEdit = () => {
    const [loading, setLoading] = useState(false)

    const location = useLocation()

    const navigate = useNavigate()

    const { prevValues } = location.state || {}

    const initialValues = {
        school_id: prevValues.SCHOOL_ID || '',
        school_name: prevValues.SCHOOL_NAME || '',
        email: prevValues.EMAIL || '',
        branch: prevValues.BRANCH || '',
        contact_no_1: prevValues.CONTACT_NO_1 || '',
        contact_no_2: prevValues.CONTACT_NO_2 || '',
        address: prevValues.ADDRESS || '',
    }

    const validationSchema = Yup.object().shape({
        school_name: Yup.string().required('Required!'),
        email: Yup.string().email('Invalid email!'),
        branch: Yup.string().required('Required!'),
        contact_no_1: Yup.string().required('Required!'),
        address: Yup.string().required('Required!')
    })

    const handleSubmit = async (values: any) => {
        setLoading(true)
        // alert(JSON.stringify(values))
        try {
            const response = await updateSchool(values, prevValues.SCHOOL_ID)
            // console.log(response)
            Alert({ status: true, text: "School updated successfully..." })
            navigate('/schools')
        } catch (error) {
            console.log(error)
            Alert({ status: false, text: "Unable to update the school!" })
        }
        setLoading(false)
    }

    return (
        <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Edit School</h5>

            <SchoolForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleSubmit={async (values) => {
                    const confirm = await AlertConfirm({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                    })
                    if (confirm) {
                        handleSubmit(values)
                    }
                }}
                loading={loading}
            />
        </div>
    )
}

export default SchoolEdit