import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../core/Auth';
import { Post, PostGroup } from '../common/client';
import { BlogPostApi } from '../common/client/BlogPostApi';

export interface OrgProps {
    groups(): PostGroup[];
    routes(): Post[];
    findPostByPath(path: string): Post | undefined;
    findRoutesByGroup(group: PostGroup): Post[];
    formatPostUrl(path: string): string;
    formatPostFilePath(path: string): string;
}


const BlogContext = React.createContext({} as OrgProps);

function BlogProvider(props: any) {

    const authContext = useContext(AuthContext);

    const [routes, setRoutes] = useState<Post[]>([]);

    useEffect(
        (() => {
            Promise.all([BlogPostApi.getBlogPosts(100)]).then(
                ([posts]) => {
                    setRoutes(posts);
                }
            ).catch(err => {
                // TODO - error handling for user
                console.log(err);
            })
        }), []
    );

    function findRoutes(): Post[] {
        return authContext.authenticated ? routes : routes.filter(t => !t.authenticate);
    }

    function findGroups(): PostGroup[] {
        var items = authContext.authenticated ? routes : routes.filter(t => !t.authenticate);
        var groups: { [key: number]: PostGroup } = {};
        items.forEach(i => i.postGroup?.id && groups[i.postGroup?.id] !== undefined ? groups[i.postGroup?.id] = i.postGroup : null);
        return Object.values(groups);

    }

    function findRoutesByGroup(group: PostGroup) {
        return findRoutes().filter(r => r?.postGroup?.id === group.id);
    }

    /**
     * Find an item given the path. Used for routing.
     * @param path 
     */
    function findOrgItemByPath(path: string): Post | undefined {
        return routes.find(r => r.path === path);
    }
    function formatPostUrl(path: string): string {
        return `content${path}`;

    }
    function formatPostFilePath(path: string): string {
        return path.replace('/content', '');
    }



    const orgProps = {
        findPostByPath: findOrgItemByPath,
        routes: findRoutes,
        groups: findGroups,
        findRoutesByGroup: findRoutesByGroup,
        formatPostUrl: formatPostUrl,
        formatPostFilePath: formatPostFilePath
    } as OrgProps;

    return (
        <BlogContext.Provider value={{ ...orgProps }}>
            {props.children}
        </BlogContext.Provider>
    )
}

export { BlogProvider, BlogContext };