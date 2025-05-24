'use client'

import { useEffect, useState } from 'react'
import { getMqttClient } from '@/lib/mqttClient'
import { Icons } from '@/components/icons'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Card, CardContent } from '@/components/ui/card'

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

                if (Object.values(newData).every(val => val !== null)) {
                    setLoading(false)
                }

                return newData
            })
        })

        return () => {
            client.unsubscribe('demokit/sai/#')
        }
    }, [])

    const MetricCard = ({
        icon,
        title,
        value,
        unit,
        fromColor,
        toColor,
    }: {
        icon: React.ReactNode
        title: string
        value: number | null
        unit: string
        fromColor: string
        toColor: string
    }) => (
        <Card className={`bg-gradient-to-br ${fromColor} ${toColor} text-white`}>
            <CardContent className="p-6 flex flex-col h-full justify-between">
                <div className="flex items-center mb-4">
                    <div className="p-3 rounded-lg bg-white bg-opacity-20 mr-3">{icon}</div>
                    <h3 className="text-lg font-medium">{title}</h3>
                </div>
                <div className="flex items-end justify-between mt-auto">
                    {loading ? (
                        <Skeleton width={80} height={36} baseColor="#cbd5e1" highlightColor="#e2e8f0" />
                    ) : (
                        <span className="text-3xl font-bold">{value?.toLocaleString() ?? '--'}</span>
                    )}
                    <span className="text-sm text-white/80 ml-2">{unit}</span>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <Card className="max-w-7xl mx-auto px-4 py-6 space-y-8">
            <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                    <Icons.power className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Power Monitoring Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400">Real-time energy consumption metrics</p>
                </div>
            </div>

            <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4">
                <h3 className="col-span-full text-lg font-semibold mb-2"># Device 1</h3>
                <MetricCard
                    icon={<Icons.flash className="w-6 h-6" />}
                    title="Voltage"
                    value={data.volt}
                    unit="Volt"
                    fromColor="from-purple-500"
                    toColor="to-purple-700"
                />
                <MetricCard
                    icon={<Icons.lightningBolt className="w-6 h-6" />}
                    title="Current"
                    value={data.amp}
                    unit="Ampere"
                    fromColor="from-green-500"
                    toColor="to-green-700"
                />
                <MetricCard
                    icon={<Icons.electric className="w-6 h-6" />}
                    title="Frequency"
                    value={data.fre}
                    unit="Hz"
                    fromColor="from-amber-500"
                    toColor="to-amber-700"
                />
                <MetricCard
                    icon={<Icons.power className="w-6 h-6" />}
                    title="Active Power"
                    value={data.watt}
                    unit="Watt"
                    fromColor="from-blue-500"
                    toColor="to-blue-700"
                />
                <MetricCard
                    icon={<Icons.lightning className="w-6 h-6" />}
                    title="Energy"
                    value={data.kwh}
                    unit="kWh"
                    fromColor="from-indigo-500"
                    toColor="to-indigo-700"
                />
            </Card>

            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-lg bg-white bg-opacity-20 mr-3">
                            <Icons.power className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium">System Status</h3>
                    </div>
                    {loading ? (
                        <Skeleton width={140} height={24} baseColor="#4b5563" highlightColor="#6b7280" />
                    ) : (
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                            <span className="font-medium">All systems normal</span>
                        </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-sm text-white/60">Last updated: {new Date().toLocaleTimeString()}</p>
                    </div>
                </CardContent>
            </Card>
        </Card>
    )
}
