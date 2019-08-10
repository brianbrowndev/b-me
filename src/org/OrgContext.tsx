import React, { useContext } from 'react';

export interface OrgItem {
    filePath: string;
    title: string;
    path: string;
    authenticate: boolean;
}
export interface OrgGroup {
    Places: OrgItem[];
}
export interface OrgProps {
    routes: OrgGroup;
}


const OrgContext = React.createContext({} as OrgProps);

function OrgProvider (props: any) {

    const orgProps = {
        routes: { 
            Places: [
                {
                    title: 'Raleigh',
                    filePath: '/org/life/places/raleigh',
                    path: '/org/places/raleigh',
                    authenticate: false 
                },
                {
                    title: 'Santa Barbara',
                    filePath: '/org/life/places/santa-barbara',
                    path: '/org/places/santa-barbara',
                    authenticate: false 
                }
            ],
            Life: [
                {
                    title: 'Birthdays',
                    filePath: '/org/life/birthdays',
                    path: '/org/life/birthdays',
                    authenticate: true 
                },
                {
                    title: 'Homes',
                    filePath: '/org/life/homes',
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