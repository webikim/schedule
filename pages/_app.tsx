import { SessionProvider } from 'next-auth/react';
import Layout from '../components/layout/Layout';
import { NotificationContextProvider } from '../store/notification-context';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { MenuContextProvider } from '../store/menuContext';

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={pageProps.session}>
            <NotificationContextProvider>
                <MenuContextProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </MenuContextProvider>
            </NotificationContextProvider>
        </SessionProvider>
    );
}

export default MyApp;
