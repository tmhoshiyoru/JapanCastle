// 基本地圖設定：置中日本
const MAP_INIT = { lat: 36.2048, lng: 138.2529, zoom: 5 };
const DATA_URL = "./data/castles.json";


// 建立 Leaflet 地圖與底圖
const map = L.map("map", { zoomControl: true }).setView([MAP_INIT.lat, MAP_INIT.lng], MAP_INIT.zoom);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
maxZoom: 18,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// 兩個圖層群組（百名城 / 續百名城）
const layer100 = L.layerGroup().addTo(map);
const layer200 = L.layerGroup().addTo(map);


// 自訂圓點 icon（用 DivIcon）
function dotIcon(series) {
const cls = series === "100" ? "marker-100" : "marker-200";
return L.divIcon({ className: `leaflet-div-icon ${cls}`, html: `<div class="${cls}"></div>`, iconSize: [18,18], iconAnchor: [9,9] });
}


// 讀取資料並渲染
fetch(DATA_URL).then(r => r.json()).then(data => {
data.forEach(item => {
const marker = L.marker([item.lat, item.lng], { icon: dotIcon(item.series) })
.bindPopup(popupHTML(item));


if (item.series === "100") marker.addTo(layer100);
else marker.addTo(layer200);
});
});


function popupHTML(item) {
const tag = item.series === "100" ? "百名城" : "續百名城";
const link = item.official_url ? `<p><a href="${item.official_url}" target="_blank" rel="noopener">官方/參考連結</a></p>` : "";
return `
<div>
<strong>${item.name_ja}</strong> <span style="font-size:12px;color:#666">（${tag}）</span><br/>
<span style="font-size:12px;color:#666">${item.prefecture || ""} ${item.name_en ? "｜"+item.name_en : ""}</span>
${link}
</div>
`;
}


// 簡易圖層顯示切換（百/續）
const toggle100 = document.getElementById('toggle-100');
const toggle200 = document.getElementById('toggle-200');


toggle100.addEventListener('change', () => {
if (toggle100.checked) layer100.addTo(map); else map.removeLayer(layer100);
});


toggle200.addEventListener('change', () => {
if (toggle200.checked) layer200.addTo(map); else map.removeLayer(layer200);
});
