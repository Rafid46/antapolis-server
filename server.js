const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;
require("dotenv").config();
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DATABASE_URL;

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
    const animalCollection = client.db("antapolis").collection("animals");
    const categoryCollection = client.db("antapolis").collection("category");

    // animal lists
    app.get("/api/animals", async (req, res) => {
      try {
        const animals = await animalCollection.find().toArray();
        res.send(animals);
      } catch (error) {
        console.error("Error fetching animals:", error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to fetch animals" });
      }
    });

    // create animal
    app.post("/api/create-animals", async (req, res) => {
      try {
        const animal = req.body;
        const result = await animalCollection.insertOne(animal);
        res.status(201).json({
          status: "success",
          message: "animal created successfully",
          data: animal,
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "something wrong",
        });
        console.log(error);
      }
    });

    // category list
    app.get("/api/category", async (req, res) => {
      try {
        const category = await categoryCollection.find().toArray();
        res.send(category);
      } catch (error) {
        console.error("Error fetching category:", error);
        res
          .status(500)
          .json({ status: "error", message: "Failed to fetch category" });
      }
    });

    app.post("/api/create-category", async (req, res) => {
      try {
        const category = req.body;
        const result = await categoryCollection.insertOne(category);
        res.status(201).json({
          status: "success",
          message: "category created successfully",
          data: category,
        });
      } catch (error) {
        res.status(500).json({
          status: "error",
          message: "something wrong",
        });
        console.log(error);
      }
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("server is running on port 5000");
});
