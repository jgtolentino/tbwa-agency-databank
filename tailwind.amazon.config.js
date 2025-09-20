// Tailwind CSS Configuration for Amazon-styled Dashboard Integration
// Based on Scout Dashboard Analysis

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Amazon Color Palette
        amazon: {
          primary: '#FF9900',      // Amazon Orange
          secondary: '#146EB4',    // Amazon Blue
          success: '#00A651',      // Green
          warning: '#FF9900',      // Orange
          danger: '#E01E5A',       // Red
          info: '#0073E6',         // Blue
          purple: '#8B5CF6',       // Purple
          pink: '#EC4899',         // Pink
          'light-blue': '#93BBFC', // Light Blue
          
          // Amazon Gray Scale
          gray: {
            50: '#F9F9F9',
            100: '#E5E5E5',
            200: '#CCCCCC',
            300: '#999999',
            400: '#666666',
            500: '#333333',
            600: '#1A1A1A',
            900: '#000000'
          }
        },
        
        // Scout Dashboard Specific Colors (mapped to Amazon palette)
        scout: {
          blue: '#3B82F6',         // Maps to amazon.secondary
          green: '#10B981',        // Maps to amazon.success  
          yellow: '#F59E0B',       // Maps to amazon.warning
          red: '#EF4444',          // Maps to amazon.danger
          purple: '#8B5CF6',       // Maps to amazon.purple
          pink: '#EC4899',         // Maps to amazon.pink
          'light-blue': '#93BBFC'  // Maps to amazon.light-blue
        },

        // Status Colors for KPIs and Trends
        trend: {
          up: '#00A651',           // Green
          down: '#E01E5A',         // Red
          neutral: '#666666'       // Gray
        },

        // Chart Colors (Recharts compatible)
        chart: {
          1: '#FF9900',            // Amazon Orange
          2: '#146EB4',            // Amazon Blue
          3: '#00A651',            // Green
          4: '#F59E0B',            // Yellow
          5: '#E01E5A',            // Red
          6: '#8B5CF6',            // Purple
          7: '#EC4899',            // Pink
          8: '#93BBFC'             // Light Blue
        }
      },

      fontFamily: {
        'amazon': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }] // 30px
      },

      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '88': '22rem',    // 352px
        '96': '24rem',    // 384px
      },

      borderRadius: {
        'amazon-sm': '0.375rem',  // 6px
        'amazon-md': '0.5rem',    // 8px
        'amazon-lg': '0.75rem',   // 12px
        'amazon-xl': '1rem'       // 16px
      },

      boxShadow: {
        'amazon-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'amazon': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'amazon-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'amazon-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        
        // Chart specific shadows
        'chart': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'kpi-card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'kpi-card-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' }
        }
      },

      transitionProperty: {
        'amazon': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform'
      },

      transitionDuration: {
        'amazon': '200ms'
      },

      transitionTimingFunction: {
        'amazon': 'cubic-bezier(0.4, 0, 0.2, 1)'
      }
    }
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    
    // Custom plugin for Amazon-specific utilities
    function({ addUtilities, addComponents, theme }) {
      // Amazon Button Styles
      addComponents({
        '.btn-amazon-primary': {
          backgroundColor: theme('colors.amazon.primary'),
          color: 'white',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.amazon-md'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 200ms ease-in-out',
          '&:hover': {
            backgroundColor: '#E6880A'
          },
          '&:focus': {
            outline: 'none',
            ring: `2px ${theme('colors.amazon.primary')}`,
            ringOffset: '2px'
          },
          '&:disabled': {
            opacity: '0.6',
            cursor: 'not-allowed'
          }
        },

        '.btn-amazon-secondary': {
          backgroundColor: theme('colors.amazon.secondary'),
          color: 'white',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.amazon-md'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 200ms ease-in-out',
          '&:hover': {
            backgroundColor: '#0F5A8C'
          }
        },

        // Amazon Card Styles
        '.card-amazon': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.amazon-lg'),
          border: `1px solid ${theme('colors.amazon.gray.200')}`,
          boxShadow: theme('boxShadow.amazon-sm'),
          transition: 'box-shadow 200ms ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.amazon')
          }
        },

        // KPI Card Styles
        '.kpi-card': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.amazon-lg'),
          border: `1px solid ${theme('colors.amazon.gray.200')}`,
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.kpi-card'),
          transition: 'box-shadow 200ms ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.kpi-card-hover')
          }
        },

        // Tab Styles
        '.tab-amazon-active': {
          borderBottom: `2px solid ${theme('colors.amazon.primary')}`,
          color: theme('colors.amazon.primary'),
          fontWeight: theme('fontWeight.medium')
        },

        '.tab-amazon-inactive': {
          borderBottom: '2px solid transparent',
          color: theme('colors.amazon.gray.400'),
          transition: 'color 200ms ease-in-out',
          '&:hover': {
            color: theme('colors.amazon.secondary')
          }
        },

        // Chart Container Styles
        '.chart-container': {
          backgroundColor: 'white',
          borderRadius: theme('borderRadius.amazon-lg'),
          border: `1px solid ${theme('colors.amazon.gray.200')}`,
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.chart')
        },

        // Filter Styles
        '.filter-amazon': {
          borderRadius: theme('borderRadius.amazon-md'),
          border: `1px solid ${theme('colors.amazon.gray.300')}`,
          fontSize: theme('fontSize.sm'),
          padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
          backgroundColor: 'white',
          boxShadow: theme('boxShadow.amazon-sm'),
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.amazon.primary'),
            ring: `1px ${theme('colors.amazon.primary')}`
          }
        }
      });

      // Utility classes for trends and status
      addUtilities({
        '.text-trend-up': {
          color: theme('colors.trend.up')
        },
        '.text-trend-down': {
          color: theme('colors.trend.down')
        },
        '.text-trend-neutral': {
          color: theme('colors.trend.neutral')
        },
        '.bg-trend-up': {
          backgroundColor: `${theme('colors.trend.up')}1A` // 10% opacity
        },
        '.bg-trend-down': {
          backgroundColor: `${theme('colors.trend.down')}1A` // 10% opacity
        },
        '.bg-trend-neutral': {
          backgroundColor: `${theme('colors.trend.neutral')}1A` // 10% opacity
        }
      });
    }
  ]
};

// Additional CSS-in-JS styles for complex components
export const amazonStyles = {
  // Recharts custom styles
  recharts: {
    tooltip: {
      backgroundColor: 'white',
      border: '1px solid #E5E5E5',
      borderRadius: '6px',
      fontSize: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '8px 12px'
    },
    grid: {
      strokeDasharray: '3 3',
      stroke: '#E5E5E5'
    },
    axis: {
      stroke: '#666666',
      fontSize: 12
    }
  },

  // Animation styles
  animations: {
    fadeIn: {
      animation: 'fadeIn 0.5s ease-in-out'
    },
    slideUp: {
      animation: 'slideUp 0.3s ease-out'
    },
    chartLoad: {
      animation: 'fadeIn 0.8s ease-in-out'
    }
  },

  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};