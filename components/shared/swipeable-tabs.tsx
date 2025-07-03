"use client"
import type React from "react"
import { useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Swiper as SwiperType } from "swiper"
// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface Tab {
  id: string
  label: string
}

interface SwipeableTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  renderContent: (tabId: string) => React.ReactNode
}

export function SwipeableTabs({ tabs, activeTab, onTabChange, renderContent }: SwipeableTabsProps) {
  const swiperRef = useRef<SwiperType | null>(null)
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab)

  // Sync Swiper position when activeTab changes externally (e.g., from tab clicks)
  useEffect(() => {
    if (swiperRef.current && activeIndex >= 0) {
      // Only slide if we're not already on the correct slide
      if (swiperRef.current.activeIndex !== activeIndex) {
        swiperRef.current.slideTo(activeIndex, 300) // 300ms transition
      }
    }
  }, [activeIndex])

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex
    if (newIndex >= 0 && newIndex < tabs.length) {
      const newTabId = tabs[newIndex].id
      // Only update if it's different to avoid unnecessary re-renders
      if (newTabId !== activeTab) {
        onTabChange(newTabId)
      }
    }
  }

  const handleSwiperInit = (swiper: SwiperType) => {
    swiperRef.current = swiper
  }

  return (
    <div className="px-4 flex-1 flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="mb-2">
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="h-9 w-full bg-[#F5F5F4] border border-[#D6D3D1]">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "h-7 p-1 text-xs font-medium rounded-md border-transparent flex-1 bg-[#F5F5F4]",
                  "data-[state=active]:bg-[#FFFFFF]",
                  "hover:text-[#0C0A09] hover:bg-[#FFFFFF]",
                  "text-center justify-center",
                )}
              >
                <span className="truncate">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Swipeable Content */}
      <div className="flex-1 min-h-0">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          initialSlide={activeIndex}
          onSwiper={handleSwiperInit}
          onSlideChange={handleSlideChange}
          allowTouchMove={true}
          touchRatio={1}
          touchAngle={45}
          threshold={10}
          longSwipesRatio={0.5}
          longSwipesMs={300}
          followFinger={true}
          grabCursor={true}
          className="h-full w-full"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          {tabs.map((tab) => (
            <SwiperSlide key={tab.id} className="h-full">
              <div className="bg-white">{renderContent(tab.id)}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      <style jsx global>{`
        .swiper {
          width: 100%;
          height: 100%;
        }
        
        .swiper-slide {
          height: auto;
          min-height: 100%;
        }
        
        .swiper-wrapper {
          height: 100%;
        }
      `}</style>
    </div>
  )
}