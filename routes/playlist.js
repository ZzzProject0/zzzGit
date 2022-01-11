const express = require('express');

const router = express.Router();
const ERROR = require('../data/error');
const authMiddleware = require('../middlewares/auth-middleware');
require('dotenv').config();
const Asmr = require('../schemas/asmr');
const Playlist = require('../schemas/playlists');

// Playlist API

router.get('/users/:userIdx', async (req, res) => {
    const { userIdx } = req.params;
    console.log(userIdx);

    try {
        const target = await Playlist.find({ userIdx });
        if (!target) {
            throw new Error(ERROR.NO_EXISTS_DATA);
        }

        data = {
            items: target,
            total: target.length,
        };
        res.json({ msg: 'success', data });
    } catch (err) {
        console.log('err', err);
        res.json({ msg: 'fail' });
    }
});

// Create a playlist
router.post('/', async (req, res) => {
    // userIdx 는 middeleware 에서 가져오나요 ?
    const {
        mixTitle, mix,
    } = req.body;

    console.log(mixTitle, mix);
    console.log(mix.length);

    try {
        if (mix.length === 4) {
            console.log('There is no mix');
        }

        res.json({ msg: 'success' });
    } catch (err) {
        console.log('err', err);
        res.json({ msg: 'fail' });
    }
});

// test
router.post('/test', async (req, res) => {
    const {
        categoryIdx, categoryName, title, asmrUrl, iconUrl,
    } = req.body;
    console.log('test adding new item ');
    try {
        // const data = {
        //     categoryIdx, categoryName, title, asmrUrl, iconUrl,
        // };
        const newItem = await Asmr.create({
            categoryIdx, categoryName, title, asmrUrl, iconUrl,
        });
        res.status(200).json({
            newItem,
        });
    } catch (error) {
        res.status(401);
    }
});

// test
router.get('/seed', async (req, res) => {
    // console.log(Seed)
    Seed.forEach(async (element) => {
        try {
            await Asmr.create({
                categoryIdx: element.categoryIdx,
                categoryName: element.categoryName,
                title: element.title,
                asmrUrl: element.asmrUrl,
                iconUrl: element.iconUrl,
                copyRight: element.copryRight,
            });
        } catch (error) {
            res.status(401);
        }
    });
    res.status(200).json({ isSeeded: 'sucessful' });
});

module.exports = router;
