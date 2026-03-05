import { Link } from 'react-router-dom'
import { Trophy, Users, Shield, Zap, Swords, TrendingUp } from 'lucide-react'
import { usePlatformStats } from '../hooks/useMatchesApi'
import { formatEther } from 'ethers'

export default function Home() {
  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Transparent Predictions',
      description: 'Smart contracts auto-execute — code guarantees fairness',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Dual Mode',
      description: 'Referee mode & Oracle auto mode — flexible for every scenario',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & Trustless',
      description: 'Funds custodied by smart contracts — no middleman required',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Auto Settlement',
      description: 'Results settled and prizes distributed instantly on-chain',
    },
    {
      icon: <Swords className="w-8 h-8" />,
      title: 'Tournament Brackets',
      description: '4/8/16-player elimination brackets with prize pools',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Prediction Market',
      description: 'Polymarket-style bets on tournament winners — earn rewards',
    },
  ]

  const { data: stats } = usePlatformStats()
  const totalMatches = stats?.totalMatches ?? 0
  const totalVolumeETH = stats ? Number(formatEther(BigInt(stats.totalVolumeWei))) : 0
  const totalUsers = stats?.totalUsers ?? 0

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full text-sm font-medium mb-4">
            Polkadot Hackathon 2025 — Track 3: Original DApp
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          DotDuel
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            Decentralised Prediction Protocol
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Peer-to-peer 1v1 predictions and bracket-style tournaments with on-chain settlement.
          Stake your position, compete, and earn — powered by Polkadot &amp; Revive.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/create"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Create Duel
          </Link>
          <Link
            to="/tournaments"
            className="px-8 py-3 border-2 border-pink-500 text-pink-600 dark:text-pink-400 rounded-lg font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
          >
            Browse Tournaments
          </Link>
          <Link
            to="/matches"
            className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            View All Duels
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Core Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{totalMatches}</div>
            <div className="text-pink-100">Total Duels</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{totalVolumeETH.toFixed(2)} PAS</div>
            <div className="text-pink-100">Total Volume</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{totalUsers}</div>
            <div className="text-pink-100">Unique Users</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Connect Wallet', desc: 'Connect MetaMask to the Polkadot network' },
            { step: '2', title: 'Create or Join', desc: 'Stake PAS on a 1v1 duel or join a tournament bracket' },
            { step: '3', title: 'Auto Settlement', desc: 'Smart contract distributes winnings automatically after result' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Compete?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Create your first duel or join a tournament right now
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link
            to="/create"
            className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Create Duel
          </Link>
          <Link
            to="/tournaments/create"
            className="inline-block px-8 py-3 border-2 border-pink-500 text-pink-600 dark:text-pink-400 rounded-lg font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
          >
            Create Tournament
          </Link>
        </div>
      </section>
    </div>
  )
}

