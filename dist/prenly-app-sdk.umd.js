(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.PrenlyAppSDK = factory());
})(this, function() {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

  function promiseCreator() {
    let resolve = () => {
    };
    let reject = () => {
    };
    const promise = new Promise((innerResolve, innerReject) => {
      resolve = innerResolve;
      reject = innerReject;
    });
    return { promise, resolve, reject };
  }
  class PostMessageHandler {
    constructor({
      timeoutDuration = 6e4,
      targetWindow,
      targetOrigin
    }) {
      __publicField(this, "requestCount", 0);
      __publicField(this, "pendingRequests", {});
      __publicField(this, "eventListeners", {});
      __publicField(this, "timeoutDuration");
      __publicField(this, "targetWindow");
      __publicField(this, "targetOrigin");
      __publicField(this, "handleResponse", (event) => {
        if (event.origin && this.targetOrigin && event.origin !== this.targetOrigin) {
          return;
        }
        let eventData;
        try {
          eventData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        } catch {
          return;
        }
        const { requestId, type, data, error } = eventData;
        if (requestId && this.pendingRequests[requestId]) {
          this.processPendingRequest(requestId, data, error);
        } else if (type && this.eventListeners[type]) {
          this.processEventListener(type, data);
        }
      });
      this.timeoutDuration = timeoutDuration;
      this.targetWindow = targetWindow;
      this.targetOrigin = targetOrigin;
      if (typeof window !== "undefined") {
        window.addEventListener("message", this.handleResponse);
      }
    }
    processPendingRequest(requestId, data, error) {
      if (error) {
        this.pendingRequests[requestId].reject(error);
      } else {
        this.pendingRequests[requestId].resolve(data);
      }
    }
    processEventListener(type, data) {
      this.eventListeners[type].forEach((listener) => {
        listener.callback(
          data,
          listener.usePrevData ? listener.prevData : void 0
        );
        listener.prevData = data;
      });
    }
    generateRequestId() {
      this.requestCount += 1;
      return `${this.requestCount}-${Math.random().toString(36).substring(2, 15)}`;
    }
    async pendingRequestTimeoutAndCleanup(prom, promReject, requestId, useTimeout = true) {
      let timer;
      try {
        return await Promise.race([
          prom,
          ...useTimeout ? [
            new Promise(
              () => timer = setTimeout(
                () => promReject({
                  code: "rejected",
                  message: `Request timed out after ${this.timeoutDuration} milliseconds.`
                }),
                this.timeoutDuration
              )
            )
          ] : []
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        if (timer) {
          clearTimeout(timer);
        }
        delete this.pendingRequests[requestId];
      }
    }
    postMessageToTarget(message) {
      var _a, _b;
      if ((_b = (_a = window.webkit) == null ? void 0 : _a.messageHandlers) == null ? void 0 : _b.iosListener) {
        window.webkit.messageHandlers.iosListener.postMessage(message);
      } else if (window.AndroidInterface) {
        window.AndroidInterface.postMessage(JSON.stringify(message));
      } else if (this.targetWindow && this.targetOrigin) {
        this.targetWindow.postMessage(message, this.targetOrigin);
      }
    }
    async sendMessageAsync(type, data, options) {
      const { useTimeout = true } = options || {};
      const { promise, resolve, reject } = promiseCreator();
      const requestId = this.generateRequestId();
      this.pendingRequestTimeoutAndCleanup(
        promise,
        reject,
        requestId,
        useTimeout
      );
      this.pendingRequests[requestId] = { resolve, reject };
      const message = { type, data, requestId };
      this.postMessageToTarget(message);
      return promise;
    }
    on(type, callback, usePrevData) {
      if (!this.eventListeners[type]) {
        this.eventListeners[type] = [];
      }
      this.eventListeners[type].push({
        callback,
        prevData: void 0,
        usePrevData
      });
    }
    off(type, callback) {
      if (!this.eventListeners[type]) {
        return;
      }
      if (callback) {
        this.eventListeners[type] = this.eventListeners[type].filter(
          (listener) => listener.callback !== callback
        );
      }
      if (!callback || !this.eventListeners[type].length) {
        delete this.eventListeners[type];
      }
    }
    destroy() {
      window.removeEventListener("message", this.handleResponse);
      this.pendingRequests = {};
      this.eventListeners = {};
    }
  }
  function getApiV1(postMessageHandler) {
    return {
      version: "1.0",
      async login() {
        return postMessageHandler.sendMessageAsync(
          "prenly_login",
          void 0,
          {
            useTimeout: false
          }
        );
      },
      async logout() {
        return postMessageHandler.sendMessageAsync(
          "prenly_logout"
        );
      },
      async showNoAccessAlert() {
        return postMessageHandler.sendMessageAsync(
          "prenly_show_no_access_alert"
        );
      },
      async getUserJwt() {
        return postMessageHandler.sendMessageAsync(
          "prenly_get_user_jwt"
        );
      },
      async getUserConsent() {
        return postMessageHandler.sendMessageAsync(
          "prenly_get_user_consent"
        );
      },
      async showUserConsentDialog() {
        return postMessageHandler.sendMessageAsync(
          "prenly_show_user_consent_dialog"
        );
      },
      async playPauseAudio(data) {
        return postMessageHandler.sendMessageAsync(
          "prenly_play_pause_audio",
          data
        );
      },
      async queueDequeueAudio(data) {
        return postMessageHandler.sendMessageAsync(
          "prenly_queue_dequeue_audio",
          data
        );
      },
      async getAudioStatus(data) {
        return postMessageHandler.sendMessageAsync(
          "prenly_get_audio_status",
          data
        );
      },
      on(type, callback) {
        const params = getEventParams(type);
        postMessageHandler.on(
          params.type,
          callback,
          params.usePrevData
        );
      },
      off(type, callback) {
        postMessageHandler.off(
          getEventParams(type).type,
          callback
        );
      }
    };
  }
  function getEventParams(type) {
    switch (type) {
      case "userConsentChange":
        return { type: "prenly_on_user_consent_change", usePrevData: true };
      case "userLogin":
        return { type: "prenly_on_user_login", usePrevData: false };
      case "userLogout":
        return { type: "prenly_on_user_logout", usePrevData: false };
      case "audioStatusChange":
        return { type: "prenly_on_audio_status_change", usePrevData: true };
      default:
        throw new Error(`Unknown event type: ${type}.`);
    }
  }
  class PrenlyAppSDK {
    constructor(targetWindow, targetOrigin) {
      __publicField(this, "supportedVersion", typeof window !== "undefined" ? window.PRENLY_APP_BRIDGE_SUPPORTED_VERSION : void 0);
      __publicField(this, "api");
      __publicField(this, "destroy");
      const postMessageHandler = new PostMessageHandler({
        targetWindow,
        targetOrigin
      });
      this.setApi(postMessageHandler);
      this.destroy = this.makeDestroy(postMessageHandler);
    }
    setApi(postMessageHandler) {
      if (!this.supportedVersion) {
        console.error(
          "Prenly JS Bridge was not found. Please verify that the environment supports this feature and that it is properly activated."
        );
        return;
      }
      switch (this.supportedVersion) {
        case "1.0":
          this.api = getApiV1(postMessageHandler);
          break;
        default:
          console.error(`Unsupported version: ${this.supportedVersion}.`);
      }
    }
    makeDestroy(postMessageHandler) {
      return () => {
        this.api = void 0;
        postMessageHandler.destroy();
      };
    }
  }
  return PrenlyAppSDK;
});
