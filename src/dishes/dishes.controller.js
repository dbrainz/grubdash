const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

const bodyDataHas = require("../utils/bodyDataHas")

const isNotEmpty = require("../utils/isNotEmpty")

// TODO: Implement the /dishes handlers needed to make the tests pass

function priceIsValid(req, res, next) {
    const { data: { price } = {} } = req.body
    if (price <= 0 || !Number.isInteger(price)) {
        return next({
            status: 400,
            message: `Dish must have a price that is an integer greater than 0`
        })
    }
    next();
}

function list(req, res) {
    res.json( { data: dishes })
}

function create(req, res) {
    const { data: { name, description, price, image_url } = {} }= req.body
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url
    }
    console.log(newDish)
    dishes.push(newDish)
    res.status(201).json({ data: newDish })
}

function dishExists(req, res, next) {
    const { dishId } = req.params
    const dishFound = dishes.find( dish => dish.id === dishId)

    if (dishFound) {
        res.locals.dish = dishFound
        return next()
    }

    next({
        status: 404,
        message: `Dish id not found: ${dishId}`
    })
}

function read(req, res) {
    res.json({data : res.locals.dish})
}

module.exports = {
    list,
    create:[
        bodyDataHas("name"),
        bodyDataHas("description"),
        bodyDataHas("price"),
        bodyDataHas("image_url"),
        isNotEmpty("name"),
        isNotEmpty("description"),
        priceIsValid,
        isNotEmpty("image_url"),
        create
    ],
    read: [
        dishExists,
        read
    ]
}