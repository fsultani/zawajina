const bcrypt = require('bcryptjs');
const express = require('express');

const { usersCollection, insertLogs } = require('../../../db');
const { redirectToLogin } = require('../../../utils');

const router = express.Router();

router.put('/', async (req, res) => {
  try {
    const { authUser } = req;
    const { newUserPassword } = req.body;
    const authUserId = authUser._id;

    let update = {}
    let logsUpdate = {}

    if (newUserPassword) {
      const bcryptHash = await bcrypt.hash(newUserPassword, 10);
      const password = bcryptHash;

      update = {
        ...update,
        password,
      }

      logsUpdate = {
        ...logsUpdate,
        password,
      }

      await usersCollection().findOneAndUpdate(
        { _id: authUserId },
        {
          $set: {
            ...update,
          },
        },
        {
          returnDocument: 'after',
          returnNewDocument: true,
        }
      )

      await insertLogs(req, {
        ...logsUpdate,
      });
    }

    return res.sendStatus(200);
  } catch (error) {
    redirectToLogin(error, res);
  }
});

module.exports = router;
