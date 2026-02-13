import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Layout } from 'antd';
import LoginAndRegister from './pages/LoginAndRegister';
import CreateUser from "./pages/CreateUser";
import { PrivateRoute } from "./routes/PrivateRoute";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { user } = useAuth();

  return (
    <Layout className="content">
      <Routes>
        <Route
          path="/"
          element={<LoginAndRegister />}
        />            <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginAndRegister />}
        />

        <Route
          path="/admin"
          element={<CreateUser />}
        />

        {/* Rotas privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Layout>
  )
};

export default App;