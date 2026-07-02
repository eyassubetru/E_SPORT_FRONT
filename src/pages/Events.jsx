import { useEffect, useMemo, useRef, useState } from 'react'
import /* events, */ { STATUS_TABS } from '../data/events'
import EventCard from '../components/EventCard'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from '../config/firebaseConfig'
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import LoadingScreen from '../components/LoadingScreen';
import Sponsor from '../components/Sponsor';

const Events = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [events, setEvents] = useState([]);
  const [showBottomNav, setShowBottomNav] = useState(false)
  const tabsRef = useRef(null)
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [showFirst, setShowFirst] = useState(true);
  const [userData, setUserData] = useState(null);
  const { user, loading } = useAuth();
  const [isLoading , setIsLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;



  const filteredEvents = useMemo(() => {
    if (activeTab === 'ALL') return events
    return events.filter((item) => item.status.toUpperCase() === activeTab)
  }, [activeTab,events])


  const handleLogout = async (e) => {
    try {
      axios.post(`${apiUrl}/signout `, {
        withCredentials: true,
      })
      await signOut(auth);
    } catch (error) {
      console.log(error)

    }
  }

  const fetchUserData = async (uid) => {

    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return snap.data(); // contains isPaid
    }

    return null;
  };

  useEffect(() => {
    const tabsElement = tabsRef.current
    if (!tabsElement) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBottomNav(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(tabsElement)

    return () => observer.disconnect()
  }, [])



  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 5000); // Swaps every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    //console.log(user)
  }, [user])

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const querySnapShot = await getDocs(collection(db, "events"));
       // console.log(querySnapShot.docs);
       const eventsList =  querySnapShot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setEvents(eventsList);
      const featured = eventsList.find((item) => item.featured) ?? eventsList[0]
      setFeaturedEvent(featured);

      //console.log(eventsList);
      setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
     
    }
     fetchEvents();
  }, [loading])


  return (
    <main className="min-h-screen bg-[#060b18] pb-28 text-white ">

     {/*  <Sponsor /> */}
      <section className="pt-5 sm:pt-6 mt-8">
        {
          isLoading 
          ? 
         <div className="flex  items-center justify-center bg-[#060b18] h-100">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="relative h-14 w-14 sm:h-16 sm:w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#152345] border-t-[#f6e925]" />
        </div>

        {/* Text */}
        <p className="text-xs font-semibold tracking-widest text-slate-300 sm:text-sm">
          Loading events...
        </p>
      </div>
    </div>
          : 
           <div className="relative overflow-hidden">
          <div className="relative w-full aspect-video overflow-hidden">
            <img
              src={featuredEvent?.thumbnail}
              alt={featuredEvent?.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-10 lg:p-16">
           
            <p className="md:text-[10px] text-[8px] font-bold uppercase tracking-[0.2em] text-[#f6e925] sm:text-xs">
              Featured Event
            </p>

            
            <h1 className="mt-1 max-w-4xl  md:text-2xl font-black leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {featuredEvent?.title}
            </h1>

            {/* Description: Hidden or clamped on very small screens to prevent overlap, full view on desktop */}
            <p className="mt-2 max-w-2xl line-clamp-2 text-xs leading-relaxed text-slate-200 sm:line-clamp-none sm:text-base md:text-lg">
              {featuredEvent?.description}
            </p>

         
            <a
              href={`#${featuredEvent?.id}`}
              onClick={() => { setActiveTab('ALL') }}
              className="mt-1 md:mt-4 inline-flex items-center rounded-md bg-[#f6e925] py-1 px-2 md:px-4 md:py-2 text-xs font-extrabold text-[#0c1227] transition-all hover:scale-105 hover:bg-[#fff34f] sm:px-6 sm:py-3 sm:text-sm"
            >
              {
                ' Watch Now'
              }

            </a>
          </div>
        </div>
        }
       
      </section>

      <section ref={tabsRef} className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="no-scrollbar flex gap-2 overflow-x-auto py-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-4 py-2 text-xs font-bold tracking-wide transition-all sm:text-sm ${activeTab === tab
                ? 'bg-[#f6e925] text-[#0b1227]'
                : 'text-slate-200 hover:bg-[#152345]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-4 transition-all duration-300 sm:grid-cols-2 lg:grid-cols-3">
          
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              id={event.id}
              className="animate-[fadeIn_250ms_ease-out]"
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </section>

      {showBottomNav ? (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#223457] bg-[#0a1430]/95 px-3 py-3 backdrop-blur md:hidden">
          <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={`bottom-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-xs font-bold tracking-wide transition-all ${activeTab === tab
                  ? 'bg-[#f6e925] text-[#0b1227]'
                  : 'text-slate-200 hover:bg-[#152345]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>
      ) : null}
    </main>
  )
}

export default Events