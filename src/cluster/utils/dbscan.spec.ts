import { Dbscan } from './dbscan';
describe('Dbscan', () => {
  let dbscan: Dbscan;

  beforeEach(() => {
    dbscan = new Dbscan();
  });

  describe('generateCluster', () => {
    it('should return an array of clusters containing index of data', async () => {
      const dataset = [
        [1, 1],
        [0, 1],
        [1, 0],
        [10, 10],
        [10, 13],
        [13, 13],
        [54, 54],
        [55, 55],
        [89, 89],
        [57, 55],
      ];
      const result = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 9],
      ];
      const noise = [8];

      const received = dbscan.generate(dataset);

      expect(dbscan.generate(dataset)).toEqual(result);
      expect(dbscan.getOutliers()).toEqual(noise);
    });
  });
});
