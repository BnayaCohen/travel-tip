import { storageService } from './storage-service.js';
import { utilsService } from './utils-service.js';
export const locService = {
    getLocs,
    createLoc,
    deleteLoc,
    searchLoc,
};

const STORAGE_KEY = 'locsDB';

const locs = [
    {id:'1', name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    {id:'2', name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
];

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000);
    });
}

function createLoc({ lat, lng, name }) {
    const loc = {
        id: utilsService.makeId(),
        name,
        lat,
        lng,
        // weather: data.weather,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    locs.unshift(loc);
    storageService.saveToStorage(STORAGE_KEY, locs);
    return loc.id;
}

function getLocById(id){
    return locs.findIndex((loc) => loc.id === id);
}

function deleteLoc(id) {
    const deletedIdx = getLocById(id)
    locs.splice(deletedIdx, 1);
    storageService.saveToStorage(STORAGE_KEY, locs);
}

const API_KEY = 'AIzaSyAl-v0FWCCcT0o6UrjDE17w4NIVtAa9AAI';

function searchLoc(location) {
    return fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${API_KEY}`
    )
        .then((res) => res.json())
        .then((res) => ({
            lat: res.results[0].geometry.location.lat,
            lng: res.results[0].geometry.location.lng,
            name: res.results[0]['formatted_address'],
        }));
}
