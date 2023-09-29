import React from "react";

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const BACKEND_URL = "http://localhost:3000";

export async function apiCall<R, D = any>(url: string, method: string, data?: D) {

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
    fetch(resultUrl, { method, headers, body: data instanceof FormData ? data : JSON.stringify(data) })
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
        console.log(e);
        reject({ message: "Something went wrong", code: "Unknown" })
      });
  });
}

export function useApiResult<R>(callFactory: () => Promise<R>, deps: any[] = []) {
  const [result, setResult] = React.useState<R | null>(null);
  const [error, setError] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);
  const requestRefresh = () => setRefresh((refresh) => refresh + 1);

  function refreshData() {
    setLoading(true);
    const apiCall = callFactory();
    apiCall
      .then((result) => setResult(result))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  React.useEffect(refreshData, deps);
  React.useEffect(refreshData, [refresh]);
  return [result, error, loading, requestRefresh] as const;
}
