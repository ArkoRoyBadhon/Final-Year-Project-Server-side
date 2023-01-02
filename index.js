const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 5000

// middle ware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.et115mk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const districtCollection = client.db('finalYearProject').collection('districts')
        const upazilaCollection = client.db('finalYearProject').collection('upazila')
        const LinkCollection = client.db('finalYearProject').collection('GovLinks')
        const userCollection = client.db('finalYearProject').collection('userInfo');
        const productsCollection = client.db('finalYearProject').collection('products');

        app.get('/district/:category', async (req, res) => {
            const cate = req.params.category;
            // console.log("cat",cate);
            const query = { category: cate }
            // const query = {}
            const result = await districtCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/upazila/:category', async (req, res) => {
            const cate = req.params.category;
            // console.log("cat",cate);
            const query = { category: cate }
            // const query = {}
            const result = await upazilaCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/links/:upazila', async (req, res) => {
            const cate = req.params.upazila;
            // console.log("cat",cate);
            const query = { category: cate }
            // const query = {}
            const result = await LinkCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/userinfo', async (req, res) => {
            const userInfo = req.body;
            const filter = {}
            const result = await userCollection.insertOne(userInfo);
            res.send(result);
        })

        app.get('/userinfo/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email }
            const result = await userCollection.find(filter).toArray();
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            // const email = req.params.email;
            const filter = {}
            const result = await userCollection.find(filter).toArray();
            res.send(result);
        })
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(filter);
            res.send(result);
        })
        app.post('/addItem', async (req, res) => {
            const userInfo = req.body;
            // const filter = {}
            const result = await productsCollection.insertOne(userInfo);
            res.send(result);
        })
        app.get('/items/:category', async (req, res) => {
            const category = req.params.category;
            const filter = {category: category}
            const result = await productsCollection.find(filter).toArray();
            res.send(result);
        })
        app.get('/allitems', async (req, res) => {
            // const category = req.params.category;
            const filter = {}
            const result = await productsCollection.find(filter).toArray();
            res.send(result);
        })
    }
    catch {

    }
    finally {

    }
}


run().catch(console.log())


app.get('/', (req, res) => {
    res.send("Arko Roy")
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})

