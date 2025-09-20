'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import DashboardLayout from '@/components/DashboardLayout'
import ExecutiveDashboard from '@/components/dashboards/ExecutiveDashboard'
import { Loader2 } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'executive' | 'regional_manager' | 'analyst' | 'store_owner'
  department: string
  region?: string
  store_id?: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadUserProfile()
  }, [])

  async function loadUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
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

  const renderDashboard = () => {
    switch (profile?.role) {
      case 'executive':
        return <ExecutiveDashboard />
      case 'regional_manager':
        return <div>Regional Manager Dashboard (Coming Soon)</div>
      case 'analyst':
        return <div>Analyst Dashboard (Coming Soon)</div>
      case 'store_owner':
        return <div>Store Owner Dashboard (Coming Soon)</div>
      default:
        return <div>No dashboard available for your role</div>
    }
  }

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  )
}