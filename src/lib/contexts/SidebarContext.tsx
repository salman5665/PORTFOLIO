'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Restore saved preference on mount
  useEffect(() => {
    const restore = () => {
      try {
        const saved = localStorage.getItem('admin-sidebar-collapsed')
        if (saved !== null) setCollapsedState(JSON.parse(saved))
      } catch {}
    }
    restore()
  }, [])

  const setCollapsed = useCallback((v: boolean) => {
    setCollapsedState(v)
    try { localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(v)) } catch {}
  }, [])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
