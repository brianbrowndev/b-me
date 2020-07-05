import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../core/Auth';
import { Post, PostGroup } from '../common/client';
import { BlogPostApi } from '../common/client/BlogPostApi';

export interface OrgProps {
    groups: PostGroup[];
    routes: Post[];
    findPostByPath(path: string): Post | undefined;
    findRoutesByGroup(group: PostGroup): Post[];
    formatPostUrl(path: string): string;
    formatPostFilePath(path: string): string;
}


const BlogContext = React.createContext({} as OrgProps);

function BlogProvider(props: any) {

    const authContext = useContext(AuthContext);

    const [routes, setRoutes] = useState<Post[]>([]);
    const [groups, setGroups] = useState<PostGroup[]>([]);

    useEffect(
        (() => {
            Promise.all([BlogPostApi.getBlogPosts(100), BlogPostApi.getBlogPostGroups()]).then(
                ([posts, groups]) => {
                    setRoutes(posts.map(p => ({ ...p, path: formatPostUrl(p.path!) })));
                    setGroups(groups);
                }
            ).catch(err => {
                // TODO - error handling for user
                console.log(err);
            })
        }), [authContext.authenticated]
    );

    function findRoutesByGroup(group: PostGroup) {
        return routes.filter(r => r?.postGroup?.id === group.id);
    }

    /**
     * Find an item given the path. Used for routing.
     * @param path 
     */
    function findPostItemByPath(path: string): Post | undefined {
        return routes.find(r => r.path === path);
    }
    function formatPostUrl(path: string): string {
        return `/content/${path}`;
    }

    function formatPostFilePath(path: string): string {
        return path.replace('/content/', '');
    }


    const orgProps = {
        findPostByPath: findPostItemByPath,
        routes: routes,
        groups: groups,
        findRoutesByGroup: findRoutesByGroup,
        formatPostFilePath: formatPostFilePath
    } as OrgProps;

    return (
        <BlogContext.Provider value={{ ...orgProps }}>
            {props.children}
        </BlogContext.Provider>
    )
}

export { BlogProvider, BlogContext };