import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { auth } from "../config/firebaseConfig";
import { getOrCreateDeviceId } from "../utility/getOrCreateDeviceId";

const CreateStreamUserAccount = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({
    status: "",
    message: "",
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse({ status: "", message: "" });

    // Basic validation
    if (!username.trim() || !email.trim()) {
      setResponse({
        status: "error",
        message: "Username and email are required.",
      });
      setIsLoading(false);
      return;
    }

    // Simple email format check
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
      if (!user) {
        setResponse({
          status: "error",
          message: "You must be logged in to set up your profile.",
        });
        setIsLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const deviceId = getOrCreateDeviceId();
   

      await axios.post(
        `${apiUrl}/eStreamApi/setUserProfile`,
        {
          username: username.trim(),
          email: email.trim(), 
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
      // Optionally navigate after success
      // navigate("/dashboard");
    } catch (error) {
      console.error("Profile update error:", error.response);
      setResponse({
        status: "error",
        message: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fixed full-screen container with backdrop blur – no gradient, just transparent blur
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-transparent">
      {/* White box */}
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Set Up Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          {/* Email Field (replaces phone) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Response Message */}
          {response.message && (
            <div
              className={`p-3 text-sm rounded-lg ${
                response.status === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {response.message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStreamUserAccount;