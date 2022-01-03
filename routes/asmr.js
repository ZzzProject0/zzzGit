const express = require('express');
const router = express.Router();
const ERROR = require('../data/error')
const authMiddleware = require('../middlewares/auth-middleware')
require('dotenv').config();
const Asmr = require("../schemas/asmr")

// ASMR  category API
// line 10  category -> categories  restful name rule
router.get('/categories/:categoryId', async (req, res) => {
    const { categoryId } = req.params


    try {
        let target = await Asmr.find({ categoryIdx: categoryId })
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
        let target = await Asmr.find({})
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

//test 
router.post('/test', async (req, res) => {
    const { categoryIdx, categoryName, title, asmrUrl, iconUrl } = req.body
    console.log("test adding new item ")
    try {
        let data = {
            categoryIdx, categoryName, title, asmrUrl, iconUrl
        }
        let newItem = await Asmr.create({
            categoryIdx, categoryName, title, asmrUrl, iconUrl
        })
        res.status(200).json({
            newItem
        })
    } catch (error) {
        res.status(401)
    }

})


//test 
router.get('/test', async (req, res) => {
    console.log("test test")
})





module.exports = router;