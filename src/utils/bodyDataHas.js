function bodyDataHas(propertyName) {
    return function(req, res, next) {
        const { data = {} } = req.body
        if (propertyName in data) {
            return next();
        }
        next({ status: 400, message: `Must include a ${propertyName}`})
    }
}

module.exports = bodyDataHas