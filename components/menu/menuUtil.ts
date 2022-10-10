import { menus } from '../../data/menus.en';

export const filetrPathName = (pathName: string) => {
    if (pathName) {
        if (pathName.charAt(pathName.length - 1) === ']') {
            return pathName.slice(0, pathName.lastIndexOf('/'));
        }
    }
    return pathName;
}

export const buildNavigation = (pathName: string) => {
    let top = -1;
    let left = -1;
    const route = filetrPathName(pathName);
    menus.map((topMenus, topIndex) => {
        topMenus.map((menu, leftIndex) => {
            if (menu.route === route) {
                top = topIndex;
                left = leftIndex;
            }
        })
    })
    return {
        top: top,
        left: left
    }
}