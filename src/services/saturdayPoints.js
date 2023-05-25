const { constant } = require('../core');

const calculateRewardsAngainstOrder = (data, level) => {
    let reward = data.order_amount * (constant.level[level] / 100);
    return calculateDiscountAgainstPoints(reward, constant.level[level]);
};

const calculateDiscountAgainstPoints = (reward, percentage) => {
    let discount = Math.floor(reward/5000)*5000;
    return calculatePointsAgainstRewards(reward, discount, percentage);
};

const calculatePointsAgainstRewards = (reward, discount, percentage) => {
    let points =  discount/1000;
    return {reward, points, discount, percentage};
};


module.exports = {
    calculateRewardsAngainstOrder,
    calculatePointsAgainstRewards,
    calculateDiscountAgainstPoints
};
