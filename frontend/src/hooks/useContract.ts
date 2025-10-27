import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACT_ADDRESS } from '../config/wagmi'
import DuelPlatformABI from '../contracts/DuelPlatform.json'

export function useContract() {
  // 寫入合約
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  
  // 等待交易確認
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash })

  // 創建比賽
  const createMatch = async (
    mode: number,
    stakeAmount: bigint,
    startTime: number,
    endTime: number,
    description: string,
    externalMatchId: string,
    includeStake: boolean = false
  ) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: DuelPlatformABI.abi,
      functionName: 'createMatch',
      args: [mode, stakeAmount, startTime, endTime, description, externalMatchId],
      value: includeStake ? stakeAmount : 0n,
    })
  }

  // 加入比賽
  const joinMatch = async (matchId: number, stakeAmount: bigint) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: DuelPlatformABI.abi,
      functionName: 'joinMatch',
      args: [matchId],
      value: stakeAmount,
    })
  }

  // 提交結果（裁判）
  const submitResultByReferee = async (matchId: number, winner: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: DuelPlatformABI.abi,
      functionName: 'submitResultByReferee',
      args: [matchId, winner],
    })
  }

  // 取消比賽
  const cancelMatch = async (matchId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi: DuelPlatformABI.abi,
      functionName: 'cancelMatch',
      args: [matchId],
    })
  }

  return {
    createMatch,
    joinMatch,
    submitResultByReferee,
    cancelMatch,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  }
}

// 讀取合約數據
export function useMatchData(matchId: number) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DuelPlatformABI.abi,
    functionName: 'getMatch',
    args: [matchId],
  })

  return { match: data, isLoading, error }
}

export function useUserStats(address: string | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DuelPlatformABI.abi,
    functionName: 'getUserStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { stats: data, isLoading, error }
}

export function useUserMatches(address: string | undefined) {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DuelPlatformABI.abi,
    functionName: 'getUserMatches',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  return { matches: data, isLoading, error }
}

console.log('🎣 Contract Hooks Loaded - v0.2.0-mvp')

