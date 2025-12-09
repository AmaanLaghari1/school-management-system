import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import School from "./pages/School/School";
import SchoolAdd from "./pages/School/SchoolAdd";
import SchoolEdit from "./pages/School/SchoolEdit";
import Student from "./pages/Student/Student";
import StudentAdd from "./pages/Student/StudentAdd";
import StudentEdit from "./pages/Student/StudentEdit";
import { useSelector } from "react-redux";
import Session from "./pages/Session/Session";
import SessionEdit from "./pages/Session/SessionEdit";
import SessionAdd from "./pages/Session/SessionAdd";
import Standard from "./pages/Standard/Standard";
import StandardAdd from "./pages/Standard/StandardAdd";
import StandardEdit from "./pages/Standard/StandardEdit";
import Enrolment from "./pages/Enrolment/Enrolment";
import EnrolmentAdd from "./pages/Enrolment/EnrolmentAdd";
import EnrolmentEdit from "./pages/Enrolment/EnrolmentEdit";

export default function App() {
  const token = useSelector((state:any) => state.auth?.authData?.token)
  console.log(token)
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={!token ? <Navigate to='/signin' /> : <AppLayout />}>
            <Route index path="/" element={<Home />} />
            <Route index path="/schools" element={<School />} />
            <Route index path="/school/add" element={<SchoolAdd />} />
            <Route index path="/school/edit" element={<SchoolEdit />} />
            <Route index path="/students" element={<Student />} />
            <Route index path="/student/add" element={<StudentAdd />} />
            <Route index path="/student/edit" element={<StudentEdit />} />
            <Route index path="/sessions" element={<Session />} />
            <Route index path="/session/add" element={<SessionAdd />} />
            <Route index path="/session/edit" element={<SessionEdit />} />
            <Route index path="/standards" element={<Standard />} />
            <Route index path="/standard/add" element={<StandardAdd />} />
            <Route index path="/standard/edit" element={<StandardEdit />} />
            <Route index path="/enrolments" element={<Enrolment />} />
            <Route index path="/enrolment/add" element={<EnrolmentAdd />} />
            <Route index path="/enrolment/edit" element={<EnrolmentEdit />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={token ? <Navigate to='/' /> : <SignIn />} />
          <Route path="/signup" element={token ? <Navigate to='/' /> : <SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
