'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'executive' | 'regional_manager' | 'analyst' | 'store_owner'
  department: string
  region?: string
  store_id?: string
  preferences: any
}

interface DashboardConfig {
  theme: 'dark' | 'light'
  refreshInterval: number
  widgets: string[]
  layout: any
}

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadUserAndConfig()
  }, [])

  async function loadUserAndConfig() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setUser(user)

      // Load user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)

        // Load dashboard config for user role
        const { data: configData } = await supabase
          .from('dashboard_configs')
          .select('*')
          .eq('role', profileData.role)
          .single()
        
        if (configData) {
          setDashboardConfig({
            theme: configData.config.theme,
            refreshInterval: configData.config.refreshInterval,
            widgets: configData.widgets,
            layout: configData.layout
          })
        }
      }
    } catch (error) {
      console.error('Error loading user config:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const theme = dashboardConfig?.theme || 'dark'
  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900'

  return (
    <div className={`min-h-screen ${bgClass} ${textClass}`}>
      <nav className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Scout Dashboard
              </h1>
              <span className="ml-4 text-sm opacity-75">
                {profile?.role.replace('_', ' ').toUpperCase()} VIEW
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{profile?.full_name || profile?.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-sm hover:opacity-75"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}