import { Routes, Route } from "react-router";
import SearchPage from "./pages/SearchPage.jsx";
import Login from "./pages/Login.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
