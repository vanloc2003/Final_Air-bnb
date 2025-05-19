
import { useSelector } from 'react-redux'
import { RootState } from '../../main'
import { BeatLoader } from 'react-spinners'
export default function LoadingPage() {
    const { isLoading } = useSelector((state: RootState) => state.loadingSlice);
    return (
        isLoading ? (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "black",
                    zIndex: 9999,
                    display: "flex",    
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <BeatLoader color='#1E90FF' size={30} speedMultiplier={1} />
            </div>
        ) : null
    )
}
