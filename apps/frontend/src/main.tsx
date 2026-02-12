import "antd/dist/reset.css";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import { App as AntdApp, ConfigProvider, theme } from "antd";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#000000",
              colorPrimaryHover: "#FFFFFF",
              colorLink: "#FFFFFF",
              colorTextDisabled: "#666666",
              fontFamily: "'Poppins', sans-serif",
            }
          }}
        >
          <AntdApp>
            <App />
          </AntdApp>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
)