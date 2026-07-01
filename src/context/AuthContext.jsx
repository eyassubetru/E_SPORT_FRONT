import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {  
      // 1. Set loading to true whenever auth state changes
      setLoading(true); 
      //console.log(firebaseUser, "firebaseuser")
      
      try {
        if (firebaseUser) {
          let userData = {};
          try {
            const userRef = doc(db, "users", firebaseUser.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
              userData = snap.data();
            }
          } catch (err) {
            console.error("Firestore fetch failed", err);
          }

          setUser({
            uid: firebaseUser.uid,
            phoneNumber: firebaseUser.phoneNumber,
            accessToken: await firebaseUser.getIdToken(),
            ...userData,
          });
        } else {
          // 2. Clear user if they sign out
          setUser(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        // 3. Always set loading to false after the logic finishes
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);