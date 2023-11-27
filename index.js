const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const jwt = require('jsonwebtoken');
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

      // jwt related api
  app.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.send({ token });
  })

  // middlewares 
  const verifyToken = (req, res, next) => {
    console.log('inside verify token', req.headers.authorization);
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'unauthorized access' })
      }
      req.decoded = decoded;
      next();
    })
  }
////////////////////verifyAdmin,VerifyHr,VerifyEmployee
  const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);
    const isAdmin = user?.role === 'admin';
    if (!isAdmin) {
      return res.status(403).send({ message: 'forbidden access' });
    }
    next();
  }




app.get('/users/admin/:email', verifyToken, async (req, res) => {
  const email = req.params.email;

  if (email !== req.decoded.email) {
    return res.status(403).send({ message: 'forbidden access' })
  }

  const query = { email: email };
  const user = await userCollection.findOne(query);
  let admin=false
  if (user) {
   admin = user?.role === 'admin';
  }
  res.send({ admin });
})


const verifyHr = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  const isHr = user?.role === 'hr';
  if (!isHr) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  next();
}

const verifyEmployee = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const user = await userCollection.findOne(query);
  const isEmployee = user?.role === 'employee';
  if (!isEmployee) {
    return res.status(403).send({ message: 'forbidden access' });
  }
  next();
}

app.get('/users/ahr/:email',verifyToken,  async (req, res) => {
  const email = req.params.email;

  if (email !== req.decoded.email) {
    return res.status(403).send({ message: 'forbidden access' })
  }

  const query = { email: email };
  const user = await userCollection.findOne(query);
  let hr = false;
  if (user) {
    hr = user?.role === 'hr';
  }
  res.send({ hr });
})

// app.get('/users/anemployee/:email', verifyToken, async (req, res) => {
//   const email = req.params.email;

//   if (email !== req.query.email) {
//     return res.status(403).send({ message: 'forbidden access' })
//   }

//   const query = { email: email };
//   const user = await userCollection.findOne(query);
//   let employee = false;
//   if (user) {
//     employee = user?.role === 'employee';
//   }
//   res.send({ employee });
// })

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
app.get('/employeeDetail/:id',  async (req, res) => {
  const id  = req.params.id;
  const query = { _id: new ObjectId(id) }

const result = await userCollection.findOne(query);
  res.send(result);
  
})
/////////////////////worksheet
app.post('/worksheet',  async(req,res)=>{
  const item =req.body;
  const result =await taskCollection.insertOne(item);
  res.send(result);
})

app.get('/worksheet',async(req,res)=>{
    const email=req.query.email;
    const query ={ email: email};
    const result =await taskCollection.find(query).toArray();
    res.send(result);
})
// app.get('/worksheet', async(req,res)=>{
//   const result =await taskCollection.find().toArray();
//   res.send(result);
// })

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
app.patch('/users/unverified/:id',  async(req,res) =>  {
  const id=req.params.id;
  const filter ={ _id: new ObjectId(id)};
  const updatedDoc ={
    $set:{
      isVerified:'unverified'
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
