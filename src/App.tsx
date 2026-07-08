import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import Layout from "@/components/Layout";
import Toaster from "@/components/ui/Toaster";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AssessCenter from "@/pages/AssessCenter";
import AssessRunner from "@/pages/AssessRunner";
import AssessReport from "@/pages/AssessReport";
import PlanList from "@/pages/PlanList";
import PlanEditor from "@/pages/PlanEditor";
import TreatmentPlanPage from "@/pages/TreatmentPlanPage";
import ProgressPage from "@/pages/ProgressPage";
import PathwayPage from "@/pages/PathwayPage";
import PatientsPage from "@/pages/PatientsPage";
import PatientDetail from "@/pages/PatientDetail";
import Profile from "@/pages/Profile";
import QuizPage from "@/pages/QuizPage";
import DocsPage from "@/pages/DocsPage";

export default function App() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assess" element={<AssessCenter />} />
            <Route path="/assess/:scaleId" element={<AssessRunner />} />
            <Route path="/assess/:scaleId/report/:recordId" element={<AssessReport />} />
            <Route path="/plan" element={<PlanList />} />
            <Route path="/plan/hub" element={<TreatmentPlanPage />} />
            <Route path="/plan/:planId" element={<PlanEditor />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/pathway" element={<PathwayPage />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:patientId" element={<PatientDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/docs" element={<DocsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}
