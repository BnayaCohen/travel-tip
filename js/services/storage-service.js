export const storageService = {
    saveToStorage,
    loadFromStorage,
};

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key);
    return JSON.parse(val);
}
