import React, { useEffect } from "react";
import LoadingScreen from '../components/LoadingScreen'
import { FaCrown, FaWallet, FaPhoneAlt } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
const UserProfilePage = () => {
  const { user, loading } = useAuth();

  
  useEffect(()=>{
    console.log(user)
  },[loading , user])
  

  //const isPremium = user.membership?.toLowerCase() === "premium";

  if(loading){
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-24 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#101935] to-[#091224] shadow-2xl">

          {/* Top Banner */}
          <div className="relative h-32 bg-linear-to from-cyan-500/20 via-blue-500/20 to-purple-500/20" />

          {/* Content */}
          <div className="relative px-6 pb-8">

            {/* Avatar + Info */}
            <div className="-mt-14 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col items-center sm:flex-row sm:items-end sm:gap-5">

                <img
                  src="https://ui-avatars.com/api/?name=U&background=0D8ABC&color=fff"
                  alt="profile"
                  className="h-28 w-28 rounded-2xl border-4 border-[#091224] object-cover shadow-xl"
                />

                <div className="mt-4 text-center sm:mt-0 sm:text-left">

                  {/* Phone */}
                  <p className="flex items-center justify-center gap-2 text-sm text-slate-400 sm:justify-start">
                    <FaPhoneAlt className="text-xs" />
                    {user.phoneNumber}
                  </p>

                  {/* Membership */}
                  <div className="mt-3 flex justify-center sm:justify-start">
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        false
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      <FaCrown />
                       Member
                    </span>
                  </div>

                  {/* Upgrade Button */}
                  {!true && (
                    <button
                      onClick={() => (window.location.href = "/payment")}
                      className="mt-3 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-yellow-400"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                </div>
              </div>

              {/* Balance */}
             {/*  <div className="mt-6 sm:mt-0 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                    <FaWallet />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">
                      Balance
                    </p>
                    <h2 className="text-xl font-black text-green-400">
                      ETB // {user.balance} 
                    </h2>
                  </div>
                </div>
              </div> */}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfilePage;