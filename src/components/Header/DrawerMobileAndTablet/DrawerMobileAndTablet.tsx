import React, { useState } from 'react';
import { Button, Drawer, DrawerProps } from 'antd';
import { CheckMobilePhone, CheckTablet } from '../../reponsive/ResponsiveCustom';

const DrawerMobileAndTablet: React.FC = () => {
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const DrawerContent = (placement: DrawerProps['placement']) => (
        <>
            {/* Hamburger Button */}
            <Button
                className="bg-pink-400 hover:bg-pink-500 text-white border-none shadow-md"
                shape="circle"
                size="large"
                onClick={showDrawer}
            >
                <i className="fa fa-align-justify"></i>
            </Button>

            {/* Drawer Menu */}
            <Drawer

                title={<span className="text-[#f963ba] font-semibold text-lg">Chào mừng bạn đến với Airbnb</span>}
                placement={placement}
                onClose={onClose}
                open={open}
                headerStyle={{ backgroundColor: '#1f1f1f' }}
                bodyStyle={{
                    backgroundColor: '#121212',
                    padding: '1rem',
                    color: '#fff' // ✨ thêm dòng này để đảm bảo chữ trắng
                }}
                closeIcon={<i className="fa fa-times text-white text-xl" />}
            >
                <nav className="flex flex-col gap-4 font-medium">
                    <a href="/" className="!text-[#f963ba] hover:!text-white transition duration-300">Home</a>
                    <a href="#" className="!text-white hover:!text-[#f963ba] transition duration-300">About</a>
                    <a href="#" className="!text-white hover:!text-[#f963ba] transition duration-300">Services</a>
                    <a href="#" className="!text-white hover:!text-[#f963ba] transition duration-300">Pricing</a>
                    <a href="#" className="!text-white hover:!text-[#f963ba] transition duration-300">Contact</a>
                </nav>
            </Drawer>


        </>
    );

    return (
        <>
            <CheckTablet>{DrawerContent('right')}</CheckTablet>
            <CheckMobilePhone>{DrawerContent('top')}</CheckMobilePhone>
        </>
    );
};

export default DrawerMobileAndTablet;
