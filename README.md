# TBWA Unified Platform - Neural DataBank

## Architecture Overview

The **TBWA Unified Platform** is a comprehensive, integrated data system built on **PostgreSQL via Supabase**, utilizing a **Medallion Lakehouse architecture** (Bronze, Silver, Gold layers) and a robust **Microservices Command Pattern (MCP)**. It unifies data from **Lions Palette Forge**, **Scout Analytics**, and **TBWA HRIS** into a single source of truth.

### 🧠 Neural DataBank Concept
- **Autonomous Intelligence Layers**: AI agents at every stage (Bronze, Silver, Gold)
- **Proprietary Neural Embeddings**: Unique vector representations for competitive moat
- **Behavioral Prediction Engine**: Real-time personalization and prediction
- **Auto-Model Factory**: 100+ models monthly generation target

### 🗄️ Database Schema
- **12 core tables** and **5 materialized views**
- **50+ optimized indexes** and **8 foreign key relationships**
- **JSONB** and **array support** for flexible data handling
- **18 regional divisions** tailored for Philippine market

## 🔗 Unified Platform Ports & Schemas

**Centralized Reader MCP on port 8888** serves as the single source of truth for querying across all schemas via Pulser, Claude, and ChatGPT.

### Product/Port Matrix

| Product | Schema | Writer MCP Port | Pulser Alias | Status |
|---------|---------|-----------------|--------------|--------|
| **Scout Dash** | `scout_dash` | **8890** | `:scout`, `:sd` | ✅ Production Ready |
| **CES • JamPacked** | `creative_ops` | **8896** | `:ces`, `:jam`, `:jp`, `:lions`, `:lp` | ✅ Production Deployed |
| **HR / Admin** | `hr_admin` | **8891** | `:hr` | 🚧 Planned |
| **Finance** | `financial_ops` | **8892** | `:fin` | 🚧 Planned |
| **Operations Hub** | `operations` | **8893** | `:ops` | 🚧 Planned |
| **Corporate Portal** | `corporate` | **8894** | `:corp` | 🚧 Planned |
| **FACE (Senior-Care)** | `face_ops` | **8895** | `:face`, `:fc` | 🚧 Planned |
| **QA Class** | `qa_class` | **8897** | `:qa` | 🚧 Planned |

---

### 🎨 CES • JamPacked (Creative AI)
**Location**: `/` (root)  
**Status**: ✅ Production Deployed  
**URL**: https://lovable.dev/projects/25581f0b-a5bb-4d04-a5e1-a1afdcebe3cc
**Schema**: `creative_ops` | **Writer MCP Port**: 8896 | **Aliases**: `:ces`, `:jam`, `:jp`

**Features**:
- **Ask Ces AI Platform**: Document extraction & archiving capabilities
- **Lions Palette Forge**: Creative campaign palette generation (🚧 Integration)
- **AI-Powered Processing**: Automatic text extraction, OCR, and embeddings
- **TBWA Branded UI**: Seamless integration with chat interface
- **Real-time Progress**: Track extraction status with live updates

## 🚀 Document Extraction & Archiving

The CES platform includes powerful document extraction capabilities:

- 📎 **Google Drive Integration** - Extract documents directly from Google Drive folders
- 🤖 **AI-Powered Processing** - Automatic text extraction, OCR, and embeddings
- 🎨 **TBWA Branded UI** - Seamless integration with the Ask Ces chat interface
- 📊 **Real-time Progress** - Track extraction status with live updates

### Quick Access
Click the **paperclip icon** in the chat interface to start extracting documents!

See [DOCUMENT_EXTRACTION_README.md](./DOCUMENT_EXTRACTION_README.md) for detailed documentation.

---

### 📊 Scout Dashboard 3.0
**Location**: `projects/scout-dashboard/`  
**Status**: ✅ Production Ready  
**Branch**: `scout-dashboard`  
**Description**: Multi-agent powered analytics platform with enterprise-grade governance

**Key Features**:
- 🤖 **4 AI Agents**: Aladdin Insights, RetailBot, AdsBot, SQL-Certifier
- 📊 **Optimized Performance**: Handles 15,000+ records with memoization
- 🔒 **Enterprise Security**: Row Level Security (RLS) and audit logging
- 📱 **Responsive Design**: 4 → 2 → 1 column adaptive layout
- 🎯 **Role-Based Access**: Executive, Regional Manager, Analyst, Store Owner

**Tech Stack**: Next.js 15 + Supabase Edge Functions + Groq LPU + TypeScript

**Quick Start**:
```bash
cd projects/scout-dashboard
npm install
npm run dev
```

## Repository Structure

```
tbwa-agency-databank/
├── platforms/
│   ├── creative-ops/             # Creative Operations (Port 8896)
│   │   ├── ces-jampacked/        # CES • JamPacked frontend
│   │   └── lions-palette-forge/  # Lions Palette integration
│   ├── scout-dash/               # Scout Dashboard 3.0 (Port 8890)
│   ├── hr-admin/                 # HR & Admin (Port 8891)
│   ├── finance/                  # Finance Operations (Port 8892)
│   ├── operations/               # Operations Hub (Port 8893)
│   ├── corporate/                # Corporate Portal (Port 8894)
│   ├── face-ops/                 # FACE Senior Care (Port 8895)
│   └── qa-class/                 # QA Class (Port 8897)
├── infrastructure/
│   ├── mcp-services/             # MCP Reader (Port 8888) + Writers
│   ├── database/                 # Supabase configs & schemas
│   ├── shared-libs/              # Common utilities
│   ├── scripts/                  # Deployment scripts
│   └── service/                  # Service configurations
├── docs/                         # Documentation
├── .github/                      # CI/CD workflows
└── README.md                     # This file
```

## Branch Strategy

- **`main`** - Production releases (all platforms)
- **`develop`** - Development integration
- **`platform/*`** - Platform-specific development
- **`feature/*`** - Feature branches
- **`infrastructure/*`** - Infrastructure updates

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/25581f0b-a5bb-4d04-a5e1-a1afdcebe3cc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/25581f0b-a5bb-4d04-a5e1-a1afdcebe3cc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
