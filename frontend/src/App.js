import "@/App.css";
import CGreenLanding from "@/pages/CGreenLanding";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <CGreenLanding />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
