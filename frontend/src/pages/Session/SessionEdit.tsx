import { useState } from "react"
import * as Yup from 'yup'
import SessionForm from "./SessionForm"
import { updateSession } from "../../api/SessionRequest"
import { useLocation, useNavigate } from "react-router"
import Alert from "../../components/custom/Alert"

const SessionEdit = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const location = useLocation()
    const navigate = useNavigate()

    const { prevValues } = location.state || {}

    const initialValues = {
        session_name: prevValues.SESSION_NAME || '',
        year: prevValues.YEAR || '',
        active: prevValues.ACTIVE || '',
        remarks: prevValues.REMARKS || ''
    }

    const validationSchema = Yup.object().shape({
        session_name: Yup.string().required('Required'),
        year: Yup.string().required('Required'),
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await updateSession(values, prevValues.SESSION_ID)
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
        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Edit Session</h5>

            <SessionForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
            loading={loading}
            />
    </div>
  )
}

export default SessionEdit