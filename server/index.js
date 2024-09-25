const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let users = {}; // Replace this with a database in production

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { password: hashedPassword, verified: false };
    res.json({ message: 'Registration successful! Please verify your email.' });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users[email];
    if (!user || !user.verified) {
        return res.status(400).json({ message: 'User not found or not verified.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
        res.json({ message: 'Login successful!' });
    } else {
        res.status(400).json({ message: 'Invalid password.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


