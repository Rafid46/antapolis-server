import { MongoClient } from "mongodb";

// Replace with your own MongoDB connection URI
const uri = process.env.DATABASE_URL || 5000;
let client;
let db;

const connectToDb = async () => {
  try {
    client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    db = client.db("antapolis"); // Replace with your database name
    console.log("Connected to MongoDB: antapolis");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDb first.");
  }
  return db;
};

export { connectToDb, getDb, client };
