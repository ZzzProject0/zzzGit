const express = require("express");
const router = express.Router();
const ERROR = require("../data/error");
const authMiddleware = require("../middlewares/auth-middleware");
require("dotenv").config();
const Playlist = require("../schemas/playlists");

// Playlist API

router.get("/users/:userIdx", async (req, res) => {
  const { userIdx } = req.params;
  try {
    const target = await Playlist.find({ userIdx });
    if (!target) {
      throw new Error(ERROR.NO_EXISTS_DATA);
    }
    console.log(target);
    console.log(target.mixTitle);
    console.log(target.mixList);

    let mix = [];
    for (let i = 0; i < target.length; i++) {
      let mixIdx = target[i].mixIdx;
      let mixTitle = target[i].mixTitle;
      let mixList = target[i].mixList;

      mix.push({
        playlistIdx: mixIdx,
        mixTitle: mixTitle,
        mixList,
      });
    }

    console.log(mix);

    res.status(201).json(mix);
  } catch (err) {
    console.log("err", err);
    res.json({ msg: "fail" });
  }
});

// Create a playlist
router.post("/", authMiddleware, async (req, res) => {
  const { userIdx } = res.locals.user;

  console.log("creating new playlist");
  const { mixTitle, mixList } = req.body;

  try {
    console.log(mixTitle, mixList);
    // const newMix = {
    //     mixTitle,
    //     mixList,
    //     userIdx,
    // };

    let item = await Playlist.create({ mixTitle, mixList, userIdx });

    // post에 send data
    let mix = await Playlist.find(
      { userIdx },
      {
        _id: 0,
        mixIdx: 1,
        mixTitle: 1,
        mixList: 1,
        userIdx: 1,
      }
    )
      .sort("-mixIdx")
      .limit(1);

    res.status(201).json(mix);
  } catch (error) {
    console.log("err", error);
    res.json({ msg: "fail", error });
  }
});

// update playlist
router.put("/:playlistIdx/users/:userIdx", async (req, res) => {
  const { playlistIdx, userIdx } = req.params;
  const newMixTitle = req.body.mixTitle;
  console.log("updating playlist ");
  try {
    const target = await Playlist.findOne({ mixIdx: playlistIdx });
    if (!target) {
      throw new Error(ERROR.NO_EXISTS_DATA);
    }
    console.log(target);
    console.log(newMixTitle);
    const updateItem = await Playlist.findOneAndUpdate(
      { mixIdx: playlistIdx },
      { mixTitle: newMixTitle }
    );
    res.status(200).json({
      msg: "successful",
    });
  } catch (error) {
    res.status(401);
  }
});

// delete
router.delete("/:playlistIdx/users/:userIdx", async (req, res) => {
  const { playlistIdx, userIdx } = req.params;

  console.log("deleting playlist ");
  try {
    const target = await Playlist.findOne({ mixIdx: playlistIdx });
    if (!target) {
      throw new Error(ERROR.NO_EXISTS_DATA);
    }

    const deleteItem = await Playlist.findOneAndDelete({ mixIdx: playlistIdx });

    res.status(200).json({
      msg: "successful",
    });
  } catch (error) {
    res.status(401);
  }
});

module.exports = router;
