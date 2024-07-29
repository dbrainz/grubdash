const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

const bodyDataHas = require("../utils/bodyDataHas")

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res){
    res.json({ data : orders })
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