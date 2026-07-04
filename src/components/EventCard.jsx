import { Calendar, Trophy } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getOrCreateDeviceId } from '../utility/getOrCreateDeviceId';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';




const badgeClassByStatus = {
  live: 'bg-[#e32227]/15 text-[#ff8b91] border-[#e32227]/60',
  upcoming: 'bg-[#268dff]/15 text-[#8bc2ff] border-[#268dff]/60',
  completed: 'bg-[#f6e925]/15 text-[#f6e925] border-[#f6e925]/50',
}


const EventCard = ({ event }) => {
  const statusKey = event.status.toLowerCase()
  const { user, loading } = useAuth();
  const [isUserSubscribe, setIsUserSubscribe] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = user.accessToken;
  const navigate = useNavigate()

  /*  const checkUserSubscription = async () => {
     try {
       const userRef =  collection(db ,'stream_user',user.uid);
       const userQuerySnapShot = await getDoc(userRef);
       const dbUser = userQuerySnapShot.doc.map((doc)=>({
         id:doc.id,
         ...doc.data()
       }))
   
       console.log(dbUser);
     } catch (error) {
       console.log(error);
     }
     if (!user || !eventId) return;
       console.log(eventId);
     try {
       setIsSubscriptionLoading(true);
       const deviceId = getOrCreateDeviceId();
 
       const { data } = await axios.get(
         `${apiUrl}/eStreamApi/verifySubscription`,
         {
           params: {
             eventId,
           },
           headers: {
             "x-device-id": deviceId,
             Authorization: `Bearer ${token}`,
           },
           withCredentials: true,
         }
       );
 
       console.log(data);
       return data;
     } catch (error) {
       console.log(error.response?.data);
       navigate(`/payment/${eventId}`);
     }finally{
       setIsSubscriptionLoading(false);
     }
   }; */
  const chapaUrl = async () => {

    const payload = {
      return_url:"https://etstream.app/event",
      currency:"ETB",
      email:"eyassuBetru@gmail.com",
      phone:"0931260592"

    }
    try {
      const res = await axios.post(
        `${apiUrl}/eStreamApi/createChapaDeposit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(res.data);
    } catch (error) {
      console.error(
        error.response?.data || error.message
      );
    }
  }

  const checkUserSubscription = async (eventId) => {
    setIsSubscriptionLoading(true);
    try {
      const userRef = doc(db, "stream_users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        console.log("User not found");
        return;
      }

      const dbUser = {
        id: userSnap.id,
        ...userSnap.data(),
      };
      console.log(dbUser.is_paid);
      if (dbUser.is_paid) {
        navigate(`/event/${eventId}`);
      } else {
        await chapaUrl();
        //navigate(`/payment/${eventId}`);
      }
      console.log(dbUser);
    } catch (error) {
      console.log(error);
    }finally{
      setIsSubscriptionLoading(false)
    }
  };
  return (
    <article className="group rounded-md border border-[#2d3d63] bg-[#0c142b] p-3 shadow-xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden rounded-sm">
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90">
          {event.game}
        </div>
      </div>

      <div className="space-y-3 px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold uppercase text-white">{event.title}</h3>
          <span
            className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeClassByStatus[statusKey]}`}
          >
            {event.status}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-300">{event.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          {
            event.start_date_time && <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#8bc2ff]" />
              <span>
                {event.start_date_time ? new Date(event.start_date_time?.seconds * 1000).toLocaleString() : ""}
              </span>
            </div>
          }
          {event.prize_pool > 0 &&
            <div className="flex items-center gap-1.5">
              <Trophy size={14} className="text-[#f6e925]" />
              <span>{event.prize_pool}</span>
            </div>
          }
        </div>
        {
          event?.status === "completed" ?
            <Link
              to={`/event/${event.id}`}
              className="block rounded-md bg-[#268dff] px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#4da2ff]"
            >
              {
                'Watch'
              }

            </Link>
            :
            <button
              onClick={() => checkUserSubscription(event.id)}
              disabled={isSubscriptionLoading}
              className="w-full block rounded-md bg-[#268dff] px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#4da2ff]"
            >
              {
                isSubscriptionLoading ?
                  <span className='animate-pulse'>loading subscription .....</span> :
                  'Watch'
              }

            </button>
        }

      </div>
    </article>
  )
}

export default EventCard