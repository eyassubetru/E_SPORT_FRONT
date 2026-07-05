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
import { getOrCreateDeviceId } from "./utility/getOrCreateDeviceId";
import axios from "axios";
import { auth } from "./config/firebaseConfig";
import { signOut } from "firebase/auth";


const App = () => {
  const location = useLocation();

  const { user, loading } = useAuth();
  const [hasAccount, setHasAccount] = useState(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUserAccount = async (e) => {
    try {
      const token = await user?.accessToken;
      const deviceId = getOrCreateDeviceId();
      //console.log(deviceId, token);
      await axios.post(`${apiUrl}/eStreamApi/setUserProfile`,
        {
          username: "",
          email: " ",
        },
        {
          headers: {
            "x-device-id": deviceId,
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      if (error.response?.data?.message === "Invalid Authorization header" ||
        error.response?.data?.message === "Invalid session" ||
        error.response?.data?.message === "Session required") {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    const checkUserProfile = async () => {
      if (loading || !user) return;

      //setCheckingProfile(true);
      //console.log(user);
      try {
        const userRef = doc(db, "stream_users", user.uid);
        const docSnap = await getDoc(userRef);

        const exists = docSnap.exists();
        setHasAccount(exists);

        if (!exists) {
          await handleCreateUserAccount();
        }

      } catch (error) {
        console.error("Error checking user profile:", error);
        setHasAccount(false); // optional fallback
      } finally {
        setCheckingProfile(false);
      }
    };
    //console.log("loading=>", loading , "checkingProfile=>", checkingProfile)
    checkUserProfile();
  }, [loading, user]);

  if (user && (loading || checkingProfile)) {
    return <LoadingScreen />
  }

  return (

    <Routes location={location} key={location.pathname}>

      {/* <Route path="/" element={
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
      } /> */}

     {/*  <Route element={<ProtectedRoute />}> */}
        <Route path="/" element={
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

        <Route path="/payment/:id" element={
          <>
            <PaymentPage />
          </>
        } />

    {/*   </Route> */}

    </Routes>

  );
}

export default App;