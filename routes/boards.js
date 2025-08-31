const express = require('express');
const { boardModel } = require('../models/boardModel');

const router = express.Router();

// POST /boards - Create new board item
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;

        // Validate required fields
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Title is required and must be a string' });
        }

        // Check for unwanted properties
        if (req.body.id !== undefined || req.body.stage !== undefined) {
            return res.status(400).json({ error: 'id and stage properties should not be provided' });
        }

        // Create new item
        const newItem = await boardModel.create(title);

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error creating board item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /boards/:id - Update board item stage
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { stage } = req.body;

        // Validate ID
        const itemId = parseInt(id);
        if (isNaN(itemId)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        // Validate stage
        if (stage === undefined || stage === null) {
            return res.status(400).json({ error: 'Stage is required' });
        }

        if (!Number.isInteger(stage) || stage < 1 || stage > 3) {
            return res.status(400).json({ error: 'Stage must be 1, 2, or 3' });
        }

        // Update item stage
        const updatedItem = await boardModel.updateStage(itemId, stage);

        res.status(200).json(updatedItem);
    } catch (error) {
        if (error.message === 'Item not found') {
            return res.status(404).json({ error: 'Item not found' });
        }

        console.error('Error updating board item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;