import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CGreenLanding from "@/pages/CGreenLanding";
import LifeAtCGreen from "@/pages/LifeAtCGreen";
import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import Dashboard from "@/admin/Dashboard";
import GalleryManager from "@/admin/GalleryManager";
import Enquiries from "@/admin/Enquiries";
import SystemStatus from "@/admin/SystemStatus";
import { VisionMissionEditor, OurReachEditor } from "@/admin/SectionEditors";
import {
  ManagingTeamSection,
  NomineeDirectorsSection,
  AdvisorsSection,
  PartnersSection,
  LendersSection,
} from "@/admin/sections";
import { AuthProvider, RequireAdmin } from "@/admin/AuthContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App" style={{ zoom: 0.85 }}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<CGreenLanding />} />
            <Route path="/life-at-cgreen" element={<LifeAtCGreen />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="vision-mission" element={<VisionMissionEditor />} />
              <Route path="our-reach" element={<OurReachEditor />} />
              <Route path="team" element={<ManagingTeamSection />} />
              <Route path="nominee-directors" element={<NomineeDirectorsSection />} />
              <Route path="advisors" element={<AdvisorsSection />} />
              <Route path="partners" element={<PartnersSection />} />
              <Route path="lenders" element={<LendersSection />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="system" element={<SystemStatus />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
