import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import * as MUIcon from '@mui/icons-material';
import { blueGrey } from '@mui/material/colors';
import React from 'react';

interface Props {
    title: string;
    icon: keyof typeof MUIcon;
    selIcon: keyof typeof MUIcon;
    isOpen: boolean;
}

const LeftMenuItem = (props: Props) => {
    const selected_color = blueGrey[700];
    const Icon = MUIcon[props.icon];
    return (
        <ListItem
            key={props.title}
            disablePadding
            sx={{
                display: 'block',
                // background: props.selected ? selected_color : undefined,
            }}
            // onClick={props.onClick}
        >
            <ListItemButton
                sx={{
                    minHeight: 32,
                    height: 42,
                    justifyContent: props.isOpen ? 'initial' : 'center',
                    px: 2.5,
                }}
            >
                <ListItemIcon
                    sx={{
                        minWidth: 0,
                        mr: props.isOpen ? 3 : 'auto',
                        justifyContent: 'center',
                    }}
                >
                    {/* {props.selected ? props.invIcon : props.icon} */}
                    <Icon />
                </ListItemIcon>
                <ListItemText
                    primary={props.title}
                    sx={{
                        opacity: props.isOpen ? 1 : 0,
                        // color: props.selected ? 'white' : undefined,
                    }}
                />
            </ListItemButton>
        </ListItem>
    );
};

export default LeftMenuItem;
