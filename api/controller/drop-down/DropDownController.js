/**
 * @name Dropdowns
 * @file DropdownController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain  all the dropdown methods.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { HTTP_STATUS_CODES } = require('../../config/constants');
const { User } = require('../../models');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'surname', 'type'] });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'list of users',
            data: users,
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

module.exports = {
    getUsers
}