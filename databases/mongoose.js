
const mongoose = require('mongoose');

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(
        "mongodb+srv://nahyan:Nahyan123@cluster1.3un32rv.mongodb.net/sample?retryWrites=true&w=majority&appName=Cluster1",
        { serverApi: { version: '1', strict: true, deprecationErrors: true } }
    );
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB", error);
  }
}
run().catch(console.dir);
