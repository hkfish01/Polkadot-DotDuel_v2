import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useContract, useMatchData } from '../hooks/useContract'
import { formatEther } from 'ethers'
import toast from 'react-hot-toast'
import {
  Trophy,
  Users,
  Clock,
  DollarSign,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

const statusNames = ['等待中', '進行中', '等待結果', '已完成', '已取消']
const statusColors = [
  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
]

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const [winnerAddress, setWinnerAddress] = useState('')

  const matchId = id ? parseInt(id) : 0
  const { match, isLoading, error } = useMatchData(matchId)
  const {
    joinMatch,
    submitResultByReferee,
    cancelMatch,
    isPending,
    isConfirming,
    isConfirmed,
  } = useContract()

  const formatAddress = (addr: string) => {
    if (!addr || addr === '0x0000000000000000000000000000000000000000') return '等待加入'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleJoinMatch = async () => {
    if (!isConnected) {
      toast.error('請先連接錢包')
      return
    }

    if (!match) return

    try {
      await joinMatch(matchId, match.stakeAmount)
      toast.success('成功加入比賽！')
    } catch (error: any) {
      console.error('加入比賽失敗:', error)
      toast.error(error?.message || '加入比賽失敗')
    }
  }

  const handleSubmitResult = async () => {
    if (!winnerAddress) {
      toast.error('請輸入贏家地址')
      return
    }

    if (!winnerAddress.startsWith('0x') || winnerAddress.length !== 42) {
      toast.error('請輸入有效的以太坊地址')
      return
    }

    try {
      await submitResultByReferee(matchId, winnerAddress)
      toast.success('結果提交成功！')
      setWinnerAddress('')
    } catch (error: any) {
      console.error('提交結果失敗:', error)
      toast.error(error?.message || '提交結果失敗')
    }
  }

  const handleCancelMatch = async () => {
    if (!confirm('確定要取消這場比賽嗎？押注金額將退還給參與者。')) {
      return
    }

    try {
      await cancelMatch(matchId)
      toast.success('比賽已取消！')
    } catch (error: any) {
      console.error('取消比賽失敗:', error)
      toast.error(error?.message || '取消比賽失敗')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            比賽不存在
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            找不到指定的比賽，可能已被刪除或ID錯誤
          </p>
          <button
            onClick={() => navigate('/matches')}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
          >
            返回比賽列表
          </button>
        </div>
      </div>
    )
  }

  const participantCount = match.participants.filter(
    (p) => p !== '0x0000000000000000000000000000000000000000'
  ).length

  const isCreator = address?.toLowerCase() === match.creator.toLowerCase()
  const isParticipant = match.participants.some(
    (p) => p.toLowerCase() === address?.toLowerCase()
  )
  const canJoin =
    isConnected && !isParticipant && match.status === 0 && participantCount < 2
  const canSubmitResult =
    isConnected && isCreator && match.mode === 0 && match.status === 2
  const canCancel = isConnected && isCreator && match.status === 0

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/matches')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 mb-4"
        >
          <ArrowLeft size={20} />
          返回比賽列表
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              比賽詳情
            </h1>
            <p className="text-gray-600 dark:text-gray-400">比賽 ID: #{matchId}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              statusColors[match.status]
            }`}
          >
            {statusNames[match.status]}
          </span>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        {/* Description */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              比賽說明
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {match.description || '無描述'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stake Amount */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
              <DollarSign className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                押注金額
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatEther(match.stakeAmount)} DOT
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                獎池總額: {formatEther(match.stakeAmount * BigInt(2))} DOT
              </p>
            </div>
          </div>

          {/* Mode */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                比賽模式
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {match.mode === 0 ? '裁判模式' : 'Oracle模式'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {match.mode === 0
                  ? '裁判手動提交結果'
                  : 'API 自動判定結果'}
              </p>
            </div>
          </div>

          {/* Start Time */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                開始時間
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {formatDate(match.startTime)}
              </p>
            </div>
          </div>

          {/* End Time */}
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                結束時間
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {formatDate(match.endTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            參與者 ({participantCount}/2)
          </h2>
        </div>

        <div className="space-y-3">
          {match.participants.map((participant, index) => {
            const isEmpty =
              participant === '0x0000000000000000000000000000000000000000'
            const isCurrentUser =
              address?.toLowerCase() === participant.toLowerCase()

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                      {isEmpty ? '等待玩家加入...' : formatAddress(participant)}
                    </p>
                    {!isEmpty && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {index === 0 && '創建者'}
                        {isCurrentUser && ' (你)'}
                      </p>
                    )}
                  </div>
                </div>
                {!isEmpty && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
        {/* Join Match */}
        {canJoin && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              加入比賽
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              押注 {formatEther(match.stakeAmount)} DOT 加入這場比賽
            </p>
            <button
              onClick={handleJoinMatch}
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
                  加入比賽
                </>
              )}
            </button>
          </div>
        )}

        {/* Submit Result */}
        {canSubmitResult && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              提交比賽結果
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              作為裁判，請輸入贏家的錢包地址
            </p>
            <div className="space-y-3">
              <input
                type="text"
                value={winnerAddress}
                onChange={(e) => setWinnerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
              />
              <button
                onClick={handleSubmitResult}
                disabled={isPending || isConfirming || !winnerAddress}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    {isPending ? '確認交易中...' : '等待確認...'}
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    提交結果
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Cancel Match */}
        {canCancel && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              取消比賽
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              取消比賽並退還押注金額給所有參與者
            </p>
            <button
              onClick={handleCancelMatch}
              disabled={isPending || isConfirming}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {isPending ? '確認交易中...' : '等待確認...'}
                </>
              ) : (
                <>
                  <XCircle size={20} />
                  取消比賽
                </>
              )}
            </button>
          </div>
        )}

        {/* No Actions Available */}
        {!canJoin && !canSubmitResult && !canCancel && (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              {!isConnected
                ? '請連接錢包以進行操作'
                : match.status === 3
                ? '比賽已完成'
                : match.status === 4
                ? '比賽已取消'
                : '暫無可用操作'}
            </p>
          </div>
        )}

        {/* Success Message */}
        {isConfirmed && (
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ 操作成功！交易已確認。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

console.log('📄 MatchDetail Page Loaded - v0.3.0-mvp')
