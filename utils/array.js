module.exports.remove = function(arr, target) {
    let index = find(arr, target);
    if (index == -1) {
        return;
    }
    arr[index] = arr[arr.length - 1];
    arr.pop();
};

module.exports.removeAll = function(arr, target) {
    let filtered = arr.filter((value, index, arr) => {
        return value + '' !== target;
    });
    console.log(filtered.length);
    return filtered;
};

module.exports.removeFriends = function(friendList, friendRequestList) {
    let filtered = friendRequestList.filter((value, index, arr) => {
        return !friendList.includes(value);
    });
    return filtered;
};

function find(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
};