/*! For license information please see main.js.LICENSE.txt */
var uppyWrapper
;(() => {
  var e = {
      5158: (e) => {
        e.exports = function (e) {
          if ('number' != typeof e || isNaN(e))
            throw new TypeError('Expected a number, got ' + typeof e)
          var t = e < 0,
            s = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          if ((t && (e = -e), e < 1)) return (t ? '-' : '') + e + ' B'
          var i = Math.min(
            Math.floor(Math.log(e) / Math.log(1024)),
            s.length - 1
          )
          e = Number(e / Math.pow(1024, i))
          var r = s[i]
          return e >= 10 || e % 1 == 0
            ? (t ? '-' : '') + e.toFixed(0) + ' ' + r
            : (t ? '-' : '') + e.toFixed(1) + ' ' + r
        }
      },
      1383: (e, t, s) => {
        var i, r, o, n, a
        function l(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var d = 0
        function p(e) {
          return '__private_' + d++ + '_' + e
        }
        const { nanoid: h } = s(2961),
          { Provider: u, RequestClient: c, Socket: f } = s(6385),
          m = s(7351),
          g = s(5313),
          y = s(8429),
          v = s(4772),
          b = s(5570),
          w = s(6311),
          S = s(883),
          { internalRateLimitedQueue: P } = s(8618)
        function F(e, t) {
          if (S(e)) return new w(t, e)
          const s = new b('Upload error', { cause: t })
          return (s.request = e), s
        }
        function _(e) {
          var t
          const { uppy: s } = this,
            i = s.getState().xhrUpload
          return {
            ...this.opts,
            ...(i || {}),
            ...(e.xhrUpload || {}),
            headers: {
              ...this.opts.headers,
              ...(null == i ? void 0 : i.headers),
              ...(null == (t = e.xhrUpload) ? void 0 : t.headers),
            },
          }
        }
        function C(e, t, s) {
          this.uploaderEvents[t].on(e, (e) => {
            t === e && s()
          })
        }
        function k(e, t, s) {
          var i = this
          this.uploaderEvents[t].on(e, function () {
            i.uppy.getFile(t) && s(...arguments)
          })
        }
        function T(e, t, s) {
          const n = l(this, i)[i](e)
          return (
            this.uppy.log(`uploading ${t} of ${s}`),
            new Promise((t, s) => {
              const i = n.formData
                  ? (function (e, t) {
                      const s = new FormData()
                      !(function (e, t, s) {
                        ;(Array.isArray(s.metaFields)
                          ? s.metaFields
                          : Object.keys(t)
                        ).forEach((s) => {
                          e.append(s, t[s])
                        })
                      })(s, e.meta, t)
                      const i = (function (e) {
                        return e.data.slice(0, e.data.size, e.meta.type)
                      })(e)
                      return (
                        e.name
                          ? s.append(t.fieldName, i, e.meta.name)
                          : s.append(t.fieldName, i),
                        s
                      )
                    })(e, n)
                  : ((e) => e.data)(e),
                a = new XMLHttpRequest()
              this.uploaderEvents[e.id] = new y(this.uppy)
              const d = new v(n.timeout, () => {
                  a.abort(), u.done()
                  const t = new Error(
                    this.i18n('timedOut', {
                      seconds: Math.ceil(n.timeout / 1e3),
                    })
                  )
                  this.uppy.emit('upload-error', e, t), s(t)
                }),
                p = h()
              a.upload.addEventListener('loadstart', () => {
                this.uppy.log(`[AwsS3/XHRUpload] ${p} started`)
              }),
                a.upload.addEventListener('progress', (t) => {
                  this.uppy.log(
                    `[AwsS3/XHRUpload] ${p} progress: ${t.loaded} / ${t.total}`
                  ),
                    d.progress(),
                    t.lengthComputable &&
                      this.uppy.emit('upload-progress', e, {
                        uploader: this,
                        bytesUploaded: t.loaded,
                        bytesTotal: t.total,
                      })
                }),
                a.addEventListener('load', (i) => {
                  if (
                    (this.uppy.log(`[AwsS3/XHRUpload] ${p} finished`),
                    d.done(),
                    u.done(),
                    this.uploaderEvents[e.id] &&
                      (this.uploaderEvents[e.id].remove(),
                      (this.uploaderEvents[e.id] = null)),
                    n.validateStatus(i.target.status, a.responseText, a))
                  ) {
                    const s = n.getResponseData(a.responseText, a),
                      r = s[n.responseUrlFieldName],
                      o = { status: i.target.status, body: s, uploadURL: r }
                    return (
                      this.uppy.emit('upload-success', e, o),
                      r && this.uppy.log(`Download ${e.name} from ${r}`),
                      t(e)
                    )
                  }
                  const r = n.getResponseData(a.responseText, a),
                    o = F(a, n.getResponseError(a.responseText, a)),
                    l = { status: i.target.status, body: r }
                  return this.uppy.emit('upload-error', e, o, l), s(o)
                }),
                a.addEventListener('error', () => {
                  this.uppy.log(`[AwsS3/XHRUpload] ${p} errored`),
                    d.done(),
                    u.done(),
                    this.uploaderEvents[e.id] &&
                      (this.uploaderEvents[e.id].remove(),
                      (this.uploaderEvents[e.id] = null))
                  const t = F(a, n.getResponseError(a.responseText, a))
                  return this.uppy.emit('upload-error', e, t), s(t)
                }),
                a.open(n.method.toUpperCase(), n.endpoint, !0),
                (a.withCredentials = Boolean(n.withCredentials)),
                '' !== n.responseType && (a.responseType = n.responseType),
                Object.keys(n.headers).forEach((e) => {
                  a.setRequestHeader(e, n.headers[e])
                })
              const u = this.requests.run(
                () => (
                  a.send(i),
                  () => {
                    d.done(), a.abort()
                  }
                ),
                { priority: 1 }
              )
              l(this, r)[r]('file-removed', e.id, () => {
                u.abort(), s(new Error('File removed'))
              }),
                l(this, o)[o]('cancel-all', e.id, function (e) {
                  let { reason: t } = void 0 === e ? {} : e
                  'user' === t && u.abort(), s(new Error('Upload cancelled'))
                })
            })
          )
        }
        function O(e) {
          const t = l(this, i)[i](e),
            s = Array.isArray(t.metaFields) ? t.metaFields : Object.keys(e.meta)
          return new (e.remote.providerOptions.provider ? u : c)(
            this.uppy,
            e.remote.providerOptions
          )
            .post(e.remote.url, {
              ...e.remote.body,
              endpoint: t.endpoint,
              size: e.data.size,
              fieldname: t.fieldName,
              metadata: Object.fromEntries(s.map((t) => [t, e.meta[t]])),
              httpMethod: t.method,
              useFormData: t.formData,
              headers: t.headers,
            })
            .then((s) =>
              new Promise((i, n) => {
                const { token: a } = s,
                  d = g(e.remote.companionUrl),
                  p = new f({ target: `${d}/api/${a}`, autoOpen: !1 })
                this.uploaderEvents[e.id] = new y(this.uppy)
                const h = this.requests.run(
                  () => (
                    p.open(), e.isPaused && p.send('pause', {}), () => p.close()
                  )
                )
                l(this, r)[r]('file-removed', e.id, () => {
                  p.send('cancel', {}),
                    h.abort(),
                    i(`upload ${e.id} was removed`)
                }),
                  l(this, o)[o]('cancel-all', e.id, function (t) {
                    let { reason: s } = void 0 === t ? {} : t
                    'user' === s && (p.send('cancel', {}), h.abort()),
                      i(`upload ${e.id} was canceled`)
                  }),
                  l(this, r)[r]('upload-retry', e.id, () => {
                    p.send('pause', {}), p.send('resume', {})
                  }),
                  l(this, o)[o]('retry-all', e.id, () => {
                    p.send('pause', {}), p.send('resume', {})
                  }),
                  p.on('progress', (t) => m(this, t, e)),
                  p.on('success', (s) => {
                    const r = t.getResponseData(
                        s.response.responseText,
                        s.response
                      ),
                      o = r[t.responseUrlFieldName],
                      n = {
                        status: s.response.status,
                        body: r,
                        uploadURL: o,
                        bytesUploaded: s.bytesUploaded,
                      }
                    return (
                      this.uppy.emit('upload-success', e, n),
                      h.done(),
                      this.uploaderEvents[e.id] &&
                        (this.uploaderEvents[e.id].remove(),
                        (this.uploaderEvents[e.id] = null)),
                      i()
                    )
                  }),
                  p.on('error', (s) => {
                    const i = s.response,
                      r = i
                        ? t.getResponseError(i.responseText, i)
                        : new b(s.error.message, { cause: s.error })
                    this.uppy.emit('upload-error', e, r),
                      h.done(),
                      this.uploaderEvents[e.id] &&
                        (this.uploaderEvents[e.id].remove(),
                        (this.uploaderEvents[e.id] = null)),
                      n(r)
                  })
              }).catch(
                (t) => (this.uppy.emit('upload-error', e, t), Promise.reject(t))
              )
            )
        }
        e.exports =
          ((i = p('getOptions')),
          (r = p('addEventHandlerForFile')),
          (o = p('addEventHandlerIfFileStillExists')),
          (n = p('uploadLocalFile')),
          (a = p('uploadRemoteFile')),
          class {
            constructor(e, t) {
              Object.defineProperty(this, a, { value: O }),
                Object.defineProperty(this, n, { value: T }),
                Object.defineProperty(this, o, { value: k }),
                Object.defineProperty(this, r, { value: C }),
                Object.defineProperty(this, i, { value: _ }),
                (this.uppy = e),
                (this.opts = {
                  validateStatus: (e) => e >= 200 && e < 300,
                  ...t,
                }),
                (this.requests = t[P]),
                (this.uploaderEvents = Object.create(null)),
                (this.i18n = t.i18n)
            }
            uploadFile(e, t, s) {
              const i = this.uppy.getFile(e)
              if (i.error) throw new Error(i.error)
              return i.isRemote
                ? l(this, a)[a](i, t, s)
                : l(this, n)[n](i, t, s)
            }
          })
      },
      4105: (e, t, s) => {
        var i, r, o, n, a, l
        function d(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var p = 0
        function h(e) {
          return '__private_' + p++ + '_' + e
        }
        const u = s(8937),
          { RateLimitedQueue: c, internalRateLimitedQueue: f } = s(8618),
          { RequestClient: m } = s(6385),
          g = s(1383),
          y = s(1236),
          v = s(5819)
        function b(e, t) {
          const s = e.indexOf(`<${t}>`),
            i = e.indexOf(`</${t}>`, s)
          return -1 !== s && -1 !== i ? e.slice(s + t.length + 2, i) : ''
        }
        function w(e) {
          if (e && e.error) {
            const t = new Error(e.message)
            throw (Object.assign(t, e.error), t)
          }
          return e
        }
        function S(e, t) {
          if (!y(e, t)) return
          const s = b(e, 'Message')
          return new Error(s)
        }
        let P = !1
        e.exports =
          ((r = h('client')),
          (o = h('requests')),
          (n = h('uploader')),
          (a = h('handleUpload')),
          (l = i =
            class extends u {
              constructor(e, t) {
                super(e, t),
                  Object.defineProperty(this, r, {
                    writable: !0,
                    value: void 0,
                  }),
                  Object.defineProperty(this, o, {
                    writable: !0,
                    value: void 0,
                  }),
                  Object.defineProperty(this, n, {
                    writable: !0,
                    value: void 0,
                  }),
                  Object.defineProperty(this, a, {
                    writable: !0,
                    value: (e) => {
                      const t = Object.create(null)
                      function s(e) {
                        var s
                        const { id: i } = e
                        null == (s = t[i]) || s.abort()
                      }
                      this.uppy.on('file-removed', s),
                        e.forEach((e) => {
                          const t = this.uppy.getFile(e)
                          this.uppy.emit('upload-started', t)
                        })
                      const i = d(this, o)[o].wrapPromiseFunction((e) =>
                          this.opts.getUploadParameters(e)
                        ),
                        r = e.length
                      return Promise.allSettled(
                        e.map(
                          (e, s) => (
                            (t[e] = i(this.uppy.getFile(e))),
                            t[e]
                              .then((i) => {
                                delete t[e]
                                const o = this.uppy.getFile(e)
                                !(function (e, t) {
                                  if (
                                    null == t ||
                                    'string' != typeof t.url ||
                                    ('object' != typeof t.fields &&
                                      null != t.fields)
                                  )
                                    throw new TypeError(
                                      `AwsS3: got incorrect result from 'getUploadParameters()' for file '${
                                        e.name
                                      }', expected an object '{ url, method, fields, headers }' but got '${JSON.stringify(
                                        t
                                      )}' instead.\nSee https://uppy.io/docs/aws-s3/#getUploadParameters-file for more on the expected format.`
                                    )
                                  if (
                                    null != t.method &&
                                    !/^p(u|os)t$/i.test(t.method)
                                  )
                                    throw new TypeError(
                                      `AwsS3: got incorrect method from 'getUploadParameters()' for file '${e.name}', expected  'put' or 'post' but got '${t.method}' instead.\nSee https://uppy.io/docs/aws-s3/#getUploadParameters-file for more on the expected format.`
                                    )
                                })(o, i)
                                const {
                                    method: a = 'post',
                                    url: l,
                                    fields: p,
                                    headers: h,
                                  } = i,
                                  u = {
                                    method: a,
                                    formData: 'post' === a.toLowerCase(),
                                    endpoint: l,
                                    metaFields: p ? Object.keys(p) : [],
                                  }
                                return (
                                  h && (u.headers = h),
                                  this.uppy.setFileState(o.id, {
                                    meta: { ...o.meta, ...p },
                                    xhrUpload: u,
                                  }),
                                  d(this, n)[n].uploadFile(o.id, s, r)
                                )
                              })
                              .catch((s) => {
                                delete t[e]
                                const i = this.uppy.getFile(e)
                                return (
                                  this.uppy.emit('upload-error', i, s),
                                  Promise.reject(s)
                                )
                              })
                          )
                        )
                      ).finally(() => {
                        this.uppy.off('file-removed', s)
                      })
                    },
                  }),
                  (this.type = 'uploader'),
                  (this.id = this.opts.id || 'AwsS3'),
                  (this.title = 'AWS S3'),
                  (this.defaultLocale = v)
                const s = {
                  timeout: 3e4,
                  limit: 0,
                  metaFields: [],
                  getUploadParameters: this.getUploadParameters.bind(this),
                }
                ;(this.opts = { ...s, ...t }),
                  this.i18nInit(),
                  (d(this, r)[r] = new m(e, t)),
                  (d(this, o)[o] = new c(this.opts.limit))
              }
              getUploadParameters(e) {
                if (!this.opts.companionUrl)
                  throw new Error(
                    'Expected a `companionUrl` option containing a Companion address.'
                  )
                const t = e.meta.name,
                  { type: s } = e.meta,
                  i = Object.fromEntries(
                    this.opts.metaFields
                      .filter((t) => null != e.meta[t])
                      .map((t) => [`metadata[${t}]`, e.meta[t].toString()])
                  ),
                  o = new URLSearchParams({ filename: t, type: s, ...i })
                return d(this, r)[r].get(`s3/params?${o}`).then(w)
              }
              install() {
                const { uppy: e } = this
                e.addUploader(d(this, a)[a])
                const t = {
                  fieldName: 'file',
                  responseUrlFieldName: 'location',
                  timeout: this.opts.timeout,
                  [f]: d(this, o)[o],
                  responseType: 'text',
                  getResponseData:
                    this.opts.getResponseData ||
                    function (t, s) {
                      return y(t, s)
                        ? {
                            location:
                              ((i = s.responseURL),
                              (r = b(t, 'Location')),
                              new URL(r, i || void 0).toString()),
                            bucket: b(t, 'Bucket'),
                            key: b(t, 'Key'),
                            etag: b(t, 'ETag'),
                          }
                        : 'POST' === this.method.toUpperCase()
                        ? (P ||
                            (e.log(
                              '[AwsS3] No response data found, make sure to set the success_action_status AWS SDK option to 201. See https://uppy.io/docs/aws-s3/#POST-Uploads',
                              'warning'
                            ),
                            (P = !0)),
                          { location: null })
                        : s.responseURL
                        ? { location: s.responseURL.replace(/\?.*$/, '') }
                        : { location: null }
                      var i, r
                    },
                  getResponseError: S,
                }
                ;(t.i18n = this.i18n), (d(this, n)[n] = new g(e, t))
              }
              uninstall() {
                this.uppy.removeUploader(d(this, a)[a])
              }
            }),
          (i.VERSION = '2.1.0'),
          l)
      },
      1236: (e) => {
        e.exports = function (e, t) {
          const s = t.headers
            ? t.headers['content-type']
            : t.getResponseHeader('Content-Type')
          if ('string' == typeof s) {
            const t = ((i = s), i.replace(/;.*$/, '')).toLowerCase()
            if ('application/xml' === t || 'text/xml' === t) return !0
            if ('text/html' === t && /^<\?xml /.test(e)) return !0
          }
          var i
          return !1
        }
      },
      5819: (e) => {
        e.exports = {
          strings: {
            timedOut: 'Upload stalled for %{seconds} seconds, aborting.',
          },
        }
      },
      1220: (e) => {
        'use strict'
        class t extends Error {
          constructor() {
            super('Authorization required'),
              (this.name = 'AuthError'),
              (this.isAuthError = !0)
          }
        }
        e.exports = t
      },
      6808: (e, t, s) => {
        'use strict'
        const i = s(2368),
          r = s(8871)
        e.exports = class extends i {
          constructor(e, t) {
            super(e, t),
              (this.provider = t.provider),
              (this.id = this.provider),
              (this.name =
                this.opts.name ||
                this.id
                  .split('-')
                  .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                  .join(' ')),
              (this.pluginId = this.opts.pluginId),
              (this.tokenKey = `companion-${this.pluginId}-auth-token`),
              (this.companionKeysParams = this.opts.companionKeysParams),
              (this.preAuthToken = null)
          }
          headers() {
            return Promise.all([super.headers(), this.getAuthToken()]).then(
              (e) => {
                let [t, s] = e
                const i = {}
                return (
                  s && (i['uppy-auth-token'] = s),
                  this.companionKeysParams &&
                    (i['uppy-credentials-params'] = btoa(
                      JSON.stringify({ params: this.companionKeysParams })
                    )),
                  { ...t, ...i }
                )
              }
            )
          }
          onReceiveResponse(e) {
            e = super.onReceiveResponse(e)
            const t = this.uppy.getPlugin(this.pluginId),
              s = t.getPluginState().authenticated
                ? 401 !== e.status
                : e.status < 400
            return t.setPluginState({ authenticated: s }), e
          }
          setAuthToken(e) {
            return this.uppy
              .getPlugin(this.pluginId)
              .storage.setItem(this.tokenKey, e)
          }
          getAuthToken() {
            return this.uppy
              .getPlugin(this.pluginId)
              .storage.getItem(this.tokenKey)
          }
          async ensurePreAuth() {
            if (
              this.companionKeysParams &&
              !this.preAuthToken &&
              (await this.fetchPreAuthToken(), !this.preAuthToken)
            )
              throw new Error(
                'Could not load authentication data required for third-party login. Please try again later.'
              )
          }
          authUrl(e) {
            void 0 === e && (e = {})
            const t = new URLSearchParams(e)
            return (
              this.preAuthToken && t.set('uppyPreAuthToken', this.preAuthToken),
              `${this.hostname}/${this.id}/connect?${t}`
            )
          }
          fileUrl(e) {
            return `${this.hostname}/${this.id}/get/${e}`
          }
          async fetchPreAuthToken() {
            if (this.companionKeysParams)
              try {
                const e = await this.post(`${this.id}/preauth/`, {
                  params: this.companionKeysParams,
                })
                this.preAuthToken = e.token
              } catch (e) {
                this.uppy.log(
                  `[CompanionClient] unable to fetch preAuthToken ${e}`,
                  'warning'
                )
              }
          }
          list(e) {
            return this.get(`${this.id}/list/${e || ''}`)
          }
          logout() {
            return this.get(`${this.id}/logout`)
              .then((e) =>
                Promise.all([
                  e,
                  this.uppy
                    .getPlugin(this.pluginId)
                    .storage.removeItem(this.tokenKey),
                ])
              )
              .then((e) => {
                let [t] = e
                return t
              })
          }
          static initPlugin(e, t, s) {
            if (
              ((e.type = 'acquirer'),
              (e.files = []),
              s && (e.opts = { ...s, ...t }),
              t.serverUrl || t.serverPattern)
            )
              throw new Error(
                '`serverUrl` and `serverPattern` have been renamed to `companionUrl` and `companionAllowedHosts` respectively in the 0.30.5 release. Please consult the docs (for example, https://uppy.io/docs/instagram/ for the Instagram plugin) and use the updated options.`'
              )
            if (t.companionAllowedHosts) {
              const s = t.companionAllowedHosts
              if (
                !(
                  'string' == typeof s ||
                  Array.isArray(s) ||
                  s instanceof RegExp
                )
              )
                throw new TypeError(
                  `${e.id}: the option "companionAllowedHosts" must be one of string, Array, RegExp`
                )
              e.opts.companionAllowedHosts = s
            } else
              /^(?!https?:\/\/).*$/i.test(t.companionUrl)
                ? (e.opts.companionAllowedHosts = `https://${t.companionUrl.replace(
                    /^\/\//,
                    ''
                  )}`)
                : (e.opts.companionAllowedHosts = new URL(
                    t.companionUrl
                  ).origin)
            e.storage = e.opts.storage || r
          }
        }
      },
      2368: (e, t, s) => {
        'use strict'
        var i, r, o, n, a
        function l(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var d = 0
        function p(e) {
          return '__private_' + d++ + '_' + e
        }
        const h = s(6865),
          u = s(5570),
          c = s(1220)
        async function f(e) {
          if (401 === e.status) throw new c()
          const t = e.json()
          if (e.status < 200 || e.status > 300) {
            let s = `Failed request with status: ${e.status}. ${e.statusText}`
            try {
              const e = await t
              ;(s = e.message ? `${s} message: ${e.message}` : s),
                (s = e.requestId ? `${s} request-Id: ${e.requestId}` : s)
            } finally {
              throw new Error(s)
            }
          }
          return t
        }
        function m(e) {
          return /^(https?:|)\/\//.test(e) ? e : `${this.hostname}/${e}`
        }
        function g(e, t) {
          return (s) => {
            var i
            return (
              (null != (i = s) && i.isAuthError) ||
                (s = new u(`Could not ${e} ${l(this, o)[o](t)}`, { cause: s })),
              Promise.reject(s)
            )
          }
        }
        e.exports =
          ((r = p('getPostResponseFunc')),
          (o = p('getUrl')),
          (n = p('errorHandler')),
          (a = i =
            class e {
              constructor(e, t) {
                Object.defineProperty(this, n, { value: g }),
                  Object.defineProperty(this, o, { value: m }),
                  Object.defineProperty(this, r, {
                    writable: !0,
                    value: (e) => (t) => e ? t : this.onReceiveResponse(t),
                  }),
                  (this.uppy = e),
                  (this.opts = t),
                  (this.onReceiveResponse = this.onReceiveResponse.bind(this)),
                  (this.allowedHeaders = [
                    'accept',
                    'content-type',
                    'uppy-auth-token',
                  ]),
                  (this.preflightDone = !1)
              }
              get hostname() {
                const { companion: e } = this.uppy.getState(),
                  t = this.opts.companionUrl
                return (e && e[t] ? e[t] : t).replace(/\/$/, '')
              }
              headers() {
                const t = this.opts.companionHeaders || {}
                return Promise.resolve({ ...e.defaultHeaders, ...t })
              }
              onReceiveResponse(e) {
                const t = this.uppy.getState().companion || {},
                  s = this.opts.companionUrl,
                  { headers: i } = e
                return (
                  i.has('i-am') &&
                    i.get('i-am') !== t[s] &&
                    this.uppy.setState({
                      companion: { ...t, [s]: i.get('i-am') },
                    }),
                  e
                )
              }
              preflight(e) {
                return this.preflightDone
                  ? Promise.resolve(this.allowedHeaders.slice())
                  : fetch(l(this, o)[o](e), { method: 'OPTIONS' })
                      .then(
                        (e) => (
                          e.headers.has('access-control-allow-headers') &&
                            (this.allowedHeaders = e.headers
                              .get('access-control-allow-headers')
                              .split(',')
                              .map((e) => e.trim().toLowerCase())),
                          (this.preflightDone = !0),
                          this.allowedHeaders.slice()
                        )
                      )
                      .catch(
                        (e) => (
                          this.uppy.log(
                            `[CompanionClient] unable to make preflight request ${e}`,
                            'warning'
                          ),
                          (this.preflightDone = !0),
                          this.allowedHeaders.slice()
                        )
                      )
              }
              preflightAndHeaders(e) {
                return Promise.all([this.preflight(e), this.headers()]).then(
                  (e) => {
                    let [t, s] = e
                    return (
                      Object.keys(s).forEach((e) => {
                        t.includes(e.toLowerCase()) ||
                          (this.uppy.log(
                            `[CompanionClient] excluding disallowed header ${e}`
                          ),
                          delete s[e])
                      }),
                      s
                    )
                  }
                )
              }
              get(e, t) {
                return this.preflightAndHeaders(e)
                  .then((t) =>
                    h(l(this, o)[o](e), {
                      method: 'get',
                      headers: t,
                      credentials:
                        this.opts.companionCookiesRule || 'same-origin',
                    })
                  )
                  .then(l(this, r)[r](t))
                  .then(f)
                  .catch(l(this, n)[n]('get', e))
              }
              post(e, t, s) {
                const i = 'post'
                return this.preflightAndHeaders(e)
                  .then((s) =>
                    h(l(this, o)[o](e), {
                      method: i,
                      headers: s,
                      credentials:
                        this.opts.companionCookiesRule || 'same-origin',
                      body: JSON.stringify(t),
                    })
                  )
                  .then(l(this, r)[r](s))
                  .then(f)
                  .catch(l(this, n)[n](i, e))
              }
              delete(e, t, s) {
                const i = 'delete'
                return this.preflightAndHeaders(e)
                  .then((s) =>
                    h(`${this.hostname}/${e}`, {
                      method: i,
                      headers: s,
                      credentials:
                        this.opts.companionCookiesRule || 'same-origin',
                      body: t ? JSON.stringify(t) : null,
                    })
                  )
                  .then(l(this, r)[r](s))
                  .then(f)
                  .catch(l(this, n)[n](i, e))
              }
            }),
          (i.VERSION = '2.1.0'),
          (i.defaultHeaders = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Uppy-Versions': `@uppy/companion-client=${i.VERSION}`,
          }),
          a)
      },
      3145: (e, t, s) => {
        'use strict'
        const i = s(2368)
        e.exports = class extends i {
          constructor(e, t) {
            super(e, t),
              (this.provider = t.provider),
              (this.id = this.provider),
              (this.name =
                this.opts.name ||
                this.id
                  .split('-')
                  .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                  .join(' ')),
              (this.pluginId = this.opts.pluginId)
          }
          fileUrl(e) {
            return `${this.hostname}/search/${this.id}/get/${e}`
          }
          search(e, t) {
            return (
              (t = t ? `&${t}` : ''),
              this.get(`search/${this.id}/list?q=${encodeURIComponent(e)}${t}`)
            )
          }
        }
      },
      9906: (e, t, s) => {
        var i, r, o, n, a
        let l, d
        function p(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var h = 0
        function u(e) {
          return '__private_' + h++ + '_' + e
        }
        const c = s(4800)
        e.exports =
          ((i = u('queued')),
          (r = u('emitter')),
          (o = u('isOpen')),
          (n = u('socket')),
          (a = u('handleMessage')),
          (l = Symbol.for('uppy test: getSocket')),
          (d = Symbol.for('uppy test: getQueued')),
          class {
            constructor(e) {
              Object.defineProperty(this, i, { writable: !0, value: [] }),
                Object.defineProperty(this, r, { writable: !0, value: c() }),
                Object.defineProperty(this, o, { writable: !0, value: !1 }),
                Object.defineProperty(this, n, { writable: !0, value: void 0 }),
                Object.defineProperty(this, a, {
                  writable: !0,
                  value: (e) => {
                    try {
                      const t = JSON.parse(e.data)
                      this.emit(t.action, t.payload)
                    } catch (e) {
                      console.log(e)
                    }
                  },
                }),
                (this.opts = e),
                (e && !1 === e.autoOpen) || this.open()
            }
            get isOpen() {
              return p(this, o)[o]
            }
            [l]() {
              return p(this, n)[n]
            }
            [d]() {
              return p(this, i)[i]
            }
            open() {
              ;(p(this, n)[n] = new WebSocket(this.opts.target)),
                (p(this, n)[n].onopen = () => {
                  for (
                    p(this, o)[o] = !0;
                    p(this, i)[i].length > 0 && p(this, o)[o];

                  ) {
                    const e = p(this, i)[i].shift()
                    this.send(e.action, e.payload)
                  }
                }),
                (p(this, n)[n].onclose = () => {
                  p(this, o)[o] = !1
                }),
                (p(this, n)[n].onmessage = p(this, a)[a])
            }
            close() {
              var e
              null == (e = p(this, n)[n]) || e.close()
            }
            send(e, t) {
              p(this, o)[o]
                ? p(this, n)[n].send(JSON.stringify({ action: e, payload: t }))
                : p(this, i)[i].push({ action: e, payload: t })
            }
            on(e, t) {
              p(this, r)[r].on(e, t)
            }
            emit(e, t) {
              p(this, r)[r].emit(e, t)
            }
            once(e, t) {
              p(this, r)[r].once(e, t)
            }
          })
      },
      6385: (e, t, s) => {
        'use strict'
        const i = s(2368),
          r = s(6808),
          o = s(3145),
          n = s(9906)
        e.exports = {
          RequestClient: i,
          Provider: r,
          SearchProvider: o,
          Socket: n,
        }
      },
      8871: (e) => {
        'use strict'
        ;(e.exports.setItem = (e, t) =>
          new Promise((s) => {
            localStorage.setItem(e, t), s()
          })),
          (e.exports.getItem = (e) => Promise.resolve(localStorage.getItem(e))),
          (e.exports.removeItem = (e) =>
            new Promise((t) => {
              localStorage.removeItem(e), t()
            }))
      },
      8937: (e, t, s) => {
        const i = s(3363)
        e.exports = class {
          constructor(e, t) {
            void 0 === t && (t = {}), (this.uppy = e), (this.opts = t)
          }
          getPluginState() {
            const { plugins: e } = this.uppy.getState()
            return e[this.id] || {}
          }
          setPluginState(e) {
            const { plugins: t } = this.uppy.getState()
            this.uppy.setState({
              plugins: { ...t, [this.id]: { ...t[this.id], ...e } },
            })
          }
          setOptions(e) {
            ;(this.opts = { ...this.opts, ...e }),
              this.setPluginState(),
              this.i18nInit()
          }
          i18nInit() {
            const e = new i([
              this.defaultLocale,
              this.uppy.locale,
              this.opts.locale,
            ])
            ;(this.i18n = e.translate.bind(e)),
              (this.i18nArray = e.translateArray.bind(e)),
              this.setPluginState()
          }
          addTarget() {
            throw new Error(
              "Extend the addTarget method to add your plugin to another plugin's target"
            )
          }
          install() {}
          uninstall() {}
          render() {
            throw new Error(
              'Extend the render method to add your plugin to a DOM element'
            )
          }
          update() {}
          afterUpdate() {}
        }
      },
      3e3: (e, t, s) => {
        const i = s(5158),
          r = s(4193)
        class o extends Error {
          constructor() {
            super(...arguments), (this.isRestriction = !0)
          }
        }
        'undefined' == typeof AggregateError &&
          (globalThis.AggregateError = class extends Error {
            constructor(e, t) {
              super(t), (this.errors = e)
            }
          }),
          (e.exports = {
            Restricter: class {
              constructor(e, t) {
                ;(this.i18n = t),
                  (this.getOpts = () => {
                    const t = e()
                    if (
                      null != t.restrictions.allowedFileTypes &&
                      !Array.isArray(t.restrictions.allowedFileTypes)
                    )
                      throw new TypeError(
                        '`restrictions.allowedFileTypes` must be an array'
                      )
                    return t
                  })
              }
              validate(e, t) {
                const {
                  maxFileSize: s,
                  minFileSize: n,
                  maxTotalFileSize: a,
                  maxNumberOfFiles: l,
                  allowedFileTypes: d,
                } = this.getOpts().restrictions
                if (l && t.length + 1 > l)
                  throw new o(
                    `${this.i18n('youCanOnlyUploadX', { smart_count: l })}`
                  )
                if (
                  d &&
                  !d.some((t) =>
                    t.includes('/')
                      ? !!e.type && r(e.type.replace(/;.*?$/, ''), t)
                      : !('.' !== t[0] || !e.extension) &&
                        e.extension.toLowerCase() === t.slice(1).toLowerCase()
                  )
                ) {
                  const e = d.join(', ')
                  throw new o(
                    this.i18n('youCanOnlyUploadFileTypes', { types: e })
                  )
                }
                if (
                  a &&
                  null != e.size &&
                  t.reduce((e, t) => e + t.size, e.size) > a
                )
                  throw new o(
                    this.i18n('exceedsSize', { size: i(a), file: e.name })
                  )
                if (s && null != e.size && e.size > s)
                  throw new o(
                    this.i18n('exceedsSize', { size: i(s), file: e.name })
                  )
                if (n && null != e.size && e.size < n)
                  throw new o(this.i18n('inferiorSize', { size: i(n) }))
              }
              validateMinNumberOfFiles(e) {
                const { minNumberOfFiles: t } = this.getOpts().restrictions
                if (Object.keys(e).length < t)
                  throw new o(
                    this.i18n('youHaveToAtLeastSelectX', { smart_count: t })
                  )
              }
              getMissingRequiredMetaFields(e) {
                const t = new o(
                    this.i18n('missingRequiredMetaFieldOnFile', {
                      fileName: e.name,
                    })
                  ),
                  { requiredMetaFields: s } = this.getOpts().restrictions,
                  i = Object.prototype.hasOwnProperty,
                  r = []
                for (const t of s)
                  (i.call(e.meta, t) && '' !== e.meta[t]) || r.push(t)
                return { missingFields: r, error: t }
              }
            },
            defaultOptions: {
              maxFileSize: null,
              minFileSize: null,
              maxTotalFileSize: null,
              maxNumberOfFiles: null,
              minNumberOfFiles: null,
              allowedFileTypes: null,
              requiredMetaFields: [],
            },
            RestrictionError: o,
          })
      },
      4649: (e, t, s) => {
        function i(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var r = 0
        function o(e) {
          return '__private_' + r++ + '_' + e
        }
        const { render: n } = s(6400),
          a = s(2729),
          l = s(8958),
          d = s(8937)
        var p = o('updateUI')
        class h extends d {
          constructor() {
            super(...arguments),
              Object.defineProperty(this, p, { writable: !0, value: void 0 })
          }
          mount(e, t) {
            const s = t.id,
              r = a(e)
            if (r) {
              this.isTargetDOMEl = !0
              const t = document.createElement('div')
              return (
                t.classList.add('uppy-Root'),
                (i(this, p)[p] = (function (e) {
                  let t = null,
                    s = null
                  return function () {
                    for (
                      var i = arguments.length, r = new Array(i), o = 0;
                      o < i;
                      o++
                    )
                      r[o] = arguments[o]
                    return (
                      (s = r),
                      t ||
                        (t = Promise.resolve().then(
                          () => ((t = null), e(...s))
                        )),
                      t
                    )
                  }
                })((e) => {
                  this.uppy.getPlugin(this.id) &&
                    (n(this.render(e), t), this.afterUpdate())
                })),
                this.uppy.log(`Installing ${s} to a DOM element '${e}'`),
                this.opts.replaceTargetContent && (r.innerHTML = ''),
                n(this.render(this.uppy.getState()), t),
                (this.el = t),
                r.appendChild(t),
                (t.dir = this.opts.direction || l(t) || 'ltr'),
                this.onMount(),
                this.el
              )
            }
            let o
            if ('object' == typeof e && e instanceof h) o = e
            else if ('function' == typeof e) {
              const t = e
              this.uppy.iteratePlugins((e) => {
                if (e instanceof t) return (o = e), !1
              })
            }
            if (o)
              return (
                this.uppy.log(`Installing ${s} to ${o.id}`),
                (this.parent = o),
                (this.el = o.addTarget(t)),
                this.onMount(),
                this.el
              )
            this.uppy.log(`Not installing ${s}`)
            let d = `Invalid target option given to ${s}.`
            throw (
              ((d +=
                'function' == typeof e
                  ? " The given target is not a Plugin class. Please check that you're not specifying a React Component instead of a plugin. If you are using @uppy/* packages directly, make sure you have only 1 version of @uppy/core installed: run `npm ls @uppy/core` on the command line and verify that all the versions match and are deduped correctly."
                  : 'If you meant to target an HTML element, please make sure that the element exists. Check that the <script> tag initializing Uppy is right before the closing </body> tag at the end of the page. (see https://github.com/transloadit/uppy/issues/1042)\n\nIf you meant to target a plugin, please confirm that your `import` statements or `require` calls are correct.'),
              new Error(d))
            )
          }
          update(e) {
            var t, s
            null != this.el &&
              (null == (t = (s = i(this, p))[p]) || t.call(s, e))
          }
          unmount() {
            var e
            this.isTargetDOMEl && (null == (e = this.el) || e.remove()),
              this.onUnmount()
          }
          onMount() {}
          onUnmount() {}
        }
        e.exports = h
      },
      1790: (e, t, s) => {
        'use strict'
        let i, r
        function o(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var n = 0
        function a(e) {
          return '__private_' + n++ + '_' + e
        }
        const l = s(3363),
          d = s(4800),
          { nanoid: p } = s(2961),
          h = s(3096),
          u = s(6273),
          c = s(9404),
          f = s(8744),
          m = s(8619),
          g = s(8585),
          y = s(2008),
          { justErrorsLogger: v, debugLogger: b } = s(4519),
          { Restricter: w, defaultOptions: S, RestrictionError: P } = s(3e3),
          F = s(8998)
        var _ = a('plugins'),
          C = a('restricter'),
          k = a('storeUnsubscribe'),
          T = a('emitter'),
          O = a('preProcessors'),
          x = a('uploaders'),
          A = a('postProcessors'),
          E = a('informAndEmit'),
          U = a('checkRequiredMetaFieldsOnFile'),
          D = a('checkRequiredMetaFields'),
          R = a('assertNewUploadAllowed'),
          I = a('checkAndCreateFileStateObject'),
          N = a('startIfAutoProceed'),
          B = a('addListeners'),
          M = a('updateOnlineStatus'),
          L = a('createUpload'),
          j = a('getUpload'),
          z = a('removeUpload'),
          $ = a('runUpload')
        ;(i = Symbol.for('uppy test: getPlugins')),
          (r = Symbol.for('uppy test: createUpload'))
        class q {
          constructor(e) {
            Object.defineProperty(this, $, { value: ee }),
              Object.defineProperty(this, z, { value: Z }),
              Object.defineProperty(this, j, { value: J }),
              Object.defineProperty(this, L, { value: Q }),
              Object.defineProperty(this, B, { value: Y }),
              Object.defineProperty(this, N, { value: X }),
              Object.defineProperty(this, I, { value: K }),
              Object.defineProperty(this, R, { value: G }),
              Object.defineProperty(this, D, { value: W }),
              Object.defineProperty(this, U, { value: H }),
              Object.defineProperty(this, E, { value: V }),
              Object.defineProperty(this, _, {
                writable: !0,
                value: Object.create(null),
              }),
              Object.defineProperty(this, C, { writable: !0, value: void 0 }),
              Object.defineProperty(this, k, { writable: !0, value: void 0 }),
              Object.defineProperty(this, T, { writable: !0, value: d() }),
              Object.defineProperty(this, O, {
                writable: !0,
                value: new Set(),
              }),
              Object.defineProperty(this, x, {
                writable: !0,
                value: new Set(),
              }),
              Object.defineProperty(this, A, {
                writable: !0,
                value: new Set(),
              }),
              Object.defineProperty(this, M, {
                writable: !0,
                value: this.updateOnlineStatus.bind(this),
              }),
              (this.defaultLocale = F)
            const t = {
              id: 'uppy',
              autoProceed: !1,
              allowMultipleUploads: !0,
              allowMultipleUploadBatches: !0,
              debug: !1,
              restrictions: S,
              meta: {},
              onBeforeFileAdded: (e) => e,
              onBeforeUpload: (e) => e,
              store: u(),
              logger: v,
              infoTimeout: 5e3,
            }
            ;(this.opts = {
              ...t,
              ...e,
              restrictions: { ...t.restrictions, ...(e && e.restrictions) },
            }),
              e && e.logger && e.debug
                ? this.log(
                    'You are using a custom `logger`, but also set `debug: true`, which uses built-in logger to output logs to console. Ignoring `debug: true` and using your custom `logger`.',
                    'warning'
                  )
                : e && e.debug && (this.opts.logger = b),
              this.log(`Using Core v${this.constructor.VERSION}`),
              this.i18nInit(),
              (this.calculateProgress = h(
                this.calculateProgress.bind(this),
                500,
                { leading: !0, trailing: !0 }
              )),
              (this.store = this.opts.store),
              this.setState({
                plugins: {},
                files: {},
                currentUploads: {},
                allowNewUpload: !0,
                capabilities: {
                  uploadProgress: g(),
                  individualCancellation: !0,
                  resumableUploads: !1,
                },
                totalProgress: 0,
                meta: { ...this.opts.meta },
                info: [],
                recoveredState: null,
              }),
              (o(this, C)[C] = new w(() => this.opts, this.i18n)),
              (o(this, k)[k] = this.store.subscribe((e, t, s) => {
                this.emit('state-update', e, t, s), this.updateAll(t)
              })),
              this.opts.debug &&
                'undefined' != typeof window &&
                (window[this.opts.id] = this),
              o(this, B)[B]()
          }
          emit(e) {
            for (
              var t = arguments.length, s = new Array(t > 1 ? t - 1 : 0), i = 1;
              i < t;
              i++
            )
              s[i - 1] = arguments[i]
            o(this, T)[T].emit(e, ...s)
          }
          on(e, t) {
            return o(this, T)[T].on(e, t), this
          }
          once(e, t) {
            return o(this, T)[T].once(e, t), this
          }
          off(e, t) {
            return o(this, T)[T].off(e, t), this
          }
          updateAll(e) {
            this.iteratePlugins((t) => {
              t.update(e)
            })
          }
          setState(e) {
            this.store.setState(e)
          }
          getState() {
            return this.store.getState()
          }
          get state() {
            return this.getState()
          }
          setFileState(e, t) {
            if (!this.getState().files[e])
              throw new Error(
                `Can’t set state for ${e} (the file could have been removed)`
              )
            this.setState({
              files: {
                ...this.getState().files,
                [e]: { ...this.getState().files[e], ...t },
              },
            })
          }
          i18nInit() {
            const e = new l([this.defaultLocale, this.opts.locale])
            ;(this.i18n = e.translate.bind(e)),
              (this.i18nArray = e.translateArray.bind(e)),
              (this.locale = e.locale)
          }
          setOptions(e) {
            ;(this.opts = {
              ...this.opts,
              ...e,
              restrictions: {
                ...this.opts.restrictions,
                ...(e && e.restrictions),
              },
            }),
              e.meta && this.setMeta(e.meta),
              this.i18nInit(),
              e.locale &&
                this.iteratePlugins((e) => {
                  e.setOptions()
                }),
              this.setState()
          }
          resetProgress() {
            const e = {
                percentage: 0,
                bytesUploaded: 0,
                uploadComplete: !1,
                uploadStarted: null,
              },
              t = { ...this.getState().files },
              s = {}
            Object.keys(t).forEach((i) => {
              const r = { ...t[i] }
              ;(r.progress = { ...r.progress, ...e }), (s[i] = r)
            }),
              this.setState({ files: s, totalProgress: 0 }),
              this.emit('reset-progress')
          }
          addPreProcessor(e) {
            o(this, O)[O].add(e)
          }
          removePreProcessor(e) {
            return o(this, O)[O].delete(e)
          }
          addPostProcessor(e) {
            o(this, A)[A].add(e)
          }
          removePostProcessor(e) {
            return o(this, A)[A].delete(e)
          }
          addUploader(e) {
            o(this, x)[x].add(e)
          }
          removeUploader(e) {
            return o(this, x)[x].delete(e)
          }
          setMeta(e) {
            const t = { ...this.getState().meta, ...e },
              s = { ...this.getState().files }
            Object.keys(s).forEach((t) => {
              s[t] = { ...s[t], meta: { ...s[t].meta, ...e } }
            }),
              this.log('Adding metadata:'),
              this.log(e),
              this.setState({ meta: t, files: s })
          }
          setFileMeta(e, t) {
            const s = { ...this.getState().files }
            if (!s[e])
              return void this.log(
                'Was trying to set metadata for a file that has been removed: ',
                e
              )
            const i = { ...s[e].meta, ...t }
            ;(s[e] = { ...s[e], meta: i }), this.setState({ files: s })
          }
          getFile(e) {
            return this.getState().files[e]
          }
          getFiles() {
            const { files: e } = this.getState()
            return Object.values(e)
          }
          getObjectOfFilesPerState() {
            const { files: e, totalProgress: t, error: s } = this.getState(),
              i = Object.values(e),
              r = i.filter((e) => {
                let { progress: t } = e
                return !t.uploadComplete && t.uploadStarted
              }),
              o = i.filter((e) => !e.progress.uploadStarted),
              n = i.filter(
                (e) =>
                  e.progress.uploadStarted ||
                  e.progress.preprocess ||
                  e.progress.postprocess
              ),
              a = i.filter((e) => e.progress.uploadStarted),
              l = i.filter((e) => e.isPaused),
              d = i.filter((e) => e.progress.uploadComplete),
              p = i.filter((e) => e.error),
              h = r.filter((e) => !e.isPaused),
              u = i.filter(
                (e) => e.progress.preprocess || e.progress.postprocess
              )
            return {
              newFiles: o,
              startedFiles: n,
              uploadStartedFiles: a,
              pausedFiles: l,
              completeFiles: d,
              erroredFiles: p,
              inProgressFiles: r,
              inProgressNotPausedFiles: h,
              processingFiles: u,
              isUploadStarted: a.length > 0,
              isAllComplete:
                100 === t && d.length === i.length && 0 === u.length,
              isAllErrored: !!s && p.length === i.length,
              isAllPaused: 0 !== r.length && l.length === r.length,
              isUploadInProgress: r.length > 0,
              isSomeGhost: i.some((e) => e.isGhost),
            }
          }
          validateRestrictions(e, t) {
            void 0 === t && (t = this.getFiles())
            try {
              return o(this, C)[C].validate(e, t), { result: !0 }
            } catch (e) {
              return { result: !1, reason: e.message }
            }
          }
          checkIfFileAlreadyExists(e) {
            const { files: t } = this.getState()
            return !(!t[e] || t[e].isGhost)
          }
          addFile(e) {
            o(this, R)[R](e)
            const { files: t } = this.getState()
            let s = o(this, I)[I](t, e)
            return (
              t[s.id] &&
                t[s.id].isGhost &&
                ((s = { ...t[s.id], data: e.data, isGhost: !1 }),
                this.log(
                  `Replaced the blob in the restored ghost file: ${s.name}, ${s.id}`
                )),
              this.setState({ files: { ...t, [s.id]: s } }),
              this.emit('file-added', s),
              this.emit('files-added', [s]),
              this.log(`Added file: ${s.name}, ${s.id}, mime type: ${s.type}`),
              o(this, N)[N](),
              s.id
            )
          }
          addFiles(e) {
            o(this, R)[R]()
            const t = { ...this.getState().files },
              s = [],
              i = []
            for (let r = 0; r < e.length; r++)
              try {
                let i = o(this, I)[I](t, e[r])
                t[i.id] &&
                  t[i.id].isGhost &&
                  ((i = { ...t[i.id], data: e[r].data, isGhost: !1 }),
                  this.log(
                    `Replaced blob in a ghost file: ${i.name}, ${i.id}`
                  )),
                  (t[i.id] = i),
                  s.push(i)
              } catch (e) {
                e.isRestriction || i.push(e)
              }
            if (
              (this.setState({ files: t }),
              s.forEach((e) => {
                this.emit('file-added', e)
              }),
              this.emit('files-added', s),
              s.length > 5
                ? this.log(`Added batch of ${s.length} files`)
                : Object.keys(s).forEach((e) => {
                    this.log(
                      `Added file: ${s[e].name}\n id: ${s[e].id}\n type: ${s[e].type}`
                    )
                  }),
              s.length > 0 && o(this, N)[N](),
              i.length > 0)
            ) {
              let e = 'Multiple errors occurred while adding files:\n'
              if (
                (i.forEach((t) => {
                  e += `\n * ${t.message}`
                }),
                this.info(
                  {
                    message: this.i18n('addBulkFilesFailed', {
                      smart_count: i.length,
                    }),
                    details: e,
                  },
                  'error',
                  this.opts.infoTimeout
                ),
                'function' == typeof AggregateError)
              )
                throw new AggregateError(i, e)
              {
                const t = new Error(e)
                throw ((t.errors = i), t)
              }
            }
          }
          removeFiles(e, t) {
            const { files: s, currentUploads: i } = this.getState(),
              r = { ...s },
              o = { ...i },
              n = Object.create(null)
            function a(e) {
              return void 0 === n[e]
            }
            e.forEach((e) => {
              s[e] && ((n[e] = s[e]), delete r[e])
            }),
              Object.keys(o).forEach((e) => {
                const t = i[e].fileIDs.filter(a)
                0 !== t.length ? (o[e] = { ...i[e], fileIDs: t }) : delete o[e]
              })
            const l = { currentUploads: o, files: r }
            0 === Object.keys(r).length &&
              ((l.allowNewUpload = !0),
              (l.error = null),
              (l.recoveredState = null)),
              this.setState(l),
              this.calculateTotalProgress()
            const d = Object.keys(n)
            d.forEach((e) => {
              this.emit('file-removed', n[e], t)
            }),
              d.length > 5
                ? this.log(`Removed ${d.length} files`)
                : this.log(`Removed files: ${d.join(', ')}`)
          }
          removeFile(e, t) {
            void 0 === t && (t = null), this.removeFiles([e], t)
          }
          pauseResume(e) {
            if (
              !this.getState().capabilities.resumableUploads ||
              this.getFile(e).uploadComplete
            )
              return
            const t = !this.getFile(e).isPaused
            return (
              this.setFileState(e, { isPaused: t }),
              this.emit('upload-pause', e, t),
              t
            )
          }
          pauseAll() {
            const e = { ...this.getState().files }
            Object.keys(e)
              .filter(
                (t) =>
                  !e[t].progress.uploadComplete && e[t].progress.uploadStarted
              )
              .forEach((t) => {
                const s = { ...e[t], isPaused: !0 }
                e[t] = s
              }),
              this.setState({ files: e }),
              this.emit('pause-all')
          }
          resumeAll() {
            const e = { ...this.getState().files }
            Object.keys(e)
              .filter(
                (t) =>
                  !e[t].progress.uploadComplete && e[t].progress.uploadStarted
              )
              .forEach((t) => {
                const s = { ...e[t], isPaused: !1, error: null }
                e[t] = s
              }),
              this.setState({ files: e }),
              this.emit('resume-all')
          }
          retryAll() {
            const e = { ...this.getState().files },
              t = Object.keys(e).filter((t) => e[t].error)
            if (
              (t.forEach((t) => {
                const s = { ...e[t], isPaused: !1, error: null }
                e[t] = s
              }),
              this.setState({ files: e, error: null }),
              this.emit('retry-all', t),
              0 === t.length)
            )
              return Promise.resolve({ successful: [], failed: [] })
            const s = o(this, L)[L](t, { forceAllowNewUpload: !0 })
            return o(this, $)[$](s)
          }
          cancelAll(e) {
            let { reason: t = 'user' } = void 0 === e ? {} : e
            if ((this.emit('cancel-all', { reason: t }), 'user' === t)) {
              const { files: e } = this.getState(),
                t = Object.keys(e)
              t.length && this.removeFiles(t, 'cancel-all'),
                this.setState({
                  totalProgress: 0,
                  error: null,
                  recoveredState: null,
                })
            }
          }
          retryUpload(e) {
            this.setFileState(e, { error: null, isPaused: !1 }),
              this.emit('upload-retry', e)
            const t = o(this, L)[L]([e], { forceAllowNewUpload: !0 })
            return o(this, $)[$](t)
          }
          reset() {
            this.cancelAll(...arguments)
          }
          logout() {
            this.iteratePlugins((e) => {
              e.provider && e.provider.logout && e.provider.logout()
            })
          }
          calculateProgress(e, t) {
            if (null == e || !this.getFile(e.id))
              return void this.log(
                `Not setting progress for a file that has been removed: ${
                  null == e ? void 0 : e.id
                }`
              )
            const s = Number.isFinite(t.bytesTotal) && t.bytesTotal > 0
            this.setFileState(e.id, {
              progress: {
                ...this.getFile(e.id).progress,
                bytesUploaded: t.bytesUploaded,
                bytesTotal: t.bytesTotal,
                percentage: s
                  ? Math.round((t.bytesUploaded / t.bytesTotal) * 100)
                  : 0,
              },
            }),
              this.calculateTotalProgress()
          }
          calculateTotalProgress() {
            const e = this.getFiles().filter(
              (e) =>
                e.progress.uploadStarted ||
                e.progress.preprocess ||
                e.progress.postprocess
            )
            if (0 === e.length)
              return (
                this.emit('progress', 0),
                void this.setState({ totalProgress: 0 })
              )
            const t = e.filter((e) => null != e.progress.bytesTotal),
              s = e.filter((e) => null == e.progress.bytesTotal)
            if (0 === t.length) {
              const t = 100 * e.length,
                i = s.reduce((e, t) => e + t.progress.percentage, 0),
                r = Math.round((i / t) * 100)
              return void this.setState({ totalProgress: r })
            }
            let i = t.reduce((e, t) => e + t.progress.bytesTotal, 0)
            const r = i / t.length
            i += r * s.length
            let o = 0
            t.forEach((e) => {
              o += e.progress.bytesUploaded
            }),
              s.forEach((e) => {
                o += (r * (e.progress.percentage || 0)) / 100
              })
            let n = 0 === i ? 0 : Math.round((o / i) * 100)
            n > 100 && (n = 100),
              this.setState({ totalProgress: n }),
              this.emit('progress', n)
          }
          updateOnlineStatus() {
            void 0 === window.navigator.onLine || window.navigator.onLine
              ? (this.emit('is-online'),
                this.wasOffline &&
                  (this.emit('back-online'),
                  this.info(this.i18n('connectedToInternet'), 'success', 3e3),
                  (this.wasOffline = !1)))
              : (this.emit('is-offline'),
                this.info(this.i18n('noInternetConnection'), 'error', 0),
                (this.wasOffline = !0))
          }
          getID() {
            return this.opts.id
          }
          use(e, t) {
            if ('function' != typeof e)
              throw new TypeError(
                `Expected a plugin class, but got ${
                  null === e ? 'null' : typeof e
                }. Please verify that the plugin was imported and spelled correctly.`
              )
            const s = new e(this, t),
              i = s.id
            if (!i) throw new Error('Your plugin must have an id')
            if (!s.type) throw new Error('Your plugin must have a type')
            const r = this.getPlugin(i)
            if (r) {
              const e = `Already found a plugin named '${r.id}'. Tried to use: '${i}'.\nUppy plugins must have unique \`id\` options. See https://uppy.io/docs/plugins/#id.`
              throw new Error(e)
            }
            return (
              e.VERSION && this.log(`Using ${i} v${e.VERSION}`),
              s.type in o(this, _)[_]
                ? o(this, _)[_][s.type].push(s)
                : (o(this, _)[_][s.type] = [s]),
              s.install(),
              this
            )
          }
          getPlugin(e) {
            for (const t of Object.values(o(this, _)[_])) {
              const s = t.find((t) => t.id === e)
              if (null != s) return s
            }
          }
          [i](e) {
            return o(this, _)[_][e]
          }
          iteratePlugins(e) {
            Object.values(o(this, _)[_]).flat(1).forEach(e)
          }
          removePlugin(e) {
            this.log(`Removing plugin ${e.id}`),
              this.emit('plugin-remove', e),
              e.uninstall && e.uninstall()
            const t = o(this, _)[_][e.type],
              s = t.findIndex((t) => t.id === e.id)
            ;-1 !== s && t.splice(s, 1)
            const i = {
              plugins: { ...this.getState().plugins, [e.id]: void 0 },
            }
            this.setState(i)
          }
          close(e) {
            let { reason: t } = void 0 === e ? {} : e
            this.log(
              `Closing Uppy instance ${this.opts.id}: removing all files and uninstalling plugins`
            ),
              this.cancelAll({ reason: t }),
              o(this, k)[k](),
              this.iteratePlugins((e) => {
                this.removePlugin(e)
              }),
              'undefined' != typeof window &&
                window.removeEventListener &&
                (window.removeEventListener('online', o(this, M)[M]),
                window.removeEventListener('offline', o(this, M)[M]))
          }
          hideInfo() {
            const { info: e } = this.getState()
            this.setState({ info: e.slice(1) }), this.emit('info-hidden')
          }
          info(e, t, s) {
            void 0 === t && (t = 'info'), void 0 === s && (s = 3e3)
            const i = 'object' == typeof e
            this.setState({
              info: [
                ...this.getState().info,
                {
                  type: t,
                  message: i ? e.message : e,
                  details: i ? e.details : null,
                },
              ],
            }),
              setTimeout(() => this.hideInfo(), s),
              this.emit('info-visible')
          }
          log(e, t) {
            const { logger: s } = this.opts
            switch (t) {
              case 'error':
                s.error(e)
                break
              case 'warning':
                s.warn(e)
                break
              default:
                s.debug(e)
            }
          }
          restore(e) {
            return (
              this.log(`Core: attempting to restore upload "${e}"`),
              this.getState().currentUploads[e]
                ? o(this, $)[$](e)
                : (o(this, z)[z](e),
                  Promise.reject(new Error('Nonexistent upload')))
            )
          }
          [r]() {
            return o(this, L)[L](...arguments)
          }
          addResultData(e, t) {
            if (!o(this, j)[j](e))
              return void this.log(
                `Not setting result for an upload that has been removed: ${e}`
              )
            const { currentUploads: s } = this.getState(),
              i = { ...s[e], result: { ...s[e].result, ...t } }
            this.setState({ currentUploads: { ...s, [e]: i } })
          }
          upload() {
            var e
            ;(null != (e = o(this, _)[_].uploader) && e.length) ||
              this.log('No uploader type plugins are used', 'warning')
            let { files: t } = this.getState()
            const s = this.opts.onBeforeUpload(t)
            return !1 === s
              ? Promise.reject(
                  new Error(
                    'Not starting the upload because onBeforeUpload returned false'
                  )
                )
              : (s &&
                  'object' == typeof s &&
                  ((t = s), this.setState({ files: t })),
                Promise.resolve()
                  .then(() => o(this, C)[C].validateMinNumberOfFiles(t))
                  .catch((e) => {
                    throw (o(this, E)[E](e), e)
                  })
                  .then(() => {
                    if (!o(this, D)[D](t))
                      throw new P(this.i18n('missingRequiredMetaField'))
                  })
                  .catch((e) => {
                    throw e
                  })
                  .then(() => {
                    const { currentUploads: e } = this.getState(),
                      s = Object.values(e).flatMap((e) => e.fileIDs),
                      i = []
                    Object.keys(t).forEach((e) => {
                      const t = this.getFile(e)
                      t.progress.uploadStarted ||
                        -1 !== s.indexOf(e) ||
                        i.push(t.id)
                    })
                    const r = o(this, L)[L](i)
                    return o(this, $)[$](r)
                  })
                  .catch((e) => {
                    throw (this.emit('error', e), this.log(e, 'error'), e)
                  }))
          }
        }
        function V(e, t) {
          const { message: s, details: i = '' } = e
          e.isRestriction
            ? this.emit('restriction-failed', t, e)
            : this.emit('error', e),
            this.info(
              { message: s, details: i },
              'error',
              this.opts.infoTimeout
            ),
            this.log(`${s} ${i}`.trim(), 'error')
        }
        function H(e) {
          const { missingFields: t, error: s } = o(this, C)[
            C
          ].getMissingRequiredMetaFields(e)
          return !(
            t.length > 0 &&
            (this.setFileState(e.id, { missingRequiredMetaFields: t }),
            this.log(s.message),
            this.emit('restriction-failed', e, s),
            1)
          )
        }
        function W(e) {
          let t = !0
          for (const s of Object.values(e)) o(this, U)[U](s) || (t = !1)
          return t
        }
        function G(e) {
          const { allowNewUpload: t } = this.getState()
          if (!1 === t) {
            const t = new P(this.i18n('noMoreFilesAllowed'))
            throw (o(this, E)[E](t, e), t)
          }
        }
        function K(e, t) {
          const s = c(t),
            i = y(s, t),
            r = f(i).extension,
            n = Boolean(t.isRemote),
            a = m({ ...t, type: s })
          if (this.checkIfFileAlreadyExists(a)) {
            const e = new P(this.i18n('noDuplicates', { fileName: i }))
            throw (o(this, E)[E](e, t), e)
          }
          const l = t.meta || {}
          ;(l.name = i), (l.type = s)
          const d = Number.isFinite(t.data.size) ? t.data.size : null
          let p = {
            source: t.source || '',
            id: a,
            name: i,
            extension: r || '',
            meta: { ...this.getState().meta, ...l },
            type: s,
            data: t.data,
            progress: {
              percentage: 0,
              bytesUploaded: 0,
              bytesTotal: d,
              uploadComplete: !1,
              uploadStarted: null,
            },
            size: d,
            isRemote: n,
            remote: t.remote || '',
            preview: t.preview,
          }
          const h = this.opts.onBeforeFileAdded(p, e)
          if (!1 === h) {
            const e = new P(
              'Cannot add the file because onBeforeFileAdded returned false.'
            )
            throw (this.emit('restriction-failed', t, e), e)
          }
          'object' == typeof h && null !== h && (p = h)
          try {
            const t = Object.keys(e).map((t) => e[t])
            o(this, C)[C].validate(p, t)
          } catch (e) {
            throw (o(this, E)[E](e, p), e)
          }
          return p
        }
        function X() {
          this.opts.autoProceed &&
            !this.scheduledAutoProceed &&
            (this.scheduledAutoProceed = setTimeout(() => {
              ;(this.scheduledAutoProceed = null),
                this.upload().catch((e) => {
                  e.isRestriction || this.log(e.stack || e.message || e)
                })
            }, 4))
        }
        function Y() {
          const e = (e, t, s) => {
            let i = e.message || 'Unknown error'
            e.details && (i += ` ${e.details}`),
              this.setState({ error: i }),
              null != t &&
                t.id in this.getState().files &&
                this.setFileState(t.id, { error: i, response: s })
          }
          this.on('error', e),
            this.on('upload-error', (t, s, i) => {
              if ((e(s, t, i), 'object' == typeof s && s.message)) {
                const e = new Error(s.message)
                ;(e.details = s.message),
                  s.details && (e.details += ` ${s.details}`),
                  (e.message = this.i18n('failedToUpload', { file: t.name })),
                  o(this, E)[E](e)
              } else o(this, E)[E](s)
            }),
            this.on('upload', () => {
              this.setState({ error: null })
            }),
            this.on('upload-started', (e) => {
              null != e && this.getFile(e.id)
                ? this.setFileState(e.id, {
                    progress: {
                      uploadStarted: Date.now(),
                      uploadComplete: !1,
                      percentage: 0,
                      bytesUploaded: 0,
                      bytesTotal: e.size,
                    },
                  })
                : this.log(
                    `Not setting progress for a file that has been removed: ${
                      null == e ? void 0 : e.id
                    }`
                  )
            }),
            this.on('upload-progress', this.calculateProgress),
            this.on('upload-success', (e, t) => {
              if (null == e || !this.getFile(e.id))
                return void this.log(
                  `Not setting progress for a file that has been removed: ${
                    null == e ? void 0 : e.id
                  }`
                )
              const s = this.getFile(e.id).progress
              this.setFileState(e.id, {
                progress: {
                  ...s,
                  postprocess:
                    o(this, A)[A].size > 0 ? { mode: 'indeterminate' } : null,
                  uploadComplete: !0,
                  percentage: 100,
                  bytesUploaded: s.bytesTotal,
                },
                response: t,
                uploadURL: t.uploadURL,
                isPaused: !1,
              }),
                null == e.size &&
                  this.setFileState(e.id, {
                    size: t.bytesUploaded || s.bytesTotal,
                  }),
                this.calculateTotalProgress()
            }),
            this.on('preprocess-progress', (e, t) => {
              null != e && this.getFile(e.id)
                ? this.setFileState(e.id, {
                    progress: { ...this.getFile(e.id).progress, preprocess: t },
                  })
                : this.log(
                    `Not setting progress for a file that has been removed: ${
                      null == e ? void 0 : e.id
                    }`
                  )
            }),
            this.on('preprocess-complete', (e) => {
              if (null == e || !this.getFile(e.id))
                return void this.log(
                  `Not setting progress for a file that has been removed: ${
                    null == e ? void 0 : e.id
                  }`
                )
              const t = { ...this.getState().files }
              ;(t[e.id] = { ...t[e.id], progress: { ...t[e.id].progress } }),
                delete t[e.id].progress.preprocess,
                this.setState({ files: t })
            }),
            this.on('postprocess-progress', (e, t) => {
              null != e && this.getFile(e.id)
                ? this.setFileState(e.id, {
                    progress: {
                      ...this.getState().files[e.id].progress,
                      postprocess: t,
                    },
                  })
                : this.log(
                    `Not setting progress for a file that has been removed: ${
                      null == e ? void 0 : e.id
                    }`
                  )
            }),
            this.on('postprocess-complete', (e) => {
              if (null == e || !this.getFile(e.id))
                return void this.log(
                  `Not setting progress for a file that has been removed: ${
                    null == e ? void 0 : e.id
                  }`
                )
              const t = { ...this.getState().files }
              ;(t[e.id] = { ...t[e.id], progress: { ...t[e.id].progress } }),
                delete t[e.id].progress.postprocess,
                this.setState({ files: t })
            }),
            this.on('restored', () => {
              this.calculateTotalProgress()
            }),
            this.on('dashboard:file-edit-complete', (e) => {
              e && o(this, U)[U](e)
            }),
            'undefined' != typeof window &&
              window.addEventListener &&
              (window.addEventListener('online', o(this, M)[M]),
              window.addEventListener('offline', o(this, M)[M]),
              setTimeout(o(this, M)[M], 3e3))
        }
        function Q(e, t) {
          void 0 === t && (t = {})
          const { forceAllowNewUpload: s = !1 } = t,
            { allowNewUpload: i, currentUploads: r } = this.getState()
          if (!i && !s)
            throw new Error('Cannot create a new upload: already uploading.')
          const o = p()
          return (
            this.emit('upload', { id: o, fileIDs: e }),
            this.setState({
              allowNewUpload:
                !1 !== this.opts.allowMultipleUploadBatches &&
                !1 !== this.opts.allowMultipleUploads,
              currentUploads: {
                ...r,
                [o]: { fileIDs: e, step: 0, result: {} },
              },
            }),
            o
          )
        }
        function J(e) {
          const { currentUploads: t } = this.getState()
          return t[e]
        }
        function Z(e) {
          const t = { ...this.getState().currentUploads }
          delete t[e], this.setState({ currentUploads: t })
        }
        async function ee(e) {
          let { currentUploads: t } = this.getState(),
            s = t[e]
          const i = s.step || 0,
            r = [...o(this, O)[O], ...o(this, x)[x], ...o(this, A)[A]]
          try {
            for (let o = i; o < r.length && s; o++) {
              const i = r[o],
                n = { ...s, step: o }
              this.setState({ currentUploads: { ...t, [e]: n } }),
                await i(n.fileIDs, e),
                (t = this.getState().currentUploads),
                (s = t[e])
            }
          } catch (t) {
            throw (o(this, z)[z](e), t)
          }
          if (s) {
            s.fileIDs.forEach((e) => {
              const t = this.getFile(e)
              t &&
                t.progress.postprocess &&
                this.emit('postprocess-complete', t)
            })
            const i = s.fileIDs.map((e) => this.getFile(e)),
              r = i.filter((e) => !e.error),
              o = i.filter((e) => e.error)
            await this.addResultData(e, {
              successful: r,
              failed: o,
              uploadID: e,
            }),
              (t = this.getState().currentUploads),
              (s = t[e])
          }
          let n
          return (
            s && ((n = s.result), this.emit('complete', n), o(this, z)[z](e)),
            null == n &&
              this.log(
                `Not setting result for an upload that has been removed: ${e}`
              ),
            n
          )
        }
        ;(q.VERSION = '2.2.0'), (e.exports = q)
      },
      2008: (e) => {
        e.exports = function (e, t) {
          return t.name
            ? t.name
            : 'image' === e.split('/')[0]
            ? `${e.split('/')[0]}.${e.split('/')[1]}`
            : 'noname'
        }
      },
      9429: (e, t, s) => {
        'use strict'
        const i = s(1790),
          r = s(4649),
          o = s(8937),
          { debugLogger: n } = s(4519)
        ;(e.exports = i),
          (e.exports.Uppy = i),
          (e.exports.UIPlugin = r),
          (e.exports.BasePlugin = o),
          (e.exports.debugLogger = n)
      },
      8998: (e) => {
        e.exports = {
          strings: {
            addBulkFilesFailed: {
              0: 'Failed to add %{smart_count} file due to an internal error',
              1: 'Failed to add %{smart_count} files due to internal errors',
            },
            youCanOnlyUploadX: {
              0: 'You can only upload %{smart_count} file',
              1: 'You can only upload %{smart_count} files',
            },
            youHaveToAtLeastSelectX: {
              0: 'You have to select at least %{smart_count} file',
              1: 'You have to select at least %{smart_count} files',
            },
            exceedsSize: '%{file} exceeds maximum allowed size of %{size}',
            missingRequiredMetaField: 'Missing required meta fields',
            missingRequiredMetaFieldOnFile:
              'Missing required meta fields in %{fileName}',
            inferiorSize:
              'This file is smaller than the allowed size of %{size}',
            youCanOnlyUploadFileTypes: 'You can only upload: %{types}',
            noMoreFilesAllowed: 'Cannot add more files',
            noDuplicates:
              "Cannot add the duplicate file '%{fileName}', it already exists",
            companionError: 'Connection with Companion failed',
            authAborted: 'Authentication aborted',
            companionUnauthorizeHint:
              'To unauthorize to your %{provider} account, please go to %{url}',
            failedToUpload: 'Failed to upload %{file}',
            noInternetConnection: 'No Internet connection',
            connectedToInternet: 'Connected to the Internet',
            noFilesFound: 'You have no files or folders here',
            selectX: { 0: 'Select %{smart_count}', 1: 'Select %{smart_count}' },
            allFilesFromFolderNamed: 'All files from folder %{name}',
            openFolderNamed: 'Open folder %{name}',
            cancel: 'Cancel',
            logOut: 'Log out',
            filter: 'Filter',
            resetFilter: 'Reset filter',
            loading: 'Loading...',
            authenticateWithTitle:
              'Please authenticate with %{pluginName} to select files',
            authenticateWith: 'Connect to %{pluginName}',
            signInWithGoogle: 'Sign in with Google',
            searchImages: 'Search for images',
            enterTextToSearch: 'Enter text to search for images',
            search: 'Search',
            emptyFolderAdded: 'No files were added from empty folder',
            folderAlreadyAdded: 'The folder "%{folder}" was already added',
            folderAdded: {
              0: 'Added %{smart_count} file from %{folder}',
              1: 'Added %{smart_count} files from %{folder}',
            },
          },
        }
      },
      4519: (e, t, s) => {
        const i = s(6770),
          r = {
            debug: () => {},
            warn: () => {},
            error: function () {
              for (
                var e = arguments.length, t = new Array(e), s = 0;
                s < e;
                s++
              )
                t[s] = arguments[s]
              return console.error(`[Uppy] [${i()}]`, ...t)
            },
          },
          o = {
            debug: function () {
              for (
                var e = arguments.length, t = new Array(e), s = 0;
                s < e;
                s++
              )
                t[s] = arguments[s]
              return console.debug(`[Uppy] [${i()}]`, ...t)
            },
            warn: function () {
              for (
                var e = arguments.length, t = new Array(e), s = 0;
                s < e;
                s++
              )
                t[s] = arguments[s]
              return console.warn(`[Uppy] [${i()}]`, ...t)
            },
            error: function () {
              for (
                var e = arguments.length, t = new Array(e), s = 0;
                s < e;
                s++
              )
                t[s] = arguments[s]
              return console.error(`[Uppy] [${i()}]`, ...t)
            },
          }
        e.exports = { justErrorsLogger: r, debugLogger: o }
      },
      8585: (e) => {
        e.exports = function (e) {
          if (
            (null == e &&
              (e =
                'undefined' != typeof navigator ? navigator.userAgent : null),
            !e)
          )
            return !0
          const t = /Edge\/(\d+\.\d+)/.exec(e)
          if (!t) return !0
          const s = t[1]
          let [i, r] = s.split('.')
          return (
            (i = parseInt(i, 10)),
            (r = parseInt(r, 10)),
            i < 15 ||
              (15 === i && r < 15063) ||
              i > 18 ||
              (18 === i && r >= 18218)
          )
        }
      },
      6052: (e, t, s) => {
        let i
        const { h: r, Component: o } = s(6400)
        ;(i = Symbol.for('uppy test: disable unused locale key warning')),
          (e.exports = class extends o {
            constructor() {
              super(...arguments),
                (this.triggerFileInputClick = () => {
                  this.fileInput.click()
                }),
                (this.triggerFolderInputClick = () => {
                  this.folderInput.click()
                }),
                (this.onFileInputChange = (e) => {
                  this.props.handleInputChange(e), (e.target.value = null)
                }),
                (this.renderHiddenInput = (e, t) =>
                  r('input', {
                    className: 'uppy-Dashboard-input',
                    hidden: !0,
                    'aria-hidden': 'true',
                    tabIndex: -1,
                    webkitdirectory: e,
                    type: 'file',
                    name: 'files[]',
                    multiple: 1 !== this.props.maxNumberOfFiles,
                    onChange: this.onFileInputChange,
                    accept: this.props.allowedFileTypes,
                    ref: t,
                  })),
                (this.renderMyDeviceAcquirer = () =>
                  r(
                    'div',
                    {
                      className: 'uppy-DashboardTab',
                      role: 'presentation',
                      'data-uppy-acquirer-id': 'MyDevice',
                    },
                    r(
                      'button',
                      {
                        type: 'button',
                        className:
                          'uppy-u-reset uppy-c-btn uppy-DashboardTab-btn',
                        role: 'tab',
                        tabIndex: 0,
                        'data-uppy-super-focusable': !0,
                        onClick: this.triggerFileInputClick,
                      },
                      r(
                        'svg',
                        {
                          'aria-hidden': 'true',
                          focusable: 'false',
                          width: '32',
                          height: '32',
                          viewBox: '0 0 32 32',
                        },
                        r(
                          'g',
                          { fill: 'none', fillRule: 'evenodd' },
                          r('rect', {
                            className: 'uppy-ProviderIconBg',
                            width: '32',
                            height: '32',
                            rx: '16',
                            fill: '#2275D7',
                          }),
                          r('path', {
                            d: 'M21.973 21.152H9.863l-1.108-5.087h14.464l-1.246 5.087zM9.935 11.37h3.958l.886 1.444a.673.673 0 0 0 .585.316h6.506v1.37H9.935v-3.13zm14.898 3.44a.793.793 0 0 0-.616-.31h-.978v-2.126c0-.379-.275-.613-.653-.613H15.75l-.886-1.445a.673.673 0 0 0-.585-.316H9.232c-.378 0-.667.209-.667.587V14.5h-.782a.793.793 0 0 0-.61.303.795.795 0 0 0-.155.663l1.45 6.633c.078.36.396.618.764.618h13.354c.36 0 .674-.246.76-.595l1.631-6.636a.795.795 0 0 0-.144-.675z',
                            fill: '#FFF',
                          })
                        )
                      ),
                      r(
                        'div',
                        { className: 'uppy-DashboardTab-name' },
                        this.props.i18n('myDevice')
                      )
                    )
                  )),
                (this.renderBrowseButton = (e, t) => {
                  const s = this.props.acquirers.length
                  return r(
                    'button',
                    {
                      type: 'button',
                      className: 'uppy-u-reset uppy-Dashboard-browse',
                      onClick: t,
                      'data-uppy-super-focusable': 0 === s,
                    },
                    e
                  )
                }),
                (this.renderDropPasteBrowseTagline = () => {
                  const e = this.props.acquirers.length,
                    t = this.renderBrowseButton(
                      this.props.i18n('browseFiles'),
                      this.triggerFileInputClick
                    ),
                    s = this.renderBrowseButton(
                      this.props.i18n('browseFolders'),
                      this.triggerFolderInputClick
                    ),
                    i = this.props.fileManagerSelectionType,
                    o = i.charAt(0).toUpperCase() + i.slice(1)
                  return r(
                    'div',
                    { class: 'uppy-Dashboard-AddFiles-title' },
                    this.props.disableLocalFiles
                      ? this.props.i18n('importFiles')
                      : e > 0
                      ? this.props.i18nArray(`dropPasteImport${o}`, {
                          browseFiles: t,
                          browseFolders: s,
                          browse: t,
                        })
                      : this.props.i18nArray(`dropPaste${o}`, {
                          browseFiles: t,
                          browseFolders: s,
                          browse: t,
                        })
                  )
                }),
                (this.renderAcquirer = (e) =>
                  r(
                    'div',
                    {
                      className: 'uppy-DashboardTab',
                      role: 'presentation',
                      'data-uppy-acquirer-id': e.id,
                    },
                    r(
                      'button',
                      {
                        type: 'button',
                        className:
                          'uppy-u-reset uppy-c-btn uppy-DashboardTab-btn',
                        role: 'tab',
                        tabIndex: 0,
                        'data-cy': e.id,
                        'aria-controls': `uppy-DashboardContent-panel--${e.id}`,
                        'aria-selected':
                          this.props.activePickerPanel.id === e.id,
                        'data-uppy-super-focusable': !0,
                        onClick: () => this.props.showPanel(e.id),
                      },
                      e.icon(),
                      r('div', { className: 'uppy-DashboardTab-name' }, e.name)
                    )
                  )),
                (this.renderAcquirers = (e, t) => {
                  const s = [...e],
                    i = s.splice(e.length - 2, e.length)
                  return r(
                    'div',
                    {
                      className: 'uppy-Dashboard-AddFiles-list',
                      role: 'tablist',
                    },
                    !t && this.renderMyDeviceAcquirer(),
                    s.map((e) => this.renderAcquirer(e)),
                    r(
                      'span',
                      {
                        role: 'presentation',
                        style: { 'white-space': 'nowrap' },
                      },
                      i.map((e) => this.renderAcquirer(e))
                    )
                  )
                })
            }
            [i]() {
              this.props.i18nArray('dropPasteBoth'),
                this.props.i18nArray('dropPasteFiles'),
                this.props.i18nArray('dropPasteFolders'),
                this.props.i18nArray('dropPasteImportBoth'),
                this.props.i18nArray('dropPasteImportFiles'),
                this.props.i18nArray('dropPasteImportFolders')
            }
            renderPoweredByUppy() {
              const { i18nArray: e } = this.props,
                t = e('poweredBy', {
                  uppy: r(
                    'span',
                    null,
                    r(
                      'svg',
                      {
                        'aria-hidden': 'true',
                        focusable: 'false',
                        className: 'uppy-c-icon uppy-Dashboard-poweredByIcon',
                        width: '11',
                        height: '11',
                        viewBox: '0 0 11 11',
                      },
                      r('path', {
                        d: 'M7.365 10.5l-.01-4.045h2.612L5.5.806l-4.467 5.65h2.604l.01 4.044h3.718z',
                        fillRule: 'evenodd',
                      })
                    ),
                    r(
                      'span',
                      { className: 'uppy-Dashboard-poweredByUppy' },
                      'Uppy'
                    )
                  ),
                })
              return r(
                'a',
                {
                  tabIndex: '-1',
                  href: 'https://uppy.io',
                  rel: 'noreferrer noopener',
                  target: '_blank',
                  className: 'uppy-Dashboard-poweredBy',
                },
                t
              )
            }
            render() {
              return r(
                'div',
                { className: 'uppy-Dashboard-AddFiles' },
                this.renderHiddenInput(!1, (e) => {
                  this.fileInput = e
                }),
                this.renderHiddenInput(!0, (e) => {
                  this.folderInput = e
                }),
                this.renderDropPasteBrowseTagline(),
                this.props.acquirers.length > 0 &&
                  this.renderAcquirers(
                    this.props.acquirers,
                    this.props.disableLocalFiles
                  ),
                r(
                  'div',
                  { className: 'uppy-Dashboard-AddFiles-info' },
                  this.props.note &&
                    r(
                      'div',
                      { className: 'uppy-Dashboard-note' },
                      this.props.note
                    ),
                  this.props.proudlyDisplayPoweredByUppy &&
                    this.renderPoweredByUppy(this.props)
                )
              )
            }
          })
      },
      5808: (e, t, s) => {
        const { h: i } = s(6400),
          r = s(4184),
          o = s(6052)
        e.exports = (e) =>
          i(
            'div',
            {
              className: r('uppy-Dashboard-AddFilesPanel', e.className),
              'data-uppy-panelType': 'AddFiles',
              'aria-hidden': e.showAddFilesPanel,
            },
            i(
              'div',
              { className: 'uppy-DashboardContent-bar' },
              i(
                'div',
                {
                  className: 'uppy-DashboardContent-title',
                  role: 'heading',
                  'aria-level': '1',
                },
                e.i18n('addingMoreFiles')
              ),
              i(
                'button',
                {
                  className: 'uppy-DashboardContent-back',
                  type: 'button',
                  onClick: () => e.toggleAddFilesPanel(!1),
                },
                e.i18n('back')
              )
            ),
            i(o, e)
          )
      },
      5519: (e, t, s) => {
        function i() {
          return (
            (i =
              Object.assign ||
              function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var s = arguments[t]
                  for (var i in s)
                    Object.prototype.hasOwnProperty.call(s, i) && (e[i] = s[i])
                }
                return e
              }),
            i.apply(this, arguments)
          )
        }
        const { h: r } = s(6400),
          o = s(4184),
          n = s(3754),
          a = s(8689),
          l = s(6052),
          d = s(5808),
          p = s(5859),
          h = s(4477),
          u = s(7246),
          c = s(5261),
          f = s(9167)
        e.exports = function (e) {
          const t = 0 === e.totalFileCount,
            s = e.containerWidth > 576,
            m = o({
              'uppy-Dashboard': !0,
              'uppy-Dashboard--isDisabled': e.disabled,
              'uppy-Dashboard--animateOpenClose': e.animateOpenClose,
              'uppy-Dashboard--isClosing': e.isClosing,
              'uppy-Dashboard--isDraggingOver': e.isDraggingOver,
              'uppy-Dashboard--modal': !e.inline,
              'uppy-size--md': e.containerWidth > 576,
              'uppy-size--lg': e.containerWidth > 700,
              'uppy-size--xl': e.containerWidth > 900,
              'uppy-size--height-md': e.containerHeight > 400,
              'uppy-Dashboard--isAddFilesPanelVisible': e.showAddFilesPanel,
              'uppy-Dashboard--isInnerWrapVisible':
                e.areInsidesReadyToBeVisible,
            })
          let g = 1
          e.containerWidth > 900
            ? (g = 5)
            : e.containerWidth > 700
            ? (g = 4)
            : e.containerWidth > 576 && (g = 3)
          const y = e.showSelectedFiles && !t,
            v = e.recoveredState
              ? Object.keys(e.recoveredState.files).length
              : null,
            b = e.files
              ? Object.keys(e.files).filter((t) => e.files[t].isGhost).length
              : null
          return r(
            'div',
            {
              className: m,
              'data-uppy-theme': e.theme,
              'data-uppy-num-acquirers': e.acquirers.length,
              'data-uppy-drag-drop-supported': !e.disableLocalFiles && n(),
              'aria-hidden': e.inline ? 'false' : e.isHidden,
              'aria-disabled': e.disabled,
              'aria-label': e.inline
                ? e.i18n('dashboardTitle')
                : e.i18n('dashboardWindowTitle'),
              onPaste: e.handlePaste,
              onDragOver: e.handleDragOver,
              onDragLeave: e.handleDragLeave,
              onDrop: e.handleDrop,
            },
            r('div', {
              'aria-hidden': 'true',
              className: 'uppy-Dashboard-overlay',
              tabIndex: -1,
              onClick: e.handleClickOutside,
            }),
            r(
              'div',
              {
                className: 'uppy-Dashboard-inner',
                'aria-modal': !e.inline && 'true',
                role: !e.inline && 'dialog',
                style: {
                  width: e.inline && e.width ? e.width : '',
                  height: e.inline && e.height ? e.height : '',
                },
              },
              e.inline
                ? null
                : r(
                    'button',
                    {
                      className: 'uppy-u-reset uppy-Dashboard-close',
                      type: 'button',
                      'aria-label': e.i18n('closeModal'),
                      title: e.i18n('closeModal'),
                      onClick: e.closeModal,
                    },
                    r('span', { 'aria-hidden': 'true' }, '×')
                  ),
              r(
                'div',
                { className: 'uppy-Dashboard-innerWrap' },
                r(
                  'div',
                  { className: 'uppy-Dashboard-dropFilesHereHint' },
                  e.i18n('dropHint')
                ),
                y && r(u, e),
                v &&
                  r(
                    'div',
                    { className: 'uppy-Dashboard-serviceMsg' },
                    r(
                      'svg',
                      {
                        className: 'uppy-Dashboard-serviceMsg-icon',
                        'aria-hidden': 'true',
                        focusable: 'false',
                        width: '21',
                        height: '16',
                        viewBox: '0 0 24 19',
                      },
                      r(
                        'g',
                        {
                          transform: 'translate(0 -1)',
                          fill: 'none',
                          fillRule: 'evenodd',
                        },
                        r('path', {
                          d: 'M12.857 1.43l10.234 17.056A1 1 0 0122.234 20H1.766a1 1 0 01-.857-1.514L11.143 1.429a1 1 0 011.714 0z',
                          fill: '#FFD300',
                        }),
                        r('path', { fill: '#000', d: 'M11 6h2l-.3 8h-1.4z' }),
                        r('circle', {
                          fill: '#000',
                          cx: '12',
                          cy: '17',
                          r: '1',
                        })
                      )
                    ),
                    r(
                      'strong',
                      { className: 'uppy-Dashboard-serviceMsg-title' },
                      e.i18n('sessionRestored')
                    ),
                    r(
                      'div',
                      { className: 'uppy-Dashboard-serviceMsg-text' },
                      b > 0
                        ? e.i18n('recoveredXFiles', { smart_count: b })
                        : e.i18n('recoveredAllFiles')
                    )
                  ),
                y
                  ? r(a, i({}, e, { itemsPerRow: g }))
                  : r(l, i({}, e, { isSizeMD: s })),
                r(
                  f,
                  null,
                  e.showAddFilesPanel
                    ? r(d, i({ key: 'AddFiles' }, e, { isSizeMD: s }))
                    : null
                ),
                r(
                  f,
                  null,
                  e.fileCardFor ? r(c, i({ key: 'FileCard' }, e)) : null
                ),
                r(
                  f,
                  null,
                  e.activePickerPanel ? r(p, i({ key: 'Picker' }, e)) : null
                ),
                r(
                  f,
                  null,
                  e.showFileEditor ? r(h, i({ key: 'Editor' }, e)) : null
                ),
                r(
                  'div',
                  { className: 'uppy-Dashboard-progressindicators' },
                  e.progressindicators.map((t) =>
                    e.uppy.getPlugin(t.id).render(e.state)
                  )
                )
              )
            )
          )
        }
      },
      4477: (e, t, s) => {
        const { h: i } = s(6400),
          r = s(4184)
        e.exports = function (e) {
          const t = e.files[e.fileCardFor]
          return i(
            'div',
            {
              className: r('uppy-DashboardContent-panel', e.className),
              role: 'tabpanel',
              'data-uppy-panelType': 'FileEditor',
              id: 'uppy-DashboardContent-panel--editor',
            },
            i(
              'div',
              { className: 'uppy-DashboardContent-bar' },
              i(
                'div',
                {
                  className: 'uppy-DashboardContent-title',
                  role: 'heading',
                  'aria-level': '1',
                },
                e.i18nArray('editing', {
                  file: i(
                    'span',
                    { className: 'uppy-DashboardContent-titleFile' },
                    t.meta ? t.meta.name : t.name
                  ),
                })
              ),
              i(
                'button',
                {
                  className: 'uppy-DashboardContent-back',
                  type: 'button',
                  onClick: e.hideAllPanels,
                },
                e.i18n('cancel')
              ),
              i(
                'button',
                {
                  className: 'uppy-DashboardContent-save',
                  type: 'button',
                  onClick: e.saveFileEditor,
                },
                e.i18n('save')
              )
            ),
            i(
              'div',
              { className: 'uppy-DashboardContent-panelBody' },
              e.editors.map((t) => e.uppy.getPlugin(t.id).render(e.state))
            )
          )
        }
      },
      5261: (e, t, s) => {
        const { h: i, Component: r } = s(6400),
          o = s(4184),
          { nanoid: n } = s(2961),
          a = s(1882),
          l = s(8805),
          d = s(9282)
        e.exports = class extends r {
          constructor(e) {
            super(e),
              (this.form = document.createElement('form')),
              (this.updateMeta = (e, t) => {
                this.setState((s) => {
                  let { formState: i } = s
                  return { formState: { ...i, [t]: e } }
                })
              }),
              (this.handleSave = (e) => {
                e.preventDefault()
                const t = this.props.fileCardFor
                this.props.saveFileCard(this.state.formState, t)
              }),
              (this.handleCancel = () => {
                this.props.toggleFileCard(!1)
              }),
              (this.saveOnEnter = (e) => {
                if (13 === e.keyCode) {
                  e.stopPropagation(), e.preventDefault()
                  const t = this.props.files[this.props.fileCardFor]
                  this.props.saveFileCard(this.state.formState, t.id)
                }
              }),
              (this.renderMetaFields = () => {
                const e = this.getMetaFields() || [],
                  t = {
                    text: 'uppy-u-reset uppy-c-textInput uppy-Dashboard-FileCard-input',
                  }
                return e.map((e) => {
                  const s = `uppy-Dashboard-FileCard-input-${e.id}`,
                    r = this.props.requiredMetaFields.includes(e.id)
                  return i(
                    'fieldset',
                    {
                      key: e.id,
                      className: 'uppy-Dashboard-FileCard-fieldset',
                    },
                    i(
                      'label',
                      {
                        className: 'uppy-Dashboard-FileCard-label',
                        htmlFor: s,
                      },
                      e.name
                    ),
                    void 0 !== e.render
                      ? e.render(
                          {
                            value: this.state.formState[e.id],
                            onChange: (t) => this.updateMeta(t, e.id),
                            fieldCSSClasses: t,
                            required: r,
                            form: this.form.id,
                          },
                          i
                        )
                      : i('input', {
                          className: t.text,
                          id: s,
                          form: this.form.id,
                          type: e.type || 'text',
                          required: r,
                          value: this.state.formState[e.id],
                          placeholder: e.placeholder,
                          onKeyUp:
                            'form' in HTMLInputElement.prototype
                              ? void 0
                              : this.saveOnEnter,
                          onKeyDown:
                            'form' in HTMLInputElement.prototype
                              ? void 0
                              : this.saveOnEnter,
                          onKeyPress:
                            'form' in HTMLInputElement.prototype
                              ? void 0
                              : this.saveOnEnter,
                          onInput: (t) => this.updateMeta(t.target.value, e.id),
                          'data-uppy-super-focusable': !0,
                        })
                  )
                })
              })
            const t = this.props.files[this.props.fileCardFor],
              s = this.getMetaFields() || [],
              r = {}
            s.forEach((e) => {
              r[e.id] = t.meta[e.id] || ''
            }),
              (this.state = { formState: r }),
              (this.form.id = n())
          }
          componentWillMount() {
            this.form.addEventListener('submit', this.handleSave),
              document.body.appendChild(this.form)
          }
          componentWillUnmount() {
            this.form.removeEventListener('submit', this.handleSave),
              document.body.removeChild(this.form)
          }
          getMetaFields() {
            return 'function' == typeof this.props.metaFields
              ? this.props.metaFields(this.props.files[this.props.fileCardFor])
              : this.props.metaFields
          }
          render() {
            const e = this.props.files[this.props.fileCardFor],
              t = this.props.canEditFile(e)
            return i(
              'div',
              {
                className: o('uppy-Dashboard-FileCard', this.props.className),
                'data-uppy-panelType': 'FileCard',
                onDragOver: l,
                onDragLeave: l,
                onDrop: l,
                onPaste: l,
              },
              i(
                'div',
                { className: 'uppy-DashboardContent-bar' },
                i(
                  'div',
                  {
                    className: 'uppy-DashboardContent-title',
                    role: 'heading',
                    'aria-level': '1',
                  },
                  this.props.i18nArray('editing', {
                    file: i(
                      'span',
                      { className: 'uppy-DashboardContent-titleFile' },
                      e.meta ? e.meta.name : e.name
                    ),
                  })
                ),
                i(
                  'button',
                  {
                    className: 'uppy-DashboardContent-back',
                    type: 'button',
                    form: this.form.id,
                    title: this.props.i18n('finishEditingFile'),
                    onClick: this.handleCancel,
                  },
                  this.props.i18n('cancel')
                )
              ),
              i(
                'div',
                { className: 'uppy-Dashboard-FileCard-inner' },
                i(
                  'div',
                  {
                    className: 'uppy-Dashboard-FileCard-preview',
                    style: { backgroundColor: a(e.type).color },
                  },
                  i(d, { file: e }),
                  t &&
                    i(
                      'button',
                      {
                        type: 'button',
                        className:
                          'uppy-u-reset uppy-c-btn uppy-Dashboard-FileCard-edit',
                        onClick: (t) => {
                          this.handleSave(t), this.props.openFileEditor(e)
                        },
                        form: this.form.id,
                      },
                      this.props.i18n('editFile')
                    )
                ),
                i(
                  'div',
                  { className: 'uppy-Dashboard-FileCard-info' },
                  this.renderMetaFields()
                ),
                i(
                  'div',
                  { className: 'uppy-Dashboard-FileCard-actions' },
                  i(
                    'button',
                    {
                      className:
                        'uppy-u-reset uppy-c-btn uppy-c-btn-primary uppy-Dashboard-FileCard-actionsBtn',
                      type:
                        'form' in HTMLButtonElement.prototype
                          ? 'submit'
                          : 'button',
                      onClick:
                        'form' in HTMLButtonElement.prototype
                          ? void 0
                          : this.handleSave,
                      form: this.form.id,
                    },
                    this.props.i18n('saveChanges')
                  ),
                  i(
                    'button',
                    {
                      className:
                        'uppy-u-reset uppy-c-btn uppy-c-btn-link uppy-Dashboard-FileCard-actionsBtn',
                      type: 'button',
                      onClick: this.handleCancel,
                      form: this.form.id,
                    },
                    this.props.i18n('cancel')
                  )
                )
              )
            )
          }
        }
      },
      6757: (e, t, s) => {
        const { h: i } = s(6400),
          r = s(818)
        function o(e) {
          let {
            file: t,
            uploadInProgressOrComplete: s,
            metaFields: r,
            canEditFile: o,
            i18n: n,
            onClick: a,
          } = e
          return (!s && r && r.length > 0) || (!s && o(t))
            ? i(
                'button',
                {
                  className:
                    'uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--edit',
                  type: 'button',
                  'aria-label': n('editFileWithFilename', {
                    file: t.meta.name,
                  }),
                  title: n('editFileWithFilename', { file: t.meta.name }),
                  onClick: () => a(),
                },
                i(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    className: 'uppy-c-icon',
                    width: '14',
                    height: '14',
                    viewBox: '0 0 14 14',
                  },
                  i(
                    'g',
                    { fillRule: 'evenodd' },
                    i('path', {
                      d: 'M1.5 10.793h2.793A1 1 0 0 0 5 10.5L11.5 4a1 1 0 0 0 0-1.414L9.707.793a1 1 0 0 0-1.414 0l-6.5 6.5A1 1 0 0 0 1.5 8v2.793zm1-1V8L9 1.5l1.793 1.793-6.5 6.5H2.5z',
                      fillRule: 'nonzero',
                    }),
                    i('rect', {
                      x: '1',
                      y: '12.293',
                      width: '11',
                      height: '1',
                      rx: '.5',
                    }),
                    i('path', {
                      fillRule: 'nonzero',
                      d: 'M6.793 2.5L9.5 5.207l.707-.707L7.5 1.793z',
                    })
                  )
                )
              )
            : null
        }
        function n(e) {
          let { i18n: t, onClick: s, file: r } = e
          return i(
            'button',
            {
              className:
                'uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--remove',
              type: 'button',
              'aria-label': t('removeFile', { file: r.meta.name }),
              title: t('removeFile', { file: r.meta.name }),
              onClick: () => s(),
            },
            i(
              'svg',
              {
                'aria-hidden': 'true',
                focusable: 'false',
                className: 'uppy-c-icon',
                width: '18',
                height: '18',
                viewBox: '0 0 18 18',
              },
              i('path', {
                d: 'M9 0C4.034 0 0 4.034 0 9s4.034 9 9 9 9-4.034 9-9-4.034-9-9-9z',
              }),
              i('path', {
                fill: '#FFF',
                d: 'M13 12.222l-.778.778L9 9.778 5.778 13 5 12.222 8.222 9 5 5.778 5.778 5 9 8.222 12.222 5l.778.778L9.778 9z',
              })
            )
          )
        }
        function a(e) {
          const { i18n: t } = e
          return i(
            'button',
            {
              className:
                'uppy-u-reset uppy-Dashboard-Item-action uppy-Dashboard-Item-action--copyLink',
              type: 'button',
              'aria-label': t('copyLink'),
              title: t('copyLink'),
              onClick: (t) =>
                ((e, t) => {
                  r(t.file.uploadURL, t.i18n('copyLinkToClipboardFallback'))
                    .then(() => {
                      t.uppy.log('Link copied to clipboard.'),
                        t.uppy.info(
                          t.i18n('copyLinkToClipboardSuccess'),
                          'info',
                          3e3
                        )
                    })
                    .catch(t.uppy.log)
                    .then(() => e.target.focus({ preventScroll: !0 }))
                })(t, e),
            },
            i(
              'svg',
              {
                'aria-hidden': 'true',
                focusable: 'false',
                className: 'uppy-c-icon',
                width: '14',
                height: '14',
                viewBox: '0 0 14 12',
              },
              i('path', {
                d: 'M7.94 7.703a2.613 2.613 0 0 1-.626 2.681l-.852.851a2.597 2.597 0 0 1-1.849.766A2.616 2.616 0 0 1 2.764 7.54l.852-.852a2.596 2.596 0 0 1 2.69-.625L5.267 7.099a1.44 1.44 0 0 0-.833.407l-.852.851a1.458 1.458 0 0 0 1.03 2.486c.39 0 .755-.152 1.03-.426l.852-.852c.231-.231.363-.522.406-.824l1.04-1.038zm4.295-5.937A2.596 2.596 0 0 0 10.387 1c-.698 0-1.355.272-1.849.766l-.852.851a2.614 2.614 0 0 0-.624 2.688l1.036-1.036c.041-.304.173-.6.407-.833l.852-.852c.275-.275.64-.426 1.03-.426a1.458 1.458 0 0 1 1.03 2.486l-.852.851a1.442 1.442 0 0 1-.824.406l-1.04 1.04a2.596 2.596 0 0 0 2.683-.628l.851-.85a2.616 2.616 0 0 0 0-3.697zm-6.88 6.883a.577.577 0 0 0 .82 0l3.474-3.474a.579.579 0 1 0-.819-.82L5.355 7.83a.579.579 0 0 0 0 .819z',
              })
            )
          )
        }
        e.exports = function (e) {
          const {
            uppy: t,
            file: s,
            uploadInProgressOrComplete: r,
            canEditFile: l,
            metaFields: d,
            showLinkToFileUploadResult: p,
            showRemoveButton: h,
            i18n: u,
            toggleFileCard: c,
            openFileEditor: f,
          } = e
          return i(
            'div',
            { className: 'uppy-Dashboard-Item-actionWrapper' },
            i(o, {
              i18n: u,
              file: s,
              uploadInProgressOrComplete: r,
              canEditFile: l,
              metaFields: d,
              onClick: () => {
                d && d.length > 0 ? c(!0, s.id) : f(s)
              },
            }),
            p && s.uploadURL ? i(a, { file: s, uppy: t, i18n: u }) : null,
            h
              ? i(n, {
                  i18n: u,
                  file: s,
                  uppy: t,
                  onClick: () => e.uppy.removeFile(s.id, 'removed-by-user'),
                })
              : null
          )
        }
      },
      3844: (e, t, s) => {
        const { h: i, Fragment: r } = s(6400),
          o = s(5158),
          n = s(469),
          a = s(8092),
          l = (e) => {
            let { file: t, onClick: s } = e
            return t.error
              ? i(
                  'button',
                  {
                    className: 'uppy-u-reset uppy-Dashboard-Item-errorDetails',
                    'aria-label': t.error,
                    'data-microtip-position': 'bottom',
                    'data-microtip-size': 'medium',
                    onClick: s,
                    type: 'button',
                  },
                  '?'
                )
              : null
          }
        e.exports = function (e) {
          const { file: t } = e
          return i(
            'div',
            {
              className: 'uppy-Dashboard-Item-fileInfo',
              'data-uppy-file-source': t.source,
            },
            i(
              'div',
              { className: 'uppy-Dashboard-Item-fileName' },
              ((e) => {
                const { author: t, name: s } = e.file.meta
                return i(
                  'div',
                  { className: 'uppy-Dashboard-Item-name', title: s },
                  n(
                    s,
                    e.containerWidth <= 352
                      ? 35
                      : e.containerWidth <= 576
                      ? 60
                      : t
                      ? 20
                      : 30
                  )
                )
              })(e),
              i(l, { file: e.file, onClick: () => alert(e.file.error) })
            ),
            i(
              'div',
              { className: 'uppy-Dashboard-Item-status' },
              ((e) => {
                const { author: t } = e.file.meta,
                  { providerName: s } = e.file.remote
                return t
                  ? i(
                      'div',
                      { className: 'uppy-Dashboard-Item-author' },
                      i(
                        'a',
                        {
                          href: `${t.url}?utm_source=Companion&utm_medium=referral`,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        },
                        n(t.name, 13)
                      ),
                      s ? i(r, null, ' · ', s, ' · ') : null
                    )
                  : null
              })(e),
              ((e) =>
                e.file.size &&
                i(
                  'div',
                  { className: 'uppy-Dashboard-Item-statusSize' },
                  o(e.file.size)
                ))(e),
              ((e) =>
                e.file.isGhost &&
                i(
                  'span',
                  null,
                  ' • ',
                  i(
                    'button',
                    {
                      className:
                        'uppy-u-reset uppy-c-btn uppy-Dashboard-Item-reSelect',
                      type: 'button',
                      onClick: e.toggleAddFilesPanel,
                    },
                    e.i18n('reSelect')
                  )
                ))(e)
            ),
            i(a, {
              file: e.file,
              i18n: e.i18n,
              toggleFileCard: e.toggleFileCard,
              metaFields: e.metaFields,
            })
          )
        }
      },
      6012: (e, t, s) => {
        const { h: i } = s(6400),
          r = s(9282),
          o = s(8092),
          n = s(1882)
        e.exports = function (e) {
          return i(
            'div',
            {
              className: 'uppy-Dashboard-Item-previewInnerWrap',
              style: { backgroundColor: n(e.file.type).color },
            },
            e.showLinkToFileUploadResult &&
              e.file.uploadURL &&
              i(
                'a',
                {
                  className: 'uppy-Dashboard-Item-previewLink',
                  href: e.file.uploadURL,
                  rel: 'noreferrer noopener',
                  target: '_blank',
                  'aria-label': e.file.meta.name,
                },
                i('span', { hidden: !0 }, e.file.meta.name)
              ),
            i(r, { file: e.file }),
            i(o, {
              file: e.file,
              i18n: e.i18n,
              toggleFileCard: e.toggleFileCard,
              metaFields: e.metaFields,
            })
          )
        }
      },
      1911: (e, t, s) => {
        const { h: i } = s(6400)
        function r(e) {
          return e.isUploaded
            ? e.i18n('uploadComplete')
            : e.error
            ? e.i18n('retryUpload')
            : e.resumableUploads
            ? e.file.isPaused
              ? e.i18n('resumeUpload')
              : e.i18n('pauseUpload')
            : e.individualCancellation
            ? e.i18n('cancelUpload')
            : ''
        }
        function o(e) {
          return i(
            'div',
            { className: 'uppy-Dashboard-Item-progress' },
            i(
              'button',
              {
                className: 'uppy-u-reset uppy-Dashboard-Item-progressIndicator',
                type: 'button',
                'aria-label': r(e),
                title: r(e),
                onClick: () =>
                  (function (e) {
                    e.isUploaded ||
                      (!e.error || e.hideRetryButton
                        ? e.resumableUploads && !e.hidePauseResumeButton
                          ? e.uppy.pauseResume(e.file.id)
                          : e.individualCancellation &&
                            !e.hideCancelButton &&
                            e.uppy.removeFile(e.file.id)
                        : e.uppy.retryUpload(e.file.id))
                  })(e),
              },
              e.children
            )
          )
        }
        function n(e) {
          let { children: t } = e
          return i(
            'svg',
            {
              'aria-hidden': 'true',
              focusable: 'false',
              width: '70',
              height: '70',
              viewBox: '0 0 36 36',
              className: 'uppy-c-icon uppy-Dashboard-Item-progressIcon--circle',
            },
            t
          )
        }
        function a(e) {
          let { progress: t } = e
          const s = 2 * Math.PI * 15
          return i(
            'g',
            null,
            i('circle', {
              className: 'uppy-Dashboard-Item-progressIcon--bg',
              r: '15',
              cx: '18',
              cy: '18',
              'stroke-width': '2',
              fill: 'none',
            }),
            i('circle', {
              className: 'uppy-Dashboard-Item-progressIcon--progress',
              r: '15',
              cx: '18',
              cy: '18',
              transform: 'rotate(-90, 18, 18)',
              fill: 'none',
              'stroke-width': '2',
              'stroke-dasharray': s,
              'stroke-dashoffset': s - (s / 100) * t,
            })
          )
        }
        e.exports = function (e) {
          return e.file.progress.uploadStarted
            ? e.isUploaded
              ? i(
                  'div',
                  { className: 'uppy-Dashboard-Item-progress' },
                  i(
                    'div',
                    { className: 'uppy-Dashboard-Item-progressIndicator' },
                    i(
                      n,
                      null,
                      i('circle', {
                        r: '15',
                        cx: '18',
                        cy: '18',
                        fill: '#1bb240',
                      }),
                      i('polygon', {
                        className: 'uppy-Dashboard-Item-progressIcon--check',
                        transform: 'translate(2, 3)',
                        points:
                          '14 22.5 7 15.2457065 8.99985857 13.1732815 14 18.3547104 22.9729883 9 25 11.1005634',
                      })
                    )
                  )
                )
              : e.recoveredState
              ? void 0
              : e.error && !e.hideRetryButton
              ? i(
                  o,
                  e,
                  i(
                    'svg',
                    {
                      'aria-hidden': 'true',
                      focusable: 'false',
                      className:
                        'uppy-c-icon uppy-Dashboard-Item-progressIcon--retry',
                      width: '28',
                      height: '31',
                      viewBox: '0 0 16 19',
                    },
                    i('path', { d: 'M16 11a8 8 0 1 1-8-8v2a6 6 0 1 0 6 6h2z' }),
                    i('path', { d: 'M7.9 3H10v2H7.9z' }),
                    i('path', {
                      d: 'M8.536.5l3.535 3.536-1.414 1.414L7.12 1.914z',
                    }),
                    i('path', {
                      d: 'M10.657 2.621l1.414 1.415L8.536 7.57 7.12 6.157z',
                    })
                  )
                )
              : e.resumableUploads && !e.hidePauseResumeButton
              ? i(
                  o,
                  e,
                  i(
                    n,
                    null,
                    i(a, { progress: e.file.progress.percentage }),
                    e.file.isPaused
                      ? i('polygon', {
                          className: 'uppy-Dashboard-Item-progressIcon--play',
                          transform: 'translate(3, 3)',
                          points: '12 20 12 10 20 15',
                        })
                      : i(
                          'g',
                          {
                            className:
                              'uppy-Dashboard-Item-progressIcon--pause',
                            transform: 'translate(14.5, 13)',
                          },
                          i('rect', {
                            x: '0',
                            y: '0',
                            width: '2',
                            height: '10',
                            rx: '0',
                          }),
                          i('rect', {
                            x: '5',
                            y: '0',
                            width: '2',
                            height: '10',
                            rx: '0',
                          })
                        )
                  )
                )
              : e.resumableUploads ||
                !e.individualCancellation ||
                e.hideCancelButton
              ? i(
                  'div',
                  { className: 'uppy-Dashboard-Item-progress' },
                  i(
                    'div',
                    { className: 'uppy-Dashboard-Item-progressIndicator' },
                    i(n, null, i(a, { progress: e.file.progress.percentage }))
                  )
                )
              : i(
                  o,
                  e,
                  i(
                    n,
                    null,
                    i(a, { progress: e.file.progress.percentage }),
                    i('polygon', {
                      className: 'cancel',
                      transform: 'translate(2, 2)',
                      points:
                        '19.8856516 11.0625 16 14.9481516 12.1019737 11.0625 11.0625 12.1143484 14.9481516 16 11.0625 19.8980263 12.1019737 20.9375 16 17.0518484 19.8856516 20.9375 20.9375 19.8980263 17.0518484 16 20.9375 12',
                    })
                  )
                )
            : null
        }
      },
      8092: (e, t, s) => {
        const { h: i } = s(6400)
        e.exports = function (e) {
          const { file: t, toggleFileCard: s, i18n: r, metaFields: o } = e,
            { missingRequiredMetaFields: n } = t
          if (null == n || !n.length) return null
          const a = n
            .map((e) => ((e, t) => t.filter((t) => t.id === e)[0].name)(e, o))
            .join(', ')
          return i(
            'div',
            { className: 'uppy-Dashboard-Item-errorMessage' },
            r('missingRequiredMetaFields', {
              smart_count: n.length,
              fields: a,
            }),
            ' ',
            i(
              'button',
              {
                type: 'button',
                class: 'uppy-u-reset uppy-Dashboard-Item-errorMessageBtn',
                onClick: () => s(!0, t.id),
              },
              r('editFile')
            )
          )
        }
      },
      5845: (e, t, s) => {
        const { h: i, Component: r } = s(6400),
          o = s(4184),
          n = s(81),
          a = s(6012),
          l = s(1911),
          d = s(3844),
          p = s(6757)
        e.exports = class extends r {
          componentDidMount() {
            const { file: e } = this.props
            e.preview || this.props.handleRequestThumbnail(e)
          }
          shouldComponentUpdate(e) {
            return !n(this.props, e)
          }
          componentDidUpdate() {
            const { file: e } = this.props
            e.preview || this.props.handleRequestThumbnail(e)
          }
          componentWillUnmount() {
            const { file: e } = this.props
            e.preview || this.props.handleCancelThumbnail(e)
          }
          render() {
            const { file: e } = this.props,
              t = e.progress.preprocess || e.progress.postprocess,
              s = e.progress.uploadComplete && !t && !e.error,
              r = e.progress.uploadStarted || t,
              n = (e.progress.uploadStarted && !e.progress.uploadComplete) || t,
              h = e.error || !1,
              { isGhost: u } = e
            let c = (this.props.individualCancellation || !n) && !s
            s && this.props.showRemoveButtonAfterComplete && (c = !0)
            const f = o({
              'uppy-Dashboard-Item': !0,
              'is-inprogress': n && !this.props.recoveredState,
              'is-processing': t,
              'is-complete': s,
              'is-error': !!h,
              'is-resumable': this.props.resumableUploads,
              'is-noIndividualCancellation': !this.props.individualCancellation,
              'is-ghost': u,
            })
            return i(
              'div',
              { className: f, id: `uppy_${e.id}`, role: this.props.role },
              i(
                'div',
                { className: 'uppy-Dashboard-Item-preview' },
                i(a, {
                  file: e,
                  showLinkToFileUploadResult:
                    this.props.showLinkToFileUploadResult,
                  i18n: this.props.i18n,
                  toggleFileCard: this.props.toggleFileCard,
                  metaFields: this.props.metaFields,
                }),
                i(l, {
                  uppy: this.props.uppy,
                  file: e,
                  error: h,
                  isUploaded: s,
                  hideRetryButton: this.props.hideRetryButton,
                  hideCancelButton: this.props.hideCancelButton,
                  hidePauseResumeButton: this.props.hidePauseResumeButton,
                  recoveredState: this.props.recoveredState,
                  showRemoveButtonAfterComplete:
                    this.props.showRemoveButtonAfterComplete,
                  resumableUploads: this.props.resumableUploads,
                  individualCancellation: this.props.individualCancellation,
                  i18n: this.props.i18n,
                })
              ),
              i(
                'div',
                { className: 'uppy-Dashboard-Item-fileInfoAndButtons' },
                i(d, {
                  file: e,
                  id: this.props.id,
                  acquirers: this.props.acquirers,
                  containerWidth: this.props.containerWidth,
                  i18n: this.props.i18n,
                  toggleAddFilesPanel: this.props.toggleAddFilesPanel,
                  toggleFileCard: this.props.toggleFileCard,
                  metaFields: this.props.metaFields,
                }),
                i(p, {
                  file: e,
                  metaFields: this.props.metaFields,
                  showLinkToFileUploadResult:
                    this.props.showLinkToFileUploadResult,
                  showRemoveButton: c,
                  canEditFile: this.props.canEditFile,
                  uploadInProgressOrComplete: r,
                  toggleFileCard: this.props.toggleFileCard,
                  openFileEditor: this.props.openFileEditor,
                  uppy: this.props.uppy,
                  i18n: this.props.i18n,
                })
              )
            )
          }
        }
      },
      8689: (e, t, s) => {
        function i() {
          return (
            (i =
              Object.assign ||
              function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var s = arguments[t]
                  for (var i in s)
                    Object.prototype.hasOwnProperty.call(s, i) && (e[i] = s[i])
                }
                return e
              }),
            i.apply(this, arguments)
          )
        }
        const r = s(4184),
          { h: o } = s(6400),
          n = s(5845),
          a = s(4825)
        e.exports = (e) => {
          const t = 0 === e.totalFileCount,
            s = r('uppy-Dashboard-files', {
              'uppy-Dashboard-files--noFiles': t,
            }),
            l = 1 === e.itemsPerRow ? 71 : 200,
            d = {
              id: e.id,
              error: e.error,
              i18n: e.i18n,
              uppy: e.uppy,
              acquirers: e.acquirers,
              resumableUploads: e.resumableUploads,
              individualCancellation: e.individualCancellation,
              hideRetryButton: e.hideRetryButton,
              hidePauseResumeButton: e.hidePauseResumeButton,
              hideCancelButton: e.hideCancelButton,
              showLinkToFileUploadResult: e.showLinkToFileUploadResult,
              showRemoveButtonAfterComplete: e.showRemoveButtonAfterComplete,
              isWide: e.isWide,
              metaFields: e.metaFields,
              recoveredState: e.recoveredState,
              toggleFileCard: e.toggleFileCard,
              handleRequestThumbnail: e.handleRequestThumbnail,
              handleCancelThumbnail: e.handleCancelThumbnail,
            },
            p = Object.keys(e.files)
          e.recoveredState &&
            p.sort((t, s) => e.files[s].isGhost - e.files[t].isGhost)
          const h = (function (e, t) {
            const s = []
            let i = []
            return (
              e.forEach((e) => {
                i.length < t ? i.push(e) : (s.push(i), (i = [e]))
              }),
              i.length && s.push(i),
              s
            )
          })(p, e.itemsPerRow)
          return o(a, {
            class: s,
            role: 'list',
            data: h,
            renderRow: (t) =>
              o(
                'div',
                { role: 'presentation', key: t[0] },
                t.map((t) =>
                  o(
                    n,
                    i({ key: t, uppy: e.uppy }, d, {
                      role: 'listitem',
                      openFileEditor: e.openFileEditor,
                      canEditFile: e.canEditFile,
                      toggleAddFilesPanel: e.toggleAddFilesPanel,
                      file: e.files[t],
                    })
                  )
                )
              ),
            rowHeight: l,
          })
        }
      },
      9282: (e, t, s) => {
        const { h: i } = s(6400),
          r = s(1882)
        e.exports = function (e) {
          const { file: t } = e
          if (t.preview)
            return i('img', {
              className: 'uppy-Dashboard-Item-previewImg',
              alt: t.name,
              src: t.preview,
            })
          const { color: s, icon: o } = r(t.type)
          return i(
            'div',
            { className: 'uppy-Dashboard-Item-previewIconWrap' },
            i(
              'span',
              {
                className: 'uppy-Dashboard-Item-previewIcon',
                style: { color: s },
              },
              o
            ),
            i(
              'svg',
              {
                'aria-hidden': 'true',
                focusable: 'false',
                className: 'uppy-Dashboard-Item-previewIconBg',
                width: '58',
                height: '76',
                viewBox: '0 0 58 76',
              },
              i('rect', {
                fill: '#FFF',
                width: '58',
                height: '76',
                rx: '3',
                fillRule: 'evenodd',
              })
            )
          )
        }
      },
      5859: (e, t, s) => {
        const { h: i } = s(6400),
          r = s(4184),
          o = s(8805)
        e.exports = function (e) {
          return i(
            'div',
            {
              className: r('uppy-DashboardContent-panel', e.className),
              role: 'tabpanel',
              'data-uppy-panelType': 'PickerPanel',
              id: `uppy-DashboardContent-panel--${e.activePickerPanel.id}`,
              onDragOver: o,
              onDragLeave: o,
              onDrop: o,
              onPaste: o,
            },
            i(
              'div',
              { className: 'uppy-DashboardContent-bar' },
              i(
                'div',
                {
                  className: 'uppy-DashboardContent-title',
                  role: 'heading',
                  'aria-level': '1',
                },
                e.i18n('importFrom', { name: e.activePickerPanel.name })
              ),
              i(
                'button',
                {
                  className: 'uppy-DashboardContent-back',
                  type: 'button',
                  onClick: e.hideAllPanels,
                },
                e.i18n('cancel')
              )
            ),
            i(
              'div',
              { className: 'uppy-DashboardContent-panelBody' },
              e.uppy.getPlugin(e.activePickerPanel.id).render(e.state)
            )
          )
        }
      },
      7246: (e, t, s) => {
        const { h: i } = s(6400),
          r = 'preprocessing',
          o = 'uploading'
        function n(e) {
          switch (
            (function (e, t, s, i) {
              if ((void 0 === i && (i = {}), e)) return 'error'
              if (t) return 'complete'
              if (s) return 'paused'
              let n = 'waiting'
              const a = Object.keys(i)
              for (let e = 0; e < a.length; e++) {
                const { progress: t } = i[a[e]]
                if (t.uploadStarted && !t.uploadComplete) return o
                t.preprocess && n !== o && (n = r),
                  t.postprocess && n !== o && n !== r && (n = 'postprocessing')
              }
              return n
            })(e.isAllErrored, e.isAllComplete, e.isAllPaused, e.files)
          ) {
            case 'uploading':
              return e.i18n('uploadingXFiles', {
                smart_count: e.inProgressNotPausedFiles.length,
              })
            case 'preprocessing':
            case 'postprocessing':
              return e.i18n('processingXFiles', {
                smart_count: e.processingFiles.length,
              })
            case 'paused':
              return e.i18n('uploadPaused')
            case 'waiting':
              return e.i18n('xFilesSelected', {
                smart_count: e.newFiles.length,
              })
            case 'complete':
              return e.i18n('uploadComplete')
          }
        }
        e.exports = function (e) {
          let { allowNewUpload: t } = e
          return (
            t &&
              e.maxNumberOfFiles &&
              (t = e.totalFileCount < e.maxNumberOfFiles),
            i(
              'div',
              { className: 'uppy-DashboardContent-bar' },
              e.isAllComplete || e.hideCancelButton
                ? i('div', null)
                : i(
                    'button',
                    {
                      className: 'uppy-DashboardContent-back',
                      type: 'button',
                      onClick: () => e.uppy.cancelAll(),
                    },
                    e.i18n('cancel')
                  ),
              i(
                'div',
                {
                  className: 'uppy-DashboardContent-title',
                  role: 'heading',
                  'aria-level': '1',
                },
                i(n, e)
              ),
              t
                ? i(
                    'button',
                    {
                      className: 'uppy-DashboardContent-addMore',
                      type: 'button',
                      'aria-label': e.i18n('addMoreFiles'),
                      title: e.i18n('addMoreFiles'),
                      onClick: () => e.toggleAddFilesPanel(!0),
                    },
                    i(
                      'svg',
                      {
                        'aria-hidden': 'true',
                        focusable: 'false',
                        className: 'uppy-c-icon',
                        width: '15',
                        height: '15',
                        viewBox: '0 0 15 15',
                      },
                      i('path', {
                        d: 'M8 6.5h6a.5.5 0 0 1 .5.5v.5a.5.5 0 0 1-.5.5H8v6a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V8h-6a.5.5 0 0 1-.5-.5V7a.5.5 0 0 1 .5-.5h6v-6A.5.5 0 0 1 7 0h.5a.5.5 0 0 1 .5.5v6z',
                      })
                    ),
                    i(
                      'span',
                      { className: 'uppy-DashboardContent-addMoreCaption' },
                      e.i18n('addMore')
                    )
                  )
                : i('div', null)
            )
          )
        }
      },
      9167: (e, t, s) => {
        const { cloneElement: i, Component: r, toChildArray: o } = s(6400),
          n = s(4184),
          a = 'uppy-transition-slideDownUp'
        e.exports = class extends r {
          constructor(e) {
            super(e), (this.state = { cachedChildren: null, className: '' })
          }
          componentWillUpdate(e) {
            const { cachedChildren: t } = this.state,
              s = o(e.children)[0]
            if (t === s) return null
            const i = { cachedChildren: s }
            s &&
              !t &&
              ((i.className = `${a}-enter`),
              cancelAnimationFrame(this.animationFrame),
              clearTimeout(this.leaveTimeout),
              (this.leaveTimeout = void 0),
              (this.animationFrame = requestAnimationFrame(() => {
                this.setState({ className: `${a}-enter ${a}-enter-active` }),
                  (this.enterTimeout = setTimeout(() => {
                    this.setState({ className: '' })
                  }, 250))
              }))),
              t &&
                !s &&
                void 0 === this.leaveTimeout &&
                ((i.cachedChildren = t),
                (i.className = `${a}-leave`),
                cancelAnimationFrame(this.animationFrame),
                clearTimeout(this.enterTimeout),
                (this.enterTimeout = void 0),
                (this.animationFrame = requestAnimationFrame(() => {
                  this.setState({ className: `${a}-leave ${a}-leave-active` }),
                    (this.leaveTimeout = setTimeout(() => {
                      this.setState({ cachedChildren: null, className: '' })
                    }, 250))
                }))),
              this.setState(i)
          }
          render() {
            const { cachedChildren: e, className: t } = this.state
            return e ? i(e, { className: n(t, e.props.className) }) : null
          }
        }
      },
      4825: (e, t, s) => {
        function i() {
          return (
            (i =
              Object.assign ||
              function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var s = arguments[t]
                  for (var i in s)
                    Object.prototype.hasOwnProperty.call(s, i) && (e[i] = s[i])
                }
                return e
              }),
            i.apply(this, arguments)
          )
        }
        const { h: r, Component: o } = s(6400),
          n = { position: 'relative', width: '100%', minHeight: '100%' },
          a = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            overflow: 'visible',
          }
        e.exports = class extends o {
          constructor(e) {
            super(e),
              (this.handleScroll = () => {
                this.setState({ offset: this.base.scrollTop })
              }),
              (this.handleResize = () => {
                this.resize()
              }),
              (this.focusElement = null),
              (this.state = { offset: 0, height: 0 })
          }
          componentDidMount() {
            this.resize(), window.addEventListener('resize', this.handleResize)
          }
          componentWillUpdate() {
            this.base.contains(document.activeElement) &&
              (this.focusElement = document.activeElement)
          }
          componentDidUpdate() {
            this.focusElement &&
              this.focusElement.parentNode &&
              document.activeElement !== this.focusElement &&
              this.focusElement.focus(),
              (this.focusElement = null),
              this.resize()
          }
          componentWillUnmount() {
            window.removeEventListener('resize', this.handleResize)
          }
          resize() {
            const { height: e } = this.state
            e !== this.base.offsetHeight &&
              this.setState({ height: this.base.offsetHeight })
          }
          render(e) {
            let {
              data: t,
              rowHeight: s,
              renderRow: o,
              overscanCount: l = 10,
              ...d
            } = e
            const { offset: p, height: h } = this.state
            let u = Math.floor(p / s),
              c = Math.floor(h / s)
            l && ((u = Math.max(0, u - (u % l))), (c += l))
            const f = u + c + 4,
              m = t.slice(u, f),
              g = { ...n, height: t.length * s },
              y = { ...a, top: u * s }
            return r(
              'div',
              i({ onScroll: this.handleScroll }, d),
              r(
                'div',
                { role: 'presentation', style: g },
                r('div', { role: 'presentation', style: y }, m.map(o))
              )
            )
          }
        }
      },
      3121: (e, t, s) => {
        var i, r, o, n, a, l, d, p
        function h(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var u = 0
        function c(e) {
          return '__private_' + u++ + '_' + e
        }
        const { h: f } = s(6400),
          { UIPlugin: m } = s(9429),
          g = s(2310),
          y = s(873),
          v = s(7753),
          b = s(1147),
          w = s(6361),
          S = s(4031),
          { nanoid: P } = s(2961),
          F = s(3962),
          _ = s(6673),
          C = s(845).default || s(845),
          k = s(9045),
          T = s(5519),
          O = s(5233)
        function x() {
          const e = {}
          return (
            (e.promise = new Promise((t, s) => {
              ;(e.resolve = t), (e.reject = s)
            })),
            e
          )
        }
        function A() {
          return f(
            'svg',
            {
              'aria-hidden': 'true',
              focusable: 'false',
              width: '30',
              height: '30',
              viewBox: '0 0 30 30',
            },
            f('path', {
              d: 'M15 30c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C6.716 0 0 6.716 0 15c0 8.284 6.716 15 15 15zm4.258-12.676v6.846h-8.426v-6.846H5.204l9.82-12.364 9.82 12.364H19.26z',
            })
          )
        }
        e.exports =
          ((r = c('openFileEditorWhenFilesAdded')),
          (o = c('attachRenderFunctionToTarget')),
          (n = c('isTargetSupported')),
          (a = c('getAcquirers')),
          (l = c('getProgressIndicators')),
          (d = c('getEditors')),
          (p = i =
            class extends m {
              constructor(e, t) {
                var s
                super(e, t),
                  (s = this),
                  (this.removeTarget = (e) => {
                    const t = this.getPluginState().targets.filter(
                      (t) => t.id !== e.id
                    )
                    this.setPluginState({ targets: t })
                  }),
                  (this.addTarget = (e) => {
                    const t = e.id || e.constructor.name,
                      s = e.title || t,
                      i = e.type
                    if (
                      'acquirer' !== i &&
                      'progressindicator' !== i &&
                      'editor' !== i
                    ) {
                      const e =
                        'Dashboard: can only be targeted by plugins of types: acquirer, progressindicator, editor'
                      return void this.uppy.log(e, 'error')
                    }
                    const r = { id: t, name: s, type: i },
                      o = this.getPluginState().targets.slice()
                    return (
                      o.push(r), this.setPluginState({ targets: o }), this.el
                    )
                  }),
                  (this.hideAllPanels = () => {
                    const e = this.getPluginState(),
                      t = {
                        activePickerPanel: !1,
                        showAddFilesPanel: !1,
                        activeOverlayType: null,
                        fileCardFor: null,
                        showFileEditor: !1,
                      }
                    ;(e.activePickerPanel === t.activePickerPanel &&
                      e.showAddFilesPanel === t.showAddFilesPanel &&
                      e.showFileEditor === t.showFileEditor &&
                      e.activeOverlayType === t.activeOverlayType) ||
                      this.setPluginState(t)
                  }),
                  (this.showPanel = (e) => {
                    const { targets: t } = this.getPluginState(),
                      s = t.filter(
                        (t) => 'acquirer' === t.type && t.id === e
                      )[0]
                    this.setPluginState({
                      activePickerPanel: s,
                      activeOverlayType: 'PickerPanel',
                    })
                  }),
                  (this.canEditFile = (e) => {
                    const { targets: t } = this.getPluginState()
                    return h(this, d)
                      [d](t)
                      .some((t) => this.uppy.getPlugin(t.id).canEditFile(e))
                  }),
                  (this.openFileEditor = (e) => {
                    const { targets: t } = this.getPluginState(),
                      s = h(this, d)[d](t)
                    this.setPluginState({
                      showFileEditor: !0,
                      fileCardFor: e.id || null,
                      activeOverlayType: 'FileEditor',
                    }),
                      s.forEach((t) => {
                        this.uppy.getPlugin(t.id).selectFile(e)
                      })
                  }),
                  (this.saveFileEditor = () => {
                    const { targets: e } = this.getPluginState()
                    h(this, d)
                      [d](e)
                      .forEach((e) => {
                        this.uppy.getPlugin(e.id).save()
                      }),
                      this.hideAllPanels()
                  }),
                  (this.openModal = () => {
                    const { promise: e, resolve: t } = x()
                    if (
                      ((this.savedScrollPosition = window.pageYOffset),
                      (this.savedActiveElement = document.activeElement),
                      this.opts.disablePageScrollWhenModalOpen &&
                        document.body.classList.add('uppy-Dashboard-isFixed'),
                      this.opts.animateOpenClose &&
                        this.getPluginState().isClosing)
                    ) {
                      const e = () => {
                        this.setPluginState({ isHidden: !1 }),
                          this.el.removeEventListener('animationend', e, !1),
                          t()
                      }
                      this.el.addEventListener('animationend', e, !1)
                    } else this.setPluginState({ isHidden: !1 }), t()
                    return (
                      this.opts.browserBackButtonClose &&
                        this.updateBrowserHistory(),
                      document.addEventListener(
                        'keydown',
                        this.handleKeyDownInModal
                      ),
                      this.uppy.emit('dashboard:modal-open'),
                      e
                    )
                  }),
                  (this.closeModal = function (e) {
                    void 0 === e && (e = {})
                    const { manualClose: t = !0 } = e,
                      { isHidden: i, isClosing: r } = s.getPluginState()
                    if (i || r) return
                    const { promise: o, resolve: n } = x()
                    if (
                      (s.opts.disablePageScrollWhenModalOpen &&
                        document.body.classList.remove(
                          'uppy-Dashboard-isFixed'
                        ),
                      s.opts.animateOpenClose)
                    ) {
                      s.setPluginState({ isClosing: !0 })
                      const e = () => {
                        s.setPluginState({ isHidden: !0, isClosing: !1 }),
                          s.superFocus.cancel(),
                          s.savedActiveElement.focus(),
                          s.el.removeEventListener('animationend', e, !1),
                          n()
                      }
                      s.el.addEventListener('animationend', e, !1)
                    } else
                      s.setPluginState({ isHidden: !0 }),
                        s.superFocus.cancel(),
                        s.savedActiveElement.focus(),
                        n()
                    var a
                    return (
                      document.removeEventListener(
                        'keydown',
                        s.handleKeyDownInModal
                      ),
                      t &&
                        s.opts.browserBackButtonClose &&
                        null != (a = history.state) &&
                        a[s.modalName] &&
                        history.back(),
                      s.uppy.emit('dashboard:modal-closed'),
                      o
                    )
                  }),
                  (this.isModalOpen = () =>
                    !this.getPluginState().isHidden || !1),
                  (this.requestCloseModal = () =>
                    this.opts.onRequestCloseModal
                      ? this.opts.onRequestCloseModal()
                      : this.closeModal()),
                  (this.setDarkModeCapability = (e) => {
                    const { capabilities: t } = this.uppy.getState()
                    this.uppy.setState({ capabilities: { ...t, darkMode: e } })
                  }),
                  (this.handleSystemDarkModeChange = (e) => {
                    const t = e.matches
                    this.uppy.log(
                      '[Dashboard] Dark mode is ' + (t ? 'on' : 'off')
                    ),
                      this.setDarkModeCapability(t)
                  }),
                  (this.toggleFileCard = (e, t) => {
                    const s = this.uppy.getFile(t)
                    e
                      ? this.uppy.emit('dashboard:file-edit-start', s)
                      : this.uppy.emit('dashboard:file-edit-complete', s),
                      this.setPluginState({
                        fileCardFor: e ? t : null,
                        activeOverlayType: e ? 'FileCard' : null,
                      })
                  }),
                  (this.toggleAddFilesPanel = (e) => {
                    this.setPluginState({
                      showAddFilesPanel: e,
                      activeOverlayType: e ? 'AddFiles' : null,
                    })
                  }),
                  (this.addFiles = (e) => {
                    const t = e.map((e) => ({
                      source: this.id,
                      name: e.name,
                      type: e.type,
                      data: e,
                      meta: { relativePath: e.relativePath || null },
                    }))
                    try {
                      this.uppy.addFiles(t)
                    } catch (e) {
                      this.uppy.log(e)
                    }
                  }),
                  (this.startListeningToResize = () => {
                    ;(this.resizeObserver = new ResizeObserver((e) => {
                      const t = e[0],
                        { width: s, height: i } = t.contentRect
                      this.uppy.log(
                        `[Dashboard] resized: ${s} / ${i}`,
                        'debug'
                      ),
                        this.setPluginState({
                          containerWidth: s,
                          containerHeight: i,
                          areInsidesReadyToBeVisible: !0,
                        })
                    })),
                      this.resizeObserver.observe(
                        this.el.querySelector('.uppy-Dashboard-inner')
                      ),
                      (this.makeDashboardInsidesVisibleAnywayTimeout =
                        setTimeout(() => {
                          const e = this.getPluginState(),
                            t = !this.opts.inline && e.isHidden
                          e.areInsidesReadyToBeVisible ||
                            t ||
                            (this.uppy.log(
                              "[Dashboard] resize event didn't fire on time: defaulted to mobile layout",
                              'debug'
                            ),
                            this.setPluginState({
                              areInsidesReadyToBeVisible: !0,
                            }))
                        }, 1e3))
                  }),
                  (this.stopListeningToResize = () => {
                    this.resizeObserver.disconnect(),
                      clearTimeout(
                        this.makeDashboardInsidesVisibleAnywayTimeout
                      )
                  }),
                  (this.recordIfFocusedOnUppyRecently = (e) => {
                    this.el.contains(e.target)
                      ? (this.ifFocusedOnUppyRecently = !0)
                      : ((this.ifFocusedOnUppyRecently = !1),
                        this.superFocus.cancel())
                  }),
                  (this.disableAllFocusableElements = (e) => {
                    const t = w(this.el.querySelectorAll(k))
                    e
                      ? t.forEach((e) => {
                          const t = e.getAttribute('tabindex')
                          t && (e.dataset.inertTabindex = t),
                            e.setAttribute('tabindex', '-1')
                        })
                      : t.forEach((e) => {
                          'inertTabindex' in e.dataset
                            ? e.setAttribute(
                                'tabindex',
                                e.dataset.inertTabindex
                              )
                            : e.removeAttribute('tabindex')
                        }),
                      (this.dashboardIsDisabled = e)
                  }),
                  (this.updateBrowserHistory = () => {
                    var e
                    ;(null != (e = history.state) && e[this.modalName]) ||
                      history.pushState(
                        { ...history.state, [this.modalName]: !0 },
                        ''
                      ),
                      window.addEventListener(
                        'popstate',
                        this.handlePopState,
                        !1
                      )
                  }),
                  (this.handlePopState = (e) => {
                    var t
                    !this.isModalOpen() ||
                      (e.state && e.state[this.modalName]) ||
                      this.closeModal({ manualClose: !1 }),
                      !this.isModalOpen() &&
                        null != (t = e.state) &&
                        t[this.modalName] &&
                        history.back()
                  }),
                  (this.handleKeyDownInModal = (e) => {
                    27 === e.keyCode && this.requestCloseModal(e),
                      9 === e.keyCode &&
                        F.forModal(
                          e,
                          this.getPluginState().activeOverlayType,
                          this.el
                        )
                  }),
                  (this.handleClickOutside = () => {
                    this.opts.closeModalOnClickOutside &&
                      this.requestCloseModal()
                  }),
                  (this.handlePaste = (e) => {
                    this.uppy.iteratePlugins((t) => {
                      'acquirer' === t.type &&
                        (null == t.handleRootPaste || t.handleRootPaste(e))
                    })
                    const t = w(e.clipboardData.files)
                    t.length > 0 &&
                      (this.uppy.log('[Dashboard] Files pasted'),
                      this.addFiles(t))
                  }),
                  (this.handleInputChange = (e) => {
                    e.preventDefault()
                    const t = w(e.target.files)
                    t.length > 0 &&
                      (this.uppy.log(
                        '[Dashboard] Files selected through input'
                      ),
                      this.addFiles(t))
                  }),
                  (this.handleDragOver = (e) => {
                    var t, s
                    e.preventDefault(), e.stopPropagation()
                    const i = (() => {
                        let t = !0
                        return (
                          this.uppy.iteratePlugins((s) => {
                            null != s.canHandleRootDrop &&
                              s.canHandleRootDrop(e) &&
                              (t = !0)
                          }),
                          t
                        )
                      })(),
                      r = (() => {
                        const { types: t } = e.dataTransfer
                        return t.some((e) => 'Files' === e)
                      })()
                    if (
                      (!i && !r) ||
                      this.opts.disabled ||
                      (this.opts.disableLocalFiles && (r || !i)) ||
                      !this.uppy.getState().allowNewUpload
                    )
                      return (
                        (e.dataTransfer.dropEffect = 'none'),
                        void clearTimeout(this.removeDragOverClassTimeout)
                      )
                    ;(e.dataTransfer.dropEffect = 'copy'),
                      clearTimeout(this.removeDragOverClassTimeout),
                      this.setPluginState({ isDraggingOver: !0 }),
                      null == (t = (s = this.opts).onDragOver) || t.call(s, e)
                  }),
                  (this.handleDragLeave = (e) => {
                    var t, s
                    e.preventDefault(),
                      e.stopPropagation(),
                      clearTimeout(this.removeDragOverClassTimeout),
                      (this.removeDragOverClassTimeout = setTimeout(() => {
                        this.setPluginState({ isDraggingOver: !1 })
                      }, 50)),
                      null == (t = (s = this.opts).onDragLeave) || t.call(s, e)
                  }),
                  (this.handleDrop = async (e) => {
                    var t, s
                    e.preventDefault(),
                      e.stopPropagation(),
                      clearTimeout(this.removeDragOverClassTimeout),
                      this.setPluginState({ isDraggingOver: !1 }),
                      this.uppy.iteratePlugins((t) => {
                        'acquirer' === t.type &&
                          (null == t.handleRootDrop || t.handleRootDrop(e))
                      })
                    let i = !1
                    const r = await S(e.dataTransfer, {
                      logDropError: (e) => {
                        this.uppy.log(e, 'error'),
                          i || (this.uppy.info(e.message, 'error'), (i = !0))
                      },
                    })
                    r.length > 0 &&
                      (this.uppy.log('[Dashboard] Files dropped'),
                      this.addFiles(r)),
                      null == (t = (s = this.opts).onDrop) || t.call(s, e)
                  }),
                  (this.handleRequestThumbnail = (e) => {
                    this.opts.waitForThumbnailsBeforeUpload ||
                      this.uppy.emit('thumbnail:request', e)
                  }),
                  (this.handleCancelThumbnail = (e) => {
                    this.opts.waitForThumbnailsBeforeUpload ||
                      this.uppy.emit('thumbnail:cancel', e)
                  }),
                  (this.handleKeyDownInInline = (e) => {
                    9 === e.keyCode &&
                      F.forInline(
                        e,
                        this.getPluginState().activeOverlayType,
                        this.el
                      )
                  }),
                  (this.handlePasteOnBody = (e) => {
                    this.el.contains(document.activeElement) &&
                      this.handlePaste(e)
                  }),
                  (this.handleComplete = (e) => {
                    let { failed: t } = e
                    this.opts.closeAfterFinish &&
                      0 === t.length &&
                      this.requestCloseModal()
                  }),
                  (this.handleCancelRestore = () => {
                    this.uppy.emit('restore-canceled')
                  }),
                  Object.defineProperty(this, r, {
                    writable: !0,
                    value: (e) => {
                      const t = e[0]
                      this.canEditFile(t) && this.openFileEditor(t)
                    },
                  }),
                  (this.initEvents = () => {
                    if (this.opts.trigger && !this.opts.inline) {
                      const e = b(this.opts.trigger)
                      e
                        ? e.forEach((e) =>
                            e.addEventListener('click', this.openModal)
                          )
                        : this.uppy.log(
                            'Dashboard modal trigger not found. Make sure `trigger` is set in Dashboard options, unless you are planning to call `dashboard.openModal()` method yourself',
                            'warning'
                          )
                    }
                    this.startListeningToResize(),
                      document.addEventListener(
                        'paste',
                        this.handlePasteOnBody
                      ),
                      this.uppy.on('plugin-remove', this.removeTarget),
                      this.uppy.on('file-added', this.hideAllPanels),
                      this.uppy.on(
                        'dashboard:modal-closed',
                        this.hideAllPanels
                      ),
                      this.uppy.on('file-editor:complete', this.hideAllPanels),
                      this.uppy.on('complete', this.handleComplete),
                      document.addEventListener(
                        'focus',
                        this.recordIfFocusedOnUppyRecently,
                        !0
                      ),
                      document.addEventListener(
                        'click',
                        this.recordIfFocusedOnUppyRecently,
                        !0
                      ),
                      this.opts.inline &&
                        this.el.addEventListener(
                          'keydown',
                          this.handleKeyDownInInline
                        ),
                      this.opts.autoOpenFileEditor &&
                        this.uppy.on('files-added', h(this, r)[r])
                  }),
                  (this.removeEvents = () => {
                    const e = b(this.opts.trigger)
                    !this.opts.inline &&
                      e &&
                      e.forEach((e) =>
                        e.removeEventListener('click', this.openModal)
                      ),
                      this.stopListeningToResize(),
                      document.removeEventListener(
                        'paste',
                        this.handlePasteOnBody
                      ),
                      window.removeEventListener(
                        'popstate',
                        this.handlePopState,
                        !1
                      ),
                      this.uppy.off('plugin-remove', this.removeTarget),
                      this.uppy.off('file-added', this.hideAllPanels),
                      this.uppy.off(
                        'dashboard:modal-closed',
                        this.hideAllPanels
                      ),
                      this.uppy.off('file-editor:complete', this.hideAllPanels),
                      this.uppy.off('complete', this.handleComplete),
                      document.removeEventListener(
                        'focus',
                        this.recordIfFocusedOnUppyRecently
                      ),
                      document.removeEventListener(
                        'click',
                        this.recordIfFocusedOnUppyRecently
                      ),
                      this.opts.inline &&
                        this.el.removeEventListener(
                          'keydown',
                          this.handleKeyDownInInline
                        ),
                      this.opts.autoOpenFileEditor &&
                        this.uppy.off('files-added', h(this, r)[r])
                  }),
                  (this.superFocusOnEachUpdate = () => {
                    const e = this.el.contains(document.activeElement),
                      t =
                        document.activeElement === document.body ||
                        null === document.activeElement,
                      s = 0 === this.uppy.getState().info.length,
                      i = !this.opts.inline
                    s && (i || e || (t && this.ifFocusedOnUppyRecently))
                      ? this.superFocus(
                          this.el,
                          this.getPluginState().activeOverlayType
                        )
                      : this.superFocus.cancel()
                  }),
                  (this.afterUpdate = () => {
                    !this.opts.disabled || this.dashboardIsDisabled
                      ? (!this.opts.disabled &&
                          this.dashboardIsDisabled &&
                          this.disableAllFocusableElements(!1),
                        this.superFocusOnEachUpdate())
                      : this.disableAllFocusableElements(!0)
                  }),
                  (this.saveFileCard = (e, t) => {
                    this.uppy.setFileMeta(t, e), this.toggleFileCard(!1, t)
                  }),
                  Object.defineProperty(this, o, {
                    writable: !0,
                    value: (e) => {
                      const t = this.uppy.getPlugin(e.id)
                      return {
                        ...e,
                        icon: t.icon || this.opts.defaultPickerIcon,
                        render: t.render,
                      }
                    },
                  }),
                  Object.defineProperty(this, n, {
                    writable: !0,
                    value: (e) => {
                      const t = this.uppy.getPlugin(e.id)
                      return (
                        'function' != typeof t.isSupported || t.isSupported()
                      )
                    },
                  }),
                  Object.defineProperty(this, a, {
                    writable: !0,
                    value: C((e) =>
                      e
                        .filter(
                          (e) => 'acquirer' === e.type && h(this, n)[n](e)
                        )
                        .map(h(this, o)[o])
                    ),
                  }),
                  Object.defineProperty(this, l, {
                    writable: !0,
                    value: C((e) =>
                      e
                        .filter((e) => 'progressindicator' === e.type)
                        .map(h(this, o)[o])
                    ),
                  }),
                  Object.defineProperty(this, d, {
                    writable: !0,
                    value: C((e) =>
                      e.filter((e) => 'editor' === e.type).map(h(this, o)[o])
                    ),
                  }),
                  (this.render = (e) => {
                    const t = this.getPluginState(),
                      { files: s, capabilities: i, allowNewUpload: r } = e,
                      {
                        newFiles: o,
                        uploadStartedFiles: n,
                        completeFiles: p,
                        erroredFiles: u,
                        inProgressFiles: c,
                        inProgressNotPausedFiles: f,
                        processingFiles: m,
                        isUploadStarted: g,
                        isAllComplete: y,
                        isAllErrored: v,
                        isAllPaused: b,
                      } = this.uppy.getObjectOfFilesPerState(),
                      w = h(this, a)[a](t.targets),
                      S = h(this, l)[l](t.targets),
                      P = h(this, d)[d](t.targets)
                    let F
                    return (
                      (F =
                        'auto' === this.opts.theme
                          ? i.darkMode
                            ? 'dark'
                            : 'light'
                          : this.opts.theme),
                      ['files', 'folders', 'both'].indexOf(
                        this.opts.fileManagerSelectionType
                      ) < 0 &&
                        ((this.opts.fileManagerSelectionType = 'files'),
                        console.warn(
                          `Unsupported option for "fileManagerSelectionType". Using default of "${this.opts.fileManagerSelectionType}".`
                        )),
                      T({
                        state: e,
                        isHidden: t.isHidden,
                        files: s,
                        newFiles: o,
                        uploadStartedFiles: n,
                        completeFiles: p,
                        erroredFiles: u,
                        inProgressFiles: c,
                        inProgressNotPausedFiles: f,
                        processingFiles: m,
                        isUploadStarted: g,
                        isAllComplete: y,
                        isAllErrored: v,
                        isAllPaused: b,
                        totalFileCount: Object.keys(s).length,
                        totalProgress: e.totalProgress,
                        allowNewUpload: r,
                        acquirers: w,
                        theme: F,
                        disabled: this.opts.disabled,
                        disableLocalFiles: this.opts.disableLocalFiles,
                        direction: this.opts.direction,
                        activePickerPanel: t.activePickerPanel,
                        showFileEditor: t.showFileEditor,
                        saveFileEditor: this.saveFileEditor,
                        disableAllFocusableElements:
                          this.disableAllFocusableElements,
                        animateOpenClose: this.opts.animateOpenClose,
                        isClosing: t.isClosing,
                        progressindicators: S,
                        editors: P,
                        autoProceed: this.uppy.opts.autoProceed,
                        id: this.id,
                        closeModal: this.requestCloseModal,
                        handleClickOutside: this.handleClickOutside,
                        handleInputChange: this.handleInputChange,
                        handlePaste: this.handlePaste,
                        inline: this.opts.inline,
                        showPanel: this.showPanel,
                        hideAllPanels: this.hideAllPanels,
                        i18n: this.i18n,
                        i18nArray: this.i18nArray,
                        uppy: this.uppy,
                        note: this.opts.note,
                        recoveredState: e.recoveredState,
                        metaFields: t.metaFields,
                        resumableUploads: i.resumableUploads || !1,
                        individualCancellation: i.individualCancellation,
                        isMobileDevice: i.isMobileDevice,
                        fileCardFor: t.fileCardFor,
                        toggleFileCard: this.toggleFileCard,
                        toggleAddFilesPanel: this.toggleAddFilesPanel,
                        showAddFilesPanel: t.showAddFilesPanel,
                        saveFileCard: this.saveFileCard,
                        openFileEditor: this.openFileEditor,
                        canEditFile: this.canEditFile,
                        width: this.opts.width,
                        height: this.opts.height,
                        showLinkToFileUploadResult:
                          this.opts.showLinkToFileUploadResult,
                        fileManagerSelectionType:
                          this.opts.fileManagerSelectionType,
                        proudlyDisplayPoweredByUppy:
                          this.opts.proudlyDisplayPoweredByUppy,
                        hideCancelButton: this.opts.hideCancelButton,
                        hideRetryButton: this.opts.hideRetryButton,
                        hidePauseResumeButton: this.opts.hidePauseResumeButton,
                        showRemoveButtonAfterComplete:
                          this.opts.showRemoveButtonAfterComplete,
                        containerWidth: t.containerWidth,
                        containerHeight: t.containerHeight,
                        areInsidesReadyToBeVisible:
                          t.areInsidesReadyToBeVisible,
                        isTargetDOMEl: this.isTargetDOMEl,
                        parentElement: this.el,
                        allowedFileTypes:
                          this.uppy.opts.restrictions.allowedFileTypes,
                        maxNumberOfFiles:
                          this.uppy.opts.restrictions.maxNumberOfFiles,
                        requiredMetaFields:
                          this.uppy.opts.restrictions.requiredMetaFields,
                        showSelectedFiles: this.opts.showSelectedFiles,
                        handleCancelRestore: this.handleCancelRestore,
                        handleRequestThumbnail: this.handleRequestThumbnail,
                        handleCancelThumbnail: this.handleCancelThumbnail,
                        isDraggingOver: t.isDraggingOver,
                        handleDragOver: this.handleDragOver,
                        handleDragLeave: this.handleDragLeave,
                        handleDrop: this.handleDrop,
                      })
                    )
                  }),
                  (this.discoverProviderPlugins = () => {
                    this.uppy.iteratePlugins((e) => {
                      e &&
                        !e.target &&
                        e.opts &&
                        e.opts.target === this.constructor &&
                        this.addTarget(e)
                    })
                  }),
                  (this.install = () => {
                    this.setPluginState({
                      isHidden: !0,
                      fileCardFor: null,
                      activeOverlayType: null,
                      showAddFilesPanel: !1,
                      activePickerPanel: !1,
                      showFileEditor: !1,
                      metaFields: this.opts.metaFields,
                      targets: [],
                      areInsidesReadyToBeVisible: !1,
                      isDraggingOver: !1,
                    })
                    const { inline: e, closeAfterFinish: t } = this.opts
                    if (e && t)
                      throw new Error(
                        '[Dashboard] `closeAfterFinish: true` cannot be used on an inline Dashboard, because an inline Dashboard cannot be closed at all. Either set `inline: false`, or disable the `closeAfterFinish` option.'
                      )
                    const {
                      allowMultipleUploads: s,
                      allowMultipleUploadBatches: i,
                    } = this.uppy.opts
                    ;(s || i) &&
                      t &&
                      this.uppy.log(
                        '[Dashboard] When using `closeAfterFinish`, we recommended setting the `allowMultipleUploadBatches` option to `false` in the Uppy constructor. See https://uppy.io/docs/uppy/#allowMultipleUploads-true',
                        'warning'
                      )
                    const { target: r } = this.opts
                    r && this.mount(r, this),
                      (this.opts.plugins || []).forEach((e) => {
                        const t = this.uppy.getPlugin(e)
                        t && t.mount(this, t)
                      }),
                      this.opts.disableStatusBar ||
                        this.uppy.use(g, {
                          id: `${this.id}:StatusBar`,
                          target: this,
                          hideUploadButton: this.opts.hideUploadButton,
                          hideRetryButton: this.opts.hideRetryButton,
                          hidePauseResumeButton:
                            this.opts.hidePauseResumeButton,
                          hideCancelButton: this.opts.hideCancelButton,
                          showProgressDetails: this.opts.showProgressDetails,
                          hideAfterFinish: this.opts.hideProgressAfterFinish,
                          locale: this.opts.locale,
                          doneButtonHandler: this.opts.doneButtonHandler,
                        }),
                      this.opts.disableInformer ||
                        this.uppy.use(y, {
                          id: `${this.id}:Informer`,
                          target: this,
                        }),
                      this.opts.disableThumbnailGenerator ||
                        this.uppy.use(v, {
                          id: `${this.id}:ThumbnailGenerator`,
                          thumbnailWidth: this.opts.thumbnailWidth,
                          thumbnailHeight: this.opts.thumbnailHeight,
                          thumbnailType: this.opts.thumbnailType,
                          waitForThumbnailsBeforeUpload:
                            this.opts.waitForThumbnailsBeforeUpload,
                          lazy: !this.opts.waitForThumbnailsBeforeUpload,
                        }),
                      (this.darkModeMediaQuery =
                        'undefined' != typeof window && window.matchMedia
                          ? window.matchMedia('(prefers-color-scheme: dark)')
                          : null)
                    const o =
                      !!this.darkModeMediaQuery &&
                      this.darkModeMediaQuery.matches
                    this.uppy.log(
                      '[Dashboard] Dark mode is ' + (o ? 'on' : 'off')
                    ),
                      this.setDarkModeCapability(o),
                      'auto' === this.opts.theme &&
                        this.darkModeMediaQuery.addListener(
                          this.handleSystemDarkModeChange
                        ),
                      this.discoverProviderPlugins(),
                      this.initEvents()
                  }),
                  (this.uninstall = () => {
                    if (!this.opts.disableInformer) {
                      const e = this.uppy.getPlugin(`${this.id}:Informer`)
                      e && this.uppy.removePlugin(e)
                    }
                    if (!this.opts.disableStatusBar) {
                      const e = this.uppy.getPlugin(`${this.id}:StatusBar`)
                      e && this.uppy.removePlugin(e)
                    }
                    if (!this.opts.disableThumbnailGenerator) {
                      const e = this.uppy.getPlugin(
                        `${this.id}:ThumbnailGenerator`
                      )
                      e && this.uppy.removePlugin(e)
                    }
                    ;(this.opts.plugins || []).forEach((e) => {
                      const t = this.uppy.getPlugin(e)
                      t && t.unmount()
                    }),
                      'auto' === this.opts.theme &&
                        this.darkModeMediaQuery.removeListener(
                          this.handleSystemDarkModeChange
                        ),
                      this.unmount(),
                      this.removeEvents()
                  }),
                  (this.id = this.opts.id || 'Dashboard'),
                  (this.title = 'Dashboard'),
                  (this.type = 'orchestrator'),
                  (this.modalName = `uppy-Dashboard-${P()}`),
                  (this.defaultLocale = O)
                const i = {
                  target: 'body',
                  metaFields: [],
                  trigger: null,
                  inline: !1,
                  width: 750,
                  height: 550,
                  thumbnailWidth: 280,
                  thumbnailType: 'image/jpeg',
                  waitForThumbnailsBeforeUpload: !1,
                  defaultPickerIcon: A,
                  showLinkToFileUploadResult: !1,
                  showProgressDetails: !1,
                  hideUploadButton: !1,
                  hideCancelButton: !1,
                  hideRetryButton: !1,
                  hidePauseResumeButton: !1,
                  hideProgressAfterFinish: !1,
                  doneButtonHandler: () => {
                    this.uppy.reset(), this.requestCloseModal()
                  },
                  note: null,
                  closeModalOnClickOutside: !1,
                  closeAfterFinish: !1,
                  disableStatusBar: !1,
                  disableInformer: !1,
                  disableThumbnailGenerator: !1,
                  disablePageScrollWhenModalOpen: !0,
                  animateOpenClose: !0,
                  fileManagerSelectionType: 'files',
                  proudlyDisplayPoweredByUppy: !0,
                  onRequestCloseModal: () => this.closeModal(),
                  showSelectedFiles: !0,
                  showRemoveButtonAfterComplete: !1,
                  browserBackButtonClose: !1,
                  theme: 'light',
                  autoOpenFileEditor: !1,
                  disabled: !1,
                  disableLocalFiles: !1,
                }
                ;(this.opts = { ...i, ...t }),
                  this.i18nInit(),
                  (this.superFocus = _()),
                  (this.ifFocusedOnUppyRecently = !1),
                  (this.makeDashboardInsidesVisibleAnywayTimeout = null),
                  (this.removeDragOverClassTimeout = null)
              }
            }),
          (i.VERSION = '2.2.0'),
          p)
      },
      5233: (e) => {
        e.exports = {
          strings: {
            closeModal: 'Close Modal',
            addMoreFiles: 'Add more files',
            addingMoreFiles: 'Adding more files',
            importFrom: 'Import from %{name}',
            dashboardWindowTitle:
              'Uppy Dashboard Window (Press escape to close)',
            dashboardTitle: 'Uppy Dashboard',
            copyLinkToClipboardSuccess: 'Link copied to clipboard.',
            copyLinkToClipboardFallback: 'Copy the URL below',
            copyLink: 'Copy link',
            back: 'Back',
            removeFile: 'Remove file',
            editFile: 'Edit file',
            editing: 'Editing %{file}',
            finishEditingFile: 'Finish editing file',
            saveChanges: 'Save changes',
            myDevice: 'My Device',
            dropHint: 'Drop your files here',
            uploadComplete: 'Upload complete',
            uploadPaused: 'Upload paused',
            resumeUpload: 'Resume upload',
            pauseUpload: 'Pause upload',
            retryUpload: 'Retry upload',
            cancelUpload: 'Cancel upload',
            xFilesSelected: {
              0: '%{smart_count} file selected',
              1: '%{smart_count} files selected',
            },
            uploadingXFiles: {
              0: 'Uploading %{smart_count} file',
              1: 'Uploading %{smart_count} files',
            },
            processingXFiles: {
              0: 'Processing %{smart_count} file',
              1: 'Processing %{smart_count} files',
            },
            poweredBy: 'Powered by %{uppy}',
            addMore: 'Add more',
            editFileWithFilename: 'Edit file %{file}',
            save: 'Save',
            cancel: 'Cancel',
            dropPasteFiles: 'Drop files here or %{browseFiles}',
            dropPasteFolders: 'Drop files here or %{browseFolders}',
            dropPasteBoth:
              'Drop files here, %{browseFiles} or %{browseFolders}',
            dropPasteImportFiles:
              'Drop files here, %{browseFiles} or import from:',
            dropPasteImportFolders:
              'Drop files here, %{browseFolders} or import from:',
            dropPasteImportBoth:
              'Drop files here, %{browseFiles}, %{browseFolders} or import from:',
            importFiles: 'Import files from:',
            browseFiles: 'browse files',
            browseFolders: 'browse folders',
            recoveredXFiles: {
              0: 'We could not fully recover 1 file. Please re-select it and resume the upload.',
              1: 'We could not fully recover %{smart_count} files. Please re-select them and resume the upload.',
            },
            recoveredAllFiles:
              'We restored all files. You can now resume the upload.',
            sessionRestored: 'Session restored',
            reSelect: 'Re-select',
            missingRequiredMetaFields: {
              0: 'Missing required meta field: %{fields}.',
              1: 'Missing required meta fields: %{fields}.',
            },
          },
        }
      },
      818: (e) => {
        e.exports = function (e, t) {
          return (
            (t = t || 'Copy the URL below'),
            new Promise((s) => {
              const i = document.createElement('textarea')
              i.setAttribute('style', {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '2em',
                height: '2em',
                padding: 0,
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent',
              }),
                (i.value = e),
                document.body.appendChild(i),
                i.select()
              const r = () => {
                document.body.removeChild(i), window.prompt(t, e), s()
              }
              try {
                return document.execCommand('copy')
                  ? (document.body.removeChild(i), s())
                  : r()
              } catch (e) {
                return document.body.removeChild(i), r()
              }
            })
          )
        }
      },
      6673: (e, t, s) => {
        const i = s(1296),
          r = s(9045),
          o = s(6470)
        e.exports = function () {
          let e = !1
          return i((t, s) => {
            const i = o(t, s),
              n = i.contains(document.activeElement)
            if (n && e) return
            const a = i.querySelector('[data-uppy-super-focusable]')
            if (!n || a)
              if (a) a.focus({ preventScroll: !0 }), (e = !0)
              else {
                const t = i.querySelector(r)
                null == t || t.focus({ preventScroll: !0 }), (e = !1)
              }
          }, 260)
        }
      },
      6470: (e) => {
        e.exports = function (e, t) {
          if (t) {
            const s = e.querySelector(`[data-uppy-paneltype="${t}"]`)
            if (s) return s
          }
          return e
        }
      },
      1882: (e, t, s) => {
        const { h: i } = s(6400)
        e.exports = function (e) {
          const t = {
            color: '#838999',
            icon: i(
              'svg',
              {
                'aria-hidden': 'true',
                focusable: 'false',
                className: 'uppy-c-icon',
                width: '25',
                height: '25',
                viewBox: '0 0 25 25',
              },
              i(
                'g',
                { fill: '#A7AFB7', fillRule: 'nonzero' },
                i('path', {
                  d: 'M5.5 22a.5.5 0 0 1-.5-.5v-18a.5.5 0 0 1 .5-.5h10.719a.5.5 0 0 1 .367.16l3.281 3.556a.5.5 0 0 1 .133.339V21.5a.5.5 0 0 1-.5.5h-14zm.5-1h13V7.25L16 4H6v17z',
                }),
                i('path', { d: 'M15 4v3a1 1 0 0 0 1 1h3V7h-3V4h-1z' })
              )
            ),
          }
          if (!e) return t
          const s = e.split('/')[0],
            r = e.split('/')[1]
          return 'text' === s
            ? {
                color: '#5a5e69',
                icon: i(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    className: 'uppy-c-icon',
                    width: '25',
                    height: '25',
                    viewBox: '0 0 25 25',
                  },
                  i('path', {
                    d: 'M4.5 7h13a.5.5 0 1 1 0 1h-13a.5.5 0 0 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h15a.5.5 0 1 1 0 1h-15a.5.5 0 1 1 0-1zm0 3h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z',
                    fill: '#5A5E69',
                    fillRule: 'nonzero',
                  })
                ),
              }
            : 'image' === s
            ? {
                color: '#686de0',
                icon: i(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    width: '25',
                    height: '25',
                    viewBox: '0 0 25 25',
                  },
                  i(
                    'g',
                    { fill: '#686DE0', fillRule: 'evenodd' },
                    i('path', {
                      d: 'M5 7v10h15V7H5zm0-1h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z',
                      fillRule: 'nonzero',
                    }),
                    i('path', {
                      d: 'M6.35 17.172l4.994-5.026a.5.5 0 0 1 .707 0l2.16 2.16 3.505-3.505a.5.5 0 0 1 .707 0l2.336 2.31-.707.72-1.983-1.97-3.505 3.505a.5.5 0 0 1-.707 0l-2.16-2.159-3.938 3.939-1.409.026z',
                      fillRule: 'nonzero',
                    }),
                    i('circle', { cx: '7.5', cy: '9.5', r: '1.5' })
                  )
                ),
              }
            : 'audio' === s
            ? {
                color: '#068dbb',
                icon: i(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    className: 'uppy-c-icon',
                    width: '25',
                    height: '25',
                    viewBox: '0 0 25 25',
                  },
                  i('path', {
                    d: 'M9.5 18.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V7.25a.5.5 0 0 1 .379-.485l9-2.25A.5.5 0 0 1 18.5 5v11.64c0 1.14-1.145 2-2.5 2s-2.5-.86-2.5-2c0-1.14 1.145-2 2.5-2 .557 0 1.079.145 1.5.396V8.67l-8 2v7.97zm8-11v-2l-8 2v2l8-2zM7 19.64c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1zm9-2c.855 0 1.5-.484 1.5-1s-.645-1-1.5-1-1.5.484-1.5 1 .645 1 1.5 1z',
                    fill: '#049BCF',
                    fillRule: 'nonzero',
                  })
                ),
              }
            : 'video' === s
            ? {
                color: '#19af67',
                icon: i(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    className: 'uppy-c-icon',
                    width: '25',
                    height: '25',
                    viewBox: '0 0 25 25',
                  },
                  i('path', {
                    d: 'M16 11.834l4.486-2.691A1 1 0 0 1 22 10v6a1 1 0 0 1-1.514.857L16 14.167V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2.834zM15 9H5v8h10V9zm1 4l5 3v-6l-5 3z',
                    fill: '#19AF67',
                    fillRule: 'nonzero',
                  })
                ),
              }
            : 'application' === s && 'pdf' === r
            ? {
                color: '#e25149',
                icon: i(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    className: 'uppy-c-icon',
                    width: '25',
                    height: '25',
                    viewBox: '0 0 25 25',
                  },
                  i('path', {
                    d: 'M9.766 8.295c-.691-1.843-.539-3.401.747-3.726 1.643-.414 2.505.938 2.39 3.299-.039.79-.194 1.662-.537 3.148.324.49.66.967 1.055 1.51.17.231.382.488.629.757 1.866-.128 3.653.114 4.918.655 1.487.635 2.192 1.685 1.614 2.84-.566 1.133-1.839 1.084-3.416.249-1.141-.604-2.457-1.634-3.51-2.707a13.467 13.467 0 0 0-2.238.426c-1.392 4.051-4.534 6.453-5.707 4.572-.986-1.58 1.38-4.206 4.914-5.375.097-.322.185-.656.264-1.001.08-.353.306-1.31.407-1.737-.678-1.059-1.2-2.031-1.53-2.91zm2.098 4.87c-.033.144-.068.287-.104.427l.033-.01-.012.038a14.065 14.065 0 0 1 1.02-.197l-.032-.033.052-.004a7.902 7.902 0 0 1-.208-.271c-.197-.27-.38-.526-.555-.775l-.006.028-.002-.003c-.076.323-.148.632-.186.8zm5.77 2.978c1.143.605 1.832.632 2.054.187.26-.519-.087-1.034-1.113-1.473-.911-.39-2.175-.608-3.55-.608.845.766 1.787 1.459 2.609 1.894zM6.559 18.789c.14.223.693.16 1.425-.413.827-.648 1.61-1.747 2.208-3.206-2.563 1.064-4.102 2.867-3.633 3.62zm5.345-10.97c.088-1.793-.351-2.48-1.146-2.28-.473.119-.564 1.05-.056 2.405.213.566.52 1.188.908 1.859.18-.858.268-1.453.294-1.984z',
                    fill: '#E2514A',
                    fillRule: 'nonzero',
                  })
                ),
              }
            : 'application' === s &&
              -1 !==
                [
                  'zip',
                  'x-7z-compressed',
                  'x-rar-compressed',
                  'x-tar',
                  'x-gzip',
                  'x-apple-diskimage',
                ].indexOf(r)
            ? {
                color: '#00C469',
                icon: i(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    width: '25',
                    height: '25',
                    viewBox: '0 0 25 25',
                  },
                  i('path', {
                    d: 'M10.45 2.05h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V2.55a.5.5 0 0 1 .5-.5zm2.05 1.024h1.05a.5.5 0 0 1 .5.5V3.6a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5v-.001zM10.45 0h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5V.5a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 3.074h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-2.05 1.024h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm-2.05 1.025h1.05a.5.5 0 0 1 .5.5v.025a.5.5 0 0 1-.5.5h-1.05a.5.5 0 0 1-.5-.5v-.025a.5.5 0 0 1 .5-.5zm2.05 1.025h1.05a.5.5 0 0 1 .5.5v.024a.5.5 0 0 1-.5.5H12.5a.5.5 0 0 1-.5-.5v-.024a.5.5 0 0 1 .5-.5zm-1.656 3.074l-.82 5.946c.52.302 1.174.458 1.976.458.803 0 1.455-.156 1.975-.458l-.82-5.946h-2.311zm0-1.025h2.312c.512 0 .946.378 1.015.885l.82 5.946c.056.412-.142.817-.501 1.026-.686.398-1.515.597-2.49.597-.974 0-1.804-.199-2.49-.597a1.025 1.025 0 0 1-.5-1.026l.819-5.946c.07-.507.503-.885 1.015-.885zm.545 6.6a.5.5 0 0 1-.397-.561l.143-.999a.5.5 0 0 1 .495-.429h.74a.5.5 0 0 1 .495.43l.143.998a.5.5 0 0 1-.397.561c-.404.08-.819.08-1.222 0z',
                    fill: '#00C469',
                    fillRule: 'nonzero',
                  })
                ),
              }
            : t
        }
      },
      8805: (e) => {
        e.exports = function (e) {
          const { tagName: t } = e.target
          'INPUT' !== t && 'TEXTAREA' !== t
            ? (e.preventDefault(), e.stopPropagation())
            : e.stopPropagation()
        }
      },
      3962: (e, t, s) => {
        const i = s(6361),
          r = s(9045),
          o = s(6470)
        function n(e, t) {
          const s = t[0]
          s && (s.focus(), e.preventDefault())
        }
        function a(e, t, s) {
          const a = o(s, t),
            l = i(a.querySelectorAll(r)),
            d = l.indexOf(document.activeElement)
          !(function (e) {
            return e.contains(document.activeElement)
          })(a)
            ? n(e, l)
            : e.shiftKey && 0 === d
            ? (function (e, t) {
                const s = t[t.length - 1]
                s && (s.focus(), e.preventDefault())
              })(e, l)
            : e.shiftKey || d !== l.length - 1 || n(e, l)
        }
        e.exports = {
          forModal: (e, t, s) => {
            a(e, t, s)
          },
          forInline: (e, t, s) => {
            null === t || a(e, t, s)
          },
        }
      },
      1623: (e, t, s) => {
        'use strict'
        const { h: i, Component: r, createRef: o } = s(6400)
        e.exports = class extends r {
          constructor() {
            super(...arguments), (this.ref = o())
          }
          componentWillEnter(e) {
            ;(this.ref.current.style.opacity = '1'),
              (this.ref.current.style.transform = 'none'),
              setTimeout(e, 300)
          }
          componentWillLeave(e) {
            ;(this.ref.current.style.opacity = '0'),
              (this.ref.current.style.transform = 'translateY(350%)'),
              setTimeout(e, 300)
          }
          render() {
            const { children: e } = this.props
            return i(
              'div',
              { className: 'uppy-Informer-animated', ref: this.ref },
              e
            )
          }
        }
      },
      6455: (e, t, s) => {
        'use strict'
        const { Component: i, cloneElement: r, h: o, toChildArray: n } = s(6400)
        function a(e, t) {
          const s = e._ptgLinkedRefs || (e._ptgLinkedRefs = {})
          return (
            s[t] ||
            (s[t] = (s) => {
              e.refs[t] = s
            })
          )
        }
        function l(e) {
          const t = {}
          for (let o = 0; o < e.length; o++)
            null != e[o] &&
              (t[
                ((s = e[o]),
                (i = o.toString(36)),
                void 0,
                null != (r = null == s ? void 0 : s.key) ? r : i)
              ] = e[o])
          var s, i, r
          return t
        }
        function d(e, t) {
          ;(e = e || {}), (t = t || {})
          const s = (s) => (t.hasOwnProperty(s) ? t[s] : e[s]),
            i = {}
          let r = []
          for (const s in e)
            t.hasOwnProperty(s) ? r.length && ((i[s] = r), (r = [])) : r.push(s)
          const o = {}
          for (const e in t) {
            if (i.hasOwnProperty(e))
              for (let t = 0; t < i[e].length; t++) {
                const r = i[e][t]
                o[i[e][t]] = s(r)
              }
            o[e] = s(e)
          }
          for (let e = 0; e < r.length; e++) o[r[e]] = s(r[e])
          return o
        }
        class p extends i {
          constructor(e, t) {
            super(e, t),
              (this.refs = {}),
              (this.state = { children: l(n(n(this.props.children)) || []) }),
              (this.performAppear = this.performAppear.bind(this)),
              (this.performEnter = this.performEnter.bind(this)),
              (this.performLeave = this.performLeave.bind(this))
          }
          componentWillMount() {
            ;(this.currentlyTransitioningKeys = {}),
              (this.keysToAbortLeave = []),
              (this.keysToEnter = []),
              (this.keysToLeave = [])
          }
          componentDidMount() {
            const e = this.state.children
            for (const t in e) e[t] && this.performAppear(t)
          }
          componentWillReceiveProps(e) {
            const t = l(n(e.children) || []),
              s = this.state.children
            let i
            for (i in (this.setState((e) => ({ children: d(e.children, t) })),
            t))
              if (t.hasOwnProperty(i)) {
                const e = s && s.hasOwnProperty(i)
                t[i] && e && this.currentlyTransitioningKeys[i]
                  ? (this.keysToEnter.push(i), this.keysToAbortLeave.push(i))
                  : !t[i] ||
                    e ||
                    this.currentlyTransitioningKeys[i] ||
                    this.keysToEnter.push(i)
              }
            for (i in s)
              if (s.hasOwnProperty(i)) {
                const e = t && t.hasOwnProperty(i)
                !s[i] ||
                  e ||
                  this.currentlyTransitioningKeys[i] ||
                  this.keysToLeave.push(i)
              }
          }
          componentDidUpdate() {
            const { keysToEnter: e } = this
            ;(this.keysToEnter = []), e.forEach(this.performEnter)
            const { keysToLeave: t } = this
            ;(this.keysToLeave = []), t.forEach(this.performLeave)
          }
          _finishAbort(e) {
            const t = this.keysToAbortLeave.indexOf(e)
            ;-1 !== t && this.keysToAbortLeave.splice(t, 1)
          }
          performAppear(e) {
            this.currentlyTransitioningKeys[e] = !0
            const t = this.refs[e]
            t.componentWillAppear
              ? t.componentWillAppear(this._handleDoneAppearing.bind(this, e))
              : this._handleDoneAppearing(e)
          }
          _handleDoneAppearing(e) {
            const t = this.refs[e]
            t.componentDidAppear && t.componentDidAppear(),
              delete this.currentlyTransitioningKeys[e],
              this._finishAbort(e)
            const s = l(n(this.props.children) || [])
            ;(s && s.hasOwnProperty(e)) || this.performLeave(e)
          }
          performEnter(e) {
            this.currentlyTransitioningKeys[e] = !0
            const t = this.refs[e]
            t.componentWillEnter
              ? t.componentWillEnter(this._handleDoneEntering.bind(this, e))
              : this._handleDoneEntering(e)
          }
          _handleDoneEntering(e) {
            const t = this.refs[e]
            t.componentDidEnter && t.componentDidEnter(),
              delete this.currentlyTransitioningKeys[e],
              this._finishAbort(e)
            const s = l(n(this.props.children) || [])
            ;(s && s.hasOwnProperty(e)) || this.performLeave(e)
          }
          performLeave(e) {
            if (-1 !== this.keysToAbortLeave.indexOf(e)) return
            this.currentlyTransitioningKeys[e] = !0
            const t = this.refs[e]
            t.componentWillLeave
              ? t.componentWillLeave(this._handleDoneLeaving.bind(this, e))
              : this._handleDoneLeaving(e)
          }
          _handleDoneLeaving(e) {
            if (-1 !== this.keysToAbortLeave.indexOf(e)) return
            const t = this.refs[e]
            t.componentDidLeave && t.componentDidLeave(),
              delete this.currentlyTransitioningKeys[e]
            const s = l(n(this.props.children) || [])
            if (s && s.hasOwnProperty(e)) this.performEnter(e)
            else {
              const t =
                ((i = {}), (r = this.state.children), Object.assign(i, r))
              delete t[e], this.setState({ children: t })
            }
            var i, r
          }
          render(e, t) {
            let {
                childFactory: s,
                transitionLeave: i,
                transitionName: n,
                transitionAppear: l,
                transitionEnter: d,
                transitionLeaveTimeout: p,
                transitionEnterTimeout: h,
                transitionAppearTimeout: u,
                component: c,
                ...f
              } = e,
              { children: m } = t
            const g = []
            for (const e in m)
              if (m.hasOwnProperty(e)) {
                const t = m[e]
                if (t) {
                  const i = a(this, e),
                    o = r(s(t), { ref: i, key: e })
                  g.push(o)
                }
              }
            return o(c, f, g)
          }
        }
        ;(p.defaultProps = { component: 'span', childFactory: (e) => e }),
          (e.exports = p)
      },
      873: (e, t, s) => {
        'use strict'
        var i, r
        const { h: o } = s(6400),
          { UIPlugin: n } = s(9429),
          a = s(1623),
          l = s(6455)
        e.exports =
          ((r = i =
            class extends n {
              constructor(e, t) {
                super(e, t),
                  (this.render = (e) =>
                    o(
                      'div',
                      { className: 'uppy uppy-Informer' },
                      o(
                        l,
                        null,
                        e.info.map((e) =>
                          o(
                            a,
                            { key: e.message },
                            o(
                              'p',
                              { role: 'alert' },
                              e.message,
                              ' ',
                              e.details &&
                                o(
                                  'span',
                                  {
                                    'aria-label': e.details,
                                    'data-microtip-position': 'top-left',
                                    'data-microtip-size': 'medium',
                                    role: 'tooltip',
                                    onClick: () =>
                                      alert(`${e.message} \n\n ${e.details}`),
                                  },
                                  '?'
                                )
                            )
                          )
                        )
                      )
                    )),
                  (this.type = 'progressindicator'),
                  (this.id = this.opts.id || 'Informer'),
                  (this.title = 'Informer'),
                  (this.opts = { ...t })
              }
              install() {
                const { target: e } = this.opts
                e && this.mount(e, this)
              }
            }),
          (i.VERSION = '2.0.5'),
          r)
      },
      6273: (e) => {
        'use strict'
        var t = 0
        function s(e) {
          return '__private_' + t++ + '_' + e
        }
        var i = s('publish')
        class r {
          constructor() {
            Object.defineProperty(this, i, { value: o }),
              (this.state = {}),
              (this.callbacks = [])
          }
          getState() {
            return this.state
          }
          setState(e) {
            const t = { ...this.state },
              s = { ...this.state, ...e }
            ;(this.state = s),
              (function (e, t) {
                if (!Object.prototype.hasOwnProperty.call(e, t))
                  throw new TypeError(
                    'attempted to use private field on non-instance'
                  )
                return e
              })(this, i)[i](t, s, e)
          }
          subscribe(e) {
            return (
              this.callbacks.push(e),
              () => {
                this.callbacks.splice(this.callbacks.indexOf(e), 1)
              }
            )
          }
        }
        function o() {
          for (var e = arguments.length, t = new Array(e), s = 0; s < e; s++)
            t[s] = arguments[s]
          this.callbacks.forEach((e) => {
            e(...t)
          })
        }
        ;(r.VERSION = '2.0.3'),
          (e.exports = function () {
            return new r()
          })
      },
      7753: (e, t, s) => {
        var i, r
        const { UIPlugin: o } = s(9429),
          n = s(3517),
          a = s(6508),
          l = s(9373),
          { rotation: d } = s(1443),
          p = s(3107)
        e.exports =
          ((r = i =
            class extends o {
              constructor(e, t) {
                if (
                  (super(e, t),
                  (this.onFileAdded = (e) => {
                    !e.preview &&
                      e.data &&
                      l(e.type) &&
                      !e.isRemote &&
                      this.addToQueue(e.id)
                  }),
                  (this.onCancelRequest = (e) => {
                    const t = this.queue.indexOf(e.id)
                    ;-1 !== t && this.queue.splice(t, 1)
                  }),
                  (this.onFileRemoved = (e) => {
                    const t = this.queue.indexOf(e.id)
                    ;-1 !== t && this.queue.splice(t, 1),
                      e.preview &&
                        a(e.preview) &&
                        URL.revokeObjectURL(e.preview)
                  }),
                  (this.onRestored = () => {
                    this.uppy
                      .getFiles()
                      .filter((e) => e.isRestored)
                      .forEach((e) => {
                        ;(e.preview && !a(e.preview)) || this.addToQueue(e.id)
                      })
                  }),
                  (this.onAllFilesRemoved = () => {
                    this.queue = []
                  }),
                  (this.waitUntilAllProcessed = (e) => {
                    e.forEach((e) => {
                      const t = this.uppy.getFile(e)
                      this.uppy.emit('preprocess-progress', t, {
                        mode: 'indeterminate',
                        message: this.i18n('generatingThumbnails'),
                      })
                    })
                    const t = () => {
                      e.forEach((e) => {
                        const t = this.uppy.getFile(e)
                        this.uppy.emit('preprocess-complete', t)
                      })
                    }
                    return new Promise((e) => {
                      this.queueProcessing
                        ? this.uppy.once('thumbnail:all-generated', () => {
                            t(), e()
                          })
                        : (t(), e())
                    })
                  }),
                  (this.type = 'modifier'),
                  (this.id = this.opts.id || 'ThumbnailGenerator'),
                  (this.title = 'Thumbnail Generator'),
                  (this.queue = []),
                  (this.queueProcessing = !1),
                  (this.defaultThumbnailDimension = 200),
                  (this.thumbnailType =
                    this.opts.thumbnailType || 'image/jpeg'),
                  (this.defaultLocale = p),
                  (this.opts = {
                    thumbnailWidth: null,
                    thumbnailHeight: null,
                    waitForThumbnailsBeforeUpload: !1,
                    lazy: !1,
                    ...t,
                  }),
                  this.i18nInit(),
                  this.opts.lazy && this.opts.waitForThumbnailsBeforeUpload)
                )
                  throw new Error(
                    'ThumbnailGenerator: The `lazy` and `waitForThumbnailsBeforeUpload` options are mutually exclusive. Please ensure at most one of them is set to `true`.'
                  )
              }
              createThumbnail(e, t, s) {
                const i = URL.createObjectURL(e.data),
                  r = new Promise((e, t) => {
                    const s = new Image()
                    ;(s.src = i),
                      s.addEventListener('load', () => {
                        URL.revokeObjectURL(i), e(s)
                      }),
                      s.addEventListener('error', (e) => {
                        URL.revokeObjectURL(i),
                          t(e.error || new Error('Could not create thumbnail'))
                      })
                  }),
                  o = d(e.data).catch(() => 1)
                return Promise.all([r, o])
                  .then((e) => {
                    let [i, r] = e
                    const o = this.getProportionalDimensions(i, t, s, r.deg),
                      n = this.rotateImage(i, r),
                      a = this.resizeImage(n, o.width, o.height)
                    return this.canvasToBlob(a, this.thumbnailType, 80)
                  })
                  .then((e) => URL.createObjectURL(e))
              }
              getProportionalDimensions(e, t, s, i) {
                let r = e.width / e.height
                return (
                  (90 !== i && 270 !== i) || (r = e.height / e.width),
                  null != t
                    ? { width: t, height: Math.round(t / r) }
                    : null != s
                    ? { width: Math.round(s * r), height: s }
                    : {
                        width: this.defaultThumbnailDimension,
                        height: Math.round(this.defaultThumbnailDimension / r),
                      }
                )
              }
              protect(e) {
                const t = e.width / e.height,
                  s = 5e6,
                  i = 4096
                let r = Math.floor(Math.sqrt(s * t)),
                  o = Math.floor(s / Math.sqrt(s * t))
                if (
                  (r > i && ((r = i), (o = Math.round(r / t))),
                  o > i && ((o = i), (r = Math.round(t * o))),
                  e.width > r)
                ) {
                  const t = document.createElement('canvas')
                  ;(t.width = r),
                    (t.height = o),
                    t.getContext('2d').drawImage(e, 0, 0, r, o),
                    (e = t)
                }
                return e
              }
              resizeImage(e, t, s) {
                e = this.protect(e)
                let i = Math.ceil(Math.log2(e.width / t))
                i < 1 && (i = 1)
                let r = t * 2 ** (i - 1),
                  o = s * 2 ** (i - 1)
                for (; i--; ) {
                  const t = document.createElement('canvas')
                  ;(t.width = r),
                    (t.height = o),
                    t.getContext('2d').drawImage(e, 0, 0, r, o),
                    (e = t),
                    (r = Math.round(r / 2)),
                    (o = Math.round(o / 2))
                }
                return e
              }
              rotateImage(e, t) {
                let s = e.width,
                  i = e.height
                ;(90 !== t.deg && 270 !== t.deg) ||
                  ((s = e.height), (i = e.width))
                const r = document.createElement('canvas')
                ;(r.width = s), (r.height = i)
                const o = r.getContext('2d')
                return (
                  o.translate(s / 2, i / 2),
                  t.canvas && (o.rotate(t.rad), o.scale(t.scaleX, t.scaleY)),
                  o.drawImage(
                    e,
                    -e.width / 2,
                    -e.height / 2,
                    e.width,
                    e.height
                  ),
                  r
                )
              }
              canvasToBlob(e, t, s) {
                try {
                  e.getContext('2d').getImageData(0, 0, 1, 1)
                } catch (e) {
                  if (18 === e.code)
                    return Promise.reject(
                      new Error(
                        'cannot read image, probably an svg with external resources'
                      )
                    )
                }
                return e.toBlob
                  ? new Promise((i) => {
                      e.toBlob(i, t, s)
                    }).then((e) => {
                      if (null === e)
                        throw new Error(
                          'cannot read image, probably an svg with external resources'
                        )
                      return e
                    })
                  : Promise.resolve()
                      .then(() => n(e.toDataURL(t, s), {}))
                      .then((e) => {
                        if (null === e)
                          throw new Error(
                            'could not extract blob, probably an old browser'
                          )
                        return e
                      })
              }
              setPreviewURL(e, t) {
                this.uppy.setFileState(e, { preview: t })
              }
              addToQueue(e) {
                this.queue.push(e),
                  !1 === this.queueProcessing && this.processQueue()
              }
              processQueue() {
                if (((this.queueProcessing = !0), this.queue.length > 0)) {
                  const e = this.uppy.getFile(this.queue.shift())
                  return e
                    ? this.requestThumbnail(e)
                        .catch(() => {})
                        .then(() => this.processQueue())
                    : void this.uppy.log(
                        '[ThumbnailGenerator] file was removed before a thumbnail could be generated, but not removed from the queue. This is probably a bug',
                        'error'
                      )
                }
                ;(this.queueProcessing = !1),
                  this.uppy.log('[ThumbnailGenerator] Emptied thumbnail queue'),
                  this.uppy.emit('thumbnail:all-generated')
              }
              requestThumbnail(e) {
                return l(e.type) && !e.isRemote
                  ? this.createThumbnail(
                      e,
                      this.opts.thumbnailWidth,
                      this.opts.thumbnailHeight
                    )
                      .then((t) => {
                        this.setPreviewURL(e.id, t),
                          this.uppy.log(
                            `[ThumbnailGenerator] Generated thumbnail for ${e.id}`
                          ),
                          this.uppy.emit(
                            'thumbnail:generated',
                            this.uppy.getFile(e.id),
                            t
                          )
                      })
                      .catch((t) => {
                        this.uppy.log(
                          `[ThumbnailGenerator] Failed thumbnail for ${e.id}:`,
                          'warning'
                        ),
                          this.uppy.log(t, 'warning'),
                          this.uppy.emit(
                            'thumbnail:error',
                            this.uppy.getFile(e.id),
                            t
                          )
                      })
                  : Promise.resolve()
              }
              install() {
                this.uppy.on('file-removed', this.onFileRemoved),
                  this.uppy.on('cancel-all', this.onAllFilesRemoved),
                  this.opts.lazy
                    ? (this.uppy.on('thumbnail:request', this.onFileAdded),
                      this.uppy.on('thumbnail:cancel', this.onCancelRequest))
                    : (this.uppy.on('file-added', this.onFileAdded),
                      this.uppy.on('restored', this.onRestored)),
                  this.opts.waitForThumbnailsBeforeUpload &&
                    this.uppy.addPreProcessor(this.waitUntilAllProcessed)
              }
              uninstall() {
                this.uppy.off('file-removed', this.onFileRemoved),
                  this.uppy.off('cancel-all', this.onAllFilesRemoved),
                  this.opts.lazy
                    ? (this.uppy.off('thumbnail:request', this.onFileAdded),
                      this.uppy.off('thumbnail:cancel', this.onCancelRequest))
                    : (this.uppy.off('file-added', this.onFileAdded),
                      this.uppy.off('restored', this.onRestored)),
                  this.opts.waitForThumbnailsBeforeUpload &&
                    this.uppy.removePreProcessor(this.waitUntilAllProcessed)
              }
            }),
          (i.VERSION = '2.1.1'),
          r)
      },
      3107: (e) => {
        e.exports = {
          strings: { generatingThumbnails: 'Generating thumbnails...' },
        }
      },
      5570: (e, t, s) => {
        const i = s(4114)
        class r extends Error {
          constructor(e, t) {
            void 0 === t && (t = {}),
              super(e),
              (this.cause = t.cause),
              this.cause &&
                i(this.cause, 'isNetworkError') &&
                (this.isNetworkError = this.cause.isNetworkError)
          }
        }
        e.exports = r
      },
      8429: (e) => {
        var t, s
        function i(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var r = 0
        function o(e) {
          return '__private_' + r++ + '_' + e
        }
        e.exports =
          ((t = o('emitter')),
          (s = o('events')),
          class {
            constructor(e) {
              Object.defineProperty(this, t, { writable: !0, value: void 0 }),
                Object.defineProperty(this, s, { writable: !0, value: [] }),
                (i(this, t)[t] = e)
            }
            on(e, r) {
              return i(this, s)[s].push([e, r]), i(this, t)[t].on(e, r)
            }
            remove() {
              for (const [e, r] of i(this, s)[s].splice(0))
                i(this, t)[t].off(e, r)
            }
          })
      },
      9045: (e) => {
        e.exports = [
          'a[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
          'area[href]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
          'input:not([disabled]):not([inert]):not([aria-hidden])',
          'select:not([disabled]):not([inert]):not([aria-hidden])',
          'textarea:not([disabled]):not([inert]):not([aria-hidden])',
          'button:not([disabled]):not([inert]):not([aria-hidden])',
          'iframe:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
          'object:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
          'embed:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
          '[contenteditable]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
          '[tabindex]:not([tabindex^="-"]):not([inert]):not([aria-hidden])',
        ]
      },
      6311: (e) => {
        class t extends Error {
          constructor(e, t) {
            void 0 === t && (t = null),
              super(
                'This looks like a network error, the endpoint might be blocked by an internet provider or a firewall.'
              ),
              (this.cause = e),
              (this.isNetworkError = !0),
              (this.request = t)
          }
        }
        e.exports = t
      },
      4772: (e) => {
        function t(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var s = 0
        function i(e) {
          return '__private_' + s++ + '_' + e
        }
        var r = i('aliveTimer'),
          o = i('isDone'),
          n = i('onTimedOut'),
          a = i('timeout')
        e.exports = class {
          constructor(e, s) {
            Object.defineProperty(this, r, { writable: !0, value: void 0 }),
              Object.defineProperty(this, o, { writable: !0, value: !1 }),
              Object.defineProperty(this, n, { writable: !0, value: void 0 }),
              Object.defineProperty(this, a, { writable: !0, value: void 0 }),
              (t(this, a)[a] = e),
              (t(this, n)[n] = s)
          }
          progress() {
            t(this, o)[o] ||
              (t(this, a)[a] > 0 &&
                (clearTimeout(t(this, r)[r]),
                (t(this, r)[r] = setTimeout(t(this, n)[n], t(this, a)[a]))))
          }
          done() {
            t(this, o)[o] ||
              (clearTimeout(t(this, r)[r]),
              (t(this, r)[r] = null),
              (t(this, o)[o] = !0))
          }
        }
      },
      8618: (e) => {
        function t(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var s = 0
        function i(e) {
          return '__private_' + s++ + '_' + e
        }
        function r() {
          return new Error('Cancelled')
        }
        var o = i('activeRequests'),
          n = i('queuedHandlers'),
          a = i('paused'),
          l = i('pauseTimer'),
          d = i('downLimit'),
          p = i('upperLimit'),
          h = i('rateLimitingTimer'),
          u = i('call'),
          c = i('queueNext'),
          f = i('next'),
          m = i('queue'),
          g = i('dequeue'),
          y = i('resume'),
          v = i('increaseLimit')
        function b(e) {
          t(this, o)[o] += 1
          let s,
            i = !1
          try {
            s = e()
          } catch (e) {
            throw ((t(this, o)[o] -= 1), e)
          }
          return {
            abort: () => {
              i || ((i = !0), (t(this, o)[o] -= 1), s(), t(this, c)[c]())
            },
            done: () => {
              i || ((i = !0), (t(this, o)[o] -= 1), t(this, c)[c]())
            },
          }
        }
        function w() {
          queueMicrotask(() => t(this, f)[f]())
        }
        function S() {
          if (t(this, a)[a] || t(this, o)[o] >= this.limit) return
          if (0 === t(this, n)[n].length) return
          const e = t(this, n)[n].shift(),
            s = t(this, u)[u](e.fn)
          ;(e.abort = s.abort), (e.done = s.done)
        }
        function P(e, s) {
          void 0 === s && (s = {})
          const i = {
              fn: e,
              priority: s.priority || 0,
              abort: () => {
                t(this, g)[g](i)
              },
              done: () => {
                throw new Error(
                  'Cannot mark a queued request as done: this indicates a bug'
                )
              },
            },
            r = t(this, n)[n].findIndex((e) => i.priority > e.priority)
          return (
            -1 === r ? t(this, n)[n].push(i) : t(this, n)[n].splice(r, 0, i), i
          )
        }
        function F(e) {
          const s = t(this, n)[n].indexOf(e)
          ;-1 !== s && t(this, n)[n].splice(s, 1)
        }
        e.exports = {
          RateLimitedQueue: class {
            constructor(e) {
              Object.defineProperty(this, g, { value: F }),
                Object.defineProperty(this, m, { value: P }),
                Object.defineProperty(this, f, { value: S }),
                Object.defineProperty(this, c, { value: w }),
                Object.defineProperty(this, u, { value: b }),
                Object.defineProperty(this, o, { writable: !0, value: 0 }),
                Object.defineProperty(this, n, { writable: !0, value: [] }),
                Object.defineProperty(this, a, { writable: !0, value: !1 }),
                Object.defineProperty(this, l, { writable: !0, value: void 0 }),
                Object.defineProperty(this, d, { writable: !0, value: 1 }),
                Object.defineProperty(this, p, { writable: !0, value: void 0 }),
                Object.defineProperty(this, h, { writable: !0, value: void 0 }),
                Object.defineProperty(this, y, {
                  writable: !0,
                  value: () => this.resume(),
                }),
                Object.defineProperty(this, v, {
                  writable: !0,
                  value: () => {
                    if (t(this, a)[a])
                      t(this, h)[h] = setTimeout(t(this, v)[v], 0)
                    else {
                      ;(t(this, d)[d] = this.limit),
                        (this.limit = Math.ceil(
                          (t(this, p)[p] + t(this, d)[d]) / 2
                        ))
                      for (let e = t(this, d)[d]; e <= this.limit; e++)
                        t(this, c)[c]()
                      t(this, p)[p] - t(this, d)[d] > 3
                        ? (t(this, h)[h] = setTimeout(t(this, v)[v], 2e3))
                        : (t(this, d)[d] = Math.floor(t(this, d)[d] / 2))
                    }
                  },
                }),
                (this.limit = 'number' != typeof e || 0 === e ? 1 / 0 : e)
            }
            run(e, s) {
              return !t(this, a)[a] && t(this, o)[o] < this.limit
                ? t(this, u)[u](e)
                : t(this, m)[m](e, s)
            }
            wrapPromiseFunction(e, t) {
              var s = this
              return function () {
                for (
                  var i = arguments.length, o = new Array(i), n = 0;
                  n < i;
                  n++
                )
                  o[n] = arguments[n]
                let a
                const l = new Promise((i, n) => {
                  a = s.run(() => {
                    let t, s
                    try {
                      s = Promise.resolve(e(...o))
                    } catch (e) {
                      s = Promise.reject(e)
                    }
                    return (
                      s.then(
                        (e) => {
                          t ? n(t) : (a.done(), i(e))
                        },
                        (e) => {
                          t ? n(t) : (a.done(), n(e))
                        }
                      ),
                      () => {
                        t = r()
                      }
                    )
                  }, t)
                })
                return (
                  (l.abort = () => {
                    a.abort()
                  }),
                  l
                )
              }
            }
            resume() {
              ;(t(this, a)[a] = !1), clearTimeout(t(this, l)[l])
              for (let e = 0; e < this.limit; e++) t(this, c)[c]()
            }
            pause(e) {
              void 0 === e && (e = null),
                (t(this, a)[a] = !0),
                clearTimeout(t(this, l)[l]),
                null != e && (t(this, l)[l] = setTimeout(t(this, y)[y], e))
            }
            rateLimit(e) {
              clearTimeout(t(this, h)[h]),
                this.pause(e),
                this.limit > 1 &&
                  Number.isFinite(this.limit) &&
                  ((t(this, p)[p] = this.limit - 1),
                  (this.limit = t(this, d)[d]),
                  (t(this, h)[h] = setTimeout(t(this, v)[v], e)))
            }
            get isPaused() {
              return t(this, a)[a]
            }
          },
          internalRateLimitedQueue: Symbol('__queue'),
        }
      },
      3363: (e, t, s) => {
        var i
        function r(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var o = 0
        function n(e) {
          return '__private_' + o++ + '_' + e
        }
        const a = s(4114)
        function l(e, t, s) {
          const i = []
          return (
            e.forEach((e) =>
              'string' != typeof e
                ? i.push(e)
                : t[Symbol.split](e).forEach((e, t, r) => {
                    '' !== e && i.push(e), t < r.length - 1 && i.push(s)
                  })
            ),
            i
          )
        }
        function d(e, t) {
          const s = /\$/g
          let i = [e]
          if (null == t) return i
          for (const e of Object.keys(t))
            if ('_' !== e) {
              let r = t[e]
              'string' == typeof r && (r = s[Symbol.replace](r, '$$$$')),
                (i = l(i, new RegExp(`%\\{${e}\\}`, 'g'), r))
            }
          return i
        }
        function p(e) {
          if (null == e || !e.strings) return
          const t = this.locale
          ;(this.locale = { ...t, strings: { ...t.strings, ...e.strings } }),
            (this.locale.pluralize = e.pluralize || t.pluralize)
        }
        e.exports =
          ((i = n('apply')),
          class {
            constructor(e) {
              Object.defineProperty(this, i, { value: p }),
                (this.locale = {
                  strings: {},
                  pluralize: (e) => (1 === e ? 0 : 1),
                }),
                Array.isArray(e)
                  ? e.forEach(r(this, i)[i], this)
                  : r(this, i)[i](e)
            }
            translate(e, t) {
              return this.translateArray(e, t).join('')
            }
            translateArray(e, t) {
              if (!a(this.locale.strings, e))
                throw new Error(`missing string: ${e}`)
              const s = this.locale.strings[e]
              if ('object' == typeof s) {
                if (t && void 0 !== t.smart_count)
                  return d(s[this.locale.pluralize(t.smart_count)], t)
                throw new Error(
                  'Attempted to use a string with plural forms, but no value was given for %{smart_count}'
                )
              }
              return d(s, t)
            }
          })
      },
      7326: (e) => {
        e.exports = function (e, t, s) {
          return new Promise((i) => {
            e.toBlob(i, t, s)
          })
        }
      },
      3517: (e) => {
        const t = /^data:([^/]+\/[^,;]+(?:[^,]*?))(;base64)?,([\s\S]*)$/
        e.exports = function (e, s, i) {
          var r, o
          const n = t.exec(e),
            a =
              null !=
              (r = null != (o = s.mimeType) ? o : null == n ? void 0 : n[1])
                ? r
                : 'plain/text'
          let l
          if (null != n[2]) {
            const e = atob(decodeURIComponent(n[3])),
              t = new Uint8Array(e.length)
            for (let s = 0; s < e.length; s++) t[s] = e.charCodeAt(s)
            l = [t]
          } else l = [decodeURIComponent(n[3])]
          return i
            ? new File(l, s.name || '', { type: a })
            : new Blob(l, { type: a })
        }
      },
      7351: (e, t, s) => {
        const i = s(3096)
        e.exports = i(
          function (e, t, s) {
            const { progress: i, bytesUploaded: r, bytesTotal: o } = t
            i &&
              (e.uppy.log(`Upload progress: ${i}`),
              e.uppy.emit('upload-progress', s, {
                uploader: e,
                bytesUploaded: r,
                bytesTotal: o,
              }))
          },
          300,
          { leading: !0, trailing: !0 }
        )
      },
      6865: (e, t, s) => {
        const i = s(6311)
        e.exports = function () {
          return fetch(...arguments).catch((e) => {
            throw 'AbortError' === e.name ? e : new i(e)
          })
        }
      },
      1147: (e, t, s) => {
        const i = s(5031)
        e.exports = function (e) {
          if ('string' == typeof e) {
            const t = document.querySelectorAll(e)
            return 0 === t.length ? null : Array.from(t)
          }
          return 'object' == typeof e && i(e) ? [e] : null
        }
      },
      2729: (e, t, s) => {
        const i = s(5031)
        e.exports = function (e, t) {
          return (
            void 0 === t && (t = document),
            'string' == typeof e ? t.querySelector(e) : i(e) ? e : null
          )
        }
      },
      8619: (e) => {
        function t(e) {
          let t = ''
          return (
            e.replace(
              /[^A-Z0-9]/gi,
              (e) => (
                (t += `-${(function (e) {
                  return e.charCodeAt(0).toString(32)
                })(e)}`),
                '/'
              )
            ) + t
          )
        }
        e.exports = function (e) {
          let s = 'uppy'
          return (
            'string' == typeof e.name && (s += `-${t(e.name.toLowerCase())}`),
            void 0 !== e.type && (s += `-${e.type}`),
            e.meta &&
              'string' == typeof e.meta.relativePath &&
              (s += `-${t(e.meta.relativePath.toLowerCase())}`),
            void 0 !== e.data.size && (s += `-${e.data.size}`),
            void 0 !== e.data.lastModified && (s += `-${e.data.lastModified}`),
            s
          )
        }
      },
      9599: (e) => {
        e.exports = function (e) {
          return e.bytesTotal - e.bytesUploaded
        }
      },
      4031: (e, t, s) => {
        const i = s(9324),
          r = s(180)
        e.exports = function (e, t) {
          var s
          let { logDropError: o = () => {} } = void 0 === t ? {} : t
          return null != (s = e.items) &&
            s[0] &&
            'webkitGetAsEntry' in e.items[0]
            ? i(e, o)
            : r(e)
        }
      },
      180: (e, t, s) => {
        const i = s(6361)
        e.exports = function (e) {
          const t = i(e.files)
          return Promise.resolve(t)
        }
      },
      9083: (e) => {
        e.exports = function e(t, s, i, r) {
          let { onSuccess: o } = r
          t.readEntries(
            (r) => {
              const n = [...s, ...r]
              r.length
                ? setTimeout(() => {
                    e(t, n, i, { onSuccess: o })
                  }, 0)
                : o(n)
            },
            (e) => {
              i(e), o(s)
            }
          )
        }
      },
      2871: (e) => {
        e.exports = function (e) {
          return e.fullPath && e.fullPath !== `/${e.name}` ? e.fullPath : null
        }
      },
      9324: (e, t, s) => {
        const i = s(6361),
          r = s(2871),
          o = s(9083)
        e.exports = function (e, t) {
          const s = [],
            n = [],
            a = (e) =>
              new Promise((i) => {
                if (e.isFile)
                  e.file(
                    (t) => {
                      ;(t.relativePath = r(e)), s.push(t), i()
                    },
                    (e) => {
                      t(e), i()
                    }
                  )
                else if (e.isDirectory) {
                  const s = e.createReader()
                  o(s, [], t, { onSuccess: (e) => i(Promise.all(e.map(a))) })
                }
              })
          return (
            i(e.items).forEach((e) => {
              const t = e.webkitGetAsEntry()
              t && n.push(a(t))
            }),
            Promise.all(n).then(() => s)
          )
        }
      },
      8744: (e) => {
        e.exports = function (e) {
          const t = e.lastIndexOf('.')
          return -1 === t || t === e.length - 1
            ? { name: e, extension: void 0 }
            : { name: e.slice(0, t), extension: e.slice(t + 1) }
        }
      },
      9404: (e, t, s) => {
        const i = s(8744),
          r = s(5624)
        e.exports = function (e) {
          var t
          if (e.type) return e.type
          const s = e.name
            ? null == (t = i(e.name).extension)
              ? void 0
              : t.toLowerCase()
            : null
          return s && s in r ? r[s] : 'application/octet-stream'
        }
      },
      182: (e) => {
        const t = {
          'audio/mp3': 'mp3',
          'audio/mp4': 'mp4',
          'audio/ogg': 'ogg',
          'audio/webm': 'webm',
          'image/gif': 'gif',
          'image/heic': 'heic',
          'image/heif': 'heif',
          'image/jpeg': 'jpg',
          'image/png': 'png',
          'image/svg+xml': 'svg',
          'video/mp4': 'mp4',
          'video/ogg': 'ogv',
          'video/quicktime': 'mov',
          'video/webm': 'webm',
          'video/x-matroska': 'mkv',
          'video/x-msvideo': 'avi',
        }
        e.exports = function (e) {
          return ([e] = e.split(';', 1)), t[e] || null
        }
      },
      5313: (e) => {
        e.exports = function (e) {
          const t =
            /^(?:https?:\/\/|\/\/)?(?:[^@\n]+@)?(?:www\.)?([^\n]+)/i.exec(e)[1]
          return `${/^http:\/\//i.test(e) ? 'ws' : 'wss'}://${t}`
        }
      },
      522: (e) => {
        e.exports = function (e) {
          if (!e.bytesUploaded) return 0
          const t = Date.now() - e.uploadStarted
          return e.bytesUploaded / (t / 1e3)
        }
      },
      8958: (e) => {
        e.exports = function (e) {
          for (var t; e && !e.dir; ) e = e.parentNode
          return null == (t = e) ? void 0 : t.dir
        }
      },
      6770: (e) => {
        function t(e) {
          return e < 10 ? `0${e}` : e.toString()
        }
        e.exports = function () {
          const e = new Date()
          return `${t(e.getHours())}:${t(e.getMinutes())}:${t(e.getSeconds())}`
        }
      },
      4114: (e) => {
        e.exports = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t)
        }
      },
      5031: (e) => {
        e.exports = function (e) {
          return (null == e ? void 0 : e.nodeType) === Node.ELEMENT_NODE
        }
      },
      3754: (e) => {
        e.exports = function () {
          const e = document.body
          return (
            'draggable' in e &&
            'ondragstart' in e &&
            'ondrop' in e &&
            'FormData' in window &&
            'FileReader' in window
          )
        }
      },
      883: (e) => {
        e.exports = function (e) {
          return (
            !!e &&
            ((0 !== e.readyState && 4 !== e.readyState) || 0 === e.status)
          )
        }
      },
      6508: (e) => {
        e.exports = function (e) {
          return e.startsWith('blob:')
        }
      },
      9373: (e) => {
        e.exports = function (e) {
          return (
            !!e && /^[^/]+\/(jpe?g|gif|png|svg|svg\+xml|bmp|webp|avif)$/.test(e)
          )
        }
      },
      5624: (e) => {
        e.exports = {
          md: 'text/markdown',
          markdown: 'text/markdown',
          mp4: 'video/mp4',
          mp3: 'audio/mp3',
          svg: 'image/svg+xml',
          jpg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          heic: 'image/heic',
          heif: 'image/heif',
          yaml: 'text/yaml',
          yml: 'text/yaml',
          csv: 'text/csv',
          tsv: 'text/tab-separated-values',
          tab: 'text/tab-separated-values',
          avi: 'video/x-msvideo',
          mks: 'video/x-matroska',
          mkv: 'video/x-matroska',
          mov: 'video/quicktime',
          dicom: 'application/dicom',
          doc: 'application/msword',
          docm: 'application/vnd.ms-word.document.macroenabled.12',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          dot: 'application/msword',
          dotm: 'application/vnd.ms-word.template.macroenabled.12',
          dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
          xla: 'application/vnd.ms-excel',
          xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
          xlc: 'application/vnd.ms-excel',
          xlf: 'application/x-xliff+xml',
          xlm: 'application/vnd.ms-excel',
          xls: 'application/vnd.ms-excel',
          xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
          xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          xlt: 'application/vnd.ms-excel',
          xltm: 'application/vnd.ms-excel.template.macroenabled.12',
          xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
          xlw: 'application/vnd.ms-excel',
          txt: 'text/plain',
          text: 'text/plain',
          conf: 'text/plain',
          log: 'text/plain',
          pdf: 'application/pdf',
          zip: 'application/zip',
          '7z': 'application/x-7z-compressed',
          rar: 'application/x-rar-compressed',
          tar: 'application/x-tar',
          gz: 'application/gzip',
          dmg: 'application/x-apple-diskimage',
        }
      },
      1011: (e, t, s) => {
        const i = s(8920)
        e.exports = function (e) {
          const t = i(e)
          return `${0 === t.hours ? '' : `${t.hours}h`}${
            0 === t.minutes
              ? ''
              : `${
                  0 === t.hours
                    ? t.minutes
                    : ` ${t.minutes.toString(10).padStart(2, '0')}`
                }m`
          }${
            0 !== t.hours
              ? ''
              : `${
                  0 === t.minutes
                    ? t.seconds
                    : ` ${t.seconds.toString(10).padStart(2, '0')}`
                }s`
          }`
        }
      },
      8920: (e) => {
        e.exports = function (e) {
          return {
            hours: Math.floor(e / 3600) % 24,
            minutes: Math.floor(e / 60) % 60,
            seconds: Math.floor(e % 60),
          }
        }
      },
      6361: (e) => {
        e.exports = Array.from
      },
      469: (e) => {
        const t = '...'
        e.exports = function (e, s) {
          if (0 === s) return ''
          if (e.length <= s) return e
          if (s <= t.length + 1) return `${e.slice(0, s - 1)}…`
          const i = s - t.length,
            r = Math.ceil(i / 2),
            o = Math.floor(i / 2)
          return e.slice(0, r) + t + e.slice(-o)
        }
      },
      4184: (e, t) => {
        var s
        !(function () {
          'use strict'
          var i = {}.hasOwnProperty
          function r() {
            for (var e = [], t = 0; t < arguments.length; t++) {
              var s = arguments[t]
              if (s) {
                var o = typeof s
                if ('string' === o || 'number' === o) e.push(s)
                else if (Array.isArray(s)) {
                  if (s.length) {
                    var n = r.apply(null, s)
                    n && e.push(n)
                  }
                } else if ('object' === o)
                  if (s.toString === Object.prototype.toString)
                    for (var a in s) i.call(s, a) && s[a] && e.push(a)
                  else e.push(s.toString())
              }
            }
            return e.join(' ')
          }
          e.exports
            ? ((r.default = r), (e.exports = r))
            : void 0 ===
                (s = function () {
                  return r
                }.apply(t, [])) || (e.exports = s)
        })()
      },
      1443: function (e, t, s) {
        !(function (e) {
          'use strict'
          function t(e, t, s) {
            return (
              t in e
                ? Object.defineProperty(e, t, {
                    value: s,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                  })
                : (e[t] = s),
              e
            )
          }
          var i = 'undefined' != typeof self ? self : s.g
          const r = 'undefined' != typeof navigator,
            o = r && 'undefined' == typeof HTMLImageElement,
            n = !(
              void 0 === s.g ||
              'undefined' == typeof process ||
              !process.versions ||
              !process.versions.node
            ),
            a = i.Buffer,
            l = !!a,
            d = (e) => void 0 !== e
          function p(e) {
            return (
              void 0 === e ||
              (e instanceof Map
                ? 0 === e.size
                : 0 === Object.values(e).filter(d).length)
            )
          }
          function h(e) {
            let t = new Error(e)
            throw (delete t.stack, t)
          }
          function u(e) {
            let t = (function (e) {
              let t = 0
              return (
                e.ifd0.enabled && (t += 1024),
                e.exif.enabled && (t += 2048),
                e.makerNote && (t += 2048),
                e.userComment && (t += 1024),
                e.gps.enabled && (t += 512),
                e.interop.enabled && (t += 100),
                e.ifd1.enabled && (t += 1024),
                t + 2048
              )
            })(e)
            return (
              e.jfif.enabled && (t += 50),
              e.xmp.enabled && (t += 2e4),
              e.iptc.enabled && (t += 14e3),
              e.icc.enabled && (t += 6e3),
              t
            )
          }
          const c = (e) => String.fromCharCode.apply(null, e),
            f =
              'undefined' != typeof TextDecoder
                ? new TextDecoder('utf-8')
                : void 0
          class m {
            static from(e, t) {
              return e instanceof this && e.le === t
                ? e
                : new m(e, void 0, void 0, t)
            }
            constructor(e, t = 0, s, i) {
              if (
                ('boolean' == typeof i && (this.le = i),
                Array.isArray(e) && (e = new Uint8Array(e)),
                0 === e)
              )
                (this.byteOffset = 0), (this.byteLength = 0)
              else if (e instanceof ArrayBuffer) {
                void 0 === s && (s = e.byteLength - t)
                let i = new DataView(e, t, s)
                this._swapDataView(i)
              } else if (
                e instanceof Uint8Array ||
                e instanceof DataView ||
                e instanceof m
              ) {
                void 0 === s && (s = e.byteLength - t),
                  (t += e.byteOffset) + s > e.byteOffset + e.byteLength &&
                    h(
                      'Creating view outside of available memory in ArrayBuffer'
                    )
                let i = new DataView(e.buffer, t, s)
                this._swapDataView(i)
              } else if ('number' == typeof e) {
                let t = new DataView(new ArrayBuffer(e))
                this._swapDataView(t)
              } else h('Invalid input argument for BufferView: ' + e)
            }
            _swapArrayBuffer(e) {
              this._swapDataView(new DataView(e))
            }
            _swapBuffer(e) {
              this._swapDataView(
                new DataView(e.buffer, e.byteOffset, e.byteLength)
              )
            }
            _swapDataView(e) {
              ;(this.dataView = e),
                (this.buffer = e.buffer),
                (this.byteOffset = e.byteOffset),
                (this.byteLength = e.byteLength)
            }
            _lengthToEnd(e) {
              return this.byteLength - e
            }
            set(e, t, s = m) {
              return (
                e instanceof DataView || e instanceof m
                  ? (e = new Uint8Array(e.buffer, e.byteOffset, e.byteLength))
                  : e instanceof ArrayBuffer && (e = new Uint8Array(e)),
                e instanceof Uint8Array ||
                  h('BufferView.set(): Invalid data argument.'),
                this.toUint8().set(e, t),
                new s(this, t, e.byteLength)
              )
            }
            subarray(e, t) {
              return (t = t || this._lengthToEnd(e)), new m(this, e, t)
            }
            toUint8() {
              return new Uint8Array(
                this.buffer,
                this.byteOffset,
                this.byteLength
              )
            }
            getUint8Array(e, t) {
              return new Uint8Array(this.buffer, this.byteOffset + e, t)
            }
            getString(e = 0, t = this.byteLength) {
              return (
                (s = this.getUint8Array(e, t)),
                f
                  ? f.decode(s)
                  : l
                  ? Buffer.from(s).toString('utf8')
                  : decodeURIComponent(escape(c(s)))
              )
              var s
            }
            getLatin1String(e = 0, t = this.byteLength) {
              let s = this.getUint8Array(e, t)
              return c(s)
            }
            getUnicodeString(e = 0, t = this.byteLength) {
              const s = []
              for (let i = 0; i < t && e + i < this.byteLength; i += 2)
                s.push(this.getUint16(e + i))
              return c(s)
            }
            getInt8(e) {
              return this.dataView.getInt8(e)
            }
            getUint8(e) {
              return this.dataView.getUint8(e)
            }
            getInt16(e, t = this.le) {
              return this.dataView.getInt16(e, t)
            }
            getInt32(e, t = this.le) {
              return this.dataView.getInt32(e, t)
            }
            getUint16(e, t = this.le) {
              return this.dataView.getUint16(e, t)
            }
            getUint32(e, t = this.le) {
              return this.dataView.getUint32(e, t)
            }
            getFloat32(e, t = this.le) {
              return this.dataView.getFloat32(e, t)
            }
            getFloat64(e, t = this.le) {
              return this.dataView.getFloat64(e, t)
            }
            getFloat(e, t = this.le) {
              return this.dataView.getFloat32(e, t)
            }
            getDouble(e, t = this.le) {
              return this.dataView.getFloat64(e, t)
            }
            getUintBytes(e, t, s) {
              switch (t) {
                case 1:
                  return this.getUint8(e, s)
                case 2:
                  return this.getUint16(e, s)
                case 4:
                  return this.getUint32(e, s)
                case 8:
                  return this.getUint64 && this.getUint64(e, s)
              }
            }
            getUint(e, t, s) {
              switch (t) {
                case 8:
                  return this.getUint8(e, s)
                case 16:
                  return this.getUint16(e, s)
                case 32:
                  return this.getUint32(e, s)
                case 64:
                  return this.getUint64 && this.getUint64(e, s)
              }
            }
            toString(e) {
              return this.dataView.toString(e, this.constructor.name)
            }
            ensureChunk() {}
          }
          function g(e, t) {
            h(`${e} '${t}' was not loaded, try using full build of exifr.`)
          }
          class y extends Map {
            constructor(e) {
              super(), (this.kind = e)
            }
            get(e, t) {
              return (
                this.has(e) || g(this.kind, e),
                t &&
                  (e in t ||
                    (function (e, t) {
                      h(`Unknown ${e} '${t}'.`)
                    })(this.kind, e),
                  t[e].enabled || g(this.kind, e)),
                super.get(e)
              )
            }
            keyList() {
              return Array.from(this.keys())
            }
          }
          var v = new y('file parser'),
            b = new y('segment parser'),
            w = new y('file reader')
          let S = i.fetch
          const P = 'Invalid input argument'
          function F(e, t) {
            return (s = e).startsWith('data:') || s.length > 1e4
              ? C(e, t, 'base64')
              : n && e.includes('://')
              ? _(e, t, 'url', k)
              : n
              ? C(e, t, 'fs')
              : r
              ? _(e, t, 'url', k)
              : void h(P)
            var s
          }
          async function _(e, t, s, i) {
            return w.has(s)
              ? C(e, t, s)
              : i
              ? (async function (e, t) {
                  let s = await t(e)
                  return new m(s)
                })(e, i)
              : void h(`Parser ${s} is not loaded`)
          }
          async function C(e, t, s) {
            let i = new (w.get(s))(e, t)
            return await i.read(), i
          }
          const k = (e) => S(e).then((e) => e.arrayBuffer()),
            T = (e) =>
              new Promise((t, s) => {
                let i = new FileReader()
                ;(i.onloadend = () => t(i.result || new ArrayBuffer())),
                  (i.onerror = s),
                  i.readAsArrayBuffer(e)
              })
          class O extends Map {
            get tagKeys() {
              return (
                this.allKeys || (this.allKeys = Array.from(this.keys())),
                this.allKeys
              )
            }
            get tagValues() {
              return (
                this.allValues || (this.allValues = Array.from(this.values())),
                this.allValues
              )
            }
          }
          function x(e, t, s) {
            let i = new O()
            for (let [e, t] of s) i.set(e, t)
            if (Array.isArray(t)) for (let s of t) e.set(s, i)
            else e.set(t, i)
            return i
          }
          function A(e, t, s) {
            let i,
              r = e.get(t)
            for (i of s) r.set(i[0], i[1])
          }
          const E = new Map(),
            U = new Map(),
            D = new Map(),
            R = 37500,
            I = 37510,
            N = 33723,
            B = 34675,
            M = 34665,
            L = 34853,
            j = 40965,
            z = [
              'chunked',
              'firstChunkSize',
              'firstChunkSizeNode',
              'firstChunkSizeBrowser',
              'chunkSize',
              'chunkLimit',
            ],
            $ = ['jfif', 'xmp', 'icc', 'iptc', 'ihdr'],
            q = ['tiff', ...$],
            V = ['ifd0', 'ifd1', 'exif', 'gps', 'interop'],
            H = [...q, ...V],
            W = ['makerNote', 'userComment'],
            G = [
              'translateKeys',
              'translateValues',
              'reviveValues',
              'multiSegment',
            ],
            K = [...G, 'sanitize', 'mergeOutput', 'silentErrors']
          class X {
            get translate() {
              return (
                this.translateKeys || this.translateValues || this.reviveValues
              )
            }
          }
          class Y extends X {
            get needed() {
              return this.enabled || this.deps.size > 0
            }
            constructor(e, s, i, r) {
              if (
                (super(),
                t(this, 'enabled', !1),
                t(this, 'skip', new Set()),
                t(this, 'pick', new Set()),
                t(this, 'deps', new Set()),
                t(this, 'translateKeys', !1),
                t(this, 'translateValues', !1),
                t(this, 'reviveValues', !1),
                (this.key = e),
                (this.enabled = s),
                (this.parse = this.enabled),
                this.applyInheritables(r),
                (this.canBeFiltered = V.includes(e)),
                this.canBeFiltered && (this.dict = E.get(e)),
                void 0 !== i)
              )
                if (Array.isArray(i))
                  (this.parse = this.enabled = !0),
                    this.canBeFiltered &&
                      i.length > 0 &&
                      this.translateTagSet(i, this.pick)
                else if ('object' == typeof i) {
                  if (
                    ((this.enabled = !0),
                    (this.parse = !1 !== i.parse),
                    this.canBeFiltered)
                  ) {
                    let { pick: e, skip: t } = i
                    e && e.length > 0 && this.translateTagSet(e, this.pick),
                      t && t.length > 0 && this.translateTagSet(t, this.skip)
                  }
                  this.applyInheritables(i)
                } else
                  !0 === i || !1 === i
                    ? (this.parse = this.enabled = i)
                    : h(`Invalid options argument: ${i}`)
            }
            applyInheritables(e) {
              let t, s
              for (t of G) (s = e[t]), void 0 !== s && (this[t] = s)
            }
            translateTagSet(e, t) {
              if (this.dict) {
                let s,
                  i,
                  { tagKeys: r, tagValues: o } = this.dict
                for (s of e)
                  'string' == typeof s
                    ? ((i = o.indexOf(s)),
                      -1 === i && (i = r.indexOf(Number(s))),
                      -1 !== i && t.add(Number(r[i])))
                    : t.add(s)
              } else for (let s of e) t.add(s)
            }
            finalizeFilters() {
              !this.enabled && this.deps.size > 0
                ? ((this.enabled = !0), se(this.pick, this.deps))
                : this.enabled && this.pick.size > 0 && se(this.pick, this.deps)
            }
          }
          var Q = {
              jfif: !1,
              tiff: !0,
              xmp: !1,
              icc: !1,
              iptc: !1,
              ifd0: !0,
              ifd1: !1,
              exif: !0,
              gps: !0,
              interop: !1,
              ihdr: void 0,
              makerNote: !1,
              userComment: !1,
              multiSegment: !1,
              skip: [],
              pick: [],
              translateKeys: !0,
              translateValues: !0,
              reviveValues: !0,
              sanitize: !0,
              mergeOutput: !0,
              silentErrors: !0,
              chunked: !0,
              firstChunkSize: void 0,
              firstChunkSizeNode: 512,
              firstChunkSizeBrowser: 65536,
              chunkSize: 65536,
              chunkLimit: 5,
            },
            J = new Map()
          class Z extends X {
            static useCached(e) {
              let t = J.get(e)
              return void 0 !== t || ((t = new this(e)), J.set(e, t)), t
            }
            constructor(e) {
              super(),
                !0 === e
                  ? this.setupFromTrue()
                  : void 0 === e
                  ? this.setupFromUndefined()
                  : Array.isArray(e)
                  ? this.setupFromArray(e)
                  : 'object' == typeof e
                  ? this.setupFromObject(e)
                  : h(`Invalid options argument ${e}`),
                void 0 === this.firstChunkSize &&
                  (this.firstChunkSize = r
                    ? this.firstChunkSizeBrowser
                    : this.firstChunkSizeNode),
                this.mergeOutput && (this.ifd1.enabled = !1),
                this.filterNestedSegmentTags(),
                this.traverseTiffDependencyTree(),
                this.checkLoadedPlugins()
            }
            setupFromUndefined() {
              let e
              for (e of z) this[e] = Q[e]
              for (e of K) this[e] = Q[e]
              for (e of W) this[e] = Q[e]
              for (e of H) this[e] = new Y(e, Q[e], void 0, this)
            }
            setupFromTrue() {
              let e
              for (e of z) this[e] = Q[e]
              for (e of K) this[e] = Q[e]
              for (e of W) this[e] = !0
              for (e of H) this[e] = new Y(e, !0, void 0, this)
            }
            setupFromArray(e) {
              let t
              for (t of z) this[t] = Q[t]
              for (t of K) this[t] = Q[t]
              for (t of W) this[t] = Q[t]
              for (t of H) this[t] = new Y(t, !1, void 0, this)
              this.setupGlobalFilters(e, void 0, V)
            }
            setupFromObject(e) {
              let t
              for (t of ((V.ifd0 = V.ifd0 || V.image),
              (V.ifd1 = V.ifd1 || V.thumbnail),
              Object.assign(this, e),
              z))
                this[t] = te(e[t], Q[t])
              for (t of K) this[t] = te(e[t], Q[t])
              for (t of W) this[t] = te(e[t], Q[t])
              for (t of q) this[t] = new Y(t, Q[t], e[t], this)
              for (t of V) this[t] = new Y(t, Q[t], e[t], this.tiff)
              this.setupGlobalFilters(e.pick, e.skip, V, H),
                !0 === e.tiff
                  ? this.batchEnableWithBool(V, !0)
                  : !1 === e.tiff
                  ? this.batchEnableWithUserValue(V, e)
                  : Array.isArray(e.tiff)
                  ? this.setupGlobalFilters(e.tiff, void 0, V)
                  : 'object' == typeof e.tiff &&
                    this.setupGlobalFilters(e.tiff.pick, e.tiff.skip, V)
            }
            batchEnableWithBool(e, t) {
              for (let s of e) this[s].enabled = t
            }
            batchEnableWithUserValue(e, t) {
              for (let s of e) {
                let e = t[s]
                this[s].enabled = !1 !== e && void 0 !== e
              }
            }
            setupGlobalFilters(e, t, s, i = s) {
              if (e && e.length) {
                for (let e of i) this[e].enabled = !1
                let t = ee(e, s)
                for (let [e, s] of t)
                  se(this[e].pick, s), (this[e].enabled = !0)
              } else if (t && t.length) {
                let e = ee(t, s)
                for (let [t, s] of e) se(this[t].skip, s)
              }
            }
            filterNestedSegmentTags() {
              let { ifd0: e, exif: t, xmp: s, iptc: i, icc: r } = this
              this.makerNote ? t.deps.add(R) : t.skip.add(R),
                this.userComment ? t.deps.add(I) : t.skip.add(I),
                s.enabled || e.skip.add(700),
                i.enabled || e.skip.add(N),
                r.enabled || e.skip.add(B)
            }
            traverseTiffDependencyTree() {
              let { ifd0: e, exif: t, gps: s, interop: i } = this
              i.needed && (t.deps.add(j), e.deps.add(j)),
                t.needed && e.deps.add(M),
                s.needed && e.deps.add(L),
                (this.tiff.enabled =
                  V.some((e) => !0 === this[e].enabled) ||
                  this.makerNote ||
                  this.userComment)
              for (let e of V) this[e].finalizeFilters()
            }
            get onlyTiff() {
              return (
                !$.map((e) => this[e].enabled).some((e) => !0 === e) &&
                this.tiff.enabled
              )
            }
            checkLoadedPlugins() {
              for (let e of q)
                this[e].enabled && !b.has(e) && g('segment parser', e)
            }
          }
          function ee(e, t) {
            let s,
              i,
              r,
              o,
              n = []
            for (r of t) {
              for (o of ((s = E.get(r)), (i = []), s))
                (e.includes(o[0]) || e.includes(o[1])) && i.push(o[0])
              i.length && n.push([r, i])
            }
            return n
          }
          function te(e, t) {
            return void 0 !== e ? e : void 0 !== t ? t : void 0
          }
          function se(e, t) {
            for (let s of t) e.add(s)
          }
          t(Z, 'default', Q)
          class ie {
            constructor(e) {
              t(this, 'parsers', {}),
                t(this, 'output', {}),
                t(this, 'errors', []),
                t(this, 'pushToErrors', (e) => this.errors.push(e)),
                (this.options = Z.useCached(e))
            }
            async read(e) {
              this.file = await (function (e, t) {
                return 'string' == typeof e
                  ? F(e, t)
                  : r && !o && e instanceof HTMLImageElement
                  ? F(e.src, t)
                  : e instanceof Uint8Array ||
                    e instanceof ArrayBuffer ||
                    e instanceof DataView
                  ? new m(e)
                  : r && e instanceof Blob
                  ? _(e, t, 'blob', T)
                  : void h(P)
              })(e, this.options)
            }
            setup() {
              if (this.fileParser) return
              let { file: e } = this,
                t = e.getUint16(0)
              for (let [s, i] of v)
                if (i.canHandle(e, t))
                  return (
                    (this.fileParser = new i(
                      this.options,
                      this.file,
                      this.parsers
                    )),
                    (e[s] = !0)
                  )
              this.file.close && this.file.close(), h('Unknown file format')
            }
            async parse() {
              let { output: e, errors: t } = this
              return (
                this.setup(),
                this.options.silentErrors
                  ? (await this.executeParsers().catch(this.pushToErrors),
                    t.push(...this.fileParser.errors))
                  : await this.executeParsers(),
                this.file.close && this.file.close(),
                this.options.silentErrors && t.length > 0 && (e.errors = t),
                p((s = e)) ? void 0 : s
              )
              var s
            }
            async executeParsers() {
              let { output: e } = this
              await this.fileParser.parse()
              let t = Object.values(this.parsers).map(async (t) => {
                let s = await t.parse()
                t.assignToOutput(e, s)
              })
              this.options.silentErrors &&
                (t = t.map((e) => e.catch(this.pushToErrors))),
                await Promise.all(t)
            }
            async extractThumbnail() {
              this.setup()
              let { options: e, file: t } = this,
                s = b.get('tiff', e)
              var i
              if (
                (t.tiff
                  ? (i = { start: 0, type: 'tiff' })
                  : t.jpeg &&
                    (i = await this.fileParser.getOrFindSegment('tiff')),
                void 0 === i)
              )
                return
              let r = await this.fileParser.ensureSegmentChunk(i),
                o = (this.parsers.tiff = new s(r, e, t)),
                n = await o.extractThumbnail()
              return t.close && t.close(), n
            }
          }
          async function re(e, t) {
            let s = new ie(t)
            return await s.read(e), s.parse()
          }
          var oe = Object.freeze({
            __proto__: null,
            parse: re,
            Exifr: ie,
            fileParsers: v,
            segmentParsers: b,
            fileReaders: w,
            tagKeys: E,
            tagValues: U,
            tagRevivers: D,
            createDictionary: x,
            extendDictionary: A,
            fetchUrlAsArrayBuffer: k,
            readBlobAsArrayBuffer: T,
            chunkedProps: z,
            otherSegments: $,
            segments: q,
            tiffBlocks: V,
            segmentsAndBlocks: H,
            tiffExtractables: W,
            inheritables: G,
            allFormatters: K,
            Options: Z,
          })
          class ne {
            static findPosition(e, t) {
              let s = e.getUint16(t + 2) + 2,
                i =
                  'function' == typeof this.headerLength
                    ? this.headerLength(e, t, s)
                    : this.headerLength,
                r = t + i,
                o = s - i
              return {
                offset: t,
                length: s,
                headerLength: i,
                start: r,
                size: o,
                end: r + o,
              }
            }
            static parse(e, t = {}) {
              return new this(e, new Z({ [this.type]: t }), e).parse()
            }
            normalizeInput(e) {
              return e instanceof m ? e : new m(e)
            }
            constructor(e, s = {}, i) {
              t(this, 'errors', []),
                t(this, 'raw', new Map()),
                t(this, 'handleError', (e) => {
                  if (!this.options.silentErrors) throw e
                  this.errors.push(e.message)
                }),
                (this.chunk = this.normalizeInput(e)),
                (this.file = i),
                (this.type = this.constructor.type),
                (this.globalOptions = this.options = s),
                (this.localOptions = s[this.type]),
                (this.canTranslate =
                  this.localOptions && this.localOptions.translate)
            }
            translate() {
              this.canTranslate &&
                (this.translated = this.translateBlock(this.raw, this.type))
            }
            get output() {
              return this.translated
                ? this.translated
                : this.raw
                ? Object.fromEntries(this.raw)
                : void 0
            }
            translateBlock(e, t) {
              let s = D.get(t),
                i = U.get(t),
                r = E.get(t),
                o = this.options[t],
                n = o.reviveValues && !!s,
                a = o.translateValues && !!i,
                l = o.translateKeys && !!r,
                d = {}
              for (let [t, o] of e)
                n && s.has(t)
                  ? (o = s.get(t)(o))
                  : a && i.has(t) && (o = this.translateValue(o, i.get(t))),
                  l && r.has(t) && (t = r.get(t) || t),
                  (d[t] = o)
              return d
            }
            translateValue(e, t) {
              return t[e] || t.DEFAULT || e
            }
            assignToOutput(e, t) {
              this.assignObjectToOutput(e, this.constructor.type, t)
            }
            assignObjectToOutput(e, t, s) {
              if (this.globalOptions.mergeOutput) return Object.assign(e, s)
              e[t] ? Object.assign(e[t], s) : (e[t] = s)
            }
          }
          function ae(e) {
            return (
              192 === e ||
              194 === e ||
              196 === e ||
              219 === e ||
              221 === e ||
              218 === e ||
              254 === e
            )
          }
          function le(e) {
            return e >= 224 && e <= 239
          }
          function de(e, t, s) {
            for (let [i, r] of b) if (r.canHandle(e, t, s)) return i
          }
          t(ne, 'headerLength', 4),
            t(ne, 'type', void 0),
            t(ne, 'multiSegment', !1),
            t(ne, 'canHandle', () => !1)
          class pe extends class {
            constructor(e, s, i) {
              t(this, 'errors', []),
                t(this, 'ensureSegmentChunk', async (e) => {
                  let t = e.start,
                    s = e.size || 65536
                  if (this.file.chunked)
                    if (this.file.available(t, s))
                      e.chunk = this.file.subarray(t, s)
                    else
                      try {
                        e.chunk = await this.file.readChunk(t, s)
                      } catch (t) {
                        h(
                          `Couldn't read segment: ${JSON.stringify(e)}. ${
                            t.message
                          }`
                        )
                      }
                  else
                    this.file.byteLength > t + s
                      ? (e.chunk = this.file.subarray(t, s))
                      : void 0 === e.size
                      ? (e.chunk = this.file.subarray(t))
                      : h('Segment unreachable: ' + JSON.stringify(e))
                  return e.chunk
                }),
                this.extendOptions && this.extendOptions(e),
                (this.options = e),
                (this.file = s),
                (this.parsers = i)
            }
            injectSegment(e, t) {
              this.options[e].enabled && this.createParser(e, t)
            }
            createParser(e, t) {
              let s = new (b.get(e))(t, this.options, this.file)
              return (this.parsers[e] = s)
            }
            createParsers(e) {
              for (let t of e) {
                let { type: e, chunk: s } = t,
                  i = this.options[e]
                if (i && i.enabled) {
                  let t = this.parsers[e]
                  ;(t && t.append) || t || this.createParser(e, s)
                }
              }
            }
            async readSegments(e) {
              let t = e.map(this.ensureSegmentChunk)
              await Promise.all(t)
            }
          } {
            constructor(...e) {
              super(...e),
                t(this, 'appSegments', []),
                t(this, 'jpegSegments', []),
                t(this, 'unknownSegments', [])
            }
            static canHandle(e, t) {
              return 65496 === t
            }
            async parse() {
              await this.findAppSegments(),
                await this.readSegments(this.appSegments),
                this.mergeMultiSegments(),
                this.createParsers(this.mergedAppSegments || this.appSegments)
            }
            setupSegmentFinderArgs(e) {
              !0 === e
                ? ((this.findAll = !0), (this.wanted = new Set(b.keyList())))
                : ((e =
                    void 0 === e
                      ? b.keyList().filter((e) => this.options[e].enabled)
                      : e.filter((e) => this.options[e].enabled && b.has(e))),
                  (this.findAll = !1),
                  (this.remaining = new Set(e)),
                  (this.wanted = new Set(e))),
                (this.unfinishedMultiSegment = !1)
            }
            async findAppSegments(e = 0, t) {
              this.setupSegmentFinderArgs(t)
              let { file: s, findAll: i, wanted: r, remaining: o } = this
              if (
                (!i &&
                  this.file.chunked &&
                  ((i = Array.from(r).some((e) => {
                    let t = b.get(e),
                      s = this.options[e]
                    return t.multiSegment && s.multiSegment
                  })),
                  i && (await this.file.readWhole())),
                (e = this.findAppSegmentsInRange(e, s.byteLength)),
                !this.options.onlyTiff && s.chunked)
              ) {
                let t = !1
                for (
                  ;
                  o.size > 0 &&
                  !t &&
                  (s.canReadNextChunk || this.unfinishedMultiSegment);

                ) {
                  let { nextChunkOffset: i } = s,
                    r = this.appSegments.some(
                      (e) =>
                        !this.file.available(
                          e.offset || e.start,
                          e.length || e.size
                        )
                    )
                  if (
                    ((t =
                      e > i && !r
                        ? !(await s.readNextChunk(e))
                        : !(await s.readNextChunk(i))),
                    void 0 ===
                      (e = this.findAppSegmentsInRange(e, s.byteLength)))
                  )
                    return
                }
              }
            }
            findAppSegmentsInRange(e, t) {
              t -= 2
              let s,
                i,
                r,
                o,
                n,
                a,
                {
                  file: l,
                  findAll: d,
                  wanted: p,
                  remaining: h,
                  options: u,
                } = this
              for (; e < t; e++)
                if (255 === l.getUint8(e))
                  if (((s = l.getUint8(e + 1)), le(s))) {
                    if (
                      ((i = l.getUint16(e + 2)),
                      (r = de(l, e, i)),
                      r &&
                        p.has(r) &&
                        ((o = b.get(r)),
                        (n = o.findPosition(l, e)),
                        (a = u[r]),
                        (n.type = r),
                        this.appSegments.push(n),
                        !d &&
                          (o.multiSegment && a.multiSegment
                            ? ((this.unfinishedMultiSegment =
                                n.chunkNumber < n.chunkCount),
                              this.unfinishedMultiSegment || h.delete(r))
                            : h.delete(r),
                          0 === h.size)))
                    )
                      break
                    u.recordUnknownSegments &&
                      ((n = ne.findPosition(l, e)),
                      (n.marker = s),
                      this.unknownSegments.push(n)),
                      (e += i + 1)
                  } else if (ae(s)) {
                    if (
                      ((i = l.getUint16(e + 2)),
                      218 === s && !1 !== u.stopAfterSos)
                    )
                      return
                    u.recordJpegSegments &&
                      this.jpegSegments.push({
                        offset: e,
                        length: i,
                        marker: s,
                      }),
                      (e += i + 1)
                  }
              return e
            }
            mergeMultiSegments() {
              if (!this.appSegments.some((e) => e.multiSegment)) return
              let e = (function (e, t) {
                let s,
                  i,
                  r,
                  o = new Map()
                for (let t = 0; t < e.length; t++)
                  (s = e[t]),
                    (i = s.type),
                    o.has(i) ? (r = o.get(i)) : o.set(i, (r = [])),
                    r.push(s)
                return Array.from(o)
              })(this.appSegments)
              this.mergedAppSegments = e.map(([e, t]) => {
                let s = b.get(e, this.options)
                return s.handleMultiSegments
                  ? { type: e, chunk: s.handleMultiSegments(t) }
                  : t[0]
              })
            }
            getSegment(e) {
              return this.appSegments.find((t) => t.type === e)
            }
            async getOrFindSegment(e) {
              let t = this.getSegment(e)
              return (
                void 0 === t &&
                  (await this.findAppSegments(0, [e]),
                  (t = this.getSegment(e))),
                t
              )
            }
          }
          t(pe, 'type', 'jpeg'), v.set('jpeg', pe)
          const he = [void 0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8, 4]
          class ue extends ne {
            parseHeader() {
              var e = this.chunk.getUint16()
              18761 === e ? (this.le = !0) : 19789 === e && (this.le = !1),
                (this.chunk.le = this.le),
                (this.headerParsed = !0)
            }
            parseTags(e, t, s = new Map()) {
              let { pick: i, skip: r } = this.options[t]
              i = new Set(i)
              let o = i.size > 0,
                n = 0 === r.size,
                a = this.chunk.getUint16(e)
              e += 2
              for (let l = 0; l < a; l++) {
                let a = this.chunk.getUint16(e)
                if (o) {
                  if (
                    i.has(a) &&
                    (s.set(a, this.parseTag(e, a, t)),
                    i.delete(a),
                    0 === i.size)
                  )
                    break
                } else (!n && r.has(a)) || s.set(a, this.parseTag(e, a, t))
                e += 12
              }
              return s
            }
            parseTag(e, t, s) {
              let { chunk: i } = this,
                r = i.getUint16(e + 2),
                o = i.getUint32(e + 4),
                n = he[r]
              if (
                (n * o <= 4 ? (e += 8) : (e = i.getUint32(e + 8)),
                (r < 1 || r > 13) &&
                  h(
                    `Invalid TIFF value type. block: ${s.toUpperCase()}, tag: ${t.toString(
                      16
                    )}, type: ${r}, offset ${e}`
                  ),
                e > i.byteLength &&
                  h(
                    `Invalid TIFF value offset. block: ${s.toUpperCase()}, tag: ${t.toString(
                      16
                    )}, type: ${r}, offset ${e} is outside of chunk size ${
                      i.byteLength
                    }`
                  ),
                1 === r)
              )
                return i.getUint8Array(e, o)
              if (2 === r)
                return '' ===
                  (a = (function (e) {
                    for (; e.endsWith('\0'); ) e = e.slice(0, -1)
                    return e
                  })((a = i.getString(e, o))).trim())
                  ? void 0
                  : a
              var a
              if (7 === r) return i.getUint8Array(e, o)
              if (1 === o) return this.parseTagValue(r, e)
              {
                let t = new ((function (e) {
                    switch (e) {
                      case 1:
                        return Uint8Array
                      case 3:
                        return Uint16Array
                      case 4:
                        return Uint32Array
                      case 5:
                      case 10:
                      default:
                        return Array
                      case 6:
                        return Int8Array
                      case 8:
                        return Int16Array
                      case 9:
                        return Int32Array
                      case 11:
                        return Float32Array
                      case 12:
                        return Float64Array
                    }
                  })(r))(o),
                  s = n
                for (let i = 0; i < o; i++)
                  (t[i] = this.parseTagValue(r, e)), (e += s)
                return t
              }
            }
            parseTagValue(e, t) {
              let { chunk: s } = this
              switch (e) {
                case 1:
                  return s.getUint8(t)
                case 3:
                  return s.getUint16(t)
                case 4:
                case 13:
                  return s.getUint32(t)
                case 5:
                  return s.getUint32(t) / s.getUint32(t + 4)
                case 6:
                  return s.getInt8(t)
                case 8:
                  return s.getInt16(t)
                case 9:
                  return s.getInt32(t)
                case 10:
                  return s.getInt32(t) / s.getInt32(t + 4)
                case 11:
                  return s.getFloat(t)
                case 12:
                  return s.getDouble(t)
                default:
                  h(`Invalid tiff type ${e}`)
              }
            }
          }
          class ce extends ue {
            static canHandle(e, t) {
              return (
                225 === e.getUint8(t + 1) &&
                1165519206 === e.getUint32(t + 4) &&
                0 === e.getUint16(t + 8)
              )
            }
            async parse() {
              this.parseHeader()
              let { options: e } = this
              return (
                e.ifd0.enabled && (await this.parseIfd0Block()),
                e.exif.enabled && (await this.safeParse('parseExifBlock')),
                e.gps.enabled && (await this.safeParse('parseGpsBlock')),
                e.interop.enabled &&
                  (await this.safeParse('parseInteropBlock')),
                e.ifd1.enabled && (await this.safeParse('parseThumbnailBlock')),
                this.createOutput()
              )
            }
            safeParse(e) {
              let t = this[e]()
              return void 0 !== t.catch && (t = t.catch(this.handleError)), t
            }
            findIfd0Offset() {
              void 0 === this.ifd0Offset &&
                (this.ifd0Offset = this.chunk.getUint32(4))
            }
            findIfd1Offset() {
              if (void 0 === this.ifd1Offset) {
                this.findIfd0Offset()
                let e = this.chunk.getUint16(this.ifd0Offset),
                  t = this.ifd0Offset + 2 + 12 * e
                this.ifd1Offset = this.chunk.getUint32(t)
              }
            }
            parseBlock(e, t) {
              let s = new Map()
              return (this[t] = s), this.parseTags(e, t, s), s
            }
            async parseIfd0Block() {
              if (this.ifd0) return
              let { file: e } = this
              this.findIfd0Offset(),
                this.ifd0Offset < 8 && h('Malformed EXIF data'),
                !e.chunked &&
                  this.ifd0Offset > e.byteLength &&
                  h(
                    `IFD0 offset points to outside of file.\nthis.ifd0Offset: ${this.ifd0Offset}, file.byteLength: ${e.byteLength}`
                  ),
                e.tiff &&
                  (await e.ensureChunk(this.ifd0Offset, u(this.options)))
              let t = this.parseBlock(this.ifd0Offset, 'ifd0')
              return 0 !== t.size
                ? ((this.exifOffset = t.get(M)),
                  (this.interopOffset = t.get(j)),
                  (this.gpsOffset = t.get(L)),
                  (this.xmp = t.get(700)),
                  (this.iptc = t.get(N)),
                  (this.icc = t.get(B)),
                  this.options.sanitize &&
                    (t.delete(M),
                    t.delete(j),
                    t.delete(L),
                    t.delete(700),
                    t.delete(N),
                    t.delete(B)),
                  t)
                : void 0
            }
            async parseExifBlock() {
              if (this.exif) return
              if (
                (this.ifd0 || (await this.parseIfd0Block()),
                void 0 === this.exifOffset)
              )
                return
              this.file.tiff &&
                (await this.file.ensureChunk(this.exifOffset, u(this.options)))
              let e = this.parseBlock(this.exifOffset, 'exif')
              return (
                this.interopOffset || (this.interopOffset = e.get(j)),
                (this.makerNote = e.get(R)),
                (this.userComment = e.get(I)),
                this.options.sanitize &&
                  (e.delete(j), e.delete(R), e.delete(I)),
                this.unpack(e, 41728),
                this.unpack(e, 41729),
                e
              )
            }
            unpack(e, t) {
              let s = e.get(t)
              s && 1 === s.length && e.set(t, s[0])
            }
            async parseGpsBlock() {
              if (this.gps) return
              if (
                (this.ifd0 || (await this.parseIfd0Block()),
                void 0 === this.gpsOffset)
              )
                return
              let e = this.parseBlock(this.gpsOffset, 'gps')
              return (
                e &&
                  e.has(2) &&
                  e.has(4) &&
                  (e.set('latitude', fe(...e.get(2), e.get(1))),
                  e.set('longitude', fe(...e.get(4), e.get(3)))),
                e
              )
            }
            async parseInteropBlock() {
              if (
                !this.interop &&
                (this.ifd0 || (await this.parseIfd0Block()),
                void 0 !== this.interopOffset ||
                  this.exif ||
                  (await this.parseExifBlock()),
                void 0 !== this.interopOffset)
              )
                return this.parseBlock(this.interopOffset, 'interop')
            }
            async parseThumbnailBlock(e = !1) {
              if (
                !this.ifd1 &&
                !this.ifd1Parsed &&
                (!this.options.mergeOutput || e)
              )
                return (
                  this.findIfd1Offset(),
                  this.ifd1Offset > 0 &&
                    (this.parseBlock(this.ifd1Offset, 'ifd1'),
                    (this.ifd1Parsed = !0)),
                  this.ifd1
                )
            }
            async extractThumbnail() {
              if (
                (this.headerParsed || this.parseHeader(),
                this.ifd1Parsed || (await this.parseThumbnailBlock(!0)),
                void 0 === this.ifd1)
              )
                return
              let e = this.ifd1.get(513),
                t = this.ifd1.get(514)
              return this.chunk.getUint8Array(e, t)
            }
            get image() {
              return this.ifd0
            }
            get thumbnail() {
              return this.ifd1
            }
            createOutput() {
              let e,
                t,
                s,
                i = {}
              for (t of V)
                if (((e = this[t]), !p(e)))
                  if (
                    ((s = this.canTranslate
                      ? this.translateBlock(e, t)
                      : Object.fromEntries(e)),
                    this.options.mergeOutput)
                  ) {
                    if ('ifd1' === t) continue
                    Object.assign(i, s)
                  } else i[t] = s
              return (
                this.makerNote && (i.makerNote = this.makerNote),
                this.userComment && (i.userComment = this.userComment),
                i
              )
            }
            assignToOutput(e, t) {
              if (this.globalOptions.mergeOutput) Object.assign(e, t)
              else
                for (let [s, i] of Object.entries(t))
                  this.assignObjectToOutput(e, s, i)
            }
          }
          function fe(e, t, s, i) {
            var r = e + t / 60 + s / 3600
            return ('S' !== i && 'W' !== i) || (r *= -1), r
          }
          t(ce, 'type', 'tiff'), t(ce, 'headerLength', 10), b.set('tiff', ce)
          var me = Object.freeze({
            __proto__: null,
            default: oe,
            Exifr: ie,
            fileParsers: v,
            segmentParsers: b,
            fileReaders: w,
            tagKeys: E,
            tagValues: U,
            tagRevivers: D,
            createDictionary: x,
            extendDictionary: A,
            fetchUrlAsArrayBuffer: k,
            readBlobAsArrayBuffer: T,
            chunkedProps: z,
            otherSegments: $,
            segments: q,
            tiffBlocks: V,
            segmentsAndBlocks: H,
            tiffExtractables: W,
            inheritables: G,
            allFormatters: K,
            Options: Z,
            parse: re,
          })
          const ge = {
              ifd0: !1,
              ifd1: !1,
              exif: !1,
              gps: !1,
              interop: !1,
              sanitize: !1,
              reviveValues: !0,
              translateKeys: !1,
              translateValues: !1,
              mergeOutput: !1,
            },
            ye = Object.assign({}, ge, {
              firstChunkSize: 4e4,
              gps: [1, 2, 3, 4],
            }),
            ve = Object.assign({}, ge, { tiff: !1, ifd1: !0, mergeOutput: !1 }),
            be = Object.assign({}, ge, { firstChunkSize: 4e4, ifd0: [274] })
          async function we(e) {
            let t = new ie(be)
            await t.read(e)
            let s = await t.parse()
            if (s && s.ifd0) return s.ifd0[274]
          }
          const Se = Object.freeze({
            1: { dimensionSwapped: !1, scaleX: 1, scaleY: 1, deg: 0, rad: 0 },
            2: { dimensionSwapped: !1, scaleX: -1, scaleY: 1, deg: 0, rad: 0 },
            3: {
              dimensionSwapped: !1,
              scaleX: 1,
              scaleY: 1,
              deg: 180,
              rad: (180 * Math.PI) / 180,
            },
            4: {
              dimensionSwapped: !1,
              scaleX: -1,
              scaleY: 1,
              deg: 180,
              rad: (180 * Math.PI) / 180,
            },
            5: {
              dimensionSwapped: !0,
              scaleX: 1,
              scaleY: -1,
              deg: 90,
              rad: (90 * Math.PI) / 180,
            },
            6: {
              dimensionSwapped: !0,
              scaleX: 1,
              scaleY: 1,
              deg: 90,
              rad: (90 * Math.PI) / 180,
            },
            7: {
              dimensionSwapped: !0,
              scaleX: 1,
              scaleY: -1,
              deg: 270,
              rad: (270 * Math.PI) / 180,
            },
            8: {
              dimensionSwapped: !0,
              scaleX: 1,
              scaleY: 1,
              deg: 270,
              rad: (270 * Math.PI) / 180,
            },
          })
          if (
            ((e.rotateCanvas = !0),
            (e.rotateCss = !0),
            'object' == typeof navigator)
          ) {
            let t = navigator.userAgent
            if (t.includes('iPad') || t.includes('iPhone')) {
              let s = t.match(/OS (\d+)_(\d+)/)
              if (s) {
                let [, t, i] = s,
                  r = Number(t) + 0.1 * Number(i)
                ;(e.rotateCanvas = r < 13.4), (e.rotateCss = !1)
              }
            } else if (t.includes('OS X 10')) {
              let [, s] = t.match(/OS X 10[_.](\d+)/)
              e.rotateCanvas = e.rotateCss = Number(s) < 15
            }
            if (t.includes('Chrome/')) {
              let [, s] = t.match(/Chrome\/(\d+)/)
              e.rotateCanvas = e.rotateCss = Number(s) < 81
            } else if (t.includes('Firefox/')) {
              let [, s] = t.match(/Firefox\/(\d+)/)
              e.rotateCanvas = e.rotateCss = Number(s) < 77
            }
          }
          class Pe extends m {
            constructor(...e) {
              super(...e),
                t(this, 'ranges', new Fe()),
                0 !== this.byteLength && this.ranges.add(0, this.byteLength)
            }
            _tryExtend(e, t, s) {
              if (0 === e && 0 === this.byteLength && s) {
                let e = new DataView(s.buffer || s, s.byteOffset, s.byteLength)
                this._swapDataView(e)
              } else {
                let s = e + t
                if (s > this.byteLength) {
                  let { dataView: e } = this._extend(s)
                  this._swapDataView(e)
                }
              }
            }
            _extend(e) {
              let t
              t = l ? a.allocUnsafe(e) : new Uint8Array(e)
              let s = new DataView(t.buffer, t.byteOffset, t.byteLength)
              return (
                t.set(
                  new Uint8Array(this.buffer, this.byteOffset, this.byteLength),
                  0
                ),
                { uintView: t, dataView: s }
              )
            }
            subarray(e, t, s = !1) {
              return (
                (t = t || this._lengthToEnd(e)),
                s && this._tryExtend(e, t),
                this.ranges.add(e, t),
                super.subarray(e, t)
              )
            }
            set(e, t, s = !1) {
              s && this._tryExtend(t, e.byteLength, e)
              let i = super.set(e, t)
              return this.ranges.add(t, i.byteLength), i
            }
            async ensureChunk(e, t) {
              this.chunked &&
                (this.ranges.available(e, t) || (await this.readChunk(e, t)))
            }
            available(e, t) {
              return this.ranges.available(e, t)
            }
          }
          class Fe {
            constructor() {
              t(this, 'list', [])
            }
            get length() {
              return this.list.length
            }
            add(e, t, s = 0) {
              let i = e + t,
                r = this.list.filter(
                  (t) => _e(e, t.offset, i) || _e(e, t.end, i)
                )
              if (r.length > 0) {
                ;(e = Math.min(e, ...r.map((e) => e.offset))),
                  (i = Math.max(i, ...r.map((e) => e.end))),
                  (t = i - e)
                let s = r.shift()
                ;(s.offset = e),
                  (s.length = t),
                  (s.end = i),
                  (this.list = this.list.filter((e) => !r.includes(e)))
              } else this.list.push({ offset: e, length: t, end: i })
            }
            available(e, t) {
              let s = e + t
              return this.list.some((t) => t.offset <= e && s <= t.end)
            }
          }
          function _e(e, t, s) {
            return e <= t && t <= s
          }
          class Ce extends Pe {
            constructor(e, s) {
              super(0),
                t(this, 'chunksRead', 0),
                (this.input = e),
                (this.options = s)
            }
            async readWhole() {
              ;(this.chunked = !1), await this.readChunk(this.nextChunkOffset)
            }
            async readChunked() {
              ;(this.chunked = !0),
                await this.readChunk(0, this.options.firstChunkSize)
            }
            async readNextChunk(e = this.nextChunkOffset) {
              if (this.fullyRead) return this.chunksRead++, !1
              let t = this.options.chunkSize,
                s = await this.readChunk(e, t)
              return !!s && s.byteLength === t
            }
            async readChunk(e, t) {
              if ((this.chunksRead++, 0 !== (t = this.safeWrapAddress(e, t))))
                return this._readChunk(e, t)
            }
            safeWrapAddress(e, t) {
              return void 0 !== this.size && e + t > this.size
                ? Math.max(0, this.size - e)
                : t
            }
            get nextChunkOffset() {
              if (0 !== this.ranges.list.length)
                return this.ranges.list[0].length
            }
            get canReadNextChunk() {
              return this.chunksRead < this.options.chunkLimit
            }
            get fullyRead() {
              return void 0 !== this.size && this.nextChunkOffset === this.size
            }
            read() {
              return this.options.chunked
                ? this.readChunked()
                : this.readWhole()
            }
            close() {}
          }
          w.set(
            'blob',
            class extends Ce {
              async readWhole() {
                this.chunked = !1
                let e = await T(this.input)
                this._swapArrayBuffer(e)
              }
              readChunked() {
                return (
                  (this.chunked = !0),
                  (this.size = this.input.size),
                  super.readChunked()
                )
              }
              async _readChunk(e, t) {
                let s = t ? e + t : void 0,
                  i = this.input.slice(e, s),
                  r = await T(i)
                return this.set(r, e, !0)
              }
            }
          ),
            (e.Exifr = ie),
            (e.Options = Z),
            (e.allFormatters = K),
            (e.chunkedProps = z),
            (e.createDictionary = x),
            (e.default = me),
            (e.extendDictionary = A),
            (e.fetchUrlAsArrayBuffer = k),
            (e.fileParsers = v),
            (e.fileReaders = w),
            (e.gps = async function (e) {
              let t = new ie(ye)
              await t.read(e)
              let s = await t.parse()
              if (s && s.gps) {
                let { latitude: e, longitude: t } = s.gps
                return { latitude: e, longitude: t }
              }
            }),
            (e.gpsOnlyOptions = ye),
            (e.inheritables = G),
            (e.orientation = we),
            (e.orientationOnlyOptions = be),
            (e.otherSegments = $),
            (e.parse = re),
            (e.readBlobAsArrayBuffer = T),
            (e.rotation = async function (t) {
              let s = await we(t)
              return Object.assign(
                { canvas: e.rotateCanvas, css: e.rotateCss },
                Se[s]
              )
            }),
            (e.rotations = Se),
            (e.segmentParsers = b),
            (e.segments = q),
            (e.segmentsAndBlocks = H),
            (e.tagKeys = E),
            (e.tagRevivers = D),
            (e.tagValues = U),
            (e.thumbnail = async function (e) {
              let t = new ie(ve)
              await t.read(e)
              let s = await t.extractThumbnail()
              return s && l ? a.from(s) : s
            }),
            (e.thumbnailOnlyOptions = ve),
            (e.thumbnailUrl = async function (e) {
              let t = await this.thumbnail(e)
              if (void 0 !== t) {
                let e = new Blob([t])
                return URL.createObjectURL(e)
              }
            }),
            (e.tiffBlocks = V),
            (e.tiffExtractables = W),
            Object.defineProperty(e, '__esModule', { value: !0 })
        })(t)
      },
      81: (e) => {
        e.exports = function (e, t) {
          if (e === t) return !0
          for (var s in e) if (!(s in t)) return !1
          for (var s in t) if (e[s] !== t[s]) return !1
          return !0
        }
      },
      1296: (e, t, s) => {
        var i = /^\s+|\s+$/g,
          r = /^[-+]0x[0-9a-f]+$/i,
          o = /^0b[01]+$/i,
          n = /^0o[0-7]+$/i,
          a = parseInt,
          l = 'object' == typeof s.g && s.g && s.g.Object === Object && s.g,
          d = 'object' == typeof self && self && self.Object === Object && self,
          p = l || d || Function('return this')(),
          h = Object.prototype.toString,
          u = Math.max,
          c = Math.min,
          f = function () {
            return p.Date.now()
          }
        function m(e) {
          var t = typeof e
          return !!e && ('object' == t || 'function' == t)
        }
        function g(e) {
          if ('number' == typeof e) return e
          if (
            (function (e) {
              return (
                'symbol' == typeof e ||
                ((function (e) {
                  return !!e && 'object' == typeof e
                })(e) &&
                  '[object Symbol]' == h.call(e))
              )
            })(e)
          )
            return NaN
          if (m(e)) {
            var t = 'function' == typeof e.valueOf ? e.valueOf() : e
            e = m(t) ? t + '' : t
          }
          if ('string' != typeof e) return 0 === e ? e : +e
          e = e.replace(i, '')
          var s = o.test(e)
          return s || n.test(e)
            ? a(e.slice(2), s ? 2 : 8)
            : r.test(e)
            ? NaN
            : +e
        }
        e.exports = function (e, t, s) {
          var i,
            r,
            o,
            n,
            a,
            l,
            d = 0,
            p = !1,
            h = !1,
            y = !0
          if ('function' != typeof e) throw new TypeError('Expected a function')
          function v(t) {
            var s = i,
              o = r
            return (i = r = void 0), (d = t), (n = e.apply(o, s))
          }
          function b(e) {
            return (d = e), (a = setTimeout(S, t)), p ? v(e) : n
          }
          function w(e) {
            var s = e - l
            return void 0 === l || s >= t || s < 0 || (h && e - d >= o)
          }
          function S() {
            var e = f()
            if (w(e)) return P(e)
            a = setTimeout(
              S,
              (function (e) {
                var s = t - (e - l)
                return h ? c(s, o - (e - d)) : s
              })(e)
            )
          }
          function P(e) {
            return (a = void 0), y && i ? v(e) : ((i = r = void 0), n)
          }
          function F() {
            var e = f(),
              s = w(e)
            if (((i = arguments), (r = this), (l = e), s)) {
              if (void 0 === a) return b(l)
              if (h) return (a = setTimeout(S, t)), v(l)
            }
            return void 0 === a && (a = setTimeout(S, t)), n
          }
          return (
            (t = g(t) || 0),
            m(s) &&
              ((p = !!s.leading),
              (o = (h = 'maxWait' in s) ? u(g(s.maxWait) || 0, t) : o),
              (y = 'trailing' in s ? !!s.trailing : y)),
            (F.cancel = function () {
              void 0 !== a && clearTimeout(a), (d = 0), (i = l = r = a = void 0)
            }),
            (F.flush = function () {
              return void 0 === a ? n : P(f())
            }),
            F
          )
        }
      },
      3096: (e, t, s) => {
        var i = 'Expected a function',
          r = /^\s+|\s+$/g,
          o = /^[-+]0x[0-9a-f]+$/i,
          n = /^0b[01]+$/i,
          a = /^0o[0-7]+$/i,
          l = parseInt,
          d = 'object' == typeof s.g && s.g && s.g.Object === Object && s.g,
          p = 'object' == typeof self && self && self.Object === Object && self,
          h = d || p || Function('return this')(),
          u = Object.prototype.toString,
          c = Math.max,
          f = Math.min,
          m = function () {
            return h.Date.now()
          }
        function g(e) {
          var t = typeof e
          return !!e && ('object' == t || 'function' == t)
        }
        function y(e) {
          if ('number' == typeof e) return e
          if (
            (function (e) {
              return (
                'symbol' == typeof e ||
                ((function (e) {
                  return !!e && 'object' == typeof e
                })(e) &&
                  '[object Symbol]' == u.call(e))
              )
            })(e)
          )
            return NaN
          if (g(e)) {
            var t = 'function' == typeof e.valueOf ? e.valueOf() : e
            e = g(t) ? t + '' : t
          }
          if ('string' != typeof e) return 0 === e ? e : +e
          e = e.replace(r, '')
          var s = n.test(e)
          return s || a.test(e)
            ? l(e.slice(2), s ? 2 : 8)
            : o.test(e)
            ? NaN
            : +e
        }
        e.exports = function (e, t, s) {
          var r = !0,
            o = !0
          if ('function' != typeof e) throw new TypeError(i)
          return (
            g(s) &&
              ((r = 'leading' in s ? !!s.leading : r),
              (o = 'trailing' in s ? !!s.trailing : o)),
            (function (e, t, s) {
              var r,
                o,
                n,
                a,
                l,
                d,
                p = 0,
                h = !1,
                u = !1,
                v = !0
              if ('function' != typeof e) throw new TypeError(i)
              function b(t) {
                var s = r,
                  i = o
                return (r = o = void 0), (p = t), (a = e.apply(i, s))
              }
              function w(e) {
                return (p = e), (l = setTimeout(P, t)), h ? b(e) : a
              }
              function S(e) {
                var s = e - d
                return void 0 === d || s >= t || s < 0 || (u && e - p >= n)
              }
              function P() {
                var e = m()
                if (S(e)) return F(e)
                l = setTimeout(
                  P,
                  (function (e) {
                    var s = t - (e - d)
                    return u ? f(s, n - (e - p)) : s
                  })(e)
                )
              }
              function F(e) {
                return (l = void 0), v && r ? b(e) : ((r = o = void 0), a)
              }
              function _() {
                var e = m(),
                  s = S(e)
                if (((r = arguments), (o = this), (d = e), s)) {
                  if (void 0 === l) return w(d)
                  if (u) return (l = setTimeout(P, t)), b(d)
                }
                return void 0 === l && (l = setTimeout(P, t)), a
              }
              return (
                (t = y(t) || 0),
                g(s) &&
                  ((h = !!s.leading),
                  (n = (u = 'maxWait' in s) ? c(y(s.maxWait) || 0, t) : n),
                  (v = 'trailing' in s ? !!s.trailing : v)),
                (_.cancel = function () {
                  void 0 !== l && clearTimeout(l),
                    (p = 0),
                    (r = d = o = l = void 0)
                }),
                (_.flush = function () {
                  return void 0 === l ? a : F(m())
                }),
                _
              )
            })(e, t, { leading: r, maxWait: t, trailing: o })
          )
        }
      },
      845: (e, t, s) => {
        'use strict'
        s.r(t), s.d(t, { default: () => o })
        var i =
          Number.isNaN ||
          function (e) {
            return 'number' == typeof e && e != e
          }
        function r(e, t) {
          if (e.length !== t.length) return !1
          for (var s = 0; s < e.length; s++)
            if (!((r = e[s]) === (o = t[s]) || (i(r) && i(o)))) return !1
          var r, o
          return !0
        }
        const o = function (e, t) {
          var s
          void 0 === t && (t = r)
          var i,
            o = [],
            n = !1
          return function () {
            for (var r = [], a = 0; a < arguments.length; a++)
              r[a] = arguments[a]
            return (
              (n && s === this && t(r, o)) ||
                ((i = e.apply(this, r)), (n = !0), (s = this), (o = r)),
              i
            )
          }
        }
      },
      4193: (e, t, s) => {
        var i = s(1196),
          r = /[\/\+\.]/
        e.exports = function (e, t) {
          function s(t) {
            var s = i(t, e, r)
            return s && s.length >= 2
          }
          return t ? s(t.split(';')[0]) : s
        }
      },
      4800: (e) => {
        e.exports = function () {
          var e = {},
            t = (e._fns = {})
          return (
            (e.emit = function (e, s, i, r, o, n, a) {
              var l = (function (e) {
                for (
                  var s = t[e] ? t[e] : [],
                    i = e.indexOf(':'),
                    r =
                      -1 === i ? [e] : [e.substring(0, i), e.substring(i + 1)],
                    o = Object.keys(t),
                    n = 0,
                    a = o.length;
                  n < a;
                  n++
                ) {
                  var l = o[n]
                  if (
                    ('*' === l && (s = s.concat(t[l])),
                    2 === r.length && r[0] === l)
                  ) {
                    s = s.concat(t[l])
                    break
                  }
                }
                return s
              })(e)
              l.length &&
                (function (e, t, s) {
                  for (var i = 0, r = t.length; i < r && t[i]; i++)
                    (t[i].event = e), t[i].apply(t[i], s)
                })(e, l, [s, i, r, o, n, a])
            }),
            (e.on = function (e, s) {
              t[e] || (t[e] = []), t[e].push(s)
            }),
            (e.once = function (t, s) {
              this.on(t, function i() {
                s.apply(this, arguments), e.off(t, i)
              })
            }),
            (e.off = function (e, t) {
              var s = []
              if (e && t)
                for (
                  var i = this._fns[e], r = 0, o = i ? i.length : 0;
                  r < o;
                  r++
                )
                  i[r] !== t && s.push(i[r])
              s.length ? (this._fns[e] = s) : delete this._fns[e]
            }),
            e
          )
        }
      },
      6400: (e, t, s) => {
        'use strict'
        s.r(t),
          s.d(t, {
            Component: () => w,
            Fragment: () => b,
            cloneElement: () => z,
            createContext: () => $,
            createElement: () => g,
            createRef: () => v,
            h: () => g,
            hydrate: () => j,
            isValidElement: () => n,
            options: () => r,
            render: () => L,
            toChildArray: () => T,
          })
        var i,
          r,
          o,
          n,
          a,
          l,
          d,
          p,
          h = {},
          u = [],
          c =
            /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i
        function f(e, t) {
          for (var s in t) e[s] = t[s]
          return e
        }
        function m(e) {
          var t = e.parentNode
          t && t.removeChild(e)
        }
        function g(e, t, s) {
          var r,
            o,
            n,
            a = {}
          for (n in t)
            'key' == n ? (r = t[n]) : 'ref' == n ? (o = t[n]) : (a[n] = t[n])
          if (
            (arguments.length > 2 &&
              (a.children = arguments.length > 3 ? i.call(arguments, 2) : s),
            'function' == typeof e && null != e.defaultProps)
          )
            for (n in e.defaultProps)
              void 0 === a[n] && (a[n] = e.defaultProps[n])
          return y(e, a, r, o, null)
        }
        function y(e, t, s, i, n) {
          var a = {
            type: e,
            props: t,
            key: s,
            ref: i,
            __k: null,
            __: null,
            __b: 0,
            __e: null,
            __d: void 0,
            __c: null,
            __h: null,
            constructor: void 0,
            __v: null == n ? ++o : n,
          }
          return null == n && null != r.vnode && r.vnode(a), a
        }
        function v() {
          return { current: null }
        }
        function b(e) {
          return e.children
        }
        function w(e, t) {
          ;(this.props = e), (this.context = t)
        }
        function S(e, t) {
          if (null == t) return e.__ ? S(e.__, e.__.__k.indexOf(e) + 1) : null
          for (var s; t < e.__k.length; t++)
            if (null != (s = e.__k[t]) && null != s.__e) return s.__e
          return 'function' == typeof e.type ? S(e) : null
        }
        function P(e) {
          var t, s
          if (null != (e = e.__) && null != e.__c) {
            for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++)
              if (null != (s = e.__k[t]) && null != s.__e) {
                e.__e = e.__c.base = s.__e
                break
              }
            return P(e)
          }
        }
        function F(e) {
          ;((!e.__d && (e.__d = !0) && a.push(e) && !_.__r++) ||
            d !== r.debounceRendering) &&
            ((d = r.debounceRendering) || l)(_)
        }
        function _() {
          for (var e; (_.__r = a.length); )
            (e = a.sort(function (e, t) {
              return e.__v.__b - t.__v.__b
            })),
              (a = []),
              e.some(function (e) {
                var t, s, i, r, o, n
                e.__d &&
                  ((o = (r = (t = e).__v).__e),
                  (n = t.__P) &&
                    ((s = []),
                    ((i = f({}, r)).__v = r.__v + 1),
                    D(
                      n,
                      r,
                      i,
                      t.__n,
                      void 0 !== n.ownerSVGElement,
                      null != r.__h ? [o] : null,
                      s,
                      null == o ? S(r) : o,
                      r.__h
                    ),
                    R(s, r),
                    r.__e != o && P(r)))
              })
        }
        function C(e, t, s, i, r, o, n, a, l, d) {
          var p,
            c,
            f,
            m,
            g,
            v,
            w,
            P = (i && i.__k) || u,
            F = P.length
          for (s.__k = [], p = 0; p < t.length; p++)
            if (
              null !=
              (m = s.__k[p] =
                null == (m = t[p]) || 'boolean' == typeof m
                  ? null
                  : 'string' == typeof m ||
                    'number' == typeof m ||
                    'bigint' == typeof m
                  ? y(null, m, null, null, m)
                  : Array.isArray(m)
                  ? y(b, { children: m }, null, null, null)
                  : m.__b > 0
                  ? y(m.type, m.props, m.key, null, m.__v)
                  : m)
            ) {
              if (
                ((m.__ = s),
                (m.__b = s.__b + 1),
                null === (f = P[p]) ||
                  (f && m.key == f.key && m.type === f.type))
              )
                P[p] = void 0
              else
                for (c = 0; c < F; c++) {
                  if ((f = P[c]) && m.key == f.key && m.type === f.type) {
                    P[c] = void 0
                    break
                  }
                  f = null
                }
              D(e, m, (f = f || h), r, o, n, a, l, d),
                (g = m.__e),
                (c = m.ref) &&
                  f.ref != c &&
                  (w || (w = []),
                  f.ref && w.push(f.ref, null, m),
                  w.push(c, m.__c || g, m)),
                null != g
                  ? (null == v && (v = g),
                    'function' == typeof m.type && m.__k === f.__k
                      ? (m.__d = l = k(m, l, e))
                      : (l = O(e, m, f, P, g, l)),
                    'function' == typeof s.type && (s.__d = l))
                  : l && f.__e == l && l.parentNode != e && (l = S(f))
            }
          for (s.__e = v, p = F; p--; )
            null != P[p] &&
              ('function' == typeof s.type &&
                null != P[p].__e &&
                P[p].__e == s.__d &&
                (s.__d = S(i, p + 1)),
              B(P[p], P[p]))
          if (w) for (p = 0; p < w.length; p++) N(w[p], w[++p], w[++p])
        }
        function k(e, t, s) {
          for (var i, r = e.__k, o = 0; r && o < r.length; o++)
            (i = r[o]) &&
              ((i.__ = e),
              (t =
                'function' == typeof i.type
                  ? k(i, t, s)
                  : O(s, i, i, r, i.__e, t)))
          return t
        }
        function T(e, t) {
          return (
            (t = t || []),
            null == e ||
              'boolean' == typeof e ||
              (Array.isArray(e)
                ? e.some(function (e) {
                    T(e, t)
                  })
                : t.push(e)),
            t
          )
        }
        function O(e, t, s, i, r, o) {
          var n, a, l
          if (void 0 !== t.__d) (n = t.__d), (t.__d = void 0)
          else if (null == s || r != o || null == r.parentNode)
            e: if (null == o || o.parentNode !== e) e.appendChild(r), (n = null)
            else {
              for (a = o, l = 0; (a = a.nextSibling) && l < i.length; l += 2)
                if (a == r) break e
              e.insertBefore(r, o), (n = o)
            }
          return void 0 !== n ? n : r.nextSibling
        }
        function x(e, t, s) {
          '-' === t[0]
            ? e.setProperty(t, s)
            : (e[t] =
                null == s
                  ? ''
                  : 'number' != typeof s || c.test(t)
                  ? s
                  : s + 'px')
        }
        function A(e, t, s, i, r) {
          var o
          e: if ('style' === t)
            if ('string' == typeof s) e.style.cssText = s
            else {
              if (('string' == typeof i && (e.style.cssText = i = ''), i))
                for (t in i) (s && t in s) || x(e.style, t, '')
              if (s) for (t in s) (i && s[t] === i[t]) || x(e.style, t, s[t])
            }
          else if ('o' === t[0] && 'n' === t[1])
            (o = t !== (t = t.replace(/Capture$/, ''))),
              (t =
                t.toLowerCase() in e ? t.toLowerCase().slice(2) : t.slice(2)),
              e.l || (e.l = {}),
              (e.l[t + o] = s),
              s
                ? i || e.addEventListener(t, o ? U : E, o)
                : e.removeEventListener(t, o ? U : E, o)
          else if ('dangerouslySetInnerHTML' !== t) {
            if (r) t = t.replace(/xlink(H|:h)/, 'h').replace(/sName$/, 's')
            else if (
              'href' !== t &&
              'list' !== t &&
              'form' !== t &&
              'tabIndex' !== t &&
              'download' !== t &&
              t in e
            )
              try {
                e[t] = null == s ? '' : s
                break e
              } catch (e) {}
            'function' == typeof s ||
              (null != s && (!1 !== s || ('a' === t[0] && 'r' === t[1]))
                ? e.setAttribute(t, s)
                : e.removeAttribute(t))
          }
        }
        function E(e) {
          this.l[e.type + !1](r.event ? r.event(e) : e)
        }
        function U(e) {
          this.l[e.type + !0](r.event ? r.event(e) : e)
        }
        function D(e, t, s, i, o, n, a, l, d) {
          var p,
            h,
            u,
            c,
            m,
            g,
            y,
            v,
            S,
            P,
            F,
            _ = t.type
          if (void 0 !== t.constructor) return null
          null != s.__h &&
            ((d = s.__h), (l = t.__e = s.__e), (t.__h = null), (n = [l])),
            (p = r.__b) && p(t)
          try {
            e: if ('function' == typeof _) {
              if (
                ((v = t.props),
                (S = (p = _.contextType) && i[p.__c]),
                (P = p ? (S ? S.props.value : p.__) : i),
                s.__c
                  ? (y = (h = t.__c = s.__c).__ = h.__E)
                  : ('prototype' in _ && _.prototype.render
                      ? (t.__c = h = new _(v, P))
                      : ((t.__c = h = new w(v, P)),
                        (h.constructor = _),
                        (h.render = M)),
                    S && S.sub(h),
                    (h.props = v),
                    h.state || (h.state = {}),
                    (h.context = P),
                    (h.__n = i),
                    (u = h.__d = !0),
                    (h.__h = [])),
                null == h.__s && (h.__s = h.state),
                null != _.getDerivedStateFromProps &&
                  (h.__s == h.state && (h.__s = f({}, h.__s)),
                  f(h.__s, _.getDerivedStateFromProps(v, h.__s))),
                (c = h.props),
                (m = h.state),
                u)
              )
                null == _.getDerivedStateFromProps &&
                  null != h.componentWillMount &&
                  h.componentWillMount(),
                  null != h.componentDidMount && h.__h.push(h.componentDidMount)
              else {
                if (
                  (null == _.getDerivedStateFromProps &&
                    v !== c &&
                    null != h.componentWillReceiveProps &&
                    h.componentWillReceiveProps(v, P),
                  (!h.__e &&
                    null != h.shouldComponentUpdate &&
                    !1 === h.shouldComponentUpdate(v, h.__s, P)) ||
                    t.__v === s.__v)
                ) {
                  ;(h.props = v),
                    (h.state = h.__s),
                    t.__v !== s.__v && (h.__d = !1),
                    (h.__v = t),
                    (t.__e = s.__e),
                    (t.__k = s.__k),
                    t.__k.forEach(function (e) {
                      e && (e.__ = t)
                    }),
                    h.__h.length && a.push(h)
                  break e
                }
                null != h.componentWillUpdate &&
                  h.componentWillUpdate(v, h.__s, P),
                  null != h.componentDidUpdate &&
                    h.__h.push(function () {
                      h.componentDidUpdate(c, m, g)
                    })
              }
              ;(h.context = P),
                (h.props = v),
                (h.state = h.__s),
                (p = r.__r) && p(t),
                (h.__d = !1),
                (h.__v = t),
                (h.__P = e),
                (p = h.render(h.props, h.state, h.context)),
                (h.state = h.__s),
                null != h.getChildContext &&
                  (i = f(f({}, i), h.getChildContext())),
                u ||
                  null == h.getSnapshotBeforeUpdate ||
                  (g = h.getSnapshotBeforeUpdate(c, m)),
                (F =
                  null != p && p.type === b && null == p.key
                    ? p.props.children
                    : p),
                C(e, Array.isArray(F) ? F : [F], t, s, i, o, n, a, l, d),
                (h.base = t.__e),
                (t.__h = null),
                h.__h.length && a.push(h),
                y && (h.__E = h.__ = null),
                (h.__e = !1)
            } else
              null == n && t.__v === s.__v
                ? ((t.__k = s.__k), (t.__e = s.__e))
                : (t.__e = I(s.__e, t, s, i, o, n, a, d))
            ;(p = r.diffed) && p(t)
          } catch (e) {
            ;(t.__v = null),
              (d || null != n) &&
                ((t.__e = l), (t.__h = !!d), (n[n.indexOf(l)] = null)),
              r.__e(e, t, s)
          }
        }
        function R(e, t) {
          r.__c && r.__c(t, e),
            e.some(function (t) {
              try {
                ;(e = t.__h),
                  (t.__h = []),
                  e.some(function (e) {
                    e.call(t)
                  })
              } catch (e) {
                r.__e(e, t.__v)
              }
            })
        }
        function I(e, t, s, r, o, n, a, l) {
          var d,
            p,
            u,
            c = s.props,
            f = t.props,
            g = t.type,
            y = 0
          if (('svg' === g && (o = !0), null != n))
            for (; y < n.length; y++)
              if (
                (d = n[y]) &&
                'setAttribute' in d == !!g &&
                (g ? d.localName === g : 3 === d.nodeType)
              ) {
                ;(e = d), (n[y] = null)
                break
              }
          if (null == e) {
            if (null === g) return document.createTextNode(f)
            ;(e = o
              ? document.createElementNS('http://www.w3.org/2000/svg', g)
              : document.createElement(g, f.is && f)),
              (n = null),
              (l = !1)
          }
          if (null === g) c === f || (l && e.data === f) || (e.data = f)
          else {
            if (
              ((n = n && i.call(e.childNodes)),
              (p = (c = s.props || h).dangerouslySetInnerHTML),
              (u = f.dangerouslySetInnerHTML),
              !l)
            ) {
              if (null != n)
                for (c = {}, y = 0; y < e.attributes.length; y++)
                  c[e.attributes[y].name] = e.attributes[y].value
              ;(u || p) &&
                ((u &&
                  ((p && u.__html == p.__html) || u.__html === e.innerHTML)) ||
                  (e.innerHTML = (u && u.__html) || ''))
            }
            if (
              ((function (e, t, s, i, r) {
                var o
                for (o in s)
                  'children' === o ||
                    'key' === o ||
                    o in t ||
                    A(e, o, null, s[o], i)
                for (o in t)
                  (r && 'function' != typeof t[o]) ||
                    'children' === o ||
                    'key' === o ||
                    'value' === o ||
                    'checked' === o ||
                    s[o] === t[o] ||
                    A(e, o, t[o], s[o], i)
              })(e, f, c, o, l),
              u)
            )
              t.__k = []
            else if (
              ((y = t.props.children),
              C(
                e,
                Array.isArray(y) ? y : [y],
                t,
                s,
                r,
                o && 'foreignObject' !== g,
                n,
                a,
                n ? n[0] : s.__k && S(s, 0),
                l
              ),
              null != n)
            )
              for (y = n.length; y--; ) null != n[y] && m(n[y])
            l ||
              ('value' in f &&
                void 0 !== (y = f.value) &&
                (y !== e.value ||
                  ('progress' === g && !y) ||
                  ('option' === g && y !== c.value)) &&
                A(e, 'value', y, c.value, !1),
              'checked' in f &&
                void 0 !== (y = f.checked) &&
                y !== e.checked &&
                A(e, 'checked', y, c.checked, !1))
          }
          return e
        }
        function N(e, t, s) {
          try {
            'function' == typeof e ? e(t) : (e.current = t)
          } catch (e) {
            r.__e(e, s)
          }
        }
        function B(e, t, s) {
          var i, o
          if (
            (r.unmount && r.unmount(e),
            (i = e.ref) &&
              ((i.current && i.current !== e.__e) || N(i, null, t)),
            null != (i = e.__c))
          ) {
            if (i.componentWillUnmount)
              try {
                i.componentWillUnmount()
              } catch (e) {
                r.__e(e, t)
              }
            i.base = i.__P = null
          }
          if ((i = e.__k))
            for (o = 0; o < i.length; o++)
              i[o] && B(i[o], t, 'function' != typeof e.type)
          s || null == e.__e || m(e.__e), (e.__e = e.__d = void 0)
        }
        function M(e, t, s) {
          return this.constructor(e, s)
        }
        function L(e, t, s) {
          var o, n, a
          r.__ && r.__(e, t),
            (n = (o = 'function' == typeof s) ? null : (s && s.__k) || t.__k),
            (a = []),
            D(
              t,
              (e = ((!o && s) || t).__k = g(b, null, [e])),
              n || h,
              h,
              void 0 !== t.ownerSVGElement,
              !o && s
                ? [s]
                : n
                ? null
                : t.firstChild
                ? i.call(t.childNodes)
                : null,
              a,
              !o && s ? s : n ? n.__e : t.firstChild,
              o
            ),
            R(a, e)
        }
        function j(e, t) {
          L(e, t, j)
        }
        function z(e, t, s) {
          var r,
            o,
            n,
            a = f({}, e.props)
          for (n in t)
            'key' == n ? (r = t[n]) : 'ref' == n ? (o = t[n]) : (a[n] = t[n])
          return (
            arguments.length > 2 &&
              (a.children = arguments.length > 3 ? i.call(arguments, 2) : s),
            y(e.type, a, r || e.key, o || e.ref, null)
          )
        }
        function $(e, t) {
          var s = {
            __c: (t = '__cC' + p++),
            __: e,
            Consumer: function (e, t) {
              return e.children(t)
            },
            Provider: function (e) {
              var s, i
              return (
                this.getChildContext ||
                  ((s = []),
                  ((i = {})[t] = this),
                  (this.getChildContext = function () {
                    return i
                  }),
                  (this.shouldComponentUpdate = function (e) {
                    this.props.value !== e.value && s.some(F)
                  }),
                  (this.sub = function (e) {
                    s.push(e)
                    var t = e.componentWillUnmount
                    e.componentWillUnmount = function () {
                      s.splice(s.indexOf(e), 1), t && t.call(e)
                    }
                  })),
                e.children
              )
            },
          }
          return (s.Provider.__ = s.Consumer.contextType = s)
        }
        ;(i = u.slice),
          (r = {
            __e: function (e, t, s, i) {
              for (var r, o, n; (t = t.__); )
                if ((r = t.__c) && !r.__)
                  try {
                    if (
                      ((o = r.constructor) &&
                        null != o.getDerivedStateFromError &&
                        (r.setState(o.getDerivedStateFromError(e)),
                        (n = r.__d)),
                      null != r.componentDidCatch &&
                        (r.componentDidCatch(e, i || {}), (n = r.__d)),
                      n)
                    )
                      return (r.__E = r)
                  } catch (t) {
                    e = t
                  }
              throw e
            },
          }),
          (o = 0),
          (n = function (e) {
            return null != e && void 0 === e.constructor
          }),
          (w.prototype.setState = function (e, t) {
            var s
            ;(s =
              null != this.__s && this.__s !== this.state
                ? this.__s
                : (this.__s = f({}, this.state))),
              'function' == typeof e && (e = e(f({}, s), this.props)),
              e && f(s, e),
              null != e && this.__v && (t && this.__h.push(t), F(this))
          }),
          (w.prototype.forceUpdate = function (e) {
            this.__v && ((this.__e = !0), e && this.__h.push(e), F(this))
          }),
          (w.prototype.render = b),
          (a = []),
          (l =
            'function' == typeof Promise
              ? Promise.prototype.then.bind(Promise.resolve())
              : setTimeout),
          (_.__r = 0),
          (p = 0)
      },
      1196: (e) => {
        'use strict'
        function t(e, t) {
          ;(this.text = e = e || ''),
            (this.hasWild = ~e.indexOf('*')),
            (this.separator = t),
            (this.parts = e.split(t))
        }
        ;(t.prototype.match = function (e) {
          var t,
            s,
            i = !0,
            r = this.parts,
            o = r.length
          if ('string' == typeof e || e instanceof String)
            if (this.hasWild || this.text == e) {
              for (s = (e || '').split(this.separator), t = 0; i && t < o; t++)
                '*' !== r[t] && (i = t < s.length && r[t] === s[t])
              i = i && s
            } else i = !1
          else if ('function' == typeof e.splice)
            for (i = [], t = e.length; t--; )
              this.match(e[t]) && (i[i.length] = e[t])
          else if ('object' == typeof e)
            for (var n in ((i = {}), e)) this.match(n) && (i[n] = e[n])
          return i
        }),
          (e.exports = function (e, s, i) {
            var r = new t(e, i || /[\/\.]/)
            return void 0 !== s ? r.match(s) : r
          })
      },
      8138: (e, t, s) => {
        'use strict'
        const i = s(9429),
          r = s(3121),
          o = s(8374),
          n = s(4105),
          a = s(3092)
        e.exports = class {
          constructor() {
            this.core
          }
          init({ target: e }) {
            const t = { inline: !0, target: e },
              s = a
            ;(s.strings = {
              ...a.strings,
              dropPasteImportBoth:
                'Tomá la foto o buscá una que ya tengas en tu teléfono',
              dropPasteImportFiles:
                'Tomá la foto o buscá una que ya tengas en tu teléfono',
              dropPasteImportFolders:
                'Tomá la foto o buscá una que ya tengas en tu teléfono',
              myDevice: 'Mi teléfono',
              importFrom: 'Tomá la foto con tu %{name}',
            }),
              (this.core = new i({ autoProceed: !0, locale: s })
                .use(r, t)
                .use(o, {
                  target: r,
                  countdown: !0,
                  modes: ['picture'],
                  showRecordingLength: !0,
                  showVideoSourceDropdown: !0,
                  mirror: !1,
                })
                .use(n, {
                  companionUrl: 'https://labbor-app.onrender.com/companion/',
                  limit: 1,
                })),
              this.core
                .getPlugin('Dashboard')
                .setOptions({
                  width: '100%',
                  height: '350px',
                  showLinkToFileUploadResult: !0,
                  showRemoveButtonAfterComplete: !0,
                  proudlyDisplayPoweredByUppy: !0,
                })
          }
        }
      },
      3092: (e) => {
        'use strict'
        const t = {
          pluralize: (e) => (1 === e ? 0 : 1),
          strings: {
            addMoreFiles: 'Agregar más archivos',
            addingMoreFiles: 'Agregando más archivos',
            allowAccessDescription:
              'Para tomar fotos o grabar video con tu cámara, por favor permite a este sitio el acceso a la cámara.',
            allowAccessTitle: 'Por favor permite el acceso a tu cámara',
            authenticateWith: 'Conectar a %{pluginName}',
            authenticateWithTitle:
              'Por favor autentícate con %{pluginName} para seleccionar archivos',
            back: 'Atrás',
            addMore: 'Agregar más',
            browse: 'navegar',
            browseFiles: 'navegar',
            cancel: 'Cancelar',
            cancelUpload: 'Cancelar subida',
            chooseFiles: 'Seleccionar archivos',
            closeModal: 'Cerrar ventana flotante',
            companionError: 'Conexión con Companion falló',
            complete: 'Completado',
            connectedToInternet: 'Conectado a Internet',
            copyLink: 'Copiar enlace',
            copyLinkToClipboardFallback: 'Copia la siguiente URL',
            copyLinkToClipboardSuccess: 'Enlace copiado al portapapeles',
            creatingAssembly: 'Preparando subida...',
            creatingAssemblyFailed: 'Transloadit: No se pudo crear un Assembly',
            dashboardTitle: 'Cargador de archivos',
            dashboardWindowTitle:
              'Ventana para cargar archivos (Presiona escape para cerrar)',
            dataUploadedOfTotal: '%{complete} de %{total}',
            done: 'Hecho',
            dropHereOr: 'Soltar archivos aquí o %{browse}',
            dropHint: 'Suelta tus archivos aquí',
            dropPasteBoth: 'Soltar archivos aquí, pegar o %{browse}',
            dropPasteFiles: 'Soltar archivos aquí, pegar o %{browse}',
            dropPasteFolders: 'Soltar archivos aquí, pegar o %{browse}',
            dropPasteImportBoth:
              'Soltar archivos aquí, pegar, %{browse} o importar desde',
            dropPasteImportFiles:
              'Soltar archivos aquí, pegar, %{browse} o importar desde',
            dropPasteImportFolders:
              'Soltar archivos aquí, pegar, %{browse} o importar desde',
            editFile: 'Editar archivo',
            editing: 'Editando %{file}',
            emptyFolderAdded:
              'Ningún archivo fue agregado desde la carpeta vacía',
            encoding: 'Codificando...',
            enterCorrectUrl:
              'URL incorrecta: Por favor asegúrate que estás ingresando un enlace a un archivo',
            enterUrlToImport: 'Ingresa una URL para importar un archivo',
            exceedsSize: 'Este archivo excede el tamaño máximo de %{size}',
            failedToFetch:
              'Companion no ha podido recuperar esta URL, por favor asegúrate que sea correcta',
            failedToUpload: 'Error al subir %{file}',
            fileSource: 'Fuente de archivo: %{name}',
            filesUploadedOfTotal: {
              0: '%{complete} de %{smart_count} archivo subido',
              1: '%{complete} de %{smart_count} archivos subidos',
              2: '%{complete} de %{smart_count} archivos subidos',
            },
            filter: 'Filtrar',
            finishEditingFile: 'Terminar edición de archivo',
            folderAdded: {
              0: 'Agregado %{smart_count} archivo desde %{folder}',
              1: 'Agregados %{smart_count} archivos desde %{folder}',
              2: 'Agregados %{smart_count} archivos desde %{folder}',
            },
            import: 'Importar',
            importFrom: 'Importar desde %{name}',
            loading: 'Cargando...',
            logOut: 'Cerrar sesión',
            missingRequiredMetaField: 'Faltan metacampos obligatorios',
            missingRequiredMetaFieldOnFile:
              'Faltan metacampos obligatorios en %{fileName}',
            myDevice: 'Mi Dispositivo',
            noFilesFound: 'No existen archivos o carpetas aquí',
            noInternetConnection: 'Sin conexión a Internet',
            pause: 'Pausar',
            pauseUpload: 'Pausar subida',
            paused: 'En pausa',
            poweredBy: 'Soportado por %{uppy}',
            processingXFiles: {
              0: 'Procesando %{smart_count} archivo',
              1: 'Procesando %{smart_count} archivos',
              2: 'Procesando %{smart_count} archivos',
            },
            recordingLength: 'Duración de grabación %{recording_length}',
            removeFile: 'Eliminar archivo',
            resetFilter: 'Limpiar filtro',
            resume: 'Reanudar',
            resumeUpload: 'Reanudar subida',
            retry: 'Intentar nuevamente',
            retryUpload: 'Intentar subida nuevamente',
            save: 'Guardar',
            saveChanges: 'Guardar cambios',
            selectX: {
              0: 'Seleccionar %{smart_count}',
              1: 'Seleccionar %{smart_count}',
              2: 'Seleccionar %{smart_count}',
            },
            smile: 'Sonríe!',
            startRecording: 'Comenzar la grabación de video',
            stopRecording: 'Detener la grabación de video',
            takePicture: 'Tomar una foto',
            timedOut: 'Subida estancada por %{seconds} segundos, anulando.',
            upload: 'Subir',
            uploadComplete: 'Subida terminada',
            uploadFailed: 'Subida falló',
            uploadPaused: 'Subida pausada',
            uploadXFiles: {
              0: 'Subir %{smart_count} archivo',
              1: 'Subir %{smart_count} archivos',
              2: 'Subir %{smart_count} archivos',
            },
            uploadXNewFiles: {
              0: 'Subir +%{smart_count} archivo',
              1: 'Subir +%{smart_count} archivos',
              2: 'Subir +%{smart_count} archivos',
            },
            uploading: 'Subiendo',
            uploadingXFiles: {
              0: 'Subiendo %{smart_count} archivo',
              1: 'Subiendo %{smart_count} archivos',
              2: 'Subiendo %{smart_count} archivos',
            },
            xFilesSelected: {
              0: '%{smart_count} archivo seleccionado',
              1: '%{smart_count} archivos seleccionados',
              2: '%{smart_count} archivos seleccionados',
            },
            xMoreFilesAdded: {
              0: '%{smart_count} archivo más agregado',
              1: '%{smart_count} archivos más agregados',
              2: '%{smart_count} archivos más agregados',
            },
            xTimeLeft: '%{time} restantes',
            youCanOnlyUploadFileTypes: 'Solo puedes subir: %{types}',
            youCanOnlyUploadX: {
              0: 'Solo puedes subir %{smart_count} archivo',
              1: 'Solo puedes subir %{smart_count} archivos',
              2: 'Solo puedes subir %{smart_count} archivos',
            },
            youHaveToAtLeastSelectX: {
              0: 'Tienes que seleccionar al menos %{smart_count} archivo',
              1: 'Tienes que seleccionar al menos %{smart_count} archivos',
              2: 'Tienes que seleccionar al menos %{smart_count} archivos',
            },
            selectFileNamed: 'Seleccione archivo %{name}',
            unselectFileNamed: 'Deseleccionar archivo %{name}',
            openFolderNamed: 'Carpeta abierta %{name}',
          },
        }
        'undefined' != typeof Uppy && (globalThis.Uppy.locales.es_ES = t),
          (e.exports = t)
      },
      8350: (e, t, s) => {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.CancelBtn = function (e) {
            const { i18n: t, uppy: s } = e
            return (0, i.h)(
              'button',
              {
                type: 'button',
                className: 'uppy-u-reset uppy-StatusBar-actionCircleBtn',
                title: t('cancel'),
                'aria-label': t('cancel'),
                onClick: () => s.cancelAll(),
                'data-cy': 'cancel',
                'data-uppy-super-focusable': !0,
              },
              (0, i.h)(
                'svg',
                {
                  'aria-hidden': 'true',
                  focusable: 'false',
                  className: 'uppy-c-icon',
                  width: '16',
                  height: '16',
                  viewBox: '0 0 16 16',
                },
                (0, i.h)(
                  'g',
                  { fill: 'none', fillRule: 'evenodd' },
                  (0, i.h)('circle', {
                    fill: '#888',
                    cx: '8',
                    cy: '8',
                    r: '8',
                  }),
                  (0, i.h)('path', {
                    fill: '#FFF',
                    d: 'M9.283 8l2.567 2.567-1.283 1.283L8 9.283 5.433 11.85 4.15 10.567 6.717 8 4.15 5.433 5.433 4.15 8 6.717l2.567-2.567 1.283 1.283z',
                  })
                )
              )
            )
          }),
          (t.DoneBtn = function (e) {
            const { i18n: t, doneButtonHandler: s } = e
            return (0, i.h)(
              'button',
              {
                type: 'button',
                className:
                  'uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--done',
                onClick: s,
                'data-uppy-super-focusable': !0,
              },
              t('done')
            )
          }),
          (t.LoadingSpinner = d),
          (t.PauseResumeButton = function (e) {
            const {
                isAllPaused: t,
                i18n: s,
                isAllComplete: r,
                resumableUploads: o,
                uppy: n,
              } = e,
              a = s(t ? 'resume' : 'pause')
            return (0, i.h)(
              'button',
              {
                title: a,
                'aria-label': a,
                className: 'uppy-u-reset uppy-StatusBar-actionCircleBtn',
                type: 'button',
                onClick: function () {
                  return r
                    ? null
                    : o
                    ? t
                      ? n.resumeAll()
                      : n.pauseAll()
                    : n.cancelAll()
                },
                'data-uppy-super-focusable': !0,
              },
              (0, i.h)(
                'svg',
                {
                  'aria-hidden': 'true',
                  focusable: 'false',
                  className: 'uppy-c-icon',
                  width: '16',
                  height: '16',
                  viewBox: '0 0 16 16',
                },
                (0, i.h)(
                  'g',
                  { fill: 'none', fillRule: 'evenodd' },
                  (0, i.h)('circle', {
                    fill: '#888',
                    cx: '8',
                    cy: '8',
                    r: '8',
                  }),
                  (0, i.h)('path', {
                    fill: '#FFF',
                    d: t
                      ? 'M6 4.25L11.5 8 6 11.75z'
                      : 'M5 4.5h2v7H5v-7zm4 0h2v7H9v-7z',
                  })
                )
              )
            )
          }),
          (t.ProgressBarComplete = function (e) {
            const { i18n: t } = e
            return (0, i.h)(
              'div',
              {
                className: 'uppy-StatusBar-content',
                role: 'status',
                title: t('complete'),
              },
              (0, i.h)(
                'div',
                { className: 'uppy-StatusBar-status' },
                (0, i.h)(
                  'div',
                  { className: 'uppy-StatusBar-statusPrimary' },
                  (0, i.h)(
                    'svg',
                    {
                      'aria-hidden': 'true',
                      focusable: 'false',
                      className: 'uppy-StatusBar-statusIndicator uppy-c-icon',
                      width: '15',
                      height: '11',
                      viewBox: '0 0 15 11',
                    },
                    (0, i.h)('path', {
                      d: 'M.414 5.843L1.627 4.63l3.472 3.472L13.202 0l1.212 1.213L5.1 10.528z',
                    })
                  ),
                  t('complete')
                )
              )
            )
          }),
          (t.ProgressBarError = function (e) {
            const { error: t, i18n: s, complete: r, numUploads: o } = e
            return (0, i.h)(
              'div',
              { className: 'uppy-StatusBar-content', title: s('uploadFailed') },
              (0, i.h)(
                'svg',
                {
                  'aria-hidden': 'true',
                  focusable: 'false',
                  className: 'uppy-StatusBar-statusIndicator uppy-c-icon',
                  width: '11',
                  height: '11',
                  viewBox: '0 0 11 11',
                },
                (0, i.h)('path', {
                  d: 'M4.278 5.5L0 1.222 1.222 0 5.5 4.278 9.778 0 11 1.222 6.722 5.5 11 9.778 9.778 11 5.5 6.722 1.222 11 0 9.778z',
                })
              ),
              (0, i.h)(
                'div',
                { className: 'uppy-StatusBar-status' },
                (0, i.h)(
                  'div',
                  { className: 'uppy-StatusBar-statusPrimary' },
                  s('uploadFailed'),
                  (0, i.h)(
                    'button',
                    {
                      className: 'uppy-u-reset uppy-StatusBar-details',
                      'aria-label': s('showErrorDetails'),
                      'data-microtip-position': 'top-right',
                      'data-microtip-size': 'medium',
                      onClick: function () {
                        const e = `${s('uploadFailed')} \n\n ${t}`
                        alert(e)
                      },
                      type: 'button',
                    },
                    '?'
                  )
                ),
                (0, i.h)(h, { i18n: s, complete: r, numUploads: o })
              )
            )
          }),
          (t.ProgressBarProcessing = function (e) {
            const { progress: t } = e,
              { value: s, mode: r, message: o } = t,
              n = Math.round(100 * s)
            return (0, i.h)(
              'div',
              { className: 'uppy-StatusBar-content' },
              (0, i.h)(d, null),
              'determinate' === r ? `${n}% · ` : '',
              o
            )
          }),
          (t.ProgressBarUploading = function (e) {
            const {
                i18n: t,
                supportsUploadProgress: s,
                totalProgress: r,
                showProgressDetails: o,
                isUploadStarted: n,
                isAllComplete: a,
                isAllPaused: l,
                newFiles: p,
                numUploads: f,
                complete: m,
                totalUploadedSize: g,
                totalSize: y,
                totalETA: v,
                startUpload: b,
              } = e,
              w = p && n
            if (!n || a) return null
            const S = t(l ? 'paused' : 'uploading')
            return (0, i.h)(
              'div',
              {
                className: 'uppy-StatusBar-content',
                'aria-label': S,
                title: S,
              },
              l ? null : (0, i.h)(d, null),
              (0, i.h)(
                'div',
                { className: 'uppy-StatusBar-status' },
                (0, i.h)(
                  'div',
                  { className: 'uppy-StatusBar-statusPrimary' },
                  s ? `${S}: ${r}%` : S
                ),
                l || w || !o
                  ? null
                  : s
                  ? (0, i.h)(c, {
                      numUploads: f,
                      complete: m,
                      totalUploadedSize: g,
                      totalSize: y,
                      totalETA: v,
                      i18n: t,
                    })
                  : (0, i.h)(h, { i18n: t, complete: m, numUploads: f }),
                w ? (0, i.h)(u, { i18n: t, newFiles: p, startUpload: b }) : null
              )
            )
          }),
          (t.ProgressDetails = p),
          (t.RetryBtn = function (e) {
            const { i18n: t, uppy: s } = e
            return (0, i.h)(
              'button',
              {
                type: 'button',
                className:
                  'uppy-u-reset uppy-c-btn uppy-StatusBar-actionBtn uppy-StatusBar-actionBtn--retry',
                'aria-label': t('retryUpload'),
                onClick: () => s.retryAll(),
                'data-uppy-super-focusable': !0,
              },
              (0, i.h)(
                'svg',
                {
                  'aria-hidden': 'true',
                  focusable: 'false',
                  className: 'uppy-c-icon',
                  width: '8',
                  height: '10',
                  viewBox: '0 0 8 10',
                },
                (0, i.h)('path', {
                  d: 'M4 2.408a2.75 2.75 0 1 0 2.75 2.75.626.626 0 0 1 1.25.018v.023a4 4 0 1 1-4-4.041V.25a.25.25 0 0 1 .389-.208l2.299 1.533a.25.25 0 0 1 0 .416l-2.3 1.533A.25.25 0 0 1 4 3.316v-.908z',
                })
              ),
              t('retry')
            )
          }),
          (t.UploadBtn = function (e) {
            const {
                newFiles: t,
                isUploadStarted: s,
                recoveredState: o,
                i18n: n,
                uploadState: a,
                isSomeGhost: d,
                startUpload: p,
              } = e,
              h = r(
                'uppy-u-reset',
                'uppy-c-btn',
                'uppy-StatusBar-actionBtn',
                'uppy-StatusBar-actionBtn--upload',
                { 'uppy-c-btn-primary': a === l.STATE_WAITING },
                { 'uppy-StatusBar-actionBtn--disabled': d }
              ),
              u = n(t && s && !o ? 'uploadXNewFiles' : 'uploadXFiles', {
                smart_count: t,
              })
            return (0, i.h)(
              'button',
              {
                type: 'button',
                className: h,
                'aria-label': n('uploadXFiles', { smart_count: t }),
                onClick: p,
                disabled: d,
                'data-uppy-super-focusable': !0,
              },
              u
            )
          })
        var i = s(6400)
        const r = s(4184),
          o = s(3096),
          n = s(5158),
          a = s(1011),
          l = s(8297)
        function d() {
          return (0, i.h)(
            'svg',
            {
              className: 'uppy-StatusBar-spinner',
              'aria-hidden': 'true',
              focusable: 'false',
              width: '14',
              height: '14',
            },
            (0, i.h)('path', {
              d: 'M13.983 6.547c-.12-2.509-1.64-4.893-3.939-5.936-2.48-1.127-5.488-.656-7.556 1.094C.524 3.367-.398 6.048.162 8.562c.556 2.495 2.46 4.52 4.94 5.183 2.932.784 5.61-.602 7.256-3.015-1.493 1.993-3.745 3.309-6.298 2.868-2.514-.434-4.578-2.349-5.153-4.84a6.226 6.226 0 0 1 2.98-6.778C6.34.586 9.74 1.1 11.373 3.493c.407.596.693 1.282.842 1.988.127.598.073 1.197.161 1.794.078.525.543 1.257 1.15.864.525-.341.49-1.05.456-1.592-.007-.15.02.3 0 0',
              fillRule: 'evenodd',
            })
          )
        }
        function p(e) {
          const {
              numUploads: t,
              complete: s,
              totalUploadedSize: r,
              totalSize: o,
              totalETA: l,
              i18n: d,
            } = e,
            p = t > 1
          return (0, i.h)(
            'div',
            { className: 'uppy-StatusBar-statusSecondary' },
            p && d('filesUploadedOfTotal', { complete: s, smart_count: t }),
            (0, i.h)(
              'span',
              { className: 'uppy-StatusBar-additionalInfo' },
              p && ' · ',
              d('dataUploadedOfTotal', { complete: n(r), total: n(o) }),
              ' · ',
              d('xTimeLeft', { time: a(l) })
            )
          )
        }
        function h(e) {
          const { i18n: t, complete: s, numUploads: r } = e
          return (0, i.h)(
            'div',
            { className: 'uppy-StatusBar-statusSecondary' },
            t('filesUploadedOfTotal', { complete: s, smart_count: r })
          )
        }
        function u(e) {
          const { i18n: t, newFiles: s, startUpload: o } = e,
            n = r(
              'uppy-u-reset',
              'uppy-c-btn',
              'uppy-StatusBar-actionBtn',
              'uppy-StatusBar-actionBtn--uploadNewlyAdded'
            )
          return (0, i.h)(
            'div',
            { className: 'uppy-StatusBar-statusSecondary' },
            (0, i.h)(
              'div',
              { className: 'uppy-StatusBar-statusSecondaryHint' },
              t('xMoreFilesAdded', { smart_count: s })
            ),
            (0, i.h)(
              'button',
              {
                type: 'button',
                className: n,
                'aria-label': t('uploadXFiles', { smart_count: s }),
                onClick: o,
              },
              t('upload')
            )
          )
        }
        const c = o(p, 500, { leading: !0, trailing: !0 })
      },
      5333: (e, t, s) => {
        'use strict'
        var i = s(6400),
          r = s(8350)
        const o = s(4184),
          n = s(8297),
          a = s(4573),
          {
            STATE_ERROR: l,
            STATE_WAITING: d,
            STATE_PREPROCESSING: p,
            STATE_UPLOADING: h,
            STATE_POSTPROCESSING: u,
            STATE_COMPLETE: c,
          } = n
        e.exports = function (e) {
          const {
              newFiles: t,
              allowNewUpload: s,
              isUploadInProgress: n,
              isAllPaused: f,
              resumableUploads: m,
              error: g,
              hideUploadButton: y,
              hidePauseResumeButton: v,
              hideCancelButton: b,
              hideRetryButton: w,
              recoveredState: S,
              uploadState: P,
              totalProgress: F,
              files: _,
              supportsUploadProgress: C,
              hideAfterFinish: k,
              isSomeGhost: T,
              doneButtonHandler: O,
              isUploadStarted: x,
              i18n: A,
              startUpload: E,
              uppy: U,
              isAllComplete: D,
              showProgressDetails: R,
              numUploads: I,
              complete: N,
              totalSize: B,
              totalETA: M,
              totalUploadedSize: L,
            } = e,
            j = (function () {
              switch (P) {
                case u:
                case p: {
                  const e = a(_)
                  return 'determinate' === e.mode ? 100 * e.value : F
                }
                case l:
                  return null
                case h:
                  return C ? F : null
                default:
                  return F
              }
            })(),
            z = (function () {
              if (S) return !1
              switch (P) {
                case d:
                  return y || 0 === t
                case c:
                  return k
                default:
                  return !1
              }
            })(),
            $ = null != j ? j : 100,
            q = !g && t && !n && !f && s && !y,
            V = !b && P !== d && P !== c,
            H = m && !v && P === h,
            W = g && !D && !w,
            G = O && P === c,
            K = o('uppy-StatusBar-progress', {
              'is-indeterminate': (function () {
                switch (P) {
                  case u:
                  case p: {
                    const { mode: e } = a(_)
                    return 'indeterminate' === e
                  }
                  case h:
                    return !C
                  default:
                    return !1
                }
              })(),
            }),
            X = o('uppy-StatusBar', `is-${P}`, { 'has-ghosts': T })
          return (0, i.h)(
            'div',
            { className: X, 'aria-hidden': z },
            (0, i.h)('div', {
              className: K,
              style: { width: `${$}%` },
              role: 'progressbar',
              'aria-label': `${$}%`,
              'aria-valuetext': `${$}%`,
              'aria-valuemin': '0',
              'aria-valuemax': '100',
              'aria-valuenow': j,
            }),
            (() => {
              switch (P) {
                case p:
                case u:
                  return (0, i.h)(r.ProgressBarProcessing, { progress: a(_) })
                case c:
                  return (0, i.h)(r.ProgressBarComplete, { i18n: A })
                case l:
                  return (0, i.h)(r.ProgressBarError, {
                    error: g,
                    i18n: A,
                    numUploads: I,
                    complete: N,
                  })
                case h:
                  return (0, i.h)(r.ProgressBarUploading, {
                    i18n: A,
                    supportsUploadProgress: C,
                    totalProgress: F,
                    showProgressDetails: R,
                    isUploadStarted: x,
                    isAllComplete: D,
                    isAllPaused: f,
                    newFiles: t,
                    numUploads: I,
                    complete: N,
                    totalUploadedSize: L,
                    totalSize: B,
                    totalETA: M,
                    startUpload: E,
                  })
                default:
                  return null
              }
            })(),
            (0, i.h)(
              'div',
              { className: 'uppy-StatusBar-actions' },
              S || q
                ? (0, i.h)(r.UploadBtn, {
                    newFiles: t,
                    isUploadStarted: x,
                    recoveredState: S,
                    i18n: A,
                    isSomeGhost: T,
                    startUpload: E,
                    uploadState: P,
                  })
                : null,
              W ? (0, i.h)(r.RetryBtn, { i18n: A, uppy: U }) : null,
              H
                ? (0, i.h)(r.PauseResumeButton, {
                    isAllPaused: f,
                    i18n: A,
                    isAllComplete: D,
                    resumableUploads: m,
                    uppy: U,
                  })
                : null,
              V ? (0, i.h)(r.CancelBtn, { i18n: A, uppy: U }) : null,
              G ? (0, i.h)(r.DoneBtn, { i18n: A, doneButtonHandler: O }) : null
            )
          )
        }
      },
      8297: (e) => {
        'use strict'
        e.exports = {
          STATE_ERROR: 'error',
          STATE_WAITING: 'waiting',
          STATE_PREPROCESSING: 'preprocessing',
          STATE_UPLOADING: 'uploading',
          STATE_POSTPROCESSING: 'postprocessing',
          STATE_COMPLETE: 'complete',
        }
      },
      382: (e, t, s) => {
        'use strict'
        var i = s(9429)
        const r = s(522),
          o = s(9599),
          n = s(8958),
          a = s(8297),
          l = s(5333),
          d = s(1652)
        class p extends i.UIPlugin {
          constructor(e, t) {
            super(e, t),
              (this.startUpload = () => {
                const { recoveredState: e } = this.uppy.getState()
                if (!e) return this.uppy.upload().catch(() => {})
                this.uppy.emit('restore-confirmed')
              }),
              (this.id = this.opts.id || 'StatusBar'),
              (this.title = 'StatusBar'),
              (this.type = 'progressindicator'),
              (this.defaultLocale = d),
              (this.opts = {
                target: 'body',
                hideUploadButton: !1,
                hideRetryButton: !1,
                hidePauseResumeButton: !1,
                hideCancelButton: !1,
                showProgressDetails: !1,
                hideAfterFinish: !0,
                doneButtonHandler: null,
                ...t,
              }),
              this.i18nInit(),
              (this.render = this.render.bind(this)),
              (this.install = this.install.bind(this))
          }
          render(e) {
            const {
                capabilities: t,
                files: s,
                allowNewUpload: i,
                totalProgress: n,
                error: a,
                recoveredState: d,
              } = e,
              {
                newFiles: p,
                startedFiles: u,
                completeFiles: c,
                inProgressNotPausedFiles: f,
                isUploadStarted: m,
                isAllComplete: g,
                isAllErrored: y,
                isAllPaused: v,
                isUploadInProgress: b,
                isSomeGhost: w,
              } = this.uppy.getObjectOfFilesPerState(),
              S = d ? Object.values(s) : p,
              P = (function (e) {
                const t = (function (e) {
                  let t = 0
                  return (
                    e.forEach((e) => {
                      t += r(e.progress)
                    }),
                    t
                  )
                })(e)
                if (0 === t) return 0
                const s = e.reduce((e, t) => e + o(t.progress), 0)
                return Math.round((s / t) * 10) / 10
              })(f),
              F = !!t.resumableUploads,
              _ = !1 !== t.uploadProgress
            let C = 0,
              k = 0
            return (
              u.forEach((e) => {
                ;(C += e.progress.bytesTotal || 0),
                  (k += e.progress.bytesUploaded || 0)
              }),
              l({
                error: a,
                uploadState: h(a, g, d, e.files || {}),
                allowNewUpload: i,
                totalProgress: n,
                totalSize: C,
                totalUploadedSize: k,
                isAllComplete: !1,
                isAllPaused: v,
                isAllErrored: y,
                isUploadStarted: m,
                isUploadInProgress: b,
                isSomeGhost: w,
                recoveredState: d,
                complete: c.length,
                newFiles: S.length,
                numUploads: u.length,
                totalETA: P,
                files: s,
                i18n: this.i18n,
                uppy: this.uppy,
                startUpload: this.startUpload,
                doneButtonHandler: this.opts.doneButtonHandler,
                resumableUploads: F,
                supportsUploadProgress: _,
                showProgressDetails: this.opts.showProgressDetails,
                hideUploadButton: this.opts.hideUploadButton,
                hideRetryButton: this.opts.hideRetryButton,
                hidePauseResumeButton: this.opts.hidePauseResumeButton,
                hideCancelButton: this.opts.hideCancelButton,
                hideAfterFinish: this.opts.hideAfterFinish,
                isTargetDOMEl: this.isTargetDOMEl,
              })
            )
          }
          onMount() {
            const e = this.el
            n(e) || (e.dir = 'ltr')
          }
          install() {
            const { target: e } = this.opts
            e && this.mount(e, this)
          }
          uninstall() {
            this.unmount()
          }
        }
        function h(e, t, s, i) {
          if (e && !t) return a.STATE_ERROR
          if (t) return a.STATE_COMPLETE
          if (s) return a.STATE_WAITING
          let r = a.STATE_WAITING
          const o = Object.keys(i)
          for (let e = 0; e < o.length; e++) {
            const { progress: t } = i[o[e]]
            if (t.uploadStarted && !t.uploadComplete) return a.STATE_UPLOADING
            t.preprocess &&
              r !== a.STATE_UPLOADING &&
              (r = a.STATE_PREPROCESSING),
              t.postprocess &&
                r !== a.STATE_UPLOADING &&
                r !== a.STATE_PREPROCESSING &&
                (r = a.STATE_POSTPROCESSING)
          }
          return r
        }
        ;(p.VERSION = '2.2.0'), (e.exports = p)
      },
      4573: (e) => {
        'use strict'
        e.exports = function (e) {
          const t = []
          let s, i
          for (const { progress: r } of Object.values(e)) {
            const { preprocess: e, postprocess: o } = r
            null == i && (e || o) && ({ mode: s, message: i } = e || o),
              'determinate' === (null == e ? void 0 : e.mode) &&
                t.push(e.value),
              'determinate' === (null == o ? void 0 : o.mode) && t.push(o.value)
          }
          return {
            mode: s,
            message: i,
            value: t.reduce((e, s) => e + s / t.length, 0),
          }
        }
      },
      2310: (e, t, s) => {
        'use strict'
        e.exports = s(382)
      },
      1652: (e) => {
        'use strict'
        e.exports = {
          strings: {
            uploading: 'Uploading',
            complete: 'Complete',
            uploadFailed: 'Upload failed',
            paused: 'Paused',
            retry: 'Retry',
            cancel: 'Cancel',
            pause: 'Pause',
            resume: 'Resume',
            done: 'Done',
            filesUploadedOfTotal: {
              0: '%{complete} of %{smart_count} file uploaded',
              1: '%{complete} of %{smart_count} files uploaded',
            },
            dataUploadedOfTotal: '%{complete} of %{total}',
            xTimeLeft: '%{time} left',
            uploadXFiles: {
              0: 'Upload %{smart_count} file',
              1: 'Upload %{smart_count} files',
            },
            uploadXNewFiles: {
              0: 'Upload +%{smart_count} file',
              1: 'Upload +%{smart_count} files',
            },
            upload: 'Upload',
            retryUpload: 'Retry upload',
            xMoreFilesAdded: {
              0: '%{smart_count} more file added',
              1: '%{smart_count} more files added',
            },
            showErrorDetails: 'Show error details',
          },
        }
      },
      8423: (e, t, s) => {
        'use strict'
        var i = s(6400)
        e.exports = () =>
          (0, i.h)(
            'svg',
            {
              'aria-hidden': 'true',
              focusable: 'false',
              fill: '#0097DC',
              width: '66',
              height: '55',
              viewBox: '0 0 66 55',
            },
            (0, i.h)('path', {
              d: 'M57.3 8.433c4.59 0 8.1 3.51 8.1 8.1v29.7c0 4.59-3.51 8.1-8.1 8.1H8.7c-4.59 0-8.1-3.51-8.1-8.1v-29.7c0-4.59 3.51-8.1 8.1-8.1h9.45l4.59-7.02c.54-.54 1.35-1.08 2.16-1.08h16.2c.81 0 1.62.54 2.16 1.08l4.59 7.02h9.45zM33 14.64c-8.62 0-15.393 6.773-15.393 15.393 0 8.62 6.773 15.393 15.393 15.393 8.62 0 15.393-6.773 15.393-15.393 0-8.62-6.773-15.393-15.393-15.393zM33 40c-5.648 0-9.966-4.319-9.966-9.967 0-5.647 4.318-9.966 9.966-9.966s9.966 4.319 9.966 9.966C42.966 35.681 38.648 40 33 40z',
              fillRule: 'evenodd',
            })
          )
      },
      1536: (e, t, s) => {
        'use strict'
        var i = s(6400)
        function r() {
          return (
            (r =
              Object.assign ||
              function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var s = arguments[t]
                  for (var i in s)
                    Object.prototype.hasOwnProperty.call(s, i) && (e[i] = s[i])
                }
                return e
              }),
            r.apply(this, arguments)
          )
        }
        const o = s(2928),
          n = s(2165),
          a = s(9757),
          l = s(3690),
          d = s(2271),
          p = s(6516)
        function h(e, t) {
          return -1 !== e.indexOf(t)
        }
        class u extends i.Component {
          componentDidMount() {
            const { onFocus: e } = this.props
            e()
          }
          componentWillUnmount() {
            const { onStop: e } = this.props
            e()
          }
          render() {
            const {
                src: e,
                recordedVideo: t,
                recording: s,
                modes: u,
                supportsRecording: c,
                videoSources: f,
                showVideoSourceDropdown: m,
                showRecordingLength: g,
                onSubmit: y,
                i18n: v,
                mirror: b,
                onSnapshot: w,
                onStartRecording: S,
                onStopRecording: P,
                onDiscardRecordedVideo: F,
                recordingLengthSeconds: _,
              } = this.props,
              C = !!t,
              k =
                !C &&
                c &&
                (h(u, 'video-only') ||
                  h(u, 'audio-only') ||
                  h(u, 'video-audio')),
              T = !C && h(u, 'picture'),
              O = c && g && !C,
              x = m && f && f.length > 1,
              A = { playsinline: !0 }
            return (
              t
                ? ((A.muted = !1),
                  (A.controls = !0),
                  (A.src = t),
                  this.videoElement && (this.videoElement.srcObject = void 0))
                : ((A.muted = !0), (A.autoplay = !0), (A.srcObject = e)),
              (0, i.h)(
                'div',
                { className: 'uppy uppy-Webcam-container' },
                (0, i.h)(
                  'div',
                  { className: 'uppy-Webcam-videoContainer' },
                  (0, i.h)(
                    'video',
                    r(
                      {
                        ref: (e) => (this.videoElement = e),
                        className:
                          'uppy-Webcam-video  ' +
                          (b ? 'uppy-Webcam-video--mirrored' : ''),
                      },
                      A
                    )
                  )
                ),
                (0, i.h)(
                  'div',
                  { className: 'uppy-Webcam-footer' },
                  (0, i.h)(
                    'div',
                    { className: 'uppy-Webcam-videoSourceContainer' },
                    x ? l(this.props) : null
                  ),
                  (0, i.h)(
                    'div',
                    { className: 'uppy-Webcam-buttonContainer' },
                    T && (0, i.h)(o, { onSnapshot: w, i18n: v }),
                    k &&
                      (0, i.h)(n, {
                        recording: s,
                        onStartRecording: S,
                        onStopRecording: P,
                        i18n: v,
                      }),
                    C && (0, i.h)(d, { onSubmit: y, i18n: v }),
                    C && (0, i.h)(p, { onDiscard: F, i18n: v })
                  ),
                  (0, i.h)(
                    'div',
                    { className: 'uppy-Webcam-recordingLength' },
                    O && (0, i.h)(a, { recordingLengthSeconds: _, i18n: v })
                  )
                )
              )
            )
          }
        }
        e.exports = u
      },
      6516: (e, t, s) => {
        'use strict'
        var i = s(6400)
        e.exports = function (e) {
          let { onDiscard: t, i18n: s } = e
          return (0, i.h)(
            'button',
            {
              className:
                'uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--discard',
              type: 'button',
              title: s('discardRecordedFile'),
              'aria-label': s('discardRecordedFile'),
              onClick: t,
              'data-uppy-super-focusable': !0,
            },
            (0, i.h)(
              'svg',
              {
                width: '13',
                height: '13',
                viewBox: '0 0 13 13',
                xmlns: 'http://www.w3.org/2000/svg',
                'aria-hidden': 'true',
                focusable: 'false',
                className: 'uppy-c-icon',
              },
              (0, i.h)(
                'g',
                { fill: '#FFF', fillRule: 'evenodd' },
                (0, i.h)('path', {
                  d: 'M.496 11.367L11.103.76l1.414 1.414L1.911 12.781z',
                }),
                (0, i.h)('path', {
                  d: 'M11.104 12.782L.497 2.175 1.911.76l10.607 10.606z',
                })
              )
            )
          )
        }
      },
      9860: (e, t, s) => {
        'use strict'
        var i = s(6400)
        e.exports = (e) => {
          let { icon: t, i18n: s, hasCamera: r } = e
          return (0, i.h)(
            'div',
            { className: 'uppy-Webcam-permissons' },
            (0, i.h)('div', { className: 'uppy-Webcam-permissonsIcon' }, t()),
            (0, i.h)(
              'h1',
              { className: 'uppy-Webcam-title' },
              s(r ? 'allowAccessTitle' : 'noCameraTitle')
            ),
            (0, i.h)(
              'p',
              null,
              s(r ? 'allowAccessDescription' : 'noCameraDescription')
            )
          )
        }
      },
      2165: (e, t, s) => {
        'use strict'
        var i = s(6400)
        e.exports = function (e) {
          let {
            recording: t,
            onStartRecording: s,
            onStopRecording: r,
            i18n: o,
          } = e
          return t
            ? (0, i.h)(
                'button',
                {
                  className: 'uppy-u-reset uppy-c-btn uppy-Webcam-button',
                  type: 'button',
                  title: o('stopRecording'),
                  'aria-label': o('stopRecording'),
                  onClick: r,
                  'data-uppy-super-focusable': !0,
                },
                (0, i.h)(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    className: 'uppy-c-icon',
                    width: '100',
                    height: '100',
                    viewBox: '0 0 100 100',
                  },
                  (0, i.h)('rect', {
                    x: '15',
                    y: '15',
                    width: '70',
                    height: '70',
                  })
                )
              )
            : (0, i.h)(
                'button',
                {
                  className: 'uppy-u-reset uppy-c-btn uppy-Webcam-button',
                  type: 'button',
                  title: o('startRecording'),
                  'aria-label': o('startRecording'),
                  onClick: s,
                  'data-uppy-super-focusable': !0,
                },
                (0, i.h)(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    className: 'uppy-c-icon',
                    width: '100',
                    height: '100',
                    viewBox: '0 0 100 100',
                  },
                  (0, i.h)('circle', { cx: '50', cy: '50', r: '40' })
                )
              )
        }
      },
      9757: (e, t, s) => {
        'use strict'
        var i = s(6400)
        const r = s(4794)
        e.exports = function (e) {
          let { recordingLengthSeconds: t, i18n: s } = e
          const o = r(t)
          return (0, i.h)(
            'span',
            { 'aria-label': s('recordingLength', { recording_length: o }) },
            o
          )
        }
      },
      2928: (e, t, s) => {
        'use strict'
        var i = s(6400)
        const r = s(8423)
        e.exports = (e) => {
          let { onSnapshot: t, i18n: s } = e
          return (0, i.h)(
            'button',
            {
              className:
                'uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--picture',
              type: 'button',
              title: s('takePicture'),
              'aria-label': s('takePicture'),
              onClick: t,
              'data-uppy-super-focusable': !0,
            },
            r()
          )
        }
      },
      2271: (e, t, s) => {
        'use strict'
        var i = s(6400)
        e.exports = function (e) {
          let { onSubmit: t, i18n: s } = e
          return (0, i.h)(
            'button',
            {
              className:
                'uppy-u-reset uppy-c-btn uppy-Webcam-button uppy-Webcam-button--submit',
              type: 'button',
              title: s('submitRecordedFile'),
              'aria-label': s('submitRecordedFile'),
              onClick: t,
              'data-uppy-super-focusable': !0,
            },
            (0, i.h)(
              'svg',
              {
                width: '12',
                height: '9',
                viewBox: '0 0 12 9',
                xmlns: 'http://www.w3.org/2000/svg',
                'aria-hidden': 'true',
                focusable: 'false',
                className: 'uppy-c-icon',
              },
              (0, i.h)('path', {
                fill: '#fff',
                fillRule: 'nonzero',
                d: 'M10.66 0L12 1.31 4.136 9 0 4.956l1.34-1.31L4.136 6.38z',
              })
            )
          )
        }
      },
      3690: (e, t, s) => {
        'use strict'
        var i = s(6400)
        e.exports = (e) => {
          let {
            currentDeviceId: t,
            videoSources: s,
            onChangeVideoSource: r,
          } = e
          return (0, i.h)(
            'div',
            { className: 'uppy-Webcam-videoSource' },
            (0, i.h)(
              'select',
              {
                className: 'uppy-u-reset uppy-Webcam-videoSource-select',
                onChange: (e) => {
                  r(e.target.value)
                },
              },
              s.map((e) =>
                (0, i.h)(
                  'option',
                  {
                    key: e.deviceId,
                    value: e.deviceId,
                    selected: e.deviceId === t,
                  },
                  e.label
                )
              )
            )
          )
        }
      },
      7116: (e, t, s) => {
        'use strict'
        var i = s(6400),
          r = s(9429)
        function o() {
          return (
            (o =
              Object.assign ||
              function (e) {
                for (var t = 1; t < arguments.length; t++) {
                  var s = arguments[t]
                  for (var i in s)
                    Object.prototype.hasOwnProperty.call(s, i) && (e[i] = s[i])
                }
                return e
              }),
            o.apply(this, arguments)
          )
        }
        function n(e, t) {
          if (!Object.prototype.hasOwnProperty.call(e, t))
            throw new TypeError(
              'attempted to use private field on non-instance'
            )
          return e
        }
        var a = 0
        function l(e) {
          return '__private_' + a++ + '_' + e
        }
        const d = s(182),
          p = s(5624),
          h = s(7326),
          u = s(2389),
          c = s(8423),
          f = s(1536),
          m = s(9860),
          g = s(3198)
        function y(e) {
          return '.' === e[0] ? p[e.slice(1)] : e
        }
        function v(e) {
          return /^video\/[^*]+$/.test(e)
        }
        function b(e) {
          return /^image\/[^*]+$/.test(e)
        }
        var w = l('enableMirror')
        class S extends r.UIPlugin {
          constructor(e, t) {
            super(e, t),
              Object.defineProperty(this, w, { writable: !0, value: void 0 }),
              (this.mediaDevices = navigator.mediaDevices),
              (this.supportsUserMedia = !!this.mediaDevices),
              (this.protocol = location.protocol.match(/https/i)
                ? 'https'
                : 'http'),
              (this.id = this.opts.id || 'Webcam'),
              (this.type = 'acquirer'),
              (this.capturedMediaFile = null),
              (this.icon = () =>
                (0, i.h)(
                  'svg',
                  {
                    'aria-hidden': 'true',
                    focusable: 'false',
                    width: '32',
                    height: '32',
                    viewBox: '0 0 32 32',
                  },
                  (0, i.h)(
                    'g',
                    { fill: 'none', fillRule: 'evenodd' },
                    (0, i.h)('rect', {
                      className: 'uppy-ProviderIconBg',
                      fill: '#03BFEF',
                      width: '32',
                      height: '32',
                      rx: '16',
                    }),
                    (0, i.h)('path', {
                      d: 'M22 11c1.133 0 2 .867 2 2v7.333c0 1.134-.867 2-2 2H10c-1.133 0-2-.866-2-2V13c0-1.133.867-2 2-2h2.333l1.134-1.733C13.6 9.133 13.8 9 14 9h4c.2 0 .4.133.533.267L19.667 11H22zm-6 1.533a3.764 3.764 0 0 0-3.8 3.8c0 2.129 1.672 3.801 3.8 3.801s3.8-1.672 3.8-3.8c0-2.13-1.672-3.801-3.8-3.801zm0 6.261c-1.395 0-2.46-1.066-2.46-2.46 0-1.395 1.065-2.461 2.46-2.461s2.46 1.066 2.46 2.46c0 1.395-1.065 2.461-2.46 2.461z',
                      fill: '#FFF',
                      fillRule: 'nonzero',
                    })
                  )
                )),
              (this.defaultLocale = g)
            const s = {
              onBeforeSnapshot: () => Promise.resolve(),
              countdown: !1,
              modes: ['video-audio', 'video-only', 'audio-only', 'picture'],
              mirror: !0,
              showVideoSourceDropdown: !1,
              facingMode: 'user',
              preferredImageMimeType: null,
              preferredVideoMimeType: null,
              showRecordingLength: !1,
            }
            ;(this.opts = { ...s, ...t }),
              this.i18nInit(),
              (this.title = this.i18n('pluginNameCamera')),
              (n(this, w)[w] = this.opts.mirror),
              (this.install = this.install.bind(this)),
              (this.setPluginState = this.setPluginState.bind(this)),
              (this.render = this.render.bind(this)),
              (this.start = this.start.bind(this)),
              (this.stop = this.stop.bind(this)),
              (this.takeSnapshot = this.takeSnapshot.bind(this)),
              (this.startRecording = this.startRecording.bind(this)),
              (this.stopRecording = this.stopRecording.bind(this)),
              (this.discardRecordedVideo =
                this.discardRecordedVideo.bind(this)),
              (this.submit = this.submit.bind(this)),
              (this.oneTwoThreeSmile = this.oneTwoThreeSmile.bind(this)),
              (this.focus = this.focus.bind(this)),
              (this.changeVideoSource = this.changeVideoSource.bind(this)),
              (this.webcamActive = !1),
              this.opts.countdown &&
                (this.opts.onBeforeSnapshot = this.oneTwoThreeSmile),
              this.setPluginState({
                hasCamera: !1,
                cameraReady: !1,
                cameraError: null,
                recordingLengthSeconds: 0,
                videoSources: [],
                currentDeviceId: null,
              })
          }
          setOptions(e) {
            super.setOptions({
              ...e,
              videoConstraints: {
                ...this.opts.videoConstraints,
                ...(null == e ? void 0 : e.videoConstraints),
              },
            })
          }
          hasCameraCheck() {
            return this.mediaDevices
              ? this.mediaDevices
                  .enumerateDevices()
                  .then((e) => e.some((e) => 'videoinput' === e.kind))
              : Promise.resolve(!1)
          }
          isAudioOnly() {
            return (
              1 === this.opts.modes.length &&
              'audio-only' === this.opts.modes[0]
            )
          }
          getConstraints(e) {
            void 0 === e && (e = null)
            const t =
                -1 !== this.opts.modes.indexOf('video-audio') ||
                -1 !== this.opts.modes.indexOf('audio-only'),
              s =
                !this.isAudioOnly() &&
                (-1 !== this.opts.modes.indexOf('video-audio') ||
                  -1 !== this.opts.modes.indexOf('video-only') ||
                  -1 !== this.opts.modes.indexOf('picture')),
              i = {
                ...(this.opts.videoConstraints || {
                  facingMode: this.opts.facingMode,
                }),
                ...(e ? { deviceId: e, facingMode: null } : {}),
              }
            return { audio: t, video: !!s && i }
          }
          start(e) {
            if ((void 0 === e && (e = null), !this.supportsUserMedia))
              return Promise.reject(new Error('Webcam access not supported'))
            ;(this.webcamActive = !0), this.opts.mirror && (n(this, w)[w] = !0)
            const t = this.getConstraints(e && e.deviceId ? e.deviceId : null)
            this.hasCameraCheck().then(
              (s) => (
                this.setPluginState({ hasCamera: s }),
                this.mediaDevices
                  .getUserMedia(t)
                  .then((t) => {
                    this.stream = t
                    let s = null
                    const i = this.isAudioOnly()
                      ? t.getAudioTracks()
                      : t.getVideoTracks()
                    e && e.deviceId
                      ? i.forEach((t) => {
                          t.getSettings().deviceId === e.deviceId &&
                            (s = t.getSettings().deviceId)
                        })
                      : (s = i[0].getSettings().deviceId),
                      this.updateVideoSources(),
                      this.setPluginState({
                        currentDeviceId: s,
                        cameraReady: !0,
                      })
                  })
                  .catch((e) => {
                    this.setPluginState({ cameraReady: !1, cameraError: e }),
                      this.uppy.info(e.message, 'error')
                  })
              )
            )
          }
          getMediaRecorderOptions() {
            const e = {}
            if (MediaRecorder.isTypeSupported) {
              const { restrictions: t } = this.uppy.opts
              let s = []
              this.opts.preferredVideoMimeType
                ? (s = [this.opts.preferredVideoMimeType])
                : t.allowedFileTypes &&
                  (s = t.allowedFileTypes.map(y).filter(v))
              const i = (e) => MediaRecorder.isTypeSupported(e) && d(e),
                r = s.filter(i)
              r.length > 0 && (e.mimeType = r[0])
            }
            return e
          }
          startRecording() {
            ;(this.recorder = new MediaRecorder(
              this.stream,
              this.getMediaRecorderOptions()
            )),
              (this.recordingChunks = [])
            let e = !1
            this.recorder.addEventListener('dataavailable', (t) => {
              this.recordingChunks.push(t.data)
              const { restrictions: s } = this.uppy.opts
              if (
                this.recordingChunks.length > 1 &&
                null != s.maxFileSize &&
                !e
              ) {
                const t = this.recordingChunks.reduce((e, t) => e + t.size, 0),
                  i =
                    ((t - this.recordingChunks[0].size) /
                      (this.recordingChunks.length - 1)) *
                    3
                t > Math.max(0, s.maxFileSize - i) &&
                  ((e = !0),
                  this.uppy.info(
                    this.i18n('recordingStoppedMaxSize'),
                    'warning',
                    4e3
                  ),
                  this.stopRecording())
              }
            }),
              this.recorder.start(500),
              this.opts.showRecordingLength &&
                (this.recordingLengthTimer = setInterval(() => {
                  const e = this.getPluginState().recordingLengthSeconds
                  this.setPluginState({ recordingLengthSeconds: e + 1 })
                }, 1e3)),
              this.setPluginState({ isRecording: !0 })
          }
          stopRecording() {
            return new Promise((e) => {
              this.recorder.addEventListener('stop', () => {
                e()
              }),
                this.recorder.stop(),
                this.opts.showRecordingLength &&
                  (clearInterval(this.recordingLengthTimer),
                  this.setPluginState({ recordingLengthSeconds: 0 }))
            })
              .then(
                () => (
                  this.setPluginState({ isRecording: !1 }), this.getVideo()
                )
              )
              .then((e) => {
                try {
                  ;(this.capturedMediaFile = e),
                    this.setPluginState({
                      recordedVideo: URL.createObjectURL(e.data),
                    }),
                    (n(this, w)[w] = !1)
                } catch (e) {
                  e.isRestriction || this.uppy.log(e)
                }
              })
              .then(
                () => {
                  ;(this.recordingChunks = null), (this.recorder = null)
                },
                (e) => {
                  throw (
                    ((this.recordingChunks = null), (this.recorder = null), e)
                  )
                }
              )
          }
          discardRecordedVideo() {
            this.setPluginState({ recordedVideo: null }),
              this.opts.mirror && (n(this, w)[w] = !0),
              (this.capturedMediaFile = null)
          }
          submit() {
            try {
              this.capturedMediaFile &&
                this.uppy.addFile(this.capturedMediaFile)
            } catch (e) {
              e.isRestriction || this.uppy.log(e, 'error')
            }
          }
          async stop() {
            if (this.stream) {
              const e = this.stream.getAudioTracks(),
                t = this.stream.getVideoTracks()
              e.concat(t).forEach((e) => e.stop())
            }
            this.recorder &&
              (await new Promise((e) => {
                this.recorder.addEventListener('stop', e, { once: !0 }),
                  this.recorder.stop(),
                  this.opts.showRecordingLength &&
                    clearInterval(this.recordingLengthTimer)
              })),
              (this.recordingChunks = null),
              (this.recorder = null),
              (this.webcamActive = !1),
              (this.stream = null),
              this.setPluginState({
                recordedVideo: null,
                isRecording: !1,
                recordingLengthSeconds: 0,
              })
          }
          getVideoElement() {
            return this.el.querySelector('.uppy-Webcam-video')
          }
          oneTwoThreeSmile() {
            return new Promise((e, t) => {
              let s = this.opts.countdown
              const i = setInterval(() => {
                if (!this.webcamActive)
                  return (
                    clearInterval(i),
                    (this.captureInProgress = !1),
                    t(new Error('Webcam is not active'))
                  )
                s > 0
                  ? (this.uppy.info(`${s}...`, 'warning', 800), s--)
                  : (clearInterval(i),
                    this.uppy.info(this.i18n('smile'), 'success', 1500),
                    setTimeout(() => e(), 1500))
              }, 1e3)
            })
          }
          takeSnapshot() {
            this.captureInProgress ||
              ((this.captureInProgress = !0),
              this.opts
                .onBeforeSnapshot()
                .catch((e) => {
                  const t = 'object' == typeof e ? e.message : e
                  return (
                    this.uppy.info(t, 'error', 5e3),
                    Promise.reject(new Error(`onBeforeSnapshot: ${t}`))
                  )
                })
                .then(() => this.getImage())
                .then(
                  (e) => {
                    this.captureInProgress = !1
                    try {
                      this.uppy.addFile(e)
                    } catch (e) {
                      e.isRestriction || this.uppy.log(e)
                    }
                  },
                  (e) => {
                    throw ((this.captureInProgress = !1), e)
                  }
                ))
          }
          getImage() {
            const e = this.getVideoElement()
            if (!e)
              return Promise.reject(
                new Error(
                  'No video element found, likely due to the Webcam tab being closed.'
                )
              )
            const t = e.videoWidth,
              s = e.videoHeight,
              i = document.createElement('canvas')
            ;(i.width = t),
              (i.height = s),
              i.getContext('2d').drawImage(e, 0, 0)
            const { restrictions: r } = this.uppy.opts
            let o = []
            this.opts.preferredImageMimeType
              ? (o = [this.opts.preferredImageMimeType])
              : r.allowedFileTypes && (o = r.allowedFileTypes.map(y).filter(b))
            const n = o[0] || 'image/jpeg',
              a = d(n) || 'jpg',
              l = `cam-${Date.now()}.${a}`
            return h(i, n).then((e) => ({
              source: this.id,
              name: l,
              data: new Blob([e], { type: n }),
              type: n,
            }))
          }
          getVideo() {
            const e = this.recordingChunks.find((e) => {
                var t
                return (null == (t = e.type) ? void 0 : t.length) > 0
              }).type,
              t = d(e)
            if (!t)
              return Promise.reject(
                new Error(
                  `Could not retrieve recording: Unsupported media type "${e}"`
                )
              )
            const s = `webcam-${Date.now()}.${t}`,
              i = new Blob(this.recordingChunks, { type: e }),
              r = {
                source: this.id,
                name: s,
                data: new Blob([i], { type: e }),
                type: e,
              }
            return Promise.resolve(r)
          }
          focus() {
            this.opts.countdown &&
              setTimeout(() => {
                this.uppy.info(this.i18n('smile'), 'success', 1500)
              }, 1e3)
          }
          changeVideoSource(e) {
            this.stop(), this.start({ deviceId: e })
          }
          updateVideoSources() {
            this.mediaDevices.enumerateDevices().then((e) => {
              this.setPluginState({
                videoSources: e.filter((e) => 'videoinput' === e.kind),
              })
            })
          }
          render() {
            this.webcamActive || this.start()
            const e = this.getPluginState()
            return e.cameraReady && e.hasCamera
              ? (0, i.h)(
                  f,
                  o({}, e, {
                    onChangeVideoSource: this.changeVideoSource,
                    onSnapshot: this.takeSnapshot,
                    onStartRecording: this.startRecording,
                    onStopRecording: this.stopRecording,
                    onDiscardRecordedVideo: this.discardRecordedVideo,
                    onSubmit: this.submit,
                    onFocus: this.focus,
                    onStop: this.stop,
                    i18n: this.i18n,
                    modes: this.opts.modes,
                    showRecordingLength: this.opts.showRecordingLength,
                    showVideoSourceDropdown: this.opts.showVideoSourceDropdown,
                    supportsRecording: u(),
                    recording: e.isRecording,
                    mirror: n(this, w)[w],
                    src: this.stream,
                  })
                )
              : (0, i.h)(m, {
                  icon: c,
                  i18n: this.i18n,
                  hasCamera: e.hasCamera,
                })
          }
          install() {
            this.setPluginState({ cameraReady: !1, recordingLengthSeconds: 0 })
            const { target: e } = this.opts
            e && this.mount(e, this),
              this.mediaDevices &&
                (this.updateVideoSources(),
                (this.mediaDevices.ondevicechange = () => {
                  if ((this.updateVideoSources(), this.stream)) {
                    let e = !0
                    const { videoSources: t, currentDeviceId: s } =
                      this.getPluginState()
                    t.forEach((t) => {
                      s === t.deviceId && (e = !1)
                    }),
                      e && (this.stop(), this.start())
                  }
                }))
          }
          uninstall() {
            this.stop(), this.unmount()
          }
          onUnmount() {
            this.stop()
          }
        }
        ;(S.VERSION = '2.2.0'), (e.exports = S)
      },
      4794: (e) => {
        'use strict'
        e.exports = function (e) {
          return `${Math.floor(e / 60)}:${String(e % 60).padStart(2, 0)}`
        }
      },
      8374: (e, t, s) => {
        'use strict'
        e.exports = s(7116)
      },
      3198: (e) => {
        'use strict'
        e.exports = {
          strings: {
            pluginNameCamera: 'Camera',
            noCameraTitle: 'Camera Not Available',
            noCameraDescription:
              'In order to take pictures or record video, please connect a camera device',
            recordingStoppedMaxSize:
              'Recording stopped because the file size is about to exceed the limit',
            submitRecordedFile: 'Submit recorded file',
            discardRecordedFile: 'Discard recorded file',
            smile: 'Smile!',
            takePicture: 'Take a picture',
            startRecording: 'Begin video recording',
            stopRecording: 'Stop video recording',
            recordingLength: 'Recording length %{recording_length}',
            allowAccessTitle: 'Please allow access to your camera',
            allowAccessDescription:
              'In order to take pictures or record video with your camera, please allow camera access for this site.',
          },
        }
      },
      2389: (e) => {
        'use strict'
        e.exports = function () {
          return (
            'function' == typeof MediaRecorder &&
            !!MediaRecorder.prototype &&
            'function' == typeof MediaRecorder.prototype.start
          )
        }
      },
      2961: (e) => {
        e.exports = {
          nanoid: (e = 21) => {
            let t = '',
              s = e
            for (; s--; )
              t +=
                'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'[
                  (64 * Math.random()) | 0
                ]
            return t
          },
          customAlphabet:
            (e, t = 21) =>
            (s = t) => {
              let i = '',
                r = s
              for (; r--; ) i += e[(Math.random() * e.length) | 0]
              return i
            },
        }
      },
    },
    t = {}
  function s(i) {
    var r = t[i]
    if (void 0 !== r) return r.exports
    var o = (t[i] = { exports: {} })
    return e[i].call(o.exports, o, o.exports, s), o.exports
  }
  ;(s.d = (e, t) => {
    for (var i in t)
      s.o(t, i) &&
        !s.o(e, i) &&
        Object.defineProperty(e, i, { enumerable: !0, get: t[i] })
  }),
    (s.g = (function () {
      if ('object' == typeof globalThis) return globalThis
      try {
        return this || new Function('return this')()
      } catch (e) {
        if ('object' == typeof window) return window
      }
    })()),
    (s.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (s.r = (e) => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 })
    })
  var i = s(8138)
  uppyWrapper = i
})()
