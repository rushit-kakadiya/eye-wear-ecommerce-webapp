const User = require('./users');
const UserDevices = require('./devices');
const UserWishlist = require('./wishlist');
const UserOtp = require('./otp');
const UserCards = require('./cards');
const UserAddress = require('./address');
const UserNotifications = require('./notification');
const Optician = require('./optician');
const UserPrescription = require('./prescription');
const UserReferral = require('./user-referral');
const UserCredits = require('./user-credits');
const UserLocation = require('./user-location');
const UserTier = require('./user-tier');
const UserRoles = require('./user-roles');
const Roles = require('./roles');
const RoleAccess = require('./role-access');

module.exports = {
  User,
  UserDevices,
  UserWishlist,
  UserOtp,
  UserCards,
  UserAddress,
  UserNotifications,
  Optician,
  UserPrescription,
  UserReferral,
  UserCredits,
  UserLocation,
  UserTier,
  UserRoles,
  Roles,
  RoleAccess
};
