// Performance debugging utility for inventory page
export const performanceLogger = {
  startTimer: (label: string) => {
    console.time(label)
  },
  
  endTimer: (label: string) => {
    console.timeEnd(label)
  },
  
  logRender: (componentName: string, props?: any) => {
    console.log(`🔄 ${componentName} rendered`, props ? { props } : '')
  },
  
  logStateChange: (stateName: string, oldValue: any, newValue: any) => {
    console.log(`📊 State change: ${stateName}`, {
      from: oldValue,
      to: newValue
    })
  }
}

// Hook to track component re-renders
export const useRenderTracker = (componentName: string, props?: any) => {
  console.log(`🔄 ${componentName} rendered`, props || '')
}
