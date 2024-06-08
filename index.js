import express from "express";
import path from "path";
import { MongoClient, ObjectId } from 'mongodb';
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// Load environment variables from custom file
dotenv.config({ path: './secret.env' });
 // Automatically loads environment variables from .env

const app = express();

// Use environment variables for sensitive information
const url = process.env.MONGODB_URL;
const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const auth = (req, res, next) => {
    try {
        const token = req.header("backend-token"); // keyname, assign value as token
        jwt.verify(token, jwtSecret);
        next();
    } catch (error) {
        res.status(401).send({ message: error.message });
    }
};

// Connect to MongoDB
async function main() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log('MongoDB Connected successfully to server');

        // Define routes
        app.get('/', (req, res) => {
            res.status(200).send("Hello World!");
        });

        app.get('/get1', (req, res) => {
            res.status(201).send("sdfghjh");
        });

        app.post('/post', async (req, res) => {
            const getPostman = req.body;
            const sendMethod = await client.db("CURD").collection("data").insertOne(getPostman);
            res.status(200).send(sendMethod);
        });

        app.post('/postmany', async (req, res) => {
            const getPostman = req.body;
            const sendMethod = await client.db("CURD").collection("data").insertMany(getPostman);
            res.status(200).send(sendMethod);
        });

        app.get('/get', async (req, res) => {
            const getdata = await client.db("CURD").collection("data").find({}).toArray();
            res.status(200).send(getdata);
        });

        app.get('/getone/:id', async (req, res) => {
            const { id } = req.params;
            const getdata = await client.db("CURD").collection("data").findOne({ _id: new ObjectId(id) });
            res.status(200).send(getdata);
        });

        // Update
        app.put('/update/:id', async (req, res) => {
            const { id } = req.params;
            const getpostman = req.body;
            const updatedata = await client.db("CURD").collection("data").updateOne({ _id: new ObjectId(id) }, { $set: getpostman });
            res.status(201).send(updatedata);
        });

        // Delete
        app.delete('/delete/:id', async (req, res) => {
            const { id } = req.params;
            const deletedata = await client.db("CURD").collection("data").deleteOne({ _id: new ObjectId(id) });
            res.status(200).send(deletedata);
        });

        app.post("/register", async (req, res) => {
            const { username, email, password } = req.body;
            const userfind = await client.db("CURD").collection("registerdata").findOne({ email: email });
            if (!userfind) {
                const salt = await bcrypt.genSalt(10);
                const encrypt = await bcrypt.hash(password, salt);
                const registerData = await client.db("CURD").collection("registerdata").insertOne({ name: username, email: email, password: encrypt });
                res.status(201).send(registerData);
            } else {
                res.status(400).send("User already registered");
            }
        });

        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            const userfind = await client.db("CURD").collection("registerdata").findOne({ email: email });
            if (userfind) {
                const mongopass = userfind.password;
                const check = await bcrypt.compare(password, mongopass);
                if (check) {
                    const token = jwt.sign({ id: userfind._id }, jwtSecret); // jwt token with secret
                    res.status(200).send({ token: token });
                } else {
                    res.status(400).send({ message: "Not Verified user" });
                }
            } else {
                res.status(400).send({ message: "User not Found" });
            }
        });

        // Start the server
        app.listen(4000, () => {
            console.log("Server is running on http://localhost:4000");
        });

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

main();




// import express from "express"
// import { MongoClient } from 'mongodb'
// import { ObjectId } from "mongodb";
// import cors from "cors";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const app = express()

// const url = "mongodb+srv://srimathi_1106:sri123@srimathip.zfeb5xf.mongodb.net/?retryWrites=true&w=majority&appName=SrimathiP";

// const client = new MongoClient(url);
// await client.connect();
// console.log("MongoDB Connected Successfully!");

// app.use(express.json());   // to check input obtained is in json format by middleware
// app.use(cors())

// const auth = (request,response,next)=>{
//     try{
//         const token=request.header("backend-token"); // backend-token is keyname
//         jwt.verify(token,"student");
//         next();
//     }
//     catch(error){
//         response.status(401).send({message:error.message});
//     }
// }

// app.get("/",function(request, response){
//     response.status(200).send("Hello World");
// })

// app.post("/post",async function(request,response){
//     const getPostman = request.body;
//     const sendMethod =await client.db("CRUD").collection("data").insertOne(getPostman);
//     response.status(201).send(sendMethod);
// })

// app.post("/postmany",async (req,res)=>{
//     const getMany = req.body;
//     const sendMethod = await client.db("CRUD").collection("data").insertMany(getMany);
//     res.status(201).send(sendMethod); 
// })

// app.get("/get", auth,async (req, res)=>{
//     const getMethod=await client.db("CRUD").collection("data").find({}).toArray();
//     res.status(200).send(getMethod);
// })

// app.get("/getone/:id",async (req,res) => {
//     const {id} = req.params;
//     const getMethod=await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
//     res.status(200).send(getMethod);
// })

// app.put("/update/:id",async(req,res)=>{
//     const {id} =req.params;
//     const getPostman = req.body;
//     const updateMethod = await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getPostman});
//     res.status(201).send(updateMethod);
// })

// app.delete("/delete/:id",async (req,res)=>{
//     const {id}=req.params;
//     const deleteMethod= await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
//     res.status(200).send(deleteMethod);
// })

// app.post("/register",async function(request,response){
//     const {username,email,password}=request.body;
//     const userFind=await client.db("CRUD").collection("private").findOne({email:email});
//     if(userFind){
//         response.status(400).send("Existing User");
//     }
//     else{
//         const salt= await bcrypt.genSalt(10);     // 10 times hashing will be done to make it hard
//         const hashedPassword= await bcrypt.hash(password,salt);  // 201-creation , 200-ok 400-bad request
//         console.log(hashedPassword); //$2b$10$qszgvt9Wq0FKx1tmlRh55.K5pX61OmCtWhbMtBEhdlNQ4q0XtkvTy
//         const registerMethod= await client.db("CRUD").collection("private").insertOne({username:username,email:email,password:hashedPassword}); //key:value
//         response.status(201).send(registerMethod);
//     }
//     // console.log(userFind);
//     // console.log(getPostman);
// })

// app.post("/login",async function(request,response){
//     const {email,password} =request.body;
//     // console.log(email,password);
//     const userFind = await client.db("CRUD").collection("private").findOne({email:email})
//     // console.log(userFind);
//     if(userFind){
//         const mongoDBpassword =userFind.password;
//         const passwordCheck = await bcrypt.compare(password, mongoDBpassword); // frontend pass should in first parameter and mongo pass in second
//         // console.log(passwordCheck);
//         if(passwordCheck){
//             const token = jwt.sign({_id:userFind._id},"student");  // generating different token for id "student" - token name
//             response.status(200).send({token:token});  
//         }
//         else{
//             response.status(400).send("Invalid Password")
//         }
//     }
//     else{
//         response.status(400).send("Invalid  Email-ID");
//     }
// })

// app.listen(5000,()=>{
//     console.log("Server is listening at port 5000");
// })