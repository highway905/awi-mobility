# Custom Hooks Usage Guide

## 🎯 Quick Start for Other Pages

This guide helps developers use the reusable custom hooks created during the order page refactor in other parts of the application.

## 📦 Available Hooks

### Core Hooks (Import from `@/features/orders/hooks/useOrderHooks`)

#### 1. `useLocalStorage<T>(key, initialValue)`
**Purpose:** SSR-safe localStorage with hydration handling
**Returns:** `[value, setValue, isHydrated]`

```typescript
import { useLocalStorage } from '@/features/orders/hooks/useOrderHooks'

// Example: User preferences
const [userPrefs, setUserPrefs, isHydrated] = useLocalStorage('userPreferences', {
  theme: 'light',
  language: 'en',
  notifications: true
})

// Example: Filter state
const [filters, setFilters, isHydrated] = useLocalStorage('inventoryFilters', {
  category: 'all',
  status: 'active',
  sortBy: 'name'
})
```

#### 2. `useIsBrowser()`
**Purpose:** Detect if we're in the browser (prevents SSR issues)
**Returns:** `boolean`

```typescript
import { useIsBrowser } from '@/features/orders/hooks/useOrderHooks'

export function MyComponent() {
  const isBrowser = useIsBrowser()
  
  // Don't render until we're in the browser
  if (!isBrowser) {
    return <div>Loading...</div>
  }
  
  // Safe to use window, localStorage, etc.
  return <div>Browser-specific content</div>
}
```

#### 3. `useDebounce<T>(value, delay)`
**Purpose:** Debounce rapidly changing values
**Returns:** `T` (debounced value)

```typescript
import { useDebounce } from '@/features/orders/hooks/useOrderHooks'

export function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 300)
  
  // API call only triggers after user stops typing for 300ms
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery)
    }
  }, [debouncedQuery])
  
  return (
    <input 
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

#### 4. `useWindowSize()`
**Purpose:** Track window dimensions safely
**Returns:** `{ width: number, height: number }`

```typescript
import { useWindowSize } from '@/features/orders/hooks/useOrderHooks'

export function ResponsiveComponent() {
  const { width, height } = useWindowSize()
  
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1024
  
  return (
    <div className={isMobile ? 'mobile-layout' : 'desktop-layout'}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  )
}
```

## 🚀 Implementation Patterns

### Pattern 1: Basic Page with localStorage
```typescript
"use client"

import { useLocalStorage, useIsBrowser } from '@/features/orders/hooks/useOrderHooks'

export function InventoryPage() {
  const isBrowser = useIsBrowser()
  const [viewMode, setViewMode, isHydrated] = useLocalStorage('inventoryView', 'grid')
  const [filters, setFilters, filtersHydrated] = useLocalStorage('inventoryFilters', {})
  
  // Wait for hydration to prevent SSR mismatches
  if (!isBrowser || !isHydrated || !filtersHydrated) {
    return <div className="p-4">Loading...</div>
  }
  
  return (
    <div>
      <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
        Toggle View ({viewMode})
      </button>
      {/* Rest of component */}
    </div>
  )
}
```

### Pattern 2: Search with Debouncing
```typescript
"use client"

import { useState, useEffect } from 'react'
import { useDebounce, useLocalStorage } from '@/features/orders/hooks/useOrderHooks'

export function ProductSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', [])
  const debouncedQuery = useDebounce(searchQuery, 300)
  
  // API call with debounced query
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery)
      
      // Add to search history
      setSearchHistory(prev => [
        debouncedQuery,
        ...prev.filter(item => item !== debouncedQuery).slice(0, 9)
      ])
    }
  }, [debouncedQuery])
  
  return (
    <div>
      <input 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
      />
      {/* Search results */}
    </div>
  )
}
```

### Pattern 3: Responsive Dashboard
```typescript
"use client"

import { useWindowSize, useLocalStorage, useIsBrowser } from '@/features/orders/hooks/useOrderHooks'

export function Dashboard() {
  const isBrowser = useIsBrowser()
  const { width } = useWindowSize()
  const [layout, setLayout, isHydrated] = useLocalStorage('dashboardLayout', 'default')
  
  if (!isBrowser || !isHydrated) {
    return <DashboardSkeleton />
  }
  
  const isMobile = width < 768
  const columns = isMobile ? 1 : layout === 'compact' ? 2 : 3
  
  return (
    <div className={`grid grid-cols-${columns} gap-4`}>
      {/* Responsive dashboard widgets */}
    </div>
  )
}
```

## ⚠️ Common Pitfalls to Avoid

### ❌ DON'T: Direct window checks
```typescript
// Bad - causes SSR hydration issues
if (typeof window !== 'undefined') {
  const data = localStorage.getItem('myData')
}
```

### ✅ DO: Use hooks
```typescript
// Good - SSR-safe
const isBrowser = useIsBrowser()
const [data, setData, isHydrated] = useLocalStorage('myData', defaultValue)
```

### ❌ DON'T: Render before hydration
```typescript
// Bad - can cause hydration mismatches
return (
  <div>
    {typeof window !== 'undefined' && <ClientOnlyComponent />}
  </div>
)
```

### ✅ DO: Wait for hydration
```typescript
// Good - prevents hydration issues
if (!isBrowser || !isHydrated) {
  return <LoadingSkeleton />
}

return <FullComponent />
```

### ❌ DON'T: Immediate API calls with search
```typescript
// Bad - too many API calls
const [query, setQuery] = useState('')
useEffect(() => {
  searchAPI(query) // Calls on every keystroke
}, [query])
```

### ✅ DO: Use debouncing
```typescript
// Good - efficient API usage
const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 300)
useEffect(() => {
  if (debouncedQuery) searchAPI(debouncedQuery)
}, [debouncedQuery])
```

## 🔧 Creating Custom Hooks for Your Feature

### Example: Analytics Page Hooks
```typescript
// features/analytics/hooks/useAnalyticsHooks.ts
import { useLocalStorage, useDebounce } from '@/features/orders/hooks/useOrderHooks'

export function useAnalyticsFilters() {
  const [dateRange, setDateRange, isHydrated] = useLocalStorage('analyticsDateRange', {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    to: new Date()
  })
  
  const [metrics, setMetrics] = useLocalStorage('analyticsMetrics', ['revenue', 'orders'])
  
  return { dateRange, setDateRange, metrics, setMetrics, isHydrated }
}

export function useAnalyticsSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500) // Longer delay for analytics
  
  return { query, setQuery, debouncedQuery }
}
```

### Example: Settings Page Hooks
```typescript
// features/settings/hooks/useSettingsHooks.ts
import { useLocalStorage } from '@/features/orders/hooks/useOrderHooks'

export function useUserSettings() {
  const [theme, setTheme, themeHydrated] = useLocalStorage('theme', 'light')
  const [language, setLanguage, langHydrated] = useLocalStorage('language', 'en')
  const [notifications, setNotifications, notifHydrated] = useLocalStorage('notifications', {
    email: true,
    push: true,
    sms: false
  })
  
  const isHydrated = themeHydrated && langHydrated && notifHydrated
  
  return {
    theme, setTheme,
    language, setLanguage,
    notifications, setNotifications,
    isHydrated
  }
}
```

## 📋 Testing with Hooks

### Example Test Setup
```typescript
// __tests__/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/features/orders/hooks/useOrderHooks'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))
    
    expect(result.current[0]).toBe('initial')
    expect(result.current[2]).toBe(true) // isHydrated
  })
  
  it('should persist value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    expect(localStorage.getItem('test')).toBe('"updated"')
  })
})
```

## 🎉 Benefits Summary

By using these hooks consistently across the application, you get:

1. **SSR Safety**: No hydration mismatches
2. **Type Safety**: Full TypeScript support
3. **Performance**: Debouncing and efficient re-renders
4. **Consistency**: Same patterns across all pages
5. **Maintainability**: Centralized logic, easier to update
6. **Testing**: Easier to mock and test
7. **Developer Experience**: Better IntelliSense and debugging

## 📚 Next Steps

1. **Use these hooks in your feature**: Start with `useIsBrowser()` and `useLocalStorage()`
2. **Create feature-specific hooks**: Compose the base hooks for your specific needs
3. **Test your implementation**: Ensure SSR compatibility
4. **Update documentation**: Add your patterns to this guide

For questions or improvements, refer to the order page implementation as a reference example.
