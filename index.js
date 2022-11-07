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
        app.get('/', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
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


        // get all the reviews of a specific services
        app.get('/servicesreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: req.params.id };
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


        // get all the reviews of a specific user
        app.get('/userreviews', async (req, res) => {
            const email = req.query.email;
            console.log("email:", email);
            const query = { reviewerEmail: req.query.email };
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // create a review for services
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })



        // delete a single review from the database
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log("id=", id);
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        // update a single review from the database
        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log("id=", id);
            const updatedInfo = req.body;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    reviewText: updatedInfo.reviewText,
                    ratings: updatedInfo.ratings
                }
            }

            const result = await reviewsCollection.updateOne(query, updatedDoc);
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