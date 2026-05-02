import React, { useState } from 'react'
import SubHeading from '../../../components/custom/SubHeading'
import FeeLedgerForm from './FeeLedgerForm'
import * as Yup from 'yup'
import * as API from '../../../api/FeeLedger'
import Alert from '../../../components/custom/Alert'

interface FeeListEditProps {
    closeModal: any;
    fetchData: any;
    prevValues: any;
}

const FeeLedgerEdit = ({ closeModal, fetchData, prevValues }: FeeListEditProps) => {
    const [loading, setLoading] = useState(false)
    const initialValues = {
        fee_ledger_id: prevValues?.FEE_LEDGER_ID || '',
        voucher_id: prevValues?.VOUCHER_ID || '',
        student_id: prevValues?.STUDENT_ID || '',
        detail: prevValues?.DETAIL || '',
        date: prevValues?.DATE || '',
        voucher_amount: prevValues?.VOUCHER_AMOUNT || '',
        paid_amount: prevValues?.PAID_AMOUNT || '',
        remarks: prevValues?.REMARKS || ''
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
            const response = await API.updateFeeLedger(values)
            // console.log(response.data)
            closeModal()
            fetchData()
            Alert({
                status: true,
                text: 'Fee ledger updated successfully...',
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
        <SubHeading>Edit Fee Ledger</SubHeading>

        <FeeLedgerForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default React.memo(FeeLedgerEdit)