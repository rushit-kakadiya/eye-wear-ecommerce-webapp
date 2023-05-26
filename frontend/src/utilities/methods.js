import { paymentMethod, CurrencySymbols, roles_actions } from './constants';

/*
* Common function/methods for components
*/

/*********** Date format **********/
export const getDateFormat = (date, isTwentyFourHour = false, isTime = true, timeZone = 'Asia/Jakarta') => {
  const newDate = new Date(date).toLocaleString('en-US', { timeZone: timeZone });
  return formatDate(newDate, isTwentyFourHour, isTime);
}


/*********** Order Date format **********/
export const getOrderDateFormat = (date, timeZone = 'Asia/Jakarta') => {
  return new Date(date).toLocaleDateString('en-GB', { timeZone: timeZone });
}


/*********** HTO Date format **********/
export const getHTODateFormat = (date) => {
  return new Date(date).toLocaleDateString("en-GB");
}


/********** Get date with add days********/
export const addDayDate = (date, days = 0) => {
  const mlist = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  var newdate = new Date(date);
  newdate.setDate(newdate.getDate() + days);
  var dd = newdate.getDate();
  var mm = newdate.getMonth();
  var y = newdate.getFullYear();
  return `${dd} ${mlist[mm]} ${y}`
}

/**********Diffrances two data*******/
export const getDateDiff = (date) => {
  const diffTime = Math.abs(new Date(date) - new Date());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
/*********** number format **********/
export const getNumberFormat = (number, currency = 'IDR') => {
  currency = CurrencySymbols.find(c => c.code === currency);
  return currency.symbol + ' ' + (number ? parseInt(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : '0');
}

/********** Title case************/

export const titleCase = (str) => {
  return str && str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

export const replaceGlobal = (str) => {
  return str && titleCase(str.replace(/_/g, " "));
}

/********* Get Day from any date***********/
export const getDay = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var day = new Date(date);
  return days[day.getDay()];
}

/************ Get  day's particular part **************/
export const getDayMeridiem = (date) => {
  var time = new Date(date);
  return time.getHours() < 12 ? 'Morning' : time.getHours() < 18 ? 'Afternoon' : 'Evening';
}

/********************* date format dd-mm-yyyy********************/
export const toDateFormat = (data) => {
  const date = new Date(data);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = date.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}

/********************* date format dd/mm/yyyy********************/
export const formatDate = (data, isTwentyFourHour, isTime) => {
  const date = new Date(data);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return isTime ? isTwentyFourHour ? `${dd}/${mm}/${yyyy}, ${hours}:${minutes} ${ampm}` : `${dd}/${mm}/${yyyy}, ${hours}:${minutes}` : `${dd}/${mm}/${yyyy}`;
}


//Get Month diff
export const monthDiff = (date) => {
  const currentDate = new Date();
  const nextDate = new Date(date);
  var diff = (nextDate.getTime() - currentDate.getTime()) / 1000;
  diff /= (60 * 60 * 24 * 7 * 4);
  return Math.round(diff);
}

export const getTime = (time) => {
  var data = new Date(time).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });;
  var date = new Date(data);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

//Get date format 
export const getFormatDate = (date) => {
  const newDate = new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  return new Date(newDate);
}

export const getLocalTime = (time) => {
  var data = new Date(time).toLocaleString('en-US');
  var date = new Date(data);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return `${hours}:${minutes}`;
}

export const getPaymentMethod = (row) => {
  if (row.payment_method === 0) {
    return row.payment_type && row.payment_type.toUpperCase();
  } else if (row.payment_method === 2) {
    return `VA ${row.bank_code && row.bank_code.toUpperCase()}`;
  } else if (!!paymentMethod[row.payment_method]) {
    return paymentMethod[row.payment_method];
  } else {
    return '--';
  }
};


export const getOrderDetailsGroupByDate = (data, type) => {

  const orderResults = data.map(data => { return { ...data, created_at: getOrderDateFormat(data.created_at) } })

  if (type === "htosalesitems" || type === "opticiansaleitems" || type === "staffsaleitems") {
    type = "items"
  } else {
    type = "amount"
  }

  const result = Object.values(orderResults.reduce((res, obj) => {
    res[obj.created_at] = res[obj.created_at] ||
    {
      created_at: obj.created_at,
      result: 0
    };
    res[obj.created_at].result += type == "amount" ? obj.payment_amount : 1;
    return res;
  }, []))


  return result

};

export const getAppointmentItemGroupByDate = (data) => {


  const appointmentResults = data.map(data => { return { ...data, created_at: getHTODateFormat(data.created_at) } })
  const result = Object.values(appointmentResults.reduce((res, obj) => {
    res[obj.created_at] = res[obj.created_at] ||
    {
      created_at: obj.created_at,
      result: 0
    };
    res[obj.created_at].result += 1;
    return res;
  }, []))


  return result

};


export const splitAtFirstSpace = (str) => {
  if (!str) return [];
  var i = str.indexOf(' ');
  if (i > 0) {
    return [str.substring(0, i), str.substring(i + 1)];
  }
  else return [str];
}

export const checkRoleAccess = (role, permissions, module, action = roles_actions.is_get) => {
  return role === 'super-admin' || (permissions && permissions.findIndex(permission => module.includes(permission.module_name) && permission[action]) > -1);
}

export const leadingZeros = (num, places) => String(num).padStart(places, '0')

export const calculateDates = (date, period = 'days') => {
  const today = new Date();
  // To calculate the time difference of two dates
  const Difference_In_Time = today.getTime() - date.getTime();
  // To calculate the no. of days between two dates
  return Difference_In_Time / (1000 * 3600 * 24);
}

// export const excludeCode
