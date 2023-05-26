const OrderDetail = require('./orderDetail');
const OrderItem = require('./orderItem');
const OrderItemAddon = require('./orderItemAddon');
const TurbolySaleDetails = require('./turbolySaleDetails');
const TurbolyDraftData = require('./turbolyDraftData');
const HtoSlot = require('./htoSlot');
const HTOZipCode = require('./htoZipCode');
const HtoAppointment = require('./htoAppointment');
const Appointment = require('./appointment');
const AppointmentHistory = require('./appointmentHistory');
const AppointmentTimeDetails = require('./appointmentTimeDetails');
const TurbolyOrderMapping = require('./turbolyOrderMapping');
const TempTurbolySaleDetails = require('./tempTurbolySaleDetails');
const ZipCodeMaster = require('./zipCodeMaster');
const DraftOrders = require('./draftOrders');
const orderItemChangedAddon = require('./orderItemChangedAddon');
const SaturdayPointsTransactions = require('./saturdayPointsTransaction');

module.exports = {
	OrderDetail,
	OrderItem,
	OrderItemAddon,
	TurbolySaleDetails,
	TurbolyDraftData,
	HtoSlot,
	HTOZipCode,
	HtoAppointment,
	Appointment,
	AppointmentHistory,
	AppointmentTimeDetails,
	TurbolyOrderMapping,
	TempTurbolySaleDetails,
	ZipCodeMaster,
	DraftOrders,
	orderItemChangedAddon,
	SaturdayPointsTransactions
};
