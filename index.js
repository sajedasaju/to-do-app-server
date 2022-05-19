const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjboc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todo").collection('task');


        // //get task id wise
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const task = await taskCollection.findOne(query);

            res.send(task)
        })



        // // find all task
        app.get('/task', async (req, res) => {
            const query = req.query
            const cursor = taskCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)

        })


        //delete single task
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);

            res.send(result)

        })

        //post or add task
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })


        // //update user
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updatedTask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updatedTask.name,
                    description: updatedTask.description,
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("to do server running")
})

app.listen(port, () => {
    console.log("to do running on port", port)
})