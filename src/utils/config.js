import queryString from 'query-string';

const parsed = window.location.hash.split('?')[1] ? queryString.parse('?' + window.location.hash.split('?')[1]) : null;
let config = {
  host:  parsed && parsed.dev ? (parsed.host || 'http://127.0.0.1:8080') : '',
  search: parsed ? '?' + queryString.stringify(parsed) : '?'
}

export default config;