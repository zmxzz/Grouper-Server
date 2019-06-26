module.exports.remove = function(arr, target) {
    let index = find(arr, target);
    if (index == -1) {
        return;
    }
    arr[index] = arr[arr.length - 1];
    arr.pop();
}

function find(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}