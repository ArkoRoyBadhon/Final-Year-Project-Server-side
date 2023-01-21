// Team member List : (Arko,Mehadi,Mahfuz)

const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 5005

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
        const bookedMarkCollection = client.db('finalYearProject').collection('bookedmarkitems');
        const productsCollection = client.db('finalYearProject').collection('products');
        const ordersCollection = client.db('finalYearProject').collection('orders');
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
            const email = req.query.email;
            console.log(email)
            const filter = { category: category }
            const productResult = await productsCollection.find(filter).toArray();
            const bookedMarkResult = await bookedMarkCollection.find({ email: email }).toArray();
            // console.log(productResult);
            // console.log(bookedMarkResult);
            const result = productResult.map(product => {
                let booked = false;
                bookedMarkResult.map(items => {
                    if (items.productId == product.productId) {
                        booked = true
                    }
                })
                if (booked == true) {
                    const newData = {
                        ...product,
                        bookedMark: true
                    }
                    return newData
                }
                else {
                    const newData = {
                        ...product,
                        bookedMark: false
                    }
                    return newData
                }

            })
            res.send(result);
        })
        app.get('/allitems', async (req, res) => {
            const email = req.query.email
            const filter = { authorEmail: email }
            const result = await productsCollection.find(filter).toArray();
            res.send(result);
        })

        app.put('/managebookedmarkitems', async (req, res) => {
            const insertData = req.body;
            const check = await bookedMarkCollection.findOne({ productId: insertData.productId, email: insertData.email });
            if (check == null) {
                const addResult = await bookedMarkCollection.insertOne(insertData);
                res.send({ status: 'Successfully Added bookedMark', code: 'add' })
            }
            else {
                const deleteResult = await bookedMarkCollection.deleteOne({ productId: insertData.productId, email: insertData.email });
                res.send({ status: 'Successfully Remove bookedMark', code: 'remove' })
            }
            console.log(check)
        })
        app.get('/mybookedmark', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const productResult = await productsCollection.find({}).toArray();
            const bookedMarkResult = await bookedMarkCollection.find({ email: email }).toArray();
            // console.log(productResult);
            // console.log(bookedMarkResult);
            const mResult = []
            const result = productResult.map(product => {
                let booked = false;
                bookedMarkResult.map(items => {
                    if (items.productId == product.productId) {
                        booked = true
                    }
                })
                if (booked == true) {
                    const newData = {
                        ...product,
                        bookedMark: true
                    }
                    mResult.push(newData)

                }
            })
            res.send(mResult);
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const result = await productsCollection.findOne({ productId: id });
            res.send(result);
        })
        app.get('/editproduct/:id', async (req, res) => {
            const id = req.params.id;
            const email = req.query.email;
            const result = await productsCollection.findOne({ productId: id, authorEmail: email });
            if (result) {
                res.send(result);
            }
            else {
                res.send({ code: 'No' })
            }
        })
        app.put('/editproduct', async (req, res) => {
            const data = req.body;
            const filter = {
                productId: data.productId,
                authorEmail: data.authorEmail
            }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: data.name,
                    photo: data.photo,
                    originalPrice: data.originalPrice,
                    price: data.price,
                    description: data.description,
                    company: data.company,
                    location: data.location,
                    category: data.category,
                    productId: data.productId,
                    authorName: data.authorName,
                    authorEmail: data.authorEmail
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })
        app.post('/getcartitems', async (req, res) => {
            const idList = req.body;
            const cartProducts = await productsCollection.find({ productId: { $in: [...idList] } }).toArray()
            const products = cartProducts.map(p => {
                return { ...p, quantity: 1 }
            })
            console.log(products)
            res.send(products)
        })

        app.post('/placeorder', async (req, res) => {
            const data = req.body;
            const productList = data.cartItems.map(item => {
                return {
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    tPrice: item.quantity * item.price,
                    orderPersonEmail: data.orderPersonEmail,
                    orderDate: data.orderDate,
                    authorEmail: item.authorEmail
                }
            }
            )

            const insertResult = await ordersCollection.insertMany(productList);
            res.send(insertResult);
        })
        app.get('/myorders', async (req, res) => {
            const email = req.query.email;
            const result = await ordersCollection.find({ orderPersonEmail: email }).toArray();
            let idList = []
            const productIdList = result.map(item => {
                if (idList.includes(item.productId) === false) {
                    idList.push(item.productId)
                }
            })
            const productList = await productsCollection.find({ productId: { $in: [...idList] } }).toArray()
            const finalResult = result.map(item => {
                let data = {};
                productList.map(product => {
                    if (product.productId == item.productId) {
                        data = {
                            productInfo: product,
                            orderInfo: item
                        }
                    }
                })

                return data
            })
            // console.log(finalResult);
            res.send(finalResult)
        })

        app.get('/allorders', async (req, res) => {
            const email = req.query.email;
            let result;
            if (email) {
                result = await ordersCollection.find({ authorEmail: email }).toArray();
            }
            else {
                result = await ordersCollection.find({}).toArray();
            }
            let idList = []
            const productIdList = result.map(item => {
                if (idList.includes(item.productId) === false) {
                    idList.push(item.productId)
                }
            })
            const productList = await productsCollection.find({ productId: { $in: [...idList] } }).toArray()
            const finalResult = result.map(item => {
                let data = {};
                productList.map(product => {
                    if (product.productId == item.productId) {
                        data = {
                            productInfo: product,
                            orderInfo: item
                        }
                    }
                })

                return data
            })
            // console.log(finalResult);
            res.send(finalResult)
        })
        app.put('/manageadmin', async (req, res) => {
            const data = req.body;
            const filter = {
                _id: ObjectId(data.id)
            }
            const options = { upsert: true };

            if (data.action == 'add') {
                const updatedDoc = {
                    $set: {
                        role: 'admin',
                    }
                }
                const result = await userCollection.updateOne(filter, updatedDoc, options)
                res.send(result);
            }
            else if (data.action = 'remove') {
                const updatedDoc = {
                    $set: {
                        role: 'normalUser',
                    }
                }
                const result = await userCollection.updateOne(filter, updatedDoc, options)
                res.send(result);
            }
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

