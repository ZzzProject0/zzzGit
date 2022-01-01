const express = require('express');
const router = express.Router();
const ERROR = require('../data/error')
const authMiddleware = require('../middlewares/auth-middleware')
require('dotenv').config();
const Asmr = require("../schemas/asmr")

// ASMR  category API
// line 10  category -> categories  restful name rule
router.get('/categories/:categoryId', async (req, res) => {
    const { categoryIdx } = req.params.categoryId

    try {
        let target = await Asmr.findOne({ categoryIdx: categoryId })
        if (!target) {
            throw new Error(ERROR.NO_EXISTS_DATA)
        }
        data = {
            items: target,
            total: target.length
        }
        res.json({ msg: 'success', data })
    } catch (err) {
        console.log('err', err)
        res.json({ msg: 'fail' })
    }
});

// ASMR show everything API

router.get('/', async (req, res) => {


    try {
        let target = await Asmr.findOne({})
            .sort('id')
            .lean()

        if (!target) {
            throw new Error(ERROR.NO_EXISTS_DATA)
        }
        data = {
            items: target,
            total: target.length
        }
        res.json({ msg: 'success', data })
    } catch (err) {
        console.log('err', err)
        res.json({ msg: 'fail' })
    }
});



module.exports = router;