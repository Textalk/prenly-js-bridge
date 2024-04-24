declare class PrenlyAppSDK {
    supportedVersion: string | undefined;
    api: PublicApiV1 | undefined;
    destroy: () => void;
    constructor(targetWindow?: Window, targetOrigin?: string);
    private setApi;
    private makeDestroy;
}
export default PrenlyAppSDK;

declare type PublicApiV1 = {
    version: string;
    login: () => Promise<UserDataJwt | PublicRequestError>;
    logout: () => Promise<UserDataJwt | PublicRequestError>;
    getUserJwt: () => Promise<UserDataJwt | PublicRequestError>;
    getUserConsent: () => Promise<UserConsent | null | PublicRequestError>;
    on: <T extends PublicEventType>(type: T, callback: PublicEventTypeToCallback[T]) => void;
    off: <T extends PublicEventType>(type: T, callback?: PublicEventTypeToCallback[T]) => void;
};

declare type PublicEventType = 'userConsentChange' | 'userLogin' | 'userLogout';

declare type PublicEventTypeToCallback = {
    userConsentChange: (data: UserConsent, prevData?: UserConsent) => void;
    userLogin: (data: UserDataJwt) => void;
    userLogout: (data: UserDataJwt) => void;
};

declare type PublicRequestError = {
    code: 'rejected' | 'feature_disabled' | 'login_failed' | 'logout_failed' | string;
    message?: string;
};

declare type UserConsent = {
    cmp: string;
    prenly_purpose_grants?: {
        functional: boolean;
        analytical: boolean;
        marketing: boolean;
    };
    tc_string?: string;
    cmp_purpose_grants?: {
        [purpose: string]: boolean;
    };
    cmp_vendor_grants?: {
        [vendor: string]: boolean;
    };
};

declare type UserDataJwt = {
    jwt: string;
};

export { }
