
import { Form, Input, Button, Typography, Checkbox } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginService, LoginPayload } from '../../api/userService';
import { setUserLoginAction } from './redux/userSlice';
import { AppDispatch } from '../../main';
import { https } from '../../api/config';

const { Text, Title } = Typography;

export default function LoginPage() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const fetchUserLogin = async (formValues: { taiKhoan: string; matKhau: string }) => {
        try {
            const payload: LoginPayload = {
                email: formValues.taiKhoan,
                password: formValues.matKhau,
            };

            const res = await loginService(payload);
            const { user, token } = res.data.content;
            const data = { ...user, token };
            dispatch(setUserLoginAction(data));
            localStorage.setItem('user', JSON.stringify({ ...user, token }));
            https.defaults.headers.common['token'] = token;
            toast.success("Đăng nhập thành công!");
            navigate('/');
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            toast.error("Đăng nhập thất bại!");
        }
    };

    const onFinish = (values: { taiKhoan: string; matKhau: string }) => {
        fetchUserLogin(values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Form lỗi:', errorInfo);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 shadow-xl rounded-xl w-full max-w-lg">
                <Title level={2} className="text-center text-blue-600 mb-8">
                    Đăng Nhập
                </Title>

                <Form
                    name="login-form"
                    layout="vertical"
                    initialValues={{ taiKhoan: '', matKhau: '' }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tài khoản"
                        name="taiKhoan"
                        rules={[{ required: true, message: 'Tài khoản không được để trống!' }]}
                    >
                        <Input size="large" placeholder="Nhập tài khoản" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="matKhau"
                        rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                    >
                        <Input.Password size="large" placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item className="mb-4">
                        <div className="flex justify-between items-center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                            </Form.Item>
                            <a href="#" className="text-blue-500 hover:underline text-sm">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" className="bg-blue-600 hover:bg-blue-700">
                            Đăng nhập
                        </Button>
                    </Form.Item>

                    <div className="text-center mt-4 text-sm">
                        <Text>Bạn chưa có tài khoản? </Text>
                        <Link to="/register" className="text-blue-500 hover:underline">Đăng ký ngay!</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}
