exports.get404 = (req, res, next) => {
    console.log('Page not Found');
    res.status(404).render('404', { 'docTitle': '404 Not Found' });
}
