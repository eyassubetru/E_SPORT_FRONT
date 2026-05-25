import React, { useState } from "react";

const PayWithCBE = ({ setPaymentMethod }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState(null);

  const copyAccount = async () => {
    await navigator.clipboard.writeText("1000-0000-0000-0000");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl flex flex-col gap-5 text-white">

      {/* Back */}
      <button
        onClick={() => setPaymentMethod("options")}
        className="text-xs text-white/60 hover:text-white self-start"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="text-center flex flex-col gap-2">
        <img
          src="/CBE.jpeg"
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

        <p className="text-green-400 text-sm font-semibold">
          Tap to copy CBE account
        </p>

        <button
          onClick={copyAccount}
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
        >
          📋 1000-0000-0000-0000
        </button>

        {copied && (
          <p className="text-xs text-green-400">
            Copied ✓
          </p>
        )}
      </div>

      {/* Step 2 */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
        <p className="text-xs text-white/50">Step 2</p>

        <p className="text-white text-sm font-semibold">
          Enter your account number
        </p>

        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter account number"
          className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 outline-none text-sm focus:border-green-400"
        />
      </div>

      {/* Step 3 */}
      <label className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-3 cursor-pointer hover:border-green-400 transition">

        <p className="text-xs text-white/50">Step 3</p>

        <p className="text-sm font-medium">
          Upload screenshot
        </p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <p className="text-xs text-white/50">
          {file ? file.name : "Tap to upload"}
        </p>
      </label>

      {/* Confirm */}
      <button className="w-full bg-green-500 hover:bg-green-600 transition py-2.5 rounded-xl font-semibold text-sm shadow-md">
        Confirm Payment
      </button>
    </div>
  );
};

export default PayWithCBE;