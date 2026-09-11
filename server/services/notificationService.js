const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendNewSchemeEmail } = require('../utils/emailService');

/**
 * Dispatches email notifications to opted-in users when a new scheme is created.
 * Safe & non-blocking: never fails scheme creation if emails fail.
 */
async function notifyUsersOfNewScheme(scheme) {
  try {
    const optedInUsers = await User.find(
      { 'preferences.emailNotifications': true },
      { name: 1, email: 1 }
    );

    if (!optedInUsers || optedInUsers.length === 0) {
      return { notifiedCount: 0, totalOptedIn: 0 };
    }

    let sentCount = 0;
    let failedCount = 0;

    for (const user of optedInUsers) {
      // Check if notification record already exists to prevent duplicate emails
      const existing = await Notification.findOne({
        user: user._id,
        scheme: scheme._id,
        type: 'new_scheme'
      });

      if (existing && existing.status === 'sent') {
        continue; // Already delivered, skip
      }

      // Record notification attempt
      let notification = existing;
      if (!notification) {
        try {
          notification = await Notification.create({
            user: user._id,
            scheme: scheme._id,
            type: 'new_scheme',
            status: 'pending'
          });
        } catch (dupErr) {
          if (dupErr.code === 11000) {
            notification = await Notification.findOne({
              user: user._id,
              scheme: scheme._id,
              type: 'new_scheme'
            });
            if (notification && notification.status === 'sent') continue;
          } else {
            console.error('Failed to create notification record:', dupErr);
            continue;
          }
        }
      }

      // Send transactional email
      const result = await sendNewSchemeEmail({
        to: user.email,
        userName: user.name,
        scheme
      });

      if (result.delivered) {
        notification.status = 'sent';
        notification.sentAt = new Date();
        notification.error = null;
        await notification.save();
        sentCount += 1;
      } else {
        notification.status = 'failed';
        notification.error = result.error || 'Delivery failed';
        await notification.save();
        failedCount += 1;
      }
    }

    return {
      totalOptedIn: optedInUsers.length,
      sentCount,
      failedCount
    };
  } catch (err) {
    console.error('Error in notifyUsersOfNewScheme worker:', err);
    return { error: err.message };
  }
}

module.exports = {
  notifyUsersOfNewScheme
};
