const express = require('express');
const cors = require('cors');
const connectDb = require('./database');
const { User } = require('./models/user.model');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDb();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// ADD USERS
app.post('/add-user', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, password });
            await user.save();
            return res.status(200).json({ success: true, user });
        } else {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET USERS
app.get('/get-users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json({ success: true, users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

//GET VICTIMS
app.get('/get-victims', async (req, res) => {
    try {
        const victims = await Victim.find();
        return res.status(200).json({ success: true, victims });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Failed to fetch victims' });
    } 
});

//EDIT VICTIMS
app.post('/edit-victims', async (req, res) => {
    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ success: false, message: 'Victim ID and new status are required' });
    }

    try {
        const updatedVictim = await Victim.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedVictim) {
            return res.status(404).json({ success: false, message: 'Victim not found' });
        }

        return res.status(200).json({ success: true, message: 'Status updated', victim: updatedVictim });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Error updating status' });
    }
});



app.listen(process.env.PORT, () => {
    console.log(`Server Running Successfully ✅`)
});