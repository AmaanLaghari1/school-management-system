import { useEffect, useState } from "react";
import { deleteSchool, getSchool } from "../../api/SchoolRequest";
import DataTable , {Column} from "../../components/custom/DataTable";
import Button from "../../components/ui/button/Button";
import { Link, useNavigate } from "react-router";
import Alert from "../../components/custom/Alert";

interface School {
  SCHOOL_ID: string;
  SCHOOL_NAME: string;
  BRANCH: string;
  EMAIL: string;
  CONTACT_NO_1: string;
  ADDRESS: string;
  ACTIONS: string;
}

const SchoolPage = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const response = await getSchool();
      setSchools(response.data);
    } catch (error) {
      console.error("Failed to fetch schools", error);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await deleteSchool(id)
      // console.log(response)
      setSchools(schools.filter(item => item.SCHOOL_ID != id))
      Alert({status: true, text: "School deleted successfully..."})
    } catch (error) {
      Alert({status: false, text: "Unable to delete the school!"})
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column<School>[] = [
    // { key: "SCHOOL_ID", header: "ID", sortable: true  },
    { key: "SCHOOL_NAME", header: "School Name", sortable: true  },
    { key: "BRANCH", header: "Branch", sortable: true  },
    { key: "EMAIL", header: "Email", sortable: true  },
    { key: "CONTACT_NO_1", header: "Contact No.", sortable: true  },
    { key: "ADDRESS", header: "Address", sortable: true  },
    {
    key: "ACTIONS",
    header: "Actions",
    render: (row) => (
      <div className="flex space-x-2">
        <button className="text-blue-600 hover:underline text-sm"
        onClick={ () => {
          navigate('/school/edit', {
            state: {
              prevValues: row
            }
          })
        }}
        >Edit</button>
        {/* Optional: Add delete or other actions here */}
        <button onClick={() => handleDelete(row.SCHOOL_ID)} className="text-red-600 hover:underline text-sm">Delete</button>
      </div>
    ),
  },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">All Schools</h2>
        <Link to="/school/add">
          <Button size="sm" variant="primary">
            Add New +
          </Button>
        </Link>
      </div>

      <DataTable data={schools} columns={columns} itemsPerPage={10} />
    </div>
  );
};

export default SchoolPage;
