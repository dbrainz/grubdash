const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

const bodyDataHas = require("../utils/bodyDataHas")

const isNotEmpty = require("../utils/isNotEmpty")

// TODO: Implement the /orders handlers needed to make the tests pass
function list(req, res){
    res.json({ data : orders })
}

function isDishArray(req, res, next) {
    const { dishes } = req.body 
    if (Array.isArray(dishes)) {
        return next()
    }
    next({
        status: 400,
        message: 'Order must include at least one dish'
    })
}

function checkDishPrices(req, res, next){
    const { dishes } = req.body

}

function create(req, res){

}

function orderExists(req, res, next) {
    const { orderId } = req.params
    const orderFound = orders.find( order => orderId === order.id )
    if (orderFound) {
        res.locals.order = orderFound
        return next()
    }
    next({
        status: 404,
        message: `Order Id not found: ${orderId}`
    })
}

function read(req, res) {
    res.json({ data: res.locals.order})
}

module.exports = {
    list,
    create:[
        bodyDataHas("deliverTo"),
        isNotEmpty("deliverTo"),
        bodyDataHas("mobileNumber"),
        isNotEmpty("mobileNumber"),
        bodyDataHas("dishes"),
        isNotEmpty("dishes"),
        isDishArray,
        checkDishPrices,
        create
    ],
    read:[
        orderExists,
        read
    ]
}