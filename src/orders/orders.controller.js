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
    const { dishes } = req.body.data
    console.log(dishes)
    if (Array.isArray(dishes) && dishes.length !== 0) {
        return next()
    }
    next({
        status: 400,
        message: 'Order must include at least one dish'
    })
}

function checkDishQuantities(req, res, next){
    const { dishes } = req.body.data;
    dishes.forEach( (dish, index) => {
        if (!dish.quantity || !Number.isInteger(dish.quantity) || dish.quantity <= 0) {
            next({
                status: 400,
                message: `Dish ${index} must have a quantity that is an integer greater than 0`
            })
        }
    });
    next();
}

function create(req, res){
    res.json( { data : 'create placeholder'})
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

function idMatches(req, res, next){

    const { orderId } = req.params
    const reqOrder = req.body.data

    if (reqOrder['id']) {
        if (reqOrder['id'] !== orderId) {
            next({
                status: 400,
                message: `Order id does not match route id. Order ${reqOrder['id']}, Route: ${orderId}`
            })
        }
    }
    next();
}

function update(req, res){
    res.json({ data: "Update placeholder"})
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
        checkDishQuantities,
        create
    ],
    read:[
        orderExists,
        read
    ],
    update:[
        orderExists,
        idMatches,
        bodyDataHas("deliverTo"),
        isNotEmpty("deliverTo"),
        bodyDataHas("mobileNumber"),
        isNotEmpty("mobileNumber"),
        bodyDataHas("dishes"),
        isNotEmpty("dishes"),
        bodyDataHas("status"),
        isNotEmpty("status"),
        isDishArray,
        checkDishQuantities,
        update
    ]
}