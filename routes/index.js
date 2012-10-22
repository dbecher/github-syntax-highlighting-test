var _ = require('underscore'),
    pygments = require('pygments'),
    GitHubApi = require("github"),
    github = new GitHubApi({
      version: "3.0.0"
    });

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Github' });
};


/*
 * GET File info page
 */

exports.file = function(req, res) {
  var path = req.params[0],
      parts = path.split('/'),
      user = parts[0],
      repoName = parts[1],
      ref = parts[3],
      filePath = _.rest(parts, 4).join('/'),
      fileName = _.last(parts);
  
  github.repos.get({ user: user, repo: repoName }, function(err, repo) {
    github.repos.getContent({ user: user, repo: repoName, path: filePath, ref: ref },
    function(err, file) {
      var fileContent = new Buffer(file.content, file.encoding).toString("utf8");
      // guess lexer name from filename
      pygments.colorize('', undefined, undefined, function(lexer) {
        pygments.colorize(fileContent, undefined, 'html', function(highlighted) {
          highlighted = _.map(highlighted.split("\n"), function(line, i) {
            return '<div class="line" id="LC' + (i+1) + '">' + line + '</div>';
          }).join("\n");
          res.render('file', {
            lexer: lexer,
            title: filePath + ' at ' + ref,
            filePath: filePath,
            repo: repo,
            html: highlighted
          });
        }, { "O": "encoding=utf-8,nowrap=True" });
      }, { N: fileName });
    });
  });
};