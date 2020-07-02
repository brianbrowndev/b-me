import Api from './Api';

export const BlogApi = {
    get(url: string): Promise<string> {
        return Api.getText(`v1/blog/content/${url}`);
    }
}

export default BlogApi;
