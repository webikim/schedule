import { SessionProvider } from 'next-auth/react';
import Layout from '../components/layout/Layout';
import { NotificationContextProvider } from '../store/notification-context';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { MenuContextProvider } from '../store/menuContext';
import { LocaleContextProvider } from '../store/localeContext';

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
    return (
        <SessionProvider session={pageProps.session}>
            <NotificationContextProvider>
                <MenuContextProvider>
                    <LocaleContextProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </LocaleContextProvider>
                </MenuContextProvider>
            </NotificationContextProvider>
        </SessionProvider>
    );
}

export default MyApp;
