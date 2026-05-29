import { AxiosError } from 'axios';

export interface ApiError {
    message: string | string[];
    statusCode: number;
    error?: string;
}

export const handleApiError = (error: any): string => {
    const axiosError = error as AxiosError<ApiError>;

    if (axiosError.response) {
        const { data, status } = axiosError.response;

        if (data) {
            if (Array.isArray(data.message)) {
                return data.message.join(', ');
            } else if (typeof data.message === 'string') {
                return data.message;
            } else if (data.error) {
                return data.error;
            }
        }

        switch (status) {
            case 400:
                return 'Bad request. Please check your input.';
            case 401:
                return 'Unauthorized. Please login.';
            case 403:
                return 'Forbidden. You don\'t have permission.';
            case 404:
                return 'Resource not found.';
            case 409:
                return 'Conflict. Resource already exists.';
            case 500:
                return 'Internal server error. Please try again later.';
            default:
                return `Server error: ${status}`;
        }
    } else if (axiosError.request) {
        return 'Network error. Please check your connection.';
    } else {
        return axiosError.message || 'An unexpected error occurred.';
    }
};
