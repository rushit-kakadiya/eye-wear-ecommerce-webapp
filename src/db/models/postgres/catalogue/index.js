const Products = require('./products');
const TurbolyProducts = require('./turbolyProducts');
const Variants = require('./variants');
const Frame = require('./frame');
const CartItems = require('./cartItems');
const CartAddonItems = require('./cartAddonItem');
const Lenses = require('./lenses');
const Store = require('./store');
const ProductStock = require('./productStock');
const TurbolyProductStock = require('./turbolyProductStock');
const FrameSize = require('./frameSize');
const Size = require('./size');
const FrameImage = require('./frameImage');
const FrameDetail = require('./frameDetails');
const FrameMaster = require('./frameMaster');
const LensesDetail = require('./lensesDetail');
const ClipOn  = require('./clipon');
const Packaging = require('./packaging');
const Influencer = require('./influencer');
const ContactLens = require('./contactLens');
const OthersProduct = require('./othersProduct');

const UserFrameBrowsingHistory = require('./user_frame_browsing_history');
const UserBrowsingHistory = require('./user_browsing_history');
const UserBrowsingHistoryAudit = require('./user_browsing_history_audit');

module.exports = {
	TurbolyProducts,
	Products,
	TurbolyProductStock,
	Frame,
	Variants,
	CartItems,
	CartAddonItems,
	Lenses,
	Store,
	ProductStock,
	FrameSize,
	Size,
	FrameImage,
	FrameDetail,
	FrameMaster,
	LensesDetail,
	ClipOn,
	Packaging,
	Influencer,
	ContactLens,
	OthersProduct,
	UserFrameBrowsingHistory,
	UserBrowsingHistory,
	UserBrowsingHistoryAudit
};
