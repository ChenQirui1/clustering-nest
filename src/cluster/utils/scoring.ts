function silhoutteCoeffPerPoint(target: number[], pointsInCluster: number[][]) {
  const distanceFromTarget = pointsInCluster.map((x) => euDistance(target, x));

  const meanDistFromTarget =
    distanceFromTarget.reduce((a, b) => a + b, 0) / distanceFromTarget.length;

  return meanDistFromTarget;
}

function meanDistFromTarget(target: number[], pointsInCluster: number[][]) {
  const distanceFromTarget = pointsInCluster.map((x) => euDistance(target, x));

  const meanDistFromTarget =
    distanceFromTarget.reduce((a, b) => a + b, 0) / distanceFromTarget.length;

  return meanDistFromTarget;
}

function euDistance(a: number[], b: number[]) {
  const distance = Math.hypot(...Object.keys(a).map((k) => b[k] - a[k]));
  return distance;
}
