import React, { useState } from 'react'
import SubHeading from '../../../components/custom/SubHeading'
import FeeListForm from './FeeListForm'
import * as Yup from 'yup'
import * as API from '../../../api/FeeList'
import Alert from '../../../components/custom/Alert'

interface FeeListAddProps {
    closeModal: any;
    fetchData: any;
}

const FeeListAdd = ({ closeModal, fetchData }: FeeListAddProps) => {
    const [loading, setLoading] = useState(false)
    const initialValues = {
        session_id: '',
        fee_cat_id: '',
        title: '',
        amount: '',
        active: '',
        remarks: ''
    }
    const validationSchema = Yup.object().shape({
        session_id: Yup.string().required('Required!'),
        fee_cat_id: Yup.string().required('Required!'),
        title: Yup.string().required('Required!'),
        amount: Yup.number().required('Required!').positive('Amount must be a positive number!'),
        // active: Yup.string().required('Required!')
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.createFeeList(values)
            console.log(response.data)
            closeModal()
            fetchData()
            Alert({
                status: true,
                text: 'Fee list created successfully...',
            })
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
        <SubHeading>Add New Fee</SubHeading>

        <FeeListForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default React.memo(FeeListAdd)