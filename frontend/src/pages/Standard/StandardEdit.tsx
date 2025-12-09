import { useState } from "react"
import StandardForm from "./StandardForm"
import * as Yup from 'yup'
import * as API from '../../api/StandardRequest'
import Alert from "../../components/custom/Alert"
import { useLocation, useNavigate } from "react-router"

const StandardEdit = () => {
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const {prevValues} = location.state || {}
    const navigate = useNavigate()

    const initialValues = {
        school_id: prevValues.SCHOOL_ID || '',
        standard_name: prevValues.STANDARD_NAME || '',
        section: prevValues.SECTION || '',
        remarks: prevValues.REMARKS || ''
    }

    const validationSchema = Yup.object().shape({
        school_id: Yup.string().required('Required!'),
        standard_name: Yup.string().required('Required!'),
        section: Yup.string().required('Required!')
    })

    const handleSubmit = async (values: {}) => {
      setLoading(true)
      try {
        const response = await API.updateStandard(values, prevValues.STANDARD_ID)
        // console.log(response)
        Alert({status: true, text: response.data?.message || 'Standard updated...'})
        navigate('/standards')
      } catch (error) {
        console.log(error)
        Alert({status: false, text: 'Some error occured!'})
      }
      setLoading(false)
    }

  return (
    <div>
        <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Standard Edit</h5>
        
        <StandardForm 
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default StandardEdit