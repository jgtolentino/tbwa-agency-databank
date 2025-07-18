# 🔄 Updated Product / Port Matrix

| #     | Product / App       | Supabase schema    | Git repo                | Writer MCP port | Pulser alias(es)          | KeyKey prefix |
| ----- | ------------------- | ------------------ | ----------------------- | --------------- | ------------------------- | ------------- |
| 1     | Scout Dash          | `scout_dash`       | `scout-dash`            | 8890            | `:scout`, `:sd`           | SCOUT         |
| 2     | HR / Admin          | `hr_admin`         | *(monorepo pkg)*        | 8891            | `:hr`                     | HR            |
| 3     | SUQI-Finance        | `financial_ops`    | `suqi-db-app`           | 8892            | `:fin`                    | FIN           |
| 4     | Operations Hub      | `operations`       | *(monorepo pkg)*        | 8893            | `:ops`                    | OPS           |
| 5     | Corporate Portal    | `corporate`        | *(monorepo pkg)*        | 8894            | `:corp`                   | CORP          |
| 6     | FACE (Senior-Care)  | `face_ops`         | `face-care-app`         | 8895            | `:face`, `:fc`            | FACE          |
| **7** | **CES • JamPacked** | **`creative_ops`** | **`creative-insights`** | **8896**        | **`:ces`, `:jam`, `:jp`** | **CES**       |
| 8     | QA Class            | `qa_class`         | `qa-class-app`          | 8897            | `:qa`                     | QA            |
| 9     | Lions Palette Forge | `palette_ops`      | `tbwa-agency-databank`  | 8898            | `:lions`, `:lp`           | PALETTE       |

*JamPacked's aliases (`:jam`, `:jp`) now point to the **same** reader/writer pair as CES.*

## 🔑 Secrets (KeyKey / Doppler)

```bash
# CES • JamPacked unified secrets
doppler secrets set \
  CES_ANON_KEY=<anon-pat> \
  CES_SERVICE_KEY=<service-pat> \
  --project tbwa-platform-keykey

# Lions Palette Forge
doppler secrets set \
  PALETTE_ANON_KEY=<anon PAT> \
  PALETTE_SERVICE_KEY=<service PAT> \
  --project tbwa-platform-keykey
```

## 🛠️ Repo / CI adjustments

### 1. CES • JamPacked Integration

**Git repo** stays `creative-insights` (or `ces-jampacked` if you want to rename).

**Pulser agents**
```yaml
# packages/agents/ces_reader.yaml  (shared aliases)
name: ces_reader
codename: ces
aliases: [ces, jam, jp]
search_path: creative_ops
```

**CI matrix**
```yaml
schema:  [hr_admin, financial_ops, operations, corporate, face_ops, creative_ops, qa_class, palette_ops]
port:    [8891,     8892,          8893,       8894,      8895,      8896,         8897,      8898]
```

### 2. WARC Data Integration

The WARC case studies are now processed through the ETL pipeline:

- **Bronze landing**: Raw WARC JSON files stored in `bronze.warc_raw`
- **Silver transform**: Processed cases in `silver.warc_cases`  
- **Gold**: Integrated with campaign performance metrics

**WARC Tools in CES Agent:**
```yaml
- name: warc_search
  method: POST
  path: /warc/search
  
- name: warc_effectiveness
  method: POST
  path: /warc/effectiveness
```

## 🤖 Claude / ChatGPT usage

```bash
:ces  "latest ROAS for Meta campaigns"
:jam  "suggest a creative tweak for campaign 123"
:jp   "top 5 scenes with over-indexing engagement"
:lions "analyze color palette effectiveness for Q3"
:lp   "generate palette from brand guidelines"
```

All CES aliases (`:ces`, `:jam`, `:jp`) hit the same **creative_ops** schema via the shared reader MCP.

## 📊 Current Data Sources

### CES • JamPacked
- **Schema**: `creative_ops`
- **Data**: Campaign performance, creative assets, WARC case studies
- **WARC Cases**: 25 effectiveness case studies from WARC Effective 100 (2021-2025)

### Lions Palette Forge  
- **Schema**: `palette_ops`
- **Data**: Brand palettes, color analysis, campaign swatches
- **Integration**: Connects to CES for effectiveness correlation

## ✅ Implementation Status

✅ **CES • JamPacked unified** - Single schema, shared aliases
✅ **WARC ETL pipeline** - 25 case studies processed and ready for ingestion
✅ **Lions Palette Forge planning** - Port 8898 reserved, schema designed
✅ **Product matrix updated** - All ports and aliases documented

## 🔄 Next Steps

1. **Deploy WARC data** to `creative_ops.warc_cases` table
2. **Set up Lions Palette Forge** using port 8898
3. **Test unified aliases** in Claude Desktop and Pulser CLI
4. **Cross-reference** palette effectiveness with WARC campaign data