<!-- Don't delete it -->
<div name="readme-top"></div>

<!-- Organization Logo -->
<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 16px;">
  <img alt="Stability Nexus" src="public/stability.svg" width="175">
</div>

&nbsp;

<!-- Organization Name -->
<div align="center">

[![Static Badge](https://img.shields.io/badge/Stability_Nexus-Windmill_Exchange_WebUI-228B22?style=for-the-badge&labelColor=FFC517)](https://stability.nexus/)

</div>

<!-- Organization/Project Social Handles -->
<p align="center">
<!-- Telegram -->
<a href="https://t.me/StabilityNexus">
<img src="https://img.shields.io/badge/Telegram-black?style=flat&logo=telegram&logoColor=white&logoSize=auto&color=24A1DE" alt="Telegram Badge"/></a>
&nbsp;&nbsp;
<!-- X (formerly Twitter) -->
<a href="https://x.com/StabilityNexus">
<img src="https://img.shields.io/twitter/follow/StabilityNexus" alt="X (formerly Twitter) Badge"/></a>
&nbsp;&nbsp;
<!-- Discord -->
<a href="https://discord.gg/YzDKeEfWtS">
<img src="https://img.shields.io/discord/995968619034984528?style=flat&logo=discord&logoColor=white&logoSize=auto&label=Discord&labelColor=5865F2&color=57F287" alt="Discord Badge"/></a>
&nbsp;&nbsp;
<!-- Medium -->
<a href="https://news.stability.nexus/">
  <img src="https://img.shields.io/badge/Medium-black?style=flat&logo=medium&logoColor=black&logoSize=auto&color=white" alt="Medium Badge"></a>
&nbsp;&nbsp;
<!-- LinkedIn -->
<a href="https://linkedin.com/company/stability-nexus">
  <img src="https://img.shields.io/badge/LinkedIn-black?style=flat&logo=LinkedIn&logoColor=white&logoSize=auto&color=0A66C2" alt="LinkedIn Badge"></a>
&nbsp;&nbsp;
<!-- Youtube -->
<a href="https://www.youtube.com/@StabilityNexus">
  <img src="https://img.shields.io/youtube/channel/subscribers/UCZOG4YhFQdlGaLugr_e5BKw?style=flat&logo=youtube&logoColor=white&logoSize=auto&labelColor=FF0000&color=FF0000" alt="Youtube Badge"></a>
</p>

---

<div align="center">
<h1>Windmill Exchange Web UI</h1>
</div>

Windmill Exchange Web UI is the Next.js based frontend interface for interacting with the Windmill Exchange smart contracts.

---

## 🚀 Features

- **Wallet Integration**: Connect seamlessly via MetaMask and EIP-1193 compatible wallets.
- **Dynamic Order Dashboard**: Track and manage your orders and view their dynamically adjusting prices over time.
- **Keeper Monitor**: View the status of the decentralized keeper network and match logs.
- **Multi-Chain Native**: Supports deploying orders across various EVM chains effortlessly.

---

## Architecture

```text
Windmill-EVM-WebUI/
├── app/                  # Next.js 14+ App Router
├── components/           # Reusable UI components
├── context/              # React Context (WalletContext)
├── hooks/                # Custom React hooks (useContract)
└── lib/                  # Utilities and ABIs
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| UI | React, Tailwind CSS |
| Web3 Integration | Built-in window.ethereum (Ethers-free ABI encoding) |

---

## Getting Started

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| `node` | 20+ | [nodejs.org](https://nodejs.org/) |
| `npm` | 10+ | (comes with node) |

### Installation

```bash
git clone https://github.com/StabilityNexus/Windmill-EVM-Contracts.git
cd Windmill-EVM-Contracts/Windmill-EVM-WebUI
npm install
```

### Environment Setup

```bash
cp .env.local.example .env.local
```

Edit `.env.local` to specify environment values:

```env
NEXT_PUBLIC_DEFAULT_CHAIN_ID=11155111
```

---

## Usage

### Run Locally (Development)

```bash
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

### Run with Docker

```bash
# Build the image
docker build -t windmill-evm-webui .

# Run the container
docker run -p 3000:3000 windmill-evm-webui
```

---

## 🙌 Contributing

⭐ Don't forget to star this repository if you find it useful! ⭐

Thank you for considering contributing to this project! Contributions are highly appreciated and welcomed. To ensure smooth collaboration, please refer to our [Contribution Guidelines](./CONTRIBUTING.md).

---

## 📍 License

See the [LICENSE](LICENSE) file for details.

---

## 💪 Thanks To All Contributors

Thanks a lot for spending your time helping Windmill Exchange grow. Keep rocking!

[![Contributors](https://contrib.rocks/image?repo=StabilityNexus/Windmill-EVM-Contracts)](https://github.com/StabilityNexus/Windmill-EVM-Contracts/graphs/contributors)

© 2026 Stability Nexus
