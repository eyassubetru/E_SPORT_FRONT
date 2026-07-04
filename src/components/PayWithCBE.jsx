import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getOrCreateDeviceId } from "../utility/getOrCreateDeviceId";
import { useAuth } from "../context/AuthContext";
import { Currency } from "lucide-react";

const PayWithCBE = ({ setPaymentMethod }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [popup, setPopup] = useState({
    open: false,
    type: "",
    message: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;
  const deviceId = getOrCreateDeviceId();

  const { user } = useAuth();
  const token = user?.accessToken;

  const showPopup = (message, type = "error") => {
    setPopup({
      open: true,
      type,
      message,
    });

    setTimeout(() => {
      setPopup((prev) => ({
        ...prev,
        open: false,
      }));
    }, 3000);
  };

  const handlePayment = async () => {
    if (!accountNumber.trim()) {
      showPopup("Please enter your account number.");
      return;
    }

    if (!file) {
      showPopup("Please upload a payment screenshot.");
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        eventId: id,
        receiptScreenShot: file,
        userAccount: accountNumber
      }

      console.log(payload);
      const { data } = await axios.post(
        `${apiUrl}/eStreamApi/verifyDeposit`,
        payload,
        {
          headers: {
            "x-device-id": deviceId,
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log(data);

      showPopup(
        "Payment submitted successfully. Redirecting...",
        "success"
      );

      setTimeout(() => {
        navigate(`/event/${id}`);
      }, 1000);
    } catch (error) {
      console.log(error);

      showPopup(
        error.response?.data?.message ||
        "Failed to verify payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubscribe = async () => {
   
    
  };

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText("1000504441486");
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 5000);
    } catch (error) {
      showPopup("Failed to copy account number.");
    }
  };

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl flex flex-col gap-5 text-white">
      {/* Popup */}
      {popup.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl text-center text-white backdrop-blur-xl ${popup.type === "success"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-white/10 border-red-500/30"
              }`}
          >
            <div
              className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${popup.type === "success"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
                }`}
            >
              <span className="text-2xl font-bold">
                {popup.type === "success" ? "✓" : "!"}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-3">
              {popup.type === "success" ? "Success" : "Something went wrong"}
            </h2>

            <p className="text-white/80 text-base mb-6">
              {popup.message}
            </p>

            <button
              onClick={() =>
                setPopup({
                  open: false,
                  type: "",
                  message: "",
                })
              }
              className="w-full rounded-xl bg-white/10 py-3 font-semibold hover:bg-white/20 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Back */}
      <button
        onClick={() => setPaymentMethod("options")}
        disabled={isLoading}
        className="text-xs text-white/60 hover:text-white self-start disabled:opacity-50"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <img
          src="/CBE.jpeg"
          alt="CBE"
          className="w-14 h-14 object-cover rounded-xl border border-white/20 mx-auto"
        />

        <h1 className="text-lg font-bold">Pay with CBE</h1>

        <p className="text-xs text-white/60">
          Complete payment steps below
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
        <p className="text-xs text-white/50">Step 1</p>

        {/* <span className="font-medium">
          ULFATA LEMI GELETA
        </span>

        <p className="text-green-400 text-sm font-semibold">
          Tap to copy CBE account
        </p>

        <button
          onClick={copyAccount}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
        >
          📋 1000504441486
        </button> */}

        {copied && (
          <p className="text-xs text-green-400">
            Copied ✓
          </p>
        )}
      </div>

      {/* Step 2 */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
        <p className="text-xs text-white/50">Step 2</p>

        <p className="text-sm font-semibold">
          Enter your account number
        </p>

        <input
          type="text"
          value={accountNumber}
          disabled={isLoading}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter account number"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm focus:border-green-400 disabled:opacity-50"
        />
      </div>

      {/* Step 3 */}
      <label className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-3 cursor-pointer hover:border-green-400 transition">
        <p className="text-xs text-white/50">Step 3</p>

        {preview ? (
          <img
            src={preview}
            alt="Receipt Preview"
            className="w-full h-40 rounded-lg object-cover border border-white/10"
          />
        ) : (
          <div className="w-full h-40 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-sm text-white/50">
            Upload screenshot
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          disabled={isLoading}
          className="hidden"
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];

            if (!selectedFile) return;

            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
          }}
        />

        <p className="text-xs text-white/50 break-all text-center">
          {file ? file.name : "Tap to upload"}
        </p>
      </label>

      {/* Submit */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm shadow-md transition ${isLoading
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
          }`}
      >
        {isLoading ? "Uploading..." : "Confirm Payment"}
      </button>
      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm shadow-md transition ${isLoading
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
          }`}
      >
        {isLoading ? "Uploading..." : "subscribe"}
      </button>
    </div>
  );
};

export default PayWithCBE;