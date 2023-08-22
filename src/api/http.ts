import { http } from "@tauri-apps/api";
import { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { HttpVerb, HttpOptions } from "@tauri-apps/api/http";
import deepcopy from "deepcopy";
import { isObj } from "@/utils";

export interface CustomAxiosRequestConfig extends Partial<InternalAxiosRequestConfig> {
  noLoading?: boolean;
  query?: any;
}

type Fulfilled = (config: CustomAxiosRequestConfig) => CustomAxiosRequestConfig;

type FulfilledResponse = (config: AxiosResponse) => CustomAxiosRequestConfig;

type Rejected = (error: AxiosError) => Promise<AxiosError>;

// 定义拦截器
const _interceptors: {
  request: Array<{ fulfilled: Fulfilled; rejected: Rejected }>;
  response: Array<{ fulfilled: FulfilledResponse; rejected: Rejected }>;
} = {
  request: [],
  response: []
};

export default class Axios {
  private config: AxiosRequestConfig;
  public interceptors = {
    request: {
      use(fulfilled: Fulfilled, rejected: Rejected) {
        _interceptors.request.push({ fulfilled, rejected });
      }
    },
    response: {
      use(fulfilled: FulfilledResponse, rejected: Rejected) {
        _interceptors.response.push({ fulfilled, rejected });
      }
    }
  };

  constructor(config: AxiosRequestConfig) {
    this.config = config;
  }

  get(url: string, config: CustomAxiosRequestConfig) {
    return this._request("GET", url, null, config);
  }

  post(url: string, data: object, config: CustomAxiosRequestConfig) {
    return this._request("POST", url, data, config);
  }

  put(url: string, data: object, config: CustomAxiosRequestConfig) {
    return this._request("PUT", url, data, config);
  }

  delete(url: string, config: CustomAxiosRequestConfig) {
    return this._request("DELETE", url, null, config);
  }

  async _request(method: HttpVerb, url: string, data: object | null, config: CustomAxiosRequestConfig) {
    for (let { fulfilled, rejected } of _interceptors.request) {
      try {
        config = (fulfilled ? fulfilled(config) : config) as CustomAxiosRequestConfig;
      } catch (err) {
        if (rejected) await rejected(err as AxiosError);
      }
    }

    try {
      if (config?.params?.noLoading) {
        delete config.params.noLoading;
      }

      if (config?.params) {
        config.query = deepcopy(config.params);
        delete config.params;
      }

      if (config?.noLoading) {
        delete config.noLoading;
      }

      const params = {
        method: method,
        ...config
      } as unknown as HttpOptions;

      if (data) {
        params.body = http.Body.json(data || {});
      }

      for (const [key, value] of Object.entries(params?.query || {})) {
        if (typeof value === "number") {
          // @ts-ignore
          params.query[key] = String(value);
        }
        if (Array.isArray(value)) {
          // @ts-ignore
          params.query[key] = value.join(",");
        }
        if (isObj(value) && !Array.isArray(value)) {
          // @ts-ignore
          params.query[key] = JSON.stringify(value);
        }
      }

      let response = await http.fetch(this.config.baseURL + url, params);

      for (let { fulfilled, rejected } of _interceptors.response) {
        try {
          // @ts-ignore
          response = fulfilled ? fulfilled(response) : response;
        } catch (err) {
          if (rejected) await rejected(err as AxiosError);
        }
      }

      return response;
    } catch (err) {
      for (let { rejected } of _interceptors.request) {
        if (rejected) await rejected(err as AxiosError);
      }
      throw err;
    }
  }
}
