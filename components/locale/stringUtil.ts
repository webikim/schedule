interface LocateSetInterface {
    [key: string]: string
}

export const getString = (locale: string, localeSet: LocateSetInterface) => {
    return localeSet[locale];
}