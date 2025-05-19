import React, { useEffect } from 'react'
import { useState, useTransition, useMemo } from 'react';
import { addBookingService, BookedRooms, deleteBookingService, getBookingService, updateBookingService } from '../../api/bookroomService';
import debounce from 'lodash/debounce';
import { Button, Input, Spin, Table, Modal, InputNumber, DatePicker, Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function BookingManager() {
    const [allBooking, setAllBooking] = useState<BookedRooms[]>([]);
    const [filteredBooking, setFilteredBooking] = useState<BookedRooms[]>([]);
    const [totalBooking, setTotalBooking] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<BookedRooms | null>(null);
    const [form] = Form.useForm();

    const fetchBooking = async () => {
        try {
            const res = await getBookingService();
            const allData = res.data.content;
            setAllBooking(allData);
            setFilteredBooking(allData);
            setTotalBooking(allData.length);
        } catch (error) {
            console.log('✌️error --->', error);
        }
    };
    const handleDeleteBooking = async (id: number) => {
        try {
            await deleteBookingService(id);
            toast.success('Xóa đặt phòng thành công');
            fetchBooking();
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error('Xóa đặt phòng thất bại');
        }
    }

    const debouncedSearch = useMemo(() => {
        return debounce((value: string) => {
            startTransition(() => {
                const filtered = allBooking.filter(item =>
                    item.maPhong.toString().includes(value)
                );
                setFilteredBooking(filtered);
                setPageIndex(1);
                setTotalBooking(filtered.length);
            });
        }, 500);
    }, [allBooking]);

    const paginatedBooking = useMemo(() => {
        const start = (pageIndex - 1) * pageSize;
        return filteredBooking.slice(start, start + pageSize);
    }, [filteredBooking, pageIndex, pageSize]);

    const handleTableChange = (pagination: any) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const trimValue = value.trim();
        setKeyword(value);
        debouncedSearch(trimValue);
    };


    const columns: ColumnsType<BookedRooms> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Mã phòng', dataIndex: 'maPhong', key: 'maPhong' },
        { title: 'Ngày đến', dataIndex: 'ngayDen', key: 'ngayDen' },
        { title: 'Ngày đi', dataIndex: 'ngayDi', key: 'ngayDi' },
        { title: 'Số lượng khách', dataIndex: 'soLuongKhach', key: 'soLuongKhach' },
        { title: 'Mã người dùng', dataIndex: 'maNguoiDung', key: 'maNguoiDung' },

        {
            title: 'Action',
            key: 'action',
            render: (_, record: BookedRooms) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingBooking(record);
                            setIsUpdateModalOpen(true);
                            form.setFieldsValue({
                                ...record,
                                ngayDen: dayjs(record.ngayDen),
                                ngayDi: dayjs(record.ngayDi),
                            });
                        }}
                    >
                        Sửa
                    </Button>

                    <Button onClick={() => {
                        handleDeleteBooking(record.id);
                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];

    // Cú pháp es7
    // bất đồng bộ thì phải có async await
    const renderAddBookingModal = () => (
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
                            ngayDen: values.ngayDen.format("YYYY-MM-DD"),
                            ngayDi: values.ngayDi.format("YYYY-MM-DD"),
                            id: 0,
                        };
                        await addBookingService(payload);
                        toast.success("Thêm đặt phòng thành công");
                        fetchBooking();
                        setIsAddModalOpen(false);
                        form.resetFields();
                    } catch (err) {
                        toast.error("Lỗi khi thêm đặt phòng");
                    }
                }}
            >
                {renderBookingFormFields()}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Thêm</Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    const renderUpdateBookingModal = () => (
        <Modal
            title="Cập nhật đặt phòng"
            open={isUpdateModalOpen}
            onCancel={() => {
                setIsUpdateModalOpen(false);
                setEditingBooking(null);
                form.resetFields();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    if (!editingBooking) return;
                    try {
                        const payload = {
                            ...values,
                            id: editingBooking.id,
                            ngayDen: values.ngayDen.format("YYYY-MM-DD"),
                            ngayDi: values.ngayDi.format("YYYY-MM-DD"),
                        };
                        await updateBookingService(payload);
                        toast.success("Cập nhật thành công");
                        fetchBooking();
                        setIsUpdateModalOpen(false);
                        form.resetFields();
                    } catch (err) {
                        toast.error("Lỗi khi cập nhật đặt phòng");
                    }
                }}
            >
                {renderBookingFormFields()}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Cập nhật</Button>
                </Form.Item>
            </Form>
        </Modal>
    );

    const renderBookingFormFields = () => (
        <>
            <Form.Item name="maNguoiDung" label="Mã người dùng" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="maPhong" label="Mã phòng" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item name="ngayDen" label="Ngày đến" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="ngayDi" label="Ngày đi" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="soLuongKhach" label="Số lượng khách" rules={[{ required: true }]}>
                <InputNumber className="w-full" />
            </Form.Item>
        </>
    );

    useEffect(() => {
        fetchBooking();
    }, [])
    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={isAddModalOpen ? () => setIsAddModalOpen(false) : () => setIsAddModalOpen(true)}>Thêm đặt phòng</Button>
                <Input
                    placeholder="Tìm kiếm đặt phòng..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={paginatedBooking}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalBooking,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
            {renderAddBookingModal()}
            {renderUpdateBookingModal()}
        </div>

    );
}
