# DashMorph
## Universal Dashboard Dissection & Reconstruction System

DashMorph is a powerful system that can reproduce or recreate dashboards from any BI service or format to another by surgically dissecting all dashboard components and refitting/retargeting them with **full pixel parity**.

## ✨ Features

### Universal Extraction
- **BI Tools**: Tableau, PowerBI, Looker, Qlik, Metabase, Superset
- **Design Tools**: Figma, Sketch, Adobe XD, Framer
- **Code Sources**: HTML, React, Vue, Angular
- **Visual Sources**: Screenshots, PDFs, URLs

### Pixel-Perfect Reconstruction
- **Target Frameworks**: React, Vue, Angular, Svelte, Next.js, Nuxt, SvelteKit
- **Styling Systems**: Tailwind, Styled Components, Emotion, CSS Modules
- **Chart Libraries**: Recharts, D3, Plotly, Chart.js, Vega, ECharts
- **Validation**: Automated pixel-matching with 95%+ accuracy

### SuperClaude Integration
- **Seamless CLI**: Works with Claude Code and SuperClaude framework
- **Smart Commands**: `/design`, `/build`, `/analyze`, `/improve`, `/migrate`
- **Persona Awareness**: Adapts to frontend, backend, QA, and other specialist personas
- **AI Enhancement**: Leverages AI for complex component analysis

## 🚀 Quick Start

### Installation

```bash
npm install -g dashmorph
```

### Basic Usage

```bash
# Transform Figma design to React with pixel parity
dashmorph morph -s "https://figma.com/file/abc123" -t react --styling tailwind --validate

# Extract and analyze dashboard components
dashmorph extract -s "./dashboard.html" -o analysis.json

# Validate pixel parity between source and generated
dashmorph validate -s "source.png" -g "http://localhost:3000" --threshold 95
```

### SuperClaude Commands

```bash
# Design-to-code with pixel perfection
/design @figma/dashboard-mockup --target react --pixel-perfect

# Build from any BI source
/build dashboard --from tableau --react --tailwind

# Analyze existing dashboard
/analyze @dashboard/url --components --design-system --accessibility

# Improve dashboard quality
/improve @current/dashboard --accessibility --performance --responsive

# Migrate between platforms
/migrate @powerbi/dashboard --to vue --preserve-interactions
```

## 📚 Documentation

### Core Architecture

DashMorph follows a 4-stage pipeline:

1. **Extract** → Analyze source dashboard and extract components
2. **Dissect** → Intelligently categorize and analyze components
3. **Generate** → Create target framework code with design systems
4. **Validate** → Ensure pixel-perfect accuracy with visual regression testing

### Component Intelligence

- **Smart Detection**: Automatically identifies charts, KPIs, tables, filters, layouts
- **Design System Extraction**: Extracts colors, typography, spacing, shadows
- **Interaction Mapping**: Preserves user interactions and data bindings
- **Responsive Analysis**: Understands mobile and responsive patterns

### Pixel Parity Validation

- **Visual Regression**: Uses pixelmatch for precise comparison
- **Component-Level**: Validates individual components and layouts
- **Threshold Control**: Configurable accuracy requirements (90-99%)
- **Detailed Reports**: Comprehensive validation reports with recommendations

## 🎯 Use Cases

### Design-to-Code
```bash
# Transform any Figma design to production code
dashmorph morph -s "figma-url" -t react --typescript --tests --stories
```

### BI Migration
```bash
# Migrate Tableau dashboard to modern web stack
dashmorph morph -s "tableau-url" -t nextjs --charts recharts --styling tailwind
```

### Legacy Modernization
```bash
# Convert old HTML dashboards to modern frameworks
dashmorph morph -s "./legacy-dashboard.html" -t vue --responsive --accessibility
```

### Quality Improvement
```bash
# Enhance existing dashboard with modern practices
/improve @current/dashboard --accessibility --performance --responsive
```

## 🛠 Advanced Configuration

### Target Configuration
```typescript
{
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'nextjs' | 'nuxt' | 'sveltekit',
  styling: 'tailwind' | 'styled-components' | 'emotion' | 'css-modules' | 'vanilla-css',
  charts: 'recharts' | 'd3' | 'plotly' | 'chartjs' | 'vega' | 'echarts',
  typescript: boolean,
  outputDir: string,
  packageManager: 'npm' | 'yarn' | 'pnpm'
}
```

### Validation Options
```typescript
{
  threshold: 95,           // Pixel match percentage required
  includeInteractions: true,  // Test interactions
  includeResponsive: true,    // Test responsive behavior
  generateReport: true,       // Generate detailed report
  outputDir: './validation-report'
}
```

### SuperClaude Persona Integration
- **Frontend**: Optimizes for UI/UX and responsive design
- **QA**: Includes comprehensive testing and validation
- **Performance**: Focuses on optimization and efficiency
- **Accessibility**: Ensures WCAG compliance and inclusive design

## 🔧 API Reference

### Core Classes

#### `DashMorph`
Main orchestrator for dashboard transformation.

```typescript
const dashmorph = new DashMorph();
const result = await dashmorph.morph(source, target, options);
```

#### `BaseExtractor`
Abstract base class for all source extractors.

```typescript
class CustomExtractor extends BaseExtractor {
  async extract(): Promise<DissectedDashboard> {
    // Implementation
  }
}
```

#### `CodeGenerator`
Generates target framework code from dissected components.

```typescript
const generator = new CodeGenerator(targetConfig);
const code = await generator.generate(dashboard, options);
```

#### `PixelParityValidator`
Validates visual accuracy between source and generated dashboards.

```typescript
const validator = new PixelParityValidator();
const result = await validator.validate(source, generated, target, options);
```

### CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| `morph` | Transform dashboard | `dashmorph morph -s figma-url -t react` |
| `extract` | Analyze components | `dashmorph extract -s dashboard.html` |
| `validate` | Check pixel parity | `dashmorph validate -s source -g generated` |
| `list` | Show supported formats | `dashmorph list` |
| `preview` | Start preview server | `dashmorph preview -d ./output` |

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Validation Pipeline
```bash
# Test extraction accuracy
npm run test:extraction

# Test generation quality
npm run test:generation

# Test pixel parity
npm run test:validation
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open pull request**

### Development Setup
```bash
git clone https://github.com/tbwa/scout-dashboard
cd scout-dashboard/dashmorph
npm install
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Claude Code**: SuperClaude framework integration
- **Pixelmatch**: Pixel-perfect validation engine
- **Playwright**: Browser automation and testing
- **Tesseract.js**: OCR capabilities for screenshot analysis

## 🔗 Related Projects

- [Scout Dashboard](../README.md) - Parent project with full analytics platform
- [SuperClaude Framework](../CLAUDE.md) - Claude Code orchestration system

---

**DashMorph** - Transform any dashboard to any framework with pixel-perfect accuracy. Built for the modern web, designed for the SuperClaude era.