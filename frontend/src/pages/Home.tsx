import { Link } from 'react-router-dom'
import { Trophy, Users, Shield, Zap } from 'lucide-react'
import { usePlatformStats } from '../hooks/useMatchesApi'
import { formatEther } from 'ethers'

export default function Home() {
  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: '透明預測',
      description: '智能合約自動執行，代碼保障公平性',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '雙模式',
      description: '裁判模式和 Oracle 自動模式，靈活選擇',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '安全可靠',
      description: '智能合約托管，合約資產安全有保障',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: '自動結算',
      description: '比賽結束後自動結算，透明分配合約資產',
    },
  ]

  const { data: stats } = usePlatformStats()
  const totalMatches = stats?.totalMatches ?? 0
  const totalVolumeDOT = stats ? Number(formatEther(BigInt(stats.totalVolumeWei))) : 0
  const totalUsers = stats?.totalUsers ?? 0

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 rounded-full text-sm font-medium mb-4">
            Dot Your Future Hackathon 2025
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          DotDuel
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
            去中心化預測協議
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          專為體育賽事設計的點對點預測協議，使用 DOT 代幣抵押您的預測立場，智能合約自動執行結算
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/create"
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            創建比賽
          </Link>
          <Link
            to="/matches"
            className="px-8 py-3 border-2 border-pink-500 text-pink-600 dark:text-pink-400 rounded-lg font-medium hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all"
          >
            瀏覽預測合約
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          核心特點
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <h2 className="text-3xl font-bold text-center mb-12">平台統計</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{totalMatches}</div>
            <div className="text-pink-100">預測合約數</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{totalVolumeDOT.toFixed(2)} DOT</div>
            <div className="text-pink-100">總合約資產</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">{totalUsers}</div>
            <div className="text-pink-100">參與用戶</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          如何使用
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: '連接錢包', desc: '使用 MetaMask 連接到 Polkadot 網絡' },
            { step: '2', title: '發起或參與預測', desc: '抵押 DOT 代幣表明您的預測立場' },
            { step: '3', title: '自動結算', desc: '比賽結束後智能合約自動分配合約資產' },
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
          準備好開始了嗎？
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          立即創建你的第一個對賭比賽
        </p>
        <Link
          to="/create"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          開始使用
        </Link>
      </section>
    </div>
  )
}

