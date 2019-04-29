// This class exists only to give us an easy class
// name to search for in Chrome memory snapshots.
class Tracking {}

export async function load() {
  return new Promise(resolve => {
    const data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        id: i,
        name: `Item ${i}`,
      });
    }
    data.tracking = new Tracking();
    resolve(data);
  });
}