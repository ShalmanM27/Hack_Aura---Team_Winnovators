# **DeSocialX**

**DeSocialX** is a decentralized social media platform integrating **AI-powered learning**, **content monitoring**, and **blockchain-based governance**. Users control their data, gain rewards for meaningful participation, and transform social media engagement into productive, educational experiences.

---

## **Features**

* **Decentralized Architecture** – Blockchain-based user activity and identity
* **Blockchain-Based Identity & Profiles** – IPFS storage for avatars and media
* **AI-Powered Learning Modules** – Personalized content and quizzes
* **DAO Governance** – On-chain proposals and voting
* **Meta-Transactions (Gasless Experience)** – Users perform actions without paying gas fees directly
* **Streaks & NFT Rewards** – Daily tasks and badges for engagement
* **Gamified Learning Experience** – Module progression and interactive quizzes

---

## **Getting Started**

### **Prerequisites**

* Node.js & npm
* Python 3.9+
* MongoDB
* MetaMask wallet

---

### **Frontend Setup**

```bash
cd frontend
npm install
npm run start
```

* React web app runs in development mode at: **[http://localhost:3000](http://localhost:3000)**

---

### **Backend Setup**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

* FastAPI backend runs at: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

### **Environment Variables (.env)**

```dotenv
HELA_RPC=<Your_Helachain_RPC_URL>
PRIVATE_KEY=<Your_Private_Key>
FEED_ADDRESS=<Your_Feed_Contract_Address>
COMMENT_ADDRESS=<Your_Comment_Contract_Address>
LEARNING_BADGE_ADDRESS=<Your_Learning_Badge_Contract_Address>
STREAK_ADDRESS=<Your_Streak_Contract_Address>
LEARNING_ADDRESS=<Your_Learning_Contract_Address>
DAO_ADDRESS=<Your_DAO_Contract_Address>
MODERATION_ADDRESS=<Your_Moderation_Contract_Address>
PROFILE_ADDRESS=<Your_Profile_Contract_Address>
OPENROUTER_API_KEY=<Your_OpenRouter_API_Key>
```

> **Note:** Replace all `<PLACEHOLDER>` values with your own credentials. Never commit `.env` with real secrets to public repositories.

---

## **Project Structure**

```
frontend/      -> React web application
backend/       -> FastAPI backend services
app/           -> Backend source code
.env           -> Environment variables (sensitive)
```

---

## **Smart Contracts**

* **Feed** – Posts and multimedia storage
* **Comment** – On-chain comments
* **Learning & Badge** – AI learning modules and NFT badges
* **Streak** – Daily task tracking and rewards
* **DAO** – Community governance
* **Moderation** – Content moderation
* **Profile** – User avatars and profile management

> All contracts interact with the frontend via addresses stored in `.env`.

---

Hela Blockchain Deployments

The following smart contracts are deployed on the Hela testnet. These block explorer links serve as proof of deployment:

Feed: https://testnet.helascan.io/address/0xd18F6BA62bdF5daf10B4d4D0314ceEeF3C97e160

Streak: https://testnet.helascan.io/address/0x8091D1e79706626be8b8f7E5C4A303fc98Dcb8A3

Comment: https://testnet.helascan.io/address/0x380658edc24c3916A5d052D8C9263F362973614d

Learning: https://testnet.helascan.io/address/0xb8F249d13e4084D9BB3Ca52037F782ae8d948515

DAO: https://testnet.helascan.io/address/0x906c2EC19a7ADDc52653Ad592a19DaC24eEC9357

Profile: https://testnet.helascan.io/address/0x3A3Db94319Bb39B6936472F48E3bf59608fAB0a2

---

## **Key Highlights**

* Fully **decentralized social layer**
* **AI-generated personalized learning content**
* **Gasless meta-transactions**
* **Gamified quizzes, streaks, and NFT rewards**
* **DAO for community-driven governance**

---

## **License**

This project is licensed under the **MIT License**.
