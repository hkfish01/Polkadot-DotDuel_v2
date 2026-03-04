import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

// Mantle Mainnet config (placeholder — will be replaced with Revive chain)
export const mantleMainnet = {
  id: 5000,
  name: 'Mantle',
  network: 'mantle',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL || 'https://rpc.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Explorer',
      url: 'https://mantlescan.xyz',
    },
  },
  testnet: false,
}

// Mantle Sepolia Testnet config (placeholder — will be replaced with Revive testnet)
export const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia Testnet',
  network: 'mantle-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL || 'https://rpc.sepolia.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.sepolia.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Sepolia Explorer',
      url: 'https://sepolia.mantlescan.xyz',
    },
  },
  testnet: true,
}

// Select network based on environment variable
const useTestnet = import.meta.env.VITE_USE_TESTNET === 'true'
export const currentChain = useTestnet ? mantleSepolia : mantleMainnet

// Wagmi config
export const config = createConfig({
  chains: [currentChain as any],
  connectors: [
    injected({ target: 'metaMask' }),
  ],
  transports: {
    [mantleMainnet.id]: http(),
    [mantleSepolia.id]: http(),
  },
})

// Contract address
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

console.log('📋 Wagmi Config Loaded - v0.3.0-mantle')
console.log('🔗 Contract Address:', CONTRACT_ADDRESS)
console.log('🌐 Network:', currentChain.name)
console.log('🌐 RPC URL:', currentChain.rpcUrls.default.http[0])

