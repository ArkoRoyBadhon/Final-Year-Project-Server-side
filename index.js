const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


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

        app.get('/district/:category', async (req, res) => {
            const cate = req.params.category;
            // console.log("cat",cate);
            const query = {category: cate}
            // const query = {}
            const result = await districtCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/upazila/:category', async (req, res) => {
            const cate = req.params.category;
            // console.log("cat",cate);
            const query = {category: cate}
            // const query = {}
            const result = await upazilaCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/links/:upazila', async (req, res) => {
            const cate = req.params.upazila;
            // console.log("cat",cate);
            const query = {category: cate}
            // const query = {}
            const result = await LinkCollection.find(query).toArray();
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

