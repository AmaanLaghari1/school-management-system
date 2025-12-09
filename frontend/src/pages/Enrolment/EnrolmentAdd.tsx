import { useState } from "react"
import SubHeading from "../../components/custom/SubHeading"
import * as Yup from 'yup'
import EnrolmentForm from "./EnrolmentForm"
import * as API from '../../api/EnrolmentRequest'
import Alert from "../../components/custom/Alert"

const EnrolmentAdd = () => {
    const [loading, setLoading] = useState(false)

    const initialValues = {
        student_id: '',
        session_id: '',
        standard_id: '',
        detail: ''
    }

    const validationSchema = Yup.object().shape({
        student_id: Yup.string().required('Required!'),
        session_id: Yup.string().required('Required!'),
        standard_id: Yup.string().required('Required!'),
        detail: Yup.string().required('Required!')
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.createEnrolment(values)
            Alert({status: true, text: response.data.message || 'Enrolment created...'})
        } catch (error: any) {
            console.log(error)
            Alert({status: true, text: error.data.error_message || 'Enrolment creation failed!'})
        }
        setLoading(false)
    }
  return (
    <div>
        <SubHeading>
            Add New Enrolment
        </SubHeading>

        <EnrolmentForm 
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default EnrolmentAdd