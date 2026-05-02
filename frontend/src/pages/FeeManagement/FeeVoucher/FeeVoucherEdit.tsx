import React, { useState } from 'react'
import SubHeading from '../../../components/custom/SubHeading'
import FeeVoucherForm from './FeeVoucherForm'
import * as Yup from 'yup'
import * as API from '../../../api/FeeVoucher'
import Alert from '../../../components/custom/Alert'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'

// interface FeeVoucherEditProps {
//     prevValues: any;
//     closeModal: any;
//     fetchData: any;
// }

const FeeVoucherEdit = () => {
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: any) => state.auth.authData.user)
    const navigate = useNavigate()
    const location = useLocation()
    const { prevValues } = location.state || {}

    const initialValues = {
        voucher_id: prevValues?.VOUCHER_ID || '',
        session_id: prevValues?.enrolment?.SESSION_ID || '',
        standard_id: prevValues?.enrolment?.STANDARD_ID || '',
        school_id: user.SCHOOL_ID || '',
        enrolment_id: prevValues?.ENROLMENT_ID || '',
        fee_month: prevValues?.FEE_MONTH || '',
        date: prevValues?.DATE || '',
        current_amount: prevValues?.CURRENT_AMOUNT || '',
        remarks: prevValues?.REMARKS || '',
        selected_fees: (prevValues?.details || []).map((d: any) => ({
            FEE_ID: d.FEE_ID,
            AMOUNT: d.AMOUNT,
            REMARKS: d.REMARKS || "",
        })),
        fee_cat_id: prevValues?.details?.[0]?.fee_list?.FEE_CAT_ID || '',
        due_amount: 0
    };

    const validationSchema = Yup.object().shape({
        enrolment_id: Yup.string().required('Required!'),
        fee_month: Yup.string().required('Required!'),
        date: Yup.string().required('Required!'),
        current_amount: Yup.number().required('Required!').positive('Amount must be a positive number!'),
    })

    const handleSubmit = async (values: {}) => {
        setLoading(true)
        try {
            const response = await API.updateFeeVoucher(values)
            // console.log(response)
            navigate('/fee/vouchers')
            Alert({
                status: true,
                text: 'Fee voucher updated successfully...',
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
            <SubHeading>
                Update Fee Voucher
            </SubHeading>

            <FeeVoucherForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </div>
    )
}

export default React.memo(FeeVoucherEdit)
