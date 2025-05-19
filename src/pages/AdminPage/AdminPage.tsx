import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../main'
import { Link, useNavigate } from 'react-router';
import UserManager from './UserManager';
import LocationManager from './LocationManager';
import {
    FileOutlined,
    DesktopOutlined,
    UserOutlined,
    SmileFilled
} from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import { useDispatch } from 'react-redux';
import { setUserLogoutAction } from '../LoginPage/redux/userSlice';
import BookingManager from './BookingManager';
import RoomManager from './RoomManager';
import { hideLoading, showLoading } from '../../components/Loading/redux/loadingSlice';
const { Header, Sider, Content } = Layout;

export default function AdminPage() {
    const { user } = useSelector((state: RootState) => state.userSlice);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('users');
    const dispatch = useDispatch();
    const checkAdmin = async () => {
        dispatch(showLoading());
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (user?.role === "ADMIN") {
                return navigate("/admin")
            } else {
                return navigate("/");
            }
        } finally {
            dispatch(hideLoading());
        }


    }
    const handleLogout = async () => {
        dispatch(showLoading());
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            dispatch(setUserLogoutAction());
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            dispatch(hideLoading());
        }
    };
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuClick = ({ key }: any) => {
        setSelectedKey(key);
    };
    const renderContent = () => {
        switch (selectedKey) {
            case 'users':
                return <UserManager />;
            case 'locations':
                return <LocationManager />;
            case 'rooms':
                return <RoomManager />;
            case 'booking':
                return <BookingManager />;
        }
    };
    useEffect(() => {
        checkAdmin();
    }, [user, navigate]);



    const menuItems = [
        { key: 'users', icon: <UserOutlined />, label: 'UsersManager' },
        {
            key: 'locations',
            icon: <FileOutlined />,
            label: 'LocationManager',
        },
        { key: 'rooms', icon: <DesktopOutlined />, label: 'RoomManager' },
        { key: 'booking', icon: <SmileFilled />, label: 'BookingManager' }
    ];
    return (
        <Layout className="min-h-screen h-full bg-[#e672b1] ">
            <Sider collapsible collapsed={collapsed} onCollapse={toggleCollapsed} className="bg-[#001529] h-screen">
                <Link to="/">
                    <div className="text-2xl font-bold text-pink-400 flex items-center p-10 gap-2">
                        <i className="text-3xl fab fa-airbnb"></i>
                        airbnb
                    </div>
                </Link>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                    items={menuItems}
                />
            </Sider>

            <Layout className="bg-gray-100 flex-1">
                <Header className="bg-white flex justify-end items-center p-4 shadow-md">
                    <div className="flex items-center">
                        <Avatar size="large" className="bg-red-300 text-black font-bold">{user.name}</Avatar>
                        <button onClick={handleLogout} className="ml-2 rounded text-[#e672b1] font-medium cursor-pointer ">Đăng xuất</button>
                    </div>
                </Header>
                <Content className="p-6 bg-white shadow-md min-h-screen">
                    {renderContent()}
                </Content>
            </Layout>
        </Layout>
    );
};

