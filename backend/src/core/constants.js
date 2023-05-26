/*
 * @file: constants.js
 * @description: It Contain all constants for application.
 */

/****************** Constants ******************/
const constant = {
  device: {
    ios: 'ios',
    android: 'android',
    web: 'web',
    hybrid: 'hybrid'
  },
  notificationType: {
    orderReady: 'order-ready',
    orderOTW: 'order-on-the-way',
    orderCompleted: 'order-completed',
    paymentPending: 'payment-pending',
    birthdayVoucherNotification: 'birthday-voucher-notification'
  },
  saturday_cs_no: '+6281803078888',
  saturday_pm_no: '+6282341936222',
  email: { help: 'help@eyewear.com', hto: 'hto@eyewear.com' },
  whtsapp_templates: {
    hto_return: '',
    hto_reschedule: '',
    welcome_user: '',
    hto_inside_jakarta: '',
    hto_outside_jakarta: '',
    hto_outside_area: '',
    payment_pending: '',
    purchase_pickup: '',
    purchase_delivery: '',
    order_shipped: '',
    order_ready_for_pickup: '',
    first_payment: ''
  },
  limit: 10,
  virtual_account: {
    bca: 'BCA',
    mandiri: 'MANDIRI',
    bri: 'BRI',
    bni: 'BNI'
  },
  cardless_type: {
    kredivo: 'KREDIVO'
  },
  cardless_payment_type: {
    days30: '30_days',
    months3: '3_months',
    months6: '6_months',
    months12: '12_months'
  },
  payment_method: {
    CASH: 0,
    CARD: 1,
    VIRTUAL_ACCOUNT: 2,
    CARDLESS_PAYMENT: 3,
    NO_PAYMENT: 4,
    EDC: 5,
    BANK_TRANSFER: 6,
    INSURANCE: 7,
    ATOME: 8,
    MEKARI: 9,
    DANA: 10,
    OVO: 11,
    GO_PAY: 12,
    LINK_AJA: 13,
    SHOPEE_PAY: 14,
    PAYPAL: 15,
    DEPT_STORE: 16,
    XENDIT_CARD: 17,
    CORPORATE_TRY_ON: 18,
    ENDORSEMENT: 19,
    EMPLOYEE_CLAIM: 20,
    WARRANTY: 21,
    XENDIT_INVOICE: 22,
    0: 'CASH',
    1: 'CARD',
    2: 'VIRTUAL_ACCOUNT',
    3: 'CARDLESS_PAYMENT',
    4: 'NO_PAYMENT',
    5: 'EDC',
    6: 'BANK_TRANSFER',
    7: 'INSURANCE',
    8: 'ATOME',
    9: 'MEKARI',
    10: 'DANA',
    11: 'OVO',
    12: 'GO_PAY',
    13: 'LINK_AJA',
    14: 'SHOPEE_PAY',
    15: 'PAYPAL',
    16: 'Dept Store',
    17: 'XENDIT CARD',
    18: 'Corporate Try On',
    19: 'Endorsement',
    20: 'Employee Claim',
    21: 'warranty',
    22: 'Xendit Invoice'
  },
  order_status: {
    PAYMENT_INITIATED: 'payment_initiated',
    PAYMENT_PENDING: 'payment_pending',
    PAYMENT_CONFIRMED: 'payment_confirmed',
    PAYMENT_FAILED: 'payment_failed',
    PAYMENT_CANCELLED: 'payment_cancelled',
    ORDER_CANCEL: 'order_cancelled',
    ORDER_PENDING: 'order_pending',
    ORDER_CONFIRMED: 'order_confirmed',
    ORDER_READY_FOR_COLLECT: 'ready_to_collect',
    ORDER_READY_FOR_DELIVERY: 'ready_for_delivery',
    ORDER_PICKUP_PENDING: 'order_pickup_pending',
    ORDER_SHIPPED: 'order_shipped',
    ORDER_DELIVERED: 'order_delivered',
    ORDER_RETURNED: 'order_returned',
    ORDER_COMPLETED: 'order_completed',
    ORDER_IN_TRANSIT: 'in_transit'
  },
  delivery_status: {
    INITIATED: 'initiated'
  },
  payment_status: {
    PENDING: 'PENDING',
    AUTHORIZED: 'AUTHORIZED',
    CAPTURED: 'CAPTURED',
    FAILED: 'FAILED',
    PAYMENT_INITIATED: 'payment_initiated',
    PAYMENT_PENDING: 'payment_pending',
    PAYMENT_CONFIRMED: 'payment_confirmed',
    PAYMENT_FAILED: 'payment_failed',
    PAYMENT_CANCELLED: 'payment_cancelled',
    PARTIAL_PAID: 'partial_paid',
    REMAINING_PAID: 'remaining_paid',
  },
  appointment_status: {
    APPOINTMENT_CONFIRMED: 'appointment_confirmed',
    APPOINTMENT_RESCHEDULED: 'appointment_rescheduled',
    APPOINTMENT_COMPLETED: 'appointment_completed',
    APPOINTMENT_CANCELLED: 'appointment_cancelled',
    APPOINTMENT_DRAFT: 'appointment_draft',
    OPTICIAN_UPDATED: 'optician_updated'
  },
  sale_channel: {
    APP: 'app',
    WHATSAPP: 'whatsapp',
    STORE: 'store',
  },
  turboly_order_status: {
    ORDER_DRAFT: 'draft',
    ORDER_CONFIRMED: 'order_picking',
    ORDER_READY_FOR_COLLECT: 'ready_to_collect',
    ORDER_READY_FOR_DELIVERY: 'ready_for_delivery',
    ORDER_IN_TRANSIT: 'in_transit',
    ORDER_COMPLETED: 'completed',
    ORDER_CANCELLED: 'cancelled',
  },
  turboly_sale: {
    NORMAL: 1,
    ECOMMERCE: 2
  },
  ninja_order_status: {
    PENDING_PICKUP: 'Pending Pickup',
    ORDER_RETURN: 'Order Return',
    ORDER_PICKUP_UNCONFIRMED: 'Order Pickup Unconfirmed',
    ORDER_RETURN_UNCONFIRMED: 'Order Return Unconfirmed'
  },
  product_category: {
    1: 'OPTICAL',
    2: 'SUNWEAR',
    3: 'CLIPON'
  },
  product_type: {
    FRAME: 1,
    LENSE: 2,
    CLIPON: 3
  },
  frame_sizes: {
    SZ01: 'Narrow',
    SZ02: 'Medium',
    SZ03: 'Wide',
    SZ04: 'Extra Wide'
  },
  material: {
    'metal': {
      'label': 'Metal',
      'key': 'metal',
      'url': 'material/metal.jpg',
      'description': 'Made out of stainless steel for durability and lightweight, you will forget that you\'re actually wearing glasses!'
    },
    'acetate': {
      'label': 'Acetate',
      'key': 'acetate',
      'url': 'material/acetate.jpg',
      'description': 'Plant-based, highly-durable, and anti-irritation, Italian acetate turns plant into non-wasteful plastics!',
    },
    'titanium': {
      'label': 'Japanese Titanium',
      'key': 'titanium',
      'url': 'material/titanium.jpg',
      'description': 'Japanese titanium is lightweight and durable, making your glasses easy to wear, and lasting longer than your eye\'s power itself!',
    },
    'mixed': {
      'label': 'Japanese Titanium and Acetate',
      'key': 'mixed',
      'url': 'material/titanium-acetate.jpg',
      'description': 'Durable, lightweight, and anti-irritant, the three most important factors in building the perfect pair of glasses!'
    }
  },
  faceShapes: {
    'round': {
      'label': 'Round',
      'key': 'round',
      'male_icon_url': 'URL',
      'female_icon_url': 'URL'
    },
    'square': {
      'label': 'Square',
      'key': 'square',
      'male_icon_url': 'URL',
      'female_icon_url': 'URL'
    },
    'oval': {
      'label': 'Oval',
      'key': 'oval',
      'male_icon_url': 'URL',
      'female_icon_url': 'URL'
    },
    'heart': {
      'label': 'Heart',
      'key': 'heart',
      'male_icon_url': 'URL',
      'female_icon_url': 'URL'
    }
  },
  frameShapes: {
    'round': {
      'label': 'Round',
      'key': 'round',
      'icon_url': 'URL'
    },
    'square': {
      'label': 'Square',
      'key': 'square',
      'icon_url': 'URL'
    },
    'aviator': {
      'label': 'Aviator',
      'key': 'aviator',
      'icon_url': 'URL'
    },
    'cateye': {
      'label': 'Cat-Eyes',
      'key': 'cateye',
      'icon_url': 'URL'
    }
  },
  bucket: {
    product: 'eyewear-prod',
    product_url: ''
  },
  banks: [
    'BANK RAKYAT INDONESIA',
    'BANK MANDIRI',
    'BANK NEGARA INDONESIA',
    'BANK TABUNGAN NEGARA',
    'BANK DANAMON INDONESIA',
    'BANK PERMATA',
    'BANK CENTRAL ASIA',
    'BANK MAYBANK INDONESIA',
    'PAN INDONESIA BANK',
    'BANK CIMB NIAGA',
    'BANK UOB INDONESIA',
    'BANK OCBC NISP',
    'BANK ARTHA GRAHA INTERNASIONAL',
    'BANK BUMI ARTA',
    'BANK HSBC INDONESIA',
    'BANK JTRUST INDONESIA',
    'BANK MAYAPADA INTERNATIONAL',
    'BANK OF INDIA INDONESIA',
    'BANK MUAMALAT INDONESIA',
    'BANK MESTIKA DHARMA',
    'BANK SHINHAN INDONESIA',
    'BANK SINARMAS',
    'BANK MASPION INDONESIA',
    'BANK GANESHA',
    'BANK ICBC INDONESIA',
    'BANK QNB INDONESIA',
    'BANK WOORI SAUDARA INDONESIA 1906',
    'BANK MEGA',
    'BANK BNI SYARIAH',
    'BANK BUKOPIN',
    'BANK SYARIAH MANDIRI',
    'BANK KEB HANA INDONESIA',
    'BANK MNC INTERNASIONAL',
    'BANK RAKYAT INDONESIA AGRONIAGA',
    'BANK SBI INDONESIA',
    'BANK MEGA SYARIAH',
    'BANK INDEX SELINDO',
    'BANK MAYORA',
    'BANK CHINA CONSTRUCTION BANK INDONESIA',
    'BANK DBS INDONESIA',
    'BANK RESONA PERDANIA',
    'BANK MIZUHO INDONESIA',
    'BANK CAPITAL INDONESIA',
    'BANK BNP PARIBAS INDONESIA',
    'BANK ANZ INDONESIA',
    'BANK IBK INDONESIA',
    'BANK NET INDONESIA SYARIAH',
    'BANK CTBC INDONESIA',
    'BANK COMMONWEALTH',
    'BANK BTPN',
    'BANK VICTORIA SYARIAH',
    'BANK BRISYARIAH',
    'BANK JABAR BANTEN SYARIAH',
    'BANK BISNIS INTERNASIONAL',
    'BANK JASA JAKARTA',
    'BANK NEO COMMERCE',
    'BANK DIGITAL BCA',
    'BANK NATIONALNOBU',
    'BANK INA PERDANA',
    'BANK PANIN DUBAI SYARIAH',
    'PRIMA MASTER BANK',
    'BANK SYARIAH BUKOPIN',
    'BANK SAHABAT SAMPOERNA',
    'BANK OKE INDONESIA',
    'BANK AMAR INDONESIA',
    'BANK KESEJAHTERAAN EKONOMI',
    'BANK BCA SYARIAH',
    'BANK JAGO TBK',
    'BANK BTPN SYARIAH',
    'BANK MULTIARTA SENTOSA',
    'BANK FAMA INTERNASIONAL',
    'BANK MANDIRI TASPEN​',
    'BANK VICTORIA INTERNATIONAL',
    'BANK HARDA INTERNASIONAL',
    'BPD JAWA BARAT DAN BANTEN',
    'BPD DKI',
    'BPD DAERAH ISTIMEWA YOGYAKARTA',
    'BPD JAWA TENGAH',
    'BPD JAWA TIMUR',
    'BPD JAMBI',
    'BANK ACEH SYARIAH',
    'BPD SUMATERA UTARA',
    'BPD SUMATERA BARAT',
    'BPD RIAU KEPRI',
    'BPD SUMATERA SELATAN DAN BANGKA BELITUNG',
    'BPD LAMPUNG',
    'BPD KALIMANTAN SELATAN',
    'BPD KALIMANTAN BARAT',
    'BPD KALIMANTAN TIMUR DAN KALIMANTAN UTARA',
    'BPD KALIMANTAN TENGAH',
    'BPD SULAWESI SELATAN DAN SULAWESI BARAT',
    'BPD SULAWESI UTARA DAN GORONTALO',
    'BANK NTB SYARIAH',
    'BPD BALI',
    'BPD NUSA TENGGARA TIMUR',
    'BPD MALUKU DAN MALUKU UTARA',
    'BPD PAPUA',
    'BPD BENGKULU',
    'BPD SULAWESI TENGAH',
    'BPD SULAWESI TENGGARA',
    'BPD BANTEN',
    'CITIBANK N.A.',
    'JP MORGAN CHASE BANK NA',
    'BANK OF AMERICA N.A',
    'BANGKOK BANK PCL',
    'MUFG BANK LTD',
    'STANDARD CHARTERED BANK',
    'DEUTSCHE BANK AG',
    'BANK OF CHINA (HONG KONG) LIMITED'
  ],
  warrantyPrice: 100000,
  referralDetails: {
    referralAmount: 250000,
    voucherAmount: 250000,
    voucherTitle: 'Referral Reward',
    voucherImageKey: 'assets/vouchers/referral-voucher-banner.png',
    minimumCartAmount: 1000000
  },
  warrantySKU: 'STWTY000',
  voucherType: {
    percentage: 1,
    absolute: 2
  },
  voucherCategory: {
    GENERIC: 'generic',
    USER: 'user',
    REFERRAL: 'referral'
  },
  voucherTag: {
    GENERIC: 'generic',
    USER: 'user',
    REFERRAL: 'referral',
    BIRTHDAY: 'birthday'
  },
  location: {
    language: 'en-US',
    country_code: 'ID',
    currency_code: 'IDR',
    timezone: '+0700',
  },
  lenseColors: [
    {
      lense_color_code: 'CLEAR',
      lense_color_label: 'Clear'
    },
    {
      lense_color_code: 'BLACK',
      lense_color_label: 'Black'
    },
    {
      lense_color_code: 'BLUE',
      lense_color_label: 'Blue'
    }
  ],
  priceFilters: {
    ID: [
      { key: '0_800K', title: '0 - 800K', min_price: 0, max_price: 800000 },
      { key: '800K_1300K', title: '800K - 1300K', min_price: 800001, max_price: 1300000 },
      { key: '1300K_1500K', title: '1300K - 1500K', min_price: 1300001, max_price: 1500000 },
      { key: '1500K_50000K', title: '1500K & above', min_price: 1500001, max_price: 50000000 },
    ],
    US: [
      { key: '0_500USD', title: '0 - 500 USD', min_price: 0, max_price: 500 }
    ],
    SG: [
      { key: '0_500SGD', title: '0 - 500 SGD', min_price: 0, max_price: 500 }
    ]
  },
  CITCALL: 'CITCALL',
  SMS: 'MSG',
  times: ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  dates: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  defaultPackages: 'PA06,PA03,PA02',
  promoDiscountLayers: [
    {
      id: 1,
      name: 'Bank',
      options: [{
        id: 1,
        name: 'BCA'
      },
      {
        id: 2,
        name: 'OCBC'
      },
      {
        id: 3,
        name: 'BNI'
      },
      {
        id: 4,
        name: 'CITIBANK'
      }]
    },
    {
      id: 2,
      name: 'Partnership',
      options: [{
        id: 1,
        name: 'BNI Employees'
      },
      {
        id: 2,
        name: 'BCA Employees'
      },
      {
        id: 3,
        name: 'Smartfren'
      },
      {
        id: 4,
        name: 'Telkomsel'
      },
      {
        id: 5,
        name: 'Indosat'
      }]
    },
    {
      id: 3,
      name: 'Seasonal',
      options: [{
        id: 1,
        name: '2021'
      },
      {
        id: 2,
        name: '2022'
      }]
    },
    {
      id: 4,
      name: 'Internal',
      options: [{
        id: 1,
        name: 'Employee'
      },
      {
        id: 2,
        name: 'Family and Friends'
      }]
    },
    {
      id: 5,
      name: 'Store',
      options: [{
        id: 1,
        name: 'Customer Acquisition'
      }]
    },
    {
      id: 6,
      name: 'HTO',
      options: [{
        id: 1,
        name: 'Customer Acquisition'
      }]
    },
    {
      id: 7,
      name: 'Dept Store',
      options: [{
        id: 1,
        name: 'SOGO'
      },
      {
        id: 2,
        name: 'Central'
      },
      {
        id: 3,
        name: 'GL'
      }]
    },
    {
      id: 8,
      name: 'Marketing',
      options: [{
        id: 1,
        name: 'Influencer'
      }]
    }
  ],
  emailsForDeleteOrder: ['vega@eyewear.com', 'rama@eyewear.com', 'andrew@eyewear.com', 'storemanager@eyewear.com', 'azhar@eyewear.com'],
  tiers: [
    { name: 'Basic', referral: { min: 0, max: 2 }, amount: { min: 0, max: 5000000 }, validity: '31 Dec 2023' },
    { name: 'Silver', referral: { min: 2, max: 6 }, amount: { min: 5000000, max: 10000000 }, validity: '31 Dec 2023' },
    { name: 'Platinum', referral: { min: 6, max: 6 }, amount: { min: 10000000, max: 10000000 }, validity: '31 Dec 2023' }
  ],
  level: {
    1: 5,
    2: 10,
    3: 15
  },
  store: {
    6591: { name: 'CENTRAL GRAND INDONESIA', image: '' },
    6590: { name: 'GANDARIA CITY MALL', image: '' },
    6763: { name: 'GRAND INDONESIA', image: '' },
    6797: { name: 'LIPPO MAL PURI', image: '' },
    6589: { name: 'LOTTE SHOPPING AVENUE', image: '' },
    6593: { name: 'GALERIES LAFAYETTE PACIFIC PLACE', image: '' },
    6764: { name: 'PLAZA INDONESIA', image: '' },
    6592: { name: 'SOGO PLAZA SENAYAN', image: '' },
    6998: { name: 'PONDOK INDAH MALL', image: '' },
    7337: { name: 'BINTARO XCHANGE', image: '' },
    'placeholder': { name: 'PLAZA INDONESIA', image: '' },
  },
  lense_brands: {
    dailies: { name: 'Dailies AquaComfort Plus', image: '' },
    air_optix: { name: 'Air Optix Aqua', image: '' },
    freshlook: { name: 'Freshlook Colorblends', image: '' },
    //eyewear_contact_lens : { name : 'Eyewear Contact Lens', image : '' },
  },
  ACL: {
    admin: [
      { url: '/user', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
      { url: '/voucher', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
      { url: '/voucher-detail', methods: ['GET'] },
      { url: '/members/performance', methods: ['GET'] }
    ],
    store_manager: [
      { url: '/user', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
      { url: '/voucher', methods: ['GET'] },
      { url: '/voucher-detail', methods: ['GET'] },
      { url: '/members/performance', methods: ['GET'] }
    ],
    customer_services: [
      { url: '/user', methods: ['GET', 'POST', 'PUT', 'DELETE'] },
      { url: '/voucher', methods: ['GET'] },
      { url: '/voucher-detail', methods: ['GET'] }
    ]
  },
  role: {
    'super-admin': 1,
    admin: 2,
    'store-manager': 3,
    'store-account': 4,
    'customer-services': 5,
    finance: 6
  },
  logs_type: {
    order: 'order',
    admin_user: 'admin_user',
    store: 'store',
    employee: 'employee',
    customer: 'customer'
  },
  logs_action: {
    signup: 'Customer sign up',
    add_cart_items: 'Customer add items to cart',
    update_cart_items: 'Customer updated items to cart',
    add_address: 'Customer add new address',
    update_address: 'Customer updated address',
    update_profile: 'Customer updated profile',
    add_prescription: 'Customer add new prescription',
    update_prescription: 'Customer updated prescription',
    payment_confirmed: 'Payment Confirmed',
    partial_paid: 'Partial Payment Paid',
    processed_payment_via: 'Customer processed payment via',
    ready_to_delivery: 'Items ready to delivery.'
  },
  avilabilty_type: {
    store: 1,
    app: 2,
    hto: 3,
    whatsapp: 4,
    website: 5
  }
};

module.exports = constant;
