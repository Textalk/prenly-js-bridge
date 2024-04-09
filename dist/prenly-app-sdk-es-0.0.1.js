var c = Object.defineProperty;
var p = (n, e, t) => e in n ? c(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var r = (n, e, t) => (p(n, typeof e != "symbol" ? e + "" : e, t), t);
function l() {
  let n = () => {
  }, e = () => {
  };
  return { promise: new Promise((s, i) => {
    n = s, e = i;
  }), resolve: n, reject: e };
}
class f {
  constructor({
    timeoutDuration: e = 6e4,
    targetWindow: t,
    targetOrigin: s
  }) {
    r(this, "requestCount", 0);
    r(this, "pendingRequests", {});
    r(this, "eventListeners", {});
    r(this, "timeoutDuration");
    r(this, "targetWindow");
    r(this, "targetOrigin");
    r(this, "handleResponse", (e) => {
      if (e.origin && this.targetOrigin && e.origin !== this.targetOrigin)
        return;
      let t;
      try {
        t = typeof e.data == "string" ? JSON.parse(e.data) : e.data;
      } catch (u) {
        console.error(u);
        return;
      }
      const { requestId: s, type: i, data: o, error: a } = t;
      s && this.pendingRequests[s] ? this.processPendingRequest(s, o, a) : i && this.eventListeners[i] && this.processEventListener(i, o);
    });
    this.timeoutDuration = e, this.targetWindow = t, this.targetOrigin = s, window.addEventListener("message", this.handleResponse);
  }
  processPendingRequest(e, t, s) {
    s ? this.pendingRequests[e].reject(s) : this.pendingRequests[e].resolve(t);
  }
  processEventListener(e, t) {
    this.eventListeners[e].forEach((s) => {
      s.callback(
        t,
        s.usePrevData ? s.prevData : void 0
      ), s.prevData = t;
    });
  }
  generateRequestId() {
    return this.requestCount += 1, `${this.requestCount}-${Math.random().toString(36).substring(2, 15)}`;
  }
  async pendingRequestTimeoutAndCleanup(e, t, s, i = !0) {
    let o;
    try {
      return await Promise.race([
        e,
        ...i ? [
          new Promise(
            () => o = setTimeout(
              () => t({
                code: "rejected",
                message: `Request timed out after ${this.timeoutDuration} milliseconds.`
              }),
              this.timeoutDuration
            )
          )
        ] : []
      ]);
    } catch (a) {
      console.error(a);
    } finally {
      o && clearTimeout(o), delete this.pendingRequests[s];
    }
  }
  postMessageToTarget(e) {
    var t, s;
    (s = (t = window.webkit) == null ? void 0 : t.messageHandlers) != null && s.iosListener ? window.webkit.messageHandlers.iosListener.postMessage(e) : window.AndroidInterface ? window.AndroidInterface.postMessage(JSON.stringify(e)) : this.targetWindow && this.targetOrigin && this.targetWindow.postMessage(e, this.targetOrigin);
  }
  async sendMessageAsync(e, t, s) {
    const { useTimeout: i = !0 } = s || {}, { promise: o, resolve: a, reject: u } = l(), d = this.generateRequestId();
    this.pendingRequestTimeoutAndCleanup(
      o,
      u,
      d,
      i
    ), this.pendingRequests[d] = { resolve: a, reject: u };
    const h = { type: e, data: t, requestId: d };
    return this.postMessageToTarget(h), o;
  }
  on(e, t, s) {
    this.eventListeners[e] || (this.eventListeners[e] = []), this.eventListeners[e].push({
      callback: t,
      prevData: void 0,
      usePrevData: s
    });
  }
  off(e, t) {
    this.eventListeners[e] && (t && (this.eventListeners[e] = this.eventListeners[e].filter(
      (s) => s.callback !== t
    )), (!t || !this.eventListeners[e].length) && delete this.eventListeners[e]);
  }
  destroy() {
    window.removeEventListener("message", this.handleResponse), this.pendingRequests = {}, this.eventListeners = {};
  }
}
function v(n) {
  return {
    version: "1.0",
    async login() {
      return n.sendMessageAsync("prenly_login", void 0, {
        useTimeout: !1
      });
    },
    async logout() {
      return n.sendMessageAsync("prenly_logout");
    },
    async getUserJwt() {
      return n.sendMessageAsync("prenly_get_user_jwt");
    },
    async getUserConsent() {
      return n.sendMessageAsync("prenly_get_user_consent");
    },
    on(e, t) {
      const s = g(e);
      n.on(s.type, t, s.usePrevData);
    },
    off(e, t) {
      n.off(g(e).type, t);
    }
  };
}
function g(n) {
  switch (n) {
    case "userConsentChange":
      return { type: "prenly_on_user_consent_change", usePrevData: !0 };
    case "userLogin":
      return { type: "prenly_on_user_login", usePrevData: !1 };
    case "userLogout":
      return { type: "prenly_on_user_logout", usePrevData: !1 };
    default:
      throw new Error(`Unknown event type: ${n}.`);
  }
}
class m {
  constructor(e, t) {
    r(this, "supportedVersion", window.PRENLY_APP_BRIDGE_SUPPORTED_VERSION);
    r(this, "api");
    r(this, "destroy");
    const s = new f({
      targetWindow: e,
      targetOrigin: t
    });
    this.setApi(s), this.destroy = this.makeDestroy(s);
  }
  setApi(e) {
    switch (this.supportedVersion) {
      case "1.0":
        this.api = v(e);
        break;
      default:
        throw new Error(`Unsupported version: ${this.supportedVersion}.`);
    }
  }
  makeDestroy(e) {
    return () => {
      this.api = void 0, e.destroy();
    };
  }
}
export {
  m as default
};
