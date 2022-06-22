import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLocation = onDeleteLocation;

function onInit() {
    mapService
        .initMap()
        .then(() => {
            console.log('Map is ready');
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
            console.log('User position is:', pos.coords);
            document.querySelector(
                '.user-pos'
            ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
        })
        .catch((err) => {
            console.log('err!!!', err);
        });
}
function onPanTo(lat = 35.6895, lng = 139.6917) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}

function renderLocation(locations) {
    var strHtml = locations.map(
        (loc) =>
            `<li class="flex space-around">
        <p class="location-name" onclick="onPanTo(${(loc.lat, loc.lng)})">${
                loc.name
            }</p> 
        <button class="del-location-btn btn" onclick="onDeleteLocation('${
            loc.id
        }')">X</button>
    </li>`
    );
    document.querySelector('.location-list').innerHTML = strHtml.join('');
}

function onDeleteLocation(locationId) {
    locService.deleteLoc(locationId);
    _prepLocations();
}
function onCreateLoc(ev) {
    const name = prompt('enter place name');
    console.log(ev);
    const loc = {
        lat: ev.latLng.lat(),
        lng: ev.latLng.lng(),
    };
    locService.createLoc({ loc, name });
    mapService.addMarker(loc);
    _prepLocations();
}

window.onCreateLoc = onCreateLoc;

function _prepLocations() {
    locService.getLocs().then(renderLocation);
}
