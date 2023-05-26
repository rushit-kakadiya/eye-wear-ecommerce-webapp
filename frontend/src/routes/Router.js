import { lazy } from "react";

//Lazy loading and code splitting
//dashboards
const Dashboard = lazy(() => import("../containers/Dashboard"));

// Orders pages
const OrderList = lazy(() => import("../containers/OrderList"));
const AddOrder = lazy(() => import("../containers/AddOrder"));
const OrderSuccess = lazy(() => import("../containers/OrderSuccess"));
const OrderDetail = lazy(() => import( "../containers/OrderDetail"));

// HTO Pages
const Hto = lazy(() => import("../containers/hto/List"));
const HtoDetail = lazy(() => import("../containers/hto/Detail"));
const HtoAdd = lazy(() => import("../containers/hto/Add"));
const OpticianCalendar = lazy(() => import("../containers/hto/OpticianCalendar"));



//Customer pages
const CustomerList = lazy(() => import("../containers/customer/List"));
const CustomerDetail = lazy(() => import("../containers/customer/Detail"));
const AddCustomer = lazy(() => import("../containers/customer/Add"));
const AddCustomerAddress = lazy(() => import("../containers/customer/AddAddress"));

//Analytic pages
const AnalyticEmployee = lazy(() => import("../containers/Analytic"));
const PerformanceDetail = lazy(() => import("../containers/PerformanceDetail"));

//Discount Pages
const Discount = lazy(()=>import('../containers/discount/DiscountList'));
const AddDiscount = lazy(()=>import('../containers/discount/Add'));
const EditDiscount = lazy(()=>import('../containers/discount/Edit'));
const ViewDiscount = lazy(()=>import('../containers/discount/View'));

//User List Pages
const AdminUser = lazy(() => import('../containers/user/List'));
const AddAdminUser = lazy(() => import('../containers/user/add'));

//  Account Pages
const Account = lazy(()=>import('../containers/account/account'));

// Store pages
const StoreList = lazy(() => import("../containers/store/List"));
const StoreDetail = lazy(() => import("../containers/store/Detail"));
const AddStore = lazy(() => import("../containers/store/Add"));
const UpdateStore = lazy(() => import("../containers/store/Update"));

// Product pages
const Products = lazy(() => import("../containers/products/frame"));
const FrameNameAdd = lazy(() => import("../containers/products/frame/name/Add"));
const FrameColorAdd = lazy(() => import("../containers/products/frame/color/Add"));
const FrameNameDetail = lazy(() => import("../containers/products/frame/name/Detail"));
const FrameColorDetail = lazy(() => import("../containers/products/frame/color/Detail"));
const FrameNameUpdate = lazy(() => import("../containers/products/frame/name/Edit"));
const FrameColorUpdate = lazy(() => import("../containers/products/frame/color/Edit"));

// Employee
const EmployeeList = lazy(() => import("../containers/employee/List"));
const AddEmployee = lazy(() => import('../containers/employee/add'));

//Products
const AllProductsList = lazy(() => import("../containers/products/List"));

const Details = lazy(() => import("../containers/products/Detail"));

const AddLens = lazy(() => import("../containers/products/lens/Add"));

const AddClipOn = lazy(() => import("../containers/products/clip-on/Add"));
const VieClipOn = lazy(() => import("../containers/products/clip-on/Detail"));

const Frame = lazy(() => import("../containers/products/frame/sku/Detail"));
const AddFrame = lazy(() => import("../containers/products/frame/sku/Add"));
const UpdateFrame = lazy(() => import("../containers/products/frame/sku/Edit"));

const AddOthers = lazy(() => import("../containers/products/others/Add"));
const EditOthers = lazy(() => import("../containers/products/others/Edit"));

const AddContactLens = lazy(() => import("../containers/products/contact-lens/Add"));



var ThemeRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    state: "dashboardpages",
    icon: "home",
    component: Dashboard,
  },
  {
    path: "/products-list",
    name: "Products List",
    state: "productspage",
    icon: "list",
    component: AllProductsList,
    isSub: true,
    child: [
      {
        path: "/add-lens",
        name: "Add Lens",
        component: AddLens,
        redirect: true
      },
      {
        path: "/edit-lens/:sku",
        name: "Edit Lens",
        component: AddLens,
        redirect: true
      },
      {
        path: "/add-others",
        name: "Add Lens",
        component: AddOthers,
        redirect: true
      },
      {
        path: "/edit-others/:sku",
        name: "Edit Others",
        component: EditOthers,
        redirect: true
      },
      {
        path: "/product/:type/:sku",
        name: "Detail",
        component: Details,
        redirect: true
      },
      {
        path: "/add-frame",
        name: "Add Frame",
        component: AddFrame,
        redirect: true
      },
      {
        path: "/update-frame/:sku",
        name: "Add Frame",
        component: UpdateFrame,
        redirect: true
      },
      {
        path: "/frame/:sku",
        name: "Add Frame",
        component: Frame,
        redirect: true
      },
      {
        path: "/add-clip-on",
        name: "Add Clip On",
        component: AddClipOn,
        redirect: true
      },
      {
        path: "/edit-clip-on/:sku",
        name: "Edit Clip On",
        component: AddClipOn,
        redirect: true
      },
      {
        path: "/clip-on/:sku",
        name: "View Clip On",
        component: VieClipOn,
        redirect: true
      },
      {
        path: "/add-contact-lens",
        name: "Add Contact Lens",
        component: AddContactLens,
        redirect: true
      },
      {
        path: "/edit-contact-lens/:sku",
        name: "Edit Contact Lens",
        component: AddContactLens,
        redirect: true
      },
    ]
  },
  {
    collapse: true,
    path: "/analytic",
    name: "Analytic",
    state: "analytic",
    icon: "pie-chart",
    component: AnalyticEmployee,
    child: [
      {
        path: "/analytic/employee",
        name: "Employee",
        component: AnalyticEmployee
      },
      {
        path: "/performance-detail/:member/:id",
        name: "Performance Detail",
        component: PerformanceDetail,
        redirect: true
      }
    ]
  },
  {
    name: "Order",
    icon: "package",
    path: "/order",
    state: "order",
    component: OrderList,
    isSub: true,
    child: [
      {
        path: "/order/add",
        name: "Add Order",
        component: AddOrder
      },
      {
        path: "/order/success",
        name: "Order successfully completed",
        component: OrderSuccess
      },
       {
        path: "/order-detail/:id",
        name: "Order Detail",
        component: OrderDetail
      }
    ]
  },
  {
    name: "Customer",
    icon: "users",
    path: "/customer",
    state: "customer",
    component: CustomerList,
    isSub: true,
    child: [
      {
        path: "/customer/add",
        name: "Add Customer",
        component: AddCustomer
      },
      {
        path: "/customer/add-address",
        name: "Add Customer Address",
        component: AddCustomerAddress
      },
      {
        path: "/customer/detail/:id",
        name: "Customer Detail",
        component: CustomerDetail
      }
    ]
  },
  {
    collapse: true,
    name: "HTO Appointment",
    icon: "folder",
    path: "/hto",
    state: "hto",
    child: [
      {
        path: "/hto/inside-area",
        name: "Inside Area",
        component: Hto
      },
      // {
      //   path: "/hto/outside-area",
      //   name: "Outside Area",
      //   component: Hto
      // },
      {
        path: "/hto/detail/:id",
        name: "HTO Detail",
        component: HtoDetail,
        redirect: true
      },
      {
        path: "/hto/add",
        name: "HTO Add",
        component: HtoAdd,
        redirect: true
      },
      {
        path: "/hto/optician-calendar",
        name: "Optician Calendar",
        component: OpticianCalendar,
        redirect: true
      }
    ]
  },
  {
    collapse: true,
    path: "/settings",
    name: "Settings",
    state: "settings page",
    icon: "settings",
    isSub:true,
    child:[
      {
        path: "/settings/discount",
        name: "Discount",
        component: Discount
      },
      {
        path: "/settings/add-discount",
        name: "Add Discount",
        component: AddDiscount,
        redirect: true
      },
      {
        path: "/settings/edit-discount/:id",
        name: "Edit Discount",
        component: EditDiscount,
        redirect: true
      },
      {
        path: "/settings/view-discount/:id",
        name: "View Discount",
        component: ViewDiscount,
        redirect: true
      },
      {
        path: "/settings/account",
        name: "Account",
        component: Account,
        redirect: true
      },
      {
        path: "/admin",
        name: "User",
        component: AdminUser
      },
      {
        path: "/add-admin",
        name: "Add Admin User",
        component: AddAdminUser,
        redirect: true
      },
      {
        path: "/update-admin/:id",
        name: "Update Admin User",
        component: AddAdminUser,
        redirect: true
      },
      {
        name: "Store",
        path: "/store",
        component: StoreList,
      },
      {
        path: "/add-store",
        name: "Add Store",
        component: AddStore,
        redirect: true
      },
      {
        path: "/update-store/:id",
        name: "Update Store",
        component: UpdateStore,
        redirect: true
      },
      {
        path: "/store-detail/:id",
        name: "Store Detail",
        component: StoreDetail,
        redirect: true
      },
      {
        path: "/employee",
        name: "Employee",
        component: EmployeeList
      },
      {
        path: "/add-employee",
        name: "Add Employee",
        component: AddEmployee,
        redirect: true
      },
      {
        path: "/update-employee/:id",
        name: "Update Employee",
        component: AddEmployee,
        redirect: true
      },
      {
        path: "/settings/update-employee",
        name: "Update User",
        component: AddEmployee,
        redirect: true
      },
      {
        path: "/products",
        name: "Products",
        component: Products,
        // redirect: true
      },
      {
        path: "/frame-name/add",
        name: "Add Frame Name",
        component: FrameNameAdd,
        redirect: true
      },
      {
        path: "/frame-color/add",
        name: "Add Frame Color",
        component: FrameColorAdd,
        redirect: true
      },
      {
        path: "/frame-name/:id",
        name: "Frame Name Detail",
        component: FrameNameDetail,
        redirect: true
      },
      {
        path: "/frame-color/:id",
        name: "Frame Color Detail",
        component: FrameColorDetail,
        redirect: true
      },
      {
        path: "/update-frame-name/:id",
        name: "Frame Name Update",
        component: FrameNameUpdate,
        redirect: true
      },
      {
        path: "/update-frame-color/:id",
        name: "Frame Color Update",
        component: FrameColorUpdate,
        redirect: true
      },
    ]
  }
];
export default ThemeRoutes;
