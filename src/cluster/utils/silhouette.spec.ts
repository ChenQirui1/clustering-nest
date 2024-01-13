import { euDistance } from './scoring';
import {
  silhouetteCoeff,
  silhouetteCoeffPerPoint,
  calculateDistanceAgainstPoints,
  inOutDistancePerPoint,
  testRun,
} from './silhouette';

test('silhoutteCoeff per point', () => {
  const a = 1.4142135623730951;
  const b = 8.48528137423857;
  const score = silhouetteCoeffPerPoint(a, b);
  console.log(score);
  expect(score).toBeDefined();
  expect(score).toBeLessThan(1);
  expect(score).toBeGreaterThan(-1);
});

// test('closest clusters', () => {
//   const centroids = [
//     { clusterId: 1, embedding: [2, 3] },
//     { clusterId: 2, embedding: [9, 10] },
//   ];
//   const message: Message = { messageId: 1, embedding: [1, 2] };

//   const closestClusters = closestCluster(centroids, message);
//   console.log(closestClusters);
//   expect(closestClusters).toBeDefined();
//   expect(closestClusters.length).toBe(2);
// });

test('distance against points', () => {
  const point = [1, 2];
  const embeddings = [
    [2, 3],
    [3, 4],
  ];
  const distance = calculateDistanceAgainstPoints(point, embeddings);

  console.log(distance);
  expect(distance).toBeDefined();
});

test('in out distance per point', () => {
  const point = [3, 4];

  const clusteredMessage = [
    [
      [1, 2],
      [3, 4],
    ],

    [
      [7, 8],
      [9, 10],
      [11, 12],
    ],
  ];

  console.log(inOutDistancePerPoint(point, clusteredMessage));

  expect(inOutDistancePerPoint(point, clusteredMessage)).toBeDefined();
});

test('score total', () => {
  const clusteredMessage = [
    [
      [1, 2],
      [3, 4],
    ],
    [
      [7, 8],
      [9, 10],
      [11, 12],
    ],
  ];

  const score = silhouetteCoeff(clusteredMessage);
  console.log(score);
  expect(score).toBeDefined();
  expect(score).toBeLessThan(1);
  expect(score).toBeGreaterThan(-1);
});

test('silhouette test', () => {
  const clusteredMessage = [
    [
      [1, 2],
      [3, 4],
    ],

    [
      [7, 8],
      [9, 10],
      [11, 12],
    ],
  ];

  const score = silhouetteCoeff(clusteredMessage);

  const test = testRun(clusteredMessage, 0.2);

  console.log(test);
});

test('eudistance', () => {
  const distances = [
    [1, 1],
    [2, 2],
  ];

  console.log(euDistance([2, 2], [1, 1]));
});
