import React, { useState } from 'react'
import SubHeading from '../../../components/custom/SubHeading'
import FeeListForm from './FeeListForm'
import * as Yup from 'yup'
import * as API from '../../../api/FeeList'
import Alert from '../../../components/custom/Alert'

interface FeeListEditProps {
    prevValues: any;
    closeModal: any;
    fetchData: any;
}

const FeeListEdit = ({ prevValues, closeModal, fetchData }: FeeListEditProps) => {
    const [loading, setLoading] = useState(false)

    const initialValues = {
        fee_id: prevValues.FEE_ID || '',
        session_id: prevValues.SESSION_ID || '',
        standard_id: prevValues.STANDARD_ID || '',
        fee_cat_id: prevValues.FEE_CAT_ID || '',
        title: prevValues.TITLE || '',
        amount: prevValues.AMOUNT || '',
        active: prevValues.ACTIVE || '',
        remarks: prevValues.REMARKS || ''
    }

    const validationSchema = Yup.object().shape({
        session_id: Yup.string().required('Required!'),
        fee_cat_id: Yup.string().required('Required!'),
        title: Yup.string().required('Required!'),
        amount: Yup.number().required('Required!').positive('Amount must be a positive number!'),
        active: Yup.string().required('Required!')
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.updateFeeList(values)
            console.log(response.data)
            Alert({
                status: true,
                text: 'Fee list updated successfully...',
            })
            closeModal()
            fetchData()
        } catch (error: any) {
            console.error(error)
            Alert({
                status: false,
                text: 'Something went wrong! Please try again.',
            })
        }
        setLoading(false)
    }
    
  return (
    <div>
        <SubHeading>Edit Fee</SubHeading>

        <FeeListForm 
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default React.memo(FeeListEdit)