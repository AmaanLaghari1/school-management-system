import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
// import Button from "../ui/button/Button";
import { Form, Formik } from "formik";
import * as Yup from 'yup'
import { useDispatch } from "react-redux";
import { login } from "../../redux/actions/AuthAction";

export default function SignInForm() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch<any>()
  
  const handleSubmit = async (values: {}) => {
    setLoading(true)
    await dispatch(login(values))
    setLoading(false)
  }
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Invalid email!').required('Required!'),
              password: Yup.string().required('Required!')
            })}
            onSubmit={handleSubmit}
            >
              {
                () => (
                  <Form>
                    <div className="space-y-6">
                      <div>
                        <Label>
                          Email <span className="text-error-500">*</span>{" "}
                        </Label>
                        <Input
                        name="email"
                        placeholder="info@gmail.com" />
                      </div>
                      <div>
                        <Label>
                          Password <span className="text-error-500">*</span>{" "}
                        </Label>
                        <div className="relative">
                          <Input
                          name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* <div className="flex items-center gap-3">
                          <Checkbox checked={isChecked} onChange={setIsChecked} />
                          <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                            Keep me logged in
                          </span>
                        </div> */}
                        <Link
                          to="/reset-password"
                          className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div>
                        <button disabled={loading} type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                          {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                      </div>
                    </div>
                  </Form>
                )
              }

            </Formik>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
