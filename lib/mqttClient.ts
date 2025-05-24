// lib/mqttClient.ts
import mqtt, { MqttClient } from 'mqtt'

let client: MqttClient | null = null

// Konfigurasi broker MQTT
const BROKER_URL = 'ws://broker.emqx.io:8083/mqtt' // Gunakan ws:// untuk client-side
const CLIENT_ID = '83WMolw5HYT'

/**
 * Fungsi untuk membuat atau mengambil koneksi MQTT yang sudah ada.
 */
export function getMqttClient(): MqttClient {
  if (!client || client?.disconnected) {
    client = mqtt.connect(BROKER_URL, {
      clientId: CLIENT_ID,
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
