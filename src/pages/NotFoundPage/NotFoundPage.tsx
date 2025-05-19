
import "./index.css"
import { Link } from 'react-router'
export default function NotFoundPage() {
    return (
        <div className='not-found'>
            <div className="container1">
                <div className="error-content">
                    <div className="error-illustration">
                        <img src="https://media1.giphy.com/media/14uQ3cOFteDaU/200w.gif?cid=6c09b952405jipt6e3lhch1k4p4xt12dk8c1ek9l2rrux46h&ep=v1_gifs_search&rid=200w.gif&ct=g" alt="404 Illustration" />
                    </div>
                    <div className="error-message">
                        <h1 className="error-code">404</h1>
                        <p>Oops! The page does not exist.</p>
                        <div>
                            <Link to="/" className="btn btn-primary">Back to Home</Link>
                        </div>
                    </div>
                </div>
                <footer className="footer">
                    <p>© 2024  Varchar co. All rights reserved.</p>
                </footer>
            </div>
        </div>

    )
}
