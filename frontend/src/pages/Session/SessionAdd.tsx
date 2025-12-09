import { useState } from "react"
import * as Yup from 'yup'
import SessionForm from "./SessionForm"
import { createSession } from "../../api/SessionRequest"
import Alert from "../../components/custom/Alert"
import { useNavigate } from "react-router"

const SessionAdd = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const initialValues = {
        session_name: '',
        year: '',
        active: '',
        remarks: ''
    }

    const validationSchema = Yup.object().shape({
        session_name: Yup.string().required('Required'),
        year: Yup.string().required('Required'),
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await createSession(values)
            // console.log(response)
            Alert({status: true, text: response.data.message || 'Session added successfully...'})
            navigate('/sessions')
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.data?.error_message || 'Error adding session!'})
        }
        setLoading(false)

    }
  return (
    <div>
        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Add New Session</h5>

            <SessionForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
            loading={loading}
            />
    </div>
  )
}

export default SessionAdd