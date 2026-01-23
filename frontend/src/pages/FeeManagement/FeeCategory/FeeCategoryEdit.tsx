import { FC, useState } from "react"
import SubHeading from "../../../components/custom/SubHeading"
import FeeCategoryForm from "./FeeCategoryForm"
import * as Yup from 'yup'
import * as API from '../../../api/FeeCategory'
import Alert from "../../../components/custom/Alert"

interface CategoryProps {
    prevValues: any;
    closeModal: any;
    fetchData: any;
}

const FeeCategoryEdit: FC<CategoryProps> = ({prevValues, closeModal, fetchData}) => {
    const [loading, setLoading] = useState(false)

    const initialValues = {
        fee_cat_id: prevValues.FEE_CAT_ID || '',
        cat_title: prevValues.CAT_TITLE || '',
        remarks: prevValues.REMARKS || ''
    }

    const validationSchema = Yup.object().shape({
        cat_title: Yup.string().required('Required!')
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.updateFeeCategory(values)
            Alert({status: true, text: response.data.message || 'Updated Successfully...'})
        } catch (error:any) {
            console.log(error)
            Alert({status: true, text: error.data.message || 'Something went wrong'})
        }
        fetchData()
        closeModal()
        setLoading(false)
    }

  return (
    <div>
        <SubHeading>Edit Category</SubHeading>

        <FeeCategoryForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default FeeCategoryEdit