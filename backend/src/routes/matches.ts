import express from 'express'

const router = express.Router()

// GET /api/matches - 獲取所有比賽
router.get('/', async (req, res) => {
  try {
    const { status, mode, limit = '50', offset = '0' } = req.query

    // TODO: 從數據庫或區塊鏈查詢比賽
    // 暫時返回模擬數據
    const mockMatches = [
      {
        id: 1,
        creator: '0x1234567890123456789012345678901234567890',
        participants: [
          '0x1234567890123456789012345678901234567890',
          '0x0000000000000000000000000000000000000000'
        ],
        stakeAmount: '100000000000000000',
        status: 0,
        mode: 0,
        startTime: Math.floor(Date.now() / 1000) + 3600,
        endTime: Math.floor(Date.now() / 1000) + 7200,
        description: 'Pickleball 單打比賽 - 初級組',
        externalMatchId: '',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        creator: '0x2345678901234567890123456789012345678901',
        participants: [
          '0x2345678901234567890123456789012345678901',
          '0x3456789012345678901234567890123456789012'
        ],
        stakeAmount: '500000000000000000',
        status: 1,
        mode: 0,
        startTime: Math.floor(Date.now() / 1000) - 1800,
        endTime: Math.floor(Date.now() / 1000) + 1800,
        description: 'Pickleball 雙打比賽 - 高級組',
        externalMatchId: '',
        createdAt: new Date().toISOString()
      }
    ]

    // 過濾
    let filtered = mockMatches
    if (status !== undefined) {
      filtered = filtered.filter(m => m.status === parseInt(status as string))
    }
    if (mode !== undefined) {
      filtered = filtered.filter(m => m.mode === parseInt(mode as string))
    }

    // 分頁
    const start = parseInt(offset as string)
    const end = start + parseInt(limit as string)
    const paginated = filtered.slice(start, end)

    res.json({
      data: paginated,
      meta: {
        total: filtered.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    })
  } catch (error) {
    console.error('Error fetching matches:', error)
    res.status(500).json({ error: 'Failed to fetch matches' })
  }
})

// GET /api/matches/:id - 獲取單個比賽
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // TODO: 從數據庫或區塊鏈查詢比賽
    const mockMatch = {
      id: parseInt(id),
      creator: '0x1234567890123456789012345678901234567890',
      participants: [
        '0x1234567890123456789012345678901234567890',
        '0x0000000000000000000000000000000000000000'
      ],
      stakeAmount: '100000000000000000',
      status: 0,
      mode: 0,
      startTime: Math.floor(Date.now() / 1000) + 3600,
      endTime: Math.floor(Date.now() / 1000) + 7200,
      description: 'Pickleball 單打比賽 - 初級組',
      externalMatchId: '',
      winner: '0x0000000000000000000000000000000000000000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    res.json({ data: mockMatch })
  } catch (error) {
    console.error('Error fetching match:', error)
    res.status(500).json({ error: 'Failed to fetch match' })
  }
})

// POST /api/matches - 創建比賽（webhook from blockchain）
router.post('/', async (req, res) => {
  try {
    const matchData = req.body

    // TODO: 保存到數據庫
    console.log('New match created:', matchData)

    res.status(201).json({
      message: 'Match created successfully',
      data: matchData
    })
  } catch (error) {
    console.error('Error creating match:', error)
    res.status(500).json({ error: 'Failed to create match' })
  }
})

console.log('📋 Matches Routes Loaded - v0.5.0-mvp')

export default router

