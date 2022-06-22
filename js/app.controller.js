import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage-service.js';
window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLocation = onDeleteLocation;
window.onCopyLink = onCopyLink;

var gLastLoc

function onInit() {
    // const locs = storageService.loadFromStorage(helpers.STORAGE_KEY);
    mapService
        .initMap()
        .then(() => {
            const locs = storageService.loadFromStorage('locsDB');
            if (!locs || !locs.length) return;
            locs.forEach((loc) => {
                const cords = { lat: loc.lat, lng: loc.lng };
                return mapService.addMarker(cords, loc.id);
            });
            console.log('Map is ready');
            setLocationByQueryStringParams();
        })
        .catch(() => console.log('Error: cannot init map'));

    _prepLocations();
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
        document.querySelector('.locs').innerText = JSON.stringify(locs);
    });
}

function onGetUserPos() {
    getPosition()
        .then((pos) => {
            gLastLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Your Location' }
            mapService.addMarker({ lat: gLastLoc.lat, lng: gLastLoc.lat })
            onPanTo(gLastLoc.lat, gLastLoc.lng, gLastLoc.name)

        })
        .catch((err) => {
            console.log('err!!!', err);
        });

}
function onPanTo(lat, lng, name) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
    document.querySelector('.current-location').innerText =
        'Location: ' + name
    gLastLoc = { lat, lng, name }
}

function renderLocation(locations) {
    var strHtml = locations.map(
        (loc) =>
            `<li class="flex space-around">
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
function onCreateLoc(ev) {
    const name = prompt('enter place name');
    console.log(ev.latLng.lat());

    const lat = ev.latLng.lat();
    const lng = ev.latLng.lng();
    const loc = { lat, lng };
    const id = locService.createLoc({ lat, lng, name });
    mapService.addMarker(loc, id);
    _prepLocations();
}

window.onCreateLoc = onCreateLoc;
window.onSearchLoc = onSearchLoc;

function _prepLocations() {
    locService.getLocs().then(renderLocation);
}
function onSearchLoc(ev) {
    ev.preventDefault();
    const elInp = document.querySelector('[type="search"]');
    locService.searchLoc(elInp.value).then((res) => {
        mapService.panTo(res.lat, res.lng);
        const loc = {
            lat: res.lat,
            lng: res.lng,
            name: elInp.value,
        }
        const id = locService.createLoc(loc);
        mapService.addMarker(res, id);
        _prepLocations();
        gLastLoc = loc
        document.querySelector('.current-location').innerText =
            'Location: ' + gLastLoc.name
        elInp.value = '';
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

    if (!location.name) return;

    document.querySelector('.current-location').innerText =
        'Location: ' + location.name;
    mapService.panTo(location.lat, location.lng);
    mapService.addMarker(location.lat, location.lng);
}
