import { useState } from "react";

export default function PayWithTeleBirr({ setPaymentMethod }) {
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    await navigator.clipboard.writeText("0911223344");
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
      <div className="flex flex-col items-center text-center gap-2">
        <img
          src="/telebirr.jpeg"
          className="w-14 h-14 object-cover rounded-xl border border-white/20"
        />

        <h1 className="text-lg font-bold">Telebirr Payment</h1>
        <p className="text-xs text-white/60">
          Complete payment below
        </p>
      </div>

      {/* Step 1 */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
        <p className="text-xs text-white/50">Step 1</p>

        <p className="text-green-400 text-sm font-semibold">
          Send to this number
        </p>

        <button
          onClick={copyNumber}
          className="w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-semibold"
        >
          📋 0911223344
        </button>

        {copied && (
          <p className="text-[11px] text-green-400">
            Copied ✓
          </p>
        )}
      </div>

      {/* Step 2 */}
      <label className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer hover:border-green-400 transition">

        <p className="text-xs text-white/50">Step 2</p>

        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
          📤
        </div>

        <p className="text-sm font-medium text-center">
          Upload screenshot
        </p>

        <input type="file" accept="image/*" className="hidden" />
      </label>

      {/* Confirm */}
      <button className="w-full bg-green-500 hover:bg-green-600 transition py-2.5 rounded-xl font-semibold text-sm shadow-md">
        Confirm Payment
      </button>
    </div>
  );
}