import { useState } from "react"
import SubHeading from "../../components/custom/SubHeading"
import * as Yup from 'yup'
import EnrolmentForm from "./EnrolmentForm"
import * as API from '../../api/EnrolmentRequest'
import Alert from "../../components/custom/Alert"
import { useLocation, useNavigate } from "react-router"

const EnrolmentEdit = () => {
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const {prevValues} = location.state || {}
    const navigate = useNavigate()

    const initialValues = {
      'student_id': prevValues.STUDENT_ID || '',
      'session_id': prevValues.SESSION_ID || '',
      'standard_id': prevValues.STANDARD_ID || '',
      'detail': prevValues.DETAIL || ''
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
            const response = await API.updateEnrolment(values, prevValues.ENROLMENT_ID)
            // console.log(response)
            navigate('/enrolments')
            Alert({status: true, text: response.data.message || 'Enrolment updated...'})
          } catch (error: any) {
            console.log(error)
            Alert({status: true, text: error.data.error_message || 'Enrolment update failed!'})
        }
        setLoading(false)
    }
  return (
    <div>
        <SubHeading>
            Edit Enrolment
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

export default EnrolmentEdit