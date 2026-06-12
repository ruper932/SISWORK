import { useEffect, useState } from "react"
import Map, { Marker, NavigationControl, type ViewState } from "react-map-gl/mapbox"
import { SearchBox } from "@mapbox/search-js-react"
import "mapbox-gl/dist/mapbox-gl.css"

type LocationPickerProps = {
  latitude?: number
  longitude?: number
  onChange: (value: {
    latitude: number
    longitude: number
  }) => void
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string

const DEFAULT_CENTER = {
  latitude: -16.5,
  longitude: -68.15,
}

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

export function LocationPicker({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  const [marker, setMarker] = useState({
    latitude: latitude ?? DEFAULT_CENTER.latitude,
    longitude: longitude ?? DEFAULT_CENTER.longitude,
  })

  const [viewState, setViewState] = useState<ViewState>({
    latitude: latitude ?? DEFAULT_CENTER.latitude,
    longitude: longitude ?? DEFAULT_CENTER.longitude,
    zoom: 13,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  })

  const [isDarkMode, setIsDarkMode] = useState(getIsDarkMode)

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

  useEffect(() => {
    if (typeof latitude === "number" && typeof longitude === "number") {
      setMarker({ latitude, longitude })
      setViewState((prev) => ({
        ...prev,
        latitude,
        longitude,
      }))
    }
  }, [latitude, longitude])

  return (
    <div className="space-y-3">
      <SearchBox
        accessToken={MAPBOX_TOKEN}
        options={{
          language: "es",
          country: "bo",
          limit: 5,
          proximity: {
            lng: DEFAULT_CENTER.longitude,
            lat: DEFAULT_CENTER.latitude,
          },
        }}
        onRetrieve={(result) => {
          const coordinates = result.features?.[0]?.geometry?.coordinates

          if (
            !Array.isArray(coordinates) ||
            coordinates.length < 2 ||
            typeof coordinates[0] !== "number" ||
            typeof coordinates[1] !== "number"
          ) {
            return
          }

          const lng = coordinates[0]
          const lat = coordinates[1]

          const next = { latitude: lat, longitude: lng }

          setMarker(next)
          setViewState((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            zoom: 15,
          }))
          onChange(next)
        }}
      />

      <div className="overflow-hidden rounded-2xl border border-border/60">
        <Map
          reuseMaps
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          style={{ width: "100%", height: 360 }}
          mapStyle={isDarkMode ? DARK_MAP_STYLE : LIGHT_MAP_STYLE}
          onClick={(event) => {
            const next = {
              latitude: event.lngLat.lat,
              longitude: event.lngLat.lng,
            }

            setMarker(next)
            setViewState((prev) => ({
              ...prev,
              latitude: next.latitude,
              longitude: next.longitude,
            }))
            onChange(next)
          }}
        >
          <NavigationControl position="top-right" />

          <Marker
            latitude={marker.latitude}
            longitude={marker.longitude}
            draggable
            onDragEnd={(event) => {
              const next = {
                latitude: event.lngLat.lat,
                longitude: event.lngLat.lng,
              }

              setMarker(next)
              onChange(next)
            }}
          />
        </Map>
      </div>

      <p className="text-sm text-muted-foreground">
        Busca una dirección, haz clic en el mapa o arrastra el marcador para fijar la ubicación.
      </p>
    </div>
  )
}