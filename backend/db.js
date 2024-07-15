const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();  // Load environment variables from .env file

const uri = process.env.MONGO_URI;  // Use the environment variable for the connection string

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Database and Collection Names
const dbName = 'testdb';
const collectionName = 'testcollection';

// Sample Data to Insert
const sampleData = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 35 }
];

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    console.log("Connected to MongoDB!");

    // Get a reference to the database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert sample data into the collection
    await collection.insertMany(sampleData);
    console.log('Data inserted');

    // Retrieve data from the collection
    const retrievedData = await collection.find({}).toArray();
    console.log('Data retrieved:', retrievedData);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
