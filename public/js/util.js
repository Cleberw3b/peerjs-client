function arrayRemoveItem(array, item) {
  var index = array.indexOf(item);
  if (index < 0) return { error: 'item not found' };
  return array.splice(index, 1);
}

function formatDate(date) {
  return date
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");
}

function getIntFromDate(date) {
  date = date.replace("T", "");
  date = date.replace("Z", "");
  date = date.replace(".", "");
  date = date.replace(/:/g, "");
  date = date.replace(/-/g, "");
  return parseInt(date);
}

function throttle(func, delay) {
  let inProgress = false;
  return (...args) => {
    if (inProgress) {
      return;
    }
    inProgress = true;
    func(...args); // Consider moving this line before the set timeout if you want the very first one to be immediate
    setTimeout(() => {
      inProgress = false;
    }, delay);
  };
}

function getRandomId() {
  let min = Math.ceil(10000000);
  let max = Math.floor(99999999);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.formatDate = formatDate;
module.exports.getIntFromDate = getIntFromDate;
module.exports.throttle = throttle;
module.exports.arrayRemoveItem = arrayRemoveItem;
module.exports.getRandomId = getRandomId;
