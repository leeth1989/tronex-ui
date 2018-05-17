import queryString from 'query-string';

const parsed = queryString.parse('?' + window.location.hash.split('?')[1]);
console.log(parsed)
let config = {
  host: parsed.dev ? (parsed.host || 'http://127.0.0.1:8080') : ''
}

export default config;