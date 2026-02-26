var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

function validate(uuid) {
    return typeof uuid === 'string' && REGEX.test(uuid);
}

const byteToHex = [];
for (let i = 0; i < 256; ++i) {
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] +
        byteToHex[arr[offset + 1]] +
        byteToHex[arr[offset + 2]] +
        byteToHex[arr[offset + 3]] +
        '-' +
        byteToHex[arr[offset + 4]] +
        byteToHex[arr[offset + 5]] +
        '-' +
        byteToHex[arr[offset + 6]] +
        byteToHex[arr[offset + 7]] +
        '-' +
        byteToHex[arr[offset + 8]] +
        byteToHex[arr[offset + 9]] +
        '-' +
        byteToHex[arr[offset + 10]] +
        byteToHex[arr[offset + 11]] +
        byteToHex[arr[offset + 12]] +
        byteToHex[arr[offset + 13]] +
        byteToHex[arr[offset + 14]] +
        byteToHex[arr[offset + 15]]).toLowerCase();
}

let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
    if (!getRandomValues) {
        if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
        getRandomValues = crypto.getRandomValues.bind(crypto);
    }
    return getRandomValues(rnds8);
}

const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = { randomUUID };

function _v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? rng();
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
    if (native.randomUUID && true && !options) {
        return native.randomUUID();
    }
    return _v4(options);
}

const VERSION = 'current';

function assertConnection(falcon) {
    if (!falcon.isConnected) {
        throw new Error('You cannot call this API before having established a connection to the host!');
    }
}
function isValidResponse(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
event) {
    return !!event?.data?.meta?.messageId;
}

const CONNECTION_TIMEOUT = 5_000;
const API_TIMEOUT = 30_000;
const NAVIGATION_TIMEOUT = 5_000;
function sanitizeMessageId(messageId) {
    // Only allow valid UUID strings
    if (typeof messageId !== 'string' || !validate(messageId)) {
        return null;
    }
    return messageId;
}
function timeoutForMessage(message) {
    const timeout = message.type === 'connect'
        ? CONNECTION_TIMEOUT
        : message.type === 'api'
            ? API_TIMEOUT
            : message.type === 'navigateTo'
                ? NAVIGATION_TIMEOUT
                : // Requests not explicitly covered above will not have a timeout. This includes 'fileUpload', which is a user interaction that can take any amount of time.
                    null;
    // In tests we have mocked responses which do not require long timeouts
    return timeout;
}
class Bridge {
    onDataUpdate;
    onBroadcast;
    onLivereload;
    pendingMessages = new Map();
    targetOrigin = '*';
    constructor({ onDataUpdate, onBroadcast, onLivereload, } = {}) {
        this.onDataUpdate = onDataUpdate;
        this.onBroadcast = onBroadcast;
        this.onLivereload = onLivereload;
        window.addEventListener('message', this.handleMessageWrapper);
    }
    destroy() {
        window.removeEventListener('message', this.handleMessageWrapper);
    }
    setOrigin(origin) {
        this.targetOrigin = origin;
    }
    sendUnidirectionalMessage(message) {
        const messageId = v4();
        const eventData = {
            message,
            meta: {
                messageId,
                version: VERSION,
            },
        };
        window.parent.postMessage(eventData, this.targetOrigin);
    }
    async postMessage(message) {
        return new Promise((resolve, reject) => {
            const messageId = v4();
            let timeoutTimer;
            const timeoutValue = timeoutForMessage(message);
            if (timeoutValue !== null) {
                timeoutTimer = setTimeout(() => {
                    reject(new Error(`Waiting for response from foundry host for "${message.type}" message (ID: ${messageId}) timed out after ${timeoutValue}ms`));
                }, timeoutValue);
            }
            this.pendingMessages.set(messageId, (result) => {
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }
                resolve(result);
            });
            const eventData = {
                message,
                meta: {
                    messageId,
                    version: VERSION,
                },
            };
            window.parent.postMessage(eventData, this.targetOrigin);
        });
    }
    handleMessageWrapper = (event) => {
        return this.handleMessage(event);
    };
    handleMessage = (event) => {
        if (!isValidResponse(event)) {
            return;
        }
        const { message } = event.data;
        if (message.type === 'data') {
            this.onDataUpdate?.(message);
            // data update events are unidirectional and originated from the host, so there cannot be a callback waiting for this message
            return;
        }
        if (message.type === 'broadcast') {
            this.onBroadcast?.(message);
            // data update events are unidirectional and are proxied via the host, so there cannot be a callback waiting for this message
            return;
        }
        if (message.type === 'livereload') {
            this.onLivereload?.(message);
            // livereload events are unidirectional and are proxied via the host, so there cannot be a callback waiting for this message
            return;
        }
        const { messageId } = event.data.meta;
        // Sanitize messageId to prevent unvalidated dynamic method calls
        const sanitizedMessageId = sanitizeMessageId(messageId);
        if (!sanitizedMessageId) {
            this.throwError(`Received message with invalid messageId format`);
            return;
        }
        const callback = this.pendingMessages.get(sanitizedMessageId);
        if (!callback || typeof callback !== 'function') {
            this.throwError(`Received unexpected message`);
            return;
        }
        this.pendingMessages.delete(sanitizedMessageId);
        callback(message.payload);
    };
    throwError(message) {
        throw new Error(message);
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const anyMap = new WeakMap();
const eventsMap = new WeakMap();
const producersMap = new WeakMap();

const anyProducer = Symbol('anyProducer');
const resolvedPromise = Promise.resolve();

// Define symbols for "meta" events.
const listenerAdded = Symbol('listenerAdded');
const listenerRemoved = Symbol('listenerRemoved');

let canEmitMetaEvents = false;
let isGlobalDebugEnabled = false;

const isEventKeyType = key => typeof key === 'string' || typeof key === 'symbol' || typeof key === 'number';

function assertEventName(eventName) {
	if (!isEventKeyType(eventName)) {
		throw new TypeError('`eventName` must be a string, symbol, or number');
	}
}

function assertListener(listener) {
	if (typeof listener !== 'function') {
		throw new TypeError('listener must be a function');
	}
}

function getListeners(instance, eventName) {
	const events = eventsMap.get(instance);
	if (!events.has(eventName)) {
		return;
	}

	return events.get(eventName);
}

function getEventProducers(instance, eventName) {
	const key = isEventKeyType(eventName) ? eventName : anyProducer;
	const producers = producersMap.get(instance);
	if (!producers.has(key)) {
		return;
	}

	return producers.get(key);
}

function enqueueProducers(instance, eventName, eventData) {
	const producers = producersMap.get(instance);
	if (producers.has(eventName)) {
		for (const producer of producers.get(eventName)) {
			producer.enqueue(eventData);
		}
	}

	if (producers.has(anyProducer)) {
		const item = Promise.all([eventName, eventData]);
		for (const producer of producers.get(anyProducer)) {
			producer.enqueue(item);
		}
	}
}

function iterator(instance, eventNames) {
	eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

	let isFinished = false;
	let flush = () => {};
	let queue = [];

	const producer = {
		enqueue(item) {
			queue.push(item);
			flush();
		},
		finish() {
			isFinished = true;
			flush();
		},
	};

	for (const eventName of eventNames) {
		let set = getEventProducers(instance, eventName);
		if (!set) {
			set = new Set();
			const producers = producersMap.get(instance);
			producers.set(eventName, set);
		}

		set.add(producer);
	}

	return {
		async next() {
			if (!queue) {
				return {done: true};
			}

			if (queue.length === 0) {
				if (isFinished) {
					queue = undefined;
					return this.next();
				}

				await new Promise(resolve => {
					flush = resolve;
				});

				return this.next();
			}

			return {
				done: false,
				value: await queue.shift(),
			};
		},

		async return(value) {
			queue = undefined;

			for (const eventName of eventNames) {
				const set = getEventProducers(instance, eventName);
				if (set) {
					set.delete(producer);
					if (set.size === 0) {
						const producers = producersMap.get(instance);
						producers.delete(eventName);
					}
				}
			}

			flush();

			return arguments.length > 0
				? {done: true, value: await value}
				: {done: true};
		},

		[Symbol.asyncIterator]() {
			return this;
		},
	};
}

function defaultMethodNamesOrAssert(methodNames) {
	if (methodNames === undefined) {
		return allEmitteryMethods;
	}

	if (!Array.isArray(methodNames)) {
		throw new TypeError('`methodNames` must be an array of strings');
	}

	for (const methodName of methodNames) {
		if (!allEmitteryMethods.includes(methodName)) {
			if (typeof methodName !== 'string') {
				throw new TypeError('`methodNames` element must be a string');
			}

			throw new Error(`${methodName} is not Emittery method`);
		}
	}

	return methodNames;
}

const isMetaEvent = eventName => eventName === listenerAdded || eventName === listenerRemoved;

function emitMetaEvent(emitter, eventName, eventData) {
	if (!isMetaEvent(eventName)) {
		return;
	}

	try {
		canEmitMetaEvents = true;
		emitter.emit(eventName, eventData);
	} finally {
		canEmitMetaEvents = false;
	}
}

class Emittery {
	static mixin(emitteryPropertyName, methodNames) {
		methodNames = defaultMethodNamesOrAssert(methodNames);
		return target => {
			if (typeof target !== 'function') {
				throw new TypeError('`target` must be function');
			}

			for (const methodName of methodNames) {
				if (target.prototype[methodName] !== undefined) {
					throw new Error(`The property \`${methodName}\` already exists on \`target\``);
				}
			}

			function getEmitteryProperty() {
				Object.defineProperty(this, emitteryPropertyName, {
					enumerable: false,
					value: new Emittery(),
				});
				return this[emitteryPropertyName];
			}

			Object.defineProperty(target.prototype, emitteryPropertyName, {
				enumerable: false,
				get: getEmitteryProperty,
			});

			const emitteryMethodCaller = methodName => function (...args) {
				return this[emitteryPropertyName][methodName](...args);
			};

			for (const methodName of methodNames) {
				Object.defineProperty(target.prototype, methodName, {
					enumerable: false,
					value: emitteryMethodCaller(methodName),
				});
			}

			return target;
		};
	}

	static get isDebugEnabled() {
		// In a browser environment, `globalThis.process` can potentially reference a DOM Element with a `#process` ID,
		// so instead of just type checking `globalThis.process`, we need to make sure that `globalThis.process.env` exists.
		// eslint-disable-next-line n/prefer-global/process
		if (typeof globalThis.process?.env !== 'object') {
			return isGlobalDebugEnabled;
		}

		// eslint-disable-next-line n/prefer-global/process
		const {env} = globalThis.process ?? {env: {}};
		return env.DEBUG === 'emittery' || env.DEBUG === '*' || isGlobalDebugEnabled;
	}

	static set isDebugEnabled(newValue) {
		isGlobalDebugEnabled = newValue;
	}

	constructor(options = {}) {
		anyMap.set(this, new Set());
		eventsMap.set(this, new Map());
		producersMap.set(this, new Map());

		producersMap.get(this).set(anyProducer, new Set());

		this.debug = options.debug ?? {};

		if (this.debug.enabled === undefined) {
			this.debug.enabled = false;
		}

		if (!this.debug.logger) {
			this.debug.logger = (type, debugName, eventName, eventData) => {
				try {
					// TODO: Use https://github.com/sindresorhus/safe-stringify when the package is more mature. Just copy-paste the code.
					eventData = JSON.stringify(eventData);
				} catch {
					eventData = `Object with the following keys failed to stringify: ${Object.keys(eventData).join(',')}`;
				}

				if (typeof eventName === 'symbol' || typeof eventName === 'number') {
					eventName = eventName.toString();
				}

				const currentTime = new Date();
				const logTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}.${currentTime.getMilliseconds()}`;
				console.log(`[${logTime}][emittery:${type}][${debugName}] Event Name: ${eventName}\n\tdata: ${eventData}`);
			};
		}
	}

	logIfDebugEnabled(type, eventName, eventData) {
		if (Emittery.isDebugEnabled || this.debug.enabled) {
			this.debug.logger(type, this.debug.name, eventName, eventData);
		}
	}

	on(eventNames, listener, {signal} = {}) {
		assertListener(listener);

		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		for (const eventName of eventNames) {
			assertEventName(eventName);
			let set = getListeners(this, eventName);
			if (!set) {
				set = new Set();
				const events = eventsMap.get(this);
				events.set(eventName, set);
			}

			set.add(listener);

			this.logIfDebugEnabled('subscribe', eventName, undefined);

			if (!isMetaEvent(eventName)) {
				emitMetaEvent(this, listenerAdded, {eventName, listener});
			}
		}

		const off = () => {
			this.off(eventNames, listener);
			signal?.removeEventListener('abort', off);
		};

		signal?.addEventListener('abort', off, {once: true});

		if (signal?.aborted) {
			off();
		}

		return off;
	}

	off(eventNames, listener) {
		assertListener(listener);

		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		for (const eventName of eventNames) {
			assertEventName(eventName);
			const set = getListeners(this, eventName);
			if (set) {
				set.delete(listener);
				if (set.size === 0) {
					const events = eventsMap.get(this);
					events.delete(eventName);
				}
			}

			this.logIfDebugEnabled('unsubscribe', eventName, undefined);

			if (!isMetaEvent(eventName)) {
				emitMetaEvent(this, listenerRemoved, {eventName, listener});
			}
		}
	}

	once(eventNames, predicate) {
		if (predicate !== undefined && typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}

		let off_;

		const promise = new Promise(resolve => {
			off_ = this.on(eventNames, data => {
				if (predicate && !predicate(data)) {
					return;
				}

				off_();
				resolve(data);
			});
		});

		promise.off = off_;
		return promise;
	}

	events(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		for (const eventName of eventNames) {
			assertEventName(eventName);
		}

		return iterator(this, eventNames);
	}

	async emit(eventName, eventData) {
		assertEventName(eventName);

		if (isMetaEvent(eventName) && !canEmitMetaEvents) {
			throw new TypeError('`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`');
		}

		this.logIfDebugEnabled('emit', eventName, eventData);

		enqueueProducers(this, eventName, eventData);

		const listeners = getListeners(this, eventName) ?? new Set();
		const anyListeners = anyMap.get(this);
		const staticListeners = [...listeners];
		const staticAnyListeners = isMetaEvent(eventName) ? [] : [...anyListeners];

		await resolvedPromise;
		await Promise.all([
			...staticListeners.map(async listener => {
				if (listeners.has(listener)) {
					return listener(eventData);
				}
			}),
			...staticAnyListeners.map(async listener => {
				if (anyListeners.has(listener)) {
					return listener(eventName, eventData);
				}
			}),
		]);
	}

	async emitSerial(eventName, eventData) {
		assertEventName(eventName);

		if (isMetaEvent(eventName) && !canEmitMetaEvents) {
			throw new TypeError('`eventName` cannot be meta event `listenerAdded` or `listenerRemoved`');
		}

		this.logIfDebugEnabled('emitSerial', eventName, eventData);

		const listeners = getListeners(this, eventName) ?? new Set();
		const anyListeners = anyMap.get(this);
		const staticListeners = [...listeners];
		const staticAnyListeners = [...anyListeners];

		await resolvedPromise;
		/* eslint-disable no-await-in-loop */
		for (const listener of staticListeners) {
			if (listeners.has(listener)) {
				await listener(eventData);
			}
		}

		for (const listener of staticAnyListeners) {
			if (anyListeners.has(listener)) {
				await listener(eventName, eventData);
			}
		}
		/* eslint-enable no-await-in-loop */
	}

	onAny(listener, {signal} = {}) {
		assertListener(listener);

		this.logIfDebugEnabled('subscribeAny', undefined, undefined);

		anyMap.get(this).add(listener);
		emitMetaEvent(this, listenerAdded, {listener});

		const offAny = () => {
			this.offAny(listener);
			signal?.removeEventListener('abort', offAny);
		};

		signal?.addEventListener('abort', offAny, {once: true});

		if (signal?.aborted) {
			offAny();
		}

		return offAny;
	}

	anyEvent() {
		return iterator(this);
	}

	offAny(listener) {
		assertListener(listener);

		this.logIfDebugEnabled('unsubscribeAny', undefined, undefined);

		emitMetaEvent(this, listenerRemoved, {listener});
		anyMap.get(this).delete(listener);
	}

	clearListeners(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];

		for (const eventName of eventNames) {
			this.logIfDebugEnabled('clear', eventName, undefined);

			if (isEventKeyType(eventName)) {
				const set = getListeners(this, eventName);
				if (set) {
					set.clear();
				}

				const producers = getEventProducers(this, eventName);
				if (producers) {
					for (const producer of producers) {
						producer.finish();
					}

					producers.clear();
				}
			} else {
				anyMap.get(this).clear();

				for (const [eventName, listeners] of eventsMap.get(this).entries()) {
					listeners.clear();
					eventsMap.get(this).delete(eventName);
				}

				for (const [eventName, producers] of producersMap.get(this).entries()) {
					for (const producer of producers) {
						producer.finish();
					}

					producers.clear();
					producersMap.get(this).delete(eventName);
				}
			}
		}
	}

	listenerCount(eventNames) {
		eventNames = Array.isArray(eventNames) ? eventNames : [eventNames];
		let count = 0;

		for (const eventName of eventNames) {
			if (isEventKeyType(eventName)) {
				count += anyMap.get(this).size
					+ (getListeners(this, eventName)?.size ?? 0)
					+ (getEventProducers(this, eventName)?.size ?? 0)
					+ (getEventProducers(this)?.size ?? 0);

				continue;
			}

			if (eventName !== undefined) {
				assertEventName(eventName);
			}

			count += anyMap.get(this).size;

			for (const value of eventsMap.get(this).values()) {
				count += value.size;
			}

			for (const value of producersMap.get(this).values()) {
				count += value.size;
			}
		}

		return count;
	}

	bindMethods(target, methodNames) {
		if (typeof target !== 'object' || target === null) {
			throw new TypeError('`target` must be an object');
		}

		methodNames = defaultMethodNamesOrAssert(methodNames);

		for (const methodName of methodNames) {
			if (target[methodName] !== undefined) {
				throw new Error(`The property \`${methodName}\` already exists on \`target\``);
			}

			Object.defineProperty(target, methodName, {
				enumerable: false,
				value: this[methodName].bind(this),
			});
		}
	}
}

const allEmitteryMethods = Object.getOwnPropertyNames(Emittery.prototype).filter(v => v !== 'constructor');

Object.defineProperty(Emittery, 'listenerAdded', {
	value: listenerAdded,
	writable: false,
	enumerable: true,
	configurable: false,
});
Object.defineProperty(Emittery, 'listenerRemoved', {
	value: listenerRemoved,
	writable: false,
	enumerable: true,
	configurable: false,
});

function Memoize(args) {
    let hashFunction;
    let duration;
    let tags;
    {
        hashFunction = args;
    }
    return (target, propertyKey, descriptor) => {
        if (descriptor.value != null) {
            descriptor.value = getNewFunction(descriptor.value, hashFunction, duration, tags);
        }
        else if (descriptor.get != null) {
            descriptor.get = getNewFunction(descriptor.get, hashFunction, duration, tags);
        }
        else {
            throw 'Only put a Memoize() decorator on a method or get accessor.';
        }
    };
}
const clearCacheTagsMap = new Map();
function getNewFunction(originalMethod, hashFunction, duration = 0, tags) {
    const propMapName = Symbol(`__memoized_map__`);
    return function (...args) {
        let returnedValue;
        if (!this.hasOwnProperty(propMapName)) {
            Object.defineProperty(this, propMapName, {
                configurable: false,
                enumerable: false,
                writable: false,
                value: new Map()
            });
        }
        let myMap = this[propMapName];
        if (Array.isArray(tags)) {
            for (const tag of tags) {
                if (clearCacheTagsMap.has(tag)) {
                    clearCacheTagsMap.get(tag).push(myMap);
                }
                else {
                    clearCacheTagsMap.set(tag, [myMap]);
                }
            }
        }
        if (hashFunction || args.length > 0 || duration > 0) {
            let hashKey;
            if (hashFunction === true) {
                hashKey = args.map(a => a.toString()).join('!');
            }
            else if (hashFunction) {
                hashKey = hashFunction.apply(this, args);
            }
            else {
                hashKey = args[0];
            }
            const timestampKey = `${hashKey}__timestamp`;
            let isExpired = false;
            if (duration > 0) {
                if (!myMap.has(timestampKey)) {
                    isExpired = true;
                }
                else {
                    let timestamp = myMap.get(timestampKey);
                    isExpired = (Date.now() - timestamp) > duration;
                }
            }
            if (myMap.has(hashKey) && !isExpired) {
                returnedValue = myMap.get(hashKey);
            }
            else {
                returnedValue = originalMethod.apply(this, args);
                myMap.set(hashKey, returnedValue);
                if (duration > 0) {
                    myMap.set(timestampKey, Date.now());
                }
            }
        }
        else {
            const hashKey = this;
            if (myMap.has(hashKey)) {
                returnedValue = myMap.get(hashKey);
            }
            else {
                returnedValue = originalMethod.apply(this, args);
                myMap.set(hashKey, returnedValue);
            }
        }
        return returnedValue;
    };
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class AlertsApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async deleteEntitiesSuppressedDevicesV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'deleteEntitiesSuppressedDevicesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    /**
     * @deprecated This method is deprecated. Use getQueriesAlertsV2 instead.
     */
    async getQueriesAlertsV1(urlParams = {}) {
        console.warn('This method is deprecated. Use getQueriesAlertsV2 instead.');
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'getQueriesAlertsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesAlertsV2(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'getQueriesAlertsV2',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    /**
     * @deprecated This method is deprecated. Use patchCombinedAlertsV3 instead.
     */
    async patchCombinedAlertsV2(postBody, urlParams = {}) {
        console.warn('This method is deprecated. Use patchCombinedAlertsV3 instead.');
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'patchCombinedAlertsV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchCombinedAlertsV3(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'patchCombinedAlertsV3',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    /**
     * @deprecated This method is deprecated. Use patchEntitiesAlertsV3 instead.
     */
    async patchEntitiesAlertsV2(postBody, urlParams = {}) {
        console.warn('This method is deprecated. Use patchEntitiesAlertsV3 instead.');
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'patchEntitiesAlertsV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesAlertsV3(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'patchEntitiesAlertsV3',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesSuppressedDevicesV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'patchEntitiesSuppressedDevicesV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    /**
     * @deprecated This method is deprecated. Use postAggregatesAlertsV2 instead.
     */
    async postAggregatesAlertsV1(postBody, urlParams = {}) {
        console.warn('This method is deprecated. Use postAggregatesAlertsV2 instead.');
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'postAggregatesAlertsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesAlertsV2(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'postAggregatesAlertsV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    /**
     * @deprecated This method is deprecated. Use postEntitiesAlertsV2 instead.
     */
    async postEntitiesAlertsV1(postBody, urlParams = {}) {
        console.warn('This method is deprecated. Use postEntitiesAlertsV2 instead.');
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'postEntitiesAlertsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesAlertsV2(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'postEntitiesAlertsV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesSuppressedDevicesV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'alerts',
            method: 'postEntitiesSuppressedDevicesV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class CloudSecurityAssetsApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getAggregatesResourcesCountByManagedByV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'cloudSecurityAssets',
            method: 'getAggregatesResourcesCountByManagedByV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class CloudregistrationApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getCloudSecurityRegistrationAwsCombinedAccountsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'cloudregistration',
            method: 'getCloudSecurityRegistrationAwsCombinedAccountsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class ContainerSecurityApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getAggregatesClustersCountV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesClustersCountV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesContainersCountV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesContainersCountV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesContainersGroupByManagedV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesContainersGroupByManagedV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesContainersSensorCoverageV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesContainersSensorCoverageV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesImagesCountByStateV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesImagesCountByStateV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesNodesCountV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesNodesCountV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesPodsCountV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesPodsCountV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesUnidentifiedContainersCountV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getAggregatesUnidentifiedContainersCountV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getCombinedClustersV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'containerSecurity',
            method: 'getCombinedClustersV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class CspmRegistrationApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getCspmregistrationCloudConnectCspmAzureCombinedAccountsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'cspmRegistration',
            method: 'getCspmregistrationCloudConnectCspmAzureCombinedAccountsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getCspmregistrationCloudConnectCspmGcpCombinedAccountsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'cspmRegistration',
            method: 'getCspmregistrationCloudConnectCspmGcpCombinedAccountsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class CustomobjectsApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async deleteV1CollectionsCollectionNameObjectsObjectKey(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'customobjects',
            method: 'deleteV1CollectionsCollectionNameObjectsObjectKey',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getV1Collections(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'customobjects',
            method: 'getV1Collections',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getV1CollectionsCollectionNameObjects(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'customobjects',
            method: 'getV1CollectionsCollectionNameObjects',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getV1CollectionsCollectionNameObjectsObjectKey(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'customobjects',
            method: 'getV1CollectionsCollectionNameObjectsObjectKey',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getV1CollectionsCollectionNameObjectsObjectKeyMetadata(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'customobjects',
            method: 'getV1CollectionsCollectionNameObjectsObjectKeyMetadata',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postV1CollectionsCollectionNameObjects(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'customobjects',
            method: 'postV1CollectionsCollectionNameObjects',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async putV1CollectionsCollectionNameObjectsObjectKey(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'customobjects',
            method: 'putV1CollectionsCollectionNameObjectsObjectKey',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class DetectsApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getEntitiesSuppressedDevicesV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'detects',
            method: 'getEntitiesSuppressedDevicesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesDetectsV2(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'detects',
            method: 'patchEntitiesDetectsV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchQueriesDetectsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'detects',
            method: 'patchQueriesDetectsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchQueriesDetectsV2(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'detects',
            method: 'patchQueriesDetectsV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesDetectsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'detects',
            method: 'postAggregatesDetectsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesSummariesGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'detects',
            method: 'postEntitiesSummariesGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesSuppressedDevicesV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'detects',
            method: 'postEntitiesSuppressedDevicesV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class DevicesApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async deleteEntitiesGroupsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'deleteEntitiesGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesBucketsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getAggregatesBucketsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesFgaTagPrefixCountsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getAggregatesFgaTagPrefixCountsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getAggregatesTagPrefixCountsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getAggregatesTagPrefixCountsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesDevicesV1(urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getEntitiesDevicesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesFgaGroupsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getEntitiesFgaGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesGroupsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getEntitiesGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesAvailableGroupsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getQueriesAvailableGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesDevicesHiddenV2(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getQueriesDevicesHiddenV2',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesDevicesV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getQueriesDevicesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesDevicesV2(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getQueriesDevicesV2',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesFgaGroupsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getQueriesFgaGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesGroupsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'getQueriesGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesDevicesTagsV2(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'patchEntitiesDevicesTagsV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesDevicesV1(postBody, urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'patchEntitiesDevicesV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesGroupsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'patchEntitiesGroupsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesDevicesGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postAggregatesDevicesGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesFgaHostsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postAggregatesFgaHostsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postCombinedDevicesLoginHistoryV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postCombinedDevicesLoginHistoryV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postCombinedFgaHostsLoginHistoryV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postCombinedFgaHostsLoginHistoryV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesDevicesActionsV4(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesDevicesActionsV4',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesDevicesHiddenActionsV4(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesDevicesHiddenActionsV4',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesDevicesReportsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesDevicesReportsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesDevicesV1(postBody, urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesDevicesV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesDevicesV2(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesDevicesV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesFgaHostsReportsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesFgaHostsReportsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesFgaHostsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesFgaHostsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesGroupActionsV1(postBody, urlParams) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesGroupActionsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesGroupsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'devices',
            method: 'postEntitiesGroupsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class FaasGatewayApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getEntitiesExecutionV1(urlParams) {
        const message = {
            type: 'api',
            api: 'faasGateway',
            method: 'getEntitiesExecutionV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesExecutionV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'faasGateway',
            method: 'postEntitiesExecutionV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class FwmgrApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async deleteEntitiesNetworkLocationsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'deleteEntitiesNetworkLocationsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async deleteEntitiesPoliciesV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'deleteEntitiesPoliciesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async deleteEntitiesRuleGroupsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'deleteEntitiesRuleGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesEventsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesEventsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesFirewallFieldsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesFirewallFieldsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesNetworkLocationsDetailsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesNetworkLocationsDetailsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesNetworkLocationsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesNetworkLocationsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesPlatformsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesPlatformsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesPoliciesV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesPoliciesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesRuleGroupsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesRuleGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesRulesV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getEntitiesRulesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getLibraryEntitiesRuleGroupsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getLibraryEntitiesRuleGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getLibraryQueriesRuleGroupsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getLibraryQueriesRuleGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesEventsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getQueriesEventsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesFirewallFieldsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getQueriesFirewallFieldsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesNetworkLocationsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getQueriesNetworkLocationsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesPlatformsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getQueriesPlatformsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesPolicyRulesV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getQueriesPolicyRulesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesRuleGroupsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getQueriesRuleGroupsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesRulesV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'getQueriesRulesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesNetworkLocationsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'patchEntitiesNetworkLocationsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async patchEntitiesRuleGroupsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'patchEntitiesRuleGroupsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesEventsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postAggregatesEventsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesPolicyRulesGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postAggregatesPolicyRulesGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesRuleGroupsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postAggregatesRuleGroupsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesRulesGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postAggregatesRulesGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesNetworkLocationsMetadataV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postEntitiesNetworkLocationsMetadataV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesNetworkLocationsPrecedenceV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postEntitiesNetworkLocationsPrecedenceV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesNetworkLocationsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postEntitiesNetworkLocationsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesOntologyV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postEntitiesOntologyV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesRuleGroupsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postEntitiesRuleGroupsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesRulesValidateFilepathV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'postEntitiesRulesValidateFilepathV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async putEntitiesNetworkLocationsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'putEntitiesNetworkLocationsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async putEntitiesPoliciesV2(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'fwmgr',
            method: 'putEntitiesPoliciesV2',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class IncidentsApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getCombinedCrowdscoresV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'getCombinedCrowdscoresV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesBehaviorsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'getQueriesBehaviorsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesIncidentsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'getQueriesIncidentsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesBehaviorsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'postAggregatesBehaviorsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postAggregatesIncidentsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'postAggregatesIncidentsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesBehaviorsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'postEntitiesBehaviorsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesIncidentActionsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'postEntitiesIncidentActionsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesIncidentsGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'incidents',
            method: 'postEntitiesIncidentsGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class LoggingapiApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getEntitiesSavedSearchesExecuteV1(urlParams) {
        const message = {
            type: 'api',
            api: 'loggingapi',
            method: 'getEntitiesSavedSearchesExecuteV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesSavedSearchesV1(urlParams) {
        const message = {
            type: 'api',
            api: 'loggingapi',
            method: 'getEntitiesSavedSearchesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesSavedSearchesExecuteV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'loggingapi',
            method: 'postEntitiesSavedSearchesExecuteV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class MitreApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getIntelMitreEntitiesMatrixV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'mitre',
            method: 'getIntelMitreEntitiesMatrixV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class PluginsApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getEntitiesConfigsV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'plugins',
            method: 'getEntitiesConfigsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesDefinitionsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'plugins',
            method: 'getEntitiesDefinitionsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesExecuteDraftV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'plugins',
            method: 'postEntitiesExecuteDraftV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesExecuteV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'plugins',
            method: 'postEntitiesExecuteV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class RegistryAssessmentApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getAggregatesRegistriesCountByStateV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'registryAssessment',
            method: 'getAggregatesRegistriesCountByStateV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class RemoteResponseApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async deleteEntitiesPutFilesV1(urlParams) {
        const message = {
            type: 'api',
            api: 'remoteResponse',
            method: 'deleteEntitiesPutFilesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesAppCommandV1(urlParams) {
        const message = {
            type: 'api',
            api: 'remoteResponse',
            method: 'getEntitiesAppCommandV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getEntitiesPutFilesV2(urlParams) {
        const message = {
            type: 'api',
            api: 'remoteResponse',
            method: 'getEntitiesPutFilesV2',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async getQueriesPutFilesV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'remoteResponse',
            method: 'getQueriesPutFilesV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesAppCommandV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'remoteResponse',
            method: 'postEntitiesAppCommandV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesAppSessionsV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'remoteResponse',
            method: 'postEntitiesAppSessionsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class UserManagementApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getQueriesUsersV1(urlParams = {}) {
        const message = {
            type: 'api',
            api: 'userManagement',
            method: 'getQueriesUsersV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesUsersGetV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'userManagement',
            method: 'postEntitiesUsersGetV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class WorkflowsApiBridge {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    getBridge() {
        return this.bridge;
    }
    async getEntitiesExecutionResultsV1(urlParams) {
        const message = {
            type: 'api',
            api: 'workflows',
            method: 'getEntitiesExecutionResultsV1',
            payload: {
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesExecuteV1(postBody, urlParams = {}) {
        const message = {
            type: 'api',
            api: 'workflows',
            method: 'postEntitiesExecuteV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
    async postEntitiesExecutionActionsV1(postBody, urlParams) {
        const message = {
            type: 'api',
            api: 'workflows',
            method: 'postEntitiesExecutionActionsV1',
            payload: {
                body: postBody,
                params: urlParams,
            },
        };
        return this.bridge.postMessage(message);
    }
}

/**
 *
 * This file is autogenerated.
 *
 * DO NOT EDIT DIRECTLY
 *
 **/
class FalconPublicApis {
    api;
    constructor(api) {
        this.api = api;
    }
    get alerts() {
        assertConnection(this.api);
        return new AlertsApiBridge(this.api.bridge);
    }
    get detects() {
        assertConnection(this.api);
        return new DetectsApiBridge(this.api.bridge);
    }
    get devices() {
        assertConnection(this.api);
        return new DevicesApiBridge(this.api.bridge);
    }
    get fwmgr() {
        assertConnection(this.api);
        return new FwmgrApiBridge(this.api.bridge);
    }
    get incidents() {
        assertConnection(this.api);
        return new IncidentsApiBridge(this.api.bridge);
    }
    get mitre() {
        assertConnection(this.api);
        return new MitreApiBridge(this.api.bridge);
    }
    get plugins() {
        assertConnection(this.api);
        return new PluginsApiBridge(this.api.bridge);
    }
    get remoteResponse() {
        assertConnection(this.api);
        return new RemoteResponseApiBridge(this.api.bridge);
    }
    get userManagement() {
        assertConnection(this.api);
        return new UserManagementApiBridge(this.api.bridge);
    }
    get workflows() {
        assertConnection(this.api);
        return new WorkflowsApiBridge(this.api.bridge);
    }
    get cloudSecurityAssets() {
        assertConnection(this.api);
        return new CloudSecurityAssetsApiBridge(this.api.bridge);
    }
    get cloudregistration() {
        assertConnection(this.api);
        return new CloudregistrationApiBridge(this.api.bridge);
    }
    get containerSecurity() {
        assertConnection(this.api);
        return new ContainerSecurityApiBridge(this.api.bridge);
    }
    get cspmRegistration() {
        assertConnection(this.api);
        return new CspmRegistrationApiBridge(this.api.bridge);
    }
    get customobjects() {
        assertConnection(this.api);
        return new CustomobjectsApiBridge(this.api.bridge);
    }
    get faasGateway() {
        assertConnection(this.api);
        return new FaasGatewayApiBridge(this.api.bridge);
    }
    get loggingapi() {
        assertConnection(this.api);
        return new LoggingapiApiBridge(this.api.bridge);
    }
    get registryAssessment() {
        assertConnection(this.api);
        return new RegistryAssessmentApiBridge(this.api.bridge);
    }
}
__decorate([
    Memoize()
], FalconPublicApis.prototype, "alerts", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "detects", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "devices", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "fwmgr", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "incidents", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "mitre", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "plugins", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "remoteResponse", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "userManagement", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "workflows", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "cloudSecurityAssets", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "cloudregistration", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "containerSecurity", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "cspmRegistration", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "customobjects", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "faasGateway", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "loggingapi", null);
__decorate([
    Memoize()
], FalconPublicApis.prototype, "registryAssessment", null);

class ApiIntegration {
    falcon;
    definition;
    constructor(falcon, definition) {
        this.falcon = falcon;
        this.definition = definition;
    }
    async execute({ request } = {}) {
        return this.falcon.api.plugins.postEntitiesExecuteV1({
            resources: [
                {
                    definition_id: this.definition.definitionId,
                    operation_id: this.definition.operationId,
                    request,
                },
            ],
        });
    }
}

class CloudFunction {
    falcon;
    definition;
    static GET = 'GET';
    static POST = 'POST';
    static PATCH = 'PATCH';
    static PUT = 'PUT';
    static DELETE = 'DELETE';
    /**
     * @internal
     */
    pollTimeout = 500;
    /**
     * @internal
     */
    intervalId;
    /**
     * @internal
     */
    constructor(falcon, definition) {
        this.falcon = falcon;
        this.definition = definition;
    }
    async execute({ path, method, body, params }) {
        const functionDefinition = 'id' in this.definition
            ? {
                function_id: this.definition.id,
                function_version: this.definition.version,
            }
            : {
                function_name: this.definition.name,
                function_version: this.definition.version,
            };
        const result = await this.falcon.api.faasGateway.postEntitiesExecutionV1({
            ...functionDefinition,
            payload: {
                path,
                method,
                body,
                params,
            },
        });
        return new Promise((resolve, reject) => {
            const execution = result?.resources?.[0];
            if (!execution?.execution_id) {
                reject(result?.errors);
            }
            else {
                this.pollForResult({
                    resolve,
                    reject,
                    executionId: execution?.execution_id,
                });
            }
        });
    }
    async getExecutionResult(executionId) {
        const resultResponse = await this.falcon.api.faasGateway.getEntitiesExecutionV1({
            id: executionId,
        });
        const executionResult = resultResponse?.resources?.[0];
        return executionResult?.payload;
    }
    pollForResult({ resolve, reject, executionId, }) {
        let exceptionRetries = 2;
        this.intervalId = window.setInterval(async () => {
            try {
                const payload = await this.getExecutionResult(executionId);
                if (payload) {
                    window.clearInterval(this.intervalId);
                    resolve(payload);
                }
            }
            catch (e) {
                if (exceptionRetries <= 0) {
                    window.clearInterval(this.intervalId);
                    reject(e);
                }
                exceptionRetries--;
            }
        }, this.pollTimeout);
    }
    path(pathEntry) {
        const urlPath = new URL(pathEntry, 'http://localhost');
        const path = urlPath.pathname;
        const searchParams = [...urlPath.searchParams.entries()].reduce((acc, [key, value]) => ({
            ...acc,
            [key]: [value],
        }), {});
        return {
            path,
            queryParams: searchParams,
            get: async (params = {}) => {
                return this.get({
                    path,
                    params: {
                        query: params?.query ?? searchParams ?? {},
                        header: params?.header ?? {},
                    },
                });
            },
            post: async (body, params = {}) => {
                return this.post({
                    path,
                    params: {
                        query: params?.query ?? searchParams ?? {},
                        header: params?.header ?? {},
                    },
                    body,
                });
            },
            patch: async (body, params = {}) => {
                return this.patch({
                    path,
                    params: {
                        query: params?.query ?? searchParams ?? {},
                        header: params?.header ?? {},
                    },
                    body,
                });
            },
            put: async (body, params = {}) => {
                return this.put({
                    path,
                    params: {
                        query: params?.query ?? searchParams ?? {},
                        header: params?.header ?? {},
                    },
                    body,
                });
            },
            delete: async (body, params = {}) => {
                return this.delete({
                    path,
                    params: {
                        query: params?.query ?? searchParams ?? {},
                        header: params?.header ?? {},
                    },
                    body,
                });
            },
        };
    }
    async get({ path, params }) {
        return this.execute({
            path,
            method: CloudFunction.GET,
            params,
        });
    }
    async post({ path, params, body }) {
        return this.execute({
            path,
            method: CloudFunction.POST,
            body,
            params,
        });
    }
    async patch({ path, params, body }) {
        return this.execute({
            path,
            method: CloudFunction.PATCH,
            body,
            params,
        });
    }
    async put({ path, params, body }) {
        return this.execute({
            path,
            method: CloudFunction.PUT,
            body,
            params,
        });
    }
    async delete({ path, params, body }) {
        return this.execute({
            path,
            method: CloudFunction.DELETE,
            body,
            params,
        });
    }
    destroy() {
        if (this.intervalId) {
            window.clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
}

class Collection {
    falcon;
    definition;
    constructor(falcon, definition) {
        this.falcon = falcon;
        this.definition = definition;
    }
    /**
     * Write data to the collection
     *
     * @param key
     * @param data
     * @returns
     */
    async write(key, data) {
        return this.falcon.bridge.postMessage({
            type: 'collection',
            payload: {
                type: 'write',
                key,
                collection: this.definition.collection,
                data,
            },
        });
    }
    /**
     * Read the data for the given `key`
     *
     * @param key
     * @returns
     */
    async read(key) {
        return this.falcon.bridge.postMessage({
            type: 'collection',
            payload: {
                type: 'read',
                key,
                collection: this.definition.collection,
            },
        });
    }
    /**
     * Delete the data for the given `key`
     *
     * @param key
     * @returns
     */
    async delete(key) {
        return this.falcon.bridge.postMessage({
            type: 'collection',
            payload: {
                type: 'delete',
                key,
                collection: this.definition.collection,
            },
        });
    }
    /**
     * Search for data
     *
     * @param searchDefinition
     * @returns
     */
    async search({ filter, offset, sort, limit, }) {
        return this.falcon.bridge.postMessage({
            type: 'collection',
            payload: {
                type: 'search',
                filter,
                limit,
                offset,
                sort,
                collection: this.definition.collection,
            },
        });
    }
    /**
     * lists the object keys in the specified collection
     *
     * @param searchDefinition
     * @returns
     */
    async list(options) {
        return this.falcon.bridge.postMessage({
            type: 'collection',
            payload: {
                type: 'list',
                collection: this.definition.collection,
                start: options?.start,
                end: options?.end,
                limit: options?.limit,
            },
        });
    }
}

class Logscale {
    falcon;
    constructor(falcon) {
        this.falcon = falcon;
    }
    /**
     * Write data to LogScale
     *
     * @param data
     * @param properties
     * @returns
     */
    async write(
    // @todo the proper type here is unclear  - we need to make clear how the user needs to call this
    data, properties) {
        return this.falcon.bridge.postMessage({
            type: 'loggingapi',
            payload: {
                type: 'ingest',
                data,
                tag: properties?.tag,
                tagSource: properties?.tagSource,
                testData: properties?.testData,
            },
        });
    }
    /**
     * Execute a dynamic query
     *
     * @param query
     * @returns Promise that resolves with the data
     */
    async query(
    // @todo the proper type here is unclear  - we need to make clear how the user needs to call this
    query) {
        return this.falcon.bridge.postMessage({
            type: 'loggingapi',
            payload: {
                type: 'dynamic-execute',
                data: query,
            },
        });
    }
    /**
     * Execute a saved query
     *
     * @param savedQuery
     * @returns
     */
    async savedQuery(
    // @todo the proper type here is unclear  - we need to make clear how the user needs to call this
    savedQuery) {
        return this.falcon.bridge.postMessage({
            type: 'loggingapi',
            payload: {
                type: 'saved-query-execute',
                data: savedQuery,
            },
        });
    }
}

const ALLOWED_TARGETS = ['_self', '_blank'];
class Navigation {
    falcon;
    constructor(falcon) {
        this.falcon = falcon;
    }
    async navigateTo({ path, type, target, metaKey, ctrlKey, shiftKey, }) {
        await this.falcon.bridge.postMessage({
            type: 'navigateTo',
            payload: {
                path,
                type: type ?? 'falcon',
                target: target ?? '_self',
                metaKey: metaKey ?? false,
                ctrlKey: ctrlKey ?? false,
                shiftKey: shiftKey ?? false,
            },
        });
    }
    /**
     * @deprecated Use navigateTo directly
     */
    async onClick(event, defaultTarget = '_self', defaultType = 'falcon') {
        if (!(event instanceof Event)) {
            throw Error('"event" property should be subclass of Event');
        }
        if (!('preventDefault' in event)) {
            return;
        }
        if (!(event.target instanceof HTMLAnchorElement)) {
            return;
        }
        event.preventDefault();
        const path = event.target.getAttribute('href');
        defaultTarget =
            event.target.getAttribute('target') ??
                defaultTarget;
        const type = (event.target.dataset?.type ??
            defaultType);
        if (defaultTarget === null ||
            !ALLOWED_TARGETS.includes(defaultTarget)) {
            throw new Error('Target should be _self or _blank');
        }
        const target = defaultTarget;
        if (path === undefined || path === null) {
            throw new Error('Navigation path is missing. Make sure you have added navigation.onClick on the `a` tag and `href` is present.');
        }
        const { metaKey, ctrlKey, shiftKey } = event;
        await this.navigateTo({ path, type, target, metaKey, ctrlKey, shiftKey });
    }
}

/**
 * @internal
 */
class ResizeTracker {
    bridge;
    observer;
    constructor(bridge) {
        this.bridge = bridge;
        this.observer = new ResizeObserver((entries) => this.handleResizeEvent(entries));
        this.observer.observe(document.body);
    }
    handleResizeEvent(entries) {
        const { height } = entries[0].contentRect;
        this.bridge.sendUnidirectionalMessage({
            type: 'resize',
            payload: {
                height,
            },
        });
    }
    destroy() {
        this.observer.disconnect();
    }
}

/**
 * Invoke UI features within the main Falcon Console.
 */
class UI {
    bridge;
    constructor(bridge) {
        this.bridge = bridge;
    }
    /**
     * Open a modal within the Falcon Console, rendering an UI extension of your choice.
     *
     * ```js
     * const result = await api.ui.openModal({ id: '<extension ID as defined in the manifest>', type: 'extension' }, 'Modal title', {
        path: '/foo',
        data: { foo: 'bar' },
        size: 'lg',
        align: 'top',
      });
      ```
     *
     * @param extension The identifier of the extension, consisting of {@link ExtensionIdentifier.id} and {@link ExtensionIdentifier.type}
     * @param title The title to render in the header of the modal
     * @param options
     * @returns a Promise that resolves with the data passed to {@link closeModal}, or `undefined` if the user dismisses it
     */
    async openModal(extension, title, options = {}) {
        const result = await this.bridge.postMessage({
            type: 'openModal',
            payload: {
                extension,
                title,
                options,
            },
        });
        if (result instanceof Error) {
            throw result;
        }
        return result;
    }
    /**
     * Close a modal already opened via {@link openModal}. This can be called both by the extension that is rendered inside the modal or by the extension that opened the modal.
     *
     * @param payload the data to return to the caller that opened the modal as the value of the resolved promise
     */
    closeModal(payload) {
        this.bridge.sendUnidirectionalMessage({
            type: 'closeModal',
            payload,
        });
    }
    /**
     * This opens a file upload modal inside the Falcon Console, to support file uploads, even large binary files.
     *
     * @param fileUploadType the type of file upload
     * @param initialData data that you want to pre-populate the form with
     */
    async uploadFile(fileUploadType, initialData) {
        return this.bridge.postMessage({
            type: 'fileUpload',
            fileUploadType,
            payload: initialData,
        });
    }
}

/**
 * This is the main class and only entrypoint for engaging with the Falcon APIs from an Foundry UI extension or page.
 *
 * At the very minimum, you would have to instantiate the class and connect to the Falcon Console:
 *
 * ```js
 * import FalconApi from '@crowdstrike/foundry-js';
 *
 * const api = new FalconApi();
 *
 * await api.connect();
 * ```
 *
 */
class FalconApi {
    /**
     * @internal
     */
    isConnected = false;
    /**
     * An event emitter that allows you to subscribe to events issued by the Falcon Console.
     *
     * Currently supported event types:
     * * `data`: fires when {@link data} is updated.
     * * `broadcast`: this event is received when another extension of the same app has send a `broadcast` event via {@link sendBroadcast}.
     *
     * ```js
     * api.events.on('data', (newData) => console.log('new data received:', newData));
     * ```
     */
    events = new Emittery();
    /**
     * The "local data" that your extension receives from the Falcon Console. This can vary depending on the state of the Falcon Console and the socket of the extension.
     *
     * At the very least it will contain the data specified by the {@link LocalData} interface.
     */
    data;
    /**
     * @internal
     */
    bridge = new Bridge({
        onDataUpdate: (data) => this.handleDataUpdate(data),
        onBroadcast: (msg) => this.handleBroadcastMessage(msg),
        onLivereload: () => this.handleLivereloadMessage(),
    });
    /**
     * Namespace for all the {@link FalconPublicApis | Falcon Cloud APIs} you have access to with this SDK.
     */
    api = new FalconPublicApis(this);
    /**
     * The {@link UI} class contains methods to invoke UI features within the main Falcon Console.
     */
    ui = new UI(this.bridge);
    resizeTracker;
    cloudFunctions = [];
    apiIntegrations = [];
    collections = [];
    /**
     * Connect to the main Falcon Console from within your UI extension.
     *
     * This establishes a connection to send messages between the extension and the Falcon Console. Only when established you will be able to call other APIs.
     */
    async connect() {
        const response = await this.bridge.postMessage({ type: 'connect' });
        if (response !== undefined) {
            const { data, origin } = response;
            this.bridge.setOrigin(origin);
            this.data = data;
            this.updateTheme(data?.theme);
            this.isConnected = true;
        }
        this.resizeTracker = new ResizeTracker(this.bridge);
        return response;
    }
    /**
     * The ID of the Foundry app this UI extension belongs to.
     */
    get appId() {
        return this.data?.app.id;
    }
    /**
     * Sending broadcast messages is a mechanism for allowing communication between different UI extensions, when they are displayed at the same time.
     * When sending a broadcast message, other extensions need to listen for the `broadcast` event on the {@link events} event emitter.
     *
     * Note that broadcast messages are only dispatched between UI extensions of the same app!
     *
     * @param payload the data you want to send to other UI extensions
     */
    sendBroadcast(payload) {
        this.bridge.sendUnidirectionalMessage({ type: 'broadcast', payload });
    }
    handleDataUpdate(dataMessage) {
        this.data = dataMessage.payload;
        this.updateTheme(this.data.theme);
        this.events.emit('data', this.data);
    }
    handleBroadcastMessage(message) {
        this.events.emit('broadcast', message.payload);
    }
    handleLivereloadMessage() {
        document.location.reload();
    }
    updateTheme(activeTheme) {
        if (!activeTheme) {
            return;
        }
        const inactiveTheme = activeTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
        document.documentElement.classList.add(activeTheme);
        document.documentElement.classList.remove(inactiveTheme);
    }
    /**
     * Create a {@link CloudFunction} to integrate with Falcon's "Function as a Service" platform.
     *
     * @param definition
     * @returns
     */
    cloudFunction(definition) {
        assertConnection(this);
        const cf = new CloudFunction(this, definition);
        this.cloudFunctions.push(cf);
        return cf;
    }
    /**
     * Create an {@link ApiIntegration} to call external APIs.
     *
     * @param defintition
     * @returns
     */
    apiIntegration({ definitionId, operationId, }) {
        assertConnection(this);
        if (!this.data) {
            throw Error('Data from console is missing');
        }
        const apiIntegration = new ApiIntegration(this, {
            operationId,
            definitionId: definitionId,
        });
        this.apiIntegrations.push(apiIntegration);
        return apiIntegration;
    }
    /**
     * Create a {@link Collection} to write to and query Falcon's custom storage service.
     *
     * @param definition
     * @returns
     */
    collection({ collection }) {
        assertConnection(this);
        const co = new Collection(this, { collection });
        this.collections.push(co);
        return co;
    }
    /**
     * The {@link Navigation} class provides functionality to navigate to other pages.
     */
    get navigation() {
        assertConnection(this);
        return new Navigation(this);
    }
    /**
     * The {@link Logscale} class allows you to read and write to your custom LogScale repository.
     */
    get logscale() {
        assertConnection(this);
        return new Logscale(this);
    }
    destroy() {
        this.cloudFunctions.forEach((cf) => cf.destroy());
        this.resizeTracker?.destroy();
        this.bridge.destroy();
    }
}
__decorate([
    Memoize()
], FalconApi.prototype, "navigation", null);
__decorate([
    Memoize()
], FalconApi.prototype, "logscale", null);

export { Bridge, FalconApi as default };
