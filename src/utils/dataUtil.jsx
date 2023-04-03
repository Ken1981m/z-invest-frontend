const BASE_URL = `${process.env.REACT_APP_API_URL}`;


export function postJsonData(url, jsonData) {
     fetch(BASE_URL + url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: jsonData
        })
        .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response;
        })
        .then(data => {
             console.log(data);
        })
        .catch(error => {
             console.error(error);
     });
}

export function postParamData(url, paramData) {
    const searchParams = new URLSearchParams(paramData);
    const paramUrl = BASE_URL + url + "?" + searchParams.toString();
     fetch(paramUrl, {
              method: 'POST',
        })
        .then(response => {
              if (!response.ok) {
                throw new Error(response.statusText);
              }
              return response;
        })
        .then(data => {
             console.log(data);
        })
        .catch(error => {
             console.error(error);
     });
}

export function fetchParamData(url, paramData) {
    const searchParams = new URLSearchParams(paramData);
    const paramUrl = BASE_URL + url + "?" + searchParams.toString();
    return fetch(paramUrl);
}

export function fetchData(url) {
     return fetch(BASE_URL + url);
}