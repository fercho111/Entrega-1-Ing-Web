import { Navigate, Route, Routes } from "react-router";
import AppNavbar from "./components/layout/AppNavbar";
import { AppProvider } from "./context/AppContext";
import CreateParchePage from "./pages/CreateParchePage";
import CreatePlanPage from "./pages/CreatePlanPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ParcheDetailsPage from "./pages/ParcheDetailsPage";
import PlanDetailsPage from "./pages/PlanDetailsPage";
import RankingsPage from "./pages/RankingsPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <AppProvider>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/parches/new" element={<CreateParchePage />} />
        <Route path="/parches/:id" element={<ParcheDetailsPage />} />
        <Route path="/parches/:id/plans/new" element={<CreatePlanPage />} />
        <Route path="/plans/:id" element={<PlanDetailsPage />} />
        <Route path="/rankings" element={<RankingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}
