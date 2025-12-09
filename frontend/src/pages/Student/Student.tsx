import { useEffect, useMemo, useState } from "react";
import { deleteSchool, getSchool } from "../../api/SchoolRequest";
import DataTable, { Column } from "../../components/custom/DataTable";
import Button from "../../components/ui/button/Button";
import { Link, useNavigate } from "react-router";
import Alert from "../../components/custom/Alert";
import { getStudentBySchoolId } from "../../api/StudentRequest";
import { mapOptions } from "../../helpers/helper";
import { Formik, Form } from "formik";
import * as Yup from 'yup'
import Select from "../../components/form/Select";

interface Student {
  STUDENT_ID: string;
  NAME: string;
  FNAME: string;
  SURNAME: string;
  EMAIL: string;
  CNIC_NO: string;
  'school[SCHOOL_NAME]': string;
  ACTIONS: string;
}

const Student = () => {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<[]>([])
  const navigate = useNavigate()

  const fetchSchools = async () => {
    try {
      const response = await getSchool()
      console.log(response)
      setSchools(response.data)
    } catch (error: any) {
      console.log(error)
    }
  }

  const schoolOptions = useMemo(() => {
    return mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
  }, [schools])

  const fetchData = async (id: '') => {
    setLoading(true)
    try {
      const response = await getStudentBySchoolId(id);
      //   console.log(response)
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
    setLoading(false)
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await deleteSchool(id)
      // console.log(response)
      setStudents(students.filter(item => item.STUDENT_ID != id))
      Alert({ status: true, text: "School deleted successfully..." })
    } catch (error) {
      Alert({ status: false, text: "Unable to delete the school!" })
      console.log(error)
    }
  }

  useEffect(() => {
    fetchSchools();
  }, []);

  const columns: Column<Student>[] = [
    { key: "STUDENT_ID", header: "ID", sortable: true },
    { key: "NAME", header: "Name", sortable: true },
    { key: "FNAME", header: "Father's Name", sortable: true },
    { key: "SURNAME", header: "Surname", sortable: true },
    { key: "CNIC_NO", header: "CNIC No.", sortable: true },
    { key: "EMAIL", header: "Email", sortable: true },
    { key: "school[SCHOOL_NAME]", header: "School Name", sortable: true },
    { key: "guardian[TITLE]", header: "Guardian Relation", sortable: true },
    {
      key: "ACTIONS",
      header: "Actions",
      render: (row) => (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:underline text-sm"
            onClick={() => {
              navigate('/student/edit', {
                state: {
                  prevValues: row
                }
              })
            }}
          >Edit</button>
          {/* Optional: Add delete or other actions here */}
          <button onClick={() => handleDelete(row.STUDENT_ID)} className="text-red-600 hover:underline text-sm">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Formik
        initialValues={{
          'school_id': ''
        }}
        validationSchema={Yup.object().shape({
          school_id: Yup.string().required('Please select school!')
        })}
        onSubmit={(values: any) => {
          fetchData(values.school_id)
        }}
      >
        {
          ({ }) => (
            <Form>
              <div className="flex items-end">
                <div className="w-md mx-2">
                  <Select
                    name="school_id"
                    label="Select School"
                    options={schoolOptions}
                    required={true}
                  />
                </div>

                <div className="">
                  <Button
                    size="sm"
                    variant="success"
                    className=" my-auto self-end"
                    type="submit"
                    disabled={loading}
                  >
                    {
                      loading ? 'Fetching Students...' : 'Search'
                    }
                  </Button>
                </div>

              </div>
            </Form>
          )
        }

      </Formik>
      {
        students.length > 0 &&
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">All Students</h2>
            <Link to="/student/add">
              <Button size="sm" variant="primary">
                Add New +
              </Button>
            </Link>
          </div>

          <div style={{ width: '100%', overflow: "hidden" }}>

            <DataTable data={students} columns={columns} itemsPerPage={10} />
          </div>
        </>
      }
    </div>
  );
};

export default Student;
