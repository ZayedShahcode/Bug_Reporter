import { BrowserRouter,Routes,Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";


function App() {
  return(
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route index path="/" element={<SignUp/>}></Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/admin" element={<AdminDashboard/>}></Route>
      </Routes>  
    </BrowserRouter>
  )
}

export default App
