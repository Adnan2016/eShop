var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var schema = new Schema({
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    image: {type: String, required: true},
    name: {type: String, required: true},
    price: {type: Number, required: true}
});

schema.plugin(mongoosastic, {
  hosts: [
    'localhost:9200'
  ]
});

module.exports = mongoose.model('Product', schema);
