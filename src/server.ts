import express from 'express'
import mongoose from 'mongoose'

//import {route} from '../src/Roles/index'
//import {userRoute} from '../src/User/index'

//connect to database
mongoose.connect("mongodb://localhost/TeamWay")
    .then(() => {
        console.log("Database connected");// when connected
    })
    .catch((error: unknown) =>{
        console.log("db error", error);//when error occurs
        process.exit(1);
    })

const server = express()

server.use(express.json())

export { server}