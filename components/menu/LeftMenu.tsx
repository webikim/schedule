import { TypeScriptConfig } from 'next/dist/server/config-shared';
import React, { useContext, useEffect, useState } from 'react';
import LeftMenuItem from './LeftMenuItem';
import { menus } from '../../data/menus';
import * as MUIcon from '@mui/icons-material';
import MenuContext from '../../store/menuContext';
import { useRouter } from 'next/router';
import { APPBAR_OPEN } from '../layout/TopBar';

const toIconType = (name: string) => {
    return name as keyof typeof MUIcon;
};

interface Props {
    isOpen: string;
}

const LeftMenu = (props: Props) => {
    const menuCtx = useContext(MenuContext);
    const position = menuCtx.navigation?.position;
    const [left, setLeft] = useState(position?.left);
    const router = useRouter();

    useEffect(() => {
        if (position && position.left !== left) {
            setLeft(position.left);
        }
    }, [position, left]);

    const handleMenuClick = (index: number, route: string) => () => {
        setLeft(index);
        menuCtx.setNavigation({
            position: {
                top: position?.top,
                left: index,
            },
        });
        router.replace(route);
    };

    if (position && position.top !== undefined && position.top >= 0) {
        return (
            <>
                {menus[position.top].map((menu, index) => (
                    <LeftMenuItem
                        key={menu.title}
                        title={menu.title}
                        icon={toIconType(menu.picon)}
                        selIcon={toIconType(menu.sicon)}
                        route={menu.route}
                        selected={left == index}
                        isOpen={props.isOpen === APPBAR_OPEN ? true : false}
                        onClick={handleMenuClick(index, menu.route)}
                    />
                ))}
            </>
        );
    } else return <></>;
};

export default LeftMenu;
