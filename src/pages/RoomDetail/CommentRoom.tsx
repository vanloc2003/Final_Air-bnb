import { useEffect, useState } from "react";
import { CommentsTheoMaPhong, getCommentService, postCommentService, PostComment } from "../../api/commentService";
import moment from "moment";
import { Rate } from "antd";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../main";

interface CommentRoomProps {
    maPhong: number;
    maNguoiDung: number;
}
export default function CommentRoom({ maPhong, maNguoiDung }: CommentRoomProps) {
    const [comments, setComments] = useState<CommentsTheoMaPhong[]>([]);
    const [noiDung, setNoiDung] = useState<string>("");
    const [saoBinhLuan, setSaoBinhLuan] = useState<number>(5);
    const { user } = useSelector((state: RootState) => state.userSlice);

    const fetchComment = async (maPhong: number) => {
        try {
            const res = await getCommentService(maPhong);
            setComments(res.data.content);
        } catch (err) {
            console.log(err);
        }
    };

    const handlePostComment = async () => {
        if (!noiDung.trim()) {
            toast.error("Vui lòng nhập nội dung bình luận");
            return;
        }

        const payload: PostComment = {
            id: 0,
            maPhong,
            maNguoiDung: maNguoiDung,
            ngayDen: new Date().toISOString(),
            ngayDi: new Date().toISOString(),
            soLuongKhach: 1,
            noiDung,
            saoBinhLuan,
        };

        try {
            await postCommentService(payload);
            toast.success("Gửi bình luận thành công");
            await fetchComment(maPhong);
            setNoiDung("");
            setSaoBinhLuan(5);
        } catch (err) {
            toast.error("Không thể gửi bình luận");
            console.log(err);
        }
    };

    useEffect(() => {
        fetchComment(maPhong);
    }, [maPhong]);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Bình luận</h2>

            {/* Form nhập bình luận */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <div className="flex items-center mb-2">
                    {user ? (
                        <>
                            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-2" />
                            <span className="font-semibold">{user.name}</span>
                        </>
                    ) : (
                        <span className="text-red-500">Vui lòng đăng nhập để bình luận</span>
                    )}
                </div>

                <div className="mb-2">
                    <Rate value={saoBinhLuan} onChange={setSaoBinhLuan} />
                </div>

                <textarea
                    className="w-full p-2 border rounded resize-none"
                    rows={4}
                    placeholder="Write something..."
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                />

                <button
                    onClick={handlePostComment}
                    className="cursor-pointer mt-3 bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded"
                >
                    Đánh giá
                </button>
            </div>

            {/* Danh sách bình luận */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-2">
                {comments.map((cmt) => (
                    <div
                        key={cmt.id}
                        className="bg-white p-4 rounded shadow flex flex-col gap-1"
                    >
                        <div className="flex items-center mb-1">
                            <img
                                src={cmt.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <p className="font-bold uppercase">{cmt.tenNguoiBinhLuan}</p>
                                <p className="text-gray-500 text-sm">
                                    {moment(cmt.ngayBinhLuan).fromNow()}
                                </p>
                            </div>
                        </div>
                        <Rate disabled defaultValue={cmt.saoBinhLuan} />
                        <p className="text-gray-800 break-words">{cmt.noiDung}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
