import React, { use, useState } from 'react'
import SubHeading from '../../../components/custom/SubHeading'
import FeeVoucherForm from './FeeVoucherForm'
import * as Yup from 'yup'
import * as API from '../../../api/FeeVoucher'
import Alert from '../../../components/custom/Alert'
import { useSelector } from 'react-redux'

interface FeeVoucherAddProps {
    closeModal: any;
    fetchData: any;
}

const FeeVoucherAdd = ({ closeModal, fetchData }: FeeVoucherAddProps) => {
    const [loading, setLoading] = useState(false)
    const auth = useSelector((state: { auth: { authData: { user: any } } }) => state.auth.authData.user)
    const initialValues = {
        school_id: auth.SCHOOL_ID,
        session_id: '',
        standard_id: '',
        enrolment_id: '',
        fee_month: '',
        date: '',
        total_amount: '',
        remarks: ''
    }
    const validationSchema = Yup.object().shape({
        session_id: Yup.string().required('Required!'),
        standard_id: Yup.string().required('Required!'),
        enrolment_id: Yup.string().required('Required!'),
        fee_month: Yup.string().required('Required!'),
        date: Yup.string().required('Required!'),
        total_amount: Yup.number().required('Required!').positive('Amount must be a positive number!'),
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.createFeeVoucher(values)
            console.log(response.data)
            closeModal()
            fetchData()
            Alert({
                status: true,
                text: 'Fee voucher created successfully...',
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
        <SubHeading>Add New Fee Voucher</SubHeading>

        <FeeVoucherForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        />
    </div>
  )
}

export default React.memo(FeeVoucherAdd)