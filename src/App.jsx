import { Routes, Route } from "react-router-dom";
import "./App.css";
import AuthForm from "./pages/AuthForm";
import Calendar from "./pages/Calendar";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./auth/PrivateRoute";
import Table from "./pages/Table";
const App = () => {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} />

        <Route element={<PrivateRoute />}>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/table/:eventType" element={<Table />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
