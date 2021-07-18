import {createAsyncThunk} from "@reduxjs/toolkit";

export enum Method {
    GET = "GET",
    PUT = "PUT",
    POST = "POST",
    DELETE = "DELETE"
}

interface Error {
    error: string
}

interface Result<T> {
    data: T
}

type Response<T> = Result<T> | Error;

function isResult<T>(response:Response<T>): response is Result<T> {
    return 'data' in response;
}

function objectInterpolate(source:string, values:object) {
    for (const [k,v] of Object.entries(values)) {
        source = source.replace("{" + k + "}", v.toString())
    }
    return source;
}

// R = Return type, P = parameter type, E = error type
export function createApiThunk<R,P extends object | void>(action:string, resource:string, method?:Method, resource_params?: RequestInit) {
    return  createAsyncThunk<R,P, { rejectValue: Error }>(action, async (params, thunkApi) => {
        resource_params = resource_params ?? { };
        resource_params.method = method ?? Method.GET;

        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'application/json');
        resource_params.headers = requestHeaders;

        let res = resource;
        // interpolate any `{}` value in the parameter
        if(params) {
            res = objectInterpolate(res, params);

            // We only include the params as body for POST and PUT.
            // For non-body methods like DELETE where we want to take a param so we can do interpolation on the
            // url, but we don't want to unnecessarily send a body
            if(resource_params.method === Method.POST || resource_params?.method === Method.PUT) {
                resource_params.body = JSON.stringify(params);
            }
        }

        const fetch_response = await fetch(res, resource_params);
        if (fetch_response.ok) {
            const api_response = (await fetch_response.json()) as Response<R>;
            if (isResult(api_response)) {
                return api_response.data;
            } else {
                return thunkApi.rejectWithValue(api_response as Error);
            }
        }
        return thunkApi.rejectWithValue({ error: "API Error"} as Error);
    });
}

// throw this here for now
export const api = (resource:string) => "http://localhost:8000" + resource;