const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const port = 5000;
// const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = process.env.MONGO_URI;
// require('dotenv').config()

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-swu9d.mongodb.net/burjAlArab?retryWrites=true&w=majority`;
// const port = 5000


 

var serviceAccount = require("./hotel-book-41493-firebase-adminsdk-avts0-2df463733a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express()

app.use(cors());
app.use(bodyParser.json());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    console.log("Db Connected");

    // post
    // send data on database 

    app.post('/addBooking', (req, res) => {
      
      const newBooking=req.body;
      
      
      // send data on database 
      collection.insertOne(newBooking)
        .then(result => {
          console.log(result);
          res.send(result.insertedCount>0)
        })
      
    })
  
  app.get('/bookings', (req, res) => {
    const bearer=req.headers.authorization
    if (bearer && bearer.startsWith("Bearer"+" ")) {
      const idToken = bearer.split(' ')[1];
      admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uemail = decodedToken.email;
    const qemail=req.query.email
    console.log("user email ",uemail);
    console.log("query email ",qemail);
    if (uemail == qemail) {
       collection.find({email:qemail})
      .toArray((err, docs) => {
      res.send(docs)
    })
    }
    
    else {
      res.status(401).send('unathorized access')
      
 }    
    // ...
  })
  .catch((error) => {
    // Handle error
      res.status(401).send('unathorized access')

  });
   }
    // idToken comes from the client app
    else {
      res.status(401).send('unathorized access')
}
   
  })
   


});
 

app.listen(port);