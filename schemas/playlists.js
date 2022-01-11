const mongoose = require('mongoose');

const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
require('dotenv').config();

const dev1 = process.env.DEV;
const connection = mongoose.createConnection(dev1);
autoIncrement.initialize(connection);

const playlistsSchema = new Schema(
    {
        mixIdx: { type: Number, required: true },
        mixTitle: { type: String, required: true },
        asmr1: { type: String, required: false, default: null },
        asmr2: { type: String, required: false, default: null },
        asmr3: { type: String, required: false, default: null },
        asmr4: { type: String, required: false, default: null },

        asmr1Volume: { type: String, required: false, default: null },
        asmr2Volume: { type: String, required: false, default: null },
        asmr3Volume: { type: String, required: false, default: null },
        asmr4Volume: { type: String, required: false, default: null },

        userIds: { type: Number, default: null },

    },
    { timestamps: true },
);

playlistsSchema.plugin(autoIncrement.plugin, {
    model: '_id',
    field: 'mixIdx',
    startAt: 0,
    increment: 1,
});

module.exports = mongoose.model('playlist', playlistsSchema);
