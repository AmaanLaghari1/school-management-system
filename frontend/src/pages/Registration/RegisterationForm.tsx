import React, { FC, useEffect, useMemo, useState } from "react";
import {
    ErrorMessage,
    FieldArray,
    Form,
    Formik,
    FormikHelpers,
} from "formik";
import * as Yup from "yup";

import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import Radio from "../../components/form/input/Radio";
import Label from "../../components/form/Label";
import DatePicker from "../../components/form/date-picker";

import { BoxIcon, Trash2 } from "lucide-react";

import { getSchool } from "../../api/SchoolRequest";
import { getGuardianRelation } from "../../api/StudentRequest";
import { getSessionBySchoolId } from "../../api/SessionRequest";
import { getStandardBySchoolId } from "../../api/StandardRequest";

import { mapOptions } from "../../helpers/helper";
import { useLocation } from "react-router";

interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (
        values: any,
        helpers: FormikHelpers<any>
    ) => void | Promise<void>;
    loading: boolean;
}

const RegisterationForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {
    const [optLoading, setOptLoading] = useState(false);

    const [schools, setSchools] = useState<[]>([]);
    const [sessions, setSessions] = useState<any>({});
    const [standards, setStandards] = useState<[]>([]);
    const [guardianRelations, setGuardianRelations] = useState<[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setOptLoading(true);

            try {
                const schoolRes = await getSchool();
                const relationRes = await getGuardianRelation();

                setSchools(schoolRes.data);
                setGuardianRelations(relationRes.data);
            } catch (error) {
                console.log(error);
            } finally {
                setOptLoading(false);
            }
        };

        fetchData();
    }, []);

    const schoolOptions = useMemo(() => {
        return mapOptions(schools, "SCHOOL_NAME", "SCHOOL_ID");
    }, [schools]);

    const sessionOptions = useMemo(() => {
        return sessions?.SESSION_ID
            ? [
                {
                    label: sessions.SESSION_NAME,
                    value: sessions.SESSION_ID,
                },
            ]
            : [];
    }, [sessions]);

    const standardOptions = useMemo(() => {
        return mapOptions(standards, "STANDARD_NAME", "STANDARD_ID");
    }, [standards]);

    const guardianRelationOptions = useMemo(() => {
        return mapOptions(guardianRelations, "TITLE", "TITLE");
    }, [guardianRelations]);

    const handleSchoolChange = async (
        schoolId: any,
        setFieldValue: any
    ) => {
        try {
            const sessionResponse = await getSessionBySchoolId(schoolId);
            const standardResponse =
                await getStandardBySchoolId(schoolId);

            setSessions(sessionResponse.data);

            setFieldValue(
                "session_id",
                sessionResponse.data.SESSION_ID
            );

            setStandards(standardResponse.data);
        } catch (error) {
            console.error("Error fetching school data:", error);
        }
    };

    const location = useLocation()
    const {prevValues} = location.state || {}

    useEffect(() => {
        if (prevValues?.SCHOOL_ID) {
            handleSchoolChange(prevValues.SCHOOL_ID, () => { })
        }
    }, [prevValues?.SCHOOL_ID]);

    return (
        !optLoading && (
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) =>
                    handleSubmit(values, helpers)
                }
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-6" encType="multipart/form-data">
                        {/* Admission Information */}
                        <div>
                            <h6 className="mb-2 text-gray-800 dark:text-white/90">
                                Admission Information
                                <span className="text-red-500">*</span>
                            </h6>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                                <Select
                                    name="school_id"
                                    label="School"
                                    options={schoolOptions}
                                    onChange={(e) =>
                                        handleSchoolChange(
                                            e,
                                            setFieldValue
                                        )
                                    }
                                    required
                                />

                                <div className="hidden">
                                    <Select
                                        name="session_id"
                                        label="Session"
                                        options={sessionOptions}
                                        required
                                        disabled
                                    />
                                </div>

                                <Select
                                    name="standard_id"
                                    label="Class"
                                    options={standardOptions}
                                    required
                                />

                                <Input
                                    name="last_school"
                                    label="Last School Attended"
                                    placeholder="Enter last school"
                                />
                            </div>

                            {/* Student Information */}
                            <h6 className="mb-2 text-gray-800 dark:text-white/90">
                                Student Information
                                <span className="text-red-500">*</span>
                            </h6>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input
                                    name="name"
                                    label="Name"
                                    placeholder="Enter student name"
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(
                                                /[^a-zA-Z\s]/g,
                                                ""
                                            )
                                            .toUpperCase())
                                    }
                                />

                                <Input
                                    name="surname"
                                    label="Surname"
                                    placeholder="Enter surname"
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(
                                                /[^a-zA-Z\s]/g,
                                                ""
                                            )
                                            .toUpperCase())
                                    }
                                />

                                <Input
                                    name="mobile_no"
                                    label="Mobile No."
                                    placeholder="Enter mobile no."
                                    required
                                    onInput={(e: any) =>
                                    (
                                        e.target.value = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 11)
                                    )
                                    }
                                />

                                <Input
                                    name="email"
                                    label="Email"
                                    placeholder="Enter email address"
                                />

                                <DatePicker
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    label="Date of Birth"
                                    required
                                />

                                {/* Gender */}
                                <div className="mt-4">
                                    <Label className="font-medium">
                                        Gender
                                        <span className="text-error-500">
                                            *
                                        </span>
                                    </Label>

                                    <div className="flex flex-wrap gap-4 mt-2">
                                        <Radio
                                            id="male"
                                            name="gender"
                                            value="1"
                                            label="Male"
                                            checked={values.gender == "1"}
                                        />

                                        <Radio
                                            id="female"
                                            name="gender"
                                            value="2"
                                            label="Female"
                                            checked={values.gender == "2"}
                                        />
                                    </div>

                                    <div className="mt-1.5 text-xs text-error-500">
                                        <ErrorMessage name="gender" />
                                    </div>
                                </div>

                                <Input
                                    name="permanent_address"
                                    label="Home Address"
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value.toUpperCase())
                                    }
                                />
                            </div>

                            {/* Parent Information */}
                            <h6 className="mb-2 text-gray-800 dark:text-white/90 mt-4">
                                Parent Information
                                <span className="text-red-500">*</span>
                            </h6>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                                <Input
                                    name="fname"
                                    label="Father's Name"
                                    placeholder="Enter father's name"
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(
                                                /[^a-zA-Z\s]/g,
                                                ""
                                            )
                                            .toUpperCase())
                                    }
                                />

                                <Input
                                    name="father_cnic_no"
                                    label="CNIC No."
                                    placeholder="Enter CNIC No."
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 13))
                                    }
                                />

                                <Input
                                    name="father_occupation"
                                    label="Occupation"
                                    placeholder="Enter father's occupation"
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(
                                                /[^a-zA-Z\s]/g,
                                                ""
                                            )
                                            .toUpperCase())
                                    }
                                />

                                <Select
                                    name="is_uni_employee"
                                    label="Is University Employee?"
                                    options={[
                                        {
                                            label: "Yes",
                                            value: "1",
                                        },
                                        {
                                            label: "No",
                                            value: "2",
                                        },
                                    ]}
                                />

                                {values.is_uni_employee === "1" && (
                                    <>
                                        <Input
                                            name="employee_designation"
                                            label="Designation"
                                            required
                                            onInput={(e: any) =>
                                            (
                                                e.target.value =
                                                e.target.value.toUpperCase()
                                            )
                                            }
                                        />

                                        <Input
                                            name="employee_dept"
                                            label="Department"
                                            required
                                            onInput={(e: any) =>
                                            (e.target.value =
                                                e.target.value
                                                    .replace(
                                                        /[^a-zA-Z\s]/g,
                                                        ""
                                                    )
                                                    .toUpperCase())
                                            }
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Guardian Information */}
                        <div>
                            <h6 className="mb-2 text-gray-800 dark:text-white/90">
                                Guardian Information
                                <span className="text-red-500">*</span>
                            </h6>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Select
                                    name="guardian_relation_id"
                                    label="Guardian Relation"
                                    options={
                                        guardianRelationOptions
                                    }
                                    required
                                />

                                <Input
                                    name="guardian_name"
                                    label="Name"
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(
                                                /[^a-zA-Z\s]/g,
                                                ""
                                            )
                                            .toUpperCase())
                                    }
                                />

                                <Input
                                    name="guardian_email"
                                    label="Email"
                                />

                                <Input
                                    name="guardian_cnic_no"
                                    label="CNIC No."
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 13))
                                    }
                                />

                                <Input
                                    name="guardian_mobile_no"
                                    label="Mobile No."
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 11))
                                    }
                                />

                                <Input
                                    name="guardian_address"
                                    label="Address"
                                    required
                                    onInput={(e: any) =>
                                    (e.target.value =
                                        e.target.value.toUpperCase())
                                    }
                                />
                            </div>
                        </div>

                        {/* Siblings Information */}
                        <div>
                            <h6 className="mb-2 text-gray-800 dark:text-white/90">
                                Brothers/Sisters studying in
                                Model School, University of Sindh,
                                Hyderabad (Optional)
                            </h6>

                            <FieldArray name="siblings_enrolled">
                                {({ push, remove }) => (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <Input
                                                name="sibling_name"
                                                label="Sibling Name"
                                                onInput={(e: any) =>
                                                (e.target.value =
                                                    e.target.value
                                                        .replace(
                                                            /[^a-zA-Z\s]/g,
                                                            ""
                                                        )
                                                        .toUpperCase())
                                                }
                                            />

                                            <Input
                                                name="class_and_section"
                                                label="Class & Section"
                                            />

                                            <Input
                                                name="gr_no"
                                                label="GR No."
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    if (
                                                        values.sibling_name &&
                                                        values.class_and_section
                                                    ) {
                                                        push({
                                                            sibling_name:
                                                                values.sibling_name,
                                                            class_and_section:
                                                                values.class_and_section,
                                                            gr_no:
                                                                values.gr_no,
                                                        });

                                                        setFieldValue(
                                                            "sibling_name",
                                                            ""
                                                        );

                                                        setFieldValue(
                                                            "class_and_section",
                                                            ""
                                                        );

                                                        setFieldValue(
                                                            "gr_no",
                                                            ""
                                                        );
                                                    }
                                                }}
                                            >
                                                Add Sibling
                                            </Button>
                                        </div>

                                        {values.siblings_enrolled
                                            .length > 0 && (
                                                <div className="overflow-x-auto mt-4">
                                                    <table className="w-full border border-gray-300 dark:border-gray-700">
                                                        <thead>
                                                            <tr className="bg-gray-100 dark:bg-gray-700">
                                                                <th className="border p-2">
                                                                    Name
                                                                </th>

                                                                <th className="border p-2">
                                                                    Class &
                                                                    Section
                                                                </th>

                                                                <th className="border p-2">
                                                                    GR No
                                                                </th>

                                                                <th className="border p-2">
                                                                    Action
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {values.siblings_enrolled.map(
                                                                (
                                                                    sibling: any,
                                                                    index: number
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td className="border p-2">
                                                                            {
                                                                                sibling.sibling_name
                                                                            }
                                                                        </td>

                                                                        <td className="border p-2">
                                                                            {
                                                                                sibling.class_and_section
                                                                            }
                                                                        </td>

                                                                        <td className="border p-2">
                                                                            {
                                                                                sibling.gr_no
                                                                            }
                                                                        </td>

                                                                        <td className="border p-2 text-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    remove(
                                                                                        index
                                                                                    )
                                                                                }
                                                                                className="text-red-500 hover:text-red-700"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                    </>
                                )}
                            </FieldArray>
                        </div>

                        {/* Student Photo */}
                        <div className="mb-3">
                            <label className="form-label">Student Photo</label>
                            <div>
                                <input
                                    type="file"
                                    name="student_photo"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        setFieldValue('student_photo', file);
                                    }}
                                    className="form-control block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                />
                            </div>
                            <div className="mt-1.5 text-xs text-error-500">
                                <ErrorMessage name="student_photo" />
                            </div>
                        {/* Preview if prevValues exist */}
                            {values.student_photo && (
                                <div className="mt-2">
                                    <img
                                        src={
                                            typeof values.student_photo === "string"
                                                ? `${import.meta.env.VITE_ASSET_URL}${values.student_photo}`
                                                : URL.createObjectURL(values.student_photo)
                                        }
                                        alt="Student Photo"
                                        className="h-32 w-32 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>


                        {/* Submit */}
                        <Button
                            size="sm"
                            variant="success"
                            className="mt-2"
                            endIcon={
                                <BoxIcon className="size-5" />
                            }
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </Form>
                )}
            </Formik>
        )
    );
};

export default React.memo(RegisterationForm);
