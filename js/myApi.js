export default class MyApi{
    constructor (appId, apiKey, showLoading, hideLoading, defaultStorage) {
        this.appId = appId;
        this.apiKey = apiKey;
        this.defaultStorage = defaultStorage;
        this.endpoints = {
            REGISTER: "users/register",
            LOGIN: "users/login",
            LOGOUT: "users/logout"
        };

        this.showLoading = () => {
            if (showLoading) {
                showLoading();
            }
        };

        this.hideLoading = () => {
            if (hideLoading) {
                hideLoading();
            }
        };
    };

    host(endpoint) {
        return `https://api.backendless.com/${this.appId}/${this.apiKey}/${endpoint}`
    };

    getOptions(headers) {
        const userToken = this.defaultStorage.getItem("userToken");

        const options = { headers: headers || {} };
        if (userToken) {
            Object.assign(options.headers, { "user-token": userToken });
        }

        return options;
    }

    async get(endpoint) {
        const options = this.getOptions();

        this.showLoading();
        const result = await fetch(this.host(endpoint), options);
        this.hideLoading();
        
        try {
            return await result.json();
        } catch (error) {
            return result;
        } 
    }

    async post(endpoint, body) {
        const options = this.getOptions({ "Content-Type": "application/json" });
        options.method = "POST";
        options.body = JSON.stringify(body);

        this.showLoading();
        const result = (await fetch(this.host(endpoint), options)).json();
        this.hideLoading();

        return result;

    }

    async put(endpoint, body) {
        const options = this.getOptions({ "Content-Type": "application/json" });
        options.method = "PUT";
        options.body = JSON.stringify(body);

        this.showLoading();
        const result = (await fetch(this.host(endpoint), options)).json();
        this.hideLoading();

        return result;
    }

    async delete(endpoint) {
        const options = this.getOptions();
        options.method = "DELETE";

        this.showLoading();
        const result = (await fetch(this.host(endpoint), options)).json();
        this.hideLoading();

        return result;
    }

    async setCategoryRelation(id, categoryName) {
        const options = this.getOptions();
        
        this.showLoading();
        const categoryObjectId = (await this.get('data/categories')).find(c => c.name == categoryName).objectId;
        const result = await this.post(`data/recipe/${id}/category`, [categoryObjectId]);
        this.hideLoading();

        return result;
    }

    async register(firstName, lastName, username, password) {
        this.showLoading();
        const result = (await this.post(this.endpoints.REGISTER, { firstName, lastName, username, password }));
        this.hideLoading();
        
        return result;
    }

    async login(username, password) {
        this.showLoading();
        const result = (await this.post(this.endpoints.LOGIN, { login: username, password }));
        this.hideLoading();

        this.defaultStorage.setItem('username', result.username);
        this.defaultStorage.setItem('userId', result.objectId);
        this.defaultStorage.setItem('userToken', result['user-token']);
        this.defaultStorage.setItem('names', `${result.firstName} ${result.lastName}`);
        return result;
    }

    async logout() {
        this.showLoading();
        const result = await this.get(this.endpoints.LOGOUT);
        this.hideLoading();

        this.defaultStorage.removeItem('username');
        this.defaultStorage.removeItem('userId');
        this.defaultStorage.removeItem('userToken');
        this.defaultStorage.removeItem('names');

        return result;
    }

}