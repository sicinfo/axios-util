/**
 * @module axiosjs-util
 * @author moreira - 2022-03-24
 * @version 0.1.0
 */
'use strict'

System.register(['axios'], (_export, _context) => {

  const Authorization = 'authorization';
  const LINKS = 'links';
  const LINK = 'link';
  const REL = 'rel';
  const X_BASEURL = 'x-baseurl';
  const BASEURL = 'baseURL';
  const LINK_AUTH = `link-auth`;
  
  /** @arg {...string[]} arg */
  const _btoa = (...[a, b]) => window.btoa(`${a.toUpperCase()} ${b}`)

  /** @type {AxiosInstance} */ 
  let Axios;

  const _version = '0.1.0'

  /** @type {AxiosConfigFunction} */
  const _config = (uriPort = '/baseurl', uriConfig = 'config') => {
    return Axios.head(uriPort.split('/')[1] ? uriPort : `/${uriPort}`)
      .then(({ headers }) => {
        const baseUrl = Reflect.get(headers, X_BASEURL);
        if (!baseUrl) return null;
        
        Reflect.set(Axios.defaults, BASEURL, baseUrl);

        Axios.interceptors.request.use(req => {
          
// console.log(1, [
//   'request',
//   ['req.method', req.method],
//   ['req.url', req.url],
//   ['req.baseURL', req.baseURL],
//   ['_btoa', req.method, req.url, _btoa(req.method, req.url)],
//   Reflect.get(req.headers, Authorization),
//   localStorage.getItem(Authorization)
// ].join('\n'))

          if (!Reflect.has(req.headers, Authorization)) {
            if (localStorage.hasOwnProperty(Authorization)) {
              Reflect.set(req.headers, Authorization, localStorage.getItem(Authorization))
            }
          }

          (key => sessionStorage.hasOwnProperty(key)
            && Reflect.set(req.headers, LINK_AUTH, sessionStorage.getItem(key))
            && sessionStorage.removeItem(key)
          )(_btoa(req.method, req.url))


// console.log(2, [
//   'request',
//   [ 'Object.keys(req)', Object.keys(req) ],
//   [ 'req.headers', JSON.stringify(req.headers) ],
//   [ 'req.url', req.url ],
//   req.method,
//   Reflect.get(req.headers, Authorization),
//   localStorage.getItem(Authorization),
//   sessionStorage.valueOf()
// ].join('\n'))
          
          return req;
        })

        Axios.interceptors.response.use(
          
          res => {
            // console.log(0, 'response', 'status', res['status'])


            // console.log(1, [
            //   'response',
            //   ['status', res['status']],
            //   Object.keys(res),
            //   Object.keys(res.request),
            //   ['res.data', Object.keys(res.data)],
            //   Reflect.get(res.headers, Authorization),
            //   localStorage.getItem(Authorization)
            // ].join('\n'))

            if (Reflect.has(res.headers, Authorization)) {
              localStorage.setItem(Authorization, Reflect.get(res.headers, Authorization))
            }
            else if (localStorage.hasOwnProperty(Authorization)) {
              localStorage.removeItem(Authorization);
            }

            'data' in res && (data => data && (vals => vals && (Array.isArray(vals) ? vals : [vals]).forEach(
              ({ token, method, rel }) => sessionStorage.setItem(_btoa(method, rel), token)
            ))((key => key && data[key])([LINKS, LINK].find(key => key in data))))(res['data'] || null)


            //   sessionStorage.setItem()

            //   const arg = (arg => {
            //     if (key === LINK) arg = [arg];
            //     Reflect.deleteProperty(res.data, key);
            //     return arg;
            //   })(Reflect.get(res.data, key));



            //   Reflect.set(res.data, LINK, arg.reduce((redu, arg) => {
            //     const { rel } = arg;
            //     if (rel) Reflect.set(redu, rel, arg);
            //     return redu;
            //   }, {}));



            // }

            // console.log(2, [
            //   'response',
            //   ['res', Object.keys(res)],
            //   ['res.data', Object.keys(res.data)],
            //   ['res.data.link', Object.keys(res.data.link || {})],
            //   ['res.data.links', Object.keys(res.data.links || {})],
            //   ['res.request', Object.keys(res.request)],
            //   ['headers', Object.keys(res.headers)],
            //   ['authorization', Reflect.get(res.headers, Authorization)],
            //   ['localStorage', localStorage.getItem(Authorization)],
            //   ['sessionStorage', JSON.stringify(sessionStorage.valueOf())]
            // ].join('\n'))

            return res
          },

          ({ response: res }) => {
            return Promise.reject(res);
          }

        )

        return uriConfig ?
          Axios.get(uriConfig).then(res => {
            return { axios: Axios, data: res?.data || null }
          }) : null;
      })
  }

  return {
    
    setters: [
      a => { Axios = a.default }
    ],

    execute: () => {
      _export('config', _config)
      _export('version', _version)
      _export('default', Axios)
    }

  }
})