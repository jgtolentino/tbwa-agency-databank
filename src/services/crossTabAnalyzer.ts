// Scout Cross-Tab Analysis Engine - All 16 Patterns
import {
  CrossTabAnalysisType,
  CrossTabAnalysisPattern,
  CrossTabResponse,
  CrossTabInsight,
  CrossTabMetric,
  Recommendation
} from '../types/crossTab';

export class CrossTabAnalyzer {
  private patterns: Map<CrossTabAnalysisType, CrossTabAnalysisPattern>;
  private cache: Map<string, any>;

  constructor() {
    this.patterns = new Map();
    this.cache = new Map();
    this.initializePatterns();
  }

  private initializePatterns() {
    // Time of Day Analyses (4 patterns)

    // 1. Time × Product Category
    this.patterns.set('time_product_category', {
      type: 'time_product_category',
      name: 'Time × Product Category Analysis',
      description: 'Product category performance across different time periods',
      data: [
        { time: 'Morning', snacks: 287, beverages: 412, staples: 1156, tobacco: 891, alcohol: 12 },
        { time: 'Afternoon', snacks: 719, beverages: 623, staples: 445, tobacco: 512, alcohol: 23 },
        { time: 'Night', snacks: 842, beverages: 301, staples: 189, tobacco: 234, alcohol: 70 }
      ],
      insights: [
        'Snacks peak dramatically in afternoon (719 txns) and night (842 txns)',
        'Staples dominate morning sales (1,156 transactions)',
        'Alcohol sales concentrated in night hours (70 transactions)',
        'Beverages maintain steady performance across all periods'
      ],
      keyMetrics: {
        primary: 'Peak snack time: Afternoon & Night',
        secondary: ['Morning staples: 1,156 txns', 'Night alcohol: 70 txns']
      },
      commonQueries: [
        'When do snacks sell best?',
        'What time do people buy staples?',
        'When is alcohol purchased?',
        'Show me product sales by time'
      ]
    });

    // 2. Time × Brand
    this.patterns.set('time_brand', {
      type: 'time_brand',
      name: 'Time × Brand Analysis',
      description: 'Brand preference shifts throughout the day',
      data: [
        { time: 'Morning', 'Coca-Cola': 60, 'Lucky Me': 234, 'Marlboro': 445, 'Safeguard': 123 },
        { time: 'Afternoon', 'Coca-Cola': 287, 'Lucky Me': 156, 'Marlboro': 234, 'Safeguard': 89 },
        { time: 'Night', 'Coca-Cola': 178, 'Lucky Me': 67, 'Marlboro': 123, 'Safeguard': 45 }
      ],
      insights: [
        'Coca-Cola shifts from 60 morning to 287 afternoon transactions',
        'Lucky Me (noodles) strongest in morning (234 vs 67 night)',
        'Marlboro maintains consistent demand across all periods',
        'Safeguard personal care peaks in morning routine'
      ],
      keyMetrics: {
        primary: 'Coca-Cola afternoon surge: 287 transactions',
        secondary: ['Lucky Me morning: 234 txns', 'Marlboro steady: 445→234→123']
      },
      commonQueries: [
        'When does Coca-Cola sell most?',
        'What brands perform best in morning?',
        'Show brand performance by time',
        'When do people buy Marlboro?'
      ]
    });

    // 3. Time × Demographics
    this.patterns.set('time_demographics', {
      type: 'time_demographics',
      name: 'Time × Demographics Analysis',
      description: 'Customer demographic patterns across day periods',
      data: [
        { time: 'Morning', teens: 234, young_adults: 1567, middle_aged: 892, seniors: 278 },
        { time: 'Afternoon', teens: 1850, young_adults: 1243, middle_aged: 567, seniors: 156 },
        { time: 'Night', teens: 567, young_adults: 2041, middle_aged: 334, seniors: 89 }
      ],
      insights: [
        'Teens dominate afternoon (1,850 transactions) - school dismissal effect',
        'Young adults drive evening sales (2,041 transactions) - after work',
        'Middle-aged customers prefer morning shopping (892 transactions)',
        'Seniors avoid night shopping (89 transactions vs 278 morning)'
      ],
      keyMetrics: {
        primary: 'Teen afternoon surge: 1,850 transactions',
        secondary: ['Young adult evening: 2,041 txns', 'Senior morning preference: 278 vs 89']
      },
      commonQueries: [
        'When do teens shop most?',
        'What time do workers come?',
        'Show customer demographics by time',
        'When do seniors shop?'
      ]
    });

    // 4. Time × Emotions
    this.patterns.set('time_emotions', {
      type: 'time_emotions',
      name: 'Time × Customer Emotions Analysis',
      description: 'Customer emotional states and purchasing behavior by time',
      data: [
        { time: 'Morning', happy: 1234, neutral: 1567, hesitant: 234, urgent: 432 },
        { time: 'Afternoon', happy: 4926, neutral: 1890, hesitant: 445, urgent: 234 },
        { time: 'Night', happy: 1567, neutral: 1234, hesitant: 1214, urgent: 123 }
      ],
      insights: [
        'Happy customers peak in afternoon (4,926 transactions)',
        'Hesitant behavior increases at night (1,214 transactions)',
        'Urgent purchases concentrated in morning rush (432 transactions)',
        'Neutral shopping spreads evenly throughout day'
      ],
      keyMetrics: {
        primary: 'Happy afternoon peak: 4,926 transactions',
        secondary: ['Night hesitancy: 1,214 txns', 'Morning urgency: 432 txns']
      },
      commonQueries: [
        'When are customers happiest?',
        'What time do people hesitate most?',
        'Show customer emotions by time',
        'When do urgent purchases happen?'
      ]
    });

    // Basket Behavior Analyses (4 patterns)

    // 5. Basket × Product Category
    this.patterns.set('basket_product_category', {
      type: 'basket_product_category',
      name: 'Basket Size × Product Category Analysis',
      description: 'How product categories relate to basket sizes',
      data: [
        { basket_size: 1, snacks: 1503, staples: 234, tobacco: 1891, personal_care: 445 },
        { basket_size: 2, snacks: 567, staples: 334, tobacco: 234, personal_care: 456 },
        { basket_size: '3+', snacks: 123, staples: 45, tobacco: 67, personal_care: 234 }
      ],
      insights: [
        'Single-item purchases dominate: tobacco (1,891), snacks (1,503)',
        'Large baskets (3+) correlate with staples and personal care',
        'Tobacco typically purchased alone (1,891 single vs 67 multi)',
        'Personal care shows strongest bundling behavior'
      ],
      keyMetrics: {
        primary: 'Tobacco single-item dominance: 1,891 transactions',
        secondary: ['Snack singles: 1,503 txns', 'Personal care bundling: 234 large baskets']
      },
      commonQueries: [
        'What products are bought alone?',
        'Which categories bundle well?',
        'Show basket patterns by product',
        'What creates large baskets?'
      ]
    });

    // 6. Basket × Payment Method
    this.patterns.set('basket_payment_method', {
      type: 'basket_payment_method',
      name: 'Basket Size × Payment Method Analysis',
      description: 'Payment preferences based on basket size',
      data: [
        { basket_size: 1, cash: 14713, ewallet: 0, credit: 0 },
        { basket_size: 2, cash: 3456, ewallet: 0, credit: 0 },
        { basket_size: '3+', cash: 260, ewallet: 0, credit: 0 }
      ],
      insights: [
        'ALL transactions are cash-only across all basket sizes',
        'Zero e-wallet adoption despite availability',
        'Large baskets (260) still prefer cash over credit options',
        'Digital payment opportunity completely untapped'
      ],
      keyMetrics: {
        primary: 'Cash-only ecosystem: 100% of all transactions',
        secondary: ['E-wallet usage: 0%', 'Credit card usage: 0%']
      },
      commonQueries: [
        'Do people use e-wallets?',
        'What payment methods for large purchases?',
        'Show payment patterns by basket size',
        'Is cash still king?'
      ]
    });

    // 7. Basket × Customer Type
    this.patterns.set('basket_customer_type', {
      type: 'basket_customer_type',
      name: 'Basket Size × Customer Type Analysis',
      description: 'Shopping patterns by customer loyalty level',
      data: [
        { basket_size: 1, regular: 8456, occasional: 4567, new: 3678 },
        { basket_size: 2, regular: 1234, occasional: 2345, new: 567 },
        { basket_size: '3+', regular: 156, occasional: 89, new: 23 }
      ],
      insights: [
        'Regular customers create more large baskets (156 vs 23 new)',
        'New customers prefer single-item purchases (3,678 transactions)',
        'Occasional customers drive medium baskets (2,345 transactions)',
        'Customer familiarity correlates with basket growth'
      ],
      keyMetrics: {
        primary: 'Regular customer large baskets: 156 vs 23 new',
        secondary: ['New customer singles: 3,678 txns', 'Occasional medium: 2,345 txns']
      },
      commonQueries: [
        'Do regular customers buy more?',
        'What do new customers purchase?',
        'Show loyalty vs basket size',
        'How to grow new customer baskets?'
      ]
    });

    // 8. Basket × Emotions
    this.patterns.set('basket_emotions', {
      type: 'basket_emotions',
      name: 'Basket Size × Customer Emotions Analysis',
      description: 'Emotional shopping patterns and basket behavior',
      data: [
        { basket_size: 1, happy: 8234, neutral: 4567, hesitant: 2207, decisive: 1456 },
        { basket_size: 2, happy: 2345, neutral: 1567, hesitant: 445, decisive: 1789 },
        { basket_size: '3+', happy: 65, neutral: 89, hesitant: 23, decisive: 234 }
      ],
      insights: [
        'Happy customers create some large baskets (65) but mostly singles (8,234)',
        'Hesitant customers stick to small purchases (2,207 single-item)',
        'Decisive shoppers show strongest large basket behavior (234)',
        'Emotional state influences purchase commitment'
      ],
      keyMetrics: {
        primary: 'Decisive large baskets: 234 vs 65 happy',
        secondary: ['Happy singles: 8,234 txns', 'Hesitant tingi: 2,207 txns']
      },
      commonQueries: [
        'Do happy customers buy more?',
        'What emotions lead to big purchases?',
        'Show emotions vs basket size',
        'How to encourage larger baskets?'
      ]
    });

    // Product/Brand Switching Analyses (3 patterns)

    // 9. Substitution × Category
    this.patterns.set('substitution_category', {
      type: 'substitution_category',
      name: 'Product Substitution × Category Analysis',
      description: 'Brand switching patterns across product categories',
      data: [
        { category: 'Detergent', switching_events: 231, acceptance_rate: 0.73 },
        { category: 'Cigarettes', switching_events: 106, acceptance_rate: 0.68 },
        { category: 'Snacks', switching_events: 89, acceptance_rate: 0.81 },
        { category: 'Beverages', switching_events: 45, acceptance_rate: 0.76 },
        { category: 'Personal Care', switching_events: 67, acceptance_rate: 0.84 }
      ],
      insights: [
        'Detergent shows highest switching (231 events) - brand flexibility',
        'Cigarettes have lower acceptance (68%) - brand loyalty stronger',
        'Snacks show high acceptance (81%) - impulse category',
        'Personal care has highest acceptance (84%) when available'
      ],
      keyMetrics: {
        primary: 'Detergent switching leader: 231 events',
        secondary: ['Snack acceptance: 81%', 'Cigarette loyalty: 68% acceptance']
      },
      commonQueries: [
        'Which products switch most?',
        'What categories are flexible?',
        'Show substitution patterns',
        'Where do customers accept alternatives?'
      ]
    });

    // 10. Substitution × Reason
    this.patterns.set('substitution_reason', {
      type: 'substitution_reason',
      name: 'Substitution Reason Analysis',
      description: 'Why customers accept product substitutions',
      data: [
        { reason: 'Out of Stock', events: 1015, acceptance_rate: 0.72 },
        { reason: 'Store Suggestion', events: 1014, acceptance_rate: 0.69 },
        { reason: 'Price Consideration', events: 1017, acceptance_rate: 0.78 }
      ],
      insights: [
        'Almost equal distribution: Stockout (1,015), Suggestion (1,014), Price (1,017)',
        'Price-driven substitutions have highest acceptance (78%)',
        'Store suggestions slightly lower acceptance (69%)',
        'Stockout substitutions moderate acceptance (72%)'
      ],
      keyMetrics: {
        primary: 'Price substitution success: 78% acceptance',
        secondary: ['Equal triggers: ~1,015 each', 'Suggestion challenge: 69% acceptance']
      },
      commonQueries: [
        'Why do customers switch brands?',
        'What works best for substitutions?',
        'Show switching reasons',
        'How to improve suggestion acceptance?'
      ]
    });

    // 11. Suggestion × Brand
    this.patterns.set('suggestion_brand', {
      type: 'suggestion_brand',
      name: 'Store Suggestion × Brand Analysis',
      description: 'Which brands benefit most from store suggestions',
      data: [
        { brand: 'Safeguard', suggestions: 234, acceptances: 181, rate: 0.77 },
        { brand: 'Colgate', suggestions: 189, acceptances: 144, rate: 0.76 },
        { brand: 'Tide', suggestions: 167, acceptances: 123, rate: 0.74 },
        { brand: 'Lucky Me', suggestions: 145, acceptances: 98, rate: 0.68 }
      ],
      insights: [
        'Safeguard benefits most from suggestions (181 acceptances)',
        'Colgate shows strong suggestion performance (76% rate)',
        'Tide maintains good acceptance despite competition',
        'Lucky Me has lowest suggestion success (68%)'
      ],
      keyMetrics: {
        primary: 'Safeguard suggestion winner: 181 acceptances',
        secondary: ['Colgate strong: 76% rate', 'Lucky Me challenge: 68% rate']
      },
      commonQueries: [
        'Which brands get suggested most?',
        'What brands customers accept easily?',
        'Show suggestion success by brand',
        'How to promote specific brands?'
      ]
    });

    // Demographics Analyses (5 patterns)

    // 12. Age × Product Category
    this.patterns.set('age_product_category', {
      type: 'age_product_category',
      name: 'Age × Product Category Analysis',
      description: 'Product preferences across age groups',
      data: [
        { age_group: 'Teens (13-19)', snacks: 365, beverages: 234, tobacco: 12, staples: 89 },
        { age_group: 'Young Adults (20-35)', snacks: 234, beverages: 456, tobacco: 567, staples: 345 },
        { age_group: 'Middle Age (36-50)', snacks: 123, beverages: 234, tobacco: 445, staples: 525 },
        { age_group: 'Seniors (50+)', snacks: 89, beverages: 167, tobacco: 234, staples: 456 }
      ],
      insights: [
        'Teens drive snack sales (365 transactions)',
        'Middle-aged customers prefer staples (525 transactions)',
        'Young adults show balanced purchasing across categories',
        'Seniors focus on essentials: staples (456) and tobacco (234)'
      ],
      keyMetrics: {
        primary: 'Teen snack dominance: 365 transactions',
        secondary: ['Middle-age staples: 525 txns', 'Senior essentials focus']
      },
      commonQueries: [
        'What age groups buy snacks?',
        'Who purchases staples most?',
        'Show age preferences by product',
        'What do seniors buy?'
      ]
    });

    // 13. Age × Brand
    this.patterns.set('age_brand', {
      type: 'age_brand',
      name: 'Age × Brand Preference Analysis',
      description: 'Brand loyalty patterns across generations',
      data: [
        { age_group: 'Teens', 'Coca-Cola': 91, 'Pepsi': 45, 'Milo': 23, 'Marlboro': 5 },
        { age_group: 'Young Adults', 'Coca-Cola': 67, 'Pepsi': 89, 'Milo': 45, 'Marlboro': 123 },
        { age_group: 'Middle Age', 'Coca-Cola': 45, 'Pepsi': 34, 'Milo': 67, 'Marlboro': 167 },
        { age_group: 'Seniors', 'Coca-Cola': 23, 'Pepsi': 12, 'Milo': 94, 'Marlboro': 89 }
      ],
      insights: [
        'Teens prefer Coca-Cola (91 vs 45 Pepsi)',
        'Young adults split between beverages, heavy Marlboro (123)',
        'Seniors show Milo preference (94 transactions)',
        'Marlboro peaks in middle age (167 transactions)'
      ],
      keyMetrics: {
        primary: 'Teen Coca-Cola preference: 91 vs 45 Pepsi',
        secondary: ['Senior Milo choice: 94 txns', 'Middle-age Marlboro: 167 txns']
      },
      commonQueries: [
        'What brands do teens prefer?',
        'Which age group buys Marlboro?',
        'Show brand loyalty by age',
        'Do seniors have brand preferences?'
      ]
    });

    // 14. Age × Pack Size
    this.patterns.set('age_pack_size', {
      type: 'age_pack_size',
      name: 'Age × Pack Size Preference Analysis',
      description: 'Purchase size patterns across age demographics',
      data: [
        { age_group: 'Teens', single: 2207, small_pack: 567, bulk: 23 },
        { age_group: 'Young Adults', single: 1456, small_pack: 789, bulk: 134 },
        { age_group: 'Middle Age', single: 1123, small_pack: 445, bulk: 67 },
        { age_group: 'Seniors', single: 234, small_pack: 567, bulk: 79 }
      ],
      insights: [
        'All age groups favor single purchases, teens extremely (2,207)',
        'Seniors show highest bulk buying propensity (79 vs 23 teens)',
        'Young adults most balanced across pack sizes',
        'Financial capacity correlates with pack size choices'
      ],
      keyMetrics: {
        primary: 'Teen single preference: 2,207 transactions',
        secondary: ['Senior bulk buying: 79 txns', 'Young adult balance']
      },
      commonQueries: [
        'What pack sizes do teens buy?',
        'Who buys in bulk?',
        'Show pack size by age',
        'Do older customers buy more?'
      ]
    });

    // 15. Gender × Daypart
    this.patterns.set('gender_daypart', {
      type: 'gender_daypart',
      name: 'Gender × Time of Day Analysis',
      description: 'Shopping time preferences by gender',
      data: [
        { gender: 'Male', morning: 438, afternoon: 1567, evening: 2234, night: 1345 },
        { gender: 'Female', morning: 1234, afternoon: 3742, evening: 2567, night: 891 }
      ],
      insights: [
        'Female afternoon dominance (3,742 vs 1,567 male)',
        'Male evening preference (2,234 transactions)',
        'Female morning shopping 3x higher (1,234 vs 438)',
        'Night shopping shows male preference (1,345 vs 891)'
      ],
      keyMetrics: {
        primary: 'Female afternoon surge: 3,742 transactions',
        secondary: ['Male evening: 2,234 txns', 'Female morning: 3x higher']
      },
      commonQueries: [
        'When do women shop most?',
        'What time do men prefer?',
        'Show shopping times by gender',
        'Who shops in the afternoon?'
      ]
    });

    // 16. Payment × Demographics
    this.patterns.set('payment_demographics', {
      type: 'payment_demographics',
      name: 'Payment Method × Demographics Analysis',
      description: 'Payment preferences across demographic segments',
      data: [
        { demographic: 'Teens', cash: 2867, ewallet: 0, credit: 0 },
        { demographic: 'Young Adults', cash: 2456, ewallet: 0, credit: 0 },
        { demographic: 'Middle Age', cash: 1789, ewallet: 0, credit: 0 },
        { demographic: 'Seniors', cash: 923, ewallet: 0, credit: 0 },
        { demographic: 'Male', cash: 4567, ewallet: 0, credit: 0 },
        { demographic: 'Female', cash: 3456, ewallet: 0, credit: 0 }
      ],
      insights: [
        'Universal cash-only ecosystem across ALL demographics',
        'Zero e-wallet adoption even among tech-savvy teens',
        'Credit card usage completely absent across all segments',
        'Digital payment revolution has not reached sari-sari stores'
      ],
      keyMetrics: {
        primary: 'Cash universality: 100% across all demographics',
        secondary: ['Teen digital gap: 0% e-wallet', 'Adult cash preference: 100%']
      },
      commonQueries: [
        'Do young people use e-wallets?',
        'What payment methods by age?',
        'Show payment preferences by gender',
        'Is digital payment adopted?'
      ]
    });
  }

  public analyzeQuery(query: string, analysisType?: CrossTabAnalysisType): CrossTabResponse {
    // If specific analysis type provided, use it
    if (analysisType && this.patterns.has(analysisType)) {
      return this.generateResponse(analysisType, query);
    }

    // Otherwise, determine analysis type from query
    const detectedType = this.detectAnalysisType(query);
    return this.generateResponse(detectedType, query);
  }

  private detectAnalysisType(query: string): CrossTabAnalysisType {
    const lowerQuery = query.toLowerCase();

    // Time-based queries
    if (lowerQuery.includes('time') || lowerQuery.includes('when') ||
        lowerQuery.includes('morning') || lowerQuery.includes('afternoon') || lowerQuery.includes('night')) {
      if (lowerQuery.includes('product') || lowerQuery.includes('category')) return 'time_product_category';
      if (lowerQuery.includes('brand')) return 'time_brand';
      if (lowerQuery.includes('emotion') || lowerQuery.includes('feel')) return 'time_emotions';
      if (lowerQuery.includes('age') || lowerQuery.includes('demographic')) return 'time_demographics';
      return 'time_product_category'; // default time analysis
    }

    // Basket-based queries
    if (lowerQuery.includes('basket') || lowerQuery.includes('items') || lowerQuery.includes('size')) {
      if (lowerQuery.includes('payment') || lowerQuery.includes('cash') || lowerQuery.includes('ewallet')) return 'basket_payment_method';
      if (lowerQuery.includes('customer') || lowerQuery.includes('loyalty')) return 'basket_customer_type';
      if (lowerQuery.includes('emotion') || lowerQuery.includes('feel')) return 'basket_emotions';
      return 'basket_product_category'; // default basket analysis
    }

    // Substitution queries
    if (lowerQuery.includes('switch') || lowerQuery.includes('substitute') || lowerQuery.includes('alternative')) {
      if (lowerQuery.includes('reason') || lowerQuery.includes('why')) return 'substitution_reason';
      if (lowerQuery.includes('brand')) return 'suggestion_brand';
      return 'substitution_category'; // default substitution analysis
    }

    // Demographics queries
    if (lowerQuery.includes('age') || lowerQuery.includes('gender') || lowerQuery.includes('demographic')) {
      if (lowerQuery.includes('brand')) return 'age_brand';
      if (lowerQuery.includes('pack') || lowerQuery.includes('size')) return 'age_pack_size';
      if (lowerQuery.includes('payment')) return 'payment_demographics';
      if (lowerQuery.includes('time') || lowerQuery.includes('when')) return 'gender_daypart';
      return 'age_product_category'; // default age analysis
    }

    // Default fallback
    return 'time_product_category';
  }

  private generateResponse(analysisType: CrossTabAnalysisType, query: string): CrossTabResponse {
    const pattern = this.patterns.get(analysisType);
    if (!pattern) {
      throw new Error(`Analysis pattern not found: ${analysisType}`);
    }

    const insights = this.generateInsights(pattern);
    const metrics = this.generateMetrics(pattern);
    const recommendations = this.generateRecommendations(pattern);
    const relatedQueries = this.generateRelatedQueries(pattern);

    return {
      answer: this.generateAnswer(pattern, query),
      insights,
      metrics,
      recommendations,
      confidence: 0.92,
      relatedQueries
    };
  }

  private generateAnswer(pattern: CrossTabAnalysisPattern, query: string): string {
    const insights = pattern.insights;
    const keyMetric = pattern.keyMetrics.primary;

    return `Based on ${pattern.name}: ${insights[0]}. ${keyMetric}. ${insights[1]} This pattern shows ${pattern.description.toLowerCase()}.`;
  }

  private generateInsights(pattern: CrossTabAnalysisPattern): CrossTabInsight[] {
    return pattern.insights.map((insight, index) => ({
      type: this.getInsightType(pattern.type),
      title: `Key Finding ${index + 1}`,
      finding: insight,
      context: this.generateContext(pattern.type, insight),
      impact: this.generateImpact(pattern.type, insight),
      priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low'
    }));
  }

  private generateMetrics(pattern: CrossTabAnalysisPattern): CrossTabMetric[] {
    const metrics: CrossTabMetric[] = [
      {
        name: pattern.keyMetrics.primary,
        value: this.extractMetricValue(pattern.keyMetrics.primary),
        unit: this.extractMetricUnit(pattern.keyMetrics.primary)
      }
    ];

    pattern.keyMetrics.secondary.forEach(metric => {
      metrics.push({
        name: metric,
        value: this.extractMetricValue(metric),
        unit: this.extractMetricUnit(metric)
      });
    });

    return metrics;
  }

  private generateRecommendations(pattern: CrossTabAnalysisPattern): Recommendation[] {
    const baseRecs = this.getBaseRecommendations(pattern.type);

    return baseRecs.map((rec, index) => ({
      action: rec.action,
      impact: rec.impact,
      effort: rec.effort,
      roi: rec.roi,
      timeline: rec.timeline,
      priority: index + 1
    }));
  }

  private generateRelatedQueries(pattern: CrossTabAnalysisPattern): string[] {
    return pattern.commonQueries.slice(0, 3); // Return top 3 related queries
  }

  private getInsightType(analysisType: CrossTabAnalysisType): 'time_pattern' | 'basket_behavior' | 'substitution_pattern' | 'demographic_trend' {
    if (analysisType.startsWith('time_')) return 'time_pattern';
    if (analysisType.startsWith('basket_')) return 'basket_behavior';
    if (analysisType.includes('substitution') || analysisType.includes('suggestion')) return 'substitution_pattern';
    return 'demographic_trend';
  }

  private generateContext(analysisType: CrossTabAnalysisType, insight: string): string {
    // Context mapping based on analysis type
    const contextMap: Record<string, string> = {
      'time_product_category': 'This reflects natural consumption patterns and lifestyle rhythms',
      'time_brand': 'Brand preference shifts align with daily routines and occasions',
      'basket_payment_method': 'Payment behavior reflects infrastructure and customer habits',
      'substitution_category': 'Category flexibility depends on brand loyalty and availability'
    };

    return contextMap[analysisType] || 'This pattern indicates underlying customer behavior trends';
  }

  private generateImpact(analysisType: CrossTabAnalysisType, insight: string): string {
    // Impact mapping
    if (insight.includes('peak') || insight.includes('surge')) {
      return 'High impact on staffing and inventory planning';
    }
    if (insight.includes('zero') || insight.includes('100%')) {
      return 'Critical impact on payment infrastructure and digital adoption';
    }
    return 'Significant impact on business strategy and operations';
  }

  private extractMetricValue(metric: string): number | string {
    const match = metric.match(/(\d+[,\d]*)/);
    return match ? match[1] : metric;
  }

  private extractMetricUnit(metric: string): string {
    if (metric.includes('%')) return '%';
    if (metric.includes('txns') || metric.includes('transactions')) return 'transactions';
    if (metric.includes('₱')) return '₱';
    return '';
  }

  private getBaseRecommendations(analysisType: CrossTabAnalysisType): any[] {
    // Recommendation templates by analysis type
    const recTemplates: Record<CrossTabAnalysisType, any[]> = {
      'time_product_category': [
        {
          action: 'Schedule snack displays for 3-6 PM and 7-10 PM',
          impact: 'Capture peak demand windows',
          effort: 'low' as const,
          roi: { monthly: '₱30,000', confidence: 85 },
          timeline: '1 week'
        }
      ],
      'basket_payment_method': [
        {
          action: 'Implement e-wallet infrastructure and incentives',
          impact: 'Enable digital payment adoption',
          effort: 'high' as const,
          roi: { monthly: '₱25,000', confidence: 70 },
          timeline: '3 months'
        }
      ],
      'substitution_category': [
        {
          action: 'Stock multiple detergent brands to reduce stockouts',
          impact: 'Reduce lost sales from brand unavailability',
          effort: 'medium' as const,
          roi: { monthly: '₱15,000', confidence: 80 },
          timeline: '2 weeks'
        }
      ]
      // Add more as needed...
    } as Record<CrossTabAnalysisType, any[]>;

    return recTemplates[analysisType] || [{
      action: 'Optimize based on identified patterns',
      impact: 'Improve business performance',
      effort: 'medium' as const,
      roi: { monthly: '₱20,000', confidence: 75 },
      timeline: '1 month'
    }];
  }

  public getAllPatterns(): Map<CrossTabAnalysisType, CrossTabAnalysisPattern> {
    return this.patterns;
  }

  public getPatternsByCategory(category: 'time' | 'basket' | 'substitution' | 'demographics'): CrossTabAnalysisPattern[] {
    const patterns: CrossTabAnalysisPattern[] = [];

    this.patterns.forEach(pattern => {
      if (category === 'time' && pattern.type.startsWith('time_')) patterns.push(pattern);
      if (category === 'basket' && pattern.type.startsWith('basket_')) patterns.push(pattern);
      if (category === 'substitution' && (pattern.type.includes('substitution') || pattern.type.includes('suggestion'))) patterns.push(pattern);
      if (category === 'demographics' && (pattern.type.startsWith('age_') || pattern.type.startsWith('gender_') || pattern.type.startsWith('payment_'))) patterns.push(pattern);
    });

    return patterns;
  }
}