import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { config } from './config/wagmi'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import CreateMatch from './pages/CreateMatch'
import MatchList from './pages/MatchList'
import MatchDetail from './pages/MatchDetail'
import MyMatches from './pages/MyMatches'
import Stats from './pages/Stats'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateMatch />} />
              <Route path="/matches" element={<MatchList />} />
              <Route path="/matches/:id" element={<MatchDetail />} />
              <Route path="/my-matches" element={<MyMatches />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App

