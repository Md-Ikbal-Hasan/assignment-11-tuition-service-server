const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// for generate access token = require('crypto').randomBytes(64).toString('hex')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.b4ceuhb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const servicesCollection = client.db('tuitionService').collection('services');
        const reviewsCollection = client.db('tuitionService').collection('reviews');

        // get only 3 services from the database...............
        app.get('/', (req, res) => {
            res.send("api is running");
        })

        // get all the services from the database...................
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })


        // get a single service from the database...................
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })

        // create a services..................
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            res.send(result);
        })






    }

    finally {

    }
}

run().catch(error => console.error(error))





app.get('/test', (req, res) => {
    res.send("Tuition service server is running");
})

app.listen(port, () => {
    console.log(`Tuition service server is running on port ${port}`);
})