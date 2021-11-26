const express = require ('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bng2f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("myBag");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        const usersCollection = database.collection("users");

        // POST API ( add products)
        app.post('/products', async(req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
     
           })
        
        //POST API (place orders)
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })
        
        //POST API (post review)
            app.post('/review', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })
        
        //POST API (users info)
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //GET API (Is Admin)
        app.get('/users/:email', async(req, res) => {
           const email = req.params.email;
           const query = {email: email};
           const user = await usersCollection.findOne(query);
           let isAdmin = false;
           if(user?.role === 'admin') {
                isAdmin = true;
           }
           res.json({ admin: isAdmin}); 
        })
        //GET API (reviews)
        app.get('/review', async(req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.json(review);
        })
        //GET API (all products)
        app.get('/products', async(req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

         //GET API (single item)
         app.get('/items/:itemId', async(req, res) => {
            const id = req.params.itemId;
            const query = { _id: ObjectId(id)};
            const item = await productsCollection.findOne(query);
            res.json(item); 
         })

         //GET API (all orders)
         app.get('/allOrders', async (req, res) => {
             const cursor = ordersCollection.find({});
             const orders = await cursor.toArray();
             res.json(orders);
         })

         //Update API (Upsert)
         app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const options = {upsert: true};
            const updateDoc = {$set: user};
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
         })

         //Update API (make admin)
         app.put('/users/admin', async(req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: {role : 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
          })
         //DELETE API (orders delete)

         app.delete('/orders/:id', async(req, res) => {
             const id = req.params.id;
             const query = { _id: ObjectId(id)};
             const result = await ordersCollection.deleteOne(query);
             res.json(result);
         })

         app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })
         
        
           
        /*  //GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET Single Service
        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            // console.log("get specific service: ", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //DELETE API
        app.delete('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })  */

       
        }
        finally {
        // await client.close();
      }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Bag selling website')
});

app.listen(port, () => {
    console.log('listening to port', port);
});