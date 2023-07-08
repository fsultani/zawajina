const bcrypt = require('bcryptjs');
const express = require('express');

const { usersCollection, insertLogs } = require('../../../db');
const { redirectToLogin } = require('../../../utils');

const router = express.Router();

router.put('/', async (req, res) => {
  try {
    const { authUser, userIPAddress, endpoint } = req;
    const { newUserPassword } = req.body;
    const userId = authUser._id;

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
        { _id: userId },
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

      await insertLogs({
        ...logsUpdate,
      },
        userIPAddress,
        endpoint,
        userId
      );
    }

    return res.sendStatus(200);
  } catch (error) {
    redirectToLogin(error, res);
  }
});

module.exports = router;
