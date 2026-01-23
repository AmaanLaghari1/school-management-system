import { useState } from "react"
import SubHeading from "../../components/custom/SubHeading"
import * as Yup from 'yup'
import EnrolmentForm from "./EnrolmentForm"
import * as API from '../../api/EnrolmentRequest'
import Alert from "../../components/custom/Alert"
import { useLocation, useNavigate } from "react-router-dom"
import AlertConfirm from "../../components/custom/AlertConfirm"

const EnrolmentEdit = () => {
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const { prevValues, searchParams } = location.state || {}
  const navigate = useNavigate()
  // console.log(prevValues.student.SCHOOL_ID)

  const initialValues = {
    school_id: prevValues.student.SCHOOL_ID || '',
    student_id: prevValues.STUDENT_ID || '',
    session_id: prevValues.SESSION_ID || '',
    standard_id: prevValues.STANDARD_ID || '',
    detail: prevValues.DETAIL || ''
  }

  const validationSchema = Yup.object().shape({
    student_id: Yup.string().required('Required!'),
    session_id: Yup.string().required('Required!'),
    standard_id: Yup.string().required('Required!'),
    // detail: Yup.string().required('Required!')
  })

  const handleSubmit = async (values: {}) => {
    setLoading(true);
    try {
      const confirm = AlertConfirm({});

      if (await confirm) {
        const response = await API.updateEnrolment(values, prevValues.ENROLMENT_ID);

        navigate(`/enrolments?${searchParams.toString()}`);

        Alert({
          status: true,
          text: response.data.message || 'Enrolment updated...',
        });
      }
    } catch (error: any) {
      console.log(error);

      Alert({
        status: false,
        text: error?.data?.error_message || 'Enrolment update failed!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SubHeading>
        Edit Enrolment
      </SubHeading>

      <EnrolmentForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        handleSubmit={handleSubmit}
        loading={loading}
        disableFields={{ school: true, student: true }}
      />
    </div>
  )
}

export default EnrolmentEdit