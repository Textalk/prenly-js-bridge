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

The `api` object is available when the bridge is active in the WebView. If `api` is undefined, the bridge is not activated.

## API

### Functions

| Function                     | Signature                                                | Description                                                                                                     |
| ---------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Login                        | `api.login(): Promise<UserDataJwt>`                      | Trigger a login flow in the app.                                                                                |
| Logout                       | `api.logout(): Promise<UserDataJwt>`                     | Trigger a logout flow in the app.                                                                               |
| Show no access alert         | `api.showNoAccessAlert(): Promise<void>`                 | Trigger a show no access alert flow in the app.                                                                 |
| Get user JWT                 | `api.getUserJwt(): Promise<UserDataJwt>`                 | Retrieve information about the user as a Jwt.                                                                   |
| Get user consent             | `api.getUserConsent(): Promise<UserConsent \| null>`     | Retrieve the current consent that the user granted, or _null_ if no CMP is used.                                |
| Show user consent dialog     | `api.showUserConsentDialog(): Promise<void>`             | Trigger the display of the consent dialog.                                                                      |
| Play or pause audio          | `api.playPauseAudio(AudioData): Promise<void>`           | Add audio and play it using the native app player, or pause when playing.                                       |
| Queue or dequeue audio       | `api.queueDequeueAudio(AudioData): Promise<void>`        | Queue or dequeue audio using the native app player.                                                             |
| Get audio status             | `api.getAudioStatus(AudioId): Promise<AudioStatus>`      | Retrieve audio status.                                                                                          |
| Set component data           | `api.setComponentData(ComponentData): Promise<void>`     | Set custom data to be displayed in the start page component connected to a webview.                             |
| Get push topics              | `api.getPushTopics(): Promise<PushTopicData>`            | Get a list of topics for segmented push notifications, including the device subscription status for each topic. |
| Subscribe to push topics     | `api.subscribePushTopics(PushTopicIds): Promise<void>`   | Subscribe to one or more push topics.                                                                           |
| Unsubscribe from push topics | `api.unsubscribePushTopics(PushTopicIds): Promise<void>` | Unsubscribe from one or more push topics.                                                                       |

#### Example

```typescript
import PrenlyAppSDK from "prenly-js-bridge";

const { api } = new PrenlyAppSDK();

try {
  const userJwt = await api.getUserJwt();
  // Do something with `userJwt`.
} catch (error) {
  // If the promise was rejected, check the error `code`.
  if (api.isRequestError(error) && error.code === "rejected") {
    // ...
  }
}
```

### Event listeners

| Function                              | Signature                                                               |
| ------------------------------------- | ----------------------------------------------------------------------- |
| Start listening                       | `api.on(EventType, (current: Object, previous?: Object) => void): void` |
| Stop listening (single listener)      | `api.off(EventType, handler): void`                                     |
| Stop listening (all events of a type) | `api.off(EventType): void`                                              |

### Events

#### Types

| Type                 | Data                 | Description                                                                                                 |
| -------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- |
| userConsentChange    | UserConsent          | Triggers when the user consent changes.                                                                     |
| userLogin            | UserDataJwt          | Triggers when the user logs in.                                                                             |
| userLogout           | UserDataJwt          | Triggers when the user logs out.                                                                            |
| audioStatusChange    | AudioStatus          | Triggers when the status of audio initialized by the SDK is changed.                                        |
| componentItemVisible | ComponentItemVisible | Triggers when an item is visible for the user within a start page component that is connected to a webview. |

#### Callback parameters

| Parameter   | Description                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| Parameter 1 | The response object of the current event.                                                |
| Parameter 2 | The response object of the previous event, or _undefined_ when no previous event exists. |

#### Example

```typescript
api.on("userConsentChange", (data: UserConsent) => {
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
In addition to the standard claims, the payload also includes the following:

```typescript
{
  // Common user-related claims:
  given_name?: string;
  family_name?: string;
  email?: string;

  // Custom claims:
  customer_number?: string;
  prenly_package_slugs?: string[];
  otlc?: string;
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

#### PushTopicData

```typescript
{
  topics: {
    id: number;
    name: string;
    subscribed: boolean;
  }[];
}
```

#### PushTopicIds

```typescript
{
  ids: number[];
}
```

#### RequestError (extends Error)

```typescript
{
  code:
    | 'rejected'
    | 'not_supported'
    | 'feature_disabled'
    | 'login_failed'
    | 'logout_failed'
    | 'play_pause_audio_failed'
    | 'queue_dequeue_audio_failed'
    | 'set_component_data_failed';
  message?: string;
}
```

##### Error codes

| Code                         | Applies to            | Description                                   |
| ---------------------------- | --------------------- | --------------------------------------------- |
| `rejected`                   | All requests          | The request was rejected by the app.          |
| `not_supported`              | All requests          | The request is not supported by the app.      |
| `feature_disabled`           | All requests          | The requested feature is disabled in the app. |
| `login_failed`               | `login()`             | The login flow failed.                        |
| `logout_failed`              | `logout()`            | The logout flow failed.                       |
| `play_pause_audio_failed`    | `playPauseAudio()`    | Playing or pausing the audio failed.          |
| `queue_dequeue_audio_failed` | `queueDequeueAudio()` | Queuing or dequeuing the audio failed.        |
| `set_component_data_failed`  | `setComponentData()`  | Setting the component data failed.            |
