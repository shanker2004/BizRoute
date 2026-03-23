// src/components/MapComponent.jsx
import React, { useEffect, useRef, useState } from 'react'

const MapComponent = ({
  center = [12.9716, 77.5946],
  markers = []
}) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markerInstances = useRef([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if script is already present
    if (window.google && window.google.maps) {
      setIsLoaded(true)
      return
    }
    
    // Prevent multiple script tags
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsLoaded(true)
          clearInterval(checkInterval)
        }
      }, 500)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBe18wGLYbedCZOCatcP9bYzAXKRbYBGoo&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: center[0], lng: center[1] },
        zoom: 14,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
        ],
        mapTypeControl: false,
        streetViewControl: false
      })
    } else {
      mapInstance.current.panTo({ lat: center[0], lng: center[1] })
    }

    // Clear old markers safely
    markerInstances.current.forEach(m => m.setMap(null))
    markerInstances.current = []

    // Add new markers
    markers.forEach(markerData => {
      // Use the SVG Truck again to make it look excellent for the owner tracking vehicles
      const svgCar = {
        path: 'M29.395,0H17.636c-3.117,0-5.643,2.467-5.643,5.5v13.84v16.14c0,3.033,2.526,5.5,5.643,5.5h11.759 c3.116,0,5.643-2.467,5.643-5.5V19.34V5.5C35.037,2.467,32.511,0,29.395,0z M34.05,25.9H12.981V19.34H34.05V25.9z',
        fillColor: '#4f46e5',
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: '#fff',
        rotation: markerData.heading || 0,
        scale: 0.8,
        anchor: new window.google.maps.Point(23, 20),
      }

      const gMarker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapInstance.current,
        title: markerData.vehicle?.name,
        icon: svgCar
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 4px; min-width: 140px;">
            <strong style="color: #1e293b;">${markerData.vehicle?.name || 'Vehicle'}</strong><br/>
            <span style="font-size: 12px; color: #64748b;">Reg: ${markerData.vehicle?.regNo || 'N/A'}</span><br/>
            <div style="margin-top: 6px; padding: 4px; background: #ecfdf5; border-radius: 4px;">
                <span style="font-size: 12px; font-weight: bold; color: #059669;">
                    <i class="fas fa-tachometer-alt"></i> Speed: ${markerData.speed || '0'} km/h
                </span>
            </div>
            ${markerData.alert ? `<div style="margin-top: 4px; color: #ef4444; font-size: 11px;">⚠️ Active Alerts</div>` : ''}
          </div>
        `
      })

      gMarker.addListener('click', () => {
        infoWindow.open(mapInstance.current, gMarker)
      })

      // Auto open to make demo look impressive immediately
      if (markers.length === 1) {
        infoWindow.open(mapInstance.current, gMarker)
        // ensure it tracks and centers when opened
        setTimeout(() => infoWindow.close(), 4000)
      }

      markerInstances.current.push(gMarker)
    })

  }, [isLoaded, center, markers])

  return (
    <div className='relative w-full h-full'>
      {!isLoaded && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 z-10'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export default MapComponent
