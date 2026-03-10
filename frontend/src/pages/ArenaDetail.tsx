import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { formatEther, parseEther } from 'ethers'
import { ArrowLeft, Clock, Users, Trophy, TrendingUp, Flame, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { useArenaDetail, useArenaBets, useArenaOddsHistory } from '../hooks/useArenaApi'
import { useArenaContract } from '../hooks/useArenaContract'

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: 'Betting Open', color: 'bg-green-500' },
  1: { label: 'Locked', color: 'bg-yellow-500' },
  2: { label: 'Resolved', color: 'bg-blue-500' },
  3: { label: 'Cancelled', color: 'bg-gray-500' },
}

function OddsBar({ pctA, pctB, sideA, sideB }: { pctA: number; pctB: number; sideA: string; sideB: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold mb-2">
        <span className="text-blue-600 dark:text-blue-400">{sideA} — {pctA.toFixed(1)}%</span>
        <span className="text-red-600 dark:text-red-400">{pctB.toFixed(1)}% — {sideB}</span>
      </div>
      <div className="relative h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 ease-out"
          style={{ width: `${pctA}%` }}
        />
        <div
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-red-600 to-red-400 transition-all duration-700 ease-out"
          style={{ width: `${pctB}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-4 text-white text-sm font-bold">
          <span>{pctA > 5 ? `${pctA.toFixed(1)}%` : ''}</span>
          <span>{pctB > 5 ? `${pctB.toFixed(1)}%` : ''}</span>
        </div>
      </div>
    </div>
  )
}

function MiniOddsChart({ history }: { history: any[] }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
        No betting activity yet
      </div>
    )
  }

  // Build points from history — each point has percentA
  const points = history.map((h: any) => h.percentA as number)
  const maxY = 100
  const svgW = 400
  const svgH = 120
  const padX = 0
  const padY = 4

  const pathPoints = points.map((p, i) => {
    const x = padX + (i / Math.max(points.length - 1, 1)) * (svgW - padX * 2)
    const y = padY + ((maxY - p) / maxY) * (svgH - padY * 2)
    return { x, y }
  })

  const lineA = pathPoints.map((pt, i) => `${i === 0 ? 'M' : 'L'}${pt.x},${pt.y}`).join(' ')

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-32" preserveAspectRatio="none">
        {/* 50% line */}
        <line x1={0} y1={svgH / 2} x2={svgW} y2={svgH / 2} stroke="rgba(128,128,128,0.3)" strokeDasharray="4,4" />
        {/* Side A line */}
        <path d={lineA} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        {/* Dots */}
        {pathPoints.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#3b82f6" opacity="0.8" />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>First bet</span>
        <span className="text-blue-500">── Side A %</span>
        <span>Latest</span>
      </div>
    </div>
  )
}

export default function ArenaDetail() {
  const { id } = useParams<{ id: string }>()
  const arenaId = Number(id)
  const { address } = useAccount()
  const { arena, loading, refetch: refetchArena } = useArenaDetail(arenaId)
  const { bets, refetch: refetchBets } = useArenaBets(arenaId)
  const { history } = useArenaOddsHistory(arenaId)
  const { placeBet, resolveArena, claimWinnings, isPending, isConfirming, isConfirmed } = useArenaContract()

  const [betAmount, setBetAmount] = useState('0.01')
  const [selectedSide, setSelectedSide] = useState<1 | 2>(1)

  // Refetch after successful tx
  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transaction confirmed!')
      refetchArena()
      refetchBets()
    }
  }, [isConfirmed])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    )
  }

  if (!arena) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-gray-500">Arena not found</h2>
        <Link to="/arena" className="text-orange-500 hover:underline mt-2 inline-block">Back to Arenas</Link>
      </div>
    )
  }

  const totalA = BigInt(arena.totalSideAWei ?? '0')
  const totalB = BigInt(arena.totalSideBWei ?? '0')
  const total = totalA + totalB
  const pctA = total > 0n ? Number((totalA * 10000n) / total) / 100 : 50
  const pctB = total > 0n ? Number((totalB * 10000n) / total) / 100 : 50
  const poolDisplay = Number(formatEther(total)).toFixed(4)
  const { label: statusLabel, color: statusColor } = statusMap[arena.status] ?? statusMap[3]
  const isOpen = arena.status === 0
  const isResolved = arena.status === 2
  const isCreator = address?.toLowerCase() === arena.creator?.toLowerCase()
  const bettingDeadline = new Date(arena.bettingDeadline * 1000)
  const resolveDeadline = new Date(arena.resolveDeadline * 1000)
  const now = Date.now() / 1000
  const canBet = isOpen && now < arena.bettingDeadline && !isCreator
  const canResolve = isCreator && now >= arena.bettingDeadline && now <= arena.resolveDeadline && !isResolved && arena.status !== 3

  // User bets summary
  const userBets = bets.filter((b: any) => b.bettor?.toLowerCase() === address?.toLowerCase())
  const userSideA = userBets.filter((b: any) => b.side === 1).reduce((s: bigint, b: any) => s + BigInt(b.amountWei), 0n)
  const userSideB = userBets.filter((b: any) => b.side === 2).reduce((s: bigint, b: any) => s + BigInt(b.amountWei), 0n)
  const hasWinningBet = isResolved && (
    (arena.winningSide === 1 && userSideA > 0n) ||
    (arena.winningSide === 2 && userSideB > 0n)
  )

  const handleBet = () => {
    try {
      const amount = parseEther(betAmount)
      placeBet(arenaId, selectedSide, amount)
    } catch {
      toast.error('Invalid bet amount')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link to="/arena" className="inline-flex items-center gap-1 text-gray-500 hover:text-orange-500 transition-colors">
        <ArrowLeft size={18} />
        Back to Arenas
      </Link>

      {/* Title card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>{statusLabel}</span>
          <span className="text-gray-400 text-sm">Arena #{arena.id}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{arena.title}</h1>
        {arena.description && (
          <p className="text-gray-400">{arena.description}</p>
        )}

        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div>
            <Trophy className="w-5 h-5 mx-auto mb-1 text-orange-400" />
            <p className="text-2xl font-bold">{poolDisplay}</p>
            <p className="text-xs text-gray-400">Prize Pool (PAS)</p>
          </div>
          <div>
            <Users className="w-5 h-5 mx-auto mb-1 text-orange-400" />
            <p className="text-2xl font-bold">{arena.betCount}</p>
            <p className="text-xs text-gray-400">Total Bets</p>
          </div>
          <div>
            <Clock className="w-5 h-5 mx-auto mb-1 text-orange-400" />
            <p className="text-sm font-mono">{bettingDeadline.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Bet Deadline</p>
          </div>
        </div>
      </div>

      {/* Live Odds */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-orange-500" />
          Live Odds
        </h2>
        <OddsBar pctA={pctA} pctB={pctB} sideA={arena.sideA} sideB={arena.sideB} />

        <div className="grid grid-cols-2 gap-4 mt-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">{arena.sideA}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {Number(formatEther(totalA)).toFixed(4)} PAS
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3">
            <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{arena.sideB}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {Number(formatEther(totalB)).toFixed(4)} PAS
            </p>
          </div>
        </div>
      </div>

      {/* Odds History Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Odds Movement
        </h2>
        <MiniOddsChart history={history} />
      </div>

      {/* Place Bet */}
      {canBet && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Place Your Bet</h2>

          {/* Side selector */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setSelectedSide(1)}
              className={`p-4 rounded-xl border-2 transition-all font-semibold text-center ${
                selectedSide === 1
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-blue-300'
              }`}
            >
              {arena.sideA}
              <p className="text-xs mt-1 font-normal opacity-75">{pctA.toFixed(1)}% odds</p>
            </button>
            <button
              onClick={() => setSelectedSide(2)}
              className={`p-4 rounded-xl border-2 transition-all font-semibold text-center ${
                selectedSide === 2
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-red-300'
              }`}
            >
              {arena.sideB}
              <p className="text-xs mt-1 font-normal opacity-75">{pctB.toFixed(1)}% odds</p>
            </button>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bet Amount (PAS)
            </label>
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-2 mt-2">
              {['0.01', '0.1', '1', '10'].map((v) => (
                <button
                  key={v}
                  onClick={() => setBetAmount(v)}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  {v} PAS
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleBet}
            disabled={isPending || isConfirming}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedSide === 1
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/25'
            }`}
          >
            {isPending ? 'Confirm in wallet...' : isConfirming ? 'Processing...' : `Bet on ${selectedSide === 1 ? arena.sideA : arena.sideB}`}
          </button>
        </div>
      )}

      {/* Your Bets */}
      {address && userBets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Your Bets</h2>
          {userSideA > 0n && (
            <p className="text-blue-600 dark:text-blue-400 font-semibold">
              {arena.sideA}: {Number(formatEther(userSideA)).toFixed(4)} PAS
            </p>
          )}
          {userSideB > 0n && (
            <p className="text-red-600 dark:text-red-400 font-semibold">
              {arena.sideB}: {Number(formatEther(userSideB)).toFixed(4)} PAS
            </p>
          )}
          {hasWinningBet && (
            <button
              onClick={() => claimWinnings(arenaId)}
              disabled={isPending || isConfirming}
              className="mt-3 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
            >
              {isPending ? 'Confirm...' : 'Claim Winnings 🎉'}
            </button>
          )}
        </div>
      )}

      {/* Resolve (Creator only) */}
      {canResolve && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Resolve Arena</h2>
          <p className="text-sm text-gray-500 mb-4">As the creator, select the winning side.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => resolveArena(arenaId, 1)}
              disabled={isPending || isConfirming}
              className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              {arena.sideA} Wins
            </button>
            <button
              onClick={() => resolveArena(arenaId, 2)}
              disabled={isPending || isConfirming}
              className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              {arena.sideB} Wins
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Resolve deadline: {resolveDeadline.toLocaleString()}
          </p>
        </div>
      )}

      {/* Result */}
      {isResolved && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-300 dark:border-green-700">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Result</h2>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {arena.winningSide === 1 ? arena.sideA : arena.sideB} Wins!
          </p>
        </div>
      )}

      {/* Recent Bets Feed */}
      {bets.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bet Activity</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...bets].reverse().map((bet: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${bet.side === 1 ? 'bg-blue-500' : 'bg-red-500'}`} />
                  <span className="text-gray-500 font-mono text-xs">
                    {bet.bettor?.slice(0, 6)}...{bet.bettor?.slice(-4)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${bet.side === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                    {bet.side === 1 ? arena.sideA : arena.sideB}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {Number(formatEther(BigInt(bet.amountWei))).toFixed(4)} PAS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
