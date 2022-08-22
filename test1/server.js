const express = require("express");
const amqp = require("amqplib");

const app = express()

app.use(express.json());
var channel, connection;

async function connect() {

    connection = await amqp.connect("amqp://localhost:5672");
    channel =  await connection.createChannel();
    await channel.assertQueue("test1");

}

connect();

app.post("/data", async(req, res)=> {

    channel.sendToQueue("test2", Buffer.from(JSON.stringify(
        {
            msg:req.body
        }
    )))
    //console.log("result = ", result);

    return res.status(200).send({"msg" :"sent"});

})

app.listen(3000, ()=> {
    console.log("server started on 3000");
})