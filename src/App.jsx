import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import UserProfilePage from "./pages/UserProfilePage";
import PaymentPage from "./pages/PaymentPage";
import ForgottenPassword from "./components/ForgottenPassword";
import CreateStreamUserAccount from "./pages/CreateStreamUserAccount";
import useAuth from "./hooks/useAuth";
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";
import { db } from "./config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import LoadingScreen from "./components/LoadingScreen";



const App = () => {
  const location = useLocation();

  const { user, loading } = useAuth();
  const [hasAccount, setHasAccount] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (loading || !user) return;

      setCheckingProfile(true);

      try {
        const userRef = doc(db, "stream_users", user.uid);
        const docSnap = await getDoc(userRef);

        setHasAccount(docSnap.exists());
      } catch (error) {
        console.error("Error checking user profile:", error);
        setHasAccount(false); // optional fallback
      } finally {
        setCheckingProfile(false);
      }
    };

    checkUserProfile();
  }, [loading, user]);

  if (loading || checkingProfile) {
    return <LoadingScreen />
  }

  if (user && hasAccount === false) {
    return <CreateStreamUserAccount />;
  }



  return (

    <Routes location={location} key={location.pathname}>

      <Route path="/" element={
        <>
          <LoginForm />
        </>
      } />

      <Route path="/signup" element={
        <>
          < RegisterForm />
        </>
      } />
      <Route path="/forgotten-password" element={
        <>
          < ForgottenPassword />
        </>
      } />

      <Route element={<ProtectedRoute />}>
        <Route path="/event" element={
          <>
            <Events />
          </>
        } />

        <Route path="/event/:id" element={
          <>
            <EventDetail />
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