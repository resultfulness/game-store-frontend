import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Account from "./pages/Account";
import Posts from "./pages/Posts";
import { useAuth } from "./auth";

export default function App() {
  const { user } = useAuth();

  return <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/posts" element={<Posts />} />
        {user
          ? <Route path="/account" element={<Account />} />
          : <Route path="/account" element={<Navigate to="/" replace />} />
        }
      </Route>
    </Routes>
  </BrowserRouter>;
}
