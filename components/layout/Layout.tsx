import React, { ReactNode, useContext, useState } from 'react';
import { Container, useTheme } from '@mui/material';
import NotificationContext from '../../store/notification-context';
import NotificationBar from '../ui/NotificationBar';
import TopBar from './TopBar';
import LeftDrawer, { DrawerHeader } from './LeftDrawer';

const drawerWidth = 240;

interface LaytoutProps {
    children?: ReactNode;
}

const Layout = (props: LaytoutProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const notificationCtx = useContext(NotificationContext);
    const theme = useTheme();

    const handleNotificationClose = () => {
        notificationCtx.hideNotification();
    };

    const message = notificationCtx.notification
        ? notificationCtx.notification.message
        : null;

    return (
        <>
            <TopBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                drawerWidth={drawerWidth}
            />
            <LeftDrawer isOpen={isOpen} drawerWidth={drawerWidth} />
            <main>
                <Container sx={{ marginTop: '2em', flexGrow: 1 }}>
                    <DrawerHeader />
                    {props.children}
                </Container>
            </main>
            <footer></footer>
            <NotificationBar
                open={message !== null}
                onClose={handleNotificationClose}
                message={message}
            ></NotificationBar>
        </>
    );
};

export default Layout;
