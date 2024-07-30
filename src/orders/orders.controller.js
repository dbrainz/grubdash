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
    const { deliverTo, mobileNumber, status, dishes } = req.body.data
    const order = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes
    }
    orders.push(order)
    res.status(201).json({ data: order})

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

function orderAlreadyDelivered(req, res, next){
    if (res.locals.order.status == "delivered") {
        next({
            status: 400,
            message: "A delivered order cannot be changed"
        })
    }
    next()
}

function isStatusValid(req, res, next){
    const { status } = req.body.data;
    if (["pending", "preparing", "out-for-delivery", "delivered"].includes(status)) {
        next()
    }
    next({
        status: 400,
        message: "Order must have a status of pending, preparing, out-for-delivery, delivered"
    })
}

function update(req, res){
    const { deliverTo, mobileNumber, status, dishes } = req.body.data
    const order = res.locals.order
    order.deliverTo = deliverTo
    order.mobileNumber = mobileNumber
    order.status = status
    order.dishes = dishes
    res.json({ data: order})
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
        orderAlreadyDelivered,
        isStatusValid,
        isDishArray,
        checkDishQuantities,
        update
    ]
}