import type { StoreResponse, StoresResponse, CreateStore } from "@/dtos/storeDTO"
import { request } from './HTTPClient';

export async function getAllStores(page: number = 1): Promise<StoresResponse> {
    const response = await request<StoresResponse>('/stores', {
        method: "GET",
        params: { page }
    });
    if (!response) {
        throw new Error("Failed to fetch stores.");
    }
    return response;
}

export async function getStore(id: string = "-1"): Promise<StoreResponse> {
    const response = await request<StoreResponse>(`/stores/${id}`, {
        method: "GET"
    })
    if (!response) {
        throw new Error("Failed to fetch store details.");
    }
    return response;
}

export async function createStore(storeData: CreateStore): Promise<StoreResponse> {
    console.log(`no storeAPI.createStore tentando criar: ${storeData}`)
    console.log(storeData)
    const response = await request<StoreResponse>('/stores', {
        method: "POST",
        body: { ...storeData }
    });
    if (!response) {
        throw new Error("Failed to create store.");
    }
    return response;
}

export async function updateStore(id: string, storeData: Partial<CreateStore['store']>): Promise<StoreResponse> {
    const response = await request<StoreResponse>(`/stores/${id}`, {
        method: "PUT",
        body: { ...storeData }
    });
    if (!response) {
        throw new Error("Failed to update store.");
    }
    return response;
}

export async function deleteStore(id: string): Promise<void> {
    return request<void>(`/stores/${id}`, {
        method: "DELETE"
    });
}