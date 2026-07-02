import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { auth } from "../config/firebaseConfig";
import { getOrCreateDeviceId } from "../utility/getOrCreateDeviceId";
import { signOut } from "firebase/auth";

const CreateStreamUserAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageBase64, setProfileImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({
    status: "",
    message: "",
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setResponse({
          status: "error",
          message: "Image size must be less than 2MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageBase64(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setProfileImageBase64("");
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse({ status: "", message: "" });

    if (!username.trim() || !email.trim()) {
      setResponse({
        status: "error",
        message: "Username and email are required.",
      });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setResponse({
        status: "error",
        message: "Please enter a valid email address.",
      });
      setIsLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      /* if (!user) {
        setResponse({
          status: "error",
          message: "You must be logged in to set up your profile.",
        });
        setIsLoading(false);
        return;
      } */

      const token = await user.getIdToken();
      const deviceId = getOrCreateDeviceId();

      await axios.post(`${apiUrl}/eStreamApi/setUserProfile`,
        {
          username: username.trim(),
          email: email.trim(), 
          profileImageBase64
        },
        {
          headers: {
            "x-device-id": deviceId,
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setResponse({
        status: "success",
        message: "Profile updated successfully!",
      });
  
        handleLogout();
    } catch (error) {
      console.error("Profile update error:", error);
      if(error.response?.data?.message === "Invalid Authorization header" || 
        error.response?.data?.message === "Invalid session" ||
         error.response?.data?.message === "Session required"){
        handleLogout();
      }
      setResponse({
        status: "error",
        message: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-transparent p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Create Account 
        </h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Please complete your streaming profile setup.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Dropzone Style Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Profile Picture <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            
            {!imagePreview ? (
              /* EMPTY UNUPLOADED STATE */
              <label 
                htmlFor="profileImage" 
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 hover:border-indigo-500 transition-all duration-200 group ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="flex flex-col items-center justify-center pt-4 pb-4 px-2 text-center">
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-600">
                    Click to browse files
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Supports JPG, PNG up to 2MB
                  </p>
                </div>
              </label>
            ) : (
              /* FILLED ATTACHED STATE */
              <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl bg-gray-50 animate-fadeIn">
                <img 
                  src={imagePreview} 
                  alt="Profile Selected" 
                  className="w-14 h-14 rounded-lg object-cover border border-gray-300 bg-white" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    Avatar Image Loaded
                  </p>
                  <button 
                    type="button"
                    onClick={clearImage}
                    disabled={isLoading}
                    className="text-xs font-semibold text-red-600 hover:text-red-500 transition-colors mt-0.5 block disabled:opacity-50"
                  >
                    Remove Photo
                  </button>
                </div>
                <label 
                  htmlFor="profileImage"
                  className={`px-3 py-1.5 text-xs font-bold text-indigo-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  Replace
                </label>
              </div>
            )}

            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-gray-900 bg-gray-50/50"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition outline-none text-gray-900 bg-gray-50/50"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Response Message */}
          {response.message && (
            <div
              className={`p-3.5 text-sm rounded-xl font-medium border ${
                response.status === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {response.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/10 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
          >
            {isLoading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStreamUserAccount;