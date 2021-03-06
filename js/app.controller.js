import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
// import { storageService } from './services/storage-service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLocation = onDeleteLocation;
window.onCopyLink = onCopyLink;
document.querySelector('.create-location').onsubmit = onCreateLoc;

let gLastLoc;
let gLastMapClick;

function onInit() {
    // const locs = storageService.loadFromStorage(helpers.STORAGE_KEY);
    mapService.initMap()
    locService
        .getLocs()
        .then((locs) => {
            locs.forEach((loc) => {
                const cords = { lat: loc.lat, lng: loc.lng };
                mapService.addMarker(cords, loc.id);
            });
            console.log('Map is ready');
            setLocationByQueryStringParams();
            renderLocation(locs);
            // _prepLocations();
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs().then((locs) => {
        console.log('Locations:', locs);
        // document.querySelector('.locs').innerText = JSON.stringify(locs);
    });
}

function onGetUserPos() {
    getPosition()
        .then(({ coords:
            { latitude, longitude }
        }) => {
            // gLastLoc = {
            //     lat: pos.coords.latitude,
            //     lng: pos.coords.longitude,
            //     name: 'Your Location',
            // };
            const name = 'Your Location'
            const id = locService.createLoc({
                lat: latitude,
                lng: longitude,
                name,
            });
            // console.log();
            mapService.addMarker({ lat: latitude, lng: longitude }, id);
            onPanTo(latitude, longitude, name);
            _prepLocations();
        })
        .catch((err) => {
            console.log('err!!!', err);
        });
}
function onPanTo(lat, lng, name) {
    // console.log(lat, lng);
    // console.log('Panning the Map');
    mapService.panTo(lat, lng);
    document.querySelector('.current-location').innerText = 'Location: ' + name;
    gLastLoc = { lat, lng, name };
    locService.getWeatherLoc(gLastLoc);
}

function renderLocation(locations) {
    var strHtml = locations.map(
        (loc) =>
            `<li class="flex space-between">
        <p class="location-name">${loc.name}</p> 
            <button class="go-to-location-btn btn" onclick="onPanTo(${loc.lat},${loc.lng},'${loc.name}')">GO</button>
        <button class="del-location-btn btn" onclick="onDeleteLocation('${loc.id}')">X</button>
    </li>`
    );
    document.querySelector('.location-list').innerHTML = strHtml.join('');
}

function onDeleteLocation(locationId) {
    locService.deleteLoc(locationId);
    mapService.deleteMarker(locationId);
    _prepLocations();
}

function onOpenModal(ev) {
    const lat = ev.latLng.lat();
    const lng = ev.latLng.lng();
    gLastMapClick = {
        lat,
        lng,
    };
    document.body.classList.add('open-modal');
}

function onCloseModal() {
    document.body.classList.remove('open-modal');
}

function onCreateLoc(ev) {
    ev.preventDefault();
    const name = document.querySelector('[type="text"]').value;

    if (!name) onCloseModal();

    const lat = gLastMapClick.lat;
    const lng = gLastMapClick.lng;
    const loc = { lat, lng };
    const id = locService.createLoc({ lat, lng, name });
    mapService.addMarker(loc, id);
    _prepLocations();
    onCloseModal();
}

window.onOpenModal = onOpenModal;
window.onCloseModal = onCloseModal;
window.onCreateLoc = onCreateLoc;
window.onSearchLoc = onSearchLoc;

function _prepLocations() {
    locService.getLocs().then(renderLocation);
}
function onSearchLoc(ev) {
    ev.preventDefault();
    const elInput = document.querySelector('[type="search"]');
    locService.searchLoc(elInput.value).then((res) => {
        mapService.panTo(res.lat, res.lng);
        const loc = {
            lat: res.lat,
            lng: res.lng,
            name: elInput.value,
        };
        const id = locService.createLoc(loc);
        mapService.addMarker(res, id);
        _prepLocations();
        gLastLoc = loc;
        document.querySelector('.current-location').innerText =
            'Location: ' + gLastLoc.name;
        elInput.value = '';
    });
}

function onCopyLink() {
    const queryStringParams = `?name=${gLastLoc.name}&lat=${gLastLoc.lat}&lng=${gLastLoc.lng}`;
    const newUrl =

        'https://bnayacohen.github.io/travel-tip/' + queryStringParams;
    navigator.clipboard.writeText(newUrl);
}

function setLocationByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search);
    console.log(queryStringParams);
    const location = {
        name: queryStringParams.get('name') || '',
        lat: +queryStringParams.get('lat') || 0,
        lng: +queryStringParams.get('lng') || 0,
    };

    if (!location.lat || !location.lng) return;

    document.querySelector('.current-location').innerText = location.name
        ? 'Location: ' + location.name
        : 'Location:';
    mapService.panTo(location.lat, location.lng);
    mapService.addMarker({lat:location.lat, lng:location.lng});
}
