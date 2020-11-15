const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');

let db = null;
const url = 'mongodb://localhost:27017';
const dbName = 'chatbotdb';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(jsonParser);
app.use(urlencodedParser);

MongoClient.connect(
  url,
  { useUnifiedTopology: true, useNewUrlParser: true},
  function (err, client) {
    assert.equal(null, err);
    console.log("bd conectado...");

    db = client.db(dbName);
  });

app.listen(3000);
console.log('servidor rodando em: localhost:3000');


/*********************Janela do Chatbot**********************************************/

app.get("/chatbot", urlencodedParser, function (req, res) {
  try {
  
    objJSON = {};

    res.set("Content-Type", "text/html");
    const fs = require("fs");
    let data = fs.readFileSync("./chatbot.html", "utf8");

    res.send(data);
  } catch (e) {
    console.log({ error: "erro de requisição 1" });
  }
});
app.get("/index", urlencodedParser, function (req, res) {
  try {
    let code_user = -1;
    objJSON = {};
    

    res.set("Content-Type", "text/html");
    const fs = require("fs");
    let data = fs.readFileSync("./index.html", "utf8");

    res.send(data);
  } catch (e) {
    console.log({ error: "erro de requisição 2" });
  }
});



app.get("/chatbot/find", urlencodedParser, function (req, res) {
  try{
  let objJSON = {};

  if(req.query.input) objJSON.input = req.query.input; else objJSON.input = '';
  if (req.body.output) objJSON.output = req.body.output;
  findData(objJSON, function (result) {
    res.send(result);
  });
    }catch(e){
      
      console.log({error: 'erro de requisição 3'});
  };
});



const findData = function (objJSON, callback) {
  try {

    const collection = db.collection("chatbot");
    collection.find(objJSON).toArray(function (err, result) {
      assert.equal(null, err);
      callback(result);
    });
  } catch (e) {
    
    console.log({ error: "erro de requisição 4" });
  }
}


/*****************Salva pedido no bd************************ */
app.post("/chatbot/save", urlencodedParser, function (req, res) {
    let objJSON = {};
    if (req.query.pedido) objJSON.pedido = req.query.pedido;
    else objJSON.pedido = "";
    saveData(objJSON, function (result) {
      res.send(result);
    });
});

const saveData = function (objJSON, callback) {
    const collection = db.collection("documents");
    collection.insertOne(objJSON,function (err, result) {
      assert.equal(null, err);
      callback(result);
    });
};


