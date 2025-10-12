"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/components/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface HourlyData {
  datetime: string
  hour: number
  desktop: number
  mobile: number
  total: number
}

export function ChartAreaInteractive({ 
  initialData, 
  hourlyData 
}: { 
  initialData?: { date: string; desktop: number; mobile: number; total?: number }[]
  hourlyData?: HourlyData[]
}) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  const sourceData = React.useMemo(() => {
    // Use hourly data for 24h view, daily data for others
    if (timeRange === "24h") {
      console.log('Chart using hourlyData:', hourlyData?.length, 'records')
      // Transform hourly data to match chart format
      return hourlyData?.map(h => ({
        date: h.datetime,
        desktop: h.desktop,
        mobile: h.mobile,
        total: h.total
      })) || []
    }
    
    console.log('Chart received initialData:', initialData?.length, 'records')
    if (initialData && initialData.length > 0) {
      console.log('First date:', initialData[0].date)
      console.log('Last date:', initialData[initialData.length - 1].date)
    }
    return initialData || []
  }, [initialData, hourlyData, timeRange])

  const filteredData = React.useMemo(() => {
    if (!sourceData || sourceData.length === 0) {
      console.log('No source data available')
      return []
    }

    // For 24h view, hourly data is already filtered to last 24 hours
    if (timeRange === "24h") {
      console.log(`24h view data:`, sourceData.length, 'hourly records')
      return sourceData
    }

    const lastDate = new Date(sourceData[sourceData.length - 1].date)
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(lastDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    const filtered = sourceData.filter((item) => {
      const d = new Date(item.date)
      return d >= startDate
    })
    
    console.log(`Filtered data for ${timeRange}:`, filtered.length, 'records')
    return filtered
  }, [sourceData, timeRange])

  // Check if we have data
  const hasData = filteredData.length > 0
  
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          {timeRange === "24h" && "Last 24 hours"}
          {timeRange === "7d" && "Last 7 days"}
          {timeRange === "30d" && "Last 30 days"}
          {timeRange === "90d" && "Last 90 days"}
          {!hasData && " - No data available"}
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="@[900px]/card:flex hidden"
          >
            <ToggleGroupItem value="90d" className="h-8 px-2.5">
              Last 3 months
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">
              Last 30 days
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">
              Last 7 days
            </ToggleGroupItem>
            <ToggleGroupItem value="24h" className="h-8 px-2.5">
              Last 24 hours
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="@[900px]/card:hidden flex w-40"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="24h" className="rounded-lg">
                Last 24 hours
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!hasData ? (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium">No visitor data available</p>
              <p className="text-sm mt-2">Visit your public pages to start tracking visitors</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                // For 24h view, show hour format
                if (timeRange === "24h") {
                  return date.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })
                }
                // For other views, show date format
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    // For 24h view, show hour with date
                    if (timeRange === "24h") {
                      return date.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        hour12: true,
                      })
                    }
                    // For other views, show date only
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
