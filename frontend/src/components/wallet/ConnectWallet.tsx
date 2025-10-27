import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut, Loader2 } from 'lucide-react'

export default function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Wallet size={16} className="text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-mono text-gray-900 dark:text-white">
            {formatAddress(address)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="斷開錢包"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">斷開</span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>連接中...</span>
            </>
          ) : (
            <>
              <Wallet size={16} />
              <span>連接錢包</span>
            </>
          )}
        </button>
      ))}
    </div>
  )
}

console.log('💼 ConnectWallet Component Loaded - v0.2.0-mvp')

