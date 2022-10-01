import React, { createContext, ReactNode, useState } from 'react';

interface Navigation {
    position: {
        top?: number;
        left?: number;
    };
}

interface MenuContextInterface {
    navigation: Navigation | null;
    setNavigation: (navigation: Navigation) => void;
    clearNavigation: () => void;
}

const MenuContext = createContext<MenuContextInterface>({
    navigation: null,
    setNavigation: (navigation: Navigation) => {},
    clearNavigation: () => {},
});

interface Props {
    children?: ReactNode;
}

export const MenuContextProvider = (props: Props) => {
    const [navigation, setNavigation] = useState<Navigation | null>(null);

    const setNavigationHandler = (navigation: Navigation) => {
        setNavigation(navigation);
    };

    const clearNavigationHandler = () => {
        setNavigation(null);
    };

    const context = {
        navigation: navigation,
        setNavigation: setNavigationHandler,
        clearNavigation: clearNavigationHandler,
    };

    return (
        <MenuContext.Provider value={context}>
            {props.children}
        </MenuContext.Provider>
    );
};

export default MenuContext;
