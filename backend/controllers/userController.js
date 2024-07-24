const User = require('../models/User');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from response
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
const getUsersPerMonth = async (req, res) => {
    const { year } = req.query;
    
    if (!year) {
        return res.status(400).json({ message: 'Year is required' });
    }

    try {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year + 1}-01-01`);
        
        const users = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        const months = Array.from({ length: 12 }, (_, i) => ({
            _id: i + 1,
            count: 0
        }));

        users.forEach(user => {
            months[user._id - 1].count = user.count;
        });

        res.json(months);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUsersPerMonth,
};