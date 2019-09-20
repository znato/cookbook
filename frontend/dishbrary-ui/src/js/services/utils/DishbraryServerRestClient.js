import * as ServerConstants from '../../config/ServerConstants'

const buildServiceUrl = (serviceUrl) => ServerConstants.serverBaseRestUrl + serviceUrl;

export const get = (serviceUrl) => {
    return fetch(buildServiceUrl(serviceUrl), {
        credentials: ServerConstants.sameOrigin ? "same-origin" : "include"
    })
        .then(response => response.json());
}

export const put = (serviceUrl, data) => {
    return fetch(buildServiceUrl(serviceUrl), {
        credentials: ServerConstants.sameOrigin ? "same-origin" : "include",
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response => response.json()));
}

export const post = (serviceUrl, data) => {
    return fetch(buildServiceUrl(serviceUrl), {
        credentials: ServerConstants.sameOrigin ? "same-origin" : "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response => response.json()));
}

export const postFormData = (serviceUrl, data) => {
    return fetch(buildServiceUrl(serviceUrl), {
        credentials: ServerConstants.sameOrigin ? "same-origin" : "include",
        method: "POST",
        body: data,
    })
        .then((response => response.json()));
}