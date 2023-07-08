const express = require('express');
const { insertLogs } = require('../../db.js');

const router = express.Router();

router.post('/', async (req, res) => {
  const { authUser, userIPAddress, endpoint } = req;
  const userId = authUser._id;
  await insertLogs({}, userIPAddress, endpoint, userId);
  res.status(200).send({ url: `/login` });
});

module.exports = router;
