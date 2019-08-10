import React, { useContext } from 'react';

export interface OrgItem {
    filePath: string;
    title: string;
    path: string;
    authenticate: boolean;
}
export interface OrgGroup {
    Travel: OrgItem[];
    Life: OrgItem[];
}
export interface OrgProps {
    routes: OrgGroup;
}


const OrgContext = React.createContext({} as OrgProps);

function OrgProvider (props: any) {

    const orgProps = {
        routes: { 
            Travel: [
                {
                    title: 'Raleigh',
                    filePath: '/org/public/travel/raleigh',
                    path: '/org/travel/raleigh',
                    authenticate: false 
                },
                {
                    title: 'Santa Barbara',
                    filePath: '/org/public/travel/santa-barbara',
                    path: '/org/places/santa-barbara',
                    authenticate: false 
                }
            ],
            Life: [
                {
                    title: 'Birthdays',
                    filePath: '/org/private/life/birthdays',
                    path: '/org/life/birthdays',
                    authenticate: true 
                },
                {
                    title: 'Homes',
                    filePath: '/org/private/life/homes',
                    path: '/org/places/homes',
                    authenticate: true 
                }
            ]
        }
    } as OrgProps;
    return (
      <OrgContext.Provider value={{...orgProps}}>
        {props.children}
      </OrgContext.Provider>
    )
}



export { OrgProvider, OrgContext};