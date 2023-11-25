const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const cors = require('cors');


require('dotenv').config()


const port =process.env.PORT || 5000;
//middleware

app.use(cors());
app.use(express.json());

    ///aubonee22
   ///EkTyD5bgKF24Xq9g


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rns2r0a.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rns2r0a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

      
    const userCollection=client.db('emplyeeDb').collection('user');
    const taskCollection=client.db('emplyeeDb').collection('task');


////////////user related api
app.post('/users', async(req,res)=>{
  const user =req.body;
  const result =await userCollection.insertOne(user);
  res.send(result);
})
app.get('/users', async(req,res)=>{
  const result =await userCollection.find().toArray();
  res.send(result);
 
})
app.delete('/users/:id', async(req,res) =>  {
  const id=req.params.id;
    const query ={ _id: new ObjectId(id)};
    const result = await userCollection.deleteOne(query);
    res.send(result);
})

///////////employee detail
app.get('/employeeDetail/:id', async (req, res) => {
  const id  = req.params.id;
  const query = { _id: new ObjectId(id) }

const result = await userCollection.findOne(query);
  res.send(result);
  
})
/////////////////////worksheet
app.post('/worksheet', async(req,res)=>{
  const item =req.body;
  const result =await taskCollection.insertOne(item);
  res.send(result);
})
app.get('/worksheet', async(req,res)=>{
  const result =await taskCollection.find().toArray();
  res.send(result);
})
///////////////////////////////////////
//////update employee verification
app.get('/users/:id', async(req,res)=>{
  const id  = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result =await userCollection.findOne(query);
  res.send(result);
})

app.patch('/users/employee/:id',  async(req,res) =>  {
  const id=req.params.id;
  const filter ={ _id: new ObjectId(id)};
  const updatedDoc ={
    $set:{
      isVerified:'verified'
    }
   
  }
  const result  = await  userCollection.updateOne(filter,updatedDoc);
  res.send(result)
})
////////////////////////
// update employee to HR
app.patch('/users/hr/:id', async (req, res) => {
  const item = req.body;
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) }
  const updatedDoc = {
    $set: {
      role: 'hr',
      
    }
  }

  const result = await userCollection.updateOne(filter, updatedDoc)
  res.send(result);
})


    // Connect the client to the server	(optional starting in v4.7)
  //  await client.connect();
    // Send a ping to confirm a successful connection
   //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("site is running...");
  });
 


 
app.listen(port, () => {
    console.log(`employee managemnet is Running on port ${port}`);
  });
