import {
    AppBar,
    Box,
    Button,
    IconButton,
    styled,
    Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AccountCircle } from '@mui/icons-material';

export const menus = ['TimeTable', 'Schedule'];
export const pages = ['/table', '/week'];

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

export const paddingAppSpace = () => {
    return <DrawerHeader></DrawerHeader>;
};

interface TopBarProp {}

const TopBar = (props: TopBarProp) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const { data } = useSession();
    const router = useRouter();

    const handleClickMenu = (menuId: number) => () => {
        router.push(pages[menuId]);
    };

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        sx={{
                            marginRight: 5,
                        }}
                    >
                        <MenuIcon />
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
