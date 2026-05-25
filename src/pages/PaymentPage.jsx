import React, { useState } from "react";
import PaymentOption from "../components/PaymentOption";
import PayWithTeleBirr from "../components/PayWithTeleBirr";
import PayWithCBE from "../components/PayWithCBE";
import { AnimatePresence, motion } from "framer-motion";


const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("options");

  const renderPage = () => {
    switch (paymentMethod) {
      case "options":
        return (
          <PaymentOption
            setPaymentMethod={setPaymentMethod}
          />
        );

      case "telebirr":
        return (
          <PayWithTeleBirr setPaymentMethod={setPaymentMethod} />
        );

      case "cbe":
        return (
          <PayWithCBE setPaymentMethod={setPaymentMethod} />
        );

      default:
        return null;
    }
  };

  return (
 <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 text-white">

      {/* ✅ ANIMATION WRAPPER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={paymentMethod}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="w-full flex justify-center"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

    </div>
  );
};

export default PaymentPage;