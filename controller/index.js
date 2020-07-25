exports.getIndex = (req, res, next) => {
    res.render('shop/index', { docTitle: 'eCommerce Systems' });
};
