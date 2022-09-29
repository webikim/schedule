import React, { Dispatch } from 'react';
import { Box, Button, IconButton, styled, Toolbar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { AccountCircle } from '@mui/icons-material';

export const menus = ['예약관리', '예약하기'];
export const pages = ['/reception', '/schedule'];

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<TopBarProp>(({ theme, isOpen, drawerWidth }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isOpen && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

interface TopBarProp {
    isOpen: boolean;
    setIsOpen: Dispatch<React.SetStateAction<boolean>>;
    drawerWidth: number;
}

const TopBar = (props: TopBarProp) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const { data } = useSession();
    const router = useRouter();

    const handleClickMenu = (menuId: number) => () => {
        router.push(pages[menuId]);
    };

    const handleDrawerIcon = () => {
        props.setIsOpen(props.isOpen ? false : true);
    };

    return (
        <>
            <AppBar
                position="fixed"
                isOpen={props.isOpen}
                setIsOpen={props.setIsOpen}
                drawerWidth={props.drawerWidth}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerIcon}
                        edge="start"
                        sx={{
                            marginRight: 5,
                        }}
                    >
                        {props.isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        {menus.map((menu, index) => (
                            <Button
                                key={index}
                                onClick={handleClickMenu(index)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {menu}
                            </Button>
                        ))}
                    </Box>
                    {!data && (
                        <Button
                            color="inherit"
                            onClick={() => router.replace('/auth')}
                        >
                            로그인
                        </Button>
                    )}
                    {data && (
                        <>
                            <Button color="inherit" onClick={() => signOut()}>
                                로그아웃
                            </Button>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={() => router.push('/user')}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
};

export default TopBar;
