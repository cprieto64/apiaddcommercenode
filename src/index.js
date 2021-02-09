const express = require("express");
const app = express();

// Settings for Server
app.set("port", process.env.PORT || 3000);

// Starting MongoDB
const { MongoClient } = require("mongodb");
const { ObjectID } = require("mongodb");

// Middlewares
app.use(express.json());

// Mongo connect function
async function connect() {
  try {
    const client = await MongoClient.connect(
      "mongodb://localhost:27017/",
      { useUnifiedTopology: true },
      { useNewUrlParser: true }
    );
    const db = client.db("nodejs-restapi");   
    return db;        
  } catch (e) {
    console.log(e);
  } finally {
   console.log('Estoy en finally');
  }
}

// get all comercios
app.get("/comercios", async (req, res) => {
  const db = await connect();
  const result = await db.collection("comercio").find({}).toArray();  
  res.json(result);  
});

// addcomercio
app.post("/addcomercio", async (req, res) => {
  const db = await connect();
  const  {
    codigoUnico,
    comercio,
    terminal,
    usuario,
    idCommerce,
    idAcquirer,
    cvv2,
    pasarela,
    visa,
    amex,
    dinners,
    master,
    credencial,
  } = req.body;


  if (
    !codigoUnico || typeof codigoUnico === 'undefined' || codigoUnico === '' ||    
    !comercio || typeof comercio === 'undefined' || comercio === '' ||
    !terminal || typeof terminal === 'undefined' || terminal === '' ||
    !usuario || typeof usuario === 'undefined' || usuario === '' ||
    !idCommerce || typeof idCommerce === 'undefined' || idCommerce === '' ||
    !idAcquirer || typeof idAcquirer === 'undefined' || idAcquirer === '' ||
    !cvv2 || typeof cvv2 === 'undefined' || cvv2 === '' ||
    !pasarela || typeof !pasarela === 'undefined' || pasarela === '' ||
    !visa || typeof visa === 'undefined' || visa === '' ||
    !amex || typeof amex === 'undefined' || amex === '' ||
    !dinners || typeof dinners === 'undefined' || dinners === '' ||
    !master || typeof master === 'undefined' || master === '' ||
    !credencial || typeof credencial === 'undefined' || credencial === ''

  ) {
    res.status(400).json({
      message: "Missing fields for commerce creation.",
    });
  } else {
    const result = await db.collection("comercio").insertOne(req.body);
    res.json(result.ops[0]);
  }
});

//get comercio by ID
app.get("/comercio/:id", async (req, res) => {
  const { id } = req.params;
  const db = await connect();
  const result = await db.collection("comercio").findOne({ _id: ObjectID(id) });
  res.json(result);
});

// delete comercio by ID
app.delete("/comercio/:id", async (req, res) => {
  const { id } = req.params;
  const db = await connect();
  const result = await db
    .collection("comercio")
    .deleteOne({ _id: ObjectID(id) });
  res.json({
    message: `Comercio: ${id} Deleted`,
  });
});

// starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
