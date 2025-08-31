const express = require('express');
const { createBoardItem, updateBoardItemStage } = require('../controllers/boardController');

const router = express.Router();

// POST /boards - Create new board item
router.post('/', createBoardItem);

// PUT /boards/:id - Update board item stage
router.put('/:id', updateBoardItemStage);

module.exports = router;