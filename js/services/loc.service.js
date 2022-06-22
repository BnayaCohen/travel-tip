import { storageService } from './storage-service.js';
import { utilsService } from './utils-service.js';
export const locService = {
    getLocs,
    createLoc,
    deleteLoc,
};

const STORAGE_KEY = 'locsDB';

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
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
}

function deleteLoc(id) {
    const deletedIdx = locs.findIndex((loc) => loc.id === id);
    locs.splice(deletedIdx, 1);
    storageService.saveToStorage(STORAGE_KEY, locs);
}
