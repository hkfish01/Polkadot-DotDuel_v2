import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useContract } from '../hooks/useContract'
import { parseEther } from 'ethers'
import toast from 'react-hot-toast'
import { Loader2, Trophy, Calendar, DollarSign, FileText } from 'lucide-react'

export default function CreateMatch() {
  const { isConnected } = useAccount()
  const { createMatch, isPending, isConfirming, isConfirmed } = useContract()

  const [formData, setFormData] = useState({
    mode: '0', // 0: 裁判模式, 1: Oracle模式
    stakeAmount: '',
    startTime: '',
    endTime: '',
    description: '',
    externalMatchId: '',
    includeStake: true, // 裁判是否同時押注
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast.error('請先連接錢包')
      return
    }

    try {
      const stakeInWei = parseEther(formData.stakeAmount)
      const startTimestamp = Math.floor(new Date(formData.startTime).getTime() / 1000)
      const endTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000)

      await createMatch(
        Number(formData.mode),
        stakeInWei,
        startTimestamp,
        endTimestamp,
        formData.description,
        formData.externalMatchId,
        formData.includeStake
      )

      toast.success('比賽創建成功！')
      
      // 重置表單
      setFormData({
        mode: '0',
        stakeAmount: '',
        startTime: '',
        endTime: '',
        description: '',
        externalMatchId: '',
        includeStake: true,
      })
    } catch (error: any) {
      console.error('創建比賽失敗:', error)
      toast.error(error?.message || '創建比賽失敗')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            請先連接錢包
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            您需要連接錢包才能創建比賽
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          創建比賽
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          設置比賽參數並邀請玩家參加
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
        {/* 模式選擇 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            <div className="flex items-center gap-2">
              <Trophy size={16} />
              比賽模式
            </div>
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="0">模式1 - 裁判模式（裁判判定結果）</option>
            <option value="1">模式2 - Oracle模式（API自動判定）</option>
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.mode === '0' 
              ? '裁判創建比賽並手動提交結果，手續費: 裁判3% + 平台0.5%' 
              : '從外部API同步比賽數據，自動判定結果，手續費: 平台0.5%'}
          </p>
        </div>

        {/* 押注金額 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            <div className="flex items-center gap-2">
              <DollarSign size={16} />
              押注金額 (DOT)
            </div>
          </label>
          <input
            type="number"
            name="stakeAmount"
            value={formData.stakeAmount}
            onChange={handleChange}
            step="0.001"
            min="0.001"
            placeholder="0.1"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            每位玩家需要押注的 DOT 金額
          </p>
        </div>

        {/* 裁判是否押注 */}
        {formData.mode === '0' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includeStake"
              name="includeStake"
              checked={formData.includeStake}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="includeStake" className="text-sm text-gray-900 dark:text-white">
              我作為裁判也參與押注（成為參賽者之一）
            </label>
          </div>
        )}

        {/* 開始時間 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              開始時間
            </div>
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* 結束時間 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              結束時間
            </div>
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* 比賽描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            <div className="flex items-center gap-2">
              <FileText size={16} />
              比賽描述
            </div>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="例如: Pickleball 單打比賽..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* 外部比賽ID（Oracle模式必填） */}
        {formData.mode === '1' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              外部比賽ID (mydupr)
            </label>
            <input
              type="text"
              name="externalMatchId"
              value={formData.externalMatchId}
              onChange={handleChange}
              placeholder="mydupr-123456"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              從 mydupr API 獲取的比賽ID
            </p>
          </div>
        )}

        {/* 提交按鈕 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {isPending ? '確認交易中...' : '等待確認...'}
              </>
            ) : (
              <>
                <Trophy size={20} />
                創建比賽
              </>
            )}
          </button>

          {isConfirmed && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ 比賽創建成功！交易已確認。
              </p>
            </div>
          )}
        </div>
      </form>

      {/* 說明區塊 */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 創建比賽說明
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <li>• 創建比賽後，等待另一位玩家加入並押注</li>
          <li>• 兩位玩家都押注後，比賽狀態變為"進行中"</li>
          <li>• 比賽結束後，裁判或Oracle提交結果</li>
          <li>• 贏家自動獲得獎金（扣除手續費）</li>
          <li>• 如果沒有對手加入，可以取消比賽並退款</li>
        </ul>
      </div>
    </div>
  )
}

console.log('📝 CreateMatch Page Loaded - v0.2.0-mvp')
