import { useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import MatchCard from '../components/match/MatchCard'
import { AlertCircle, Filter, RefreshCw, Search } from 'lucide-react'
import { MatchApiData, useMatchList } from '../hooks/useMatchesApi'
import { formatEther } from 'ethers'

export default function MatchList() {
  const { isConnected } = useAccount()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMode, setFilterMode] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    data,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useMatchList({ limit: 100 })

  const matches: MatchApiData[] = data?.matches ?? []

  const stats = useMemo(() => {
    const summary = {
      total: data?.meta?.total ?? matches.length,
      waiting: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      volume: 0n,
    }

    for (const match of matches) {
      summary.volume += BigInt(match.stakeAmountWei ?? '0')

      switch (match.status) {
        case 0:
          summary.waiting += 1
          break
        case 1:
          summary.inProgress += 1
          break
        case 2:
          summary.completed += 1
          break
        case 3:
          summary.cancelled += 1
          break
        default:
          break
      }
    }

    return summary
  }, [matches, data?.meta?.total])

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      if (filterStatus !== 'all' && match.status !== parseInt(filterStatus)) {
        return false
      }

      if (filterMode !== 'all' && match.mode !== parseInt(filterMode)) {
        return false
      }

      if (searchQuery && !match.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      return true
    })
  }, [matches, filterStatus, filterMode, searchQuery])

  const totalVolumeDisplay = useMemo(() => {
    if (stats.volume === 0n) {
      return '0'
    }

    return Number.parseFloat(formatEther(stats.volume)).toFixed(2)
  }, [stats.volume])

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          比賽列表
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          瀏覽所有公開比賽，選擇感興趣的比賽加入
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm text-pink-600 dark:text-pink-400 border border-pink-500 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-colors"
        >
          <RefreshCw size={16} className={isRefetching ? 'animate-spin' : ''} />
          {isRefetching ? '更新中...' : '重新整理'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            篩選條件
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 搜索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              搜索
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索比賽描述..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* 狀態篩選 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              比賽狀態
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">所有狀態</option>
              <option value="0">等待中</option>
              <option value="1">進行中</option>
              <option value="2">已完成</option>
              <option value="3">已取消</option>
            </select>
          </div>

          {/* 模式篩選 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              比賽模式
            </label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">所有模式</option>
              <option value="0">裁判模式</option>
              <option value="1">Oracle模式</option>
            </select>
          </div>
        </div>

        {/* 重置按鈕 */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setFilterStatus('all')
              setFilterMode('all')
              setSearchQuery('')
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            重置篩選
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">總比賽數</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">等待中</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">進行中</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">已完成</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          {stats.cancelled > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              已取消 {stats.cancelled} 場
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-500/20 dark:via-purple-500/20 dark:to-blue-500/20 border border-pink-500/30 dark:border-pink-500/40 rounded-xl p-4">
        <p className="text-sm text-pink-700 dark:text-pink-300 mb-1">累積押注量</p>
        <p className="text-2xl font-semibold text-pink-600 dark:text-pink-200">{totalVolumeDisplay} DOT</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/40 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-600 dark:text-red-300 mb-1">
              載入比賽資料時發生錯誤
            </p>
            <p className="text-sm text-red-600/80 dark:text-red-200">
              {error instanceof Error ? error.message : '請稍後再試。'}
            </p>
          </div>
        </div>
      )}

      {/* Match List */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">載入中...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            沒有找到比賽
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            調整篩選條件或創建新比賽
          </p>
          <button
            onClick={() => {
              setFilterStatus('all')
              setFilterMode('all')
              setSearchQuery('')
              refetch()
            }}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            重置篩選
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map(match => (
            <MatchCard
              key={match.id}
              match={{
                id: match.id,
                creator: match.creator,
                participants: match.participants,
                stakeAmount: BigInt(match.stakeAmountWei ?? '0'),
                status: match.status,
                mode: match.mode,
                startTime: match.startTime,
                endTime: match.endTime,
                description: match.description,
              }}
            />
          ))}
        </div>
      )}

      {/* 未連接提示 */}
      {!isConnected && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
          <p className="text-blue-800 dark:text-blue-200">
            💡 連接錢包後可以加入比賽
          </p>
        </div>
      )}
    </div>
  )
}

console.log('📋 MatchList Page Loaded - v0.3.0-mvp')
