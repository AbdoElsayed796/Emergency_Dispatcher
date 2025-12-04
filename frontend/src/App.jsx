import './App.css'
import DispatcherDashboard from "./views/Dispatcher/DispatcherDashboard.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<DispatcherDashboard />} />
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
