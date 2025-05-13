import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Visual from "./Pages/Visual/Visual";
import Navbar from "./Components/Navbar/Navbar"; 

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/charts" element={<Visual />} />
      </Routes>
    </Router>
  );
}

export default App;