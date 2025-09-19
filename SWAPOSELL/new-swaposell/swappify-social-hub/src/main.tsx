import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered:", reg))
      .catch((err) => console.error("SW error:", err));
  });
}


createRoot(document.getElementById("root")!).render(<App />);
