import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { Input, Spin, Table, Button, Modal, Form, DatePicker, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import debounce from 'lodash/debounce';
import { addUserService, deleteUserService, getUserService, updateUserService, UserType } from '../../api/userService';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';



export default function UserManager() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [editingUsers, setEditingUsers] = useState<UserType | null>(null);
    const [form] = Form.useForm();
    // Gọi API lấy danh sách user
    const fetchUsers = async (page: number, size: number, search: string) => {
        try {
            const res = await getUserService(page, size, search);
            setUsers(res.data.content.data);
            setTotalUsers(res.data.content.totalRow);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await deleteUserService(userId);
            toast.success('Xóa người dùng thành công');
            fetchUsers(pageIndex, pageSize, keyword)
        } catch (error) {
            console.log('✌️error --->', error);
            toast.error('Xóa người dùng thất bại');

        }
    }

    // Sự kiện thay đổi trang
    const handleTableChange = (pagination: any) => {
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
    };

    // Debounce search
    const debouncedSearch = useMemo(() => {
        return debounce((value: string) => {
            startTransition(() => {
                setPageIndex(1);
                fetchUsers(1, pageSize, value);
            });
        }, 500);
    }, [pageSize]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const trimValue = value.trim();
        setKeyword(value);
        debouncedSearch(trimValue);
    };
    const renderAddUserModal = () => (
        <Modal
            title="Thêm quản trị viên"
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
                        await addUserService(payload);
                        toast.success("Thêm user thành công");
                        setIsAddModalOpen(false);
                        form.resetFields();
                        fetchUsers(pageIndex, pageSize, keyword);
                    } catch (err) {
                        toast.error("Lỗi khi thêm user");
                    }
                }}
            >
                {renderUserFormFields()}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Thêm</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
    const renderUpdateUserModal = () => (
        <Modal
            title="Cập nhật đặt phòng"
            open={isUpdateModalOpen}
            onCancel={() => {
                setIsUpdateModalOpen(false);
                setEditingUsers(null);
                form.resetFields();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    if (!editingUsers) return;
                    try {
                        const payload = { ...editingUsers, ...values };
                        await updateUserService(payload);
                        toast.success("Cập nhật user thành công");
                        setIsUpdateModalOpen(false);
                        setEditingUsers(null);
                        form.resetFields();
                        fetchUsers(pageIndex, pageSize, keyword);
                    } catch (err) {
                        toast.error("Lỗi khi cập nhật phòng");
                    }
                }}
            >
                {renderUserFormFields()}
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">Cập nhật</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
    const renderUserFormFields = () => (
        <>
            <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                <Input className="w-full" />
            </Form.Item>
            <Form.Item name="birthday" label="Sinh nhật" rules={[{ required: true }]}>
                <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                <Select className="w-full" placeholder="Chọn giới tính">
                    <Select.Option value={true}>Nam</Select.Option>
                    <Select.Option value={false}>Nữ</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                <Select className="w-full" placeholder="Chọn vai trò">
                    <Select.Option value="ADMIN">ADMIN</Select.Option>
                    <Select.Option value="USER">USER</Select.Option>
                </Select>
            </Form.Item>

        </>
    );
    const columns: ColumnsType<UserType> = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        { title: 'Birthday', dataIndex: 'birthday', key: 'birthday' },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender: boolean) => (gender ? 'Nam' : 'Nữ'),
        },
        { title: 'Role', dataIndex: 'role', key: 'role' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: UserType) => (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingUsers(record);
                            form.setFieldsValue({
                                ...record,
                                birthday: record.birthday ? dayjs(record.birthday) : null,
                            });
                            setIsUpdateModalOpen(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button onClick={() => {
                        handleDeleteUser(record.id);
                    }} danger>Xoá</Button>
                </div >
            ),
        }
    ];

    useEffect(() => {
        fetchUsers(pageIndex, pageSize, keyword);
    }, [pageIndex, pageSize]);

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
            <div className="mb-5 flex justify-between items-center">
                <Button type="primary" onClick={isAddModalOpen ? () => setIsAddModalOpen(false) : () => setIsAddModalOpen(true)}>Thêm quản trị viên</Button>
                <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={keyword}
                    onChange={handleSearchChange}
                    className="w-full max-w-md"
                    suffix={isPending ? <Spin size="small" /> : null}
                />
            </div>

            <Table
                rowKey="id"
                dataSource={users}
                columns={columns}
                pagination={{
                    current: pageIndex,
                    pageSize: pageSize,
                    total: totalUsers,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />

            {renderAddUserModal()}
            {renderUpdateUserModal()}
        </div>
    );
}
