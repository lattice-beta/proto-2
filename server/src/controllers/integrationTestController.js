const express = require('express');
const User = require('../models/user');

export async function deleteUser(request, res) {
    return User.deleteOne({ name: 'pebliointegrationtest###$$$' }, (err) => {
        if (err) {
            return res.status(500).send({ err });
        }
        return res.status(200).send();
      })
}

const integrationTestRoutes = express.Router();
integrationTestRoutes.route('/').delete(deleteUser);
module.exports = integrationTestRoutes;