import { Routes, Route } from "react-router";
import SearchPage from "./pages/SearchPage.jsx";
import Login from "./pages/Login.jsx";
import ManageAdmin from "./pages/ManageAdmin.jsx";
import ManageBatches from "./pages/ManageBatches.jsx";
import ManageClasses from "./pages/ManageClasses.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StudentPage from "./pages/StudentPage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manageAdmin" element={<ManageAdmin />} />
      <Route path="/manageBatches" element={<ManageBatches />} />
      <Route path="/manageClasses" element={<ManageClasses />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/student/:id" element={<StudentPage />} />
    </Routes>
  );
}

export default App;
