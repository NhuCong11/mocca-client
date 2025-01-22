/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from './axiosInstance';
import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const callApi = async (
  method: HttpMethod,
  url: string,
  params: Record<string, any> | null = null,
  data: Record<string, any> | null = null,
  customHeaders: Record<string, string> = {},
): Promise<AxiosResponse<any>> => {
  try {
    const config: AxiosRequestConfig = {
      method: method as AxiosRequestConfig['method'],
      url: url,
      params: params,
      data: data,
      headers: {
        ...axiosInstance.defaults.headers?.common,
        ...customHeaders,
      },
    };

    const response = await axiosInstance(config);
    return response;
  } catch (error) {
    if ((error as AxiosError).response) {
      // Nếu có phản hồi từ máy chủ
      return Promise.reject(error as AxiosError);
    } else {
      return Promise.reject(error);
    }
  }
};
