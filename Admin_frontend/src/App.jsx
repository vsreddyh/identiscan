import { Routes, Route } from "react-router";
import SearchPage from "./pages/SearchPage.jsx";
import Login from "./pages/Login.jsx";
import ManageAdmin from "./pages/ManageAdmin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manageAdmin" element={<ManageAdmin />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
