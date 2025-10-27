import { useAccount } from 'wagmi'
import { useUserMatches, useUserStats } from '../hooks/useContract'
import MatchCard from '../components/match/MatchCard'
import { Trophy, Target, Award, TrendingUp, Wallet } from 'lucide-react'

export default function MyMatches() {
  const { address, isConnected } = useAccount()
  const { matches, isLoading: matchesLoading } = useUserMatches(address)
  const { stats, isLoading: statsLoading } = useUserStats(address)

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            請先連接錢包
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            連接錢包後查看你參與的所有比賽
          </p>
        </div>
      </div>
    )
  }

  // 解析統計數據
  const totalMatches = stats ? Number(stats[0]) : 0
  const wins = stats ? Number(stats[1]) : 0
  const losses = stats ? Number(stats[2]) : 0
  const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0'

  // 解析比賽列表（需要根據實際返回的數據結構調整）
  const matchIds = matches ? (Array.isArray(matches) ? matches : []) : []

  // 這裡需要逐個查詢每個比賽的詳情
  // 在實際應用中，應該由後端API提供完整的比賽列表
  // 暫時使用模擬數據
  const mockMatches = [
    {
      id: 1,
      creator: address || '',
      participants: [
        address || '',
        '0x0000000000000000000000000000000000000000'
      ],
      stakeAmount: BigInt('100000000000000000'),
      status: 0,
      mode: 0,
      startTime: Math.floor(Date.now() / 1000) + 3600,
      endTime: Math.floor(Date.now() / 1000) + 7200,
      description: '我創建的比賽 - 等待對手',
    },
    {
      id: 2,
      creator: '0x2345678901234567890123456789012345678901',
      participants: [
        '0x2345678901234567890123456789012345678901',
        address || ''
      ],
      stakeAmount: BigInt('500000000000000000'),
      status: 1,
      mode: 0,
      startTime: Math.floor(Date.now() / 1000) - 1800,
      endTime: Math.floor(Date.now() / 1000) + 1800,
      description: '我參與的比賽 - 進行中',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          我的比賽
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          查看你參與的所有比賽和統計數據
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Matches */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            總比賽數
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {statsLoading ? '...' : totalMatches}
          </p>
        </div>

        {/* Wins */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">勝場</p>
          <p className="text-3xl font-bold text-green-600">
            {statsLoading ? '...' : wins}
          </p>
        </div>

        {/* Losses */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <Target className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">敗場</p>
          <p className="text-3xl font-bold text-red-600">
            {statsLoading ? '...' : losses}
          </p>
        </div>

        {/* Win Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">勝率</p>
          <p className="text-3xl font-bold text-purple-600">
            {statsLoading ? '...' : `${winRate}%`}
          </p>
        </div>
      </div>

      {/* Matches List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          比賽記錄
        </h2>

        {matchesLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">載入中...</p>
          </div>
        ) : mockMatches.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              還沒有參與任何比賽
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              創建或加入比賽開始你的對決之旅
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/create"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                創建比賽
              </a>
              <a
                href="/matches"
                className="px-6 py-2 border-2 border-pink-500 text-pink-600 dark:text-pink-400 rounded-lg font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
              >
                瀏覽比賽
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

console.log('🎮 MyMatches Page Loaded - v0.3.0-mvp')
