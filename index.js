const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MongoURI;
const taskModel = require('./models/task');
const cors = require('cors');
const { response } = require('express');


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());


mongoose.connect(`${mongoURI}/toDoVersion3`).then(() => {
    console.log(`Database Connection Successful`)
}).catch(err => console.error(err));


app.post('/addTask', (req, res) => {
    // console.log(req.body.task);
    taskModel
        .find({task: req.body.task})
        .then(data => {
            if(data.length) {
                res.send("Activity Already Added")
            } else {
                const task = new taskModel({
                    task: req.body.task
                })
                
                task.save()
                    .then(doc => {
                        // console.log(doc)
                        res.status(200).send(`${req.body.task} added`)
                    })
                    .catch(err => {
                        console.log(err)
                    });
            }
        })
        .catch(err => console.log(err))
});


app.get('/allTask', (req, res) => {
    taskModel
        .find()
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => console.log(err))
});


app.put('/updateTask', (req, res) => {
    // console.log(req.body.id)
    taskModel
        .findOneAndUpdate(
            {_id: req.body.id},
            {task: req.body.task},
            {new: true}
        )
        .then(doc => {
            res.send(`${doc} updated`)
        })
        .catch(err => console.log(err))
})


app.delete('/deleteTask', (req, res) => {
    taskModel
        .findOneAndRemove({
            id: req.body.id
        })
        .then(response => {
            res.send(response)
        })
        .catch(err => console.log(err))
})


app.listen(3001, () => {
    console.log(`connected to port ${port}`)
});