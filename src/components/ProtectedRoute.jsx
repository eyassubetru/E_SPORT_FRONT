import { Navigate ,Outlet } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import Header from "./Header";
import { useAuth } from "../context/AuthContext";

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