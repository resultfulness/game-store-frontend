import { BrowserRouter, Route, Routes } from "react-router";
import Home from './pages/Home';
import About from './pages/About';
import Layout from './components/Layout';

export default function App() {
  return <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  </BrowserRouter>;
}
