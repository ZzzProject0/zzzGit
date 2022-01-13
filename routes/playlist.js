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
        console.log(target);

        data = {
            items: target,
            total: target.length,
        };

        if (target.asmr4Title !== null) {
            console.log(this is)
        }




        res.json({ msg: 'success', data });
    } catch (err) {
        console.log('err', err);
        res.json({ msg: 'fail' });
    }
});

// Create a playlist
router.post('/', authMiddleware, async (req, res) => {
    // userIdx 는 middeleware 에서 가져오나요 ???
    const { userIdx } = res.locals.user;

    console.log('creating new playlist');
    const {
        mixTitle, mix,
    } = req.body;

    console.log(mix);
    try {
        if (mix.length === 0) {
            return res.status(204).json({ msg: 'No asmr in the playlist' });
            // shit shit shit shit shit shit shit
        }

        const x = mix.length;
        switch (x) {
            case 0:
                return res.status(204).json({ msg: 'No asmr in the playlist' });
            case 1: {
                console.log('your trying to add ', mix.length);
                const newMix = {
                    mixTitle: req.body.mixTitle,
                    asmr1Title: mix[0].asmr1Title,
                    asmr1Url: mix[0].asmr1Url,
                    asmr1Icon: mix[0].asmr1Icon,
                    asmr1Volume: mix[0].asmr1Volume,

                    userIdx,
                };
                await Playlist.create(newMix);
                break;
            }
            case 2: {
                console.log('your trying to add ', mix.length);
                const newMix2 = {
                    mixTitle: req.body.mixTitle,

                    asmr1Title: mix[0].asmr1Title,
                    asmr1Url: mix[0].asmr1Url,
                    asmr1Icon: mix[0].asmr1Icon,
                    asmr1Volume: mix[0].asmr1Volume,

                    asmr2Title: mix[1].asmr2Title,
                    asmr2Url: mix[1].asmr2Url,
                    asmr2Icon: mix[1].asmr2Icon,
                    asmr2Volume: mix[1].asmr2Volume,

                    userIdx,
                };
                await Playlist.create(newMix2);
                break;
            }
            case 3: {
                console.log('your trying to add ', mix.length);
                const newMix3 = {
                    mixTitle: req.body.mixTitle,
                    asmr1Title: mix[0].asmr1Title,
                    asmr1Url: mix[0].asmr1Url,
                    asmr1Icon: mix[0].asmr1Icon,
                    asmr1Volume: mix[0].asmr1Volume,

                    asmr2Title: mix[1].asmr2Title,
                    asmr2Url: mix[1].asmr2Url,
                    asmr2Icon: mix[1].asmr2Icon,
                    asmr2Volume: mix[1].asmr2Volume,

                    asmr3Title: mix[2].asmr3Title,
                    asmr3Url: mix[2].asmr3Url,
                    asmr3Icon: mix[2].asmr3Icon,
                    asmr3Volume: mix[2].asmr3Volume,

                    userIdx,
                };
                await Playlist.create(newMix3);
                break;
            }
            case 4: {
                console.log('your trying to add ', mix.length);
                const newMix4 = {
                    mixTitle: req.body.mixTitle,

                    asmr1Title: mix[0].asmr1Title,
                    asmr1Url: mix[0].asmr1Url,
                    asmr1Icon: mix[0].asmr1Icon,
                    asmr1Volume: mix[0].asmr1Volume,

                    asmr2Title: mix[1].asmr2Title,
                    asmr2Url: mix[1].asmr2Url,
                    asmr2Icon: mix[1].asmr2Icon,
                    asmr2Volume: mix[1].asmr2Volume,

                    asmr3Title: mix[2].asmr3Title,
                    asmr3Url: mix[2].asmr3Url,
                    asmr3Icon: mix[2].asmr3Icon,
                    asmr3Volume: mix[2].asmr3Volume,

                    asmr4Title: mix[3].asmr4Title,
                    asmr4Url: mix[3].asmr4Url,
                    asmr4Icon: mix[3].asmr4Icon,
                    asmr4Volume: mix[3].asmr4Volume,

                    userIdx,
                };
                await Playlist.create(newMix4);
                break;
            }
            default:
                throw new Error(ERROR.INVALID_PARAMS);
        }

        res.json({ msg: 'success' });
    } catch (err) {
        console.log('err', err);
        res.json({ msg: 'fail' });
    }
});

// update playlist
router.put('/:playlistIdx/users/:userIdx', async (req, res) => {
    const {
        playlistIdx, userIdx,
    } = req.params;
    const newMixTitle = req.body.mixTitle;
    console.log('updating playlist ');
    try {
        const target = await Playlist.findOne({ mixIdx: playlistIdx });
        if (!target) {
            throw new Error(ERROR.NO_EXISTS_DATA);
        }
        console.log(target);
        console.log(newMixTitle);
        const updateItem = await Playlist.findOneAndUpdate({ mixIdx: playlistIdx }, { mixTitle: newMixTitle });
        res.status(200).json({
            msg: 'successful',
        });
    } catch (error) {
        res.status(401);
    }
});

// delete
router.delete('/:playlistIdx/users/:userIdx', async (req, res) => {
    const {
        playlistIdx, userIdx,
    } = req.params;

    console.log('deleting playlist ');
    try {
        const target = await Playlist.findOne({ mixIdx: playlistIdx });
        if (!target) {
            throw new Error(ERROR.NO_EXISTS_DATA);
        }

        const deleteItem = await Playlist.findOneAndDelete({ mixIdx: playlistIdx });

        res.status(200).json({
            msg: 'successful',
        });
    } catch (error) {
        res.status(401);
    }
});

module.exports = router;
