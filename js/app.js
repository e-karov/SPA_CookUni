import home, {createPage, createPost, detailsPage, editPage, editPost, archiveRecipe } from '../controllers/catalog.js';
import { registerPage, registerPost, loginPage, loginPost, logout } from '../controllers/user.js';

window.addEventListener('load', () => {

    const app = Sammy('#rooter', function () {
        this.use('Handlebars', 'hbs');

        this.userData = {
            username: sessionStorage.getItem('username') || "",
            userId: sessionStorage.getItem('userId') || "",
            names: sessionStorage.getItem('names') || ""
        };



        this.get('/', home);
        this.get('#/home', home);
        this.get('index.html', home);

        this.get('#/register', registerPage);
        this.post('#/register', (ctx) => { registerPost.call(ctx); });
        
        this.get('#/login', loginPage);
        this.post('#/login', (ctx) => { loginPost.call(ctx); });
        
        this.get('#/logout', logout);
        
        this.get('#/create', createPage);
        this.post('#/create', (ctx) => { createPost.call(ctx); });

        this.get('#/details/:id', detailsPage);

        this.get('#/edit/:id', editPage);
        this.post('#/edit/:id', (ctx) => { editPost.call(ctx); });

        this.get('#/archive/:id', archiveRecipe);
        

        this.get('', function () {
            this.swap('<h1>404 Page not found</h1>');
        })
    });

    app.run('/');
});