const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// Middleware 
app.use(cors());
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lhwdfip.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnected() {
    try {
        const carsCollection = client.db('boosAuto').collection('allCar');
        const ordersCollection = client.db('boosAuto').collection('orders')

        app.get('/cars', async (req, res) => {
            const query = {};
            const cursor = carsCollection.find(query)
            const cars = await cursor.toArray()
            res.send(cars)
        });

        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const cars = await carsCollection.findOne(query)
            res.send(cars)
        });

        // orders api
        app.post('/orders', async (req, res) => {
            const query = req.body;
            const orders = await ordersCollection.insertOne(query);
            res.send(orders)
        });

        app.get('/orders', async (req, res) => {
            console.log(req.query)
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const deleteItem = await ordersCollection.deleteOne(query)
            res.send(deleteItem)
        });

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const status = req.body.status;
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const updateProduct = await ordersCollection.updateOne(query, updateDoc);
            res.send(updateProduct)
        })

    }
    finally {

    }
}
dbConnected().catch((error) => console.error(error))




app.get('/', (req, res) => {
    res.send('Boos auto server is running')
});

app.listen(port, () => {
    console.log(`Boos auto server is running on ${port}`);
});