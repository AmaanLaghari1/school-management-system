import { useState } from "react"
import SubHeading from "../../components/custom/SubHeading"
import * as Yup from 'yup'
import EnrolmentForm from "./EnrolmentForm"
import * as API from '../../api/EnrolmentRequest'
import Alert from "../../components/custom/Alert"
import { FormikHelpers } from "formik"
import AlertConfirm from "../../components/custom/AlertConfirm"

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
    })

    const handleSubmit = async (values: {}, {resetForm}: FormikHelpers<any>) => {
        setLoading(true)
        try {
            const confirm = AlertConfirm({})
            if(await confirm){
                const response = await API.createEnrolment(values)
                Alert({status: true, text: response.data.message || 'Enrolment created...'})
                resetForm()
            }
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error?.error_message || 'Enrolment creation failed!'})
        }
        finally {
            setLoading(false)
        }
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