// lib/mqttClient.ts
import mqtt, { MqttClient } from 'mqtt'

// Buat URL broker berdasarkan protokol
const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
const protocol = isSecure ? 'wss' : 'ws'
const BROKER_URL = `${protocol}://broker.hivemq.com:8884/mqtt`

// Client ID unik (optional, bisa juga generate)
const CLIENT_ID = `mqtt_${Math.random().toString(16).slice(2, 10)}`

let client: MqttClient | null = null

/**
 * Fungsi untuk membuat atau mengambil koneksi MQTT yang sudah ada.
 */
export function getMqttClient(): MqttClient {
  if (!client || client.disconnected) {
    client = mqtt.connect(BROKER_URL, {
      clientId: CLIENT_ID,
      reconnectPeriod: 1000, // reconnect setiap 1 detik jika terputus
    })

    client.on('connect', () => {
      console.log('[MQTT] Connected')
    })

    client.on('error', (err) => {
      console.error('[MQTT] Connection error:', err)
    })

    client.on('close', () => {
      console.warn('[MQTT] Connection closed')
    })
  }

  return client
}
