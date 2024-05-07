# Prenly App SDK - JS Bridge

The Prenly App SDK is a JavaScript toolkit tailored for developers looking to integrate their web sites seamlessly with the Prenly native apps, focusing on user authentication and consent management. This repository contains the distribution files for the JavaScript SDK.

## Instantiation

```typescript
import PrenlyAppSDK from "prenly-js-bridge";

const { api } = new PrenlyAppSDK();
```

## API

### Functions

| Function             | Signature                                                                  | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Login                | `prenlyApp.login(): Promise<UserDataJwt \| RequestError>`                  | Trigger a login flow in the app.                                                 |
| Logout               | `prenlyApp.logout(): Promise<UserDataJwt \| RequestError>`                 | Trigger a logout flow in the app.                                                |
| Show no access alert | `prenlyApp.showNoAccessAlert(): Promise<void>`                             | Trigger a show no access alert flow in the app.                                  |
| Get user JWT         | `prenlyApp.getUserJwt(): Promise<UserDataJwt \| RequestError>`             | Retrieve information about the user as a Jwt.                                    |
| Get user consent     | `prenlyApp.getUserConsent(): Promise<UserConsent \| null \| RequestError>` | Retrieve the current consent that the user granted, or _null_ if no CMP is used. |
| Play audio           | `prenlyApp.playAudio(AudioData): Promise<AudioStatus \| RequestError>`     | Add audio and play it using the native app player.                               |
| Pause audio          | `prenlyApp.pauseAudio(): Promise<AudioStatus \| RequestError>`             | Pause audio playback initialized by the SDK.                                     |
| Get audio status     | `prenlyApp.getAudioStatus(AudioId): Promise<AudioStatus \| RequestError>`  | Retrieve audio status.                                                           |

#### Example

```typescript
const { api: prenlyApp } = new PrenlyAppSDK();

try {
  const userJwt = await prenlyApp.getUserJwt();
  // Do stuff with `userJwt`.
} catch (error) {
  // If the promise was rejected, handle the error.
}
```

### Event listeners

| Function                              | Signature                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| Start listening                       | `prenlyApp.on(EventType, (current: Object, previous?: Object) => void): void` |
| Stop listening (single listener)      | `prenlyApp.off(EventType, handler): void`                                     |
| Stop listening (all events of a type) | `prenlyApp.off(EventType): void`                                              |

### Events

#### Types

| Type              | Data        | Description                                                          |
| ----------------- | ----------- | -------------------------------------------------------------------- |
| userConsentChange | UserConsent | Triggers when the user consent changes.                              |
| userLogin         | UserDataJwt | Triggers when the user logs in.                                      |
| userLogout        | UserDataJwt | Triggers when the user logs out.                                     |
| audioStatusChange | AudioStatus | Triggers when the status of audio initialized by the SDK is changed. |

#### Callback Parameters

| Parameter   | Description                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| Parameter 1 | The response object of the current event.                                                |
| Parameter 2 | The response object of the previous event, or _undefined_ when no previous event exists. |

#### Example

```typescript
prenlyApp.on("userConsentChange", (data: UserConsent) => {
  // ...
});
```

### Response data

#### UserDataJwt

```typescript
{
  jwt: string;
}
```

#### UserConsent

```typescript
{
  cmp: string;
  prenly_purpose_grants?: {
    functional: boolean;
    analytical: boolean;
    marketing: boolean;
  };
  tc_string?: string;
  cmp_purpose_grants?: { [purpose: string]: boolean };
  cmp_vendor_grants?: { [vendor: string]: boolean };
}
```

#### AudioId

```typescript
{
  id: string;
}
```

#### AudioData

```typescript
{
  id: string;
  audio_url: string;
  image_url?: string;
  title: string;
  description: string;
  duration: number;
}
```

#### AudioStatus

```typescript
{
  id: string;
  status:
    | 'playing'
    | 'paused'
    | 'stopped'
    | 'error';
}

```

#### RequestError

```typescript
{
  code:
    | 'rejected'
    | 'feature_disabled'
    | 'login_failed'
    | 'logout_failed'
    | 'play_audio_failed'
    | 'pause_audio_failed';

  message?: string;
}
```
