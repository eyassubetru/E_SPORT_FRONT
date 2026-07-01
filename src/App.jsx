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
import CreateStreamUserAccount from "./pages/CreateStreamUserAccount";
import useAuth from "./hooks/useAuth";
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";
import { db } from "./config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";



const App = () => {
  const location = useLocation();

  const { user, loading } = useAuth();
  const [hasAccount, setHasAccount] = useState(null);

  useEffect(() => {
    const checkUserProfile = async () => {
      // If still loading or no user, do nothing
      if (loading || !user) return;

      try {
        const userRef = doc(db, 'stream_users', user.uid);
        const docSnap = await getDoc(userRef);
        console.log("user=>",user)

        if (docSnap.exists()) {
          setHasAccount(true); // <--- Add this!
        } else {
          setHasAccount(false);
          //console.log('dont have account =========>');
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        // Depending on requirements, you might want to set hasAccount(false) 
        // or handle the error state specifically
      }
    };
    checkUserProfile();
  }, [loading, user]);

  //if(user && !hasAccount) return <CreateStreamUserAccount />

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