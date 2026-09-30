import mongoose, { connection } from "mongoose";
import {config} from "./config.js";

mongoose.connect (config.db.URI);

const connection = mongoose.connection;

connection.once("open",() => {
    console.log("DB is conected");
});

connection.on("disconnected", (error) => {
    console.log ("DB is disconected" + error);
});

connection.on("error", (error) => {
    console.log("error found" + error);
});