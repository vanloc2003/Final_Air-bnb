import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../main";
import { setUserLogoutAction } from "../../pages/LoginPage/redux/userSlice";
import { hideLoading, showLoading } from "../Loading/redux/loadingSlice";
import toast from "react-hot-toast";
import { CheckDesktop, CheckMobilePhone, CheckTablet } from "../reponsive/ResponsiveCustom";
import DrawerMobileAndTablet from "./DrawerMobileAndTablet/DrawerMobileAndTablet";
const Header = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useSelector((state: RootState) => state.userSlice);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(showLoading());
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(setUserLogoutAction());
      navigate("/");
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/myVideo.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-10" />

      {/* Header (Sticky) */}
      <header
        className={`fixed top-0 left-0 w-full z-30 flex justify-between items-center px-10 py-4 transition-all duration-300 ${isScrolled ? "bg-white text-black shadow" : "text-white"
          }`}
      >
        <Link to={"/"}>
          <div className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <i className="text-3xl fab fa-airbnb"></i>
            airbnb
          </div>
        </Link>
        <CheckDesktop>
          <nav className="flex gap-6 font-medium">
            <a href="/" className="text-blue-400 hover:text-blue-400 transition duration-300">
              Home
            </a>
            <a href="#" className="hover:text-blue-400 transition duration-300">About</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Services</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Pricing</a>
            <a href="#" className="hover:text-blue-400 transition duration-300">Contact</a>
          </nav>
        </CheckDesktop>

        <div className="relative">
          <CheckMobilePhone>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center border-4 border-blue-400 cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-xl hover:bg-white/70 hover:ring-2 hover:ring-pink-300"

              >
                {user?.avatar ? (
                  <img
                    className="rounded-full"
                    src={user.avatar}
                    alt="avatarInfo"
                  />
                ) : (
                  <div className={`font-bold ${isScrolled ? "text-black" : "text-white"}`}>
                    <i className="fa fa-user"></i>
                  </div>
                )}
              </button>
              <DrawerMobileAndTablet />
            </div>
          </CheckMobilePhone>
          <CheckTablet>
            <div className="flex justify-center items-center gap-5">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center border-4 border-blue-400 cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-xl hover:bg-white/70 hover:ring-2 hover:ring-pink-300"

              >
                {user?.avatar ? (
                  <img
                    className="rounded-full"
                    src={user.avatar}
                    alt="avatarInfo"
                  />
                ) : (
                  <div className={`font-bold ${isScrolled ? "text-black" : "text-white"}`}>
                    <i className="fa fa-user"></i>
                  </div>
                )}
              </button>
              <DrawerMobileAndTablet />
            </div>
          </CheckTablet>
          <CheckDesktop>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center border-4 border-blue-400 cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-xl hover:bg-white/70 hover:ring-2 hover:ring-pink-300"

            >
              {user?.avatar ? (
                <img
                  className="rounded-full"
                  src={user.avatar}
                  alt="avatarInfo"
                />
              ) : (
                <div className={`font-bold ${isScrolled ? "text-black" : "text-white"}`}>
                  <i className="fa fa-user"></i>
                </div>
              )}
            </button>
          </CheckDesktop>
          <div
            className={`z-50 absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-lg shadow-lg py-2 transition-all duration-300 ease-out transform origin-top ${openMenu ? "opacity-100 scale-100 animate-slide-down" : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            {user ? (
              <div className="text-sm">
                <div className="px-4 py-2 border-b">
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Dashboard</Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">
                    Admin Dashboard
                  </Link>
                )}
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Settings</Link>
                <Link to="/earnings" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Earnings</Link>
                <button
                  onClick={handleLogout}
                  className=" cursor-pointer block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Đăng nhập</Link>
                <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 transition duration-200">Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full px-10 text-white">
        <div className="text-6xl font-extrabold text-blue-400 mb-2 flex items-center gap-2">
          <i className="fab fa-airbnb"></i>
          airbnb
        </div>
        <p className="text-2xl font-bold">Belong anywhere</p>
      </div>

      {/* White Curve Bottom */}
      <CheckDesktop>
        <div className="absolute bottom-0 left-0 w-full h-[90px] bg-white rounded-t-[40%] z-10" />
      </CheckDesktop>

      <CheckMobilePhone>
        <div className="absolute bottom-0 left-0 w-full h-[60px] bg-white z-10" />
      </CheckMobilePhone>

      <CheckTablet>
        <div className="absolute bottom-0 left-0 w-full h-[75px] bg-white z-10" />
      </CheckTablet>
    </div>
  );
};

export default Header;
