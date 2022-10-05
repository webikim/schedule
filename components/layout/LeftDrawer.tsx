import React, { ReactNode } from 'react';
import { CSSObject, Divider, styled, Theme, useTheme } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import { blueGrey } from '@mui/material/colors';
import { APPBAR_OPEN } from './TopBar';

const openedMixin = (theme: Theme, drawerwidth: number): CSSObject => ({
    width: drawerwidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

interface DrawerHeaderProps {
    drawerheight: string;
}

const DrawerHeader = styled('div')<DrawerHeaderProps>(
    ({ theme, drawerheight }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: theme.palette.primary.dark,
        height: drawerheight,
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    })
);

interface DrawerProps {
    isopen: string;
    drawerwidth: number;
}

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})<DrawerProps>(({ theme, isopen, drawerwidth }) => ({
    width: drawerwidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(isopen === APPBAR_OPEN
        ? {
              ...openedMixin(theme, drawerwidth),
              '& .MuiDrawer-paper': openedMixin(theme, drawerwidth),
          }
        : {
              ...closedMixin(theme),
              '& .MuiDrawer-paper': closedMixin(theme),
          }),
}));

interface Props {
    isopen: string;
    drawerwidth: number;
    drawerheader: string;
    children?: ReactNode;
}

const LeftDrawer = (props: Props) => {
    const theme = useTheme();
    return (
        <>
            <Drawer
                variant="permanent"
                isopen={props.isopen}
                drawerwidth={props.drawerwidth}
                PaperProps={{
                    sx: {
                        backgroundColor: blueGrey[50],
                    },
                }}
            >
                <DrawerHeader drawerheight={props.drawerheader} />
                <Divider />
                {props.children}
            </Drawer>
        </>
    );
};

export default LeftDrawer;
