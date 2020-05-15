const express = require('express');
const body_parser = require('body-parser');
const mongodb = require('mongodb');

const PORT = 3000;
const app = express();
// Set the View Engine
app.set('view engine', 'ejs');

// Use body Parser in middle-ware
app.use(body_parser.json());
app.use(body_parser.urlencoded( {extended: true} ));


// Declare any constants or variables here for Database
let db_handler;
const DB_URL = "mongodb://localhost:27017";
const DB_NAME ="bsj"
const COLLECTION_NAME = 'companies';

// Step 4.
app.listen(PORT, () => {
    console.log(`Server Started on Port: ${PORT}`);
    // create connection to our database
    mongo_client = mongodb.MongoClient;
    mongo_client.connect(DB_URL, (err, db_client) => {
        if(err) {
            console.log("ERROR:" + err);
        } else {
            // Upon success, print a message saying "Database Connected"
            console.log("DATABASE CONNECTED");
            // Upon success, you should also connect to the 'bsj' database.
            // Use db_handler for future use
            db_handler = db_client.db(DB_NAME);
        }
    })
});
    

// From here on, we can start writing our routes

app.get('/', (req, res) => {
    res.render("index");
});


app.get('/jobs', (req, res) => {
    // In Step 7, we will fetch data from Database here and send to jobs.ejs page using an array called all_compaies
    db_handler.collection(COLLECTION_NAME).find({}).toArray( (err, result)=> {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(result);
            // render it says to show the page with specified info on it. (IT IS NOT A ROUTE!)
        res.render('jobs', {
            'all_companies': result 
        });
        }
    });
});


// Step 5:
app.post('/add', (req, res) => {
    // Do something here with your request body
    const form_data = req.body;
    console.log(req.body);

    const company_id = form_data['company_id'];
    const name = form_data['name'];
    const description = form_data['description'];
    const logo = form_data['logo'];

    const my_obj = {
        company_id: company_id,
        name: name, 
        description: description,
        logo: logo
    }
    console.log(my_obj);

    db_handler.collection(COLLECTION_NAME).insertOne(my_obj, (error, result) => {
        if (error) {
            console.log(error);
        }else {
            console.log("AN ENTRY HAS BEEN ADDED");
            // send response to browser once we are done with db
            // redirect sends client to a specified route.
            res.redirect('/jobs');
        }
    })
});

