import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Home from "./pages/Home.jsx";
import Analytics from "./pages/Analytics.jsx";
import Calender from "./pages/Calender.jsx";

function App(){
  return(
    <Routes>
      <Route path="/signup" element={<Signup/>}></Route>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/analytics" element={<Analytics/>}></Route>
      <Route path="/calender" element={<Calender/>}></Route>
    </Routes>
  )
}
export default App;