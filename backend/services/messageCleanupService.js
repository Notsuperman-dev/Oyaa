// backend\services\messageCleanupService.js
const RoomMessage = require('../models/RoomMessage');

async function deleteExpiredMessages() {
  try {
    await RoomMessage.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });
    console.log('Expired messages deleted successfully.');
  } catch (error) {
    console.error('Error deleting expired messages:', error);
  }
}

// Schedule the task to run every hour
setInterval(deleteExpiredMessages, 60 * 60 * 1000); // Every 1 hour

module.exports = {
  deleteExpiredMessages,
};
