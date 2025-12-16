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

declare type ComponentData = {
    id: string;
    items: {
        id: string;
        header: string;
        subheader: string;
        deeplink_url: string;
        image_url: string;
        image_width?: number;
        image_height?: number;
    }[];
};

declare type ComponentItemVisible = {
    component_id: string;
    item_id: string;
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
    login: () => Promise<UserDataJwt>;
    logout: () => Promise<UserDataJwt>;
    showNoAccessAlert: () => Promise<void>;
    getUserJwt: () => Promise<UserDataJwt>;
    getUserConsent: () => Promise<UserConsent | null>;
    showUserConsentDialog: () => Promise<void>;
    playPauseAudio: (data: AudioData) => Promise<void>;
    queueDequeueAudio: (data: AudioData) => Promise<void>;
    getAudioStatus: (data: AudioId) => Promise<AudioStatus>;
    setComponentData: (data: ComponentData) => Promise<void>;
    on: <T extends PublicEventType>(type: T, callback: PublicEventTypeToCallback[T]) => void;
    off: <T extends PublicEventType>(type: T, callback?: PublicEventTypeToCallback[T]) => void;
    isRequestError: (error: unknown) => error is RequestError<PublicRequestError['code']>;
};

declare type PublicEventType = 'userConsentChange' | 'userLogin' | 'userLogout' | 'audioStatusChange' | 'componentItemVisible';

declare type PublicEventTypeToCallback = {
    userConsentChange: (data: UserConsent, prevData?: UserConsent) => void;
    userLogin: (data: UserDataJwt) => void;
    userLogout: (data: UserDataJwt) => void;
    audioStatusChange: (data: AudioStatus, prevData?: AudioStatus) => void;
    componentItemVisible: (data: ComponentItemVisible, prevData?: ComponentItemVisible) => void;
};

declare type PublicRequestError = {
    code: RequestErrorBaseCode | 'not_supported' | 'feature_disabled' | 'login_failed' | 'logout_failed' | 'play_pause_audio_failed' | 'queue_dequeue_audio_failed' | 'set_component_data_failed';
    message?: string;
};

declare class RequestError<T = string> extends Error {
    code: T;
    constructor(code: T, message?: string);
    toJSON(): {
        message: string | undefined;
        code: T;
    };
}

declare type RequestErrorBaseCode = 'rejected';

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
