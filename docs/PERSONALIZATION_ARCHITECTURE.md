# Personalization & Workspace Routing Architecture

## Overview
A comprehensive system for personalizing user experiences and automatically routing content to appropriate tenant workspaces.

## 🎯 Key Components

### 1. **Personalization Service** (`personalization.ts`)
Adaptive system that learns from user behavior and preferences.

#### Features:
- **UI Personalization**
  - Theme preferences (light/dark/auto/brand)
  - Layout density and language
  - Default views and navigation

- **Behavioral Learning**
  - Activity patterns tracking
  - Peak productivity analysis
  - Content type preferences
  - Collaboration style detection

- **Smart Recommendations**
  - Workspace suggestions
  - Feature adoption tips
  - Automation opportunities
  - Learning resources

- **AI-Powered Insights**
  - Proactive suggestions
  - Custom prompts
  - Contextual help
  - Automation levels

### 2. **Workspace Router** (`workspace-router.ts`)
Intelligent file routing and archiving system.

#### Features:
- **Automatic Routing**
  - Rule-based file placement
  - Tenant-aware organization
  - Classification-based paths
  - Tag-driven categorization

- **Archive Policies**
  - Retention schedules
  - Auto-archiving rules
  - Storage tier management
  - Encryption requirements

- **Access Control**
  - Role-based permissions
  - Cross-tenant sharing
  - Workspace membership
  - Audit logging

### 3. **Multi-Tenant Architecture** (`auth.ts`)
Complete tenant isolation with sharing capabilities.

#### Features:
- **Tenant Types**
  - Enterprise
  - Agency
  - Brand
  - Partner

- **User Roles**
  - Super Admin (system-wide)
  - Tenant Admin (tenant-level)
  - Analyst
  - Viewer
  - External
  - Developer

- **Tenant Settings**
  - Branding customization
  - Feature limits
  - Security policies
  - Data residency

### 4. **Integration Hub** (`IntegrationHub.tsx`)
Clean, ChatGPT-style integration management.

#### Categories:
- **Data Sources**: Google Drive, PostgreSQL, Notion, Airtable
- **Development**: GitHub, REST API, MCP Server
- **Productivity**: Calendar, Email
- **Communication**: Slack, Teams

## 📁 File Organization Pattern

```
/[tenant-id]/
  /[workspace-type]/
    /[workspace-name]/
      /[year]/
        /[month]/
          /[classification]/
            /[source]/
              /[primary-tag]/
                [files...]
```

Example:
```
/tbwa-worldwide/
  /project/
    /lions-campaign-2024/
      /2024/
        /07/
          /confidential/
            /user_upload/
              /creative-assets/
                campaign-brief.pdf
```

## 🔄 Personalization Flow

1. **User Action** → Track behavior
2. **Pattern Analysis** → Identify preferences
3. **Recommendation Engine** → Generate suggestions
4. **UI Adaptation** → Apply personalizations
5. **Feedback Loop** → Learn from acceptance/rejection

## 🛡️ Security & Privacy

- **Data Isolation**: Complete tenant separation
- **Encryption**: At-rest and in-transit
- **Access Logging**: Full audit trail
- **GDPR Compliance**: User preference management
- **Cross-tenant Sharing**: Explicit approval required

## 📊 Personalization Metrics

### User Engagement
- Feature adoption rate
- Recommendation acceptance
- Time saved through automation
- Productivity improvements

### System Performance
- Routing accuracy
- Archive efficiency
- Storage optimization
- Query performance

## 🚀 Implementation Examples

### 1. Auto-routing User Upload
```typescript
const file = {
  filename: 'campaign-results.pdf',
  mimeType: 'application/pdf',
  source: 'user_upload',
  classification: 'internal',
  tags: ['campaign', 'q2-2024', 'results']
};

const route = await workspaceRouter.routeFile(file, user, tenant);
// Result: /tbwa-worldwide/project/campaigns-2024/2024/07/internal/user_upload/campaign/
```

### 2. Personalized Dashboard
```typescript
const personalized = await personalizationService.getPersonalizedWorkspace(user, tenant);
// Returns custom layout, widgets, shortcuts, and AI recommendations
```

### 3. Archive Policy Application
```typescript
const policy = {
  enabled: true,
  retentionDays: 730,
  autoArchiveAfterDays: 90,
  archiveLocation: 'warm_storage',
  compressionEnabled: true,
  encryptionRequired: true
};

await workspaceRouter.archiveFiles(eligibleFiles, policy);
```

## 🎨 UI/UX Personalization

### Adaptive Elements
- **Navigation**: Shortcuts to frequent destinations
- **Search**: Pre-populated with common queries
- **Widgets**: Relevant to user's role and activities
- **Notifications**: Filtered by preferences
- **AI Prompts**: Customized to work patterns

### Learning Mechanisms
- Click tracking
- Dwell time analysis
- Feature usage patterns
- Search query analysis
- Collaboration patterns

## 🔮 Future Enhancements

1. **Predictive Routing**: ML-based file placement
2. **Smart Summarization**: Personalized detail levels
3. **Team Insights**: Collaborative pattern analysis
4. **Cross-tenant Analytics**: Benchmarking (anonymized)
5. **Voice Preferences**: Audio-based personalization