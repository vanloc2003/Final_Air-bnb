
import UserDetail from './UserDetail'
import BookedRoom from './BookedRoom'


export default function DoashBoardPage() {
    return (
        <>

            <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 px-4 gap-10 flex-wrap md:flex-wrap lg:flex-nowrap">
                <div >
                    <UserDetail />
                </div>
                <div>
                    <BookedRoom />
                </div>
            </div>
        </>
    )
};
