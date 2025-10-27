import express from 'express'

const router = express.Router()

// GET /api/users/:address/stats - 獲取用戶統計
router.get('/:address/stats', async (req, res) => {
  try {
    const { address } = req.params

    // TODO: 從區塊鏈或數據庫查詢
    const stats = {
      address,
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalStaked: '0',
      totalWon: '0'
    }

    res.json({ data: stats })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    res.status(500).json({ error: 'Failed to fetch user stats' })
  }
})

// GET /api/users/:address/matches - 獲取用戶比賽列表
router.get('/:address/matches', async (req, res) => {
  try {
    const { address } = req.params
    const { limit = '50', offset = '0' } = req.query

    // TODO: 從區塊鏈或數據庫查詢
    const matches: any[] = []

    res.json({
      data: matches,
      meta: {
        total: 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    })
  } catch (error) {
    console.error('Error fetching user matches:', error)
    res.status(500).json({ error: 'Failed to fetch user matches' })
  }
})

console.log('👥 Users Routes Loaded - v0.5.0-mvp')

export default router

