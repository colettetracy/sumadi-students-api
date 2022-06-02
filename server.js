import bodyParser from "body-parser";
import dotenv from 'dotenv';
import express, { json } from "express";
import dbo from "./database/connection.js";
import routers from "./routers/student.js";
import cors from 'cors';

const app = express();

//const allowCors = cors();

dotenv.config({ path: "./config.env" })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(json());
app.use(cors({
    origin: '*'
}));
app.use(routers);

app.listen(process.env.PORT, () => {
    dbo.connectToServer(function(err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${process.env.PORT}`);
});