# Creative Operations Platform

**Schema**: `creative_ops` | **Writer MCP Port**: 8896 | **Aliases**: `:ces`, `:jam`, `:jp`, `:lions`, `:lp`

## Overview

The Creative Operations Platform unifies all creative AI capabilities under one system:

- **CES • JamPacked**: Ask Ces AI Platform with document extraction & archiving
- **Lions Palette Forge**: Creative campaign palette generation (Integration in progress)

## Architecture

```
creative-ops/
├── ces-jampacked/           # Main CES frontend (React + Vite)
├── lions-palette-forge/     # Palette generation system  
└── shared/                  # Shared creative components
```

## Features

### CES • JamPacked
- 📎 **Google Drive Integration** - Extract documents directly from Google Drive folders
- 🤖 **AI-Powered Processing** - Automatic text extraction, OCR, and embeddings
- 🎨 **TBWA Branded UI** - Seamless integration with chat interface
- 📊 **Real-time Progress** - Track extraction status with live updates

### Lions Palette Forge
- 🎨 **Campaign Palette Generation** - AI-driven color palette creation
- 🔄 **Integration with CES** - Seamless workflow integration
- 📋 **Campaign Management** - Store and manage creative campaigns

## Quick Start

```bash
# CES • JamPacked
cd ces-jampacked
npm install
npm run dev

# Lions Palette Forge
cd lions-palette-forge
npm install
npm run dev
```

## Deployment

- **Frontend**: Vercel (CES) + Custom deployment (Lions Palette)
- **Backend**: Supabase Edge Functions
- **Database**: PostgreSQL via Supabase (`creative_ops` schema)

## MCP Integration

- **Writer Port**: 8890
- **Pulser Aliases**: `:ces`, `:jam`, `:jp`, `:lions`, `:lp`
- **Schema**: `creative_ops`