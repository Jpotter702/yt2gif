'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, Settings, Crown, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const { data: session, status } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">YG</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:block">
              yt2gif.app
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    {session.user?.name?.split(' ')[0]}
                  </span>
                  {session.user?.tier && session.user.tier !== 'FREE' && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user?.email}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        session.user?.tier === 'PREMIUM' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : session.user?.tier === 'PRO'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {session.user?.tier || 'FREE'}
                      </span>
                    </div>
                    
                    <div className="p-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      
                      {session.user?.tier === 'FREE' && (
                        <Link
                          href="/upgrade"
                          className="flex items-center px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setShowDropdown(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {showMobileMenu ? (
                <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="px-4 py-4 space-y-4">
              {session ? (
                <>
                  <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {session.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.user?.email}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        session.user?.tier === 'PREMIUM' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : session.user?.tier === 'PRO'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {session.user?.tier || 'FREE'}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Link>
                  
                  {session.user?.tier === 'FREE' && (
                    <Link
                      href="/upgrade"
                      className="flex items-center px-3 py-3 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Crown className="w-5 h-5 mr-3" />
                      Upgrade to Premium
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowMobileMenu(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="w-full flex items-center px-3 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/signin"
                    className="block w-full text-center py-3 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block w-full text-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Backdrop to close mobile menu */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </nav>
  )
}