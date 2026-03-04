import { Github, Twitter, Send } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              DotDuel is a decentralised 1v1 prediction & tournament platform
              built on Polkadot with Revive (REVM) technology.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/tournaments" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400">
                  Tournaments
                </a>
              </li>
              <li>
                <a href="https://github.com" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://wiki.polkadot.network" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400">
                  Polkadot Wiki
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Community
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors"
              >
                <Github size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors"
              >
                <Twitter size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors"
              >
                <Send size={20} className="text-gray-700 dark:text-gray-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 DotDuel — Decentralised Prediction & Tournament Protocol. Built for Polkadot Hackathon.</p>
            <p className="mt-2 md:mt-0">Version: v2.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

