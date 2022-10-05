import React, { ReactNode, useContext, useState } from 'react';
import { Box, Container, CssBaseline, useTheme } from '@mui/material';
import NotificationContext from '../../store/notification-context';
import NotificationBar from '../ui/NotificationBar';
import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import LeftMenu from '../menu/LeftMenu';

const drawerWidth = 240;
const drawerHeader = '69px';

interface LaytoutProps {
    children?: ReactNode;
}

const Layout = (props: LaytoutProps) => {
    const [isOpen, setIsOpen] = useState('false');
    const notificationCtx = useContext(NotificationContext);
    const theme = useTheme();

    const handleNotificationClose = () => {
        notificationCtx.hideNotification();
    };

    const notification = notificationCtx.notification;
    // const message = notificationCtx.notification
    //     ? notificationCtx.notification.message
    //     : null;

    return (
        <>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <CssBaseline />
                <TopBar
                    isopen={isOpen}
                    setIsOpen={setIsOpen}
                    drawerwidth={drawerWidth}
                />
                <LeftDrawer
                    isopen={isOpen}
                    drawerwidth={drawerWidth}
                    drawerheader={drawerHeader}
                >
                    <LeftMenu isOpen={isOpen} />
                </LeftDrawer>
                <Box component="main" sx={{ flexGrow: 1, paddingTop: '69px' }}>
                    {props.children}
                </Box>
                {/* <main>
                    <Container sx={{ marginTop: '2em', flexGrow: 1 }}>
                        <DrawerHeader />
                        {props.children}
                    </Container>
                </main> */}
                <footer></footer>
                <NotificationBar
                    open={notification !== null}
                    onClose={handleNotificationClose}
                    notification={notification}
                ></NotificationBar>
            </Box>
        </>
    );
};

export default Layout;
