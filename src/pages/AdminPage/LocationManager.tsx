import { useState, useMemo, useTransition, useEffect } from 'react';
import { addLocationService, deleteLocationService, getLocationSearchService, Location, updateLocationService } from '../../api/locationService'
import debounce from 'lodash/debounce';
import React from 'react';
import { Button, Input, Spin, Table, Modal, Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';

export default function LocationManager() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [totalLocations, setTotalLocations] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [editingLocations, setEditingLocations] = useState<Location | null>(null);
    const [form] = Form.useForm();
    const fetchLocation = async (page: number, size: number, search: string) => {
        try {
            const res = await getLocationSearchService(page, size, search);
            setLocations(res.data.content.data);
            setTotalLocations(res.data.content.totalRow);
        } catch (error) {
            console.log('✌️error --->', error);

        }
    }
    const handleDeleteLocation = async (id: number) => {
        try {
            await deleteLocationService(id);
            toast.success('Xóa vị trí thành công');
            fetchLocation(pageIndex, pageSize, keyword);
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
                fetchLocation(1, pageSize, value);
            });
        }, 500);
    }, [pageSize]);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const trimValue = value.trim();
        setKeyword(value);
        debouncedSearch(trimValue);
    };
    const columns: ColumnsType<Location> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên vị trí', dataIndex: 'tenViTri', key: 'tenViTri' },
        { title: 'Tỉnh thành', dataIndex: 'tinhThanh', key: 'tinhThanh' },
        { title: 'Quốc gia', dataIndex: 'quocGia', key: 'quocGia' },
        {
            title: 'Hình Ảnh',
            dataIndex: 'hinhAnh',
            key: 'hinhAnh',
            render: (text: string) => (
                <img src={text} alt="location" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: Location) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingLocations(record);
                            form.setFieldsValue(record); // Gán dữ liệu vào form
                            setIsUpdateModalOpen(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button onClick={() => {
                        handleDeleteLocation(record.id);
                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];
    const renderAddLocationModal = () => (
        <Modal
            title="Thêm vị trí"
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
                        await addLocationService(payload);
                        toast.success("Thêm vị trí thành công");
                        setIsAddModalOpen(false);
                        form.resetFields();
                        fetchLocation(pageIndex, pageSize, keyword);
                    } catch (err) {
                        toast.error("Lỗi khi thêm vị trí");
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

    const renderUpdateLocationModal = () => (
        <Modal
            title="Cập nhật vị trí"
            open={isUpdateModalOpen}
            onCancel={() => {
                setIsUpdateModalOpen(false);
                setEditingLocations(null);
                form.resetFields();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    if (!editingLocations) return;
                    try {
                        const payload = { ...editingLocations, ...values };
                        await updateLocationService(payload);
                        toast.success("Cập nhật vị trí thành công");
                        setIsUpdateModalOpen(false);
                        setEditingLocations(null);
                        form.resetFields();
                        fetchLocation(pageIndex, pageSize, keyword);
                    } catch (err) {
                        toast.error("Lỗi khi cập nhật vị trí");
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
            <Form.Item name="tenViTri" label="Tên vị trí" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="tinhThanh" label="Tỉnh thành" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="quocGia" label="Quốc gia" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="hinhAnh" label="Hình ảnh" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
        </>
    );
    useEffect(() => {
        fetchLocation(pageIndex, pageSize, keyword);
    }, [pageIndex, pageSize]);
    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={isAddModalOpen ? () => setIsAddModalOpen(false) : () => setIsAddModalOpen(true)}>Thêm vị trí</Button>
                <Input
                    placeholder="Tìm kiếm vị trí..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={locations}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalLocations,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />
            {renderAddLocationModal()}
            {renderUpdateLocationModal()}
        </div>
    );
}
