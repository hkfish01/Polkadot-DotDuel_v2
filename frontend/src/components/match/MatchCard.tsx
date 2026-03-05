import { Link } from 'react-router-dom'
import { Trophy, Users, Clock, DollarSign } from 'lucide-react'
import { formatEther } from 'ethers'

interface MatchCardProps {
  match: {
    id: number
    creator: string
    participants: string[]
    stakeAmount: bigint
    status: number
    mode: number
    startTime: number
    endTime: number
    description: string
  }
}

const statusNames = ['Waiting', 'In Progress', 'Completed', 'Cancelled']
const statusColors = [
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
]

export default function MatchCard({ match }: MatchCardProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const participantCount = match.participants.filter(p => p !== '0x0000000000000000000000000000000000000000').length

  return (
    <Link to={`/matches/${match.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[match.status] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}
              >
                {statusNames[match.status] ?? 'Unknown'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                {match.mode === 0 ? 'Referee' : 'Oracle'}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
              {match.description || `Duel #${match.id}`}
            </h3>
          </div>
          <Trophy className="w-6 h-6 text-pink-500 flex-shrink-0" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Stake Amount */}
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Stake</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatEther(match.stakeAmount)} PAS
              </p>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Players</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {participantCount}/2
              </p>
            </div>
          </div>

          {/* Start Time */}
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Start Time</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formatDate(match.startTime)}
              </p>
            </div>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Creator</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {formatAddress(match.creator)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Duel #{match.id}
            </span>
            {match.status === 0 && (
              <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                Join Now →
              </span>
            )}
            {match.status === 1 && (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                View Details →
              </span>
            )}
            {match.status === 3 && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                View Result →
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}


