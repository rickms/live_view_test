import {createAsyncThunk} from "@reduxjs/toolkit";

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
// R = Return type, P = parameter type, E = error type
export function createApiThunk<R,P>(action:string, resource:string, resource_params?: RequestInit) {
    return  createAsyncThunk<R,P, { rejectValue: Error }>(action, async (params, thunkApi) => {
        resource_params = resource_params ?? { };

        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Content-Type', 'application/json');
        resource_params.headers = requestHeaders;

        if(params) {
            resource_params.body = JSON.stringify(params);
        }

        const fetch_response = await fetch(resource, resource_params);
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