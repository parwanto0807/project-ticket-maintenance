'use client'

import React, { useEffect, useState } from 'react'
import { getMqttClient } from '@/lib/mqttClient'
import { Icons } from '@/components/icons'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export default function MqttClient() {
    const [data, setData] = useState<{
        fre: number | null,
        amp: number | null,
        volt: number | null,
        kwh: number | null,
        watt: number | null,
    }>({
        fre: null,
        amp: null,
        volt: null,
        kwh: null,
        watt: null,
    })

    const [loading, setLoading] = useState(true)
    const [isOverCurrent, setIsOverCurrent] = useState(false)
    const [currentThreshold, setCurrentThreshold] = useState<number>(6)
    const [isEditingThreshold, setIsEditingThreshold] = useState(false)

    useEffect(() => {
        const client = getMqttClient()
        client.subscribe('demokit/sai/#')

        client.on('message', (topic, message) => {
            const payload = parseFloat(message.toString())

            setData(prev => {
                const newData = {
                    ...prev,
                    ...(topic.endsWith('/fre') && { fre: payload }),
                    ...(topic.endsWith('/amp') && { amp: payload }),
                    ...(topic.endsWith('/volt') && { volt: payload }),
                    ...(topic.endsWith('/kwh') && { kwh: payload }),
                    ...(topic.endsWith('/watt') && { watt: payload }),
                }

                if (topic.endsWith('/amp')) {
                    setIsOverCurrent(payload >= currentThreshold)
                }

                if (Object.values(newData).every(val => val !== null)) {
                    setLoading(false)
                }

                return newData
            })
        })

        return () => {
            client.unsubscribe('demokit/sai/#')
        }
    }, [currentThreshold])

    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value)
        if (!isNaN(value) && value > 0) {
            setCurrentThreshold(value)
        }
    }

    const MetricCard = ({
        icon,
        title,
        value,
        unit,
        fromColor,
        toColor,
        isAlert = false,
        alertThreshold,
        alertMessage,
        onThresholdChange,
    }: {
        icon: React.ReactNode
        title: string
        value: number | null
        unit: string
        fromColor: string
        toColor: string
        isAlert?: boolean
        alertThreshold?: number
        alertMessage?: string
        onThresholdChange?: (value: number) => void
    }) => (
        <Card className={cn(
            `bg-gradient-to-br ${fromColor} ${toColor} text-white`,
            isAlert && value && value >= (alertThreshold || 0) && 'animate-pulse border-2 border-red-500',
            'min-h-[100px] sm:min-h-[180px]' // Memberikan tinggi minimum yang konsisten
        )}>
            <CardContent className="p-4 sm:p-6 flex flex-col h-full justify-between">
                <div className="flex items-center mb-3 sm:mb-4">
                    <div className={cn(
                        "p-2 sm:p-3 rounded-lg bg-white bg-opacity-20 mr-2 sm:mr-3",
                        isAlert && value && value >= (alertThreshold || 0) && 'bg-red-500/50'
                    )}>
                        {React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
                            className: "w-4 h-4 sm:w-6 sm:h-6"
                        })}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="text-sm sm:text-lg font-medium truncate">{title}</h3>
                            {isAlert && onThresholdChange && (
                                <button
                                    onClick={() => setIsEditingThreshold(!isEditingThreshold)}
                                    className="text-xs bg-white/20 hover:bg-white/30 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded"
                                >
                                    {isEditingThreshold ? 'Close' : 'Set Threshold'}
                                </button>
                            )}
                        </div>
                        {isAlert && value && value >= (alertThreshold || 0) && (
                            <span className="text-xs font-bold text-red-200 block mt-0.5 sm:mt-1 truncate">
                                {alertMessage}
                            </span>
                        )}
                    </div>
                </div>

                {isAlert && isEditingThreshold ? (
                    <div className="mt-2 sm:mt-4">
                        <label className="text-xs block mb-1">Max Current (A):</label>
                        <Input
                            type="number"
                            value={currentThreshold}
                            onChange={handleThresholdChange}
                            onBlur={() => setIsEditingThreshold(false)}
                            className="bg-white/20 border-white/30 text-white h-7 sm:h-8 text-xs sm:text-sm"
                            step="0.1"
                            min="0.1"
                        />
                    </div>
                ) : (
                    <div className="flex items-end justify-between mt-auto">
                        {loading ? (
                            <Skeleton width={60} height={28} className="sm:w-80 sm:h-36" baseColor="#cbd5e1" highlightColor="#e2e8f0" />
                        ) : (
                            <span className="text-xl sm:text-3xl font-bold truncate">
                                {value?.toLocaleString() ?? '--'}
                            </span>
                        )}
                        <span className="text-xs sm:text-sm text-white/80 ml-1 sm:ml-2">{unit}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )

    return (
        <div className="w-full px-2 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-8">
            <Card className="w-full mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 sm:p-6">
                    <div className="p-2 sm:p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                        <Icons.power className="w-6 sm:w-8 h-6 sm:h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Power Monitoring</h1>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Real-time energy metrics</p>
                    </div>
                </div>
            </Card>

            <Card className="w-full p-2 sm:p-4">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                    <h3 className="col-span-full text-base sm:text-lg font-semibold mb-1 sm:mb-2 px-2 sm:px-0"># Device 1</h3>
                    <MetricCard
                        icon={<Icons.flash />}
                        title="Voltage"
                        value={data.volt}
                        unit="Volt"
                        fromColor="from-purple-500"
                        toColor="to-purple-700"
                    />
                    <MetricCard
                        icon={<Icons.lightningBolt />}
                        title="Current"
                        value={data.amp}
                        unit="Ampere"
                        fromColor="from-green-500"
                        toColor="to-green-700"
                        isAlert
                        alertThreshold={currentThreshold}
                        alertMessage={`MAX ${currentThreshold}A!`}
                        onThresholdChange={setCurrentThreshold}
                    />
                    <MetricCard
                        icon={<Icons.electric />}
                        title="Frequency"
                        value={data.fre}
                        unit="Hz"
                        fromColor="from-amber-500"
                        toColor="to-amber-700"
                    />
                    <MetricCard
                        icon={<Icons.power />}
                        title="Power"
                        value={data.watt}
                        unit="Watt"
                        fromColor="from-blue-500"
                        toColor="to-blue-700"
                    />
                    <MetricCard
                        icon={<Icons.lightning />}
                        title="Energy"
                        value={data.kwh}
                        unit="kWh"
                        fromColor="from-indigo-500"
                        toColor="to-indigo-700"
                    />
                </div>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center mb-3 sm:mb-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-white bg-opacity-20 mr-2 sm:mr-3">
                            <Icons.power className="w-4 sm:w-6 h-4 sm:h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium">System Status</h3>
                    </div>
                    {loading ? (
                        <Skeleton width={100} height={20} className="sm:w-140 sm:h-24" baseColor="#4b5563" highlightColor="#6b7280" />
                    ) : (
                        <div className="flex items-center">
                            <div className={cn(
                                "w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1.5 sm:mr-2",
                                isOverCurrent ? 'bg-red-500 animate-pulse' : 'bg-green-400'
                            )}></div>
                            <span className="text-sm sm:text-base font-medium">
                                {isOverCurrent ? `WARNING: ≥ ${currentThreshold}A` : 'All systems normal'}
                            </span>
                        </div>
                    )}
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                        <p className="text-xs sm:text-sm text-white/60">Updated: {new Date().toLocaleTimeString()}</p>
                        <p className="text-xs sm:text-sm text-white/60 mt-1">Threshold: {currentThreshold}A</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}