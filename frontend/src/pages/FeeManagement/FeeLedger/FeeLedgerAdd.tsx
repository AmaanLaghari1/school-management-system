import React, { useState } from 'react'
import SubHeading from '../../../components/custom/SubHeading'
import FeeLedgerForm from './FeeLedgerForm'
import * as Yup from 'yup'
import * as API from '../../../api/FeeLedger'
import Alert from '../../../components/custom/Alert'

interface FeeListAddProps {
    closeModal: any;
    fetchData: any;
}

const FeeLedgerAdd = ({ closeModal, fetchData }: FeeListAddProps) => {
    const [loading, setLoading] = useState(false)
    const initialValues = {
        voucher_id: '',
        student_id: '',
        detail: '',
        date: '',
        voucher_amount: '',
        paid_amount: '',
        remarks: ''
    }
    const validationSchema = Yup.object().shape({
        // voucher_id: Yup.string().required('Required!'),
        student_id: Yup.string().required('Required!'),
        detail: Yup.string().required('Required!'),
        date: Yup.string().required('Required!'),
        voucher_amount: Yup.number().required('Required!').positive('Amount must be a positive number!'),
        paid_amount: Yup.number().required('Required!').positive('Amount must be a positive number!'),
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.createFeeLedger(values)
            console.log(response.data)
            closeModal()
            fetchData()
            Alert({
                status: true,
                text: 'Fee ledger created successfully...',
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
        <SubHeading>Add New Fee Ledger</SubHeading>

        <FeeLedgerForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default React.memo(FeeLedgerAdd)