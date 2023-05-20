const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT | 5000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${username}:${password}@cluster0.jgfyk2r.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const galleryCollection = client.db("robotopia01").collection("gallery");
    const allToysCollection = client.db("robotopia01").collection("toydata");

    app.get("/alltoys", async (req, res) => {
      const cursor = allToysCollection.find();
      const toyData = await cursor.toArray();
      res.send(toyData);
    });

    app.get("/gallery", async (req, res) => {
      const cursor = galleryCollection.find();
      const galleryData = await cursor.toArray();
      res.send(galleryData);
    });

    app.listen(port, () => {
      console.log(`listening to port ${port}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
