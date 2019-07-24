// this allows us to just require the models folder instead of requiring each model individually

module.exports = {
    Article: require("./Article"),
    Comment: require("./Comment")
};