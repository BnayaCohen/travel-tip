export const locService = {
    getLocs,
};
import { storageService } from './storage-service';

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

function createLoc(data) {
    const loc = {
        id: utilsService.makeId(),
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        weather: data.weather,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    // TODO: write functionallity
    // TODO: push locs to array
    // TODO: save to storage locs
}

function deleteLoc() {
    // TODO:write funcitonallity
}
