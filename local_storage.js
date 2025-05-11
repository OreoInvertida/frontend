
const storage = {}

module.exports = {
  getItem(key) {
    return storage[key];
  },
  setItem(key, value) {
    storage[key] = value;
  }
}

