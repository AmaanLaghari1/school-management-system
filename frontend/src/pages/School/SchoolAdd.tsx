import { useState } from "react"
import * as Yup from 'yup'
import {createSchool} from '../../api/SchoolRequest'
import Alert from "../../components/custom/Alert"
import SchoolForm from "./SchoolForm"

const SchoolAdd = () => {
    const [loading, setLoading] = useState(false)

    const initialValues = {
        school_name: '',
        email: '',
        branch: '',
        contact_no_1: '',
        contact_no_2: '',
        address: '',
    }

    const validationSchema = Yup.object().shape({
        school_name: Yup.string().required('Required!'),
        email: Yup.string().required('Required!'),
        branch: Yup.string().required('Required!'),
        contact_no_1: Yup.string().required('Required!'),
        address: Yup.string().required('Required!')
    })

    const handleSubmit = async (values: any) => {
        setLoading(true)
        // alert(JSON.stringify(values))
        try {
            const response = await createSchool(values)
            console.log(response)
            Alert({status: true, text: "School added successfully..."})
        } catch (error) {
            console.log(error)
            Alert({status: false, text: "Unable to add the school!"})
        }
        setLoading(false)
    }

    return (
        <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Add New School</h5>

            <SchoolForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
            loading={loading}
            />
        </div>
    )
}

export default SchoolAdd