const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const productsrouter = require('./routes/products');
require('dotenv').config();
app.use(express.json());
require('express-async-errors');


app.get('/',(req,res) => {
    res.send('<h1>ABI</h1>');
})


app.use('/api/v1/products',productsrouter);

const notFound = require('./middleware/not-found');
const errorhandler = require('./middleware/error-handler');
app.use(notFound);
app.use(errorhandler);


const port = process.env.PORT || 3000;
const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,console.log(`server is listening to the port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start();