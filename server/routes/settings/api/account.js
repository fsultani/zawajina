const express = require('express');
const { ObjectId } = require('mongodb');

const { usersCollection, insertLogs } = require('../../../db');
const { redirectToLogin } = require('../../../utils');

const router = express.Router();

router.put('/', async (req, res) => {
  try {
    const { authUser } = req;
    const { name, email } = req.body;
    const authUserId = authUser._id;

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

      insertLogs(req, {
        ...logsUpdate,
      });
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
    const { authUser } = req;
    const authUserId = ObjectId(authUser._id);
    const userAccountStatus = req.body.accountStatus;

    const _account = {
      ...authUser._account,
      userAccountStatus,
    };

    await usersCollection().findOneAndUpdate(
      { _id: authUserId },
      {
        $set: {
          _account,
        },
      },
    )

    const changedValue = `${authUser._account.userAccountStatus} => ${userAccountStatus}`;
    insertLogs(req, {
      _account: changedValue,
    });

    return res.sendStatus(201);
  } catch (error) {
    redirectToLogin(error, res);
  }
});

module.exports = router;
