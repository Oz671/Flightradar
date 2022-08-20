const { MongoClient } = require("mongodb");

let uri =
  `mongodb+srv://peleg122@gmail.com:8cyNhK47?p6Aw3(@bigmlproj.ix0tuj9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("flights");
    const ratings = database.collection("infoPlane");
    const cursor = ratings.find();
    await cursor.forEach(doc => console.dir(doc));
  } finally {
    await client.close();
  }
}
run().catch(console.dir);