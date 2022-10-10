import React, { Dispatch, useContext, useEffect } from 'react';
import {
    Box,
    Button,
    IconButton,
    styled,
    Toolbar,
    useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { AccountCircle } from '@mui/icons-material';
import MenuContext from '../../store/menuContext';

import { getString } from '../locale/stringUtil';
import LocaleContext from '../../store/localeContext';

const locale = 'en';

const strings = {
    message: {},
    label: {
        signin_menu: {
            en: 'Sign In',
            kr: '로그인',
        },
        signout_menu: {
            en: 'Sign Out',
            kr: '로그아웃',
        },
    },
};

export const menus: { [x: string]: string[] } = {
    en: ['Home', 'Schedule', 'Reserve'],
    kr: ['홈', '예약만들기', '예약하기'],
};
export const pages = ['/', '/schedule/create', '/reserve/register'];
export const USER_MENU = menus[locale].length - 1;

export const APPBAR_OPEN = 'open';
export const APPBAR_CLOSE = 'close';

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
    ...(isopen === APPBAR_OPEN
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

    const localeCtx = useContext(LocaleContext);
    const lang = localeCtx.locale ? localeCtx.locale.lang : 'en';

    const theme = useTheme();
    let position = menuCtx.navigation?.position;

    useEffect(() => {
        if (!position) {
            position = { top: -1 };
            menuCtx.setNavigation({
                position: position,
            });
        }
    });

    const handleClickMenu = (menuId: number) => () => {
        menuCtx.setNavigation({ position: { top: menuId - 1, left: 0 } });
        props.setIsOpen(menuId === 0 ? APPBAR_CLOSE : APPBAR_OPEN);
        router.push(pages[menuId]);
    };

    const handleClickDrawerIcon = () => {
        if (position && position.top !== undefined && position.top >= 0) {
            props.setIsOpen(
                props.isopen === APPBAR_OPEN ? APPBAR_CLOSE : APPBAR_OPEN
            );
        }
    };

    const handleClickUser = () => {
        menuCtx.setNavigation({ position: { top: USER_MENU, left: 0 } });
        props.setIsOpen(APPBAR_OPEN);
        router.push('/user/profile');
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
                        onClick={handleClickDrawerIcon}
                        edge="start"
                        sx={{
                            marginRight: 5,
                        }}
                    >
                        {props.isopen === APPBAR_OPEN ? (
                            <ChevronLeftIcon />
                        ) : (
                            <MenuIcon />
                        )}
                    </IconButton>

                    <Box sx={{ flexGrow: 1, display: 'flex' }}>
                        {data &&
                            menus[lang].map((menu, index) => {
                                const background =
                                    index - 1 === position?.top
                                        ? theme.palette.primary.dark
                                        : undefined;
                                return (
                                    <Button
                                        key={index}
                                        onClick={handleClickMenu(index)}
                                        sx={{
                                            my: 2,
                                            color: 'white',
                                            display: 'block',
                                            backgroundColor: { background },
                                        }}
                                    >
                                        {menu}
                                    </Button>
                                );
                            })}
                    </Box>
                    {!data && (
                        <Button
                            color="inherit"
                            onClick={() => router.replace('/auth')}
                        >
                            {getString(lang, strings.label.signin_menu)}
                        </Button>
                    )}
                    {data && (
                        <>
                            <Button color="inherit" onClick={() => signOut()}>
                                {getString(lang, strings.label.signout_menu)}
                            </Button>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleClickUser}
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
