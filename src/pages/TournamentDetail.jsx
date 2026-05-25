import { ArrowLeft, Share2 } from 'lucide-react'
import { Link, useParams } from 'react-router'
import tournaments from '../data/tournaments'
import { useEffect, useState } from 'react'
import { doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebaseConfig'



const TournamentDetail = () => {
  const { id } = useParams()
  const [tournament,setTournament] = useState();
  const [isLoading, setIsLoading] = useState(false);





   useEffect(() => {

    const fetchTournaments = async () => {
      setIsLoading(true);
      try {
        const docRef = doc(db, "tournaments" , id);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
          const tournamentData = {
            id: docSnap.id,
            ...docSnap.data()
          }
          setTournament(tournamentData)
          console.log(tournamentData)
        }
      
      } catch (error) {
        console.log(error)
      }finally{
        setIsLoading(false)
      }
     
    }
     fetchTournaments();
  }, [])

  if(isLoading){
    return  <div className="flex  items-center justify-center bg-[#060b18] min-h-screen">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="relative h-14 w-14 sm:h-16 sm:w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-[#152345] border-t-[#f6e925]" />
        </div>

        {/* Text */}
        <p className="text-xs font-semibold tracking-widest text-slate-300 sm:text-sm">
          Loading tournaments...
        </p>
      </div>
    </div>
  }
  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070a14] px-6 text-white">

        <div className="text-center max-w-md space-y-4">

          {/* Icon / Visual cue */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0c142b] border border-[#2d3d63]">
            <span className="text-2xl">🎮</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold tracking-wide">
            Tournament Not Found
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm leading-relaxed">
            The tournament you are looking for doesn’t exist or may have been removed.
          </p>

          {/* Action button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center mt-4 rounded-md bg-cyan-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400"
          >
            Back to Home
          </Link>

        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#060b18] px-4 py-5 text-white sm:px-6 mt-15">
      <div className="mx-auto max-w-6xl space-y-4 pb-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-[#2d3d63] bg-[#0c142b] px-4 py-2 text-sm font-semibold text-slate-200"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>

        <section className="grid gap-4 lg:grid-cols-[1.8fr_1fr]">
          <div className="overflow-hidden rounded-md border border-[#2d3d63] bg-black">
            {
              tournament.status === 'upcoming' || tournament.status === 'live' && !tournament.isLiveStart ?
                <div className="relative h-[230px] w-full sm:h-[360px] overflow-hidden rounded-xl bg-black group">

                  {/* Background Image */}
                  <img
                    src={tournament.thumbnail}
                    alt="Tournament thumbnail"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Dark Overlay for readability */}
                  <div className="absolute inset-0 bg-black/50" />

                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <p className="text-2xl sm:text-4xl font-bold tracking-widest">
                      COMING SOON
                    </p>
                  </div>

                </div>

                :
                <div className="relative w-full aspect-video bg-black overflow-hidden rounded-md">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full border-0"
                    src={tournament.streamEmbedUrl}
                   
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
            }

          </div>
          <aside className="space-y-3 rounded-md border border-[#2d3d63] bg-[#0c142b] p-4">
            <h1 className="text-xl font-black uppercase sm:text-2xl">{tournament.title}</h1>
            <p className="text-sm text-slate-300">{tournament.description}</p>
            <div className="space-y-1 text-sm text-slate-300">
              <p>Game: {tournament.game}</p>
              <p>Schedule: {tournament.dateTime}</p>
              <p>Prize Pool: {tournament.prizePool}</p>
            </div>
          </aside>
        </section>

        <section>
          <div className="rounded-md border border-[#2d3d63] bg-[#0c142b] p-4">
            <h2 className="mb-2 text-lg font-bold text-[#f6e925]">Match Details</h2>
            <p className="text-sm text-slate-300">{tournament.matchDetails}</p>
            <h3 className="mb-2 mt-4 text-base font-bold text-[#8bc2ff]">Teams / Players</h3>
            <div className="flex flex-wrap gap-2">
            {/*   {tournament.teams.map((team) => (
                <span
                  key={team}
                  className="rounded-sm border border-[#268dff]/40 bg-[#268dff]/10 px-3 py-1 text-xs text-[#9dcdff]"
                >
                  {team}
                </span>
              ))} */}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default TournamentDetail