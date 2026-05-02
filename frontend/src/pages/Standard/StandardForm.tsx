import { Form, Formik, FormikHelpers } from "formik"
import Input from "../../components/form/input/InputField"
import { FC, useEffect, useMemo, useState } from "react";
import * as Yup from 'yup'
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import Select from "../../components/form/Select";
import { getSchool } from "../../api/SchoolRequest";
import { filterSchoolsForUser, mapOptions } from "../../helpers/helper";
import { useUser } from "../../hooks/useUser";

interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (
        values: any,
        helpers: FormikHelpers<any>
    ) => void | Promise<void>;
    loading: boolean;
}


const StandardForm: FC<FormProps> = ({ initialValues, validationSchema, handleSubmit, loading }) => {
    const [schools, setSchools] = useState<any>([])
    const { user } = useUser()
    const fetchSchools = async () => {
        try {
            const response = await getSchool()
            setSchools(filterSchoolsForUser(response.data || [], user))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSchools()
    }, [])

    const schoolOptions = useMemo(() => {
        return mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
    }, [schools])

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
            >
                {
                    () => <Form>
                        <Select
                            label="School"
                            name="school_id"
                            options={schoolOptions}
                            required={true}
                        />
                        <Input
                            name="standard_name"
                            type="text"
                            placeholder="Enter standard name"
                            label="Standard Name"
                            required
                        />
                        <Input
                            name="section"
                            type="text"
                            placeholder="Enter section"
                            label="Section"
                            required
                        />
                        <Input
                            name="remarks"
                            type="text"
                            placeholder="Enter remarks"
                            label="Remarks"
                        />

                        <Button
                            size="sm"
                            variant="success"
                            className="mt-5"
                            endIcon={<BoxIcon className="size-5" />}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </Form>
                }

            </Formik>
        </div>
    )
}

export default StandardForm
