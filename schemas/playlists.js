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
        asmr1Title: { type: String, required: true, default: null },
        asmr2Title: { type: String, required: false, default: null },
        asmr3Title: { type: String, required: false, default: null },
        asmr4Title: { type: String, required: false, default: null },

        asmr1Url: { type: String, required: true, default: null },
        asmr2Url: { type: String, required: false, default: null },
        asmr3Url: { type: String, required: false, default: null },
        asmr4Url: { type: String, required: false, default: null },

        asmr1Icon: { type: String, required: true, default: null },
        asmr2Icon: { type: String, required: false, default: null },
        asmr3Icon: { type: String, required: false, default: null },
        asmr4Icon: { type: String, required: false, default: null },

        asmr1Volume: { type: Number, required: true, default: null },
        asmr2Volume: { type: Number, required: false, default: null },
        asmr3Volume: { type: Number, required: false, default: null },
        asmr4Volume: { type: Number, required: false, default: null },

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
