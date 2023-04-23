const express = require('express');
const router = express.Router();
const manageRoomController = require('../controllers/manageRoomController');

router.post('/', manageRoomController.handleRoom)
    .get('/', manageRoomController.getRooms)
    .delete('/:id', manageRoomController.deleteRooms);

module.exports = router;