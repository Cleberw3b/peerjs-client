import Peer from 'peerjs'

function arrayRemoveItem(array, item) {
  var index = array.indexOf(item);
  if (index < 0) return { error: 'item not found' };
  return array.splice(index, 1);;
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

function createPeer(id = null, options = null) {
  let peer = {}
  if (id && options) {
    peer = new Peer(id, options);
  } else if (options) {
    peer = new Peer(options);
  } else if (id) {
    peer = new Peer(id);
  } else {
    peer = new Peer();
  }
  console.log(peer);
  setPeer(peer);
}

module.exports.formatDate = formatDate;
module.exports.getIntFromDate = getIntFromDate;
module.exports.throttle = throttle;
module.exports.createPeer = createPeer;
module.exports.arrayRemoveItem = arrayRemoveItem;
