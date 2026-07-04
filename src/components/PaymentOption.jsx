import React from 'react'
import { FaUniversity, FaMobileAlt, FaCrown } from "react-icons/fa";

const PaymentOption = ({paymentMethod, setPaymentMethod}) => {
  return (
     
  
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-3000 ease-in-out">
  
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <FaCrown />
            </div>
  
            <h1 className="mt-3 text-xl font-bold">Pay For Subscription</h1>
            <p className="text-sm text-slate-400">
              Choose your payment method
            </p>
          </div>
  
          {/* Payment Options */}
          <div className="mt-6 space-y-4">
  
            {/* Bank */}
            <button
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              onClick={()=>{setPaymentMethod('cbe')}}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <FaUniversity />
                </div>
  
                <div className="text-left">
                  <p className="font-semibold">Pay with CBE</p>
                  <p className="text-xs text-slate-400">
                    Bank transfer / Card payment
                  </p>
                </div>
              </div>
  
              <span className="text-slate-400">→</span>
            </button>
  
            {/* Telebirr */}
          {/*   <button
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                onClick={()=>{setPaymentMethod('telebirr')}}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                  <FaMobileAlt />
                </div>
  
                <div className="text-left">
                  <p className="font-semibold">Pay with Telebirr</p>
                  <p className="text-xs text-slate-400">
                    Mobile money payment
                  </p>
                </div>
              </div>
  
              <span className="text-slate-400">→</span>
            </button> */}
  
          </div>
  
        </div>

    );
}

export default PaymentOption