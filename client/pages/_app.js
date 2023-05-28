/**
 * Next.js uses App component to init pages
 * The app component runs first and gets renders for users
 * This is the best location to add any css 
 * MUST restart the server after any changes to this file
 */
import TopNav from '../components/TopNav';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/bootstrap.css';

import 'antd/dist/antd.css';
import '../public/css/styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from '../context';



function MyApp({ Component, pageProps }) {
    return (
        <Provider>
            <ToastContainer position="top-center" />
            <TopNav />
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;