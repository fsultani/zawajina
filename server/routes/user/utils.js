const { usersCollection } = require("../../db");

const calculateImperialHeight = height => {
  const totalHeight = (height / 30.48).toString().split('.')
  const heightInFeet = totalHeight[0]
  const heightInInches = Math.round(Number(totalHeight[1].slice(0, 1)) * 12 * 0.1);

  return {
    heightInFeet,
    heightInInches,
  }
};

const getLastActive = async userId => {
  const [lastActiveResponse] = await usersCollection().find(
    {
      _id: userId
    },
  )
    .project({ lastActive: 1 })
    .toArray();

  const lastActiveEntry = lastActiveResponse.lastActive;

  let lastActive = 'Last Active: '

  const lastLogin = new Date(lastActiveEntry?.utc);
  const today = new Date();
  const minutesSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / 1000 / 60);

  /*
    List of endpoints that represent an "Online" user
  */
  const onlineEndpoints = ['/api/auth-session/login', '/api/register/profile-details', '/api/password/reset']
  const firstPositionEndpoint = lastActiveEntry?.endpoint;

  if (onlineEndpoints.includes(firstPositionEndpoint)) {
    lastActive = 'Online';

    /*
      Set expiredSessionMinutesAgo to 1440 minutes,
      which is equal to one day ago,
      which is the expiration value of the auth token
    */
    const expiredSessionMinutesAgo = 1440;

    if (minutesSinceLastLogin >= expiredSessionMinutesAgo) {
      lastActive = 'Last Active: '

      if (minutesSinceLastLogin === expiredSessionMinutesAgo) {
        lastActive += 'Just now';
      } else if (minutesSinceLastLogin === expiredSessionMinutesAgo + 1) {
        lastActive += '1 minute ago';
      } else if (minutesSinceLastLogin > expiredSessionMinutesAgo + 1 && minutesSinceLastLogin < expiredSessionMinutesAgo + 60) {
        lastActive += `${minutesSinceLastLogin - expiredSessionMinutesAgo} minutes ago`;
      } else if (minutesSinceLastLogin >= expiredSessionMinutesAgo + 60 && minutesSinceLastLogin < expiredSessionMinutesAgo + 60 * 2) {
        lastActive += '1 hour ago';
      } else if (minutesSinceLastLogin >= expiredSessionMinutesAgo + 60 * 2 && minutesSinceLastLogin < expiredSessionMinutesAgo + 60 * 24) {
        lastActive += `${Math.floor((minutesSinceLastLogin - expiredSessionMinutesAgo) / 60)} hours ago`;
      } else if (minutesSinceLastLogin >= expiredSessionMinutesAgo + 60 * 24 && minutesSinceLastLogin < expiredSessionMinutesAgo + 60 * 24 * 2) {
        lastActive += '1 day ago';
      } else if (minutesSinceLastLogin >= expiredSessionMinutesAgo + 60 * 24 * 2 && minutesSinceLastLogin < expiredSessionMinutesAgo + 60 * 24 * 30) {
        lastActive += `${Math.floor((minutesSinceLastLogin - expiredSessionMinutesAgo) / 60 / 24)} days ago`;
      } else if (minutesSinceLastLogin >= expiredSessionMinutesAgo + 60 * 24 * 30 && minutesSinceLastLogin < expiredSessionMinutesAgo + 60 * 24 * 30 * 2) {
        lastActive += '1 month ago';
      } else if (
        minutesSinceLastLogin >= expiredSessionMinutesAgo + 60 * 24 * 30 * 2 &&
        minutesSinceLastLogin < expiredSessionMinutesAgo + 60 * 24 * 30 * 12
      ) {
        lastActive += `${Math.floor((minutesSinceLastLogin - expiredSessionMinutesAgo) / 60 / 24 / 30)} months ago`;
      } else {
        lastActive += '12+ months ago';
      }
    }
  } else {
    if (minutesSinceLastLogin === 0) {
      lastActive += 'Just now';
    } else if (minutesSinceLastLogin === 1) {
      lastActive += '1 minute ago';
    } else if (minutesSinceLastLogin > 1 && minutesSinceLastLogin < 60) {
      lastActive += `${minutesSinceLastLogin} minutes ago`;
    } else if (minutesSinceLastLogin >= 60 && minutesSinceLastLogin < 60 * 2) {
      lastActive += '1 hour ago';
    } else if (minutesSinceLastLogin >= 60 * 2 && minutesSinceLastLogin < 60 * 24) {
      lastActive += `${Math.floor(minutesSinceLastLogin / 60)} hours ago`;
    } else if (minutesSinceLastLogin >= 60 * 24 && minutesSinceLastLogin < 60 * 24 * 2) {
      lastActive += '1 day ago';
    } else if (minutesSinceLastLogin >= 60 * 24 * 2 && minutesSinceLastLogin < 60 * 24 * 30) {
      lastActive += `${Math.floor(minutesSinceLastLogin / 60 / 24)} days ago`;
    } else if (minutesSinceLastLogin >= 60 * 24 * 30 && minutesSinceLastLogin < 60 * 24 * 30 * 2) {
      lastActive += '1 month ago';
    } else if (
      minutesSinceLastLogin >= 60 * 24 * 30 * 2 &&
      minutesSinceLastLogin < 60 * 24 * 30 * 12
    ) {
      lastActive += `${Math.floor(minutesSinceLastLogin / 60 / 24 / 30)} months ago`;
    } else {
      lastActive += '12+ months ago';
    }
  }

  return lastActive;
}

module.exports = {
  calculateImperialHeight,
  getLastActive,
}
