const express = require("express");
const amqp = require("amqplib");

const app = express()

var channel, connection;

async function connect() {

    connection = await amqp.connect("amqp://localhost:5672");
    channel =  await connection.createChannel();
    await channel.assertQueue("test2");

}

connect();

app.get("/getDataFromTest1", async (req, res) => {

    let k;
    let arr = [];
    
    await channel.consume("test2",(data) => {
     k = JSON.parse(data.content);
     console.log("data " , k.msg.name);
     arr.push(k.msg.name);
     channel.ack(data);
    })

    return res.status(200).send({
        "data":arr
    })
})

app.listen(5000, ()=> {
    console.log("server started on 3000");
})