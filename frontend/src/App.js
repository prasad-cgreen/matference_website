import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CGreenLanding from "@/pages/CGreenLanding";
import LifeAtCGreen from "@/pages/LifeAtCGreen";
import Insight from "@/pages/Insight";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App" style={{ zoom: 0.85 }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CGreenLanding />} />
          <Route path="/life-at-cgreen" element={<LifeAtCGreen />} />
          <Route path="/insight" element={<Insight />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
