import React, { useEffect, useState } from "react";
import PhoneInputComponent from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import axios from "axios";
import { isValidPhoneNumber } from "libphonenumber-js";

import { auth } from "../config/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import  {useAuth}  from "../context/AuthContext";

import { getOrCreateDeviceId } from "../utility/getOrCreateDeviceId";

const PhoneInput = PhoneInputComponent.default || PhoneInputComponent;



const LoginForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({ status: "", message: "" });


  const apiUrl = import.meta.env.VITE_API_URL;

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    

    try {
      const cleanNumber = "+" + phoneNumber.replace(/\D/g, "");

      if (!isValidPhoneNumber(cleanNumber)) {
        setResponse({ status: "error", message: "Invalid phone number" });
        return;
      }

      if (password.length < 8) {
        setResponse({
          status: "error",
          message: "Password must be at least 8 characters",
        });
        return;
      }

      const deviceId = getOrCreateDeviceId();

      const { data } = await axios.post(`${apiUrl}/loginUser`, 
        {
        
        phone: cleanNumber,
        password,
      },
      {
        headers: {
            "x-device-id": deviceId,

        }
                });

      if (data?.success && data?.customToken) {
        try {
          const cred =  await signInWithCustomToken(auth, data.customToken);
          navigate("/tournament");
          console.log(cred, "firebase logged in ")
        console.log(data)

        setResponse({
          status: "success",
          message: "Logged in successfully",
        });
        console.log("logged in", user)
        console.log(response.status,response.message)
        } catch (error) {
          console.log(error, "firebase dont logged in")
        }
  
      } else {
        setResponse({
          status: "error",
          message: data?.message || "Login failed",
        });
      }
    } catch (error) {
      console.log("STATUS:", error.response?.status);
  console.log("DATA:", error.response?.data);
      setResponse({
        status: "error",
        message:
          error.response?.data?.message || "Something went wrong",
      });
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log(user)
      navigate("/tournament");
    }
  }, [user,navigate]);


  return (
    <div className="min-h-svh flex items-center justify-center bg-[#05160f] p-4 fixed inset-0">

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl overflow-hidden">

        <div className="p-6 sm:p-10 flex flex-col gap-4">

          <div className="text-center">
            <h2 className="text-3xl font-black text-green-900 uppercase">
              Login
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              FIFA Tournament 2026
            </p>
          </div>

          {/* Phone */}
          <PhoneInput
            country={"et"}
            value={phoneNumber}
            onChange={(value, country, e, formattedValue) => {
              setPhoneNumber(formattedValue);
            }}
            inputStyle={{
              width: "100%",
              height: "50px",
              backgroundColor: "#f0fdf4",
              border: "2px solid #dcfce7",
              borderRadius: "16px",
              fontWeight: "700",
              color: "#166534",
            }}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[50px] px-4 bg-green-50 border-2 border-green-100 rounded-2xl font-bold text-green-900"
          />

          {/* Response */}
          {response.message && (
            <div
              className={`text-center p-3 rounded-xl text-xs font-bold ${
                response.status === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {response.message}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={login}
            disabled={isLoading}
            className={`h-12 rounded-2xl font-black uppercase ${
              isLoading
                ? "bg-gray-300 text-gray-500"
                : "bg-green-600 text-white"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
           <div 
                    className='text-center text-[13px]  text-green-800 uppercase tracking-widest ml-1'
                    onClick={()=>{navigate('/')}}
                    >
                        <p className='cursor-pointer'>Don't have account
                            <span className='text-green-900 underline font-bold'>SignUp</span>
                        </p>
                    </div>
        </div>
        
      </div>
    </div>
  );
};

export default LoginForm;