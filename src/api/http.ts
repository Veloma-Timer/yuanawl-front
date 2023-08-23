import { AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { HttpVerb, HttpOptions, ResponseType } from "@tauri-apps/api/http";
import { http } from "@tauri-apps/api";
import deepcopy from "deepcopy";
import { isObj } from "@/utils";
import { message } from "@tauri-apps/api/dialog";

export interface CustomAxiosRequestConfig extends Partial<InternalAxiosRequestConfig> {
  noLoading?: boolean;
  query?: any;
}

type Fulfilled = (config: CustomAxiosRequestConfig) => CustomAxiosRequestConfig;

type FulfilledResponse = (config: AxiosResponse) => Promise<CustomAxiosRequestConfig>;

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

    const _url = this.config.baseURL + url;

    // 如果是FormData数据则使用浏览器的fetch方法
    if (data instanceof FormData) {
      let response = await fetch(_url, {
        method: "POST",
        body: data,
        ...((config || {}) as any)
      });
      const result = { data: await response.json() };

      for (let { fulfilled, rejected } of _interceptors.response) {
        try {
          // @ts-ignore
          response = fulfilled ? await fulfilled(result) : result;
        } catch (err) {
          if (rejected) await rejected(err as AxiosError);
        }
      }

      // @ts-ignore
      if (response.success) {
        await message("操作成功！", "成功");
      }

      return response;
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

      if (config?.params === null) {
        delete config.params;
      }

      if (config?.responseType === "blob") {
        delete config.responseType;
        // @ts-ignore
        config.responseType = ResponseType.Binary;
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
          if (value.length > 0) {
            // @ts-ignore
            params.query[key] = value.join(",");
          } else {
            // @ts-ignore
            delete params.query[key];
          }
        }
        if (isObj(value) && !Array.isArray(value)) {
          // @ts-ignore
          params.query[key] = JSON.stringify(value);
        }
        if (value === "") {
          // @ts-ignore
          delete params.query[key];
        }
      }

      console.log(_url, params, "---- before request ------");

      let response = await http.fetch(_url, params);

      console.log(
        {
          response: response.data,
          params: {
            url: this.config.baseURL + url,
            data: params
          }
        },
        "---- request ------"
      );

      for (let { fulfilled, rejected } of _interceptors.response) {
        try {
          // @ts-ignore
          response = fulfilled ? await fulfilled(response) : response;
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
