function argmax(arr: number[]) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

function argmin(arr: number[]) {
  if (arr.length === 0) {
    return -1;
  }

  var min = arr[0];
  var minIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      minIndex = i;
      min = arr[i];
    }
  }

  return minIndex;
}
