
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Github' });
};

exports.file = function(req, res) {
  res.render('file', { title: 'Github' });
};