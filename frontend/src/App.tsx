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
import PromoteClass from "./pages/Enrolment/PromoteClass";
import FeeCategory from "./pages/FeeManagement/FeeCategory/FeeCategory";
import FeeList from "./pages/FeeManagement/FeeList/FeeList";
import FeeLedger from "./pages/FeeManagement/FeeLedger/FeeLedger";
import FeeVoucher from "./pages/FeeManagement/FeeVoucher/FeeVoucher";
import UserProfiles from "./pages/UserProfiles";
import Users from "./pages/Users/Users";
import FeeVoucherAdd from "./pages/FeeManagement/FeeVoucher/FeeVoucherAdd";
import FeeVoucherEdit from "./pages/FeeManagement/FeeVoucher/FeeVoucherEdit";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";

export default function App() {
  const auth = useSelector((state:any) => state.auth?.authData)
  const token = auth?.token
  // console.log(auth)

  // const roles = useSelector((state:any) => state.roles?.allRoles)
  // console.log(roles)

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
            <Route index path="/enrolment/promote/class" element={<PromoteClass />} />
            <Route index path="/fee/categories" element={<FeeCategory />} />
            <Route index path="/fee/lists" element={<FeeList />} />
            <Route index path="/fee/ledgers" element={<FeeLedger />} />
            <Route index path="/fee/vouchers" element={<FeeVoucher />} />
            <Route index path="/fee/voucher/add" element={<FeeVoucherAdd />} />
            <Route index path="/fee/voucher/edit" element={<FeeVoucherEdit />} />
            <Route index path="/profile" element={<UserProfiles />} />
            <Route path="/users" element={<Users />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={token ? <Navigate to='/' /> : <SignIn />} />
          <Route path="/signup" element={token ? <Navigate to='/' /> : <SignUp />} />
          <Route path="/forgot_password" element={token ? <Navigate to='/' /> : <ForgotPassword />} />
          <Route path="/reset_password" element={token ? <Navigate to='/' /> : <ResetPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
