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
        message: `Dish does not exist: ${dishId}`
    })
}

function read(req, res) {
    res.json({data : res.locals.dish})
}

function idMatches(req, res, next){

    const { dishId } = req.params
    const reqDish = req.body.data

    if (reqDish['id']) {
        if (reqDish['id'] !== dishId) {
            next({
                status: 400,
                message: `Dish id does not match route id. Dish ${reqDish['id']}, Route: ${dishId}`
            })
        }
    }
    next();
}

function update(req, res) {

    const dish = res.locals.dish
    const { data: { name, description, price, image_url  } = {} } = req.body

    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;

    res.json( { data: dish })
}

module.exports = {
    list,
    create:[
        bodyDataHas("name"),
        isNotEmpty("name"),
        bodyDataHas("description"),
        isNotEmpty("description"),
        bodyDataHas("price"),
        priceIsValid,
        bodyDataHas("image_url"),
        isNotEmpty("image_url"),
        create
    ],
    read: [
        dishExists,
        read
    ],
    update: [
        dishExists,
        bodyDataHas("name"),
        isNotEmpty("name"),
        bodyDataHas("description"),
        isNotEmpty("description"),
        bodyDataHas("price"),
        priceIsValid,
        bodyDataHas("image_url"),
        isNotEmpty("image_url"),
        idMatches,
        update
    ]
}