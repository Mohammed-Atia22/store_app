const express = require('express');
const router = express.Router();

const{getallproducts,getallproductsstatic} = require('../controllers/products');

router.route('/').get(getallproducts)


router.route('/static').get(getallproductsstatic)




module.exports = router;