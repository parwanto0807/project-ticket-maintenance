import mqtt, { MqttClient } from 'mqtt'

let client: MqttClient | null = null

const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
const protocol = isSecure ? 'wss' : 'wss'
const port = isSecure ? 8084 : 8084
const BROKER_URL = `${protocol}://broker.emqx.io:${port}/mqtt`

console.log('[MQTT] Broker URL:', BROKER_URL)

const CLIENT_ID = `mqtt_${Math.random().toString(16).slice(2, 10)}`

export function getMqttClient(): MqttClient {
  if (!client || client.disconnected) {
    client = mqtt.connect(BROKER_URL, {
      clientId: CLIENT_ID,
      reconnectPeriod: 1000,
      clean: true,
      connectTimeout: 4000,
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
