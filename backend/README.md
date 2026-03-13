# Polkadot Duel Platform - Backend API

> 去中心化對賭平台後端 API 服務

**版本**: v0.6.0-mvp  
**技術棧**: Node.js + Express + TypeScript + ethers.js

## 📋 功能

- ✅ RESTful API
- ✅ 比賽數據查詢
- ✅ 用戶統計
- ✅ 平台統計
- ✅ Oracle 自動化服務
- ⏳ 數據庫集成

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 配置環境變量

```bash
cp .env.example .env
# 編輯 .env 文件配置你的參數
```

**重要配置**:
```env
# Oracle 配置
ORACLE_PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x...
RPC_URL=https://passet-hub-testnet.polkadot.io

# mydupr API
MYDUPR_API_URL=https://api.mydupr.com
```

### 開發模式

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
npm start
```

## 📡 API 端點

### 健康檢查

```
GET /health
```

### 比賽相關

```
GET /api/matches          # 獲取所有比賽
GET /api/matches/:id      # 獲取單個比賽
POST /api/matches         # 創建比賽（內部使用）
```

### 統計相關

```
GET /api/stats/platform   # 平台統計
GET /api/stats/recent     # 最近比賽
```

### 用戶相關

```
GET /api/users/:address/stats    # 用戶統計
GET /api/users/:address/matches  # 用戶比賽列表
```

### Oracle 相關 ✨ 新增

```
GET  /api/oracle/status    # Oracle 狀態
POST /api/oracle/start     # 啟動 Oracle
POST /api/oracle/stop      # 停止 Oracle
POST /api/oracle/settle    # 手動結算
POST /api/oracle/submit    # 提交結果
```

## 🔮 Oracle 服務

Oracle 服務負責自動化處理 Oracle 模式的比賽結算。

### 功能特點

- ✅ 自動監聽區塊鏈事件
- ✅ 定時檢查待結算比賽
- ✅ 從 mydupr API 獲取結果
- ✅ 自動提交結果到鏈上
- ✅ 手動觸發結算（測試用）

### 使用方法

#### 1. 啟動 Oracle

```bash
curl -X POST http://localhost:3000/api/oracle/start
```

#### 2. 檢查狀態

```bash
curl http://localhost:3000/api/oracle/status
```

#### 3. 手動結算

```bash
curl -X POST http://localhost:3000/api/oracle/settle \
  -H "Content-Type: application/json" \
  -d '{"matchId": 1, "externalMatchId": "mydupr-123456"}'
```

#### 4. 直接提交結果

```bash
curl -X POST http://localhost:3000/api/oracle/submit \
  -H "Content-Type: application/json" \
  -d '{"matchId": 1, "winner": "0x..."}'
```

## 🏗️ 項目結構

```
backend/
├── src/
│   ├── routes/
│   │   ├── matches.ts    # 比賽路由
│   │   ├── stats.ts      # 統計路由
│   │   ├── users.ts      # 用戶路由
│   │   └── oracle.ts     # Oracle 路由 ✨
│   ├── services/
│   │   └── oracle.ts     # Oracle 服務 ✨
│   └── index.ts          # 入口文件
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 開發

- 使用 TypeScript 進行類型安全開發
- 使用 tsx 進行熱重載開發
- 使用 ethers.js 與區塊鏈交互
- 遵循 RESTful API 設計規範

## 📝 注意事項

- 當前版本為 MVP，部分功能使用模擬數據
- Oracle 需要配置私鑰才能提交交易
- 生產環境需要配置真實的數據庫
- 需要足夠的 Gas 費用進行交易

## 🔐 安全

- 不要將私鑰提交到代碼庫
- 使用環境變量管理敏感信息
- 生產環境使用 HTTPS
- 實施適當的 API 限流

---

**Made with ❤️ for Polkadot Solidity Hackathon 2026**

**版本**: v0.6.0-mvp  
**更新**: 2025-10-27
