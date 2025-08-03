'use client'
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CacheDebugger from '@/components/CacheDebugger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <CacheDebugger />
        </QueryClientProvider>
      </body>
    </html>
  )
} 