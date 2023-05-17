require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

//---------------------------------------------
//                Mongodb Start
//---------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p87lrd6.mongodb.net/?retryWrites=true&w=majority`;

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
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );

      // collections
      const userCollection = client.db("toys-house").collection("users");
      const toysCollection = client.db("toys-house").collection("toys");

      //<|---------------- Routes Start ------------------|>//
      app.get("/toys", async (req, res) => {
         const result = await toysCollection.find().toArray();
         res.send(result);
      });
      //<|---------------- Routes End ------------------|>//
   } catch {
      console.log("Mongodb error");
   }
}
run().catch(console.dir);
// --------------------------------------------
//                Mongodb End
//---------------------------------------------

// root route
app.get("/", (req, res) => {
   res.send(`<h1>Toys House is Running...</h1>`);
});

// Listen Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
   console.log(`SERVER IS RUNNING AT http://localhost:${port}`);
});
