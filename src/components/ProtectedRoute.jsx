import { Navigate ,Outlet } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
 

 
  
  if(user){
    console.log("user exist")
    
  }else{
      console.log("not user exist")
  }

  if (loading) return <LoadingScreen />;
 

  if (!user) {
    return <Navigate to="/" replace />;
  }

    return (
       <>
     <Header />
     <Outlet />
    
    </>
    )
   


}