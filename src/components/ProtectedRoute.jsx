import { Navigate ,Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "./LoadingScreen";
import Header from "./Header";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

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