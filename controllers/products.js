const product = require('../models/product');


const getallproductsstatic = async (req,res)=>{
    const products = await product.find({}).sort('-name');
    res.status(200).json({products,nbHits:products.length});
}

const getallproducts = async (req,res)=>{
    const {featured,company,name,sort,fields,numericfilters} = req.query;
    const queryobject = {};
    if(featured){
        queryobject.featured = featured === 'true' ? true : false;
    }
    if(company){
        queryobject.company = company;
    }
    if(name){
        queryobject.name = name;
    }
    
    if(numericfilters){
        const operatormap = {
            '>':'$gt',
            '>=':'$gte',
            '<':'$lt',
            '<=':'$lte',
            '=':'$eq',
        }
        const regex = /\b(<|>|<=|>=|=)\b/g ;
        let filters = numericfilters.replace(regex,(match)=>`-${operatormap[match]}-`);
        const options = ['price','rating'];
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value] = item.split('-');
            if(options.includes(field)){
                queryobject[field] = {[operator]:Number(value)};
            }
        });
    }
    let result = product.find(queryobject);
    if(sort){
        const sortlist = sort.split(',').join(' ');
        result = result.sort(sortlist);
    } else{
        result = result.sort('createdat');
    }
    if(fields){
        const fieldslist = fields.split(',').join(' ');
        result = result.select(fieldslist);
    }



    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1)*limit;
    result = result.skip(skip).limit(limit);


    const products = await result;
    res.status(200).json({products,nbHits:products.length});
}


module.exports = {
    getallproducts,
    getallproductsstatic
}