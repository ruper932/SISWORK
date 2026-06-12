import { useEffect, useState } from "react"
import Map, { Marker, NavigationControl, type ViewState } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"

type RequestLocationMapProps = {
  latitude: number
  longitude: number
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

const LIGHT_MAP_STYLE = "mapbox://styles/mapbox/streets-v12"
const DARK_MAP_STYLE = "mapbox://styles/mapbox/dark-v11"

function getIsDarkMode() {
  if (typeof document === "undefined") return false

  const root = document.documentElement

  return (
    root.classList.contains("dark") ||
    root.getAttribute("data-theme") === "dark"
  )
}

export function RequestLocationMap({
  latitude,
  longitude,
}: RequestLocationMapProps) {
  const [isDarkMode, setIsDarkMode] = useState(getIsDarkMode)

  const [viewState, setViewState] = useState<ViewState>({
    latitude,
    longitude,
    zoom: 14,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  })

  useEffect(() => {
    setViewState((prev) => ({
      ...prev,
      latitude,
      longitude,
    }))
  }, [latitude, longitude])

  useEffect(() => {
    if (typeof document === "undefined") return

    const root = document.documentElement

    const observer = new MutationObserver(() => {
      setIsDarkMode(getIsDarkMode())
    })

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      <Map
        reuseMaps
        mapboxAccessToken={MAPBOX_TOKEN}
        {...viewState}
        onMove={(event) => setViewState(event.viewState)}
        style={{ width: "100%", height: 320 }}
        mapStyle={isDarkMode ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
      >
        <NavigationControl position="top-right" showCompass={false} />
        <Marker latitude={latitude} longitude={longitude} />
      </Map>
    </div>
  )
}