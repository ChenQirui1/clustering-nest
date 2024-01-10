import { ClusteredMessage } from '../cluster.interface';
import { centroids, nearestPointsToCentroids } from './centroid';
test('find centroids', () => {
  const clusteredMessage: ClusteredMessage[] = [
    {
      clusterId: 1,
      messages: [
        { messageId: 1, embedding: [1, 2] },
        { messageId: 2, embedding: [3, 4] },
      ],
    },
    {
      clusterId: 2,
      messages: [
        { messageId: 4, embedding: [7, 8] },
        { messageId: 5, embedding: [9, 10] },
        { messageId: 6, embedding: [11, 12] },
      ],
    },
  ];

  console.log(centroids(clusteredMessage));
  expect(centroids(clusteredMessage)).toBeDefined();
});

test('get nearest centroid', () => {
  const clusteredMessage: ClusteredMessage[] = [
    {
      clusterId: 1,
      messages: [
        { messageId: 1, embedding: [1, 2] },
        { messageId: 2, embedding: [3, 4] },
      ],
    },
    {
      clusterId: 2,
      messages: [
        { messageId: 4, embedding: [7, 8] },
        { messageId: 5, embedding: [9, 10] },
        { messageId: 6, embedding: [11, 12] },
      ],
    },
  ];

  const centroids = [
    { clusterId: 1, embedding: [2, 3] },
    { clusterId: 2, embedding: [9, 10] },
  ];
  const messages = nearestPointsToCentroids(centroids, clusteredMessage);

  expect(messages).toBeDefined();
  console.log(messages);
});
