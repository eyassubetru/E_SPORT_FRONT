import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import UserProfilePage from "./pages/UserProfilePage";
import PaymentPage from "./pages/PaymentPage";
import ForgottenPassword from "./components/ForgottenPassword";



const  App = () => {
  const location = useLocation();

  return (

      <Routes location={location} key={location.pathname}>

        <Route path="/" element={
          <>
            <LoginForm />
          </>
        } />

        <Route path="/signup" element={
          <>
            < RegisterForm/>
          </>
        } />
        <Route path="/forgotten-password" element={
          <>
            < ForgottenPassword/>
          </>
        } />

        <Route element={<ProtectedRoute />}>
          <Route path="/tournament" element={
            <>
              <Tournaments />
            </>
          } />

          <Route path="/tournament/:id" element={
            <>
              <TournamentDetail />
            </>
          } />

          <Route path="/profile" element={
            <>
              <UserProfilePage />
            </>
          } />

          <Route path="/payment" element={
            <>
              <PaymentPage />
            </>
          } />
        </Route>

      </Routes>

  );
}

export default App;