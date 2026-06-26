import React, { useEffect, useState } from 'react'
import PhoneInputComponent from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import axios from 'axios';

// Extract the valid component if it is wrapped in an object
const PhoneInput = PhoneInputComponent.default || PhoneInputComponent;

import { isValidPhoneNumber } from "libphonenumber-js";

import { auth } from '../config/firebaseConfig'

import { initializeApp } from "firebase/app";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';



const RegisterForm = () => {

    const navigate = useNavigate();
    const { user, loading } = useAuth();


    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('');
    const [response, setResponse] = useState({
        status: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isOTPLoading, setIsOTPLoading] = useState(false);
    const [isOTPSet , setIsOTPSet] = useState(false);
    const [password, setPassword] = useState('');
    const [ShowPassword, SetShowPassword] = useState(false);
    const [OTP, setOTP] = useState('');
    const [countdown, setCountdown] = useState(0);

    const apiUrl = import.meta.env.VITE_API_URL;


    function getOrCreateDeviceId() {
        let deviceId = localStorage.getItem("device_id");

        if (!deviceId) {
            deviceId = crypto.randomUUID();
            localStorage.setItem("device_id", deviceId);
        }

        return deviceId;
    }

    const register = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const cleanNumber = "+" + phoneNumber.replace(/\D/g, "");

            if (!isValidPhoneNumber(cleanNumber)) {
                setResponse({ status: 'error', message: 'Invalid Phone Number' })
                return
            }

            if (password.length < 8) {
                setResponse({ status: 'error', message: 'make your password at least 8 character' })
                return
            }
            const deviceId = getOrCreateDeviceId();
                   const response = await axios.post(`${apiUrl}/authApi/signup`, {
                "phone": cleanNumber,
                "newPassword": password,
                "otpCode": OTP
            },
                {
                    headers: {
                        "x-device-id": deviceId,

                    }
                });

            const { data } = await response;
            console.log(data)

            if (data.success && data.customToken) {
                await signInWithCustomToken(auth, data.customToken);

                setResponse({
                    status: "success",
                    message: "User logged in successfully",
                });
            }



            setResponse({ status: 'success', message: 'Registered successfully' })
            setIsLoading(false)

        } catch (error) {
            console.log(error.response)
            setResponse({
                status: 'error',
                message: error.response?.data?.message ||
                    error.data?.message ||
                    "Something went wrong"
            })
        } finally {
            setIsLoading(false)
        }



    }

    const handleSendOTP = async (e) => {


        setIsOTPLoading(true)
        if (isLoading || countdown > 0) return;
        setIsOTPLoading(true)
        const cleanNumber = "+" + phoneNumber.replace(/\D/g, "");
        console.log("clear number" + cleanNumber)

        try {
            if (!isValidPhoneNumber(cleanNumber)) {
                setResponse({ status: 'error', message: 'Invalid phone number' })
                return
            }

            const deviceId = getOrCreateDeviceId()

             const response = await axios.post(`${apiUrl}/authApi/sendOtp`, {
                "phoneNumber": cleanNumber,
                 platform : "esport"

            },);

            const { data } = await response;
            console.log(data)

            if (!data.success) {
                setResponse({ status: 'error', message: data.message })
                return
            }

            setResponse({ status: 'success', message: data.message })
            setCountdown(3 * 60);



        } catch (error) {

            console.log(error);

            if (error.response) {

                setResponse({
                    status: 'error',
                    message: error.response?.data?.message ||
                        error.data?.message ||
                        "Something went wrong"
                });

                // 🔥 Start countdown from backend remaining time
                if (error.response.data.remainingSeconds) {

                    setCountdown(error.response.data.remainingSeconds);

                }

            } else {

                setResponse({
                    status: 'error',
                    message: 'Network error'
                });
            }
        } finally {
            setIsOTPLoading(false)
        }



    }

    const formatTime = (seconds) => {

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };


    useEffect(() => {
        if (user) {
            console.log("user", user)
            navigate("/tournament");
        }
    }, [user]);



    useEffect(() => {

        if (countdown <= 0) return;

        const timer = setInterval(() => {

            setCountdown((prev) => prev - 1);

        }, 1000);

        return () => clearInterval(timer);

    }, [countdown]);

    useEffect(()=>{
        if(OTP.length >= 6){
            setIsOTPSet(true)
        }else{
            setIsOTPSet(false)
        }

    },[OTP])






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

                <form onSubmit={register} className="px-6 py-6 sm:px-10 sm:pb-8 flex flex-col gap-4 sm:gap-5">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-black text-green-900 uppercase tracking-tighter italic leading-tight">
                            Official <span className="text-green-600">Entry</span>
                        </h2>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
                           Boxing And FIFA Tournament 
                        </p>
                    </div>

                    {/* Phone Input Group */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="phoneNumber" className="text-[10px] font-black text-green-800/50 uppercase tracking-widest ml-1">
                            Contact Number
                        </label>
                        <PhoneInput

                            required

                            id="phoneNumber"
                            country={"et"}
                            value={phoneNumber}
                            onChange={(value, country, e, formattedValue) => {
                                setPhoneNumber(formattedValue); // Keeps your logic: includes "+"

                            }}
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

                    {/* OTP Grid - Restored side-by-side logic */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-green-800/50 uppercase tracking-widest ml-1">
                            OTP Verification
                        </label>
                        <div className="flex gap-2 w-full">
                            <input
                                type="text"
                                required
                                value={OTP}
                                onChange={(e) => setOTP(e.target.value)}
                                placeholder="OTP Code"
                                className="min-w-0 flex-1 h-[50px] px-4 bg-green-50/50 border-2 border-green-100 rounded-2xl focus:outline-none focus:border-green-600 focus:bg-white transition-all font-bold text-green-900 placeholder:text-green-200"
                            />
                            <button
                                type="button"
                                disabled={isOTPLoading || countdown > 0}
                                onClick={handleSendOTP}
                                className={`
                                shrink-0 min-w-fit px-3 sm:px-5 rounded-2xl 
                                transition-all uppercase tracking-widest whitespace-nowrap 
                                border-2 font-black text-[10px] sm:text-[11px]
                                
                                ${countdown > 0
                                        ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-green-100 hover:bg-green-200 border-green-200 text-green-700 active:scale-95"
                                    }
                                `}
                            >

                                {isLoading || isOTPLoading
                                    ? "..."
                                    : countdown > 0
                                        ? formatTime(countdown)
                                        : "Send OTP"
                                }

                            </button>
                        </div>
                    </div>

                     {  
                     isOTPSet ?
                     
                        <div className="flex flex-col gap-1.5">
                        <label htmlFor='password' className="text-[10px] font-black text-green-800/50 uppercase tracking-widest ml-1">
                            PASSWORD
                        </label>
                        <div className="flex gap-2 w-full justify-center relative">
                            <input
                                id='password'
                                type={ShowPassword ? "text" : 'password'}
                                required

                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="min-w-0 flex-1 h-[50px] px-4 bg-green-50/50 border-2 border-green-100 rounded-2xl focus:outline-none focus:border-green-600 focus:bg-white transition-all font-bold text-green-900 placeholder:text-green-200"
                            />

                            <button
                                className='absolute right-5 top-3 z-10'
                                type='button'
                                onClick={() => (SetShowPassword((prev) => !prev))}
                            >
                                {
                                    ShowPassword ?
                                    <FaEyeSlash className='text-2xl' /> 
                                     
                                     : 
                                     <FaEye className='text-2xl' />
                                }
                            </button>

                        </div>
                    </div> 
                    :
                    ""
                    }

                    {/* Response Message Logic */}
                    {response.message && (
                        <div className={`text-center p-3 rounded-xl border-2 font-bold text-xs animate-in fade-in slide-in-from-top-2 duration-300 ${response.status === 'error'
                            ? "bg-red-50 border-red-100 text-red-600"
                            : "bg-green-50 border-green-100 text-green-700"
                            }`}>
                            {response.message}
                        </div>
                    )}

                    {/* Submit Action */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center text-sm shadow-lg
                            ${(isLoading || OTP.length === 0)
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                : "bg-green-600 text-white hover:bg-green-700 active:translate-y-1 shadow-green-900/20"
                            }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing
                            </span>
                        ) : "Register and Login"}
                    </button>

                    <div
                        className='text-center text-[13px]  text-green-800 uppercase tracking-widest ml-1'
                        onClick={() => { navigate('/') }}
                    >
                        <p className='cursor-pointer'>already have account
                            <span className='text-green-900 underline font-bold'>Login</span>
                        </p>
                        <a href=""></a>
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
                                className="h-6 w-auto transition-all duration-700 ease-in-out 
                        opacity-90 
                       animate-[pulse_3s_ease-in-out_infinite] 
                       group-hover:animate-none group-hover:grayscale-0 group-hover:opacity-100"
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
}

export default RegisterForm;