import { useState } from "react"
import StudentForm from "./StudentForm"
import * as Yup from 'yup'
import { updateStudent } from "../../api/StudentRequest"
import Alert from "../../components/custom/Alert"
import { useLocation } from "react-router"

const StudentEdit = () => {
    const [loading, setLoading] = useState(false)

    const location = useLocation()

    const {prevValues} = location.state || {}

    const initialValues = {
        school_id: prevValues.SCHOOL_ID || '',
        guardian_relation_id: prevValues.GUARDIAN_RELATION_ID || '',
        name: prevValues.NAME || '',
        fname: prevValues.FNAME || '',
        surname: prevValues.SURNAME || '',
        email: prevValues.EMAIL || '',
        cnic_no: prevValues.CNIC_NO || '',
        gender: prevValues.GENDER || '',
        mobile_no: prevValues.MOBILE_NO || '',
        date_of_birth: prevValues.DATE_OF_BIRTH || '',
        postal_address: prevValues.POSTAL_ADDRESS || '',
        permanent_address: prevValues.PERMANENT_ADDRESS || '',
        guardian_name: prevValues.GUARDIAN_NAME || '',
        guardian_cnic_no: prevValues.GUARDIAN_CNIC_NO || '',
        guardian_mobile_no: prevValues.GUARDIAN_MOBILE_NO || '',
        guardian_email: prevValues.GUARDIAN_EMAIL || '',
        guardian_address: prevValues.GUARDIAN_ADDRESS || '',
        previous_standard: prevValues.PREVIOUS_STANDARD || '',
        previous_gr_no: prevValues.PREVIOUS_GR_NO || '',
        current_gr_no: prevValues.CURRENT_GR_NO || '',
        tuition_fee: prevValues.TUITION_FEE || '',
        is_free: prevValues.IS_FREE || '',
        active: prevValues.ACTIVE || '',
        remarks: prevValues.REMARKS || '',
    }

    const validationSchema = Yup.object().shape({
        school_id: Yup.string().required('Required!'),
        guardian_relation_id: Yup.string().required('Required!'),
        name: Yup.string().required('Required!'),
        fname: Yup.string().required('Required!'),
        surname: Yup.string().required('Required!'),
        mobile_no: Yup.number().required('Required!'),
        date_of_birth: Yup.string().required('Required!'),
        postal_address: Yup.string().required('Required!'),
        permanent_address: Yup.string().required('Required!'),
        email: Yup.string().email('Invalid Email!').required('Required!'),
        guardian_email: Yup.string().email('Invalid Email!').required('Required!'),
        gender: Yup.string().required('Required!'),
        cnic_no: Yup.number().min(1111111111111, 'Invalid CNIC No!').required('Required!'),
        guardian_cnic_no: Yup.number().min(1111111111111, 'Invalid CNIC No!').required('Required!'),
        guardian_name: Yup.string().required('Required!'),
        guardian_mobile_no: Yup.number().required('Required!'),
        guardian_address: Yup.string().required('Required!'),
    })

    const handleSubmit = async (values: {}) => { 
        setLoading(true)
        try {
            const response = await updateStudent(values, prevValues.STUDENT_ID)
            console.log(response)
            Alert({status: true, text: response.data?.message || 'Student created successfully...'})
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.response.data?.error_message || 'Some error occured!'})
        }
        setLoading(false)
    }
    return (
        <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Edit Student</h5>

            <StudentForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    )
}

export default StudentEdit