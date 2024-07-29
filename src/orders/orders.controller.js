const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res){
    res.json({ data : orders })
}

function bodyDataHas(propertyName) {
    return function(req, res, next) {
        const { data = {} } = req.body
        if (data[propertyName]) {
            return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}`})
    }
}

function create(req, res){

}

module.exports = {
    list,
    create:[
        bodyDataHas("deliverTo"),
        bodyDataHas("mobileNumber"),
        bodyDataHas("dishes"),
        create
    ]
}