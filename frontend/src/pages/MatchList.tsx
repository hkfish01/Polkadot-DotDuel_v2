import { useState } from 'react'
import { useAccount } from 'wagmi'
import MatchCard from '../components/match/MatchCard'
import { Filter, RefreshCw, Search } from 'lucide-react'

export default function MatchList() {
  const { isConnected } = useAccount()
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterMode, setFilterMode] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 讀取總比賽數（通過事件或其他方式，這裡簡化處理）
  // 實際上需要後端API或者遍歷matchId
  // 暫時使用模擬數據
  // 這裡需要一個批量查詢比賽的方法
  // 由於合約沒有提供getAllMatches，我們需要逐個查詢
  // 或者等待後端API實現
  
  // 模擬數據（實際開發中需要從合約或API獲取）
  const mockMatches = [
    {
      id: 1,
      creator: '0x1234567890123456789012345678901234567890',
      participants: [
        '0x1234567890123456789012345678901234567890',
        '0x0000000000000000000000000000000000000000'
      ],
      stakeAmount: BigInt('100000000000000000'), // 0.1 DOT
      status: 0, // WAITING
      mode: 0,
      startTime: Math.floor(Date.now() / 1000) + 3600,
      endTime: Math.floor(Date.now() / 1000) + 7200,
      description: 'Pickleball 單打比賽 - 初級組',
    },
    {
      id: 2,
      creator: '0x2345678901234567890123456789012345678901',
      participants: [
        '0x2345678901234567890123456789012345678901',
        '0x3456789012345678901234567890123456789012'
      ],
      stakeAmount: BigInt('500000000000000000'), // 0.5 DOT
      status: 1, // IN_PROGRESS
      mode: 0,
      startTime: Math.floor(Date.now() / 1000) - 1800,
      endTime: Math.floor(Date.now() / 1000) + 1800,
      description: 'Pickleball 雙打比賽 - 高級組',
    },
    {
      id: 3,
      creator: '0x3456789012345678901234567890123456789012',
      participants: [
        '0x3456789012345678901234567890123456789012',
        '0x4567890123456789012345678901234567890123'
      ],
      stakeAmount: BigInt('1000000000000000000'), // 1 DOT
      status: 3, // COMPLETED
      mode: 1,
      startTime: Math.floor(Date.now() / 1000) - 7200,
      endTime: Math.floor(Date.now() / 1000) - 3600,
      description: 'Pickleball 混雙比賽 - API自動判定',
    },
  ]

  // 過濾邏輯
  const filteredMatches = mockMatches.filter(match => {
    // 狀態過濾
    if (filterStatus !== 'all' && match.status !== parseInt(filterStatus)) {
      return false
    }
    
    // 模式過濾
    if (filterMode !== 'all' && match.mode !== parseInt(filterMode)) {
      return false
    }
    
    // 搜索過濾
    if (searchQuery && !match.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })

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
              <option value="2">等待結果</option>
              <option value="3">已完成</option>
              <option value="4">已取消</option>
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
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockMatches.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">等待中</p>
          <p className="text-2xl font-bold text-yellow-600">{mockMatches.filter(m => m.status === 0).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">進行中</p>
          <p className="text-2xl font-bold text-blue-600">{mockMatches.filter(m => m.status === 1).length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">已完成</p>
          <p className="text-2xl font-bold text-green-600">{mockMatches.filter(m => m.status === 3).length}</p>
        </div>
      </div>

      {/* Match List */}
      {filteredMatches.length === 0 ? (
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
            }}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            重置篩選
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
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
