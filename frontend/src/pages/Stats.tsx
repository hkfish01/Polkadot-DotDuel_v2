import { BarChart3, TrendingUp, Trophy, Users, DollarSign, Activity, RefreshCw, AlertCircle } from 'lucide-react'
import { formatEther } from 'ethers'
import { usePlatformStats, useRecentMatches } from '../hooks/useMatchesApi'

type LeaderboardEntry = {
  address: string
  wins: number
  losses: number
  winRate: number
  volumeWei: string
}

type RecentMatch = {
  id: number
  description: string
  stakeAmountWei: string
  status: number
  winner: string
  updatedAt: number
  stakeAmountDOT?: string
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const

const statusLabels = ['等待中', '進行中', '已完成', '已取消']
const statusClasses = [
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
]

const formatAddress = (addr: string) => {
  if (!addr || addr === ZERO_ADDRESS) return '—'
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return '—'
  return new Date(timestamp * 1000).toLocaleString('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Stats() {
  const {
    data: platformStats,
    isLoading: statsLoading,
    isRefetching: statsRefetching,
    error: statsError,
    refetch: refetchStats,
  } = usePlatformStats()

  const {
    data: recentMatches,
    isLoading: recentLoading,
    isRefetching: recentRefetching,
    error: recentError,
    refetch: refetchRecent,
  } = useRecentMatches(10)

  const isRefreshing = statsRefetching || recentRefetching
  const totalMatches = platformStats?.totalMatches ?? 0
  const totalUsers = platformStats?.totalUsers ?? 0
  const activeMatches = platformStats?.activeMatches ?? 0
  const completedMatches = platformStats?.completedMatches ?? 0
  const cancelledMatches = platformStats?.cancelledMatches ?? 0
  const waitingMatches = platformStats?.waitingMatches ?? 0

  const totalVolumeWei = BigInt(platformStats?.totalVolumeWei ?? '0')
  const totalVolumeDOT = Number.parseFloat(formatEther(totalVolumeWei))
  const totalVolumeDisplay = totalVolumeDOT === 0 ? '0.00' : totalVolumeDOT.toFixed(2)

  const completionRate = totalMatches > 0 ? ((completedMatches / totalMatches) * 100).toFixed(1) : '0.0'
  const activeRate = totalMatches > 0 ? ((activeMatches / totalMatches) * 100).toFixed(1) : '0.0'
  const cancelRate = totalMatches > 0 ? ((cancelledMatches / totalMatches) * 100).toFixed(1) : '0.0'

  const leaderboard: LeaderboardEntry[] = platformStats?.topPlayers ?? []
  const recentList: RecentMatch[] = recentMatches ?? []

  const hasErrors = Boolean(statsError || recentError)
  const errorText = [
    statsError instanceof Error ? statsError.message : null,
    recentError instanceof Error ? recentError.message : null,
  ]
    .filter(Boolean)
    .join('；')

  const handleRefresh = () => {
    void refetchStats()
    void refetchRecent()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              平台統計
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              查看平台整體數據和排行榜
            </p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-pink-600 dark:text-pink-300 border border-pink-500/60 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? '更新中...' : '重新整理'}
          </button>
        </div>
      </div>

      {hasErrors && (
        <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/40 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-300 mb-1">
              資料載入時發生錯誤
            </p>
            <p className="text-sm text-red-600/80 dark:text-red-200">
              {errorText || '請稍後再試。'}
            </p>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8" />
            <Activity className="w-6 h-6 opacity-50" />
          </div>
          <p className="text-sm opacity-90 mb-1">總比賽數</p>
          <p className="text-4xl font-bold">{statsLoading && !platformStats ? '...' : totalMatches}</p>
          <p className="text-xs opacity-75 mt-2">等待中 {waitingMatches} 場</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-50" />
          </div>
          <p className="text-sm opacity-90 mb-1">活躍用戶</p>
          <p className="text-4xl font-bold">{statsLoading && !platformStats ? '...' : totalUsers}</p>
          <p className="text-xs opacity-75 mt-2">參與對決的獨立地址</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <BarChart3 className="w-6 h-6 opacity-50" />
          </div>
          <p className="text-sm opacity-90 mb-1">總交易量</p>
          <p className="text-4xl font-bold">{statsLoading && !platformStats ? '...' : totalVolumeDisplay}</p>
          <p className="text-xs opacity-75 mt-2">DOT</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">已完成</p>
          <p className="text-3xl font-bold text-green-600">
            {statsLoading && !platformStats ? '...' : completedMatches}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{completionRate}% 完成率</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">進行中</p>
          <p className="text-3xl font-bold text-blue-600">
            {statsLoading && !platformStats ? '...' : activeMatches}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{activeRate}% 活躍率</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">已取消</p>
          <p className="text-3xl font-bold text-gray-600">
            {statsLoading && !platformStats ? '...' : cancelledMatches}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{cancelRate}% 取消率</div>
        </div>
      </div>

      {/* Top Players Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">排行榜</h2>
        </div>

        {statsLoading && !platformStats ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">載入中...</div>
        ) : leaderboard.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">暫無玩家資料</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">排名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">玩家</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">勝場</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">敗場</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">勝率</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">押注量</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => {
                  const volumeDOT = Number.parseFloat(formatEther(BigInt(player.volumeWei ?? '0')))
                  const volumeDisplay = volumeDOT === 0 ? '0.00' : volumeDOT.toFixed(2)
                  return (
                    <tr
                      key={player.address + index}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {index < 3 ? (
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0
                                  ? 'bg-yellow-500'
                                  : index === 1
                                  ? 'bg-gray-400'
                                  : 'bg-orange-600'
                              }`}
                            >
                              {index + 1}
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold">
                              {index + 1}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-gray-900 dark:text-white">{formatAddress(player.address)}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{player.wins}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{player.losses}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-green-600">{player.winRate.toFixed(1)}%</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{volumeDisplay} DOT</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Matches */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">最近比賽</h2>
        </div>

        {recentLoading && !recentMatches ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">載入中...</div>
        ) : recentList.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">暫無比賽紀錄</p>
        ) : (
          <div className="space-y-3">
            {recentList.map((match: RecentMatch) => {
              const stakeDOT = match.stakeAmountDOT
                ? Number.parseFloat(match.stakeAmountDOT)
                : Number.parseFloat(formatEther(BigInt(match.stakeAmountWei ?? '0')))
              const stakeDisplay = Number.isFinite(stakeDOT) ? stakeDOT.toFixed(2) : '0.00'
              const statusClass = statusClasses[match.status] ?? statusClasses[0]
              const statusLabel = statusLabels[match.status] ?? '未知'
              const hasWinner = match.winner && match.winner !== ZERO_ADDRESS
              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                      {match.description || `Match #${match.id}`}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      押注: {stakeDisplay} DOT · 更新於 {formatTimestamp(match.updatedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                      {statusLabel}
                    </span>
                    {hasWinner && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                        贏家: {formatAddress(match.winner)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

console.log('📊 Stats Page Loaded - v0.4.0-live')
