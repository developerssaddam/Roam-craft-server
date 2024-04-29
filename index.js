const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

// Init express
const app = express();
dotenv.config();

// Environment variables
const port = process.env.PORT || 9000;

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tourism-management-syste-e8d0a.web.app",
    ],
  })
);
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    console.log("MongoDB connection is successfull!".bgGreen.black);

    // Routes
    app.get("/", (req, res) => {
      res.send(`Tourism Management server is running on port : ${port}`);
    });

    // Create Tourist Spot Collection
    const touristspotCollection = client
      .db("touristSpotDB")
      .collection("touristspotCollection");

    // Create Tourist Spot countryCollection
    const touristSpotCountryCollection = client
      .db("touristSpotCountryDB")
      .collection("touristSpotCountryCollection");

    // GetAll Country Data.
    app.get("/touristspot/country", async (req, res) => {
      const allCountryData = touristSpotCountryCollection.find();
      const result = await allCountryData.toArray();
      res.send(result);
    });

    // GetAll Tourist Spot.
    app.get("/touristspot", async (req, res) => {
      const allTouristSpot = touristspotCollection.find();
      const result = await allTouristSpot.toArray();
      res.send(result);
    });

    // Get Single tourist spot.
    app.get("/touristspot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristspotCollection.findOne(query);
      res.send(result);
    });

    // Create Tourist Spot
    app.post("/touristspot/create", async (req, res) => {
      const data = req.body;
      const result = await touristspotCollection.insertOne(data);
      res.send(result);
    });

    app.put("/touristspot/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const newUpdatedData = {
        $set: {
          name: updateData.name,
          country_name: updateData.country_name,
          location: updateData.location,
          desc: updateData.desc,
          cost: updateData.cost,
          season: updateData.season,
          travel_time: updateData.travel_time,
          total_visitors: updateData.total_visitors,
          photo: updateData.photo,
        },
      };

      const result = await touristspotCollection.updateOne(
        query,
        newUpdatedData,
        options
      );

      res.send(result);
    });

    // DeleteTourist spot
    app.delete("/touristspot/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristspotCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// listen server
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`.bgMagenta.black);
});
