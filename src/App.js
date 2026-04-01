import "./index.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
//import DashboardScreen from './components/DashboardScreen';
import { startTokenMonitor } from "./services/authService";

import { Provider } from "react-redux";
import store from "./redux/store";
import React, { useEffect } from "react";

import LoginScreen from "./screens/auth/LoginScreen";
import CheckMailScreen from "./screens/auth/CheckMailScreen";
import RegisterScreen from "./screens/auth/RegisterScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/auth/ResetPasswordScreen";
import Workbench from "./screens/workbench/Workbench";
import ProjectDetail from "./pages/ProjectDetail"; // สร้างหน้านี้ทีหลัง
import ViewerPage from "./pages/ViewerPage";
import authService from "./services/authService";
import modelService from "./services/modelService";
import DocumentPages from "./pages/DocumentPages";
import Documents from "./pages/TemplatePage/Documents";
import DocumentsId from "./pages/TemplatePage/DocumentsId";
import DocHistory from "./pages/TemplatePage/DocHistory";
import Maintenance from "./pages/TemplatePage/Maintenance";
import Map from "./pages/TemplatePage/Map"


function App() {
  useEffect(() => {
    startTokenMonitor();
  }, []);
  useEffect(() => {
    const preloadFavorites = async () => {
      try {
        const profile = await authService.getUserProfile();
        // console.log("👤 (App) User txid:", profile.txid);

        const favorites = await modelService.getFavoriteModels(profile.txid);
        // console.log("📦 (App) Favorite model IDs:", favorites);

        const preloadTasks = favorites.map((id) => {
        //   console.log("🔄 (App) Preloading model ID:", id);
          return modelService.getUrnAndTokenAndInitViewer(
            id,
            () => {},
            () => {},
            null,
            () => {},
            () => {}
          );
        });

        await Promise.all(preloadTasks);
        console.log("⭐ (App) Preloaded all favorite models.");
      } catch (err) {
        console.error("❌ Failed to preload favorite models:", err);
      }
    };

    preloadFavorites();
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/auth/login" />} />
            <Route path="/auth/login" element={<LoginScreen />} />
            <Route path="/auth/check-mail" element={<CheckMailScreen />} />
            <Route path="/auth/register" element={<RegisterScreen />} />
            <Route
              path="/auth/forgot-password"
              element={<ForgotPasswordScreen />}
            />
            <Route
              path="/auth/reset-password"
              element={<ResetPasswordScreen />}
            />
            <Route path="/workbench" element={<Workbench />} />
            <Route path="/Documents" element={<Documents />} />
            <Route path="/Documents/:id" element={<DocumentsId />} />
            <Route path="/DocHistory" element={<DocHistory />} />
            <Route path="/Maintenance" element={<Maintenance />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/viewer/:modelId" element={<ViewerPage />} />
            <Route path="/Map" element={<Map />} />
          </Routes>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
/*
//<Route path="/dashboard" element={<DashboardScreen />} />

*/
