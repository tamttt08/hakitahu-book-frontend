<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-[#308ce8]/10 text-[#308ce8] flex items-center justify-center">
            <MapPin class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-lg font-black text-slate-900">Chọn địa chỉ giao hàng</h2>
            <p class="text-xs text-slate-500">Tìm kiếm, định vị GPS hoặc chấm trực tiếp lên bản đồ</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <XCircle class="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <!-- Nội dung -->
      <div class="p-5 space-y-4 overflow-y-auto">
        <!-- Thông báo trạng thái hỗ trợ vị trí -->
        <div
          v-if="statusBanner.text"
          :class="[
            'px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-all shadow-sm',
            statusBanner.type === 'info' ? 'bg-blue-50 border border-blue-200 text-blue-800' :
            statusBanner.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' :
            'bg-amber-50 border border-amber-200 text-amber-800'
          ]"
        >
          <div class="flex items-center gap-2 flex-1 mr-2">
            <span class="shrink-0 text-base">
              {{ statusBanner.type === 'success' ? '✅' : statusBanner.type === 'info' ? '📍' : '💡' }}
            </span>
            <span class="leading-relaxed">{{ statusBanner.text }}</span>
          </div>
          <button @click="statusBanner.text = ''" class="font-bold opacity-60 hover:opacity-100 text-base leading-none">&times;</button>
        </div>

        <!-- Thanh tìm kiếm & Định vị GPS -->
        <div class="relative">
          <div class="flex gap-2">
            <div class="relative flex-1">
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="searchQuery"
                @keyup.enter.prevent="searchAddress"
                type="text"
                placeholder="Nhập tên đường, phường, quận (VD: Phú Thọ Hòa, Tân Phú)..."
                class="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#308ce8] focus:bg-white outline-none transition-all"
              />
            </div>
            <button
              type="button"
              @click="searchAddress"
              :disabled="isSearching"
              class="px-4 h-11 bg-[#308ce8] hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 shrink-0"
            >
              {{ isSearching ? 'Đang tìm...' : 'Tìm' }}
            </button>
            <button
              type="button"
              @click="locateMe"
              :disabled="isLocating"
              title="Lấy vị trí hiện tại"
              class="px-3.5 h-11 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-bold inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
            >
              <Crosshair class="w-4 h-4" :class="{ 'animate-spin': isLocating }" />
              <span class="hidden sm:inline">{{ isLocating ? 'Đang dò...' : 'Vị trí tôi' }}</span>
            </button>
          </div>

          <!-- Danh sách kết quả tìm kiếm -->
          <div
            v-if="searchResults.length > 0"
            class="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-[500] max-h-52 overflow-y-auto divide-y divide-slate-100"
          >
            <button
              v-for="item in searchResults"
              :key="item.place_id"
              type="button"
              @click="selectSearchResult(item)"
              class="w-full text-left px-4 py-2.5 hover:bg-blue-50/70 transition-colors flex items-start gap-2.5"
            >
              <MapPin class="w-4 h-4 text-[#308ce8] shrink-0 mt-0.5" />
              <span class="text-xs sm:text-sm text-slate-700 line-clamp-2">{{ item.display_name }}</span>
            </button>
          </div>
        </div>

        <!-- Khung Bản đồ Leaflet -->
        <div class="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <div ref="mapContainer" class="w-full h-72 sm:h-80 z-0"></div>

          <!-- Thông báo đang dịch địa chỉ -->
          <div
            v-if="isResolvingAddress"
            class="absolute bottom-3 left-1/2 -translate-x-1/2 z-[400] bg-slate-900/80 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-sm"
          >
            Đang lấy tên địa chỉ...
          </div>
        </div>

        <!-- Ô xem trước & chỉnh sửa địa chỉ chi tiết -->
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <label class="text-sm font-bold text-slate-700">
              Địa chỉ nhận hàng chi tiết <span class="text-red-500">*</span>
            </label>
            <span class="text-[11px] text-slate-400">Có thể gõ bổ sung số nhà, hẻm, tầng...</span>
          </div>
          <textarea
            v-model="selectedAddress"
            rows="2"
            placeholder="VD: 123 Đường ABC, Phường Phú Thọ Hòa, Quận Tân Phú, TP. Hồ Chí Minh"
            class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#308ce8] focus:bg-white outline-none transition-all resize-none"
          ></textarea>
        </div>

        <!-- Nút hành động -->
        <div class="pt-2 flex gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 h-11 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-all"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            @click="confirmAddress"
            :disabled="isSaving || !selectedAddress.trim()"
            class="flex-[2] h-11 bg-[#308ce8] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#308ce8]/25 hover:bg-blue-600 disabled:opacity-50 transition-all"
          >
            {{ isSaving ? 'Đang lưu địa chỉ...' : 'Xác nhận lưu địa chỉ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, Crosshair, XCircle } from 'lucide-vue-next';

const props = defineProps({
  initialAddress: { type: String, default: '' },
  isSaving: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'save']);

const mapContainer = ref(null);
const searchQuery = ref('');
const searchResults = ref([]);
const selectedAddress = ref(props.initialAddress || '');
const statusBanner = ref({ type: '', text: '' });

const isSearching = ref(false);
const isLocating = ref(false);
const isResolvingAddress = ref(false);

// Tọa độ mặc định: Trung tâm TP. Hồ Chí Minh
const DEFAULT_LAT = 10.7769;
const DEFAULT_LNG = 106.7009;

let map = null;
let marker = null;

// Tạo icon ghim SVG tùy chỉnh để không bao giờ bị lỗi ảnh marker trên Vite
const createPinIcon = () =>
  L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        <svg viewBox="0 0 24 24" width="36" height="36" fill="#ec5b13" stroke="#ffffff" stroke-width="1.8" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,0.35));">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.7" fill="#ffffff" stroke="none"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 34]
  });

const setPinPosition = (lat, lng, shouldZoom = false) => {
  if (!map || !marker) return;
  marker.setLatLng([lat, lng]);
  map.setView([lat, lng], shouldZoom ? 16 : map.getZoom());
};

// Dịch tọa độ (lat, lng) sang địa chỉ tiếng Việt qua Nominatim
const reverseGeocode = async (lat, lng) => {
  isResolvingAddress.value = true;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=vi`;
    const res = await fetch(url);
    const data = await res.json();
    if (data?.display_name) {
      selectedAddress.value = data.display_name;
    }
  } catch (err) {
    console.error('Lỗi reverse geocoding:', err);
  } finally {
    isResolvingAddress.value = false;
  }
};

// Tìm kiếm địa chỉ ở Việt Nam
const searchAddress = async () => {
  const q = searchQuery.value.trim();
  if (!q) return;

  isSearching.value = true;
  searchResults.value = [];
  statusBanner.value = { type: '', text: '' };

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=vn&addressdetails=1&limit=5&accept-language=vi&q=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const data = await res.json();
    searchResults.value = Array.isArray(data) ? data : [];

    if (searchResults.value.length === 0) {
      if (!selectedAddress.value.trim()) {
        selectedAddress.value = q;
      }
      statusBanner.value = {
        type: 'warning',
        text: 'Chưa tìm thấy tọa độ cụ thể. Bạn có thể tự gõ số nhà vào ô "Địa chỉ chi tiết" bên dưới rồi bấm Lưu nhé!'
      };
    }
  } catch (err) {
    console.error('Lỗi tìm kiếm bản đồ:', err);
    if (!selectedAddress.value.trim()) {
      selectedAddress.value = q;
    }
    statusBanner.value = {
      type: 'warning',
      text: 'Không thể kết nối tìm kiếm bản đồ. Bạn có thể tự gõ địa chỉ vào ô bên dưới để lưu trực tiếp nhé!'
    };
  } finally {
    isSearching.value = false;
  }
};

const selectSearchResult = (item) => {
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lon);
  setPinPosition(lat, lng, true);
  selectedAddress.value = item.display_name;
  searchResults.value = [];
  statusBanner.value = { type: 'success', text: `Đã chọn: ${item.display_name}` };
};

// Dịch vụ IP Geolocation miễn phí (hỗ trợ HTTPS + CORS, không cần quyền trình duyệt)
const fetchLocationFromIp = async () => {
  // Service 1: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/');
    const data = await res.json();
    if (data && data.success && data.latitude && data.longitude) {
      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        city: data.city || data.region || 'khu vực của bạn'
      };
    }
  } catch (e) {
    console.warn('ipwho.is failed:', e);
  }

  // Service 2: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data && data.latitude && data.longitude) {
      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        city: data.city || data.region || 'khu vực của bạn'
      };
    }
  } catch (e) {
    console.warn('ipapi.co failed:', e);
  }

  // Service 3: freeipapi.com
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    const data = await res.json();
    if (data && data.latitude && data.longitude) {
      return {
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
        city: data.cityName || data.regionName || 'khu vực của bạn'
      };
    }
  } catch (e) {
    console.warn('freeipapi.com failed:', e);
  }

  return null;
};

// Định vị GPS hoặc ước lượng IP thông minh (không văng alert lỗi gián đoạn)
const locateMe = async () => {
  isLocating.value = true;
  statusBanner.value = {
    type: 'info',
    text: 'Đang xác định vị trí...'
  };

  let found = false;

  // 1. Thử qua Geolocation của trình duyệt trước (nếu thiết bị có GPS / Wi-Fi)
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 3500,
          maximumAge: 60000
        });
      });
      if (pos && pos.coords) {
        const { latitude, longitude } = pos.coords;
        setPinPosition(latitude, longitude, true);
        await reverseGeocode(latitude, longitude);
        statusBanner.value = {
          type: 'success',
          text: 'Đã định vị thành công vị trí hiện tại của bạn!'
        };
        found = true;
      }
    } catch (e) {
      console.warn('GPS thiết bị không khả dụng, chuyển sang IP fallback:', e);
    }
  }

  // 2. Nếu GPS không có (máy bàn, mạng LAN hoặc Windows chặn), tự động lấy qua mạng IP
  if (!found) {
    const ipLoc = await fetchLocationFromIp();
    if (ipLoc) {
      setPinPosition(ipLoc.lat, ipLoc.lng, true);
      await reverseGeocode(ipLoc.lat, ipLoc.lng);
      statusBanner.value = {
        type: 'info',
        text: `Đã tự động xác định vị trí theo mạng internet (${ipLoc.city}). Bạn có thể kéo thả ghim màu cam hoặc gõ thêm số nhà vào ô bên dưới nhé!`
      };
      found = true;
    }
  }

  // 3. Nếu cả hai đều không được (ngoại tuyến / mạng chặn)
  if (!found) {
    statusBanner.value = {
      type: 'warning',
      text: 'Thiết bị không hỗ trợ định vị tự động. Bạn chỉ cần gõ địa chỉ vào ô bên dưới rồi bấm "Xác nhận lưu địa chỉ" nhé!'
    };
  }

  isLocating.value = false;
};

const confirmAddress = () => {
  const trimmed = selectedAddress.value.trim();
  if (!trimmed) {
    alert('Vui lòng chọn hoặc nhập địa chỉ giao hàng!');
    return;
  }
  emit('save', trimmed);
};

onMounted(async () => {
  await nextTick();
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value).setView([DEFAULT_LAT, DEFAULT_LNG], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  marker = L.marker([DEFAULT_LAT, DEFAULT_LNG], {
    draggable: true,
    icon: createPinIcon()
  }).addTo(map);

  // Chấm bất kỳ đâu trên bản đồ -> di chuyển ghim & lấy địa chỉ
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    await reverseGeocode(lat, lng);
  });

  // Kéo thả ghim -> lấy địa chỉ mới
  marker.on('dragend', async () => {
    const { lat, lng } = marker.getLatLng();
    await reverseGeocode(lat, lng);
  });

  // Đảm bảo khung bản đồ render đủ kích thước bên trong Modal
  setTimeout(() => {
    map?.invalidateSize();
  }, 150);

  // Nếu tài khoản đã có sẵn địa chỉ thì tự động đưa bản đồ tới gần vị trí đó
  if (props.initialAddress?.trim()) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=vn&limit=1&q=${encodeURIComponent(props.initialAddress)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPinPosition(parseFloat(data[0].lat), parseFloat(data[0].lon), true);
      }
    } catch {
      // Bỏ qua nếu không định vị được địa chỉ cũ
    }
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>