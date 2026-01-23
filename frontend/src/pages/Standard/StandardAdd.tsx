import { useState } from "react"
import StandardForm from "./StandardForm"
import * as Yup from 'yup'
import * as API from '../../api/StandardRequest'
import Alert from "../../components/custom/Alert"
import { FormikHelpers } from "formik"
import AlertConfirm from "../../components/custom/AlertConfirm"

const StandardAdd = () => {
  const [loading, setLoading] = useState(false)

  const initialValues = {
    school_id: '',
    standard_name: '',
    section: '',
    remarks: ''
  }

  const validationSchema = Yup.object().shape({
    school_id: Yup.string().required('Required!'),
    standard_name: Yup.string().required('Required!'),
  })

  const handleSubmit = async (values: {}, { resetForm }: FormikHelpers<any>) => {
    setLoading(true)
    try {
      const response = await API.createStandard(values)
      // console.log(response)
      Alert({ status: true, text: response.data?.message || 'Standard created...' })
      resetForm()
    } catch (error: any) {
      console.log(error)
      Alert({ status: false, text: 'Some error occured!' })
    }
    setLoading(false)
  }

  return (
    <div>
      <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">Add New Standard</h5>

      <StandardForm
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

export default StandardAdd