const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Public (Change to private with authentication middleware later)
router.get('/', getAllUsers);
router.get('/users-per-month', async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const usersPerMonth = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $month: "$createdAt"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        res.json(usersPerMonth);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user data', error: err });
    }
});

module.exports = router;
