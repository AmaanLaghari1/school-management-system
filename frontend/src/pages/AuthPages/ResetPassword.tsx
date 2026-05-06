import React from 'react'
import AuthLayout from './AuthPageLayout'
import SubHeading from '../../components/custom/SubHeading'
import Input from '../../components/form/input/InputField'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Button from '../../components/ui/button/Button'
import { useSearchParams } from 'react-router'
import { resetPassword } from '../../api/AuthRequest'
import Alert from '../../components/custom/Alert'

const ResetPassword = () => {
    const [loading, setLoading] = React.useState(false);
    const [params] = useSearchParams();

    const token = params.get('token');
    // const email = params.get('email');

    return (
        <AuthLayout>
            <div className="flex flex-wrap flex-col flex-1">
                <div className="flex flex-wrap flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <SubHeading>
                        Reset Password
                    </SubHeading>
                    <small className='dark:text-white'>
                        (Please enter your new password below)
                    </small>

                    <Formik
                        initialValues={{
                            forgetPasswordToken: token || '',
                            newPassword: '',
                            confirmNewPassword: ''
                        }}
                        validationSchema={Yup.object().shape({
                            newPassword: Yup.string().min(6, 'Password must be at least 6 characters!').required('Required!'),
                            confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match!').required('Required!')
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                setLoading(true);
                                const response = await resetPassword(values);
                                // console.log(response);

                                Alert({status: true, text: "Password reset successful!"});
                            } catch (err: any) {
                                Alert({status: false, text: err?.data?.message || "Token invalid or expired."})
                                console.error(err);
                            } finally {
                                setSubmitting(false);
                                setLoading(false);
                            }
                        }}
                    >
                        {() => (
                            <Form>
                                <div>
                                    <Input
                                        label='New Password'
                                        type='password'
                                        name='newPassword'
                                    />
                                </div>
                                <div>
                                    <Input
                                        label='Confirm New Password'
                                        type='password'
                                        name='confirmNewPassword'
                                    />
                                </div>
                                <Button disabled={loading} className='mt-5' type="submit">
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </AuthLayout>
    )
}

export default React.memo(ResetPassword)