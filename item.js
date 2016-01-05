var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    _id: String,
    full_name: String,
    short_name: String,
    inn: String,
    kpp: String,
    country_code: String,
    region_code: String,
    dejure_address: String,
    fact_address: String,
    status: String,
    updated_at: Date
});

module.exports = mongoose.model('Item', itemSchema);
