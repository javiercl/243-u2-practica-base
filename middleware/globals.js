module.exports = (vars) => {
    return  (req, res, next) => {
        req.modules = vars.modules; 
        req.loadingPath = './partials/loading.ejs';
        req.navbarPath = './partials/navbar.ejs';
        req.layout_view = 'layout';
        next();
    }
};