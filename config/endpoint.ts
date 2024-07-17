// Make sure to include "NEXT_PUBLIC_" if these endpoints are used client-side.

export const backendBaseUrl = "http://localhost:8000"

export const uploadFilesEndPoint = `${backendBaseUrl}/upload/`;
export const mergePdfEndPoint = `${backendBaseUrl}/merge_pdf/`;
export const downloadEndPoint = `${backendBaseUrl}/download/`;
