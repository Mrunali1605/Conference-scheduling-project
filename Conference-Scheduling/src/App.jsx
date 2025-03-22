import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Components/Home/Home";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Scheduler from "./Components/Schedular/Schedular";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import Speakers from "./Components/Speakers/Speakers";
import AddSpeaker from "./Components/Speakers/AddSpeaker";
import RegisterNow from "./Components/RegisterNow/RegisterNow";
import Unauthorized from "./Components/Unauthorized/Unauthorized";
import Venues from "./Components/Venues/Venues";
import AddVenues from "./Components/Venues/AddVenues";
import { checkAdminStatus } from "./Utile";
const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("userRole") === "admin";
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/schedular" element={<Scheduler />} />

        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/speakers"
          element={
            <ProtectedRoute>
              <Speakers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-speaker"
          element={
            <ProtectedRoute>
              <AddSpeaker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues"
          element={
            <ProtectedRoute>
              <Venues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-venues"
          element={
            <ProtectedRoute>
              <AddVenues />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/register" element={<RegisterNow />} /> */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/RegisterNow" element={<RegisterNow/>}/>
      </Routes>
    </>
  );
}
export default App;
