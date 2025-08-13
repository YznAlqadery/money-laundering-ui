import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./Login";
import Signup from "./Signup";
import FraudCycles from "./FraudCycles";
import MotifManager from "./admin/MotifManager";
import Users from "./admin/Users";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/fraud-cycles" element={<FraudCycles />} />
      <Route path="/admin" element={<MotifManager />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
}
