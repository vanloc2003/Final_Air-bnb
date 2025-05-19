import  { useEffect, useState } from 'react';
import { getLocationService, Location } from '../../api/locationService';
import { useNavigate } from 'react-router';
import { AutoComplete, DatePicker, InputNumber, Button, Space } from 'antd';
import type { InputNumberProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { CheckDesktop, CheckMobilePhone, CheckTablet } from '../../components/reponsive/ResponsiveCustom';

const { RangePicker } = DatePicker;



function toSlug(str: string) {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

export default function LocationPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
    const [guestCount, setGuestCount] = useState<number>(1);
    const navigate = useNavigate();

    const fetchLocation = async () => {
        try {
            const res = await getLocationService();
            const data: Location[] = res.data.content;
            setLocations(data);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };

    const onChangeGuest: InputNumberProps['onChange'] = (value) => {
        setGuestCount(Number(value));
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    const handleSelect = (value: string) => {
        const location = locations.find((loc) => loc.tenViTri === value);
        setSelectedLocation(location || null);
    };

    const handleSearch = () => {
        if (selectedLocation) {
            const slug = toSlug(selectedLocation.tenViTri);
            navigate(`/rooms/${slug}?id=${selectedLocation.id}`);
        }
    };

    return (
        <>
            {/* Mobile Layout */}
            <CheckMobilePhone>
                <div className="flex flex-col gap-4 items-center rounded-xl border border-gray-300 px-4 py-4 shadow-md bg-white w-full mx-auto mb-6">
                    {/* Location */}
                    <div className="w-full">
                        <div className="text-sm font-semibold mb-1">Địa điểm</div>
                        <AutoComplete
                            options={locations.map((loc) => ({
                                value: loc.tenViTri,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img src={loc.hinhAnh} alt="" className="w-8 h-8 rounded-md object-cover" />
                                        <span>{loc.tenViTri}</span>
                                    </div>
                                ),
                                key: `${loc.id}-${loc.tenViTri}`,
                            }))}
                            placeholder="Bạn sắp đi đâu?"
                            className="w-full"
                            bordered={false}
                            onSelect={handleSelect}
                        />
                    </div>

                    {/* Calendar */}
                    <div className="w-full">
                        <div className="text-sm font-semibold mb-1">Ngày</div>
                        <RangePicker bordered={false} className="w-full" />
                    </div>

                    {/* Guest */}
                    <div className="w-full">
                        <div className="text-sm font-semibold mb-1">Khách</div>
                        <InputNumber
                            min={1}
                            max={100}
                            value={guestCount}
                            onChange={onChangeGuest}
                            className="rounded-full w-full"
                            bordered={false}
                        />
                    </div>

                    {/* Search button */}
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={handleSearch}
                        disabled={!selectedLocation}
                        className="bg-pink-500 hover:bg-pink-600 border-none w-full"
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </CheckMobilePhone>
            {/* Desktop + Tablet Layout */}
            <CheckTablet>
                <div className="flex items-center justify-between rounded-full border border-gray-300 px-6 py-4 shadow-md bg-white w-full max-w-5xl mx-auto mb-6 relative">
                    {/* Location */}
                    <div className="flex flex-col flex-1 items-center border-r border-gray-300 px-4">
                        <div className="text-sm font-semibold mb-1">Địa điểm</div>
                        <AutoComplete
                            options={locations.map((loc) => ({
                                value: loc.tenViTri,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={loc.hinhAnh}
                                            alt=""
                                            className="w-8 h-8 rounded-md object-cover"
                                        />
                                        <span>{loc.tenViTri}</span>
                                    </div>
                                ),
                                key: `${loc.id}-${loc.tenViTri}`,
                            }))}
                            placeholder="Bạn sắp đi đâu?"
                            className="w-full text-center"
                            bordered={false}
                            onSelect={handleSelect}
                        />
                    </div>

                    {/* Calendar */}
                    <div className="flex flex-col flex-1 items-center border-r border-gray-300 px-4">
                        <div className="text-sm font-semibold mb-1">Ngày</div>
                        <Space direction="vertical" size={0}>
                            <RangePicker bordered={false} className="text-center" />
                        </Space>
                    </div>

                    {/* Guest */}
                    <div className="flex flex-col flex-1 items-center px-4">
                        <div className="text-sm font-semibold mb-1">Khách</div>
                        <InputNumber
                            min={1}
                            max={100}
                            value={guestCount}
                            onChange={onChangeGuest}
                            className="rounded-full text-center w-24"
                            bordered={false}
                        />
                    </div>

                    {/* Search button */}
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={handleSearch}
                        disabled={!selectedLocation}
                        className="bg-pink-500 ml-4 hover:bg-pink-600 border-none text-white"
                    />
                </div>
            </CheckTablet>
            <CheckDesktop>
                <div className="flex items-center justify-between rounded-full border border-gray-300 px-6 py-4 shadow-md bg-white w-full max-w-5xl mx-auto mb-6 relative">
                    {/* Location */}
                    <div className="flex flex-col flex-1 items-center border-r border-gray-300 px-4">
                        <div className="text-sm font-semibold mb-1">Địa điểm</div>
                        <AutoComplete
                            options={locations.map((loc) => ({
                                value: loc.tenViTri,
                                label: (
                                    <div className="flex items-center space-x-2">
                                        <img
                                            src={loc.hinhAnh}
                                            alt=""
                                            className="w-8 h-8 rounded-md object-cover"
                                        />
                                        <span>{loc.tenViTri}</span>
                                    </div>
                                ),
                                key: `${loc.id}-${loc.tenViTri}`,
                            }))}
                            placeholder="Bạn sắp đi đâu?"
                            className="w-full text-center"
                            bordered={false}
                            onSelect={handleSelect}
                        />
                    </div>

                    {/* Calendar */}
                    <div className="flex flex-col flex-1 items-center border-r border-gray-300 px-4">
                        <div className="text-sm font-semibold mb-1">Ngày</div>
                        <Space direction="vertical" size={0}>
                            <RangePicker bordered={false} className="text-center" />
                        </Space>
                    </div>

                    {/* Guest */}
                    <div className="flex flex-col flex-1 items-center px-4">
                        <div className="text-sm font-semibold mb-1">Khách</div>
                        <InputNumber
                            min={1}
                            max={100}
                            value={guestCount}
                            onChange={onChangeGuest}
                            className="rounded-full text-center w-24"
                            bordered={false}
                        />
                    </div>

                    {/* Search button */}
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={handleSearch}
                        disabled={!selectedLocation}
                        className="bg-pink-500 ml-4 hover:bg-pink-600 border-none text-white"
                    />
                </div>
            </CheckDesktop>
        </>

    );
}
