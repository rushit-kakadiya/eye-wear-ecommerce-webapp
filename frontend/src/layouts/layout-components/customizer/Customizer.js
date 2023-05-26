import React from "react";
import { useSelector, useDispatch } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  setLogoBg,
  setNavbarBg,
  setSidebarBg,
  setTheme,
  setDir,
  setSidebarPos,
  setHeaderPos,
  setLayout,
  setSidebarType,
} from "../../../redux/settings/Action";

export default () => {
  const settings = useSelector((state) => state.settings);

  const dispatch = useDispatch();

  const toggle = () => {
    document
      .getElementById("customizer")
      .classList.toggle("show-service-panel");
  };

  return (
    <aside className="customizer" id="customizer">
      {/*--------------------------------------------------------------------------------*/}
      {/* Toggle Customizer From Here                                                    */}
      {/*--------------------------------------------------------------------------------*/}
      <span
        className="service-panel-toggle text-white"
        onClick={toggle.bind(null)}
      >
        <i className="fa fa-spin fa-cog"></i>
      </span>
      <PerfectScrollbar>
        <div className="customizer-body">
          <div className="mt-3 border-bottom px-3">
            <h5 className="font-medium m-0">Theme Color</h5>
            <div
              className="btn-group btn-group-toggle mt-2 mb-3"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeTheme === "light" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-color"
                  id="theme-light"
                  onClick={() => dispatch(setTheme("light"))}
                />{" "}
                Light
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeTheme === "dark" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-color"
                  id="theme-dark"
                  onClick={() => dispatch(setTheme("dark"))}
                />{" "}
                Dark
              </label>
            </div>
          </div>
          <div className="mt-3 border-bottom px-3">
            <h5 className="font-medium m-0">Sidebar Position</h5>
            <div
              className="btn-group btn-group-toggle mt-2 mb-3"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeSidebarPos === "fixed" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="sidebar-position"
                  id="sidebar-fixed"
                  onClick={() => dispatch(setSidebarPos("fixed"))}
                />{" "}
                Fixed
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeSidebarPos === "absolute" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="sidebar-position"
                  id="sidebar-absolute"
                  onClick={() => dispatch(setSidebarPos("absolute"))}
                />{" "}
                Not Fixed
              </label>
            </div>
          </div>
          <div className="mt-3 border-bottom px-3">
            <h5 className="font-medium m-0">Header Position</h5>
            <div
              className="btn-group btn-group-toggle mt-2 mb-3"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeHeaderPos === "fixed" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="header-position"
                  id="header-fixed"
                  onClick={() => dispatch(setHeaderPos("fixed"))}
                />{" "}
                Fixed
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeHeaderPos === "absolute" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="header-position"
                  id="header-absolute"
                  onClick={() => dispatch(setHeaderPos("absolute"))}
                />{" "}
                Not Fixed
              </label>
            </div>
          </div>
          <div className="mt-3 border-bottom px-3">
            <h5 className="font-medium m-0">Layout</h5>
            <div
              className="btn-group btn-group-toggle mt-2 mb-3"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeLayout === "full" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-layout"
                  id="theme-full"
                  onClick={() => dispatch(setLayout("full"))}
                />{" "}
                Full
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeLayout === "boxed" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-layout"
                  id="theme-boxed"
                  onClick={() => dispatch(setLayout("boxed"))}
                />{" "}
                Boxed
              </label>
            </div>
          </div>
          <div className="mt-3 border-bottom px-3">
            <h5 className="font-medium m-0">Direction</h5>
            <div
              className="btn-group btn-group-toggle mt-2 mb-3"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeDir === "ltr" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-dir"
                  id="theme-ltr"
                  onClick={() => dispatch(setDir("ltr"))}
                />{" "}
                LTR
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeDir === "rtl" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-dir"
                  id="theme-rtl"
                  onClick={() => dispatch(setDir("rtl"))}
                />{" "}
                RTL
              </label>
            </div>
          </div>
          <div className="mt-3 border-bottom px-3">
            <h5 className="font-medium m-0">Sidebar Type</h5>
            <div
              className="btn-group btn-group-toggle mt-2 mb-3"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeSidebarType === "full" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-sidebar"
                  id="sidebar-full"
                  onClick={() => dispatch(setSidebarType("full"))}
                />{" "}
                Full
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeSidebarType === "mini-sidebar"
                    ? "active"
                    : "")
                }
              >
                <input
                  type="radio"
                  name="theme-sidebar"
                  id="sidebar-mini"
                  onClick={() => dispatch(setSidebarType("mini-sidebar"))}
                />{" "}
                Mini
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeSidebarType === "iconbar" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-sidebar"
                  id="sidebar-icon"
                  onClick={() => dispatch(setSidebarType("iconbar"))}
                />{" "}
                Icon
              </label>
              <label
                className={
                  "btn btn-outline-secondary " +
                  (settings.activeSidebarType === "overlay" ? "active" : "")
                }
              >
                <input
                  type="radio"
                  name="theme-sidebar"
                  id="sidebar-overlay"
                  onClick={() => dispatch(setSidebarType("overlay"))}
                />{" "}
                Overlay
              </label>
            </div>
          </div>
          <div className="mt-3 border-bottom px-3">
            {/*--------------------------------------------------------------------------------*/}
            {/* Change LOGO Background                                                         */}
            {/*--------------------------------------------------------------------------------*/}
            <h5 className="font-medium m-0">Logo Backgrounds</h5>
            <ul className="theme-color mt-2 mb-3">
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-logobg="skin1"
                  onClick={() => dispatch(setLogoBg("skin1"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-logobg="skin2"
                  onClick={() => dispatch(setLogoBg("skin2"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-logobg="skin3"
                  onClick={() => dispatch(setLogoBg("skin3"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-logobg="skin4"
                  onClick={() => dispatch(setLogoBg("skin4"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-logobg="skin5"
                  onClick={() => dispatch(setLogoBg("skin5"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-logobg="skin6"
                  onClick={() => dispatch(setLogoBg("skin6"))}
                >
                  &nbsp;
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-3 border-bottom px-3">
            {/*--------------------------------------------------------------------------------*/}
            {/* Change NAVBAR Background                                                       */}
            {/*--------------------------------------------------------------------------------*/}
            <h5 className="font-medium m-0">Navbar Backgrounds</h5>
            <ul className="theme-color mt-2 mb-3">
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-navbarbg="skin1"
                  onClick={() => dispatch(setNavbarBg("skin1"))}
                >
                  &nbsp;&nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-navbarbg="skin2"
                  onClick={() => dispatch(setNavbarBg("skin2"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-navbarbg="skin3"
                  onClick={() => dispatch(setNavbarBg("skin3"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-navbarbg="skin4"
                  onClick={() => dispatch(setNavbarBg("skin4"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-navbarbg="skin5"
                  onClick={() => dispatch(setNavbarBg("skin5"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-navbarbg="skin6"
                  onClick={() => dispatch(setNavbarBg("skin6"))}
                >
                  &nbsp;
                </span>
              </li>
            </ul>
          </div>
          <div className="mt-3 border-bottom px-3">
            {/*--------------------------------------------------------------------------------*/}
            {/* Change SIDEBAR Background                                                      */}
            {/*--------------------------------------------------------------------------------*/}
            <h5 className="font-medium m-0">Sidebar Backgrounds</h5>
            <ul className="theme-color mt-2 mb-3">
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-sidebarbg="skin1"
                  onClick={() => dispatch(setSidebarBg("skin1"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-sidebarbg="skin2"
                  onClick={() => dispatch(setSidebarBg("skin2"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-sidebarbg="skin3"
                  onClick={() => dispatch(setSidebarBg("skin3"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-sidebarbg="skin4"
                  onClick={() => dispatch(setSidebarBg("skin4"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-sidebarbg="skin5"
                  onClick={() => dispatch(setSidebarBg("skin5"))}
                >
                  &nbsp;
                </span>
              </li>
              <li className="theme-item">
                <span
                  className="theme-link"
                  data-sidebarbg="skin6"
                  onClick={() => dispatch(setSidebarBg("skin6"))}
                >
                  &nbsp;
                </span>
              </li>
            </ul>
          </div>
        </div>
      </PerfectScrollbar>
    </aside>
  );
};
