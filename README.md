# Prenly App SDK - JS Bridge

The Prenly App SDK is a JavaScript toolkit tailored for developers looking to integrate their web sites seamlessly with the Prenly native apps, focusing on user authentication and consent management. This repository contains the distribution files for the JavaScript SDK.

## Install

```
npm i prenly-js-bridge
```

## Instantiation

```typescript
import PrenlyAppSDK from "prenly-js-bridge";

const { api } = new PrenlyAppSDK();
```

## API

### Functions

| Function                 | Signature                                                                  | Description                                                                         |
| ------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Login                    | `prenlyApp.login(): Promise<UserDataJwt \| RequestError>`                  | Trigger a login flow in the app.                                                    |
| Logout                   | `prenlyApp.logout(): Promise<UserDataJwt \| RequestError>`                 | Trigger a logout flow in the app.                                                   |
| Show no access alert     | `prenlyApp.showNoAccessAlert(): Promise<void>`                             | Trigger a show no access alert flow in the app.                                     |
| Get user JWT             | `prenlyApp.getUserJwt(): Promise<UserDataJwt \| RequestError>`             | Retrieve information about the user as a Jwt.                                       |
| Get user consent         | `prenlyApp.getUserConsent(): Promise<UserConsent \| null \| RequestError>` | Retrieve the current consent that the user granted, or _null_ if no CMP is used.    |
| Show user consent dialog | `prenlyApp.showUserConsentDialog(): Promise<void \| RequestError>`         | Trigger the display of the consent dialog.                                          |
| Play or pause audio      | `prenlyApp.playPauseAudio(AudioData): Promise<void \| RequestError>`       | Add audio and play it using the native app player, or pause when playing.           |
| Queue or dequeue audio   | `prenlyApp.queueDequeueAudio(AudioData): Promise<void \| RequestError>`    | Queue or dequeue audio using the native app player.                                 |
| Get audio status         | `prenlyApp.getAudioStatus(AudioId): Promise<AudioStatus \| RequestError>`  | Retrieve audio status.                                                              |
| Set component data       | `prenlyApp.setComponentData(ComponentData): Promise<void \| RequestError>` | Set custom data to be displayed in the start page component connected to a webview. |

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

| Type                 | Data                 | Description                                                                                                 |
| -------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| userConsentChange    | UserConsent          | Triggers when the user consent changes.                                                                     |
| userLogin            | UserDataJwt          | Triggers when the user logs in.                                                                             |
| userLogout           | UserDataJwt          | Triggers when the user logs out.                                                                            |
| audioStatusChange    | AudioStatus          | Triggers when the status of audio initialized by the SDK is changed.                                        |
| componentItemVisible | ComponentItemVisible | Triggers when an item is visible for the user within a start page component that is connected to a webview. |

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

### Data models

#### UserDataJwt

```typescript
{
  jwt: string;
}
```

The decoded JWT string contains _header_, _payload_ and _signature_.
The payload has the following definition:

```typescript
{
  // Standard claims:
  sub?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  // Custom claims:
  customer_number?: string;
  prenly_package_slugs?: string[];
  is_logged_in: boolean;
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
  att_granted?: boolean;
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
  duration: number; // in seconds
}
```

#### AudioStatus

```typescript
{
  id: string;
  status: "playing" | "paused" | "loading";
  queued: boolean;
}
```

#### ComponentData

```typescript
{
  id: string; // component identifier
  items: {
    id: string;
    header: string;
    subheader: string;
    deeplink_url: string;
    image_url: string;
    image_width?: number;
    image_height?: number;
  }[];
}
```

#### ComponentItemVisible

```typescript
{
  component_id: string;
  item_id: string;
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
    | 'play_pause_audio_failed'
    | 'queue_dequeue_audio_failed';
  message?: string;
}
```
