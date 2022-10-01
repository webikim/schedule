import { TypeScriptConfig } from 'next/dist/server/config-shared';
import React, { useContext } from 'react';
import LeftMenuItem from './LeftMenuItem';
import { menus } from './menus';
import * as MUIcon from '@mui/icons-material';
import MenuContext from '../../store/menuContext';

const toIconType = (name: string) => {
    return name as keyof typeof MUIcon;
};

interface Props {
    isOpen: string;
}

const LeftMenu = (props: Props) => {
    const menuCtx = useContext(MenuContext);
    const position = menuCtx.navigation?.position;
    if (position && position.top !== undefined) {
        return (
            <>
                {menus[position.top].map((menu) => (
                    <LeftMenuItem
                        key={menu.title}
                        title={menu.title}
                        icon={toIconType(menu.picon)}
                        selIcon={toIconType(menu.sicon)}
                        isOpen={props.isOpen === 'true' ? true : false}
                    />
                ))}
            </>
        );
    } else return <></>;
};

export default LeftMenu;
