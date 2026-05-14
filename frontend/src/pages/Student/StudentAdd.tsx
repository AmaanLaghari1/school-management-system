import { useState } from "react"
import StudentForm from "./StudentForm"
import * as Yup from 'yup'
import { createStudent } from "../../api/StudentRequest"
import Alert from "../../components/custom/Alert"
import { FormikHelpers } from "formik"
import AlertConfirm from "../../components/custom/AlertConfirm"

const StudentAdd = () => {
    const [loading, setLoading] = useState(false)

    const initialValues = {
        school_id: '',
        guardian_relation_id: '',
        name: '',
        fname: '',
        surname: '',
        email: '',
        cnic_no: '',
        gender: '',
        mobile_no: '',
        date_of_birth: '',
        postal_address: '',
        permanent_address: '',
        guardian_name: '',
        guardian_cnic_no: '',
        guardian_mobile_no: '',
        guardian_email: '',
        guardian_address: '',
        previous_school: '',
        previous_standard: '',
        previous_gr_no: '',
        current_gr_no: '',
        tuition_fee: '',
        is_free: '',
        active: '',
        remarks: '',
    }

    const validationSchema = Yup.object().shape({
        school_id: Yup.string().required('Required!'),
        guardian_relation_id: Yup.string().required('Required!'),
        name: Yup.string().required('Required!'),
        fname: Yup.string().required('Required!'),
        surname: Yup.string().required('Required!'),
        mobile_no: Yup.number().required('Required!'),
        // date_of_birth: Yup.string().required('Required!'),
        postal_address: Yup.string().required('Required!'),
        permanent_address: Yup.string().required('Required!'),
        email: Yup.string().email('Invalid email!'),
        guardian_email: Yup.string().email('Invalid email!'),
        gender: Yup.string().required('Required!'),
        cnic_no: Yup.number().min(1111111111111, 'Invalid CNIC No!').required('Required!'),
        guardian_cnic_no: Yup.number().min(1111111111111, 'Invalid CNIC No!').required('Required!'),
        guardian_name: Yup.string().required('Required!'),
        guardian_mobile_no: Yup.number().required('Required!'),
        guardian_address: Yup.string().required('Required!'),
    })

    const handleSubmit = async (values: any, {resetForm}: FormikHelpers<any>) => { 
        setLoading(true)
        try {
            const response = await createStudent(values)
            Alert({status: true, text: response.data?.message || 'Student created successfully...'})
            resetForm();
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.response.data?.error_message || 'Some error occured!'})
        }
        setLoading(false)
    }
    
    return (
        <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Add New Student</h5>

            <StudentForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                handleSubmit={async (values, helpers) => {
                    const confirm = await AlertConfirm({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                    })
                    if (confirm) {
                        handleSubmit(values, helpers)
                    }
                }}
                loading={loading}
            />
            
        </div>
    )
}

export default StudentAdd