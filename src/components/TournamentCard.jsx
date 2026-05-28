import { Calendar, Trophy } from 'lucide-react'
import { Link } from 'react-router'
import { useAuth } from "../context/AuthContext";


const badgeClassByStatus = {
  live: 'bg-[#e32227]/15 text-[#ff8b91] border-[#e32227]/60',
  upcoming: 'bg-[#268dff]/15 text-[#8bc2ff] border-[#268dff]/60',
  completed: 'bg-[#f6e925]/15 text-[#f6e925] border-[#f6e925]/50',
}

const TournamentCard = ({ tournament }) => {
  const isPay = false;
  const statusKey = tournament.status.toLowerCase()
  const { user, loading} = useAuth();

  return (
    <article className="group rounded-md border border-[#2d3d63] bg-[#0c142b] p-3 shadow-xl shadow-black/20 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-44 overflow-hidden rounded-sm">
        <img
          src={tournament.thumbnail}
          alt={tournament.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/90">
          {tournament.game}
        </div>
      </div>

      <div className="space-y-3 px-1 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold uppercase text-white">{tournament.title}</h3>
          <span
            className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeClassByStatus[statusKey]}`}
          >
            {tournament.status}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-300">{tournament.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#8bc2ff]" />
           <span>
  {tournament.dateTime ? new Date(tournament.dateTime?.seconds * 1000).toLocaleString() : ""}
</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-[#f6e925]" />
            <span>{tournament.prizePool}</span>
          </div>
        </div>

        <Link
          to={ `/tournament/${tournament.id}` }
          className="block rounded-md bg-[#268dff] px-4 py-3 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#4da2ff]"
        >
          {
          'Watch'
          }
          
        </Link>
      </div>
    </article>
  )
}

export default TournamentCard