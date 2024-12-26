export function generateRandomId(length = 9) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return array.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
}