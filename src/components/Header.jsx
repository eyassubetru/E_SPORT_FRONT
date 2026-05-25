import React from 'react'
import { FaUser, FaSignOutAlt,FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { auth, db } from '../config/firebaseConfig'
import { signOut } from "firebase/auth";

const Header = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleLogout = async (e) => {
    try {
      axios.post(`${apiUrl}/signout `, {
        withCredentials: true,
      })
      await signOut(auth);
      navigate('/')
    } catch (error) {
      console.log(error)

    }
  }

  return (
    <section className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#081229]/85 backdrop-blur-xl">

  <div className="mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 lg:px-8 overflow-hidden">

    {/* LEFT */}
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">

      {/* Live Indicator */}
      <div className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_12px_#facc15]"></span>
      </div>

      {/* Branding */}
      <div className="flex flex-col leading-none min-w-0">
        <span className="truncate bg-gradient-to-r from-white to-slate-400 bg-clip-text text-[10px] sm:text-sm font-black uppercase tracking-[0.25em] text-transparent">
          Ethiopia
        </span>

        <span className="truncate text-[8px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Tournament
        </span>
      </div>
    </div>

    {/* CENTER (Sponsor) */}
    <div className="flex items-center justify-center shrink-0 mx-2 sm:mx-4">

      <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 sm:px-3 sm:py-2">

        <span className="hidden sm:block text-[9px] font-semibold uppercase tracking-[0.2em] text-orange-400">
          Powered By
        </span>

        <div className="h-4 sm:h-6 w-px bg-white/10"></div>

        <div className="flex items-center gap-1 sm:gap-2">

          <div className="flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-white p-1">
            <img
              src="/eReceipt.png"
              className="h-full w-full object-contain"
              alt="eReceipt"
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[9px] sm:text-sm font-bold text-white">
              eReceipt
            </span>

            <span className="text-[7px] sm:text-[10px] text-green-400">
              Official Sponsor
            </span>
          </div>

        </div>
      </div>
    </div>

    {/* RIGHT */}
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">

      {/* Profile */}
      <button
        onClick={() => {
          if (location.pathname === "/profile") {
            navigate("/tournament");
          } else {
            navigate("/profile");
          }
        }}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300"
      >
        {location.pathname === "/profile"
          ? <FaHome className="text-sm" />
          : <FaUser className="text-sm" />
        }
      </button>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
      >
        <FaSignOutAlt className="text-sm" />
      </button>

    </div>

  </div>
</section>
  )
}

export default Header