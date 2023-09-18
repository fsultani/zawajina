const express = require('express');
const { ObjectId } = require('mongodb');

const { checkIPAddress } = require('../../../middleware/checkAuthentication');
const { usersCollection, insertLogs, geoLocationData } = require('../../../db');
const { redirectToLogin } = require('../../../utils');

const router = express.Router();

router.put('/', async (req, res) => {
  try {
    const { authUser, userIPAddress, endpoint } = req;
    const { name, email } = req.body;
    const userId = authUser._id;

    let response;
    let shouldUpdate = false;
    let update = {}
    let logsUpdate = {}

    if (name !== authUser.name) {
      const invalidCharacters = /[0-9!@#$%^&*()_\+=[\]{}|:;"<,>\?\/\\~`]/g;
      const invalidName = invalidCharacters.test(name);

      if (name.length === 0 || invalidName) return res.sendStatus(400);

      shouldUpdate = true;
      update = {
        name,
      }
      const changedValue = `${authUser.name} => ${name}`;
      logsUpdate = {
        ...logsUpdate,
        name: changedValue,
      }
    }

    if (email !== authUser.email) {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (email.length === 0 || !emailRegex.test(email)) return res.sendStatus(400);

      shouldUpdate = true;
      update = {
        ...update,
        email,
      }

      const changedValue = `${authUser.email} => ${email}`;
      logsUpdate = {
        ...logsUpdate,
        email: changedValue,
      }
    }

    if (shouldUpdate) {
      response = await usersCollection().findOneAndUpdate(
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
    } else {
      response = {
        value: {
          ...authUser,
        }
      }
    }

    return res.status(200).send({
      name: response.value.name,
      email: response.value.email,
    });
  } catch (error) {
    redirectToLogin(error, res);
  }
});

router.put('/status', async (req, res) => {
  try {
    const { authUser, endpoint } = req;
    const authUserId = ObjectId(authUser._id);
    const accountStatus = req.body.accountStatus;

    const { userIPAddress } = await checkIPAddress(req);
    const locationData = await geoLocationData(userIPAddress, authUser?.lastActive);

    const now = new Date();

    const _account = {
      ...authUser._account,
      user: {
        accountStatus,
        local: now.toLocaleString(),
        utc: now,
        ...locationData,
      },
    };

    await usersCollection().findOneAndUpdate(
      { _id: authUserId },
      {
        $set: {
          _account,
        },
      },
    )

    await insertLogs({
      _account: _account.status,
    },
      userIPAddress,
      endpoint,
      authUserId
    );

    return res.sendStatus(201);
  } catch (error) {
    redirectToLogin(error, res);
  }
});

module.exports = router;
