export const storageService = {
    saveToStorage,
    loadFromStorage,
};

function saveToStorage(key, val) {
    localStorage.setItem(key, val);
}

function loadFromStorage(key) {
    return localStorage.getItem(key);
}
