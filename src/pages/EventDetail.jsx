import { ArrowLeft, ChevronDown, AlertCircle } from "lucide-react";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; 
import Comment from "../components/Comment";
import LoadingScreen from "../components/LoadingScreen";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState();
  const [isLoading, setIsLoading] = useState(true); // start true — avoids "Not Found" flash
  const [error, setError] = useState(null);
  const [showEventInfo, setShowEventInfo] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const docRef = doc(db, "events", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setEvent({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.log(err);
        setError("Something went wrong loading this event.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-white bg-gradient-to-br from-[#060b18] to-[#0a0f1e] px-4 text-center">
        <AlertCircle className="text-red-400" size={32} />
        <p>{error}</p>
        <Link
          to="/event"
          className="text-sm text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#060b18] to-[#0a0f1e]">
        Event Not Found
      </div>
    );
  }

  const eventInfoContent = (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
          Game
        </p>
        <p className="text-base text-cyan-300 font-medium">
          {event.game}
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
          Prize Pool
        </p>
        <p className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          {event.prize_pool}
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
          Status
        </p>
        <span className="inline-block bg-cyan-500/20 text-cyan-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-cyan-500/30 backdrop-blur-sm">
          {event.status}
        </span>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
          Date & Time
        </p>
        <p className="text-sm text-slate-200 font-medium">
          {event.start_date_time
            ? new Date(event.start_date_time.seconds * 1000).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : "TBA"}
        </p>
      </div>
    </div>
  );

  return (
    <main className="inset-0 mt-16 min-h-screen bg-gradient-to-br from-[#060b18] via-[#070d1a] to-[#0b1223] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">

        {/* HEADER WITH BACK BUTTON */}
        <div className="flex items-center justify-between">
          <Link
            className="group text-sm text-slate-300 hover:text-cyan-400 transition-all duration-200 flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
            to={"/event"}
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline font-medium">Back to Events</span>
            <span className="sm:hidden font-medium">Back</span>
          </Link>
        </div>

        {/* MOBILE EVENT INFO - COLLAPSIBLE, now actually wired up */}
        <div className="lg:hidden bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowEventInfo((prev) => !prev)}
            className="w-full flex items-center justify-between px-5 py-4"
          >
            <span className="font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-5 bg-cyan-400 rounded-full" />
              Event Info
            </span>
            <ChevronDown
              size={20}
              className={`text-slate-400 transition-transform ${showEventInfo ? "rotate-180" : ""}`}
            />
          </button>

          {showEventInfo && (
            <div className="px-5 pb-5 border-t border-white/10 pt-5">
              {eventInfoContent}
            </div>
          )}
        </div>

        {/* RESPONSIVE GRID LAYOUT */}
        <section className="grid gap-6 lg:grid-cols-3 lg:gap-8">

          {/* MAIN CONTENT - LEFT/CENTER */}
          <div className="lg:col-span-2 space-y-6">

            {/* VIDEO HERO SECTION */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative shadow-2xl shadow-cyan-500/10 ring-1 ring-white/10 group">
              {event.is_live_start && (
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold tracking-wider animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full" />
                  LIVE
                </div>
              )}
              {event.is_live_start ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src={event.stream_embed_url}
                  allowFullScreen
                  title="Event Stream"
                />
              ) : (
                <img
                  src={event.thumbnail}
                  alt="Event thumbnail"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/fallback-thumbnail.jpg";
                  }}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* COMMENTS SECTION */}
            <div className="w-full">
              <Comment />
            </div>
          </div>

          {/* DESKTOP EVENT INFO - SIDEBAR */}
          <aside className="hidden lg:flex lg:flex-col gap-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl sticky top-6 shadow-xl shadow-cyan-500/5">
              <h2 className="font-bold text-xl mb-6 text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-cyan-400 rounded-full" />
                Event Info
              </h2>
              {eventInfoContent}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
};

export default EventDetail;