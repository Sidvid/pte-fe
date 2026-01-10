import { AxiosResponse } from "axios";

export interface OptionsType {
  title: string;
  value: string;
}
export interface RadionOptionsType {
  label: string;
  value: string;
}
export interface Option {
  id: number;
  title: string;
}
export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}
export interface SuccessResponse<T> {
  rawResponse: AxiosResponse<ApiResponse<T>>;
  response: ApiResponse<T>;
}
