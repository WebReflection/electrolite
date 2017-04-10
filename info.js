var url = process.argv[2];
if (url && !/^https?:\/\//.test(url)) url = 'https://' + url;

try {
  module.exports = {
    url: url,
    hostname: require('url').parse(url).hostname
  };
} catch(o_O) {
  console.error(
    '\nusage: electrolite ${url}',
    '\nerror: invalid url ' + o_O.message + '\n'
  );
  process.exit(1);
}
