const express = require('express');
const { insertLogs } = require('../../db.js');

const router = express.Router();

router.post('/', (req, res) => {
  insertLogs(req, {});
  res.status(200).send({ url: '/login' });
});

module.exports = router;
