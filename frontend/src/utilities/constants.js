import React from 'react';

export const orderStatus = [
  { value: 'payment_initiated', label: 'Payment Initiated' },
  { value: 'payment_pending', label: 'Payment Pending' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'order_cancelled', label: 'Order Cancelled' },
  { value: 'order_pending', label: 'Order Pending' },
  { value: 'order_confirmed', label: 'Order Confirmed' },
  { value: 'ready_to_collect', label: 'Ready to Collect' },
  { value: 'ready_for_delivery', label: 'Ready for Delivery' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'order_delivered', label: 'Order Delivered' },
  { value: 'order_returned', label: 'Order Returned' },
  { value: 'order_completed', label: 'Order Completed' },
];
export const paymentStatus = [
  { value: 'partial_paid', label: 'Partial Paid' },
  { value: 'remaining_paid', label: 'Remaining Paid' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'payment_failed', label: 'Payment Failed' },
  { value: 'payment_cancelled', label: 'Payment Cancelled' }
];
export const opticianList = ["Raden Muhamad Yaser Napisi", "Moh Sandian", "Kusnadi", "Brian Anas Putra", "Muhamad Fuad Dzikrulloh", "Bagas Cindo", "Teguh Fadilah Falentino", "Reni Anggraini", "Dhea Novianti", "Rina Sofiana", "Deni Hariadi", "Malvin", "Fenty Nanda Sari Afrida", "Sherly Fandina Wijaya"];
export const inputPersonList = ["Ayu Julianti", "Muneh Triliana", "Annisa Qomalasari", "Vioni Avadilla", "Widi Aprilia", "Maharani", "Wirda Arfiah", "Muneh Triliana Purba", "Sherin Anasya Sharani", "Fahad Al Muhamadi", "Ardi Gunawan"];
export const warrantyPrice = 100000;
export const appointment_status_list = [
  { label: "Appointment Confirmed", value: "appointment_confirmed" },
  { label: "Appointment Completed", value: "appointment_completed" },
  { label: "Appointment Cancelled", value: "appointment_cancelled" }
];
export const refferalType = { PENDING: 'Registered using refferal code', CREDIT: 'Finished their first purchase', DEBIT: 'Redeemed Credit' };
export const salesChannel = [{ label: 'Whatsapp', value: 'whatsapp' }, { label: 'Website', value: 'website' }, { label: 'Booking Link', value: 'booking_link' }]
export const appointmentTimingsOld = ['11:00 am', '12:00 pm', '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm', '05:00 pm', '06:00 pm']
export const appointmentTimings = [
  { value: 'c433c97a-f712-4098-bbdb-173e66590f36', label: '11:00 am' },
  { value: 'b657a583-be5b-4b33-a0c3-fce4a5b92e33', label: '12:00 pm' },
  { value: 'f3ed6c17-b483-4907-bbcc-71176f0f2e03', label: '01:00 pm' },
  { value: '9ab272c4-ed7e-4b1e-b011-522f7f6982f3', label: '02:00 pm' },
  { value: 'c23a900a-050c-4594-91fb-d3cfc78bfe09', label: '03:00 pm' },
  { value: '758a6cdc-1875-4974-9cb7-5e6df6df1489', label: '04:00 pm' },
  { value: '1886383e-390e-46aa-a708-93846e5477e9', label: '05:00 pm' },
  { value: '561d3b76-43f0-47f9-a959-d307e58475ac', label: '06:00 pm' },
]
export const payment = {
  xendit: [
    { label: 'VA Mandiri (Completed)', value: 'MANDIRI-COMPLETED', type: 2 },
    { label: 'VA BCA (Completed)', value: 'BCA-COMPLETED', type: 2 },
    { label: 'VA Mandiri (Create)', value: 'MANDIRI', type: 2 },
    { label: 'VA BCA (Create)', value: 'BCA', type: 2 },
    { label: 'Debit/Credit Card', value: 'xendit_debit_credit_card', type: 17 },
    { label: 'Xendit Invoice', value: 'INVOICE', type: 22 }
  ],
  insurance: [
    { label: 'AdMedika', value: 'AdMedika' },
    { label: 'Reimbursement', value: 'REIMBURSEMENT' },
    { label: 'Tirta/Fullerton', value: 'Tirta-Fullerton' },
    { label: 'HaloDoc', value: 'HaloDoc' },
    { label: 'Owlexa', value: 'Owlexa' },
    { label: 'Telkomedika', value: 'Telkomedika' }
  ],
  bank: [
    { label: <img style={{ width: "20%", height: '20%' }} src={require('../assets/images/paymentlogo/bca.jpg')} />, value: 'bca' },
    { label: <img style={{ width: "30%", height: '20%' }} src={require('../assets/images/paymentlogo/mandiri.jpg')} />, value: 'mandiri' },
    { label: <img style={{ width: "25%", height: '20%' }} src={require('../assets/images/paymentlogo/cimb-niaga.jpg')} />, value: 'cimb_niaga' },
    { label: <img style={{ width: "20%", height: '20%' }} src={require('../assets/images/paymentlogo/bni.jpg')} />, value: 'bni' },
    { label: <img style={{ width: "20%", height: '20%' }} src={require('../assets/images/paymentlogo/dbs.jpg')} />, value: 'dbs' }
  ],
  other: [
    { label: <img style={{ width: "30%", height: '20%' }} src={require('../assets/images/paymentlogo/atome.jpg')} />, value: 'atome', type: 8 },
    { label: <img style={{ width: "30%", height: '20%' }} src={require('../assets/images/paymentlogo/mekari.jpg')} />, value: 'mekari', type: 9 },
    { label: <img style={{ width: "25%", height: '20%' }} src={require('../assets/images/paymentlogo/kredivo.jpg')} />, value: 'kredivo', type: 3 },
    { label: <img style={{ width: "30%", height: '20%' }} src={require('../assets/images/paymentlogo/dept-store.jpg')} />, value: 'dept_store', type: 16 },
    { label: <h4>Corporate Try On</h4>, value: 'corporate_try_on', type: 18 },
    { label: <h4>Endorsement</h4>, value: 'endorsement', type: 19 },
    { label: <h4>Employee Claim</h4>, value: 'employee_claim', type: 20 },
    {
      label: 'e-wallet',
      options: [
        { label: <img style={{ width: "20%", height: '20%' }} src={require('../assets/images/paymentlogo/ovo.jpg')} />, value: "ovo", type: 11 },
        { label: <img style={{ width: "25%", height: '20%' }} src={require('../assets/images/paymentlogo/dana.jpg')} />, value: "dana", type: 10 },
        { label: <img style={{ width: "25%", height: '20%' }} src={require('../assets/images/paymentlogo/go-pay.jpg')} />, value: "go_pay", type: 12 },
        { label: <img style={{ width: "25%", height: '20%' }} src={require('../assets/images/paymentlogo/shopee-pay.jpg')} />, value: "shopee_pay", type: 14 },
        { label: <img style={{ width: "17%", height: '20%' }} src={require('../assets/images/paymentlogo/link-aja.jpg')} />, value: "link_aja", type: 13 }
      ]
    }
  ],
  edc: [
    { label: 'BCA', value: 'BCA' },
    { label: 'Mandiri', value: 'Mandiri' },
    { label: 'CIMB', value: 'CIMB' },
    { label: 'BNI', value: 'BNI' }
  ],
  warranty: [
    { label: '30 days Satisfaction', value: '30_days_satisfaction' },
    { label: 'In-house Warranty/AVRIST', value: 'in_house_warranty_AVRIST' }
  ]
}

export const googleMapKey = 'AIzaSyAi11lLDJCDlCM3iLi8O-TZgWkKbWLtORc';
export const paymentMethod = { 0: 'CASH', 1: 'CARD', 2: 'VIRTUAL_ACCOUNT', 3: 'KREDIVO', 4: 'NO_PAYMENT', 5: 'EDC', 6: 'BANK_TRANSFER', 7: 'INSURANCE', 8: 'ATOME', 9: 'MEKARI', 10: 'DANA', 11: 'OVO', 12: 'GO_PAY', 13: 'LINK_AJA', 14: 'SHOPEE_PAY', i5: 'PAYPAL PAYMENT', 16: 'DEPT_STORE', 17: 'XENDIT CARD', 18: 'Corporate Try On', 19: 'Endorsement', 20: 'Employee Claim', 21: 'Warranty', 22: 'Xendit Invoice' };
export const voucherSkuMappingType = { 3: 'all Products', 4: 'excludes some sku', 5: 'includes some sku', 6: 'all frames', 7: 'all lens', 8: 'all clipon' };
export const cancelHtoComment = ['Customer can`t be contacted', 'Customer has emergency business', 'Misunderstood about Hto', 'The price doesn`t match with customer']
export const s3BucketUser = 'https://eyewear-user.s3.ap-southeast-1.amazonaws.com/'
export const s3BucketProduction = 'https://eyewear-prod.s3.ap-southeast-1.amazonaws.com/'


export const deliveryCompanyList = [
  { value: "", label: "Select Delivery" },
  { value: 'sicepat', label: 'SiCepat' },
  { value: 'grab', label: 'Grab' },
  { value: 'gojek', label: 'Gojek' },
  { value: 'janio', label: 'Janio' },
  { value: 'kilo', label: 'Kilo' },
  { value: 'JNE', label: 'JNE' }
];

export const customerType = [
  { value: "", label: "Customer’s Type" },
  { value: "store", label: "Store" },
  { value: "app", label: "App" },
  { value: "data_insert", label: "Database" }
]

export const CurrencySymbols = [
  { code: 'IDR', symbol: 'Rp' },
  { code: 'USD', symbol: '$' },
  { code: 'SGD', symbol: 'S$' },
  { code: '-', symbol: '' }
];

export const roles = {
  1: 'super-admin',
  2: 'admin',
  3: 'store-manager',
  4: 'store-account',
  5: 'customer-services',
  6: 'finance'
}

export const storeTimings = [
  { open: '09:00:00', close: '09:00:00' },
  { open: '10:00:00', close: '10:00:00' },
  { open: '11:00:00', close: '11:00:00' },
  { open: '12:00:00', close: '12:00:00' },
  { open: '13:00:00', close: '13:00:00' },
  { open: '14:00:00', close: '14:00:00' },
  { open: '15:00:00', close: '15:00:00' },
  { open: '16:00:00', close: '16:00:00' },
  { open: '17:00:00', close: '17:00:00' },
  { open: '18:00:00', close: '18:00:00' },
  { open: '19:00:00', close: '19:00:00' },
  { open: '20:00:00', close: '20:00:00' },
  { open: '21:00:00', close: '21:00:00' },
]

export const roles_actions = {
  is_get: 'is_get',
  is_add: 'is_add',
  is_update: 'is_update',
  is_delete: 'is_delete'
}

export const logs_type = {
  order: 'order',
  admin_user: 'admin_user',
  store: 'store',
  employee: 'employee'
}

export const avilabilty_type = [
  { label: 'In Store', code: 1, name: 'store' },
  { label: 'Mobile App', code: 2, name: 'app' },
  { label: 'HTO', code: 3, name: 'hto' },
  { label: 'Whatsapp', code: 4, name: 'whatsapp' },
  { label: 'Website', code: 5, name: 'website' }
]
