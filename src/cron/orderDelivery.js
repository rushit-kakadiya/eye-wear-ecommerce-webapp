const config = require('config');
const cron = require('node-cron');
const { constant, utils } = require('../core');
const { database: db } = require('../utilities');
const service = require('../services');

const bunyanLogger = require('../core/bunyanLogger');
const logger = bunyanLogger.getInstance();

const schedule = '*/15 * * * *';
let cron_code = 'ninja_order_pickup';

let task = cron.schedule(schedule, async () => {
  try {
    const holidays = await db.findOneByCondition({ year: new Date().getFullYear().toString() }, 'Holidays', ['dates']);
    const today = new Date();
    let nextDate = new Date(today.setDate(today.getDate() + 1));
    let yyyy = nextDate.getFullYear();
    let dd = nextDate.getDate();
    let mm = nextDate.getMonth() + 1;

    // If Today is saturday     
    if (today.getDay() === 6) {
      nextDate = new Date(today.setDate(today.getDate() + 2));
      dd = nextDate.getDate();
      mm = nextDate.getMonth() + 1;
      if (holidays.dates.includes(yyyy + '-' + mm + '-' + dd)) {
        nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
        dd = nextDate.getDate();
        mm = nextDate.getMonth() + 1;
      }
    }
    if (holidays.dates.includes(yyyy + '-' + mm + '-' + dd)) {
      nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
      dd = nextDate.getDate();
      mm = nextDate.getMonth() + 1;
    }
    // if next day is Sunday
    if (nextDate.getDay() === 0) {
      nextDate = new Date(nextDate.setDate(nextDate.getDate() + 1));
      dd = nextDate.getDate();
      mm = nextDate.getMonth() + 1;
    }

    const date = yyyy + '-' + mm + '-' + dd;

    const OrderDetail = await db.findByCondition({
      order_status: constant.order_status.ORDER_READY_FOR_DELIVERY,
      is_local_order: false
    }, 'OrderDetail', ['order_no', 'address_id', 'store_id', 'payment_req_id']);
    const promise = OrderDetail.map(async (row, index) => {
      const userAddress = await db.findOneByCondition({ id: row.address_id }, 'UserAddress');
      const { storeAddress } = config.ninjaExpress;
      const requested_tracking_number = utils.generateRandom(10, false); // row.payment_req_id;
      const merchant_order_number = row.order_no;
      const result = await service.ninjaExpress.generateOrder({
        countryCode: 'ID',
        data: {
          'service_type': 'Parcel',
          'service_level': 'Standard',
          'requested_tracking_number': requested_tracking_number,
          'reference': {
            'merchant_order_number': merchant_order_number
          },
          'from': {
            'name': storeAddress.name,
            'phone_number': storeAddress.phone, //'+6512222222222', //
            'email': storeAddress.email, //'john.doe@gmail.com', //
            'address': {
              'address1': storeAddress.address,
              'city': storeAddress.city, //'Simpang Ampat', //
              'state': storeAddress.store_region, //'Pulau Pinang', //
              'address_type': storeAddress.address_type,
              'country': storeAddress.country, //'SG',
              'postcode': storeAddress.zipcode //'189852'
            }
          },
          'to': {
            'name': userAddress.receiver_name, //'Jasdeep', //
            'phone_number': userAddress.phone_number, //'+6512222222211', //
            'email': userAddress.email, //'jasdeep@supertal.io', //
            'address': {
              'address1': userAddress.address,
              'city': userAddress.city, //'Singapore', //
              'province': userAddress.province, //'Singapore', //
              'country': userAddress.country,
              'postcode': userAddress.zip_code, // '820181' //
            }
          },
          'parcel_job': {
            'is_pickup_required': true,
            'pickup_service_type': 'Scheduled',
            'pickup_service_level': 'Standard',
            'pickup_date': date,
            'pickup_timeslot': {
              'start_time': '09:00',
              'end_time': '12:00',
              'timezone': 'Asia/Jakarta'
            },
            'pickup_instructions': 'Pickup with care!',
            'delivery_instructions': 'If recipient is not around, leave parcel in power riser.',
            'delivery_start_date': date,
            'delivery_timeslot': {
              'start_time': '09:00',
              'end_time': '22:00',
              'timezone': 'Asia/Jakarta'
            },
            'dimensions': {
              'size': 'S',
              'weight': 0.48, //480gr
              'length': 17.50, //17.5cm
              'width': 7.50, //7.5cm
              'height': 7.50 //7.5cm
            }
          }
        }
      });
      if (result) {
        const order = db.updateOneByCondition({
          order_status: constant.order_status.ORDER_PICKUP_PENDING,
          updated_at: new Date()
        }, {
          order_no: row.order_no
        }, 'OrderDetail');
        const history = db.saveData({ order_no: row.order_no, status: constant.order_status.ORDER_PICKUP_PENDING, source: 'app' }, 'OrdersHistory');
        return await Promise.all([order, history]);
      } else {
        const ninjaPayload = {
          shipper_id: 0,
          status: constant.ninja_order_status.ORDER_PICKUP_UNCONFIRMED,
          shipper_ref_no: 'null',
          tracking_ref_no: requested_tracking_number,
          shipper_order_ref_no: merchant_order_number,
          timestamp: new Date(),
          previous_status: '-',
          tracking_id: 'null'
        };
        const order = db.saveData({ order_no: merchant_order_number, status: constant.ninja_order_status.ORDER_PICKUP_UNCONFIRMED, source: 'app' }, 'OrdersHistory');
        const ninja = db.saveData(ninjaPayload, 'NinjaExpress');
        return await Promise.all([order, ninja]);
      }
    });
    Promise.all(promise)
      .then(res => console.log('result => '))
      .catch(error => console.log('error => ', JSON.stringify(error)));
    isRunningFlag = false;
    console.log('--------- Ninja delivery complete --------');

    logger.info({ cron_code }, 'Ninja delivery complete');
  } catch (error) {
    logger.error({ cron_code }, error);
  }
}, {
  scheduled: false,
});


module.exports = [task];
