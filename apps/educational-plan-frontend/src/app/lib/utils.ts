import React from "react";
import { environment } from "../../environments/environment";

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const BACKEND_URL = environment.backendUrl;

export async function apiCall<R, D = any>(url: string, method: string, data?: D, fetchOptions?: RequestInit) {

  const resultUrl = BACKEND_URL + (url.startsWith("/") ? url : "/" + url);
  let headers = new Headers();
  headers.append("Accept", "application/json");
  if(!(data instanceof FormData)) {
    headers.append("Content-Type", "application/json");
  }
  const token = window.localStorage.getItem("token");
  if(token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  return new Promise<R>((resolve, reject) => {
    fetch(resultUrl, {
      method,
      headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
      ...fetchOptions,
    })
      .then(async (result) => {
        if(!result.ok) {
          reject(await result.json());
        }
        try {
          resolve(await result.json());
        } catch(e) {
          resolve(undefined as any);
        }
      })
      .catch((e) => {
        if(e.name === "AbortError") {
          reject(e);
        }
        reject(getApiError(e));
      });
  });
}

export function useApiResult<R>(...params: Parameters<typeof apiCall>) {
  const [result, setResult] = React.useState<R | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const requestRefresh = () => setRefresh((refresh) => refresh + 1);

  function refreshData() {
    const controller = new AbortController();
    params[3] = { ...params[3], signal: controller.signal };
    setLoading(true);
    apiCall<R>(...params)
      .then((result) => {
        setResult(result);
        setError(null);
      })
      .catch((error) => {
        if(error.name === "AbortError") return;
        setError(error);
        setResult(null);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }

  React.useEffect(refreshData, params.concat([refresh]));
  return [result, error, loading, requestRefresh] as const;
}

export function getMediaUrl(url: string) {
  return BACKEND_URL + url;
}

export function romanize(num: number) {
  let lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}, roman = '',i;
  for (i in lookup) {
    // @ts-ignore
    while (num >= lookup[i]) {
      roman += i;
      // @ts-ignore
      num -= lookup[i];
    }
  }
  return roman;
}

export function filterObject<T extends object>(obj: T, predicate: (value: any, key: string) => boolean) {
  const result = {} as T;
  for(const key in obj) {
    if(predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function groupBy<T>(collection: T[], getKey: ((item: T) => string | number)) {
  return collection.reduce((storage, item) => {
    const group = getKey(item);
    storage[group] = storage[group] || [];
    storage[group].push(item);
    return storage;
  }, {} as Record<string, T[]>);
}

export function getApiError(error: unknown): string {
  if(!error) {
    return "A apărut o eroare.";
  }
  if(typeof error == "string") {
    return error;
  }
  if(typeof error == 'object') {
    if('message' in error) {
      if(Array.isArray(error.message)) {
        return error.message.join("\n");
      }
      return error.message as string;
    }
    if('error' in error) {
      return getApiError(error.error);
    }
  }
  return "A apărut o eroare.";
}
