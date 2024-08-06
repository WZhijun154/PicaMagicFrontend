export enum AuthStatus {
    EMAIL_NOT_CONFIRMED = "Email not confirmed",
    EMAIL_CONFIRMED = "Email confirmed",
    INVALID_LOGIN_CREDENTIALS = "Invalid login credentials",
    SUCCESS = "Success",
    DEFAULT = "Default",
    EMAIL_RATE_LIMIT_EXCEEDED = "Email rate limit exceeded",
    FETCH_ERROR = "AuthRetryableFetchError",
    ERROR_SENDING_CONFIRMATION_MAIL = "Error sending confirmation mail",
    FETCH_FAILED = "Fetch failed",
}