
/** 
 * @typedef {import('axios').AxiosInstance} AxiosInstance
 */

/** 
 * @typedef AxiosConfigResponse
 * @property {AxiosInstance} axios
 * @property {any} data
 */

/** 
 * @typedef {(a?:string, b?:string) => Promise<AxiosConfigResponse> } AxiosConfigFunction
 */

/**
 * @typedef AxiosjsUtil
 * @property {AxiosInstance} default
 * @property {string} version
 * @property {AxiosConfigFunction} config
 */
