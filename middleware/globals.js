module.exports = (vars) => {
    return  (req, res, next) => {
        req.modules = vars.modules; // Define tu valor adicional aquí
        next();
    }
};