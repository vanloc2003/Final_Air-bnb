
import { Form, Input, Button, DatePicker, Select, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerService, RegisterPayload } from '../../api/userService';

const { Title } = Typography;

export default function RegisterPage() {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        try {
            const payload: RegisterPayload = {
                id: 0,
                name: values.name,
                email: values.email,
                password: values.password,
                phone: values.phone,
                birthday: values.birthday.format("YYYY-MM-DD"),
                gender: values.gender === "male",
                role: "USER",
            };

            await registerService(payload);
            toast.success("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            console.error("Đăng ký thất bại:", error);
            toast.error("Đăng ký thất bại!");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
                <Title level={2} className="text-center text-blue-600 mb-8">
                    Đăng Ký Tài Khoản
                </Title>

                <Form
                    name="register-form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Họ tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                    >
                        <Input size="large" placeholder="Nhập họ và tên" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input size="large" placeholder="example@email.com" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password size="large" placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input size="large" placeholder="0123456789" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày sinh"
                        name="birthday"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                    >
                        <DatePicker size="large" format="YYYY-MM-DD" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                    >
                        <Select size="large" placeholder="Chọn giới tính">
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" className="bg-blue-600 hover:bg-blue-700">
                            Đăng ký
                        </Button>
                        <div className="text-center mt-4">
                            <span>Đã có tài khoản? </span>
                            <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập ngay</Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
