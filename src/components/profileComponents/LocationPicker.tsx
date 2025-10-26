import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { IoLocationOutline, IoClose } from "react-icons/io5";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// فیکس کردن آیکون marker برای leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  currentLocation?: string;
}

// کامپوننت برای گوش دادن به کلیک روی نقشه
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const LocationPicker = ({
  onLocationSelect,
  currentLocation,
}: LocationPickerProps) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(
    currentLocation
      ? { lat: 35.6892, lng: 51.389, address: currentLocation }
      : null
  );

  const handleMapClick = async (lat: number, lng: number) => {
    try {
      // استفاده از Nominatim برای تبدیل مختصات به آدرس
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      const address = data.display_name || "آدرس نامشخص";

      const locationData = { lat, lng, address };
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    } catch (error) {
      const locationData = {
        lat,
        lng,
        address: `موقعیت: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      };
      setSelectedLocation(locationData);
      onLocationSelect(locationData);
    }
  };

  const defaultCenter: [number, number] = [35.6892, 51.389]; // تهران

  return (
    <div className="relative">
      {/* فیلد نمایش موقعیت */}
      <div className="relative">
        <input
          type="text"
          value={selectedLocation?.address || ""}
          readOnly
          placeholder="موقعیت کافه روی نقشه انتخاب نشده"
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-3 pr-12 focus:outline-none cursor-pointer"
          onClick={() => setShowMap(true)}
        />
        <button
          onClick={() => setShowMap(true)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <IoLocationOutline size={20} />
        </button>
      </div>

      {/* مودال نقشه */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* هدر مودال */}
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-bold">انتخاب موقعیت کافه روی نقشه</h3>
              <button
                onClick={() => setShowMap(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* نقشه */}
            <div className="flex-1 relative">
              <MapContainer
                center={
                  selectedLocation
                    ? [selectedLocation.lat, selectedLocation.lng]
                    : defaultCenter
                }
                zoom={13}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0 0 0.5rem 0.5rem",
                }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {selectedLocation && (
                  <Marker
                    position={[selectedLocation.lat, selectedLocation.lng]}
                  />
                )}
              </MapContainer>
            </div>

            {/* راهنما */}
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  روی نقشه کلیک کنید تا موقعیت کافه انتخاب شود
                </p>
                {selectedLocation && (
                  <p className="text-green-600 dark:text-green-400 font-semibold">
                    موقعیت انتخاب شده: {selectedLocation.lat.toFixed(4)},{" "}
                    {selectedLocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>

            {/* فوتر مودال */}
            <div className="flex gap-3 p-4 border-t dark:border-gray-700">
              <button
                onClick={() => setShowMap(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={() => setShowMap(false)}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                تأیید موقعیت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
