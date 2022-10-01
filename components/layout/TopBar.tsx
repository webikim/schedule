import React, { Dispatch, useContext } from 'react';
import { Box, Button, IconButton, styled, Toolbar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { AccountCircle } from '@mui/icons-material';
import MenuContext from '../../store/menuContext';

export const menus = ['예약관리', '예약하기'];
export const pages = ['/reception', '/schedule'];

interface AppBarProps {
    isopen: string;
    drawerwidth: number;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, isopen, drawerwidth }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(isopen === 'true'
        ? {
              marginLeft: drawerwidth,
              width: `calc(100% - ${drawerwidth}px)`,
              transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
              }),
          }
        : undefined),
}));

interface Props {
    isopen: string;
    setIsOpen: Dispatch<React.SetStateAction<string>>;
    drawerwidth: number;
}

const TopBar = (props: Props) => {
    const menuCtx = useContext(MenuContext);
    const { data } = useSession();
    const router = useRouter();

    const handleClickMenu = (menuId: number) => () => {
        menuCtx.setNavigation({ position: { top: menuId } });
        router.push(pages[menuId]);
    };

    const handleDrawerIcon = () => {
        props.setIsOpen(props.isopen === 'true' ? 'false' : 'true');
    };

    return (
        <>
            <AppBar
                position="fixed"
                isopen={props.isopen}
                drawerwidth={props.drawerwidth}
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
                        {props.isopen === 'true' ? (
                            <ChevronLeftIcon />
                        ) : (
                            <MenuIcon />
                        )}
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
