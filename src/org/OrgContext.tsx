import React, { useContext } from 'react';
import { AuthContext } from '../core/Auth';

export interface OrgItem {
    filePath: string;
    title: string;
    path: string;
    authenticate: boolean;
    type: 'item';
}
export interface OrgGroup {
    title: string;
    description: string,
    path: string;
    items: OrgItem[];
    type: 'group';
}
export interface OrgProps {
    routes (): OrgGroup[];
    findOrgItemByPath (path:string): OrgItem | null;
    findOrgGroupItemByPath (path:string): OrgGroup | null;
}


const OrgContext = React.createContext({} as OrgProps);

function OrgProvider (props: any) {

    const authContext = useContext(AuthContext);

    const routes = [
        {
            type: 'group',
            title: 'Travel',
            description: 'Places visited or planning to visit',
            path: '/org/travel',
            items: [
                {
                    type: 'item',
                    title: 'Raleigh',
                    filePath: '/org/public/travel/raleigh',
                    path: '/org/travel/raleigh',
                    authenticate: false,
                },
                {
                    type: 'item',
                    title: 'Santa Barbara',
                    filePath: '/org/public/travel/santa-barbara',
                    path: '/org/places/santa-barbara',
                    authenticate: false 
                }
            ],
        } as OrgGroup,
        {
            type: 'group',
            title: 'Life',
            description: 'Information for me',
            path: '/org/life',
            items: [
                {
                    type: 'item',
                    title: 'Birthdays',
                    filePath: '/org/private/life/birthdays',
                    path: '/org/life/birthdays',
                    authenticate: true 
                },
                {
                    type: 'item',
                    title: 'Homes',
                    filePath: '/org/private/life/homes',
                    path: '/org/places/homes',
                    authenticate: true 
                }
            ],
        } as OrgGroup,
        {
            type: 'group',
            title: 'Dev',
            description: 'Development resources',
            path: '/org/dev',
            items: [
            {
                type: 'item',
                title: 'VS Code Tips',
                filePath: '/org/public/dev/vscode',
                path: '/org/public/vscode',
                authenticate: false 
            }
        ]
        } as OrgGroup
    ];

    // include only groupings and routes that require no authentication
    // so that grouping isn't displayed that has all authenticated routes
    const filterAuthenticatedRoutes = (): OrgGroup[] => {
        let filteredRoutes: OrgGroup[] = [];
        routes.forEach(groupItem => {
            for (let item of groupItem.items) 
                if (!item.authenticate && !filteredRoutes.find(route => route.title === groupItem.title)) {
                    const filteredItems = groupItem.items.filter((i:OrgItem) => !i.authenticate);
                    filteredRoutes.push({
                        ...groupItem,
                        items:filteredItems
                    });
                }
        });
        return filteredRoutes;
    }

    const unauthenticatedRoutes = filterAuthenticatedRoutes();

    function findRoutes (): OrgGroup[] {
        return authContext.authenticated ? routes : unauthenticatedRoutes;
    }

    /**
     * Find an item given the path. Used for routing.
     * @param path 
     */
    function findOrgItemByPath (path:string): OrgItem | null {
        for (let groupItem of routes) 
            for (let item of groupItem.items) 
                if (path === item.path) return item;
        return null;
    }
    /**
     * Build a tree given an item path, very rudimentary. returns only the specified item  
     * @param path 
     */
    function findOrgGroupItemByPath (path:string): OrgGroup | null {
        for (let groupItem of routes) 
            for (let item of groupItem.items) 
                if (path === item.path) return {...groupItem, items:[item]};
        return null;
    }


    const orgProps = {
        findOrgItemByPath: (path) => findOrgItemByPath(path),
        findOrgGroupItemByPath: (path) => findOrgGroupItemByPath(path),
        routes: () => findRoutes()
    } as OrgProps;

    return (
      <OrgContext.Provider value={{...orgProps}}>
        {props.children}
      </OrgContext.Provider>
    )
}

export { OrgProvider, OrgContext};