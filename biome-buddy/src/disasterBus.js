let listeners = []

export function subscribe(fn) {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}

export function emit(payload) {
  listeners.forEach((fn) => {
    try {
      fn(payload)
    } catch (e) {
      // swallow listener errors
      console.error('disasterBus listener error', e)
    }
  })
}

// Predefined disaster text dictionary
export const DISASTER_TEXTS = {
  forest_fire: 'A forest fire has begun spreading across the canopy and underbrush.',
  wildfire: 'Raging wildfire moving quickly through dry brush and grasslands.',
  flood: 'Heavy rains have swollen rivers and caused widespread flooding.',
  earthquake: 'A sudden earthquake shook the ground and damaged structures.',
  hurricane: 'A powerful hurricane is making landfall with intense winds and storm surge.',
}

// Accept either a string key or a payload object. If passed a key, look up text.
export function showDisaster(disaster) {
  let payload
  if (typeof disaster === 'string') {
    payload = { name: disaster, message: DISASTER_TEXTS[disaster] ?? disaster }
  } else if (disaster && typeof disaster === 'object') {
    payload = { ...disaster }
    if (!payload.message && payload.name && DISASTER_TEXTS[payload.name]) {
      payload.message = DISASTER_TEXTS[payload.name]
    }
  } else {
    payload = { name: 'unknown', message: String(disaster) }
  }

  emit(payload)
}
