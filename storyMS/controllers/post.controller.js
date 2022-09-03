const mongoose = require('mongoose');
const _ = require('lodash');
const Minio = require('minio');
const story = require('../models/story');
const crypto = require('crypto');

// Get story using minIO

module.exports.CreateStory = (async (req, res) => { 

    const minioClient = minio();

   
    var uuidName = crypto.randomUUID();
    console.log(JSON.stringify(req.file))
    minioClient.fPutObject('minifb', uuidName, req.file.path, function (err, objInfo) {

        if (err) {
            return console.log(err)
        }
    });


    //Create a new story
    const newStory = new story({
        name: req.body.name,
        storyUUID: uuidName
    });

    try {
        const savedStory = await newStory.save();
        res.send({ story: 'Uploaded Successfully' });
    } catch (err) {
        res.status(400).send(err);
    }
});

exports.getStory = (async (req,res) =>{
    try{
        const allStory = await story.find().sort({"time":-1}).limit(10);       // -1 means descending
        res.send(allStory);
    } catch(err){
        res.status(400).send({Fail: 'Image not found'});
    }
});

function minio() {
    return new Minio.Client({
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'BmyMIJJcdo6xykFg',
        secretKey: 'in0Wp2xIMnBIdx8S2RXLxPJMxVdf8VYk'
    });
}