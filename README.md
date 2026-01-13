# DotDuel - Decentralized Duel Prediction Platform

> Decentralized 1v1 prediction platform built on **Mantle Network**

## 🎯 Project Overview

**DotDuel** is a decentralized peer-to-peer prediction protocol designed for 1v1 duels and sports events (e.g., pickleball tournaments). Two users can create and participate in prediction contracts on specific match outcomes.

### Key Features

- 🎯 **Prediction Contracts**: Users can initiate prediction contracts expressing their judgment on match outcomes
- 🔒 **Transparent & Trustless**: The entire process is secured by smart contract code
- 💎 **MNT Staking**: Uses MNT tokens as collateral for predictions
- ⚡ **Automatic Settlement**: Smart contracts automatically execute settlement and fairly distribute assets
- 📊 **On-chain Transparency**: All prediction records and settlement results are verifiable on-chain

### Blockchain
- **Mantle Mainnet**: Chain ID 5000, RPC `https://rpc.mantle.xyz`
- **Mantle Sepolia Testnet**: Chain ID 5003, RPC `https://rpc.sepolia.mantle.xyz`
- Explorer: [mantlescan.xyz](https://mantlescan.xyz) / [sepolia.mantlescan.xyz](https://sepolia.mantlescan.xyz)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask with Mantle network configured

### Installation and Setup

#### 1. Clone and Install
```bash
git clone https://github.com/hkfish01/Polkadot-DotDuel_v2.git
cd Polkadot-DotDuel_v2
```

#### 2. Smart Contract Deployment
```bash
cd contracts
npm install
cp .env.example .env
# Edit .env with your DEPLOYER_PRIVATE_KEY

# Deploy to Mantle Sepolia Testnet
npx hardhat run scripts/deploy.ts --network mantleSepolia

# Or deploy to Mantle Mainnet
npx hardhat run scripts/deploy.ts --network mantle
```

#### 3. Contract Verification (Optional)
```bash
npx hardhat verify --network mantleSepolia <CONTRACT_ADDRESS> <PLATFORM_WALLET> <ORACLE_ADDRESS>
```

#### 4. Backend Setup
```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env with CONTRACT_ADDRESS and RPC_URL
npm run dev
```

#### 5. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with VITE_CONTRACT_ADDRESS
npm run dev
```

## 📁 Project Structure

```
DotDuel/
├── contracts/          ✅ Smart Contracts
│   ├── contracts/
│   │   └── DuelPlatform.sol
│   ├── scripts/
│   │   └── deploy.ts
│   ├── test/
│   │   └── DuelPlatform.test.ts
│   └── hardhat.config.ts
├── frontend/           ✅ React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/wagmi.ts
│   │   └── App.tsx
│   └── package.json
├── backend/            ✅ Node.js Backend
│   └── src/
│       ├── routes/
│       └── services/
├── docs/               📚 Documentation
│   └── presentation/
└── README.md
```

## 🛠️ Tech Stack

### Smart Contract
- Solidity 0.8.20
- Hardhat
- OpenZeppelin
- ethers.js v6

### Blockchain
- Mantle Network (EVM-compatible L2)
- MNT native token

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Lucide Icons

### 後端（計劃中）
- Node.js
- Express
- PostgreSQL
- Redis


### 完整設計文檔
- [快速參考](../docs/00-quick-reference.md)
- [項目概述](../docs/01-project-overview.md)
- [系統架構](../docs/02-system-architecture.md)
- [智能合約設計](../docs/03-smart-contract-design.md)
- [前端設計](../docs/04-frontend-design.md)

## 🎨 功能特色

### 雙模式系統

#### 模式1: 裁判模式
- 裁判創建比賽
- 手動提交結果
- 手續費: 裁判 3% + 平台 0.5%

#### 模式2: API 自動模式
- 從外部 API 同步比賽
- Oracle 自動提交結果
- 手續費: 平台 0.5%

### 核心功能
- ✅ 創建比賽
- ✅ 加入比賽
- ✅ 自動結算
- ✅ 用戶統計
- ✅ 取消退款

## 🧪 測試

### 運行智能合約測試
```bash
cd hackathon/contracts
npm test
```

### 測試覆蓋
- ✅ 部署測試 (3)
- ✅ 創建比賽 (2)
- ✅ 加入比賽 (3)
- ✅ 結算功能 (2)
- ✅ 取消比賽 (1)
- ✅ 管理功能 (2)
- ✅ 查詢功能 (1)

**總計**: 14/14 通過 ✅

## 🔧 開發規範

### 版本管理
- 每次更新在 console 顯示版本號 ✅
- 版本號格式: `v主版本.次版本.修訂號-mvp`
- 當前版本: **v0.2.0-mvp**

### 文檔管理
- 所有文檔放在 `docs/日期-序號/` 目錄 ✅
- 每次重大更新創建新的日期目錄
- 包含 `progress.md` 和 `summary.md`

### 代碼規範
- TypeScript 嚴格模式 ✅
- ESLint 代碼檢查 ✅
- Prettier 格式化 ✅
- Git commit 規範 ✅

## 💻 開發命令

### 智能合約
```bash
cd hackathon/contracts
npm run compile      # 編譯合約
npm test            # 運行測試
npm run deploy:local # 部署到本地
npm run deploy:passet # 部署到測試網
```

### 前端
```bash
cd hackathon/frontend
npm run dev         # 開發服務器
npm run build       # 構建生產版本
npm run preview     # 預覽生產版本
```

## 📄 許可證

MIT License

---

**Made with ❤️ for Polkadot Hackathon 2025**

**版本**: v1.0.0-mvp  
**最後更新**: 2025-10-27  
**項目名稱**: DotDuel - 去中心化預測協議  
**項目狀態**: 🟢 MVP 開發完成  
