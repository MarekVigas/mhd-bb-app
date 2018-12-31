import express from "express";
import fs from "fs";
import https from "https";
import { argv } from "optimist";

let enviroment: string;

if (argv.env === "prod") {
    enviroment = "production";
} else {
    enviroment = "local";
}

const configName: string = __dirname + "/../config/config." + enviroment + ".json";
const configContents = fs.readFileSync(configName);
const config = JSON.parse(configContents.toString());

// Certificate
const privateKey = fs.readFileSync(config.letsencrypt.key, "utf8");
const certificate = fs.readFileSync(config.letsencrypt.cert, "utf8");
let ca: any;

if (config.letsencrypt.ca !== null) {
    ca = fs.readFileSync(config.letsencrypt.ca, "utf8");
} else {
    ca = null;
}

const credentials = {
    ca,
    cert: certificate,
    key: privateKey,
};

const app = express();

app.get("/", (req, res) => {
    res.send("hello world");
});

https.createServer(credentials, app)
    .listen(3000, () => {
        console.log("Listening on port 3000");
    });
