import { storageService } from './storage-service.js';

export const mapService = {
    initMap,
    addMarker,
    panTo,
    deleteMarker,
};
const gMarkers = [];
var gMap;
function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    storageService.saveToStorage();
    return _connectGoogleApi().then(() => {
        console.log('google available');
        gMap = new google.maps.Map(document.querySelector('#map'), {
            center: { lat, lng },
            zoom: 15,
        });
        console.log('Map!', gMap);
        gMap.addListener('click', onOpenModal);
    });
}

function addMarker(loc, id) {
    const marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
    });
    marker.id = id;
    gMarkers.unshift(marker);
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    const API_KEY = 'AIzaSyAl-v0FWCCcT0o6UrjDE17w4NIVtAa9AAI'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}

function deleteMarker(id) {
    const marker = gMarkers.find((marker) => marker.id === id);
    if (!marker) return;
    marker.setMap(null);
}
