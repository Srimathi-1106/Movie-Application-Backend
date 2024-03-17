import express from "express"
import { MongoClient } from 'mongodb'
import { ObjectId } from "mongodb";

const app = express()

const url = "mongodb+srv://srimathi_1106:sri123@srimathip.zfeb5xf.mongodb.net/?retryWrites=true&w=majority&appName=SrimathiP";

const client = new MongoClient(url);
await client.connect();
console.log("MongoDB Connected Successfully!");

app.use(express.json());   // to check input obtained is in json format by middleware

app.get("/",function(request,response){
    response.send("Hello World");
})

app.post("/post",async function(request,response){
    const getPostman = request.body;
    const sendMethod =await client.db("CRUD").collection("data").insertOne(getPostman);
    response.send(sendMethod);
})

app.post("/postmany",async (req,res)=>{
    const getMany = req.body;
    const sendMethod = await client.db("CRUD").collection("data").insertMany(getMany);
    res.send(sendMethod); 
})

app.get("/get",async (req,res)=>{
    const getMethod=await client.db("CRUD").collection("data").find({}).toArray();
    res.send(getMethod);
})

app.get("/getone/:id",async (req,res) => {
    const {id} = req.params;
    const getMethod=await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    res.send(getMethod);
})

app.put("/update/:id",async(req,res)=>{
    const {id} =req.params;
    const getPostman = req.body;
    const updateMethod = await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getPostman});
    res.send(updateMethod);
})

app.delete("/delete/:id",async (req,res)=>{
    const {id}=req.params;
    const deleteMethod= await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
    res.send(deleteMethod);
})

app.listen(4000,()=>{
    console.log("Server is listening at port 4000");
})