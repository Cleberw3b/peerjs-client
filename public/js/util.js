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

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

async function expireOnTimeOut(func, timeout = 5000, delayCheck = 500) {
  let startTime = Date.now();
  let endTime = startTime + timeout;
  let timer = 0;
  let result = makeQuerablePromise(func());
  while (result.isPending()) {
    await sleep(delayCheck)
    timer += delayCheck;
    if (startTime + timer > endTime) {
      return new Error("Function has taken more than " + timeout + " seconds.");
    }
  }
  return result;
}

/**
 * This function allow you to modify a JS Promise by adding some status properties.
 * Based on: http://stackoverflow.com/questions/21485545/is-there-a-way-to-tell-if-an-es6-promise-is-fulfilled-rejected-resolved
 * But modified according to the specs of promises : https://promisesaplus.com/
 */
function makeQuerablePromise(promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise;

  // Set initial state
  var isPending = true;
  var isRejected = false;
  var isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function (v) {
      isFulfilled = true;
      isPending = false;
      return v;
    },
    function (e) {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );

  result.isFulfilled = function () { return isFulfilled; };
  result.isPending = function () { return isPending; };
  result.isRejected = function () { return isRejected; };
  return result;
}



module.exports.formatDate = formatDate;
module.exports.getIntFromDate = getIntFromDate;
module.exports.throttle = throttle;
module.exports.arrayRemoveItem = arrayRemoveItem;
module.exports.getRandomId = getRandomId;
module.exports.expireOnTimeOut = expireOnTimeOut;
module.exports.makeQuerablePromise = makeQuerablePromise;