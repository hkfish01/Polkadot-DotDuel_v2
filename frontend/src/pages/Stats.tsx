import { BarChart3, TrendingUp, Trophy, Users, DollarSign, Activity } from 'lucide-react'

export default function Stats() {
  // 模擬平台統計數據
  const platformStats = {
    totalMatches: 156,
    totalUsers: 48,
    totalVolume: '234.5',
    activeMatches: 12,
    completedMatches: 132,
    cancelledMatches: 12,
  }

  const recentMatches = [
    { id: 1, description: 'Pickleball 單打', stake: '0.5', status: '已完成', winner: '0x1234...5678' },
    { id: 2, description: 'Pickleball 雙打', stake: '1.0', status: '進行中', winner: '-' },
    { id: 3, description: 'Pickleball 混雙', stake: '0.2', status: '已完成', winner: '0x2345...6789' },
    { id: 4, description: 'Pickleball 初級組', stake: '0.1', status: '等待中', winner: '-' },
    { id: 5, description: 'Pickleball 高級組', stake: '2.0', status: '已完成', winner: '0x3456...7890' },
  ]

  const topPlayers = [
    { rank: 1, address: '0x1234...5678', wins: 15, winRate: '83.3%', volume: '45.2' },
    { rank: 2, address: '0x2345...6789', wins: 12, winRate: '75.0%', volume: '38.5' },
    { rank: 3, address: '0x3456...7890', wins: 10, winRate: '71.4%', volume: '32.1' },
    { rank: 4, address: '0x4567...8901', wins: 8, winRate: '66.7%', volume: '28.0' },
    { rank: 5, address: '0x5678...9012', wins: 7, winRate: '63.6%', volume: '25.5' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          平台統計
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          查看平台整體數據和排行榜
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Matches */}
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8" />
            <Activity className="w-6 h-6 opacity-50" />
          </div>
          <p className="text-sm opacity-90 mb-1">總比賽數</p>
          <p className="text-4xl font-bold">{platformStats.totalMatches}</p>
          <p className="text-xs opacity-75 mt-2">
            +{platformStats.activeMatches} 進行中
          </p>
        </div>

        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-50" />
          </div>
          <p className="text-sm opacity-90 mb-1">活躍用戶</p>
          <p className="text-4xl font-bold">{platformStats.totalUsers}</p>
          <p className="text-xs opacity-75 mt-2">參與對賭的用戶數</p>
        </div>

        {/* Total Volume */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8" />
            <BarChart3 className="w-6 h-6 opacity-50" />
          </div>
          <p className="text-sm opacity-90 mb-1">總交易量</p>
          <p className="text-4xl font-bold">{platformStats.totalVolume}</p>
          <p className="text-xs opacity-75 mt-2">DOT</p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            已完成
          </p>
          <p className="text-3xl font-bold text-green-600">
            {platformStats.completedMatches}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {((platformStats.completedMatches / platformStats.totalMatches) * 100).toFixed(1)}% 完成率
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            進行中
          </p>
          <p className="text-3xl font-bold text-blue-600">
            {platformStats.activeMatches}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {((platformStats.activeMatches / platformStats.totalMatches) * 100).toFixed(1)}% 活躍率
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            已取消
          </p>
          <p className="text-3xl font-bold text-gray-600">
            {platformStats.cancelledMatches}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {((platformStats.cancelledMatches / platformStats.totalMatches) * 100).toFixed(1)}% 取消率
          </div>
        </div>
      </div>

      {/* Top Players Leaderboard */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            排行榜
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  排名
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  玩家
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  勝場
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  勝率
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  交易量
                </th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((player) => (
                <tr
                  key={player.rank}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {player.rank <= 3 ? (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            player.rank === 1
                              ? 'bg-yellow-500'
                              : player.rank === 2
                              ? 'bg-gray-400'
                              : 'bg-orange-600'
                          }`}
                        >
                          {player.rank}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold">
                          {player.rank}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {player.address}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {player.wins}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-green-600">
                      {player.winRate}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {player.volume} DOT
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            最近比賽
          </h2>
        </div>

        <div className="space-y-3">
          {recentMatches.map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  {match.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  押注: {match.stake} DOT
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    match.status === '已完成'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : match.status === '進行中'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {match.status}
                </span>
                {match.winner !== '-' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    贏家: {match.winner}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

console.log('📊 Stats Page Loaded - v0.3.0-mvp')
