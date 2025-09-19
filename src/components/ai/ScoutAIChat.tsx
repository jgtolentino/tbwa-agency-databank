import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, Zap, Clock, Users, TrendingUp, Loader2, X } from 'lucide-react'
import { scoutAI } from '../../services/scoutAIService'
import type { ChatMessage, ChatSession, QuickAction, CrossTabResponse } from '../../types/crossTab'

interface ScoutAIChatProps {
  className?: string
  onInsightGenerated?: (insight: CrossTabResponse) => void
  isOpen?: boolean
  onClose?: () => void
  initialContext?: string
}

const ScoutAIChat: React.FC<ScoutAIChatProps> = ({
  className = '',
  onInsightGenerated,
  isOpen = false,
  onClose,
  initialContext
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [session] = useState<ChatSession>({
    id: `session_${Date.now()}`,
    messages: [],
    context: {
      recentQueries: [],
      userPreferences: {
        detailLevel: 'detailed',
        focusArea: ['performance', 'analytics'],
        language: 'en'
      }
    },
    startTime: new Date(),
    lastActivity: new Date()
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load quick actions
    scoutAI.getQuickActions().then(setQuickActions)

    // Add welcome message with context
    const contextText = initialContext ? ` I see you're looking at the ${initialContext.replace('-', ' ')} section.` : ''
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      content: `Hi! I'm Scout AI, your analytics assistant.${contextText} I can help you analyze customer behavior, sales patterns, and store performance. Try asking about peak shopping hours, basket analysis, or demographic trends.`,
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [initialContext])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (message?: string) => {
    const messageText = message || currentMessage.trim()
    if (!messageText || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: 'typing',
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await scoutAI.processQuery({
        query: messageText,
        context: session.context,
        options: {
          includeVisualization: true,
          detailLevel: 'detailed',
          maxRecommendations: 3
        }
      })

      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.id !== 'typing'))

      if (response.success && response.data) {
        const assistantMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'assistant',
          content: response.data.answer,
          timestamp: new Date(),
          response: response.data
        }

        setMessages(prev => [...prev, assistantMessage])

        // Update session context
        session.context.recentQueries = [
          messageText,
          ...session.context.recentQueries.slice(0, 4)
        ]
        session.lastActivity = new Date()

        // Notify parent component if callback provided
        if (onInsightGenerated) {
          onInsightGenerated(response.data)
        }
      } else {
        const errorMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          type: 'assistant',
          content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== 'typing'))

      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        type: 'assistant',
        content: 'I\'m experiencing technical difficulties. Please try again in a moment.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getQuickActionIcon = (icon: string) => {
    switch (icon) {
      case 'clock': return <Clock className="w-4 h-4" />
      case 'shopping-cart': return <TrendingUp className="w-4 h-4" />
      case 'users': return <Users className="w-4 h-4" />
      case 'bar-chart': return <TrendingUp className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const formatMessage = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => (
        <p key={index} className={index > 0 ? 'mt-2' : ''}>
          {line}
        </p>
      ))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`scout-card flex flex-col h-[600px] w-[500px] max-w-[90vw] max-h-[90vh] ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <MessageCircle className="w-5 h-5 text-scout-secondary" />
          <h3 className="font-semibold text-scout-text">Scout AI Assistant</h3>
          <div className="ml-auto flex items-center gap-2">
            <div className="text-xs text-gray-500">
              {messages.filter(m => m.type === 'user').length} queries
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-scout-accent text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.isTyping ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Scout AI is thinking...</span>
                  </div>
                ) : (
                  <div className="text-sm">
                    {formatMessage(message.content)}

                    {/* Show metrics if available */}
                    {message.response?.metrics && message.response.metrics.length > 0 && (
                      <div className="mt-3 p-2 bg-white rounded border">
                        <div className="text-xs font-medium text-gray-600 mb-2">Key Metrics</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {message.response.metrics.slice(0, 4).map((metric, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-600">{metric.name}:</span>
                              <span className="font-medium">{metric.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show recommendations if available */}
                    {message.response?.recommendations && message.response.recommendations.length > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded border">
                        <div className="text-xs font-medium text-blue-800 mb-2">Recommendations</div>
                        {message.response.recommendations.slice(0, 2).map((rec, idx) => (
                          <div key={idx} className="text-xs text-blue-700 mb-1">
                            • {rec.action}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-600 mb-2">Quick Actions:</div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.slice(0, 4).map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="flex items-center gap-2 p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={isLoading}
                >
                  {getQuickActionIcon(action.icon)}
                  <span className="truncate">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about sales patterns, customer behavior, or store performance..."
              className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-scout-accent focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!currentMessage.trim() || isLoading}
              className="p-2 bg-scout-accent text-white rounded-lg hover:bg-scout-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScoutAIChat