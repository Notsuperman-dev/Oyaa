// backend/routes/userRoutes.js
const express = require('express');
const {
    getUser,
    updateUser,
    deleteUser,
    getUserGroups,
    getBlockedUsers,
    blockUser,
    unblockUser,
    updatePassword // Import the updatePassword function here
} = require('../controllers/userController');
const router = express.Router();

router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);
router.get('/:username/groups', getUserGroups);

// Correct the route here
router.put('/:userId/password', updatePassword); // Use the imported function

// Blocked users routes
router.get('/:userId/blocked-users', getBlockedUsers);
router.post('/:userId/block-user', blockUser);
router.post('/:userId/unblock-user', unblockUser);

module.exports = router;
