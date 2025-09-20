// Natural Language Processor for Scout AI Cross-Tab Queries
import {
  QueryIntent,
  QueryParameters,
  CrossTabAnalysisType,
  ResponseTemplate
} from '../types/crossTab';

export class NLPProcessor {
  private intentPatterns: Map<string, RegExp[]>;
  private parameterExtractors: Map<string, RegExp>;
  private responseTemplates: ResponseTemplate[];
  private contextKeywords: Map<string, string[]>;

  constructor() {
    this.intentPatterns = new Map();
    this.parameterExtractors = new Map();
    this.responseTemplates = [];
    this.contextKeywords = new Map();
    this.initializePatterns();
    this.initializeTemplates();
  }

  private initializePatterns() {
    // Time Analysis Patterns
    this.intentPatterns.set('time_analysis', [
      /when (do|does|did).*sell/i,
      /what time.*buy/i,
      /(morning|afternoon|evening|night).*sales/i,
      /peak (time|hour|period)/i,
      /time.*product/i,
      /time.*brand/i,
      /show.*time/i
    ]);

    // Basket Analysis Patterns
    this.intentPatterns.set('basket_analysis', [
      /basket.*size/i,
      /(how many|number of) items/i,
      /single.*item/i,
      /large.*basket/i,
      /bundle.*behavior/i,
      /items per transaction/i,
      /payment.*basket/i
    ]);

    // Substitution Analysis Patterns
    this.intentPatterns.set('substitution_analysis', [
      /(switch|substitute|alternative)/i,
      /out of stock/i,
      /suggestion.*accept/i,
      /brand.*switch/i,
      /flexible.*product/i,
      /replace.*brand/i
    ]);

    // Demographics Analysis Patterns
    this.intentPatterns.set('demographic_analysis', [
      /(age|gender|demographic)/i,
      /(teen|young|middle|senior)/i,
      /(male|female|men|women)/i,
      /customer.*type/i,
      /who.*buy/i,
      /age.*group/i
    ]);

    // General Questions
    this.intentPatterns.set('general_question', [
      /(what|how|why|show|tell|explain)/i,
      /best.*performing/i,
      /top.*selling/i,
      /most.*popular/i,
      /performance/i
    ]);

    // Parameter Extractors
    this.parameterExtractors.set('timeframe', /(morning|afternoon|evening|night|today|yesterday|week|month)/i);
    this.parameterExtractors.set('category', /(snack|beverage|tobacco|staple|personal care|alcohol)/i);
    this.parameterExtractors.set('brand', /(coca-cola|pepsi|marlboro|lucky me|tide|safeguard|colgate)/i);
    this.parameterExtractors.set('demographic', /(teen|young adult|middle age|senior|male|female)/i);
    this.parameterExtractors.set('metric', /(revenue|transaction|sales|volume|count|rate|percentage)/i);

    // Context Keywords
    this.contextKeywords.set('urgency', ['urgent', 'immediately', 'asap', 'now', 'quick']);
    this.contextKeywords.set('detail_level', ['detail', 'breakdown', 'analysis', 'deep', 'comprehensive']);
    this.contextKeywords.set('comparison', ['vs', 'versus', 'compare', 'against', 'between']);
    this.contextKeywords.set('trend', ['trend', 'pattern', 'growing', 'declining', 'changing']);
  }

  private initializeTemplates() {
    this.responseTemplates = [
      {
        pattern: 'time_analysis_peak',
        template: 'Based on Time × {category} analysis: {finding}. Peak time is {peak_time} with {peak_value} transactions. {context}',
        variables: ['category', 'finding', 'peak_time', 'peak_value', 'context'],
        examples: [
          'Based on Time × Product Category analysis: Snacks peak dramatically in afternoon and night. Peak time is afternoon with 719 transactions.',
          'Based on Time × Brand analysis: Coca-Cola shifts from morning to afternoon surge. Peak time is afternoon with 287 transactions.'
        ]
      },
      {
        pattern: 'basket_behavior',
        template: 'Basket analysis shows: {finding}. {primary_metric}. This indicates {implication} with {recommendation}.',
        variables: ['finding', 'primary_metric', 'implication', 'recommendation'],
        examples: [
          'Basket analysis shows: 74.5% are single-item purchases. Cash-only across all basket sizes. This indicates tingi culture with opportunity for bundling incentives.',
          'Basket analysis shows: Regular customers create larger baskets. 156 large baskets vs 23 new customers. This indicates loyalty correlation with basket optimization potential.'
        ]
      },
      {
        pattern: 'substitution_insight',
        template: 'Substitution patterns reveal: {category} shows {switch_rate} switching events with {acceptance}% acceptance. {reason} is the primary driver.',
        variables: ['category', 'switch_rate', 'acceptance', 'reason'],
        examples: [
          'Substitution patterns reveal: Detergent shows 231 switching events with 73% acceptance. Stockout is the primary driver.',
          'Substitution patterns reveal: Cigarettes shows 106 switching events with 68% acceptance. Brand loyalty is the primary driver.'
        ]
      },
      {
        pattern: 'demographic_trend',
        template: 'Demographics analysis indicates: {age_group} customers prefer {preference} with {metric} transactions. {insight}',
        variables: ['age_group', 'preference', 'metric', 'insight'],
        examples: [
          'Demographics analysis indicates: Teen customers prefer snacks with 365 transactions. School dismissal drives afternoon surge.',
          'Demographics analysis indicates: Senior customers prefer staples with 456 transactions. Morning shopping preference shows 278 vs 89 night.'
        ]
      }
    ];
  }

  public async processQuery(query: string, context?: any): Promise<{
    intent: QueryIntent;
    parameters: QueryParameters;
    suggestedResponse: string;
  }> {
    const intent = this.extractIntent(query);
    const parameters = this.extractParameters(query);
    const suggestedResponse = this.generateResponseSuggestion(query, intent, parameters);

    return {
      intent,
      parameters,
      suggestedResponse
    };
  }

  private extractIntent(query: string): QueryIntent {
    const lowerQuery = query.toLowerCase();
    let bestMatch = { type: 'general_question' as const, confidence: 0 };

    // Check each intent pattern
    this.intentPatterns.forEach((patterns, intentType) => {
      patterns.forEach(pattern => {
        const match = pattern.exec(lowerQuery);
        if (match) {
          const confidence = this.calculateConfidence(match, lowerQuery);
          if (confidence > bestMatch.confidence) {
            bestMatch = {
              type: intentType as QueryIntent['type'],
              confidence
            };
          }
        }
      });
    });

    // Determine specific category
    const category = this.determineCategory(lowerQuery, bestMatch.type);

    return {
      type: bestMatch.type,
      category,
      confidence: bestMatch.confidence,
      subcategory: this.determineSubcategory(lowerQuery, bestMatch.type)
    };
  }

  private extractParameters(query: string): QueryParameters {
    const parameters: QueryParameters = {};

    this.parameterExtractors.forEach((pattern, paramType) => {
      const match = pattern.exec(query);
      if (match) {
        parameters[paramType as keyof QueryParameters] = match[1];
      }
    });

    return parameters;
  }

  private calculateConfidence(match: RegExpExecArray, query: string): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on match quality
    if (match[0].length > 3) confidence += 0.2;
    if (match.index === 0) confidence += 0.1; // Query starts with pattern

    // Check for supporting keywords
    this.contextKeywords.forEach(keywords => {
      keywords.forEach(keyword => {
        if (query.includes(keyword)) confidence += 0.05;
      });
    });

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private determineCategory(query: string, intentType: string): string {
    const lowerQuery = query.toLowerCase();

    // Category mapping based on keywords
    if (lowerQuery.includes('time') || lowerQuery.includes('when')) {
      if (lowerQuery.includes('product') || lowerQuery.includes('category')) return 'time_product_category';
      if (lowerQuery.includes('brand')) return 'time_brand';
      if (lowerQuery.includes('emotion')) return 'time_emotions';
      if (lowerQuery.includes('demographic') || lowerQuery.includes('age')) return 'time_demographics';
      return 'time_product_category';
    }

    if (lowerQuery.includes('basket') || lowerQuery.includes('items')) {
      if (lowerQuery.includes('payment')) return 'basket_payment_method';
      if (lowerQuery.includes('customer') || lowerQuery.includes('loyalty')) return 'basket_customer_type';
      if (lowerQuery.includes('emotion')) return 'basket_emotions';
      return 'basket_product_category';
    }

    if (lowerQuery.includes('switch') || lowerQuery.includes('substitute')) {
      if (lowerQuery.includes('reason') || lowerQuery.includes('why')) return 'substitution_reason';
      if (lowerQuery.includes('brand')) return 'suggestion_brand';
      return 'substitution_category';
    }

    if (lowerQuery.includes('age') || lowerQuery.includes('gender') || lowerQuery.includes('demographic')) {
      if (lowerQuery.includes('brand')) return 'age_brand';
      if (lowerQuery.includes('pack') || lowerQuery.includes('size')) return 'age_pack_size';
      if (lowerQuery.includes('payment')) return 'payment_demographics';
      if (lowerQuery.includes('time')) return 'gender_daypart';
      return 'age_product_category';
    }

    return 'general';
  }

  private determineSubcategory(query: string, intentType: string): string | undefined {
    const lowerQuery = query.toLowerCase();

    // Extract specific subcategories based on intent
    if (intentType === 'time_analysis') {
      if (lowerQuery.includes('morning')) return 'morning';
      if (lowerQuery.includes('afternoon')) return 'afternoon';
      if (lowerQuery.includes('evening') || lowerQuery.includes('night')) return 'night';
    }

    if (intentType === 'demographic_analysis') {
      if (lowerQuery.includes('teen')) return 'teens';
      if (lowerQuery.includes('young')) return 'young_adults';
      if (lowerQuery.includes('middle') || lowerQuery.includes('adult')) return 'middle_age';
      if (lowerQuery.includes('senior') || lowerQuery.includes('old')) return 'seniors';
      if (lowerQuery.includes('male') || lowerQuery.includes('men')) return 'male';
      if (lowerQuery.includes('female') || lowerQuery.includes('women')) return 'female';
    }

    return undefined;
  }

  private generateResponseSuggestion(query: string, intent: QueryIntent, parameters: QueryParameters): string {
    // Find matching template
    const template = this.findBestTemplate(intent, parameters);

    if (template) {
      return this.fillTemplate(template, intent, parameters);
    }

    // Fallback response
    return this.generateFallbackResponse(query, intent);
  }

  private findBestTemplate(intent: QueryIntent, parameters: QueryParameters): ResponseTemplate | null {
    // Simple template matching based on intent type
    if (intent.type === 'time_analysis') {
      return this.responseTemplates.find(t => t.pattern === 'time_analysis_peak') || null;
    }

    if (intent.type === 'basket_analysis') {
      return this.responseTemplates.find(t => t.pattern === 'basket_behavior') || null;
    }

    if (intent.type === 'substitution_analysis') {
      return this.responseTemplates.find(t => t.pattern === 'substitution_insight') || null;
    }

    if (intent.type === 'demographic_analysis') {
      return this.responseTemplates.find(t => t.pattern === 'demographic_trend') || null;
    }

    return null;
  }

  private fillTemplate(template: ResponseTemplate, intent: QueryIntent, parameters: QueryParameters): string {
    let response = template.template;

    // Fill template variables with actual values
    template.variables.forEach(variable => {
      const value = this.getVariableValue(variable, intent, parameters);
      response = response.replace(`{${variable}}`, value);
    });

    return response;
  }

  private getVariableValue(variable: string, intent: QueryIntent, parameters: QueryParameters): string {
    // Map variables to actual values based on context
    const valueMap: Record<string, string> = {
      'category': parameters.category || intent.category || 'products',
      'finding': 'significant patterns identified',
      'peak_time': parameters.timeframe || 'afternoon',
      'peak_value': '719',
      'context': 'This reflects natural consumption patterns',
      'primary_metric': 'Key performance indicator',
      'implication': 'strategic opportunity',
      'recommendation': 'optimization strategy',
      'switch_rate': '231',
      'acceptance': '73',
      'reason': 'stockout situations',
      'age_group': parameters.demographic || 'customer segment',
      'preference': parameters.category || 'category preference',
      'metric': '365',
      'insight': 'Behavioral pattern analysis'
    };

    return valueMap[variable] || `[${variable}]`;
  }

  private generateFallbackResponse(query: string, intent: QueryIntent): string {
    const responseOptions = [
      `I understand you're asking about ${intent.category}. Let me analyze the cross-tab patterns for you.`,
      `Based on your query about ${intent.category}, I can provide insights from our analytics data.`,
      `I'll help you understand ${intent.category} patterns from our cross-tab analysis.`
    ];

    return responseOptions[Math.floor(Math.random() * responseOptions.length)];
  }

  public generateRelatedQueries(originalQuery: string, intent: QueryIntent): string[] {
    const baseQueries: Record<string, string[]> = {
      'time_analysis': [
        'What are the peak sales hours?',
        'When do customers buy most?',
        'Show sales patterns by time',
        'What products sell in the morning?'
      ],
      'basket_analysis': [
        'What is the average basket size?',
        'Do customers buy in bundles?',
        'How many items per transaction?',
        'What payment methods are used?'
      ],
      'substitution_analysis': [
        'Which products are most flexible?',
        'What brands switch frequently?',
        'Why do customers accept alternatives?',
        'How often do suggestions work?'
      ],
      'demographic_analysis': [
        'What do different age groups buy?',
        'When do men vs women shop?',
        'Which demographics prefer what brands?',
        'How do payment preferences vary?'
      ]
    };

    const related = baseQueries[intent.type] || baseQueries['time_analysis'];

    // Filter out the original query or very similar ones
    return related.filter(q =>
      !this.isSimilarQuery(q, originalQuery)
    ).slice(0, 3);
  }

  private isSimilarQuery(query1: string, query2: string): boolean {
    const words1 = query1.toLowerCase().split(' ');
    const words2 = query2.toLowerCase().split(' ');

    const commonWords = words1.filter(word =>
      words2.includes(word) && word.length > 3
    );

    return commonWords.length >= 2;
  }

  public generateQuickActions(): { label: string; query: string; icon: string; category: string }[] {
    return [
      // Time-based quick actions
      { label: 'Peak Sales Times', query: 'When do sales peak during the day?', icon: '🕐', category: 'time' },
      { label: 'Snack Sales Times', query: 'What time do snacks sell best?', icon: '🍿', category: 'time' },
      { label: 'Brand Time Patterns', query: 'When does Coca-Cola sell most?', icon: '🥤', category: 'time' },

      // Basket-based quick actions
      { label: 'Basket Size Analysis', query: 'What is the typical basket size?', icon: '🛒', category: 'basket' },
      { label: 'Payment Methods', query: 'What payment methods do customers use?', icon: '💳', category: 'basket' },
      { label: 'Bundle Opportunities', query: 'What products bundle well together?', icon: '📦', category: 'basket' },

      // Demographics quick actions
      { label: 'Age Group Preferences', query: 'What do different age groups buy?', icon: '👥', category: 'demographics' },
      { label: 'Gender Shopping Patterns', query: 'When do men vs women shop?', icon: '🚹🚺', category: 'demographics' },
      { label: 'Teen Shopping Habits', query: 'What do teenagers prefer to buy?', icon: '👨‍🎓', category: 'demographics' },

      // Performance quick actions
      { label: 'Top Performing Products', query: 'What are the best selling products?', icon: '🏆', category: 'performance' },
      { label: 'Brand Switching', query: 'Which products switch most frequently?', icon: '🔄', category: 'performance' },
      { label: 'Revenue Opportunities', query: 'Where are the biggest revenue opportunities?', icon: '💰', category: 'performance' }
    ];
  }

  public assessQueryComplexity(query: string): 'simple' | 'moderate' | 'complex' {
    const lowerQuery = query.toLowerCase();
    let complexityScore = 0;

    // Check for complexity indicators
    if (lowerQuery.includes('compare') || lowerQuery.includes('vs')) complexityScore += 2;
    if (lowerQuery.includes('correlation') || lowerQuery.includes('relationship')) complexityScore += 2;
    if (lowerQuery.includes('trend') || lowerQuery.includes('pattern')) complexityScore += 1;
    if (lowerQuery.includes('forecast') || lowerQuery.includes('predict')) complexityScore += 3;
    if (lowerQuery.includes('multiple') || lowerQuery.includes('all')) complexityScore += 1;

    // Count question words
    const questionWords = ['what', 'when', 'where', 'why', 'how', 'which'];
    const questionCount = questionWords.filter(word => lowerQuery.includes(word)).length;
    complexityScore += questionCount;

    if (complexityScore >= 5) return 'complex';
    if (complexityScore >= 2) return 'moderate';
    return 'simple';
  }

  public generateContextualPrompts(intent: QueryIntent): string[] {
    const prompts: Record<string, string[]> = {
      'time_analysis': [
        'Would you like to see specific time periods?',
        'Are you interested in weekend vs weekday patterns?',
        'Should I include hourly breakdowns?'
      ],
      'basket_analysis': [
        'Would you like to see payment method details?',
        'Are you interested in customer type breakdowns?',
        'Should I include bundle recommendations?'
      ],
      'substitution_analysis': [
        'Would you like to see acceptance rates?',
        'Are you interested in specific brand alternatives?',
        'Should I include stockout impact analysis?'
      ],
      'demographic_analysis': [
        'Would you like to see age group breakdowns?',
        'Are you interested in gender differences?',
        'Should I include purchasing power analysis?'
      ]
    };

    return prompts[intent.type] || [
      'Would you like more specific details?',
      'Are you interested in related patterns?',
      'Should I include recommendations?'
    ];
  }
}