import React, { createContext, useState } from 'react';

interface Locale {
    lang: string;
}

interface LocaleContextInterface {
    locale: Locale | null;
    setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextInterface>({
    locale: null,
    setLocale: (locale: Locale) => {},
});

interface Props {
    children: React.ReactNode;
}

export const LocaleContextProvider = (props: Props) => {
    const [locale, setLocale] = useState<Locale | null>(null);

    const setLocaleHandler = (locale: Locale) => {
        setLocale(locale);
    };

    const context = {
        locale: locale,
        setLocale: setLocaleHandler,
    };

    return (
        <LocaleContext.Provider value={context}>
            {props.children}
        </LocaleContext.Provider>
    );
};

export default LocaleContext;
