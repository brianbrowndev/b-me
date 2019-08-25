import React, { useContext } from 'react';
import { AuthContext } from '../core/Auth';

export interface OrgItem {
    filePath: string;
    title: string;
    description: string;
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
    findOrgItemParentByPath (path:string): OrgGroup | null;
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
                    title: 'Packing Checklist',
                    description: 'Is a trip not a trip with the absence of something?',
                    filePath: '/org/public/travel/packing-list',
                    path: '/org/travel/packing-list',
                    authenticate: false,
                },
                {
                    type: 'item',
                    title: 'Raleigh',
                    description: 'Visit to Raleigh, North Carolina in Summer 2019',
                    filePath: '/org/public/travel/raleigh',
                    path: '/org/travel/raleigh',
                    authenticate: false,
                },
                {
                    type: 'item',
                    title: 'Santa Barbara',
                    description: 'Wedding trip in Fall 2019',
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
                    title: 'Schedule',
                    description: 'What needs to get done, now',
                    filePath: '/org/private/life/schedule',
                    path: '/org/life/schedule',
                    authenticate: true 
                },                {
                    type: 'item',
                    title: 'Birthdays',
                    description: 'Dates I must not forget',
                    filePath: '/org/private/life/birthdays',
                    path: '/org/life/birthdays',
                    authenticate: true 
                },
                {
                    type: 'item',
                    title: 'Homes',
                    description: 'List of homes toured around Richmond, Virginia',
                    filePath: '/org/private/life/homes',
                    path: '/org/places/homes',
                    authenticate: true 
                }
            ],
        } as OrgGroup,
        {
            type: 'group',
            title: 'Development',
            description: 'Development resources',
            path: '/org/dev',
            items: [
                {
                    type: 'item',
                    title: 'VS Code Tips',
                    description: 'Shortcuts and tips to move faster in Visual Studio Code',
                    filePath: '/org/public/dev/vscode',
                    path: '/org/public/vscode',
                    authenticate: false 
                },
                {
                    type: 'item',
                    title: 'Favicons',
                    description: 'References for adding a favicon',
                    filePath: '/org/public/dev/favicon',
                    path: '/org/public/favicon',
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
     * Find the parent of an item given the path. Used for cards.
     * @param path 
     */
    function findOrgItemParentByPath (path:string): OrgGroup | null {
        for (let groupItem of routes) 
            for (let item of groupItem.items) 
                if (path === item.path) return groupItem;
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
        findOrgItemParentByPath: (path) => findOrgItemParentByPath(path),
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