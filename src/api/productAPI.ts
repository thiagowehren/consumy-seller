import type { ProductResponse, ProductsResponse, CreateProduct } from "@/dtos/productDTO";
import { request } from './HTTPClient';

export async function getAllStoreProducts(storeId: string, page: number = 1): Promise<ProductsResponse> {
    const response = await request<ProductsResponse>(`/stores/${storeId}/products`, {
        method: "GET",
        params: { page }
    });
    if (!response) {
        throw new Error("Failed to fetch products.");
    }
    return response;
}

export async function getStoreProduct(storeId: string, productId: string): Promise<ProductResponse> {
    const response = await request<ProductResponse>(`/stores/${storeId}/products/${productId}`, {
        method: "GET"
    })
    if (!response) {
        throw new Error("Failed to fetch product details.");
    }
    return response;
}

export async function createStoreProduct(storeId: string, productData: CreateProduct): Promise<ProductResponse> {
    const response = await request<ProductResponse>(`/stores/${storeId}/products`, {
        method: "POST",
        body: { ...productData }
    });
    if (!response) {
        throw new Error("Failed to create product.");
    }
    return response;
}

export async function updateStoreProduct(storeId: string, productId: string, productData: Partial<CreateProduct['product']>): Promise<ProductResponse> {
    const response = await request<ProductResponse>(`/stores/${storeId}/products/${productId}`, {
        method: "PUT",
        body: { ...productData }
    });
    if (!response) {
        throw new Error("Failed to update product.");
    }
    return response;
}

export async function deleteStoreProduct(storeId: string, productId: string): Promise<void> {
    return request<void>(`/stores/${storeId}/products/${productId}`, {
        method: "DELETE"
    });
}
