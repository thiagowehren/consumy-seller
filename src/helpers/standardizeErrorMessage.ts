import { APIErrorMessages } from "@/helpers/constants/APIErrorMessages";
import { HTTPError } from "@/helpers/HTTPError";

export const standardizeErrorMessage = (error: Error): string => {
  if (error instanceof HTTPError) {
    switch (error.status) {
        case 401:
            // console.error('User is not authorized to access this resource.');
            return APIErrorMessages.standard.unauthorized;
        case 404:
            // console.error('The requested resource was not found.');
            return APIErrorMessages.standard.notFound;
        case 422:
            // console.error('The requested is unprocessable.');
            return APIErrorMessages.standard.unprocessable;
        default:
            // console.error('An unexpected HTTP Error occurred:', error);
            return `An unexpected HTTP Error occurred! STATUS ${error.status}`;
    }
  } else {
    // console.error('An unexpected error occurred:', error);
    return error.toString();
  }
};
