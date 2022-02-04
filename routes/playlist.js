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

    res.status(201).json(mix);
  } catch (err) {
    console.log("err", err);
    res.json({ msg: "fail" });
  }
});

// Create a playlist
router.post("/", authMiddleware, async (req, res) => {
  const { userIdx } = res.locals.user;
  const { mixTitle, mixList } = req.body;

  try {
    // console.log(mixTitle, mixList);
    // const newMix = {
    //     mixTitle,
    //     mixList,
    //     userIdx,
    // };

    await Playlist.create({ mixTitle, mixList, userIdx });
    // playListIdx = mixIdx, mixTitle, mixList
    // post에 send data
    // let mix = await Playlist.find(
    //   { userIdx },
    //   {
    //     _id: 0,
    //     mixIdx: 1,
    //     mixTitle: 1,
    //     mixList: 1,
    //     userIdx: 1,
    //   }
    // )
    //   .sort("-mixIdx")
    //   .limit(1);

    let mix = await Playlist.findOne({ userIdx }).sort("-mixIdx").limit(1);
    // console.log("mix : ", mix);
    let newMix = {
      playlistIdx: mix.mixIdx,
      mixTitle: mix.mixTitle,
      mixList: mix.mixList,
    };
    // console.log("newMix : ", newMix);

    res.status(201).json(newMix);
  } catch (error) {
    console.log("err", error);
    res.json({ msg: "fail", error });
  }
});

// update playlist
router.put("/:playlistIdx/users/:userIdx", async (req, res) => {
  const { playlistIdx, userIdx } = req.params;
  const newMixTitle = req.body.mixTitle;
  // console.log("updating playlist ");
  try {
    const target = await Playlist.findOne({ mixIdx: playlistIdx });
    if (!target) {
      throw new Error(ERROR.NO_EXISTS_DATA);
    }
    // console.log(target);
    // console.log(newMixTitle);
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
