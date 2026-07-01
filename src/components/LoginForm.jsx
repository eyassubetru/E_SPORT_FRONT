import React, { useEffect, useState } from "react";
import PhoneInputComponent from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { isValidPhoneNumber } from "libphonenumber-js";
import { auth } from "../config/firebaseConfig";
import { signInWithCustomToken } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrCreateDeviceId } from "../utility/getOrCreateDeviceId";

const PhoneInput = PhoneInputComponent.default || PhoneInputComponent;

const LoginForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const { data } = await axios.post(
        `${apiUrl}/authApi/login`,
        { phone: cleanNumber, password, platform: "esport" },
        { headers: { "x-device-id": deviceId } ,   withCredentials: true, }
      );

      if (data?.success && data?.customToken) {
        await signInWithCustomToken(auth, data.customToken);
        navigate("/tournament");
        setResponse({ status: "success", message: "Logged in successfully" });
      } else {
        setResponse({
          status: "error",
          message: data?.message || "Login failed",
        });
      }
    } catch (error) {
      setResponse({
        status: "error",
        message: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate("/tournament");
  }, [user, navigate]);

  return (
    <div className="min-h-svh flex items-center justify-center bg-[#05160f] p-4 font-sans fixed inset-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden relative z-10">
        {/* Hero Header */}
        <div className="relative h-36 sm:h-44 overflow-hidden bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10 z-10" />
          <img
            src="/new-image-hero.png"
            alt="Tournament Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <form onSubmit={login} className="px-6 py-6 sm:px-10 sm:pb-8 flex flex-col gap-4 sm:gap-5">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-green-900 uppercase tracking-tighter italic leading-tight">
               <span className="text-green-600">Login</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
              Boxing And FIFA Tournament
            </p>
          </div>

          {/* Phone Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phoneNumber" className="text-[10px] font-black text-green-800/50 uppercase tracking-widest ml-1">
              Contact Number
            </label>
            <PhoneInput
              required
              id="phoneNumber"
              country={"et"}
              value={phoneNumber}
              onChange={(value, country, e, formattedValue) =>
                setPhoneNumber(formattedValue)
              }
              containerClass="!w-full"
              inputStyle={{
                width: "100%",
                height: "50px",
                backgroundColor: "#f0fdf4",
                border: "2px solid #dcfce7",
                borderRadius: "16px",
                fontWeight: "700",
                color: "#166534",
                fontSize: "14px",
              }}
              buttonStyle={{
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "16px 0 0 16px",
              }}
              inputProps={{
                id: "phoneNumber",
                name: "phoneNumber",
                required: true,
                placeholder: "111111",
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[10px] font-black text-green-800/50 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-[50px] px-4 bg-green-50/50 border-2 border-green-100 rounded-2xl focus:outline-none focus:border-green-600 focus:bg-white transition-all font-bold text-green-900 placeholder:text-green-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-5 top-3 text-green-700"
              >
                {showPassword ? <FaEyeSlash className="text-2xl" /> : <FaEye className="text-2xl" />}
              </button>
            </div>
          </div>

          {/* Response Message */}
          {response.message && (
            <div
              className={`text-center p-3 rounded-xl border-2 font-bold text-xs animate-in fade-in slide-in-from-top-2 duration-300 ${
                response.status === "error"
                  ? "bg-red-50 border-red-100 text-red-600"
                  : "bg-green-50 border-green-100 text-green-700"
              }`}
            >
              {response.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center text-sm shadow-lg ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-green-600 text-white hover:bg-green-700 active:translate-y-1 shadow-green-900/20"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in
              </span>
            ) : (
              "Login"
            )}
          </button>

          {/* Navigation */}
          <div className="text-center text-[13px] text-green-800 uppercase tracking-widest">
            <p className="cursor-pointer" onClick={() => navigate("/signup")}>
              Don't have account?{" "}
              <span className="text-green-900 underline font-bold">SignUp</span>
            </p>
          </div>
          <div className="text-center text-[13px] text-green-800 uppercase tracking-widest">
            <p className="cursor-pointer" onClick={() => navigate("/forgotten-password")}>
              Reset Password
            </p>
          </div>
        </form>

        {/* Sponsor Section */}
        <div className="bg-gray-50/80 border-t border-gray-100 p-6 flex flex-col items-center">
          <p className="text-[10px] font-black text-green-900/30 uppercase tracking-[0.4em] mb-4">
            Tournament Partners
          </p>
          <div className="flex flex-col items-center group cursor-default">
            <div className="relative">
              <img
                src="/eReceipt.png"
                alt="eReceipt"
                className="h-6 w-auto transition-all duration-700 ease-in-out opacity-90 animate-[pulse_3s_ease-in-out_infinite] group-hover:animate-none group-hover:grayscale-0 group-hover:opacity-100"
              />
            </div>
            <span className="text-[10px] font-[1000] text-green-800/40 group-hover:text-green-600 transition-colors uppercase tracking-widest mt-1">
              eReceipt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;