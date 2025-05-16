const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    make: { type: String, required: true},
    model: { type: String, required: true},
    year: { type: Number, required: true},
    vinCode: {type: String, required: true, unique: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    mileage: {type: Number, required: true},
    images: [{type: String}],
    createdAt: {type: Date, default: Date.now}
})

CarSchema.index({make: 'text', model: 'text', vinCode: 'text'});

module.exports = mongoose.model('Car', CarSchema);