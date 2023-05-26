/* -----------------------------------------------------------------------
   * @ description : Main module to include all the messages used in project.
----------------------------------------------------------------------- */

const messages = {
  accept: {
    en: 'Accepted',
    id: 'Diterima'
  },
  confirm: {
    en: 'Confirmed',
    id: 'Dikonfirmasi'
  },
  success: {
    en: 'Success!',
    id: 'Keberhasilan!'
  },
  requiredField: name => ({
    en: `${name} is not allowed to be empty`,
    id: `${name} tidak boleh kosong`
  }),
  validPhone: {
    en: 'Please provide valid phone number',
    id: 'Harap berikan nomor telepon yang valid'
  },
  systemError: {
    en: 'Something went wrong. Please try again',
    id: 'Ada yang salah. Silakan coba lagi'
  },
  emailAlreadyExists: {
    en: 'Email is already registered with us.',
    id: 'Email sudah terdaftar dengan kami.'
  },
  mobileAlreadyExists: {
    en: 'Mobile is already registered with us.',
    id: 'Ponsel sudah terdaftar dengan kami.'
  },
  emailNotExists: {
    en: 'Email is not registered with us.',
    id: 'Email tidak terdaftar pada kami.'
  },
  invalidCredentials: {
    en: 'Invalid credentials!',
    id: 'Kredensial tidak valid!'
  },
  profileUpdated: {
    en: 'Profile updated successfully!',
    id: 'Profil berhasil diperbarui!'
  },
  settingsUpdated: {
    en: 'Settings updated successfully!',
    id: 'Pengaturan berhasil diperbarui!'
  },
  storeRequired: {
    en: 'Store is required',
    id: 'Penyimpanan diperlukan'
  },
  storeNotOperating: {
    en: 'Store is not operating',
    id: 'Toko tidak beroperasi'
  },
  skuNotFound: {
    en: 'No Active Store SKU',
    id: 'Tidak ada SKU Toko Aktif'
  },
  sicepatServiceUnavialable: {
    en: 'Service is not available in this area. Please contact the service provider.',
    id: 'Layanan tidak tersedia di area ini. Silakan hubungi penyedia layanan.'
  },
  /************** Catalogue ************/
  productAdded: {
    en: 'Product is added succsessfully!',
    id: 'Produk berhasil ditambahkan!'
  },
  wishlistAdded: {
    en: 'Product is added in wishlist succsessfully!',
    id: 'Produk berhasil ditambahkan ke daftar keinginan!'
  },
  alreadyAddedInWishlist: {
    en: 'Product is already added in wishlist!',
    id: 'Produk sudah ditambahkan di daftar keinginan!'
  },
  wishlistRemoved: {
    en: 'Product is removed from wishlist succsessfully!',
    id: 'Produk berhasil dihapus dari daftar keinginan!'
  },
  itemAdded: {
    en: 'Item added in cart!',
    id: 'Item ditambahkan ke keranjang!'
  },
  itemUpdated: {
    en: 'Item updated in cart!',
    id: 'Item diperbarui di keranjang!'
  },
  itemRemoved: {
    en: 'Item removed from cart!',
    id: 'Item dihapus dari keranjang!'
  },
  cartEmpty: {
    en: 'Items removed from cart!',
    id: 'Item dihapus dari keranjang!'
  },
  alreadyInCart: {
    en: 'Items is already in cart!',
    id: 'Item sudah ada di keranjang!'
  },
  cartCountExceed: {
    en: 'Items count can not be more than 5!',
    id: 'Jumlah item tidak boleh lebih dari 5!'
  },
  cartItemExceed: {
    en: 'Only 10 frames can be added in HTO cart!',
    id: 'Hanya 10 frame yang dapat ditambahkan di gerobak HTO!'
  },
  /****************** OTP ******************/
  otpSent: {
    en: 'OTP sent on your phone number!',
    id: 'OTP dikirim ke nomor telepon Anda!'
  },
  invalidOTP: {
    en: 'Invalid OTP or may be expired!',
    id: 'OTP tidak valid atau mungkin kadaluarsa!'
  },
  otpVerified: {
    en: 'Your OTP verified successfully!',
    id: 'OTP Anda berhasil diverifikasi!'
  },
  /*************** Address *****************/
  addressRequired: {
    en: 'Address is required',
    id: 'Alamat diperlukan'
  },
  addressAdded: {
    en: 'Your address added successfully!',
    id: 'Alamat Anda berhasil ditambahkan!'
  },
  addressUpdated: {
    en: 'Your address updated successfully!',
    id: 'Alamat Anda berhasil diperbarui!'
  },
  addressRemoved: {
    en: 'Address Removed successfully!',
    id: 'Alamat Berhasil Dihapus!'
  },
  prescriptionRemoved: {
    en: 'Prescription Removed successfully!',
    id: 'Resep Berhasil Dihapus!'
  },
  primaryAddress: {
    en: 'You can\'t remove primary address!',
    id: 'Anda tidak dapat menghapus alamat utama!'
  },
  /*************** Orders *****************/
  orderCompleted: {
    en: 'Your order successfully completed!',
    id: 'Pesanan Anda berhasil diselesaikan!'
  },
  orderRescheduled: {
    en: 'Your order successfully rescheduled!',
    id: 'Pesanan anda berjaya dijadualkan semula!'
  },
  invalidOrder: {
    en: 'Invalid order no',
    id: 'Pesanan anda berjaya dibatalkan!'
  },
  orderCancelled: {
    en: 'Your order successfully cancelled!',
    id: 'Pesanan anda berjaya dibatalkan!'
  },
  orderCancelTimeExpired: {
    en: 'Order can not be cancelled after 10 days!',
    id: 'Pesanan anda berjaya dibatalkan!'
  },
  orderAlreadyCancelled: {
    en: 'Order already cancelled!',
    id: 'Pesanan anda berjaya dibatalkan!'
  },
  orderSuccess: {
    en: 'Your order is successfully placed!',
    id: 'Pesanan Anda berhasil dibuat!'
  },
  htoOrderSuccess: {
    en: 'Your HTO appointment is successfully booked.',
    id: 'Janji temu HTO Anda berhasil dipesan.'
  },
  htorRescheduleError: {
    en: 'Unable to reschedule HTO appointment, Please select another slot.',
    id: 'Tidak dapat menjadwal ulang janji temu HTO, Silakan pilih slot lain.'
  },
  createStoreError: {
    en: 'Unable to create store, Please try again later.',
    id: 'Tidak dapat membuat toko, Harap coba lagi nanti.'
  },
  updateStoreError: {
    en: 'Unable to update store, Please try again later.',
    id: 'Tidak dapat memperbarui toko, Harap coba lagi nanti.'
  },
  htoOrderCancel: {
    en: 'Your HTO appointment is successfully cancelled.',
    id: 'Janji HTO Anda berhasil dibatalkan.'
  },
  itemOutOfStock: {
    en: 'Item is out of stock!',
    id: 'Item kehabisan stok!'
  },
  yearExist: {
    en: 'Year already exist!',
    id: 'Tahun sudah ada!'
  },
  cardExist: {
    en: 'Card is already exist!',
    id: 'Kartu sudah ada!'
  },
  prescriptionExist: {
    en: 'Prescription is already existed with this name!',
    id: 'Resep sudah ada dengan nama ini!'
  },
  orderPaymentCancelled: {
    en: 'Order payment has been cancelled Successfully!',
    id: 'Pembayaran pesanan telah dibatalkan Berhasil!'
  },
  invalidReferralCode: {
    en: 'Invalid referral code.',
    id: 'Kode rujukan tidak valid.'
  },
  nameRequired: {
    en: 'First name and last name is required!',
    id: 'Nama depan dan nama belakang wajib diisi!'
  },
  voucherExit: {
    en: 'Voucher code is already exist.',
    id: 'Kode voucher sudah ada.'
  },
  voucherRemoved: {
    en: 'Voucher in-activated!',
    id: 'Voucher aktif!'
  },
  userActivated: {
    en: 'User activated!',
    id: 'Pengguna diaktifkan!'
  },
  userDeactivated: {
    en: 'User deactivated!',
    id: 'Pengguna dinonaktifkan!'
  },
  deletedSuccessfully: {
    en: 'Deleted Successfully!',
    id: 'Berhasil Dihapus!'
  },
  skuExist: {
    en: 'SKU Code you have entered is duplicate!',
    id: 'Kode SKU yang Anda masukkan adalah duplikat!'
  }
};

module.exports = messages;
