import express from 'express'

const router = express.Router()

// GET /api/stats/platform - 獲取平台統計
router.get('/platform', async (req, res) => {
  try {
    // TODO: 從數據庫查詢真實數據
    const stats = {
      totalMatches: 156,
      activeMatches: 12,
      completedMatches: 132,
      cancelledMatches: 12,
      totalUsers: 48,
      totalVolume: '234.5',
      topPlayers: [
        {
          address: '0x1234567890123456789012345678901234567890',
          wins: 15,
          losses: 3,
          winRate: 83.3,
          totalVolume: '45.2'
        },
        {
          address: '0x2345678901234567890123456789012345678901',
          wins: 12,
          losses: 4,
          winRate: 75.0,
          totalVolume: '38.5'
        }
      ]
    }

    res.json({ data: stats })
  } catch (error) {
    console.error('Error fetching platform stats:', error)
    res.status(500).json({ error: 'Failed to fetch platform stats' })
  }
})

// GET /api/stats/recent - 獲取最近比賽
router.get('/recent', async (req, res) => {
  try {
    const { limit = '10' } = req.query

    // TODO: 從數據庫查詢
    const recentMatches = [
      {
        id: 1,
        description: 'Pickleball 單打',
        stakeAmount: '500000000000000000',
        status: 3,
        winner: '0x1234567890123456789012345678901234567890',
        completedAt: new Date().toISOString()
      }
    ]

    res.json({ data: recentMatches })
  } catch (error) {
    console.error('Error fetching recent matches:', error)
    res.status(500).json({ error: 'Failed to fetch recent matches' })
  }
})

console.log('📊 Stats Routes Loaded - v0.5.0-mvp')

export default router

