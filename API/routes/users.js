const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');

router.get('/', async (req, res) => {
    try{
        const users = await UserController.list();
        res.json(users); 
    }
    catch(error){
        res.status(404).send('users not found');
    }
});

router.post('/registo', async (req, res) => {
    try {
        const newUser = await UserController.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).send('Failed to create user');
    }
});
module.exports = router;