import React from 'react';

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
    routes (authenticated:boolean): OrgGroup;
    findOrgItemByPath (path:string): OrgItem | null;
}


const OrgContext = React.createContext({} as OrgProps);

function OrgProvider (props: any) {

    const routes = {
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
        ],
        Dev: [
            {
                title: 'VS Code Tips',
                filePath: '/org/public/dev/vscode',
                path: '/org/public/vscode',
                authenticate: false 
            }
        ]
    } as OrgGroup;

    // include only groupings and routes that require no authentication
    // so that grouping isn't displayed that has all authenticated routes
    const filterAuthenticatedRoutes = () => {
        let filteredRoutes = {} as OrgGroup;
        Object.entries(routes).forEach(([key, items]) => {
            for (let item of items as OrgItem[]) 
                if (!item.authenticate && !filteredRoutes.hasOwnProperty(key)) {
                    (filteredRoutes as any)[key] = items.filter((i:OrgItem) => !i.authenticate);
                }
        });
        return filteredRoutes;
    }
    const unauthenticatedRoutes = filterAuthenticatedRoutes();

    function findRoutes (authenticated: boolean): OrgGroup {
        return authenticated ? routes : unauthenticatedRoutes;
    }

    function findOrgItemByPath (path:string): OrgItem | null {
        for (let items of Object.values(routes)) 
            for (let item of items as OrgItem[]) 
                if (path === item.path) return item;
        return null;
    }

    const orgProps = {
        findOrgItemByPath: (path) => findOrgItemByPath(path),
        routes: (authenticated) => findRoutes(authenticated)
    } as OrgProps;

    return (
      <OrgContext.Provider value={{...orgProps}}>
        {props.children}
      </OrgContext.Provider>
    )
}

export { OrgProvider, OrgContext};