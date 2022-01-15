const mongoose = require('mongoose');

const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');
require('dotenv').config();

const dev1 = process.env.DEV;
const production = process.env.PRODUCTION;
const connection = mongoose.createConnection(production);
autoIncrement.initialize(connection);

const playlistsSchema = new Schema(
    {
        mixIdx: { type: Number, required: true },
        mixTitle: { type: String, required: true },


        mixList: [{
            asmrUrl: String,
            sound: String,
            iconUrl: String,
            title: String

        }],

        userIdx: { type: Number, default: null },

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
