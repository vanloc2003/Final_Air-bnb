
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../main'
import { setUserLoginAction } from '../LoginPage/redux/userSlice';
import { uploadAvatarUserService } from '../../api/userService';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router';
export default function UserDetail() {
    const { user } = useSelector((state: RootState) => state.userSlice);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const resizeImage = (file: File, size = 300): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target?.result as string;
            };

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d")!;
                const minSize = Math.min(img.width, img.height);

                // Crop ảnh từ chính giữa (center crop)
                const cropX = (img.width - minSize) / 2;
                const cropY = (img.height - minSize) / 2;

                canvas.width = size;
                canvas.height = size;
                ctx.drawImage(
                    img,
                    cropX,
                    cropY,
                    minSize,
                    minSize,
                    0,
                    0,
                    size,
                    size
                );

                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Resize failed"));
                }, file.type);
            };

            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };
    const handleUpload = async () => {
        if (!selectedFile) return;
        try {
            const resizedBlob = await resizeImage(selectedFile); // ⬅️ resized image
            const resizedFile = new File([resizedBlob], selectedFile.name, { type: selectedFile.type });

            const res = await uploadAvatarUserService(resizedFile);
            const updatedAvatar = res.data.content.avatar;

            const updatedUser = { ...user, avatar: updatedAvatar };
            dispatch(setUserLoginAction(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setAvatarPreview(updatedAvatar);

            toast.success("Tải ảnh thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Tải ảnh thất bại!");
        }
    };

    return (
        <div className="w-80 bg-white border rounded-xl shadow-md p-6 mx-auto">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-full border-4 border-gray-300 overflow-hidden shadow flex items-center justify-center bg-gray-100">

                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    )}
                </div>

                <label className="mt-3 text-blue-600 text-sm cursor-pointer hover:underline">
                    Cập nhật ảnh
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>

                {selectedFile && (
                    <button
                        onClick={handleUpload}
                        className="mt-2 text-xs px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Tải lên
                    </button>
                )}
            </div>

            {/* Identity Verification */}
            <div className="mt-6">
                <div className="flex items-center gap-2 mb-1">
                    <i className="fa fa-check-circle text-green-500"></i>
                    <h3 className="font-semibold text-gray-800">Xác minh danh tính</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                    Xác thực danh tính của bạn với huy hiệu xác minh danh tính.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/')}
                        className="cursor-pointer flex-1 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                        Về Trang Home
                    </button>
                    <button className="cursor-pointer flex-1 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100 transition">
                        Nhận huy hiệu
                    </button>
                </div>
            </div>

            {/* Verified Info */}
            <div className="mt-6 border-t pt-4">
                <h4 className="font-semibold text-sm text-gray-800 mb-2">Đã xác nhận</h4>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                    <i className="fa fa-check text-green-600"></i>
                    <span>Địa chỉ email</span>
                </div>
            </div>
        </div>

    );
}
