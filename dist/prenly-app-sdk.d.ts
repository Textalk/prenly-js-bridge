declare type AudioData = {
    id: string;
    audio_url: string;
    image_url?: string;
    title: string;
    description: string;
    duration: number;
};

declare type AudioId = {
    id: string;
};

declare type AudioStatus = {
    id: string;
    status: 'playing' | 'paused' | 'loading';
    queued: boolean;
};

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
    showNoAccessAlert: () => Promise<void>;
    getUserJwt: () => Promise<UserDataJwt | PublicRequestError>;
    getUserConsent: () => Promise<UserConsent | null | PublicRequestError>;
    showUserConsentDialog: () => Promise<void | PublicRequestError>;
    playPauseAudio: (data: AudioData) => Promise<void | PublicRequestError>;
    queueDequeueAudio: (data: AudioData) => Promise<void | PublicRequestError>;
    getAudioStatus: (data: AudioId) => Promise<AudioStatus | PublicRequestError>;
    on: <T extends PublicEventType>(type: T, callback: PublicEventTypeToCallback[T]) => void;
    off: <T extends PublicEventType>(type: T, callback?: PublicEventTypeToCallback[T]) => void;
};

declare type PublicEventType = 'userConsentChange' | 'userLogin' | 'userLogout' | 'audioStatusChange';

declare type PublicEventTypeToCallback = {
    userConsentChange: (data: UserConsent, prevData?: UserConsent) => void;
    userLogin: (data: UserDataJwt) => void;
    userLogout: (data: UserDataJwt) => void;
    audioStatusChange: (data: AudioStatus, prevData?: AudioStatus) => void;
};

declare type PublicRequestError = {
    code: 'rejected' | 'feature_disabled' | 'login_failed' | 'logout_failed' | 'play_pause_audio_failed' | 'queue_dequeue_audio_failed' | string;
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
    att_granted?: boolean;
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
