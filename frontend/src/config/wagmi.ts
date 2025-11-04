import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

// Passet Hub 測試網配置
export const passetHub = {
  id: 420420422,
  name: 'Passet Hub TestNet',
  network: 'passet-hub-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'PAS',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL || 'https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
    public: {
      http: [import.meta.env.VITE_RPC_URL || 'https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Passet Hub Explorer',
      url: import.meta.env.VITE_EXPLORER_URL || 'https://blockscout-passet-hub.parity-testnet.parity.io/',
    },
  },
  testnet: true,
}

// Wagmi 配置
export const config = createConfig({
  chains: [passetHub as any],
  connectors: [
    injected({ target: 'metaMask' }),
  ],
  transports: {
    [passetHub.id]: http(),
  },
})

// 合約地址
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

console.log('📋 Wagmi Config Loaded - v0.2.0-mvp')
console.log('🔗 Contract Address:', CONTRACT_ADDRESS)
console.log('🌐 RPC URL:', passetHub.rpcUrls.default.http[0])

