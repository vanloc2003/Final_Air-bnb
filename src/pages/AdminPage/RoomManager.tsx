import React, { useEffect } from 'react'
import { useState, useTransition, useMemo } from 'react';
import { addRoomService, deleteRoomService, getRoomSearchService, RoomDetailType, updateRoomService } from '../../api/roomService';
import debounce from 'lodash/debounce';
import { Button, Input, Spin, Table, Modal, InputNumber, Checkbox, Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';



export default function RoomManager() {
    const [rooms, setRooms] = useState<RoomDetailType[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRooms, setTotalRooms] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [editingRooms, setEditingRooms] = useState<RoomDetailType | null>(null);
    const [form] = Form.useForm();
    const fetchRoom = async (page: number, size: number, search: string) => {
        try {
            const res = await getRoomSearchService(page, size, search);
            setRooms(res.data.content.data);
            setTotalRooms(res.data.content.totalRow);
        } catch (error) {
            console.log('✌️error --->', error);

        }
    }
    const handleDeleteRoom = async (id: number) => {
        try {
            await deleteRoomService(id);
            toast.success('Xóa phòng thành công!');
            fetchRoom(pageIndex, pageSize, keyword);
        } catch (error) {
            console.log('✌️error --->', error);

        }
    }
    const handleTableChange = (pagination: any) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    // Debounce search
    const debouncedSearch = useMemo(() => {
        return debounce((value: string) => {
            startTransition(() => {
                setPageIndex(1);
                fetchRoom(1, pageSize, value);
            });
        }, 500);
    }, [pageSize]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const trimValue = value.trim();
        setKeyword(value);
        debouncedSearch(trimValue);
    };

    const columns: ColumnsType<RoomDetailType> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên phòng', dataIndex: 'tenPhong', key: 'tenPhong' },
        { title: 'Khách', dataIndex: 'khach', key: 'khach' },
        { title: 'Phòng ngủ', dataIndex: 'phongNgu', key: 'phongNgu' },
        { title: 'Giường', dataIndex: 'giuong', key: 'giuong' },
        { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa' },
        { title: 'Giá tiền', dataIndex: 'giaTien', key: 'giaTien' },
        {
            title: 'Hình Ảnh',
            dataIndex: 'hinhAnh',
            key: 'hinhAnh',
            render: (text: string) => (
                <img src={text} alt="room" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: RoomDetailType) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingRooms(record);
                            form.setFieldsValue(record); // Gán dữ liệu vào form
                            setIsUpdateModalOpen(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button onClick={() => {
                        handleDeleteRoom(record.id);
                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];
    const renderAddRoomModal = () => (
        <Modal
            title="Thêm đặt phòng"
            open={isAddModalOpen}
            onCancel={() => {
                setIsAddModalOpen(false);
                form.resetFields();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    try {
                        const payload = {
                            ...values,
                        };
                        await addRoomService(payload);
                        toast.success("Thêm phòng thành công");
                        setIsAddModalOpen(false);
                        form.resetFields();
                        fetchRoom(pageIndex, pageSize, keyword);
                    } catch (err) {
                        toast.error("Lỗi khi thêm phòng");
                    }
                }}
            >
                {renderRoomFormFields()}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Thêm</Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    const renderUpdateRoomModal = () => (
        <Modal
            title="Cập nhật đặt phòng"
            open={isUpdateModalOpen}
            onCancel={() => {
                setIsUpdateModalOpen(false);
                setEditingRooms(null);
                form.resetFields();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    if (!editingRooms) return;
                    try {
                        const payload = { ...editingRooms, ...values };
                        await updateRoomService(payload);
                        toast.success("Cập nhật phòng thành công");
                        setIsUpdateModalOpen(false);
                        setEditingRooms(null);
                        form.resetFields();
                        fetchRoom(pageIndex, pageSize, keyword);
                    } catch (err) {
                        toast.error("Lỗi khi cập nhật phòng");
                    }
                }}
            >
                {renderRoomFormFields()}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Cập nhật</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
    const renderRoomFormFields = () => (
        <>
            <Form.Item name="tenPhong" label="Tên phòng" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="khach" label="Khách" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="phongNgu" label="Phòng ngủ" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="giuong" label="Giường" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="phongTam" label="Phòng tắm" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="moTa" label="Mô tả" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="giaTien" label="Giá tiền" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="mayGiat" label="Máy giặt" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="banLa" label="Bàn là" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="tivi" label="Ti vi" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="dieuHoa" label="Điều hòa" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="wifi" label="Wifi" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="bep" label="Bếp" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="doXe" label="Đỗ xe" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="hoBoi" label="Hồ bơi" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="banUi" label="Bàn ủi" rules={[{ required: false }]}>
                <Checkbox className="w-full" />
            </Form.Item>
            <Form.Item name="hinhAnh" label="Hình ảnh" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
        </>
    );
    useEffect(() => {
        fetchRoom(pageIndex, pageSize, keyword);
    }, [pageIndex, pageSize])
    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={isAddModalOpen ? () => setIsAddModalOpen(false) : () => setIsAddModalOpen(true)}>Thêm phòng thuê</Button>
                <Input
                    placeholder="Tìm kiếm phòng..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={rooms}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalRooms,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
            {renderAddRoomModal()}
            {renderUpdateRoomModal()}
        </div>
    );
}
