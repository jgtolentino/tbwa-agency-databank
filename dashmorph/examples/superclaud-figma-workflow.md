# SuperClaude + Figma Workflow Examples

## Working with Figma Data Visualization Kit

### 1. Initial Analysis
```bash
# Analyze the Figma file to understand component structure
/analyze @figma/MxZzjY9lcdl9sYERJfAFYN --components --design-system --accessibility

# Output: Detailed breakdown of:
# - Component types (charts, KPIs, tables, filters)
# - Design system tokens (colors, typography, spacing)
# - Accessibility assessment
# - Complexity analysis
```

### 2. Design-to-Code Conversion
```bash
# Convert Figma designs to React with pixel parity
/design @figma/MxZzjY9lcdl9sYERJfAFYN --target react --pixel-perfect --charts recharts --styling tailwind

# Persona-aware optimization:
# --persona-frontend: Focuses on responsive design and UX
# --persona-performance: Optimizes for speed and bundle size
# --persona-accessibility: Ensures WCAG compliance
```

### 3. Component Library Generation
```bash
# Build a complete component library from the visualization kit
/build component-library --from figma --react --storybook --design-tokens

# Generates:
# - Individual React components
# - Storybook stories for each component
# - Design system tokens
# - TypeScript definitions
# - Unit tests
```

### 4. Integration with Existing Projects
```bash
# Improve existing dashboard with Figma design patterns
/improve @current/dashboard --figma-patterns @figma/MxZzjY9lcdl9sYERJfAFYN --accessibility --responsive

# Migrate legacy dashboard to modern stack using Figma as reference
/migrate @legacy/dashboard --to react --design-reference @figma/MxZzjY9lcdl9sYERJfAFYN
```

## Advanced Workflows

### Design System Synchronization
```bash
# Extract design system from Figma and apply to existing codebase
/analyze @figma/MxZzjY9lcdl9sYERJfAFYN --design-system --output design-tokens.json
/improve @current/project --apply-design-system design-tokens.json
```

### Component Validation
```bash
# Validate existing components against Figma designs
/validate @current/components --figma-reference @figma/MxZzjY9lcdl9sYERJfAFYN --threshold 95
```

### Responsive Design Implementation
```bash
# Generate responsive components from Figma frames
/design @figma/MxZzjY9lcdl9sYERJfAFYN --responsive --breakpoints mobile,tablet,desktop --adaptive-layouts
```

## Code Connect Alternative

Instead of manually linking code snippets in Figma, DashMorph provides:

1. **Automatic Code Generation**: No manual linking required
2. **Live Validation**: Ensures code matches design pixel-perfectly
3. **Complete Systems**: Generates entire component libraries, not just snippets
4. **Framework Agnostic**: Works with React, Vue, Angular, Svelte
5. **Production Ready**: Includes tests, stories, and documentation

## Integration with Scout Dashboard

```bash
# Generate visualization components for Scout Dashboard
/design @figma/MxZzjY9lcdl9sYERJfAFYN --target react --integrate-scout --data-sources supabase

# This would:
# - Extract Figma visualization components
# - Generate React components compatible with Scout
# - Set up data bindings to Supabase
# - Ensure design consistency with Scout's design system
```