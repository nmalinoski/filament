var __defProp = Object.defineProperty
var __export = (target, all) => {
    for (var name2 in all)
        __defProp(target, name2, { get: all[name2], enumerable: !0 })
}
var filepond_esm_exports = {}
__export(filepond_esm_exports, {
    FileOrigin: () => FileOrigin$1,
    FileStatus: () => FileStatus,
    OptionTypes: () => OptionTypes,
    Status: () => Status$1,
    create: () => create$f,
    destroy: () => destroy,
    find: () => find,
    getOptions: () => getOptions$1,
    parse: () => parse,
    registerPlugin: () => registerPlugin,
    setOptions: () => setOptions$1,
    supported: () => supported,
})
var isNode = (value) => value instanceof HTMLElement,
    createStore = (initialState, queries2 = [], actions2 = []) => {
        let state2 = { ...initialState },
            actionQueue = [],
            dispatchQueue = [],
            getState = () => ({ ...state2 }),
            processActionQueue = () => {
                let queue = [...actionQueue]
                return (actionQueue.length = 0), queue
            },
            processDispatchQueue = () => {
                let queue = [...dispatchQueue]
                ;(dispatchQueue.length = 0),
                    queue.forEach(({ type, data: data3 }) => {
                        dispatch(type, data3)
                    })
            },
            dispatch = (type, data3, isBlocking) => {
                if (isBlocking && !document.hidden) {
                    dispatchQueue.push({ type, data: data3 })
                    return
                }
                actionHandlers[type] && actionHandlers[type](data3),
                    actionQueue.push({ type, data: data3 })
            },
            query = (str, ...args) =>
                queryHandles[str] ? queryHandles[str](...args) : null,
            api = {
                getState,
                processActionQueue,
                processDispatchQueue,
                dispatch,
                query,
            },
            queryHandles = {}
        queries2.forEach((query2) => {
            queryHandles = { ...query2(state2), ...queryHandles }
        })
        let actionHandlers = {}
        return (
            actions2.forEach((action) => {
                actionHandlers = {
                    ...action(dispatch, query, state2),
                    ...actionHandlers,
                }
            }),
            api
        )
    },
    defineProperty = (obj, property, definition) => {
        if (typeof definition == 'function') {
            obj[property] = definition
            return
        }
        Object.defineProperty(obj, property, { ...definition })
    },
    forin = (obj, cb) => {
        for (let key in obj) !obj.hasOwnProperty(key) || cb(key, obj[key])
    },
    createObject = (definition) => {
        let obj = {}
        return (
            forin(definition, (property) => {
                defineProperty(obj, property, definition[property])
            }),
            obj
        )
    },
    attr = (node, name2, value = null) => {
        if (value === null)
            return node.getAttribute(name2) || node.hasAttribute(name2)
        node.setAttribute(name2, value)
    },
    ns = 'http://www.w3.org/2000/svg',
    svgElements = ['svg', 'path'],
    isSVGElement = (tag) => svgElements.includes(tag),
    createElement = (tag, className, attributes = {}) => {
        typeof className == 'object' &&
            ((attributes = className), (className = null))
        let element = isSVGElement(tag)
            ? document.createElementNS(ns, tag)
            : document.createElement(tag)
        return (
            className &&
                (isSVGElement(tag)
                    ? attr(element, 'class', className)
                    : (element.className = className)),
            forin(attributes, (name2, value) => {
                attr(element, name2, value)
            }),
            element
        )
    },
    appendChild = (parent) => (child, index) => {
        typeof index != 'undefined' && parent.children[index]
            ? parent.insertBefore(child, parent.children[index])
            : parent.appendChild(child)
    },
    appendChildView = (parent, childViews) => (view, index) => (
        typeof index != 'undefined'
            ? childViews.splice(index, 0, view)
            : childViews.push(view),
        view
    ),
    removeChildView = (parent, childViews) => (view) => (
        childViews.splice(childViews.indexOf(view), 1),
        view.element.parentNode && parent.removeChild(view.element),
        view
    ),
    IS_BROWSER = (() =>
        typeof window != 'undefined' &&
        typeof window.document != 'undefined')(),
    isBrowser = () => IS_BROWSER,
    testElement = isBrowser() ? createElement('svg') : {},
    getChildCount =
        'children' in testElement
            ? (el) => el.children.length
            : (el) => el.childNodes.length,
    getViewRect = (elementRect, childViews, offset, scale) => {
        let left = offset[0] || elementRect.left,
            top = offset[1] || elementRect.top,
            right = left + elementRect.width,
            bottom = top + elementRect.height * (scale[1] || 1),
            rect = {
                element: { ...elementRect },
                inner: {
                    left: elementRect.left,
                    top: elementRect.top,
                    right: elementRect.right,
                    bottom: elementRect.bottom,
                },
                outer: { left, top, right, bottom },
            }
        return (
            childViews
                .filter((childView) => !childView.isRectIgnored())
                .map((childView) => childView.rect)
                .forEach((childViewRect) => {
                    expandRect(rect.inner, { ...childViewRect.inner }),
                        expandRect(rect.outer, { ...childViewRect.outer })
                }),
            calculateRectSize(rect.inner),
            (rect.outer.bottom += rect.element.marginBottom),
            (rect.outer.right += rect.element.marginRight),
            calculateRectSize(rect.outer),
            rect
        )
    },
    expandRect = (parent, child) => {
        ;(child.top += parent.top),
            (child.right += parent.left),
            (child.bottom += parent.top),
            (child.left += parent.left),
            child.bottom > parent.bottom && (parent.bottom = child.bottom),
            child.right > parent.right && (parent.right = child.right)
    },
    calculateRectSize = (rect) => {
        ;(rect.width = rect.right - rect.left),
            (rect.height = rect.bottom - rect.top)
    },
    isNumber = (value) => typeof value == 'number',
    thereYet = (position, destination, velocity, errorMargin = 0.001) =>
        Math.abs(position - destination) < errorMargin &&
        Math.abs(velocity) < errorMargin,
    spring = ({ stiffness = 0.5, damping = 0.75, mass = 10 } = {}) => {
        let target = null,
            position = null,
            velocity = 0,
            resting = !1,
            api = createObject({
                interpolate: (ts, skipToEndState) => {
                    if (resting) return
                    if (!(isNumber(target) && isNumber(position))) {
                        ;(resting = !0), (velocity = 0)
                        return
                    }
                    ;(velocity += (-(position - target) * stiffness) / mass),
                        (position += velocity),
                        (velocity *= damping),
                        thereYet(position, target, velocity) || skipToEndState
                            ? ((position = target),
                              (velocity = 0),
                              (resting = !0),
                              api.onupdate(position),
                              api.oncomplete(position))
                            : api.onupdate(position)
                },
                target: {
                    set: (value) => {
                        if (
                            (isNumber(value) &&
                                !isNumber(position) &&
                                (position = value),
                            target === null &&
                                ((target = value), (position = value)),
                            (target = value),
                            position === target || typeof target == 'undefined')
                        ) {
                            ;(resting = !0),
                                (velocity = 0),
                                api.onupdate(position),
                                api.oncomplete(position)
                            return
                        }
                        resting = !1
                    },
                    get: () => target,
                },
                resting: { get: () => resting },
                onupdate: (value) => {},
                oncomplete: (value) => {},
            })
        return api
    }
var easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    tween = ({ duration = 500, easing = easeInOutQuad, delay = 0 } = {}) => {
        let start = null,
            t,
            p,
            resting = !0,
            reverse = !1,
            target = null,
            api = createObject({
                interpolate: (ts, skipToEndState) => {
                    resting ||
                        target === null ||
                        (start === null && (start = ts),
                        !(ts - start < delay) &&
                            ((t = ts - start - delay),
                            t >= duration || skipToEndState
                                ? ((t = 1),
                                  (p = reverse ? 0 : 1),
                                  api.onupdate(p * target),
                                  api.oncomplete(p * target),
                                  (resting = !0))
                                : ((p = t / duration),
                                  api.onupdate(
                                      (t >= 0
                                          ? easing(reverse ? 1 - p : p)
                                          : 0) * target,
                                  ))))
                },
                target: {
                    get: () => (reverse ? 0 : target),
                    set: (value) => {
                        if (target === null) {
                            ;(target = value),
                                api.onupdate(value),
                                api.oncomplete(value)
                            return
                        }
                        value < target
                            ? ((target = 1), (reverse = !0))
                            : ((reverse = !1), (target = value)),
                            (resting = !1),
                            (start = null)
                    },
                },
                resting: { get: () => resting },
                onupdate: (value) => {},
                oncomplete: (value) => {},
            })
        return api
    },
    animator = { spring, tween },
    createAnimator = (definition, category, property) => {
        let def =
                definition[category] &&
                typeof definition[category][property] == 'object'
                    ? definition[category][property]
                    : definition[category] || definition,
            type = typeof def == 'string' ? def : def.type,
            props = typeof def == 'object' ? { ...def } : {}
        return animator[type] ? animator[type](props) : null
    },
    addGetSet = (keys, obj, props, overwrite = !1) => {
        ;(obj = Array.isArray(obj) ? obj : [obj]),
            obj.forEach((o) => {
                keys.forEach((key) => {
                    let name2 = key,
                        getter = () => props[key],
                        setter = (value) => (props[key] = value)
                    typeof key == 'object' &&
                        ((name2 = key.key),
                        (getter = key.getter || getter),
                        (setter = key.setter || setter)),
                        !(o[name2] && !overwrite) &&
                            (o[name2] = { get: getter, set: setter })
                })
            })
    },
    animations = ({
        mixinConfig,
        viewProps,
        viewInternalAPI,
        viewExternalAPI,
    }) => {
        let initialProps = { ...viewProps },
            animations2 = []
        return (
            forin(mixinConfig, (property, animation) => {
                let animator2 = createAnimator(animation)
                if (!animator2) return
                ;(animator2.onupdate = (value) => {
                    viewProps[property] = value
                }),
                    (animator2.target = initialProps[property]),
                    addGetSet(
                        [
                            {
                                key: property,
                                setter: (value) => {
                                    animator2.target !== value &&
                                        (animator2.target = value)
                                },
                                getter: () => viewProps[property],
                            },
                        ],
                        [viewInternalAPI, viewExternalAPI],
                        viewProps,
                        !0,
                    ),
                    animations2.push(animator2)
            }),
            {
                write: (ts) => {
                    let skipToEndState = document.hidden,
                        resting = !0
                    return (
                        animations2.forEach((animation) => {
                            animation.resting || (resting = !1),
                                animation.interpolate(ts, skipToEndState)
                        }),
                        resting
                    )
                },
                destroy: () => {},
            }
        )
    },
    addEvent = (element) => (type, fn2) => {
        element.addEventListener(type, fn2)
    },
    removeEvent = (element) => (type, fn2) => {
        element.removeEventListener(type, fn2)
    },
    listeners = ({
        mixinConfig,
        viewProps,
        viewInternalAPI,
        viewExternalAPI,
        viewState,
        view,
    }) => {
        let events = [],
            add = addEvent(view.element),
            remove = removeEvent(view.element)
        return (
            (viewExternalAPI.on = (type, fn2) => {
                events.push({ type, fn: fn2 }), add(type, fn2)
            }),
            (viewExternalAPI.off = (type, fn2) => {
                events.splice(
                    events.findIndex(
                        (event) => event.type === type && event.fn === fn2,
                    ),
                    1,
                ),
                    remove(type, fn2)
            }),
            {
                write: () => !0,
                destroy: () => {
                    events.forEach((event) => {
                        remove(event.type, event.fn)
                    })
                },
            }
        )
    },
    apis = ({ mixinConfig, viewProps, viewExternalAPI }) => {
        addGetSet(mixinConfig, viewExternalAPI, viewProps)
    },
    isDefined = (value) => value != null,
    defaults = {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        originX: 0,
        originY: 0,
    },
    styles = ({
        mixinConfig,
        viewProps,
        viewInternalAPI,
        viewExternalAPI,
        view,
    }) => {
        let initialProps = { ...viewProps },
            currentProps = {}
        addGetSet(mixinConfig, [viewInternalAPI, viewExternalAPI], viewProps)
        let getOffset = () => [
                viewProps.translateX || 0,
                viewProps.translateY || 0,
            ],
            getScale = () => [viewProps.scaleX || 0, viewProps.scaleY || 0],
            getRect = () =>
                view.rect
                    ? getViewRect(
                          view.rect,
                          view.childViews,
                          getOffset(),
                          getScale(),
                      )
                    : null
        return (
            (viewInternalAPI.rect = { get: getRect }),
            (viewExternalAPI.rect = { get: getRect }),
            mixinConfig.forEach((key) => {
                viewProps[key] =
                    typeof initialProps[key] == 'undefined'
                        ? defaults[key]
                        : initialProps[key]
            }),
            {
                write: () => {
                    if (!!propsHaveChanged(currentProps, viewProps))
                        return (
                            applyStyles(view.element, viewProps),
                            Object.assign(currentProps, { ...viewProps }),
                            !0
                        )
                },
                destroy: () => {},
            }
        )
    },
    propsHaveChanged = (currentProps, newProps) => {
        if (Object.keys(currentProps).length !== Object.keys(newProps).length)
            return !0
        for (let prop in newProps)
            if (newProps[prop] !== currentProps[prop]) return !0
        return !1
    },
    applyStyles = (
        element,
        {
            opacity,
            perspective,
            translateX,
            translateY,
            scaleX,
            scaleY,
            rotateX,
            rotateY,
            rotateZ,
            originX,
            originY,
            width,
            height,
        },
    ) => {
        let transforms2 = '',
            styles2 = ''
        ;(isDefined(originX) || isDefined(originY)) &&
            (styles2 += `transform-origin: ${originX || 0}px ${
                originY || 0
            }px;`),
            isDefined(perspective) &&
                (transforms2 += `perspective(${perspective}px) `),
            (isDefined(translateX) || isDefined(translateY)) &&
                (transforms2 += `translate3d(${translateX || 0}px, ${
                    translateY || 0
                }px, 0) `),
            (isDefined(scaleX) || isDefined(scaleY)) &&
                (transforms2 += `scale3d(${isDefined(scaleX) ? scaleX : 1}, ${
                    isDefined(scaleY) ? scaleY : 1
                }, 1) `),
            isDefined(rotateZ) && (transforms2 += `rotateZ(${rotateZ}rad) `),
            isDefined(rotateX) && (transforms2 += `rotateX(${rotateX}rad) `),
            isDefined(rotateY) && (transforms2 += `rotateY(${rotateY}rad) `),
            transforms2.length && (styles2 += `transform:${transforms2};`),
            isDefined(opacity) &&
                ((styles2 += `opacity:${opacity};`),
                opacity === 0 && (styles2 += 'visibility:hidden;'),
                opacity < 1 && (styles2 += 'pointer-events:none;')),
            isDefined(height) && (styles2 += `height:${height}px;`),
            isDefined(width) && (styles2 += `width:${width}px;`)
        let elementCurrentStyle = element.elementCurrentStyle || ''
        ;(styles2.length !== elementCurrentStyle.length ||
            styles2 !== elementCurrentStyle) &&
            ((element.style.cssText = styles2),
            (element.elementCurrentStyle = styles2))
    },
    Mixins = { styles, listeners, animations, apis },
    updateRect = (rect = {}, element = {}, style = {}) => (
        element.layoutCalculated ||
            ((rect.paddingTop = parseInt(style.paddingTop, 10) || 0),
            (rect.marginTop = parseInt(style.marginTop, 10) || 0),
            (rect.marginRight = parseInt(style.marginRight, 10) || 0),
            (rect.marginBottom = parseInt(style.marginBottom, 10) || 0),
            (rect.marginLeft = parseInt(style.marginLeft, 10) || 0),
            (element.layoutCalculated = !0)),
        (rect.left = element.offsetLeft || 0),
        (rect.top = element.offsetTop || 0),
        (rect.width = element.offsetWidth || 0),
        (rect.height = element.offsetHeight || 0),
        (rect.right = rect.left + rect.width),
        (rect.bottom = rect.top + rect.height),
        (rect.scrollTop = element.scrollTop),
        (rect.hidden = element.offsetParent === null),
        rect
    ),
    createView =
        ({
            tag = 'div',
            name: name2 = null,
            attributes = {},
            read = () => {},
            write: write2 = () => {},
            create: create2 = () => {},
            destroy: destroy2 = () => {},
            filterFrameActionsForChild = (child, actions2) => actions2,
            didCreateView = () => {},
            didWriteView = () => {},
            ignoreRect = !1,
            ignoreRectUpdate = !1,
            mixins = [],
        } = {}) =>
        (store, props = {}) => {
            let element = createElement(tag, `filepond--${name2}`, attributes),
                style = window.getComputedStyle(element, null),
                rect = updateRect(),
                frameRect = null,
                isResting = !1,
                childViews = [],
                activeMixins = [],
                ref = {},
                state2 = {},
                writers = [write2],
                readers = [read],
                destroyers = [destroy2],
                getElement = () => element,
                getChildViews = () => childViews.concat(),
                getReference = () => ref,
                createChildView = (store2) => (view, props2) =>
                    view(store2, props2),
                getRect = () =>
                    frameRect ||
                    ((frameRect = getViewRect(
                        rect,
                        childViews,
                        [0, 0],
                        [1, 1],
                    )),
                    frameRect),
                getStyle = () => style,
                _read = () => {
                    ;(frameRect = null),
                        childViews.forEach((child) => child._read()),
                        !(ignoreRectUpdate && rect.width && rect.height) &&
                            updateRect(rect, element, style)
                    let api = { root: internalAPI, props, rect }
                    readers.forEach((reader) => reader(api))
                },
                _write = (ts, frameActions, shouldOptimize) => {
                    let resting = frameActions.length === 0
                    return (
                        writers.forEach((writer) => {
                            writer({
                                props,
                                root: internalAPI,
                                actions: frameActions,
                                timestamp: ts,
                                shouldOptimize,
                            }) === !1 && (resting = !1)
                        }),
                        activeMixins.forEach((mixin) => {
                            mixin.write(ts) === !1 && (resting = !1)
                        }),
                        childViews
                            .filter((child) => !!child.element.parentNode)
                            .forEach((child) => {
                                child._write(
                                    ts,
                                    filterFrameActionsForChild(
                                        child,
                                        frameActions,
                                    ),
                                    shouldOptimize,
                                ) || (resting = !1)
                            }),
                        childViews.forEach((child, index) => {
                            child.element.parentNode ||
                                (internalAPI.appendChild(child.element, index),
                                child._read(),
                                child._write(
                                    ts,
                                    filterFrameActionsForChild(
                                        child,
                                        frameActions,
                                    ),
                                    shouldOptimize,
                                ),
                                (resting = !1))
                        }),
                        (isResting = resting),
                        didWriteView({
                            props,
                            root: internalAPI,
                            actions: frameActions,
                            timestamp: ts,
                        }),
                        resting
                    )
                },
                _destroy = () => {
                    activeMixins.forEach((mixin) => mixin.destroy()),
                        destroyers.forEach((destroyer) => {
                            destroyer({ root: internalAPI, props })
                        }),
                        childViews.forEach((child) => child._destroy())
                },
                sharedAPIDefinition = {
                    element: { get: getElement },
                    style: { get: getStyle },
                    childViews: { get: getChildViews },
                },
                internalAPIDefinition = {
                    ...sharedAPIDefinition,
                    rect: { get: getRect },
                    ref: { get: getReference },
                    is: (needle) => name2 === needle,
                    appendChild: appendChild(element),
                    createChildView: createChildView(store),
                    linkView: (view) => (childViews.push(view), view),
                    unlinkView: (view) => {
                        childViews.splice(childViews.indexOf(view), 1)
                    },
                    appendChildView: appendChildView(element, childViews),
                    removeChildView: removeChildView(element, childViews),
                    registerWriter: (writer) => writers.push(writer),
                    registerReader: (reader) => readers.push(reader),
                    registerDestroyer: (destroyer) =>
                        destroyers.push(destroyer),
                    invalidateLayout: () => (element.layoutCalculated = !1),
                    dispatch: store.dispatch,
                    query: store.query,
                },
                externalAPIDefinition = {
                    element: { get: getElement },
                    childViews: { get: getChildViews },
                    rect: { get: getRect },
                    resting: { get: () => isResting },
                    isRectIgnored: () => ignoreRect,
                    _read,
                    _write,
                    _destroy,
                },
                mixinAPIDefinition = {
                    ...sharedAPIDefinition,
                    rect: { get: () => rect },
                }
            Object.keys(mixins)
                .sort((a, b) => (a === 'styles' ? 1 : b === 'styles' ? -1 : 0))
                .forEach((key) => {
                    let mixinAPI = Mixins[key]({
                        mixinConfig: mixins[key],
                        viewProps: props,
                        viewState: state2,
                        viewInternalAPI: internalAPIDefinition,
                        viewExternalAPI: externalAPIDefinition,
                        view: createObject(mixinAPIDefinition),
                    })
                    mixinAPI && activeMixins.push(mixinAPI)
                })
            let internalAPI = createObject(internalAPIDefinition)
            create2({ root: internalAPI, props })
            let childCount = getChildCount(element)
            return (
                childViews.forEach((child, index) => {
                    internalAPI.appendChild(child.element, childCount + index)
                }),
                didCreateView(internalAPI),
                createObject(externalAPIDefinition)
            )
        },
    createPainter = (read, write2, fps = 60) => {
        let name2 = '__framePainter'
        if (window[name2]) {
            window[name2].readers.push(read), window[name2].writers.push(write2)
            return
        }
        window[name2] = { readers: [read], writers: [write2] }
        let painter = window[name2],
            interval = 1e3 / fps,
            last = null,
            id = null,
            requestTick = null,
            cancelTick = null,
            setTimerType = () => {
                document.hidden
                    ? ((requestTick = () =>
                          window.setTimeout(
                              () => tick(performance.now()),
                              interval,
                          )),
                      (cancelTick = () => window.clearTimeout(id)))
                    : ((requestTick = () => window.requestAnimationFrame(tick)),
                      (cancelTick = () => window.cancelAnimationFrame(id)))
            }
        document.addEventListener('visibilitychange', () => {
            cancelTick && cancelTick(), setTimerType(), tick(performance.now())
        })
        let tick = (ts) => {
            ;(id = requestTick(tick)), last || (last = ts)
            let delta = ts - last
            delta <= interval ||
                ((last = ts - (delta % interval)),
                painter.readers.forEach((read2) => read2()),
                painter.writers.forEach((write3) => write3(ts)))
        }
        return (
            setTimerType(),
            tick(performance.now()),
            {
                pause: () => {
                    cancelTick(id)
                },
            }
        )
    },
    createRoute =
        (routes, fn2) =>
        ({
            root: root2,
            props,
            actions: actions2 = [],
            timestamp,
            shouldOptimize,
        }) => {
            actions2
                .filter((action) => routes[action.type])
                .forEach((action) =>
                    routes[action.type]({
                        root: root2,
                        props,
                        action: action.data,
                        timestamp,
                        shouldOptimize,
                    }),
                ),
                fn2 &&
                    fn2({
                        root: root2,
                        props,
                        actions: actions2,
                        timestamp,
                        shouldOptimize,
                    })
        },
    insertBefore = (newNode, referenceNode) =>
        referenceNode.parentNode.insertBefore(newNode, referenceNode),
    insertAfter = (newNode, referenceNode) =>
        referenceNode.parentNode.insertBefore(
            newNode,
            referenceNode.nextSibling,
        ),
    isArray = (value) => Array.isArray(value),
    isEmpty = (value) => value == null,
    trim = (str) => str.trim(),
    toString = (value) => '' + value,
    toArray = (value, splitter = ',') =>
        isEmpty(value)
            ? []
            : isArray(value)
            ? value
            : toString(value)
                  .split(splitter)
                  .map(trim)
                  .filter((str) => str.length),
    isBoolean = (value) => typeof value == 'boolean',
    toBoolean = (value) => (isBoolean(value) ? value : value === 'true'),
    isString = (value) => typeof value == 'string',
    toNumber = (value) =>
        isNumber(value)
            ? value
            : isString(value)
            ? toString(value).replace(/[a-z]+/gi, '')
            : 0,
    toInt = (value) => parseInt(toNumber(value), 10),
    toFloat = (value) => parseFloat(toNumber(value)),
    isInt = (value) =>
        isNumber(value) && isFinite(value) && Math.floor(value) === value,
    toBytes = (value, base = 1e3) => {
        if (isInt(value)) return value
        let naturalFileSize = toString(value).trim()
        return /MB$/i.test(naturalFileSize)
            ? ((naturalFileSize = naturalFileSize.replace(/MB$i/, '').trim()),
              toInt(naturalFileSize) * base * base)
            : /KB/i.test(naturalFileSize)
            ? ((naturalFileSize = naturalFileSize.replace(/KB$i/, '').trim()),
              toInt(naturalFileSize) * base)
            : toInt(naturalFileSize)
    },
    isFunction = (value) => typeof value == 'function',
    toFunctionReference = (string) => {
        let ref = self,
            levels = string.split('.'),
            level = null
        for (; (level = levels.shift()); )
            if (((ref = ref[level]), !ref)) return null
        return ref
    },
    methods = {
        process: 'POST',
        patch: 'PATCH',
        revert: 'DELETE',
        fetch: 'GET',
        restore: 'GET',
        load: 'GET',
    },
    createServerAPI = (outline) => {
        let api = {}
        return (
            (api.url = isString(outline) ? outline : outline.url || ''),
            (api.timeout = outline.timeout ? parseInt(outline.timeout, 10) : 0),
            (api.headers = outline.headers ? outline.headers : {}),
            forin(methods, (key) => {
                api[key] = createAction(
                    key,
                    outline[key],
                    methods[key],
                    api.timeout,
                    api.headers,
                )
            }),
            (api.process =
                outline.process || isString(outline) || outline.url
                    ? api.process
                    : null),
            (api.remove = outline.remove || null),
            delete api.headers,
            api
        )
    },
    createAction = (name2, outline, method, timeout, headers) => {
        if (outline === null) return null
        if (typeof outline == 'function') return outline
        let action = {
            url: method === 'GET' || method === 'PATCH' ? `?${name2}=` : '',
            method,
            headers,
            withCredentials: !1,
            timeout,
            onload: null,
            ondata: null,
            onerror: null,
        }
        if (isString(outline)) return (action.url = outline), action
        if ((Object.assign(action, outline), isString(action.headers))) {
            let parts = action.headers.split(/:(.+)/)
            action.headers = { header: parts[0], value: parts[1] }
        }
        return (
            (action.withCredentials = toBoolean(action.withCredentials)), action
        )
    },
    toServerAPI = (value) => createServerAPI(value),
    isNull = (value) => value === null,
    isObject = (value) => typeof value == 'object' && value !== null,
    isAPI = (value) =>
        isObject(value) &&
        isString(value.url) &&
        isObject(value.process) &&
        isObject(value.revert) &&
        isObject(value.restore) &&
        isObject(value.fetch),
    getType = (value) =>
        isArray(value)
            ? 'array'
            : isNull(value)
            ? 'null'
            : isInt(value)
            ? 'int'
            : /^[0-9]+ ?(?:GB|MB|KB)$/gi.test(value)
            ? 'bytes'
            : isAPI(value)
            ? 'api'
            : typeof value,
    replaceSingleQuotes = (str) =>
        str
            .replace(/{\s*'/g, '{"')
            .replace(/'\s*}/g, '"}')
            .replace(/'\s*:/g, '":')
            .replace(/:\s*'/g, ':"')
            .replace(/,\s*'/g, ',"')
            .replace(/'\s*,/g, '",'),
    conversionTable = {
        array: toArray,
        boolean: toBoolean,
        int: (value) =>
            getType(value) === 'bytes' ? toBytes(value) : toInt(value),
        number: toFloat,
        float: toFloat,
        bytes: toBytes,
        string: (value) => (isFunction(value) ? value : toString(value)),
        function: (value) => toFunctionReference(value),
        serverapi: toServerAPI,
        object: (value) => {
            try {
                return JSON.parse(replaceSingleQuotes(value))
            } catch (e) {
                return null
            }
        },
    },
    convertTo = (value, type) => conversionTable[type](value),
    getValueByType = (newValue, defaultValue, valueType) => {
        if (newValue === defaultValue) return newValue
        let newValueType = getType(newValue)
        if (newValueType !== valueType) {
            let convertedValue = convertTo(newValue, valueType)
            if (
                ((newValueType = getType(convertedValue)),
                convertedValue === null)
            )
                throw `Trying to assign value with incorrect type to "${option}", allowed type: "${valueType}"`
            newValue = convertedValue
        }
        return newValue
    },
    createOption = (defaultValue, valueType) => {
        let currentValue = defaultValue
        return {
            enumerable: !0,
            get: () => currentValue,
            set: (newValue) => {
                currentValue = getValueByType(newValue, defaultValue, valueType)
            },
        }
    },
    createOptions = (options) => {
        let obj = {}
        return (
            forin(options, (prop) => {
                let optionDefinition = options[prop]
                obj[prop] = createOption(
                    optionDefinition[0],
                    optionDefinition[1],
                )
            }),
            createObject(obj)
        )
    },
    createInitialState = (options) => ({
        items: [],
        listUpdateTimeout: null,
        itemUpdateTimeout: null,
        processingQueue: [],
        options: createOptions(options),
    }),
    fromCamels = (string, separator = '-') =>
        string
            .split(/(?=[A-Z])/)
            .map((part) => part.toLowerCase())
            .join(separator),
    createOptionAPI = (store, options) => {
        let obj = {}
        return (
            forin(options, (key) => {
                obj[key] = {
                    get: () => store.getState().options[key],
                    set: (value) => {
                        store.dispatch(
                            `SET_${fromCamels(key, '_').toUpperCase()}`,
                            { value },
                        )
                    },
                }
            }),
            obj
        )
    },
    createOptionActions = (options) => (dispatch, query, state2) => {
        let obj = {}
        return (
            forin(options, (key) => {
                let name2 = fromCamels(key, '_').toUpperCase()
                obj[`SET_${name2}`] = (action) => {
                    try {
                        state2.options[key] = action.value
                    } catch (e) {}
                    dispatch(`DID_SET_${name2}`, { value: state2.options[key] })
                }
            }),
            obj
        )
    },
    createOptionQueries = (options) => (state2) => {
        let obj = {}
        return (
            forin(options, (key) => {
                obj[`GET_${fromCamels(key, '_').toUpperCase()}`] = (action) =>
                    state2.options[key]
            }),
            obj
        )
    },
    InteractionMethod = { API: 1, DROP: 2, BROWSE: 3, PASTE: 4, NONE: 5 },
    getUniqueId = () => Math.random().toString(36).substring(2, 11),
    arrayRemove = (arr, index) => arr.splice(index, 1),
    run = (cb, sync) => {
        sync
            ? cb()
            : document.hidden
            ? Promise.resolve(1).then(cb)
            : setTimeout(cb, 0)
    },
    on = () => {
        let listeners2 = [],
            off = (event, cb) => {
                arrayRemove(
                    listeners2,
                    listeners2.findIndex(
                        (listener) =>
                            listener.event === event &&
                            (listener.cb === cb || !cb),
                    ),
                )
            },
            fire = (event, args, sync) => {
                listeners2
                    .filter((listener) => listener.event === event)
                    .map((listener) => listener.cb)
                    .forEach((cb) => run(() => cb(...args), sync))
            }
        return {
            fireSync: (event, ...args) => {
                fire(event, args, !0)
            },
            fire: (event, ...args) => {
                fire(event, args, !1)
            },
            on: (event, cb) => {
                listeners2.push({ event, cb })
            },
            onOnce: (event, cb) => {
                listeners2.push({
                    event,
                    cb: (...args) => {
                        off(event, cb), cb(...args)
                    },
                })
            },
            off,
        }
    },
    copyObjectPropertiesToObject = (src, target, excluded) => {
        Object.getOwnPropertyNames(src)
            .filter((property) => !excluded.includes(property))
            .forEach((key) =>
                Object.defineProperty(
                    target,
                    key,
                    Object.getOwnPropertyDescriptor(src, key),
                ),
            )
    },
    PRIVATE = [
        'fire',
        'process',
        'revert',
        'load',
        'on',
        'off',
        'onOnce',
        'retryLoad',
        'extend',
        'archive',
        'archived',
        'release',
        'released',
        'requestProcessing',
        'freeze',
    ],
    createItemAPI = (item2) => {
        let api = {}
        return copyObjectPropertiesToObject(item2, api, PRIVATE), api
    },
    removeReleasedItems = (items) => {
        items.forEach((item2, index) => {
            item2.released && arrayRemove(items, index)
        })
    },
    ItemStatus = {
        INIT: 1,
        IDLE: 2,
        PROCESSING_QUEUED: 9,
        PROCESSING: 3,
        PROCESSING_COMPLETE: 5,
        PROCESSING_ERROR: 6,
        PROCESSING_REVERT_ERROR: 10,
        LOADING: 7,
        LOAD_ERROR: 8,
    },
    FileOrigin = { INPUT: 1, LIMBO: 2, LOCAL: 3 },
    getNonNumeric = (str) => /[^0-9]+/.exec(str),
    getDecimalSeparator = () => getNonNumeric((1.1).toLocaleString())[0],
    getThousandsSeparator = () => {
        let decimalSeparator = getDecimalSeparator(),
            thousandsStringWithSeparator = (1e3).toLocaleString(),
            thousandsStringWithoutSeparator = (1e3).toString()
        return thousandsStringWithSeparator !== thousandsStringWithoutSeparator
            ? getNonNumeric(thousandsStringWithSeparator)[0]
            : decimalSeparator === '.'
            ? ','
            : '.'
    },
    Type = {
        BOOLEAN: 'boolean',
        INT: 'int',
        NUMBER: 'number',
        STRING: 'string',
        ARRAY: 'array',
        OBJECT: 'object',
        FUNCTION: 'function',
        ACTION: 'action',
        SERVER_API: 'serverapi',
        REGEX: 'regex',
    },
    filters = [],
    applyFilterChain = (key, value, utils) =>
        new Promise((resolve, reject) => {
            let matchingFilters = filters
                .filter((f) => f.key === key)
                .map((f) => f.cb)
            if (matchingFilters.length === 0) {
                resolve(value)
                return
            }
            let initialFilter = matchingFilters.shift()
            matchingFilters
                .reduce(
                    (current, next) =>
                        current.then((value2) => next(value2, utils)),
                    initialFilter(value, utils),
                )
                .then((value2) => resolve(value2))
                .catch((error2) => reject(error2))
        }),
    applyFilters = (key, value, utils) =>
        filters.filter((f) => f.key === key).map((f) => f.cb(value, utils)),
    addFilter = (key, cb) => filters.push({ key, cb }),
    extendDefaultOptions = (additionalOptions) =>
        Object.assign(defaultOptions, additionalOptions),
    getOptions = () => ({ ...defaultOptions }),
    setOptions = (opts) => {
        forin(opts, (key, value) => {
            !defaultOptions[key] ||
                (defaultOptions[key][0] = getValueByType(
                    value,
                    defaultOptions[key][0],
                    defaultOptions[key][1],
                ))
        })
    },
    defaultOptions = {
        id: [null, Type.STRING],
        name: ['filepond', Type.STRING],
        disabled: [!1, Type.BOOLEAN],
        className: [null, Type.STRING],
        required: [!1, Type.BOOLEAN],
        captureMethod: [null, Type.STRING],
        allowSyncAcceptAttribute: [!0, Type.BOOLEAN],
        allowDrop: [!0, Type.BOOLEAN],
        allowBrowse: [!0, Type.BOOLEAN],
        allowPaste: [!0, Type.BOOLEAN],
        allowMultiple: [!1, Type.BOOLEAN],
        allowReplace: [!0, Type.BOOLEAN],
        allowRevert: [!0, Type.BOOLEAN],
        allowRemove: [!0, Type.BOOLEAN],
        allowProcess: [!0, Type.BOOLEAN],
        allowReorder: [!1, Type.BOOLEAN],
        allowDirectoriesOnly: [!1, Type.BOOLEAN],
        storeAsFile: [!1, Type.BOOLEAN],
        forceRevert: [!1, Type.BOOLEAN],
        maxFiles: [null, Type.INT],
        checkValidity: [!1, Type.BOOLEAN],
        itemInsertLocationFreedom: [!0, Type.BOOLEAN],
        itemInsertLocation: ['before', Type.STRING],
        itemInsertInterval: [75, Type.INT],
        dropOnPage: [!1, Type.BOOLEAN],
        dropOnElement: [!0, Type.BOOLEAN],
        dropValidation: [!1, Type.BOOLEAN],
        ignoredFiles: [['.ds_store', 'thumbs.db', 'desktop.ini'], Type.ARRAY],
        instantUpload: [!0, Type.BOOLEAN],
        maxParallelUploads: [2, Type.INT],
        allowMinimumUploadDuration: [!0, Type.BOOLEAN],
        chunkUploads: [!1, Type.BOOLEAN],
        chunkForce: [!1, Type.BOOLEAN],
        chunkSize: [5e6, Type.INT],
        chunkRetryDelays: [[500, 1e3, 3e3], Type.ARRAY],
        server: [null, Type.SERVER_API],
        fileSizeBase: [1e3, Type.INT],
        labelFileSizeBytes: ['bytes', Type.STRING],
        labelFileSizeKilobytes: ['KB', Type.STRING],
        labelFileSizeMegabytes: ['MB', Type.STRING],
        labelFileSizeGigabytes: ['GB', Type.STRING],
        labelDecimalSeparator: [getDecimalSeparator(), Type.STRING],
        labelThousandsSeparator: [getThousandsSeparator(), Type.STRING],
        labelIdle: [
            'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
            Type.STRING,
        ],
        labelInvalidField: ['Field contains invalid files', Type.STRING],
        labelFileWaitingForSize: ['Waiting for size', Type.STRING],
        labelFileSizeNotAvailable: ['Size not available', Type.STRING],
        labelFileCountSingular: ['file in list', Type.STRING],
        labelFileCountPlural: ['files in list', Type.STRING],
        labelFileLoading: ['Loading', Type.STRING],
        labelFileAdded: ['Added', Type.STRING],
        labelFileLoadError: ['Error during load', Type.STRING],
        labelFileRemoved: ['Removed', Type.STRING],
        labelFileRemoveError: ['Error during remove', Type.STRING],
        labelFileProcessing: ['Uploading', Type.STRING],
        labelFileProcessingComplete: ['Upload complete', Type.STRING],
        labelFileProcessingAborted: ['Upload cancelled', Type.STRING],
        labelFileProcessingError: ['Error during upload', Type.STRING],
        labelFileProcessingRevertError: ['Error during revert', Type.STRING],
        labelTapToCancel: ['tap to cancel', Type.STRING],
        labelTapToRetry: ['tap to retry', Type.STRING],
        labelTapToUndo: ['tap to undo', Type.STRING],
        labelButtonRemoveItem: ['Remove', Type.STRING],
        labelButtonAbortItemLoad: ['Abort', Type.STRING],
        labelButtonRetryItemLoad: ['Retry', Type.STRING],
        labelButtonAbortItemProcessing: ['Cancel', Type.STRING],
        labelButtonUndoItemProcessing: ['Undo', Type.STRING],
        labelButtonRetryItemProcessing: ['Retry', Type.STRING],
        labelButtonProcessItem: ['Upload', Type.STRING],
        iconRemove: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],
        iconProcess: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M14 10.414v3.585a1 1 0 0 1-2 0v-3.585l-1.293 1.293a1 1 0 0 1-1.414-1.415l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1-1.414 1.415L14 10.414zM9 18a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H9z" fill="currentColor" fill-rule="evenodd"/></svg>',
            Type.STRING,
        ],
        iconRetry: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M10.81 9.185l-.038.02A4.997 4.997 0 0 0 8 13.683a5 5 0 0 0 5 5 5 5 0 0 0 5-5 1 1 0 0 1 2 0A7 7 0 1 1 9.722 7.496l-.842-.21a.999.999 0 1 1 .484-1.94l3.23.806c.535.133.86.675.73 1.21l-.804 3.233a.997.997 0 0 1-1.21.73.997.997 0 0 1-.73-1.21l.23-.928v-.002z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],
        iconUndo: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M9.185 10.81l.02-.038A4.997 4.997 0 0 1 13.683 8a5 5 0 0 1 5 5 5 5 0 0 1-5 5 1 1 0 0 0 0 2A7 7 0 1 0 7.496 9.722l-.21-.842a.999.999 0 1 0-1.94.484l.806 3.23c.133.535.675.86 1.21.73l3.233-.803a.997.997 0 0 0 .73-1.21.997.997 0 0 0-1.21-.73l-.928.23-.002-.001z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],
        iconDone: [
            '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M18.293 9.293a1 1 0 0 1 1.414 1.414l-7.002 7a1 1 0 0 1-1.414 0l-3.998-4a1 1 0 1 1 1.414-1.414L12 15.586l6.294-6.293z" fill="currentColor" fill-rule="nonzero"/></svg>',
            Type.STRING,
        ],
        oninit: [null, Type.FUNCTION],
        onwarning: [null, Type.FUNCTION],
        onerror: [null, Type.FUNCTION],
        onactivatefile: [null, Type.FUNCTION],
        oninitfile: [null, Type.FUNCTION],
        onaddfilestart: [null, Type.FUNCTION],
        onaddfileprogress: [null, Type.FUNCTION],
        onaddfile: [null, Type.FUNCTION],
        onprocessfilestart: [null, Type.FUNCTION],
        onprocessfileprogress: [null, Type.FUNCTION],
        onprocessfileabort: [null, Type.FUNCTION],
        onprocessfilerevert: [null, Type.FUNCTION],
        onprocessfile: [null, Type.FUNCTION],
        onprocessfiles: [null, Type.FUNCTION],
        onremovefile: [null, Type.FUNCTION],
        onpreparefile: [null, Type.FUNCTION],
        onupdatefiles: [null, Type.FUNCTION],
        onreorderfiles: [null, Type.FUNCTION],
        beforeDropFile: [null, Type.FUNCTION],
        beforeAddFile: [null, Type.FUNCTION],
        beforeRemoveFile: [null, Type.FUNCTION],
        beforePrepareFile: [null, Type.FUNCTION],
        stylePanelLayout: [null, Type.STRING],
        stylePanelAspectRatio: [null, Type.STRING],
        styleItemPanelAspectRatio: [null, Type.STRING],
        styleButtonRemoveItemPosition: ['left', Type.STRING],
        styleButtonProcessItemPosition: ['right', Type.STRING],
        styleLoadIndicatorPosition: ['right', Type.STRING],
        styleProgressIndicatorPosition: ['right', Type.STRING],
        styleButtonRemoveItemAlign: [!1, Type.BOOLEAN],
        files: [[], Type.ARRAY],
        credits: [['https://pqina.nl/', 'Powered by PQINA'], Type.ARRAY],
    },
    getItemByQuery = (items, query) =>
        isEmpty(query)
            ? items[0] || null
            : isInt(query)
            ? items[query] || null
            : (typeof query == 'object' && (query = query.id),
              items.find((item2) => item2.id === query) || null),
    getNumericAspectRatioFromString = (aspectRatio) => {
        if (isEmpty(aspectRatio)) return aspectRatio
        if (/:/.test(aspectRatio)) {
            let parts = aspectRatio.split(':')
            return parts[1] / parts[0]
        }
        return parseFloat(aspectRatio)
    },
    getActiveItems = (items) => items.filter((item2) => !item2.archived),
    Status = { EMPTY: 0, IDLE: 1, ERROR: 2, BUSY: 3, READY: 4 },
    res = null,
    canUpdateFileInput = () => {
        if (res === null)
            try {
                let dataTransfer = new DataTransfer()
                dataTransfer.items.add(
                    new File(['hello world'], 'This_Works.txt'),
                )
                let el = document.createElement('input')
                el.setAttribute('type', 'file'),
                    (el.files = dataTransfer.files),
                    (res = el.files.length === 1)
            } catch (err) {
                res = !1
            }
        return res
    },
    ITEM_ERROR = [
        ItemStatus.LOAD_ERROR,
        ItemStatus.PROCESSING_ERROR,
        ItemStatus.PROCESSING_REVERT_ERROR,
    ],
    ITEM_BUSY = [
        ItemStatus.LOADING,
        ItemStatus.PROCESSING,
        ItemStatus.PROCESSING_QUEUED,
        ItemStatus.INIT,
    ],
    ITEM_READY = [ItemStatus.PROCESSING_COMPLETE],
    isItemInErrorState = (item2) => ITEM_ERROR.includes(item2.status),
    isItemInBusyState = (item2) => ITEM_BUSY.includes(item2.status),
    isItemInReadyState = (item2) => ITEM_READY.includes(item2.status),
    isAsync = (state2) =>
        isObject(state2.options.server) &&
        (isObject(state2.options.server.process) ||
            isFunction(state2.options.server.process)),
    queries = (state2) => ({
        GET_STATUS: () => {
            let items = getActiveItems(state2.items),
                { EMPTY, ERROR, BUSY, IDLE, READY } = Status
            return items.length === 0
                ? EMPTY
                : items.some(isItemInErrorState)
                ? ERROR
                : items.some(isItemInBusyState)
                ? BUSY
                : items.some(isItemInReadyState)
                ? READY
                : IDLE
        },
        GET_ITEM: (query) => getItemByQuery(state2.items, query),
        GET_ACTIVE_ITEM: (query) =>
            getItemByQuery(getActiveItems(state2.items), query),
        GET_ACTIVE_ITEMS: () => getActiveItems(state2.items),
        GET_ITEMS: () => state2.items,
        GET_ITEM_NAME: (query) => {
            let item2 = getItemByQuery(state2.items, query)
            return item2 ? item2.filename : null
        },
        GET_ITEM_SIZE: (query) => {
            let item2 = getItemByQuery(state2.items, query)
            return item2 ? item2.fileSize : null
        },
        GET_STYLES: () =>
            Object.keys(state2.options)
                .filter((key) => /^style/.test(key))
                .map((option2) => ({
                    name: option2,
                    value: state2.options[option2],
                })),
        GET_PANEL_ASPECT_RATIO: () =>
            /circle/.test(state2.options.stylePanelLayout)
                ? 1
                : getNumericAspectRatioFromString(
                      state2.options.stylePanelAspectRatio,
                  ),
        GET_ITEM_PANEL_ASPECT_RATIO: () =>
            state2.options.styleItemPanelAspectRatio,
        GET_ITEMS_BY_STATUS: (status) =>
            getActiveItems(state2.items).filter(
                (item2) => item2.status === status,
            ),
        GET_TOTAL_ITEMS: () => getActiveItems(state2.items).length,
        SHOULD_UPDATE_FILE_INPUT: () =>
            state2.options.storeAsFile &&
            canUpdateFileInput() &&
            !isAsync(state2),
        IS_ASYNC: () => isAsync(state2),
        GET_FILE_SIZE_LABELS: (query) => ({
            labelBytes: query('GET_LABEL_FILE_SIZE_BYTES') || void 0,
            labelKilobytes: query('GET_LABEL_FILE_SIZE_KILOBYTES') || void 0,
            labelMegabytes: query('GET_LABEL_FILE_SIZE_MEGABYTES') || void 0,
            labelGigabytes: query('GET_LABEL_FILE_SIZE_GIGABYTES') || void 0,
        }),
    }),
    hasRoomForItem = (state2) => {
        let count = getActiveItems(state2.items).length
        if (!state2.options.allowMultiple) return count === 0
        let maxFileCount = state2.options.maxFiles
        return maxFileCount === null || count < maxFileCount
    },
    limit = (value, min, max) => Math.max(Math.min(max, value), min),
    arrayInsert = (arr, index, item2) => arr.splice(index, 0, item2),
    insertItem = (items, item2, index) =>
        isEmpty(item2)
            ? null
            : typeof index == 'undefined'
            ? (items.push(item2), item2)
            : ((index = limit(index, 0, items.length)),
              arrayInsert(items, index, item2),
              item2),
    isBase64DataURI = (str) =>
        /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i.test(
            str,
        ),
    getFilenameFromURL = (url) => url.split('/').pop().split('?').shift(),
    getExtensionFromFilename = (name2) => name2.split('.').pop(),
    guesstimateExtension = (type) => {
        if (typeof type != 'string') return ''
        let subtype = type.split('/').pop()
        return /svg/.test(subtype)
            ? 'svg'
            : /zip|compressed/.test(subtype)
            ? 'zip'
            : /plain/.test(subtype)
            ? 'txt'
            : /msword/.test(subtype)
            ? 'doc'
            : /[a-z]+/.test(subtype)
            ? subtype === 'jpeg'
                ? 'jpg'
                : subtype
            : ''
    },
    leftPad = (value, padding = '') => (padding + value).slice(-padding.length),
    getDateString = (date = new Date()) =>
        `${date.getFullYear()}-${leftPad(date.getMonth() + 1, '00')}-${leftPad(
            date.getDate(),
            '00',
        )}_${leftPad(date.getHours(), '00')}-${leftPad(
            date.getMinutes(),
            '00',
        )}-${leftPad(date.getSeconds(), '00')}`,
    getFileFromBlob = (blob2, filename, type = null, extension = null) => {
        let file2 =
            typeof type == 'string'
                ? blob2.slice(0, blob2.size, type)
                : blob2.slice(0, blob2.size, blob2.type)
        return (
            (file2.lastModifiedDate = new Date()),
            blob2._relativePath && (file2._relativePath = blob2._relativePath),
            isString(filename) || (filename = getDateString()),
            filename && extension === null && getExtensionFromFilename(filename)
                ? (file2.name = filename)
                : ((extension = extension || guesstimateExtension(file2.type)),
                  (file2.name = filename + (extension ? '.' + extension : ''))),
            file2
        )
    },
    getBlobBuilder = () =>
        (window.BlobBuilder =
            window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder),
    createBlob = (arrayBuffer, mimeType) => {
        let BB = getBlobBuilder()
        if (BB) {
            let bb = new BB()
            return bb.append(arrayBuffer), bb.getBlob(mimeType)
        }
        return new Blob([arrayBuffer], { type: mimeType })
    },
    getBlobFromByteStringWithMimeType = (byteString, mimeType) => {
        let ab = new ArrayBuffer(byteString.length),
            ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++)
            ia[i] = byteString.charCodeAt(i)
        return createBlob(ab, mimeType)
    },
    getMimeTypeFromBase64DataURI = (dataURI) =>
        (/^data:(.+);/.exec(dataURI) || [])[1] || null,
    getBase64DataFromBase64DataURI = (dataURI) =>
        dataURI.split(',')[1].replace(/\s/g, ''),
    getByteStringFromBase64DataURI = (dataURI) =>
        atob(getBase64DataFromBase64DataURI(dataURI)),
    getBlobFromBase64DataURI = (dataURI) => {
        let mimeType = getMimeTypeFromBase64DataURI(dataURI),
            byteString = getByteStringFromBase64DataURI(dataURI)
        return getBlobFromByteStringWithMimeType(byteString, mimeType)
    },
    getFileFromBase64DataURI = (dataURI, filename, extension) =>
        getFileFromBlob(
            getBlobFromBase64DataURI(dataURI),
            filename,
            null,
            extension,
        ),
    getFileNameFromHeader = (header) => {
        if (!/^content-disposition:/i.test(header)) return null
        let matches = header
            .split(/filename=|filename\*=.+''/)
            .splice(1)
            .map((name2) => name2.trim().replace(/^["']|[;"']{0,2}$/g, ''))
            .filter((name2) => name2.length)
        return matches.length ? decodeURI(matches[matches.length - 1]) : null
    },
    getFileSizeFromHeader = (header) => {
        if (/content-length:/i.test(header)) {
            let size = header.match(/[0-9]+/)[0]
            return size ? parseInt(size, 10) : null
        }
        return null
    },
    getTranfserIdFromHeader = (header) =>
        (/x-content-transfer-id:/i.test(header) &&
            (header.split(':')[1] || '').trim()) ||
        null,
    getFileInfoFromHeaders = (headers) => {
        let info = { source: null, name: null, size: null },
            rows = headers.split(`
`)
        for (let header of rows) {
            let name2 = getFileNameFromHeader(header)
            if (name2) {
                info.name = name2
                continue
            }
            let size = getFileSizeFromHeader(header)
            if (size) {
                info.size = size
                continue
            }
            let source = getTranfserIdFromHeader(header)
            if (source) {
                info.source = source
                continue
            }
        }
        return info
    },
    createFileLoader = (fetchFn) => {
        let state2 = {
                source: null,
                complete: !1,
                progress: 0,
                size: null,
                timestamp: null,
                duration: 0,
                request: null,
            },
            getProgress = () => state2.progress,
            abort = () => {
                state2.request && state2.request.abort && state2.request.abort()
            },
            load = () => {
                let source = state2.source
                api.fire('init', source),
                    source instanceof File
                        ? api.fire('load', source)
                        : source instanceof Blob
                        ? api.fire('load', getFileFromBlob(source, source.name))
                        : isBase64DataURI(source)
                        ? api.fire('load', getFileFromBase64DataURI(source))
                        : loadURL(source)
            },
            loadURL = (url) => {
                if (!fetchFn) {
                    api.fire('error', {
                        type: 'error',
                        body: "Can't load URL",
                        code: 400,
                    })
                    return
                }
                ;(state2.timestamp = Date.now()),
                    (state2.request = fetchFn(
                        url,
                        (response) => {
                            ;(state2.duration = Date.now() - state2.timestamp),
                                (state2.complete = !0),
                                response instanceof Blob &&
                                    (response = getFileFromBlob(
                                        response,
                                        response.name ||
                                            getFilenameFromURL(url),
                                    )),
                                api.fire(
                                    'load',
                                    response instanceof Blob
                                        ? response
                                        : response
                                        ? response.body
                                        : null,
                                )
                        },
                        (error2) => {
                            api.fire(
                                'error',
                                typeof error2 == 'string'
                                    ? { type: 'error', code: 0, body: error2 }
                                    : error2,
                            )
                        },
                        (computable, current, total) => {
                            if (
                                (total && (state2.size = total),
                                (state2.duration =
                                    Date.now() - state2.timestamp),
                                !computable)
                            ) {
                                state2.progress = null
                                return
                            }
                            ;(state2.progress = current / total),
                                api.fire('progress', state2.progress)
                        },
                        () => {
                            api.fire('abort')
                        },
                        (response) => {
                            let fileinfo = getFileInfoFromHeaders(
                                typeof response == 'string'
                                    ? response
                                    : response.headers,
                            )
                            api.fire('meta', {
                                size: state2.size || fileinfo.size,
                                filename: fileinfo.name,
                                source: fileinfo.source,
                            })
                        },
                    ))
            },
            api = {
                ...on(),
                setSource: (source) => (state2.source = source),
                getProgress,
                abort,
                load,
            }
        return api
    },
    isGet = (method) => /GET|HEAD/.test(method),
    sendRequest = (data3, url, options) => {
        let api = {
                onheaders: () => {},
                onprogress: () => {},
                onload: () => {},
                ontimeout: () => {},
                onerror: () => {},
                onabort: () => {},
                abort: () => {
                    ;(aborted = !0), xhr.abort()
                },
            },
            aborted = !1,
            headersReceived = !1
        ;(options = {
            method: 'POST',
            headers: {},
            withCredentials: !1,
            ...options,
        }),
            (url = encodeURI(url)),
            isGet(options.method) &&
                data3 &&
                (url = `${url}${encodeURIComponent(
                    typeof data3 == 'string' ? data3 : JSON.stringify(data3),
                )}`)
        let xhr = new XMLHttpRequest(),
            process = isGet(options.method) ? xhr : xhr.upload
        return (
            (process.onprogress = (e) => {
                aborted || api.onprogress(e.lengthComputable, e.loaded, e.total)
            }),
            (xhr.onreadystatechange = () => {
                xhr.readyState < 2 ||
                    (xhr.readyState === 4 && xhr.status === 0) ||
                    headersReceived ||
                    ((headersReceived = !0), api.onheaders(xhr))
            }),
            (xhr.onload = () => {
                xhr.status >= 200 && xhr.status < 300
                    ? api.onload(xhr)
                    : api.onerror(xhr)
            }),
            (xhr.onerror = () => api.onerror(xhr)),
            (xhr.onabort = () => {
                ;(aborted = !0), api.onabort()
            }),
            (xhr.ontimeout = () => api.ontimeout(xhr)),
            xhr.open(options.method, url, !0),
            isInt(options.timeout) && (xhr.timeout = options.timeout),
            Object.keys(options.headers).forEach((key) => {
                let value = unescape(encodeURIComponent(options.headers[key]))
                xhr.setRequestHeader(key, value)
            }),
            options.responseType && (xhr.responseType = options.responseType),
            options.withCredentials && (xhr.withCredentials = !0),
            xhr.send(data3),
            api
        )
    },
    createResponse = (type, code, body, headers) => ({
        type,
        code,
        body,
        headers,
    }),
    createTimeoutResponse = (cb) => (xhr) => {
        cb(createResponse('error', 0, 'Timeout', xhr.getAllResponseHeaders()))
    },
    hasQS = (str) => /\?/.test(str),
    buildURL = (...parts) => {
        let url = ''
        return (
            parts.forEach((part) => {
                url +=
                    hasQS(url) && hasQS(part) ? part.replace(/\?/, '&') : part
            }),
            url
        )
    },
    createFetchFunction = (apiUrl = '', action) => {
        if (typeof action == 'function') return action
        if (!action || !isString(action.url)) return null
        let onload = action.onload || ((res2) => res2),
            onerror = action.onerror || ((res2) => null)
        return (url, load, error2, progress, abort, headers) => {
            let request = sendRequest(url, buildURL(apiUrl, action.url), {
                ...action,
                responseType: 'blob',
            })
            return (
                (request.onload = (xhr) => {
                    let headers2 = xhr.getAllResponseHeaders(),
                        filename =
                            getFileInfoFromHeaders(headers2).name ||
                            getFilenameFromURL(url)
                    load(
                        createResponse(
                            'load',
                            xhr.status,
                            action.method === 'HEAD'
                                ? null
                                : getFileFromBlob(
                                      onload(xhr.response),
                                      filename,
                                  ),
                            headers2,
                        ),
                    )
                }),
                (request.onerror = (xhr) => {
                    error2(
                        createResponse(
                            'error',
                            xhr.status,
                            onerror(xhr.response) || xhr.statusText,
                            xhr.getAllResponseHeaders(),
                        ),
                    )
                }),
                (request.onheaders = (xhr) => {
                    headers(
                        createResponse(
                            'headers',
                            xhr.status,
                            null,
                            xhr.getAllResponseHeaders(),
                        ),
                    )
                }),
                (request.ontimeout = createTimeoutResponse(error2)),
                (request.onprogress = progress),
                (request.onabort = abort),
                request
            )
        }
    },
    ChunkStatus = {
        QUEUED: 0,
        COMPLETE: 1,
        PROCESSING: 2,
        ERROR: 3,
        WAITING: 4,
    },
    processFileChunked = (
        apiUrl,
        action,
        name2,
        file2,
        metadata,
        load,
        error2,
        progress,
        abort,
        transfer,
        options,
    ) => {
        let chunks = [],
            { chunkTransferId, chunkServer, chunkSize, chunkRetryDelays } =
                options,
            state2 = { serverId: chunkTransferId, aborted: !1 },
            ondata = action.ondata || ((fd) => fd),
            onload =
                action.onload ||
                ((xhr, method) =>
                    method === 'HEAD'
                        ? xhr.getResponseHeader('Upload-Offset')
                        : xhr.response),
            onerror = action.onerror || ((res2) => null),
            requestTransferId = (cb) => {
                let formData = new FormData()
                isObject(metadata) &&
                    formData.append(name2, JSON.stringify(metadata))
                let headers =
                        typeof action.headers == 'function'
                            ? action.headers(file2, metadata)
                            : {
                                  ...action.headers,
                                  'Upload-Length': file2.size,
                              },
                    requestParams = { ...action, headers },
                    request = sendRequest(
                        ondata(formData),
                        buildURL(apiUrl, action.url),
                        requestParams,
                    )
                ;(request.onload = (xhr) =>
                    cb(onload(xhr, requestParams.method))),
                    (request.onerror = (xhr) =>
                        error2(
                            createResponse(
                                'error',
                                xhr.status,
                                onerror(xhr.response) || xhr.statusText,
                                xhr.getAllResponseHeaders(),
                            ),
                        )),
                    (request.ontimeout = createTimeoutResponse(error2))
            },
            requestTransferOffset = (cb) => {
                let requestUrl = buildURL(
                        apiUrl,
                        chunkServer.url,
                        state2.serverId,
                    ),
                    requestParams = {
                        headers:
                            typeof action.headers == 'function'
                                ? action.headers(state2.serverId)
                                : { ...action.headers },
                        method: 'HEAD',
                    },
                    request = sendRequest(null, requestUrl, requestParams)
                ;(request.onload = (xhr) =>
                    cb(onload(xhr, requestParams.method))),
                    (request.onerror = (xhr) =>
                        error2(
                            createResponse(
                                'error',
                                xhr.status,
                                onerror(xhr.response) || xhr.statusText,
                                xhr.getAllResponseHeaders(),
                            ),
                        )),
                    (request.ontimeout = createTimeoutResponse(error2))
            },
            lastChunkIndex = Math.floor(file2.size / chunkSize)
        for (let i = 0; i <= lastChunkIndex; i++) {
            let offset = i * chunkSize,
                data3 = file2.slice(
                    offset,
                    offset + chunkSize,
                    'application/offset+octet-stream',
                )
            chunks[i] = {
                index: i,
                size: data3.size,
                offset,
                data: data3,
                file: file2,
                progress: 0,
                retries: [...chunkRetryDelays],
                status: ChunkStatus.QUEUED,
                error: null,
                request: null,
                timeout: null,
            }
        }
        let completeProcessingChunks = () => load(state2.serverId),
            canProcessChunk = (chunk) =>
                chunk.status === ChunkStatus.QUEUED ||
                chunk.status === ChunkStatus.ERROR,
            processChunk = (chunk) => {
                if (state2.aborted) return
                if (((chunk = chunk || chunks.find(canProcessChunk)), !chunk)) {
                    chunks.every(
                        (chunk2) => chunk2.status === ChunkStatus.COMPLETE,
                    ) && completeProcessingChunks()
                    return
                }
                ;(chunk.status = ChunkStatus.PROCESSING),
                    (chunk.progress = null)
                let ondata2 = chunkServer.ondata || ((fd) => fd),
                    onerror2 = chunkServer.onerror || ((res2) => null),
                    requestUrl = buildURL(
                        apiUrl,
                        chunkServer.url,
                        state2.serverId,
                    ),
                    headers =
                        typeof chunkServer.headers == 'function'
                            ? chunkServer.headers(chunk)
                            : {
                                  ...chunkServer.headers,
                                  'Content-Type':
                                      'application/offset+octet-stream',
                                  'Upload-Offset': chunk.offset,
                                  'Upload-Length': file2.size,
                                  'Upload-Name': file2.name,
                              },
                    request = (chunk.request = sendRequest(
                        ondata2(chunk.data),
                        requestUrl,
                        { ...chunkServer, headers },
                    ))
                ;(request.onload = () => {
                    ;(chunk.status = ChunkStatus.COMPLETE),
                        (chunk.request = null),
                        processChunks()
                }),
                    (request.onprogress = (lengthComputable, loaded, total) => {
                        ;(chunk.progress = lengthComputable ? loaded : null),
                            updateTotalProgress()
                    }),
                    (request.onerror = (xhr) => {
                        ;(chunk.status = ChunkStatus.ERROR),
                            (chunk.request = null),
                            (chunk.error =
                                onerror2(xhr.response) || xhr.statusText),
                            retryProcessChunk(chunk) ||
                                error2(
                                    createResponse(
                                        'error',
                                        xhr.status,
                                        onerror2(xhr.response) ||
                                            xhr.statusText,
                                        xhr.getAllResponseHeaders(),
                                    ),
                                )
                    }),
                    (request.ontimeout = (xhr) => {
                        ;(chunk.status = ChunkStatus.ERROR),
                            (chunk.request = null),
                            retryProcessChunk(chunk) ||
                                createTimeoutResponse(error2)(xhr)
                    }),
                    (request.onabort = () => {
                        ;(chunk.status = ChunkStatus.QUEUED),
                            (chunk.request = null),
                            abort()
                    })
            },
            retryProcessChunk = (chunk) =>
                chunk.retries.length === 0
                    ? !1
                    : ((chunk.status = ChunkStatus.WAITING),
                      clearTimeout(chunk.timeout),
                      (chunk.timeout = setTimeout(() => {
                          processChunk(chunk)
                      }, chunk.retries.shift())),
                      !0),
            updateTotalProgress = () => {
                let totalBytesTransfered = chunks.reduce(
                    (p, chunk) =>
                        p === null || chunk.progress === null
                            ? null
                            : p + chunk.progress,
                    0,
                )
                if (totalBytesTransfered === null) return progress(!1, 0, 0)
                let totalSize = chunks.reduce(
                    (total, chunk) => total + chunk.size,
                    0,
                )
                progress(!0, totalBytesTransfered, totalSize)
            },
            processChunks = () => {
                chunks.filter(
                    (chunk) => chunk.status === ChunkStatus.PROCESSING,
                ).length >= 1 || processChunk()
            },
            abortChunks = () => {
                chunks.forEach((chunk) => {
                    clearTimeout(chunk.timeout),
                        chunk.request && chunk.request.abort()
                })
            }
        return (
            state2.serverId
                ? requestTransferOffset((offset) => {
                      state2.aborted ||
                          (chunks
                              .filter((chunk) => chunk.offset < offset)
                              .forEach((chunk) => {
                                  ;(chunk.status = ChunkStatus.COMPLETE),
                                      (chunk.progress = chunk.size)
                              }),
                          processChunks())
                  })
                : requestTransferId((serverId) => {
                      state2.aborted ||
                          (transfer(serverId),
                          (state2.serverId = serverId),
                          processChunks())
                  }),
            {
                abort: () => {
                    ;(state2.aborted = !0), abortChunks()
                },
            }
        )
    },
    createFileProcessorFunction =
        (apiUrl, action, name2, options) =>
        (file2, metadata, load, error2, progress, abort, transfer) => {
            if (!file2) return
            let canChunkUpload = options.chunkUploads,
                shouldChunkUpload =
                    canChunkUpload && file2.size > options.chunkSize,
                willChunkUpload =
                    canChunkUpload && (shouldChunkUpload || options.chunkForce)
            if (file2 instanceof Blob && willChunkUpload)
                return processFileChunked(
                    apiUrl,
                    action,
                    name2,
                    file2,
                    metadata,
                    load,
                    error2,
                    progress,
                    abort,
                    transfer,
                    options,
                )
            let ondata = action.ondata || ((fd) => fd),
                onload = action.onload || ((res2) => res2),
                onerror = action.onerror || ((res2) => null),
                headers =
                    typeof action.headers == 'function'
                        ? action.headers(file2, metadata) || {}
                        : { ...action.headers },
                requestParams = { ...action, headers }
            var formData = new FormData()
            isObject(metadata) &&
                formData.append(name2, JSON.stringify(metadata)),
                (file2 instanceof Blob
                    ? [{ name: null, file: file2 }]
                    : file2
                ).forEach((item2) => {
                    formData.append(
                        name2,
                        item2.file,
                        item2.name === null
                            ? item2.file.name
                            : `${item2.name}${item2.file.name}`,
                    )
                })
            let request = sendRequest(
                ondata(formData),
                buildURL(apiUrl, action.url),
                requestParams,
            )
            return (
                (request.onload = (xhr) => {
                    load(
                        createResponse(
                            'load',
                            xhr.status,
                            onload(xhr.response),
                            xhr.getAllResponseHeaders(),
                        ),
                    )
                }),
                (request.onerror = (xhr) => {
                    error2(
                        createResponse(
                            'error',
                            xhr.status,
                            onerror(xhr.response) || xhr.statusText,
                            xhr.getAllResponseHeaders(),
                        ),
                    )
                }),
                (request.ontimeout = createTimeoutResponse(error2)),
                (request.onprogress = progress),
                (request.onabort = abort),
                request
            )
        },
    createProcessorFunction = (apiUrl = '', action, name2, options) =>
        typeof action == 'function'
            ? (...params) => action(name2, ...params, options)
            : !action || !isString(action.url)
            ? null
            : createFileProcessorFunction(apiUrl, action, name2, options),
    createRevertFunction = (apiUrl = '', action) => {
        if (typeof action == 'function') return action
        if (!action || !isString(action.url))
            return (uniqueFileId, load) => load()
        let onload = action.onload || ((res2) => res2),
            onerror = action.onerror || ((res2) => null)
        return (uniqueFileId, load, error2) => {
            let request = sendRequest(uniqueFileId, apiUrl + action.url, action)
            return (
                (request.onload = (xhr) => {
                    load(
                        createResponse(
                            'load',
                            xhr.status,
                            onload(xhr.response),
                            xhr.getAllResponseHeaders(),
                        ),
                    )
                }),
                (request.onerror = (xhr) => {
                    error2(
                        createResponse(
                            'error',
                            xhr.status,
                            onerror(xhr.response) || xhr.statusText,
                            xhr.getAllResponseHeaders(),
                        ),
                    )
                }),
                (request.ontimeout = createTimeoutResponse(error2)),
                request
            )
        }
    },
    getRandomNumber = (min = 0, max = 1) => min + Math.random() * (max - min),
    createPerceivedPerformanceUpdater = (
        cb,
        duration = 1e3,
        offset = 0,
        tickMin = 25,
        tickMax = 250,
    ) => {
        let timeout = null,
            start = Date.now(),
            tick = () => {
                let runtime = Date.now() - start,
                    delay = getRandomNumber(tickMin, tickMax)
                runtime + delay > duration &&
                    (delay = runtime + delay - duration)
                let progress = runtime / duration
                if (progress >= 1 || document.hidden) {
                    cb(1)
                    return
                }
                cb(progress), (timeout = setTimeout(tick, delay))
            }
        return (
            duration > 0 && tick(),
            {
                clear: () => {
                    clearTimeout(timeout)
                },
            }
        )
    },
    createFileProcessor = (processFn, options) => {
        let state2 = {
                complete: !1,
                perceivedProgress: 0,
                perceivedPerformanceUpdater: null,
                progress: null,
                timestamp: null,
                perceivedDuration: 0,
                duration: 0,
                request: null,
                response: null,
            },
            { allowMinimumUploadDuration } = options,
            process = (file2, metadata) => {
                let progressFn = () => {
                        state2.duration === 0 ||
                            state2.progress === null ||
                            api.fire('progress', api.getProgress())
                    },
                    completeFn = () => {
                        ;(state2.complete = !0),
                            api.fire('load-perceived', state2.response.body)
                    }
                api.fire('start'),
                    (state2.timestamp = Date.now()),
                    (state2.perceivedPerformanceUpdater =
                        createPerceivedPerformanceUpdater(
                            (progress) => {
                                ;(state2.perceivedProgress = progress),
                                    (state2.perceivedDuration =
                                        Date.now() - state2.timestamp),
                                    progressFn(),
                                    state2.response &&
                                        state2.perceivedProgress === 1 &&
                                        !state2.complete &&
                                        completeFn()
                            },
                            allowMinimumUploadDuration
                                ? getRandomNumber(750, 1500)
                                : 0,
                        )),
                    (state2.request = processFn(
                        file2,
                        metadata,
                        (response) => {
                            ;(state2.response = isObject(response)
                                ? response
                                : {
                                      type: 'load',
                                      code: 200,
                                      body: `${response}`,
                                      headers: {},
                                  }),
                                (state2.duration =
                                    Date.now() - state2.timestamp),
                                (state2.progress = 1),
                                api.fire('load', state2.response.body),
                                (!allowMinimumUploadDuration ||
                                    (allowMinimumUploadDuration &&
                                        state2.perceivedProgress === 1)) &&
                                    completeFn()
                        },
                        (error2) => {
                            state2.perceivedPerformanceUpdater.clear(),
                                api.fire(
                                    'error',
                                    isObject(error2)
                                        ? error2
                                        : {
                                              type: 'error',
                                              code: 0,
                                              body: `${error2}`,
                                          },
                                )
                        },
                        (computable, current, total) => {
                            ;(state2.duration = Date.now() - state2.timestamp),
                                (state2.progress = computable
                                    ? current / total
                                    : null),
                                progressFn()
                        },
                        () => {
                            state2.perceivedPerformanceUpdater.clear(),
                                api.fire(
                                    'abort',
                                    state2.response
                                        ? state2.response.body
                                        : null,
                                )
                        },
                        (transferId) => {
                            api.fire('transfer', transferId)
                        },
                    ))
            },
            abort = () => {
                !state2.request ||
                    (state2.perceivedPerformanceUpdater.clear(),
                    state2.request.abort && state2.request.abort(),
                    (state2.complete = !0))
            },
            reset = () => {
                abort(),
                    (state2.complete = !1),
                    (state2.perceivedProgress = 0),
                    (state2.progress = 0),
                    (state2.timestamp = null),
                    (state2.perceivedDuration = 0),
                    (state2.duration = 0),
                    (state2.request = null),
                    (state2.response = null)
            },
            getProgress = allowMinimumUploadDuration
                ? () =>
                      state2.progress
                          ? Math.min(state2.progress, state2.perceivedProgress)
                          : null
                : () => state2.progress || null,
            getDuration = allowMinimumUploadDuration
                ? () => Math.min(state2.duration, state2.perceivedDuration)
                : () => state2.duration,
            api = { ...on(), process, abort, getProgress, getDuration, reset }
        return api
    },
    getFilenameWithoutExtension = (name2) =>
        name2.substring(0, name2.lastIndexOf('.')) || name2,
    createFileStub = (source) => {
        let data3 = [source.name, source.size, source.type]
        return (
            source instanceof Blob || isBase64DataURI(source)
                ? (data3[0] = source.name || getDateString())
                : isBase64DataURI(source)
                ? ((data3[1] = source.length),
                  (data3[2] = getMimeTypeFromBase64DataURI(source)))
                : isString(source) &&
                  ((data3[0] = getFilenameFromURL(source)),
                  (data3[1] = 0),
                  (data3[2] = 'application/octet-stream')),
            { name: data3[0], size: data3[1], type: data3[2] }
        )
    },
    isFile = (value) =>
        !!(value instanceof File || (value instanceof Blob && value.name)),
    deepCloneObject = (src) => {
        if (!isObject(src)) return src
        let target = isArray(src) ? [] : {}
        for (let key in src) {
            if (!src.hasOwnProperty(key)) continue
            let v = src[key]
            target[key] = v && isObject(v) ? deepCloneObject(v) : v
        }
        return target
    },
    createItem = (origin = null, serverFileReference = null, file2 = null) => {
        let id = getUniqueId(),
            state2 = {
                archived: !1,
                frozen: !1,
                released: !1,
                source: null,
                file: file2,
                serverFileReference,
                transferId: null,
                processingAborted: !1,
                status: serverFileReference
                    ? ItemStatus.PROCESSING_COMPLETE
                    : ItemStatus.INIT,
                activeLoader: null,
                activeProcessor: null,
            },
            abortProcessingRequestComplete = null,
            metadata = {},
            setStatus = (status) => (state2.status = status),
            fire = (event, ...params) => {
                state2.released || state2.frozen || api.fire(event, ...params)
            },
            getFileExtension = () => getExtensionFromFilename(state2.file.name),
            getFileType = () => state2.file.type,
            getFileSize = () => state2.file.size,
            getFile = () => state2.file,
            load = (source, loader, onload) => {
                if (
                    ((state2.source = source),
                    api.fireSync('init'),
                    state2.file)
                ) {
                    api.fireSync('load-skip')
                    return
                }
                ;(state2.file = createFileStub(source)),
                    loader.on('init', () => {
                        fire('load-init')
                    }),
                    loader.on('meta', (meta) => {
                        ;(state2.file.size = meta.size),
                            (state2.file.filename = meta.filename),
                            meta.source &&
                                ((origin = FileOrigin.LIMBO),
                                (state2.serverFileReference = meta.source),
                                (state2.status =
                                    ItemStatus.PROCESSING_COMPLETE)),
                            fire('load-meta')
                    }),
                    loader.on('progress', (progress) => {
                        setStatus(ItemStatus.LOADING),
                            fire('load-progress', progress)
                    }),
                    loader.on('error', (error2) => {
                        setStatus(ItemStatus.LOAD_ERROR),
                            fire('load-request-error', error2)
                    }),
                    loader.on('abort', () => {
                        setStatus(ItemStatus.INIT), fire('load-abort')
                    }),
                    loader.on('load', (file3) => {
                        state2.activeLoader = null
                        let success = (result) => {
                                ;(state2.file = isFile(result)
                                    ? result
                                    : state2.file),
                                    origin === FileOrigin.LIMBO &&
                                    state2.serverFileReference
                                        ? setStatus(
                                              ItemStatus.PROCESSING_COMPLETE,
                                          )
                                        : setStatus(ItemStatus.IDLE),
                                    fire('load')
                            },
                            error2 = (result) => {
                                ;(state2.file = file3),
                                    fire('load-meta'),
                                    setStatus(ItemStatus.LOAD_ERROR),
                                    fire('load-file-error', result)
                            }
                        if (state2.serverFileReference) {
                            success(file3)
                            return
                        }
                        onload(file3, success, error2)
                    }),
                    loader.setSource(source),
                    (state2.activeLoader = loader),
                    loader.load()
            },
            retryLoad = () => {
                !state2.activeLoader || state2.activeLoader.load()
            },
            abortLoad = () => {
                if (state2.activeLoader) {
                    state2.activeLoader.abort()
                    return
                }
                setStatus(ItemStatus.INIT), fire('load-abort')
            },
            process = (processor, onprocess) => {
                if (state2.processingAborted) {
                    state2.processingAborted = !1
                    return
                }
                if (
                    (setStatus(ItemStatus.PROCESSING),
                    (abortProcessingRequestComplete = null),
                    !(state2.file instanceof Blob))
                ) {
                    api.on('load', () => {
                        process(processor, onprocess)
                    })
                    return
                }
                processor.on('load', (serverFileReference2) => {
                    ;(state2.transferId = null),
                        (state2.serverFileReference = serverFileReference2)
                }),
                    processor.on('transfer', (transferId) => {
                        state2.transferId = transferId
                    }),
                    processor.on('load-perceived', (serverFileReference2) => {
                        ;(state2.activeProcessor = null),
                            (state2.transferId = null),
                            (state2.serverFileReference = serverFileReference2),
                            setStatus(ItemStatus.PROCESSING_COMPLETE),
                            fire('process-complete', serverFileReference2)
                    }),
                    processor.on('start', () => {
                        fire('process-start')
                    }),
                    processor.on('error', (error3) => {
                        ;(state2.activeProcessor = null),
                            setStatus(ItemStatus.PROCESSING_ERROR),
                            fire('process-error', error3)
                    }),
                    processor.on('abort', (serverFileReference2) => {
                        ;(state2.activeProcessor = null),
                            (state2.serverFileReference = serverFileReference2),
                            setStatus(ItemStatus.IDLE),
                            fire('process-abort'),
                            abortProcessingRequestComplete &&
                                abortProcessingRequestComplete()
                    }),
                    processor.on('progress', (progress) => {
                        fire('process-progress', progress)
                    })
                let success = (file3) => {
                        state2.archived ||
                            processor.process(file3, { ...metadata })
                    },
                    error2 = console.error
                onprocess(state2.file, success, error2),
                    (state2.activeProcessor = processor)
            },
            requestProcessing = () => {
                ;(state2.processingAborted = !1),
                    setStatus(ItemStatus.PROCESSING_QUEUED)
            },
            abortProcessing = () =>
                new Promise((resolve) => {
                    if (!state2.activeProcessor) {
                        ;(state2.processingAborted = !0),
                            setStatus(ItemStatus.IDLE),
                            fire('process-abort'),
                            resolve()
                        return
                    }
                    ;(abortProcessingRequestComplete = () => {
                        resolve()
                    }),
                        state2.activeProcessor.abort()
                }),
            revert = (revertFileUpload, forceRevert) =>
                new Promise((resolve, reject) => {
                    let serverTransferId =
                        state2.serverFileReference !== null
                            ? state2.serverFileReference
                            : state2.transferId
                    if (serverTransferId === null) {
                        resolve()
                        return
                    }
                    revertFileUpload(
                        serverTransferId,
                        () => {
                            ;(state2.serverFileReference = null),
                                (state2.transferId = null),
                                resolve()
                        },
                        (error2) => {
                            if (!forceRevert) {
                                resolve()
                                return
                            }
                            setStatus(ItemStatus.PROCESSING_REVERT_ERROR),
                                fire('process-revert-error'),
                                reject(error2)
                        },
                    ),
                        setStatus(ItemStatus.IDLE),
                        fire('process-revert')
                }),
            setMetadata = (key, value, silent) => {
                let keys = key.split('.'),
                    root2 = keys[0],
                    last = keys.pop(),
                    data3 = metadata
                keys.forEach((key2) => (data3 = data3[key2])),
                    JSON.stringify(data3[last]) !== JSON.stringify(value) &&
                        ((data3[last] = value),
                        fire('metadata-update', {
                            key: root2,
                            value: metadata[root2],
                            silent,
                        }))
            },
            api = {
                id: { get: () => id },
                origin: { get: () => origin, set: (value) => (origin = value) },
                serverId: { get: () => state2.serverFileReference },
                transferId: { get: () => state2.transferId },
                status: { get: () => state2.status },
                filename: { get: () => state2.file.name },
                filenameWithoutExtension: {
                    get: () => getFilenameWithoutExtension(state2.file.name),
                },
                fileExtension: { get: getFileExtension },
                fileType: { get: getFileType },
                fileSize: { get: getFileSize },
                file: { get: getFile },
                relativePath: { get: () => state2.file._relativePath },
                source: { get: () => state2.source },
                getMetadata: (key) =>
                    deepCloneObject(key ? metadata[key] : metadata),
                setMetadata: (key, value, silent) => {
                    if (isObject(key)) {
                        let data3 = key
                        return (
                            Object.keys(data3).forEach((key2) => {
                                setMetadata(key2, data3[key2], value)
                            }),
                            key
                        )
                    }
                    return setMetadata(key, value, silent), value
                },
                extend: (name2, handler) => (itemAPI[name2] = handler),
                abortLoad,
                retryLoad,
                requestProcessing,
                abortProcessing,
                load,
                process,
                revert,
                ...on(),
                freeze: () => (state2.frozen = !0),
                release: () => (state2.released = !0),
                released: { get: () => state2.released },
                archive: () => (state2.archived = !0),
                archived: { get: () => state2.archived },
            },
            itemAPI = createObject(api)
        return itemAPI
    },
    getItemIndexByQuery = (items, query) =>
        isEmpty(query)
            ? 0
            : isString(query)
            ? items.findIndex((item2) => item2.id === query)
            : -1,
    getItemById = (items, itemId) => {
        let index = getItemIndexByQuery(items, itemId)
        if (!(index < 0)) return items[index] || null
    },
    fetchBlob = (url, load, error2, progress, abort, headers) => {
        let request = sendRequest(null, url, {
            method: 'GET',
            responseType: 'blob',
        })
        return (
            (request.onload = (xhr) => {
                let headers2 = xhr.getAllResponseHeaders(),
                    filename =
                        getFileInfoFromHeaders(headers2).name ||
                        getFilenameFromURL(url)
                load(
                    createResponse(
                        'load',
                        xhr.status,
                        getFileFromBlob(xhr.response, filename),
                        headers2,
                    ),
                )
            }),
            (request.onerror = (xhr) => {
                error2(
                    createResponse(
                        'error',
                        xhr.status,
                        xhr.statusText,
                        xhr.getAllResponseHeaders(),
                    ),
                )
            }),
            (request.onheaders = (xhr) => {
                headers(
                    createResponse(
                        'headers',
                        xhr.status,
                        null,
                        xhr.getAllResponseHeaders(),
                    ),
                )
            }),
            (request.ontimeout = createTimeoutResponse(error2)),
            (request.onprogress = progress),
            (request.onabort = abort),
            request
        )
    },
    getDomainFromURL = (url) => (
        url.indexOf('//') === 0 && (url = location.protocol + url),
        url
            .toLowerCase()
            .replace('blob:', '')
            .replace(/([a-z])?:\/\//, '$1')
            .split('/')[0]
    ),
    isExternalURL = (url) =>
        (url.indexOf(':') > -1 || url.indexOf('//') > -1) &&
        getDomainFromURL(location.href) !== getDomainFromURL(url),
    dynamicLabel =
        (label) =>
        (...params) =>
            isFunction(label) ? label(...params) : label,
    isMockItem = (item2) => !isFile(item2.file),
    listUpdated = (dispatch, state2) => {
        clearTimeout(state2.listUpdateTimeout),
            (state2.listUpdateTimeout = setTimeout(() => {
                dispatch('DID_UPDATE_ITEMS', {
                    items: getActiveItems(state2.items),
                })
            }, 0))
    },
    optionalPromise = (fn2, ...params) =>
        new Promise((resolve) => {
            if (!fn2) return resolve(!0)
            let result = fn2(...params)
            if (result == null) return resolve(!0)
            if (typeof result == 'boolean') return resolve(result)
            typeof result.then == 'function' && result.then(resolve)
        }),
    sortItems = (state2, compare) => {
        state2.items.sort((a, b) => compare(createItemAPI(a), createItemAPI(b)))
    },
    getItemByQueryFromState =
        (state2, itemHandler) =>
        ({
            query,
            success = () => {},
            failure = () => {},
            ...options
        } = {}) => {
            let item2 = getItemByQuery(state2.items, query)
            if (!item2) {
                failure({
                    error: createResponse('error', 0, 'Item not found'),
                    file: null,
                })
                return
            }
            itemHandler(item2, success, failure, options || {})
        },
    actions = (dispatch, query, state2) => ({
        ABORT_ALL: () => {
            getActiveItems(state2.items).forEach((item2) => {
                item2.freeze(), item2.abortLoad(), item2.abortProcessing()
            })
        },
        DID_SET_FILES: ({ value = [] }) => {
            let files = value.map((file2) => ({
                    source: file2.source ? file2.source : file2,
                    options: file2.options,
                })),
                activeItems = getActiveItems(state2.items)
            activeItems.forEach((item2) => {
                files.find(
                    (file2) =>
                        file2.source === item2.source ||
                        file2.source === item2.file,
                ) || dispatch('REMOVE_ITEM', { query: item2, remove: !1 })
            }),
                (activeItems = getActiveItems(state2.items)),
                files.forEach((file2, index) => {
                    activeItems.find(
                        (item2) =>
                            item2.source === file2.source ||
                            item2.file === file2.source,
                    ) ||
                        dispatch('ADD_ITEM', {
                            ...file2,
                            interactionMethod: InteractionMethod.NONE,
                            index,
                        })
                })
        },
        DID_UPDATE_ITEM_METADATA: ({ id, action, change }) => {
            change.silent ||
                (clearTimeout(state2.itemUpdateTimeout),
                (state2.itemUpdateTimeout = setTimeout(() => {
                    let item2 = getItemById(state2.items, id)
                    if (!query('IS_ASYNC')) {
                        applyFilterChain('SHOULD_PREPARE_OUTPUT', !1, {
                            item: item2,
                            query,
                            action,
                            change,
                        }).then((shouldPrepareOutput) => {
                            let beforePrepareFile = query(
                                'GET_BEFORE_PREPARE_FILE',
                            )
                            beforePrepareFile &&
                                (shouldPrepareOutput = beforePrepareFile(
                                    item2,
                                    shouldPrepareOutput,
                                )),
                                !!shouldPrepareOutput &&
                                    dispatch(
                                        'REQUEST_PREPARE_OUTPUT',
                                        {
                                            query: id,
                                            item: item2,
                                            success: (file2) => {
                                                dispatch('DID_PREPARE_OUTPUT', {
                                                    id,
                                                    file: file2,
                                                })
                                            },
                                        },
                                        !0,
                                    )
                        })
                        return
                    }
                    item2.origin === FileOrigin.LOCAL &&
                        dispatch('DID_LOAD_ITEM', {
                            id: item2.id,
                            error: null,
                            serverFileReference: item2.source,
                        })
                    let upload = () => {
                            setTimeout(() => {
                                dispatch('REQUEST_ITEM_PROCESSING', {
                                    query: id,
                                })
                            }, 32)
                        },
                        revert = (doUpload) => {
                            item2
                                .revert(
                                    createRevertFunction(
                                        state2.options.server.url,
                                        state2.options.server.revert,
                                    ),
                                    query('GET_FORCE_REVERT'),
                                )
                                .then(doUpload ? upload : () => {})
                                .catch(() => {})
                        },
                        abort = (doUpload) => {
                            item2
                                .abortProcessing()
                                .then(doUpload ? upload : () => {})
                        }
                    if (item2.status === ItemStatus.PROCESSING_COMPLETE)
                        return revert(state2.options.instantUpload)
                    if (item2.status === ItemStatus.PROCESSING)
                        return abort(state2.options.instantUpload)
                    state2.options.instantUpload && upload()
                }, 0)))
        },
        MOVE_ITEM: ({ query: query2, index }) => {
            let item2 = getItemByQuery(state2.items, query2)
            if (!item2) return
            let currentIndex = state2.items.indexOf(item2)
            ;(index = limit(index, 0, state2.items.length - 1)),
                currentIndex !== index &&
                    state2.items.splice(
                        index,
                        0,
                        state2.items.splice(currentIndex, 1)[0],
                    )
        },
        SORT: ({ compare }) => {
            sortItems(state2, compare),
                dispatch('DID_SORT_ITEMS', { items: query('GET_ACTIVE_ITEMS') })
        },
        ADD_ITEMS: ({
            items,
            index,
            interactionMethod,
            success = () => {},
            failure = () => {},
        }) => {
            let currentIndex = index
            if (index === -1 || typeof index == 'undefined') {
                let insertLocation = query('GET_ITEM_INSERT_LOCATION'),
                    totalItems = query('GET_TOTAL_ITEMS')
                currentIndex = insertLocation === 'before' ? 0 : totalItems
            }
            let ignoredFiles = query('GET_IGNORED_FILES'),
                isValidFile = (source) =>
                    isFile(source)
                        ? !ignoredFiles.includes(source.name.toLowerCase())
                        : !isEmpty(source),
                promises = items.filter(isValidFile).map(
                    (source) =>
                        new Promise((resolve, reject) => {
                            dispatch('ADD_ITEM', {
                                interactionMethod,
                                source: source.source || source,
                                success: resolve,
                                failure: reject,
                                index: currentIndex++,
                                options: source.options || {},
                            })
                        }),
                )
            Promise.all(promises).then(success).catch(failure)
        },
        ADD_ITEM: ({
            source,
            index = -1,
            interactionMethod,
            success = () => {},
            failure = () => {},
            options = {},
        }) => {
            if (isEmpty(source)) {
                failure({
                    error: createResponse('error', 0, 'No source'),
                    file: null,
                })
                return
            }
            if (
                isFile(source) &&
                state2.options.ignoredFiles.includes(source.name.toLowerCase())
            )
                return
            if (!hasRoomForItem(state2)) {
                if (
                    state2.options.allowMultiple ||
                    (!state2.options.allowMultiple &&
                        !state2.options.allowReplace)
                ) {
                    let error2 = createResponse('warning', 0, 'Max files')
                    dispatch('DID_THROW_MAX_FILES', { source, error: error2 }),
                        failure({ error: error2, file: null })
                    return
                }
                let item3 = getActiveItems(state2.items)[0]
                if (
                    item3.status === ItemStatus.PROCESSING_COMPLETE ||
                    item3.status === ItemStatus.PROCESSING_REVERT_ERROR
                ) {
                    let forceRevert = query('GET_FORCE_REVERT')
                    if (
                        (item3
                            .revert(
                                createRevertFunction(
                                    state2.options.server.url,
                                    state2.options.server.revert,
                                ),
                                forceRevert,
                            )
                            .then(() => {
                                !forceRevert ||
                                    dispatch('ADD_ITEM', {
                                        source,
                                        index,
                                        interactionMethod,
                                        success,
                                        failure,
                                        options,
                                    })
                            })
                            .catch(() => {}),
                        forceRevert)
                    )
                        return
                }
                dispatch('REMOVE_ITEM', { query: item3.id })
            }
            let origin =
                    options.type === 'local'
                        ? FileOrigin.LOCAL
                        : options.type === 'limbo'
                        ? FileOrigin.LIMBO
                        : FileOrigin.INPUT,
                item2 = createItem(
                    origin,
                    origin === FileOrigin.INPUT ? null : source,
                    options.file,
                )
            Object.keys(options.metadata || {}).forEach((key) => {
                item2.setMetadata(key, options.metadata[key])
            }),
                applyFilters('DID_CREATE_ITEM', item2, { query, dispatch })
            let itemInsertLocation = query('GET_ITEM_INSERT_LOCATION')
            state2.options.itemInsertLocationFreedom ||
                (index =
                    itemInsertLocation === 'before' ? -1 : state2.items.length),
                insertItem(state2.items, item2, index),
                isFunction(itemInsertLocation) &&
                    source &&
                    sortItems(state2, itemInsertLocation)
            let id = item2.id
            item2.on('init', () => {
                dispatch('DID_INIT_ITEM', { id })
            }),
                item2.on('load-init', () => {
                    dispatch('DID_START_ITEM_LOAD', { id })
                }),
                item2.on('load-meta', () => {
                    dispatch('DID_UPDATE_ITEM_META', { id })
                }),
                item2.on('load-progress', (progress) => {
                    dispatch('DID_UPDATE_ITEM_LOAD_PROGRESS', { id, progress })
                }),
                item2.on('load-request-error', (error2) => {
                    let mainStatus = dynamicLabel(
                        state2.options.labelFileLoadError,
                    )(error2)
                    if (error2.code >= 400 && error2.code < 500) {
                        dispatch('DID_THROW_ITEM_INVALID', {
                            id,
                            error: error2,
                            status: {
                                main: mainStatus,
                                sub: `${error2.code} (${error2.body})`,
                            },
                        }),
                            failure({
                                error: error2,
                                file: createItemAPI(item2),
                            })
                        return
                    }
                    dispatch('DID_THROW_ITEM_LOAD_ERROR', {
                        id,
                        error: error2,
                        status: {
                            main: mainStatus,
                            sub: state2.options.labelTapToRetry,
                        },
                    })
                }),
                item2.on('load-file-error', (error2) => {
                    dispatch('DID_THROW_ITEM_INVALID', {
                        id,
                        error: error2.status,
                        status: error2.status,
                    }),
                        failure({
                            error: error2.status,
                            file: createItemAPI(item2),
                        })
                }),
                item2.on('load-abort', () => {
                    dispatch('REMOVE_ITEM', { query: id })
                }),
                item2.on('load-skip', () => {
                    dispatch('COMPLETE_LOAD_ITEM', {
                        query: id,
                        item: item2,
                        data: { source, success },
                    })
                }),
                item2.on('load', () => {
                    let handleAdd = (shouldAdd) => {
                        if (!shouldAdd) {
                            dispatch('REMOVE_ITEM', { query: id })
                            return
                        }
                        item2.on('metadata-update', (change) => {
                            dispatch('DID_UPDATE_ITEM_METADATA', { id, change })
                        }),
                            applyFilterChain('SHOULD_PREPARE_OUTPUT', !1, {
                                item: item2,
                                query,
                            }).then((shouldPrepareOutput) => {
                                let beforePrepareFile = query(
                                    'GET_BEFORE_PREPARE_FILE',
                                )
                                beforePrepareFile &&
                                    (shouldPrepareOutput = beforePrepareFile(
                                        item2,
                                        shouldPrepareOutput,
                                    ))
                                let loadComplete = () => {
                                    dispatch('COMPLETE_LOAD_ITEM', {
                                        query: id,
                                        item: item2,
                                        data: { source, success },
                                    }),
                                        listUpdated(dispatch, state2)
                                }
                                if (shouldPrepareOutput) {
                                    dispatch(
                                        'REQUEST_PREPARE_OUTPUT',
                                        {
                                            query: id,
                                            item: item2,
                                            success: (file2) => {
                                                dispatch('DID_PREPARE_OUTPUT', {
                                                    id,
                                                    file: file2,
                                                }),
                                                    loadComplete()
                                            },
                                        },
                                        !0,
                                    )
                                    return
                                }
                                loadComplete()
                            })
                    }
                    applyFilterChain('DID_LOAD_ITEM', item2, {
                        query,
                        dispatch,
                    })
                        .then(() => {
                            optionalPromise(
                                query('GET_BEFORE_ADD_FILE'),
                                createItemAPI(item2),
                            ).then(handleAdd)
                        })
                        .catch((e) => {
                            if (!e || !e.error || !e.status)
                                return handleAdd(!1)
                            dispatch('DID_THROW_ITEM_INVALID', {
                                id,
                                error: e.error,
                                status: e.status,
                            })
                        })
                }),
                item2.on('process-start', () => {
                    dispatch('DID_START_ITEM_PROCESSING', { id })
                }),
                item2.on('process-progress', (progress) => {
                    dispatch('DID_UPDATE_ITEM_PROCESS_PROGRESS', {
                        id,
                        progress,
                    })
                }),
                item2.on('process-error', (error2) => {
                    dispatch('DID_THROW_ITEM_PROCESSING_ERROR', {
                        id,
                        error: error2,
                        status: {
                            main: dynamicLabel(
                                state2.options.labelFileProcessingError,
                            )(error2),
                            sub: state2.options.labelTapToRetry,
                        },
                    })
                }),
                item2.on('process-revert-error', (error2) => {
                    dispatch('DID_THROW_ITEM_PROCESSING_REVERT_ERROR', {
                        id,
                        error: error2,
                        status: {
                            main: dynamicLabel(
                                state2.options.labelFileProcessingRevertError,
                            )(error2),
                            sub: state2.options.labelTapToRetry,
                        },
                    })
                }),
                item2.on('process-complete', (serverFileReference) => {
                    dispatch('DID_COMPLETE_ITEM_PROCESSING', {
                        id,
                        error: null,
                        serverFileReference,
                    }),
                        dispatch('DID_DEFINE_VALUE', {
                            id,
                            value: serverFileReference,
                        })
                }),
                item2.on('process-abort', () => {
                    dispatch('DID_ABORT_ITEM_PROCESSING', { id })
                }),
                item2.on('process-revert', () => {
                    dispatch('DID_REVERT_ITEM_PROCESSING', { id }),
                        dispatch('DID_DEFINE_VALUE', { id, value: null })
                }),
                dispatch('DID_ADD_ITEM', { id, index, interactionMethod }),
                listUpdated(dispatch, state2)
            let {
                url,
                load,
                restore,
                fetch: fetch2,
            } = state2.options.server || {}
            item2.load(
                source,
                createFileLoader(
                    origin === FileOrigin.INPUT
                        ? isString(source) && isExternalURL(source) && fetch2
                            ? createFetchFunction(url, fetch2)
                            : fetchBlob
                        : origin === FileOrigin.LIMBO
                        ? createFetchFunction(url, restore)
                        : createFetchFunction(url, load),
                ),
                (file2, success2, error2) => {
                    applyFilterChain('LOAD_FILE', file2, { query })
                        .then(success2)
                        .catch(error2)
                },
            )
        },
        REQUEST_PREPARE_OUTPUT: ({
            item: item2,
            success,
            failure = () => {},
        }) => {
            let err = {
                error: createResponse('error', 0, 'Item not found'),
                file: null,
            }
            if (item2.archived) return failure(err)
            applyFilterChain('PREPARE_OUTPUT', item2.file, {
                query,
                item: item2,
            }).then((result) => {
                applyFilterChain('COMPLETE_PREPARE_OUTPUT', result, {
                    query,
                    item: item2,
                }).then((result2) => {
                    if (item2.archived) return failure(err)
                    success(result2)
                })
            })
        },
        COMPLETE_LOAD_ITEM: ({ item: item2, data: data3 }) => {
            let { success, source } = data3,
                itemInsertLocation = query('GET_ITEM_INSERT_LOCATION')
            if (
                (isFunction(itemInsertLocation) &&
                    source &&
                    sortItems(state2, itemInsertLocation),
                dispatch('DID_LOAD_ITEM', {
                    id: item2.id,
                    error: null,
                    serverFileReference:
                        item2.origin === FileOrigin.INPUT ? null : source,
                }),
                success(createItemAPI(item2)),
                item2.origin === FileOrigin.LOCAL)
            ) {
                dispatch('DID_LOAD_LOCAL_ITEM', { id: item2.id })
                return
            }
            if (item2.origin === FileOrigin.LIMBO) {
                dispatch('DID_COMPLETE_ITEM_PROCESSING', {
                    id: item2.id,
                    error: null,
                    serverFileReference: source,
                }),
                    dispatch('DID_DEFINE_VALUE', {
                        id: item2.id,
                        value: item2.serverId || source,
                    })
                return
            }
            query('IS_ASYNC') &&
                state2.options.instantUpload &&
                dispatch('REQUEST_ITEM_PROCESSING', { query: item2.id })
        },
        RETRY_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
            item2.retryLoad()
        }),
        REQUEST_ITEM_PREPARE: getItemByQueryFromState(
            state2,
            (item2, success, failure) => {
                dispatch(
                    'REQUEST_PREPARE_OUTPUT',
                    {
                        query: item2.id,
                        item: item2,
                        success: (file2) => {
                            dispatch('DID_PREPARE_OUTPUT', {
                                id: item2.id,
                                file: file2,
                            }),
                                success({ file: item2, output: file2 })
                        },
                        failure,
                    },
                    !0,
                )
            },
        ),
        REQUEST_ITEM_PROCESSING: getItemByQueryFromState(
            state2,
            (item2, success, failure) => {
                if (
                    !(
                        item2.status === ItemStatus.IDLE ||
                        item2.status === ItemStatus.PROCESSING_ERROR
                    )
                ) {
                    let processNow = () =>
                            dispatch('REQUEST_ITEM_PROCESSING', {
                                query: item2,
                                success,
                                failure,
                            }),
                        process = () =>
                            document.hidden
                                ? processNow()
                                : setTimeout(processNow, 32)
                    item2.status === ItemStatus.PROCESSING_COMPLETE ||
                    item2.status === ItemStatus.PROCESSING_REVERT_ERROR
                        ? item2
                              .revert(
                                  createRevertFunction(
                                      state2.options.server.url,
                                      state2.options.server.revert,
                                  ),
                                  query('GET_FORCE_REVERT'),
                              )
                              .then(process)
                              .catch(() => {})
                        : item2.status === ItemStatus.PROCESSING &&
                          item2.abortProcessing().then(process)
                    return
                }
                item2.status !== ItemStatus.PROCESSING_QUEUED &&
                    (item2.requestProcessing(),
                    dispatch('DID_REQUEST_ITEM_PROCESSING', { id: item2.id }),
                    dispatch(
                        'PROCESS_ITEM',
                        { query: item2, success, failure },
                        !0,
                    ))
            },
        ),
        PROCESS_ITEM: getItemByQueryFromState(
            state2,
            (item2, success, failure) => {
                let maxParallelUploads = query('GET_MAX_PARALLEL_UPLOADS')
                if (
                    query('GET_ITEMS_BY_STATUS', ItemStatus.PROCESSING)
                        .length === maxParallelUploads
                ) {
                    state2.processingQueue.push({
                        id: item2.id,
                        success,
                        failure,
                    })
                    return
                }
                if (item2.status === ItemStatus.PROCESSING) return
                let processNext = () => {
                    let queueEntry = state2.processingQueue.shift()
                    if (!queueEntry) return
                    let {
                            id,
                            success: success2,
                            failure: failure2,
                        } = queueEntry,
                        itemReference = getItemByQuery(state2.items, id)
                    if (!itemReference || itemReference.archived) {
                        processNext()
                        return
                    }
                    dispatch(
                        'PROCESS_ITEM',
                        { query: id, success: success2, failure: failure2 },
                        !0,
                    )
                }
                item2.onOnce('process-complete', () => {
                    success(createItemAPI(item2)), processNext()
                    let server = state2.options.server
                    if (
                        state2.options.instantUpload &&
                        item2.origin === FileOrigin.LOCAL &&
                        isFunction(server.remove)
                    ) {
                        let noop = () => {}
                        ;(item2.origin = FileOrigin.LIMBO),
                            state2.options.server.remove(
                                item2.source,
                                noop,
                                noop,
                            )
                    }
                    query('GET_ITEMS_BY_STATUS', ItemStatus.PROCESSING_COMPLETE)
                        .length === state2.items.length &&
                        dispatch('DID_COMPLETE_ITEM_PROCESSING_ALL')
                }),
                    item2.onOnce('process-error', (error2) => {
                        failure({ error: error2, file: createItemAPI(item2) }),
                            processNext()
                    })
                let options = state2.options
                item2.process(
                    createFileProcessor(
                        createProcessorFunction(
                            options.server.url,
                            options.server.process,
                            options.name,
                            {
                                chunkTransferId: item2.transferId,
                                chunkServer: options.server.patch,
                                chunkUploads: options.chunkUploads,
                                chunkForce: options.chunkForce,
                                chunkSize: options.chunkSize,
                                chunkRetryDelays: options.chunkRetryDelays,
                            },
                        ),
                        {
                            allowMinimumUploadDuration: query(
                                'GET_ALLOW_MINIMUM_UPLOAD_DURATION',
                            ),
                        },
                    ),
                    (file2, success2, error2) => {
                        applyFilterChain('PREPARE_OUTPUT', file2, {
                            query,
                            item: item2,
                        })
                            .then((file3) => {
                                dispatch('DID_PREPARE_OUTPUT', {
                                    id: item2.id,
                                    file: file3,
                                }),
                                    success2(file3)
                            })
                            .catch(error2)
                    },
                )
            },
        ),
        RETRY_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
            dispatch('REQUEST_ITEM_PROCESSING', { query: item2 })
        }),
        REQUEST_REMOVE_ITEM: getItemByQueryFromState(state2, (item2) => {
            optionalPromise(
                query('GET_BEFORE_REMOVE_FILE'),
                createItemAPI(item2),
            ).then((shouldRemove) => {
                !shouldRemove || dispatch('REMOVE_ITEM', { query: item2 })
            })
        }),
        RELEASE_ITEM: getItemByQueryFromState(state2, (item2) => {
            item2.release()
        }),
        REMOVE_ITEM: getItemByQueryFromState(
            state2,
            (item2, success, failure, options) => {
                let removeFromView = () => {
                        let id = item2.id
                        getItemById(state2.items, id).archive(),
                            dispatch('DID_REMOVE_ITEM', {
                                error: null,
                                id,
                                item: item2,
                            }),
                            listUpdated(dispatch, state2),
                            success(createItemAPI(item2))
                    },
                    server = state2.options.server
                item2.origin === FileOrigin.LOCAL &&
                server &&
                isFunction(server.remove) &&
                options.remove !== !1
                    ? (dispatch('DID_START_ITEM_REMOVE', { id: item2.id }),
                      server.remove(
                          item2.source,
                          () => removeFromView(),
                          (status) => {
                              dispatch('DID_THROW_ITEM_REMOVE_ERROR', {
                                  id: item2.id,
                                  error: createResponse(
                                      'error',
                                      0,
                                      status,
                                      null,
                                  ),
                                  status: {
                                      main: dynamicLabel(
                                          state2.options.labelFileRemoveError,
                                      )(status),
                                      sub: state2.options.labelTapToRetry,
                                  },
                              })
                          },
                      ))
                    : (((options.revert &&
                          item2.origin !== FileOrigin.LOCAL &&
                          item2.serverId !== null) ||
                          (state2.options.chunkUploads &&
                              item2.file.size > state2.options.chunkSize) ||
                          (state2.options.chunkUploads &&
                              state2.options.chunkForce)) &&
                          item2.revert(
                              createRevertFunction(
                                  state2.options.server.url,
                                  state2.options.server.revert,
                              ),
                              query('GET_FORCE_REVERT'),
                          ),
                      removeFromView())
            },
        ),
        ABORT_ITEM_LOAD: getItemByQueryFromState(state2, (item2) => {
            item2.abortLoad()
        }),
        ABORT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
            if (item2.serverId) {
                dispatch('REVERT_ITEM_PROCESSING', { id: item2.id })
                return
            }
            item2.abortProcessing().then(() => {
                state2.options.instantUpload &&
                    dispatch('REMOVE_ITEM', { query: item2.id })
            })
        }),
        REQUEST_REVERT_ITEM_PROCESSING: getItemByQueryFromState(
            state2,
            (item2) => {
                if (!state2.options.instantUpload) {
                    dispatch('REVERT_ITEM_PROCESSING', { query: item2 })
                    return
                }
                let handleRevert2 = (shouldRevert) => {
                        !shouldRevert ||
                            dispatch('REVERT_ITEM_PROCESSING', { query: item2 })
                    },
                    fn2 = query('GET_BEFORE_REMOVE_FILE')
                if (!fn2) return handleRevert2(!0)
                let requestRemoveResult = fn2(createItemAPI(item2))
                if (requestRemoveResult == null) return handleRevert2(!0)
                if (typeof requestRemoveResult == 'boolean')
                    return handleRevert2(requestRemoveResult)
                typeof requestRemoveResult.then == 'function' &&
                    requestRemoveResult.then(handleRevert2)
            },
        ),
        REVERT_ITEM_PROCESSING: getItemByQueryFromState(state2, (item2) => {
            item2
                .revert(
                    createRevertFunction(
                        state2.options.server.url,
                        state2.options.server.revert,
                    ),
                    query('GET_FORCE_REVERT'),
                )
                .then(() => {
                    ;(state2.options.instantUpload || isMockItem(item2)) &&
                        dispatch('REMOVE_ITEM', { query: item2.id })
                })
                .catch(() => {})
        }),
        SET_OPTIONS: ({ options }) => {
            let optionKeys = Object.keys(options),
                prioritizedOptionKeys = PrioritizedOptions.filter((key) =>
                    optionKeys.includes(key),
                )
            ;[
                ...prioritizedOptionKeys,
                ...Object.keys(options).filter(
                    (key) => !prioritizedOptionKeys.includes(key),
                ),
            ].forEach((key) => {
                dispatch(`SET_${fromCamels(key, '_').toUpperCase()}`, {
                    value: options[key],
                })
            })
        },
    }),
    PrioritizedOptions = ['server'],
    formatFilename = (name2) => name2,
    createElement$1 = (tagName) => document.createElement(tagName),
    text = (node, value) => {
        let textNode = node.childNodes[0]
        textNode
            ? value !== textNode.nodeValue && (textNode.nodeValue = value)
            : ((textNode = document.createTextNode(value)),
              node.appendChild(textNode))
    },
    polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        let angleInRadians = (((angleInDegrees % 360) - 90) * Math.PI) / 180
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        }
    },
    describeArc = (x, y, radius, startAngle, endAngle, arcSweep) => {
        let start = polarToCartesian(x, y, radius, endAngle),
            end = polarToCartesian(x, y, radius, startAngle)
        return [
            'M',
            start.x,
            start.y,
            'A',
            radius,
            radius,
            0,
            arcSweep,
            0,
            end.x,
            end.y,
        ].join(' ')
    },
    percentageArc = (x, y, radius, from, to) => {
        let arcSweep = 1
        return (
            to > from && to - from <= 0.5 && (arcSweep = 0),
            from > to && from - to >= 0.5 && (arcSweep = 0),
            describeArc(
                x,
                y,
                radius,
                Math.min(0.9999, from) * 360,
                Math.min(0.9999, to) * 360,
                arcSweep,
            )
        )
    },
    create = ({ root: root2, props }) => {
        ;(props.spin = !1), (props.progress = 0), (props.opacity = 0)
        let svg3 = createElement('svg')
        ;(root2.ref.path = createElement('path', {
            'stroke-width': 2,
            'stroke-linecap': 'round',
        })),
            svg3.appendChild(root2.ref.path),
            (root2.ref.svg = svg3),
            root2.appendChild(svg3)
    },
    write = ({ root: root2, props }) => {
        if (props.opacity === 0) return
        props.align && (root2.element.dataset.align = props.align)
        let ringStrokeWidth = parseInt(
                attr(root2.ref.path, 'stroke-width'),
                10,
            ),
            size = root2.rect.element.width * 0.5,
            ringFrom = 0,
            ringTo = 0
        props.spin
            ? ((ringFrom = 0), (ringTo = 0.5))
            : ((ringFrom = 0), (ringTo = props.progress))
        let coordinates = percentageArc(
            size,
            size,
            size - ringStrokeWidth,
            ringFrom,
            ringTo,
        )
        attr(root2.ref.path, 'd', coordinates),
            attr(
                root2.ref.path,
                'stroke-opacity',
                props.spin || props.progress > 0 ? 1 : 0,
            )
    },
    progressIndicator = createView({
        tag: 'div',
        name: 'progress-indicator',
        ignoreRectUpdate: !0,
        ignoreRect: !0,
        create,
        write,
        mixins: {
            apis: ['progress', 'spin', 'align'],
            styles: ['opacity'],
            animations: {
                opacity: { type: 'tween', duration: 500 },
                progress: {
                    type: 'spring',
                    stiffness: 0.95,
                    damping: 0.65,
                    mass: 10,
                },
            },
        },
    }),
    create$1 = ({ root: root2, props }) => {
        ;(root2.element.innerHTML =
            (props.icon || '') + `<span>${props.label}</span>`),
            (props.isDisabled = !1)
    },
    write$1 = ({ root: root2, props }) => {
        let { isDisabled } = props,
            shouldDisable = root2.query('GET_DISABLED') || props.opacity === 0
        shouldDisable && !isDisabled
            ? ((props.isDisabled = !0),
              attr(root2.element, 'disabled', 'disabled'))
            : !shouldDisable &&
              isDisabled &&
              ((props.isDisabled = !1),
              root2.element.removeAttribute('disabled'))
    },
    fileActionButton = createView({
        tag: 'button',
        attributes: { type: 'button' },
        ignoreRect: !0,
        ignoreRectUpdate: !0,
        name: 'file-action-button',
        mixins: {
            apis: ['label'],
            styles: ['translateX', 'translateY', 'scaleX', 'scaleY', 'opacity'],
            animations: {
                scaleX: 'spring',
                scaleY: 'spring',
                translateX: 'spring',
                translateY: 'spring',
                opacity: { type: 'tween', duration: 250 },
            },
            listeners: !0,
        },
        create: create$1,
        write: write$1,
    }),
    toNaturalFileSize = (
        bytes,
        decimalSeparator = '.',
        base = 1e3,
        options = {},
    ) => {
        let {
            labelBytes = 'bytes',
            labelKilobytes = 'KB',
            labelMegabytes = 'MB',
            labelGigabytes = 'GB',
        } = options
        bytes = Math.round(Math.abs(bytes))
        let KB = base,
            MB = base * base,
            GB = base * base * base
        return bytes < KB
            ? `${bytes} ${labelBytes}`
            : bytes < MB
            ? `${Math.floor(bytes / KB)} ${labelKilobytes}`
            : bytes < GB
            ? `${removeDecimalsWhenZero(
                  bytes / MB,
                  1,
                  decimalSeparator,
              )} ${labelMegabytes}`
            : `${removeDecimalsWhenZero(
                  bytes / GB,
                  2,
                  decimalSeparator,
              )} ${labelGigabytes}`
    },
    removeDecimalsWhenZero = (value, decimalCount, separator) =>
        value
            .toFixed(decimalCount)
            .split('.')
            .filter((part) => part !== '0')
            .join(separator),
    create$2 = ({ root: root2, props }) => {
        let fileName = createElement$1('span')
        ;(fileName.className = 'filepond--file-info-main'),
            attr(fileName, 'aria-hidden', 'true'),
            root2.appendChild(fileName),
            (root2.ref.fileName = fileName)
        let fileSize = createElement$1('span')
        ;(fileSize.className = 'filepond--file-info-sub'),
            root2.appendChild(fileSize),
            (root2.ref.fileSize = fileSize),
            text(fileSize, root2.query('GET_LABEL_FILE_WAITING_FOR_SIZE')),
            text(
                fileName,
                formatFilename(root2.query('GET_ITEM_NAME', props.id)),
            )
    },
    updateFile = ({ root: root2, props }) => {
        text(
            root2.ref.fileSize,
            toNaturalFileSize(
                root2.query('GET_ITEM_SIZE', props.id),
                '.',
                root2.query('GET_FILE_SIZE_BASE'),
                root2.query('GET_FILE_SIZE_LABELS', root2.query),
            ),
        ),
            text(
                root2.ref.fileName,
                formatFilename(root2.query('GET_ITEM_NAME', props.id)),
            )
    },
    updateFileSizeOnError = ({ root: root2, props }) => {
        if (isInt(root2.query('GET_ITEM_SIZE', props.id))) {
            updateFile({ root: root2, props })
            return
        }
        text(
            root2.ref.fileSize,
            root2.query('GET_LABEL_FILE_SIZE_NOT_AVAILABLE'),
        )
    },
    fileInfo = createView({
        name: 'file-info',
        ignoreRect: !0,
        ignoreRectUpdate: !0,
        write: createRoute({
            DID_LOAD_ITEM: updateFile,
            DID_UPDATE_ITEM_META: updateFile,
            DID_THROW_ITEM_LOAD_ERROR: updateFileSizeOnError,
            DID_THROW_ITEM_INVALID: updateFileSizeOnError,
        }),
        didCreateView: (root2) => {
            applyFilters('CREATE_VIEW', { ...root2, view: root2 })
        },
        create: create$2,
        mixins: {
            styles: ['translateX', 'translateY'],
            animations: { translateX: 'spring', translateY: 'spring' },
        },
    }),
    toPercentage = (value) => Math.round(value * 100),
    create$3 = ({ root: root2 }) => {
        let main = createElement$1('span')
        ;(main.className = 'filepond--file-status-main'),
            root2.appendChild(main),
            (root2.ref.main = main)
        let sub = createElement$1('span')
        ;(sub.className = 'filepond--file-status-sub'),
            root2.appendChild(sub),
            (root2.ref.sub = sub),
            didSetItemLoadProgress({ root: root2, action: { progress: null } })
    },
    didSetItemLoadProgress = ({ root: root2, action }) => {
        let title =
            action.progress === null
                ? root2.query('GET_LABEL_FILE_LOADING')
                : `${root2.query('GET_LABEL_FILE_LOADING')} ${toPercentage(
                      action.progress,
                  )}%`
        text(root2.ref.main, title),
            text(root2.ref.sub, root2.query('GET_LABEL_TAP_TO_CANCEL'))
    },
    didSetItemProcessProgress = ({ root: root2, action }) => {
        let title =
            action.progress === null
                ? root2.query('GET_LABEL_FILE_PROCESSING')
                : `${root2.query('GET_LABEL_FILE_PROCESSING')} ${toPercentage(
                      action.progress,
                  )}%`
        text(root2.ref.main, title),
            text(root2.ref.sub, root2.query('GET_LABEL_TAP_TO_CANCEL'))
    },
    didRequestItemProcessing = ({ root: root2 }) => {
        text(root2.ref.main, root2.query('GET_LABEL_FILE_PROCESSING')),
            text(root2.ref.sub, root2.query('GET_LABEL_TAP_TO_CANCEL'))
    },
    didAbortItemProcessing = ({ root: root2 }) => {
        text(root2.ref.main, root2.query('GET_LABEL_FILE_PROCESSING_ABORTED')),
            text(root2.ref.sub, root2.query('GET_LABEL_TAP_TO_RETRY'))
    },
    didCompleteItemProcessing = ({ root: root2 }) => {
        text(root2.ref.main, root2.query('GET_LABEL_FILE_PROCESSING_COMPLETE')),
            text(root2.ref.sub, root2.query('GET_LABEL_TAP_TO_UNDO'))
    },
    clear = ({ root: root2 }) => {
        text(root2.ref.main, ''), text(root2.ref.sub, '')
    },
    error = ({ root: root2, action }) => {
        text(root2.ref.main, action.status.main),
            text(root2.ref.sub, action.status.sub)
    },
    fileStatus = createView({
        name: 'file-status',
        ignoreRect: !0,
        ignoreRectUpdate: !0,
        write: createRoute({
            DID_LOAD_ITEM: clear,
            DID_REVERT_ITEM_PROCESSING: clear,
            DID_REQUEST_ITEM_PROCESSING: didRequestItemProcessing,
            DID_ABORT_ITEM_PROCESSING: didAbortItemProcessing,
            DID_COMPLETE_ITEM_PROCESSING: didCompleteItemProcessing,
            DID_UPDATE_ITEM_PROCESS_PROGRESS: didSetItemProcessProgress,
            DID_UPDATE_ITEM_LOAD_PROGRESS: didSetItemLoadProgress,
            DID_THROW_ITEM_LOAD_ERROR: error,
            DID_THROW_ITEM_INVALID: error,
            DID_THROW_ITEM_PROCESSING_ERROR: error,
            DID_THROW_ITEM_PROCESSING_REVERT_ERROR: error,
            DID_THROW_ITEM_REMOVE_ERROR: error,
        }),
        didCreateView: (root2) => {
            applyFilters('CREATE_VIEW', { ...root2, view: root2 })
        },
        create: create$3,
        mixins: {
            styles: ['translateX', 'translateY', 'opacity'],
            animations: {
                opacity: { type: 'tween', duration: 250 },
                translateX: 'spring',
                translateY: 'spring',
            },
        },
    }),
    Buttons = {
        AbortItemLoad: {
            label: 'GET_LABEL_BUTTON_ABORT_ITEM_LOAD',
            action: 'ABORT_ITEM_LOAD',
            className: 'filepond--action-abort-item-load',
            align: 'LOAD_INDICATOR_POSITION',
        },
        RetryItemLoad: {
            label: 'GET_LABEL_BUTTON_RETRY_ITEM_LOAD',
            action: 'RETRY_ITEM_LOAD',
            icon: 'GET_ICON_RETRY',
            className: 'filepond--action-retry-item-load',
            align: 'BUTTON_PROCESS_ITEM_POSITION',
        },
        RemoveItem: {
            label: 'GET_LABEL_BUTTON_REMOVE_ITEM',
            action: 'REQUEST_REMOVE_ITEM',
            icon: 'GET_ICON_REMOVE',
            className: 'filepond--action-remove-item',
            align: 'BUTTON_REMOVE_ITEM_POSITION',
        },
        ProcessItem: {
            label: 'GET_LABEL_BUTTON_PROCESS_ITEM',
            action: 'REQUEST_ITEM_PROCESSING',
            icon: 'GET_ICON_PROCESS',
            className: 'filepond--action-process-item',
            align: 'BUTTON_PROCESS_ITEM_POSITION',
        },
        AbortItemProcessing: {
            label: 'GET_LABEL_BUTTON_ABORT_ITEM_PROCESSING',
            action: 'ABORT_ITEM_PROCESSING',
            className: 'filepond--action-abort-item-processing',
            align: 'BUTTON_PROCESS_ITEM_POSITION',
        },
        RetryItemProcessing: {
            label: 'GET_LABEL_BUTTON_RETRY_ITEM_PROCESSING',
            action: 'RETRY_ITEM_PROCESSING',
            icon: 'GET_ICON_RETRY',
            className: 'filepond--action-retry-item-processing',
            align: 'BUTTON_PROCESS_ITEM_POSITION',
        },
        RevertItemProcessing: {
            label: 'GET_LABEL_BUTTON_UNDO_ITEM_PROCESSING',
            action: 'REQUEST_REVERT_ITEM_PROCESSING',
            icon: 'GET_ICON_UNDO',
            className: 'filepond--action-revert-item-processing',
            align: 'BUTTON_PROCESS_ITEM_POSITION',
        },
    },
    ButtonKeys = []
forin(Buttons, (key) => {
    ButtonKeys.push(key)
})
var calculateFileInfoOffset = (root2) => {
        if (getRemoveIndicatorAligment(root2) === 'right') return 0
        let buttonRect = root2.ref.buttonRemoveItem.rect.element
        return buttonRect.hidden ? null : buttonRect.width + buttonRect.left
    },
    calculateButtonWidth = (root2) =>
        root2.ref.buttonAbortItemLoad.rect.element.width,
    calculateFileVerticalCenterOffset = (root2) =>
        Math.floor(root2.ref.buttonRemoveItem.rect.element.height / 4),
    calculateFileHorizontalCenterOffset = (root2) =>
        Math.floor(root2.ref.buttonRemoveItem.rect.element.left / 2),
    getLoadIndicatorAlignment = (root2) =>
        root2.query('GET_STYLE_LOAD_INDICATOR_POSITION'),
    getProcessIndicatorAlignment = (root2) =>
        root2.query('GET_STYLE_PROGRESS_INDICATOR_POSITION'),
    getRemoveIndicatorAligment = (root2) =>
        root2.query('GET_STYLE_BUTTON_REMOVE_ITEM_POSITION'),
    DefaultStyle = {
        buttonAbortItemLoad: { opacity: 0 },
        buttonRetryItemLoad: { opacity: 0 },
        buttonRemoveItem: { opacity: 0 },
        buttonProcessItem: { opacity: 0 },
        buttonAbortItemProcessing: { opacity: 0 },
        buttonRetryItemProcessing: { opacity: 0 },
        buttonRevertItemProcessing: { opacity: 0 },
        loadProgressIndicator: { opacity: 0, align: getLoadIndicatorAlignment },
        processProgressIndicator: {
            opacity: 0,
            align: getProcessIndicatorAlignment,
        },
        processingCompleteIndicator: { opacity: 0, scaleX: 0.75, scaleY: 0.75 },
        info: { translateX: 0, translateY: 0, opacity: 0 },
        status: { translateX: 0, translateY: 0, opacity: 0 },
    },
    IdleStyle = {
        buttonRemoveItem: { opacity: 1 },
        buttonProcessItem: { opacity: 1 },
        info: { translateX: calculateFileInfoOffset },
        status: { translateX: calculateFileInfoOffset },
    },
    ProcessingStyle = {
        buttonAbortItemProcessing: { opacity: 1 },
        processProgressIndicator: { opacity: 1 },
        status: { opacity: 1 },
    },
    StyleMap = {
        DID_THROW_ITEM_INVALID: {
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { translateX: calculateFileInfoOffset, opacity: 1 },
        },
        DID_START_ITEM_LOAD: {
            buttonAbortItemLoad: { opacity: 1 },
            loadProgressIndicator: { opacity: 1 },
            status: { opacity: 1 },
        },
        DID_THROW_ITEM_LOAD_ERROR: {
            buttonRetryItemLoad: { opacity: 1 },
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 1 },
        },
        DID_START_ITEM_REMOVE: {
            processProgressIndicator: {
                opacity: 1,
                align: getRemoveIndicatorAligment,
            },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 0 },
        },
        DID_THROW_ITEM_REMOVE_ERROR: {
            processProgressIndicator: {
                opacity: 0,
                align: getRemoveIndicatorAligment,
            },
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 1, translateX: calculateFileInfoOffset },
        },
        DID_LOAD_ITEM: IdleStyle,
        DID_LOAD_LOCAL_ITEM: {
            buttonRemoveItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { translateX: calculateFileInfoOffset },
        },
        DID_START_ITEM_PROCESSING: ProcessingStyle,
        DID_REQUEST_ITEM_PROCESSING: ProcessingStyle,
        DID_UPDATE_ITEM_PROCESS_PROGRESS: ProcessingStyle,
        DID_COMPLETE_ITEM_PROCESSING: {
            buttonRevertItemProcessing: { opacity: 1 },
            info: { opacity: 1 },
            status: { opacity: 1 },
        },
        DID_THROW_ITEM_PROCESSING_ERROR: {
            buttonRemoveItem: { opacity: 1 },
            buttonRetryItemProcessing: { opacity: 1 },
            status: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
        },
        DID_THROW_ITEM_PROCESSING_REVERT_ERROR: {
            buttonRevertItemProcessing: { opacity: 1 },
            status: { opacity: 1 },
            info: { opacity: 1 },
        },
        DID_ABORT_ITEM_PROCESSING: {
            buttonRemoveItem: { opacity: 1 },
            buttonProcessItem: { opacity: 1 },
            info: { translateX: calculateFileInfoOffset },
            status: { opacity: 1 },
        },
        DID_REVERT_ITEM_PROCESSING: IdleStyle,
    },
    processingCompleteIndicatorView = createView({
        create: ({ root: root2 }) => {
            root2.element.innerHTML = root2.query('GET_ICON_DONE')
        },
        name: 'processing-complete-indicator',
        ignoreRect: !0,
        mixins: {
            styles: ['scaleX', 'scaleY', 'opacity'],
            animations: {
                scaleX: 'spring',
                scaleY: 'spring',
                opacity: { type: 'tween', duration: 250 },
            },
        },
    }),
    create$4 = ({ root: root2, props }) => {
        let LocalButtons = Object.keys(Buttons).reduce(
                (prev, curr) => ((prev[curr] = { ...Buttons[curr] }), prev),
                {},
            ),
            { id } = props,
            allowRevert = root2.query('GET_ALLOW_REVERT'),
            allowRemove = root2.query('GET_ALLOW_REMOVE'),
            allowProcess = root2.query('GET_ALLOW_PROCESS'),
            instantUpload = root2.query('GET_INSTANT_UPLOAD'),
            isAsync2 = root2.query('IS_ASYNC'),
            alignRemoveItemButton = root2.query(
                'GET_STYLE_BUTTON_REMOVE_ITEM_ALIGN',
            ),
            buttonFilter
        isAsync2
            ? allowProcess && !allowRevert
                ? (buttonFilter = (key) => !/RevertItemProcessing/.test(key))
                : !allowProcess && allowRevert
                ? (buttonFilter = (key) =>
                      !/ProcessItem|RetryItemProcessing|AbortItemProcessing/.test(
                          key,
                      ))
                : !allowProcess &&
                  !allowRevert &&
                  (buttonFilter = (key) => !/Process/.test(key))
            : (buttonFilter = (key) => !/Process/.test(key))
        let enabledButtons = buttonFilter
            ? ButtonKeys.filter(buttonFilter)
            : ButtonKeys.concat()
        if (
            (instantUpload &&
                allowRevert &&
                ((LocalButtons.RevertItemProcessing.label =
                    'GET_LABEL_BUTTON_REMOVE_ITEM'),
                (LocalButtons.RevertItemProcessing.icon = 'GET_ICON_REMOVE')),
            isAsync2 && !allowRevert)
        ) {
            let map2 = StyleMap.DID_COMPLETE_ITEM_PROCESSING
            ;(map2.info.translateX = calculateFileHorizontalCenterOffset),
                (map2.info.translateY = calculateFileVerticalCenterOffset),
                (map2.status.translateY = calculateFileVerticalCenterOffset),
                (map2.processingCompleteIndicator = {
                    opacity: 1,
                    scaleX: 1,
                    scaleY: 1,
                })
        }
        if (
            (isAsync2 &&
                !allowProcess &&
                ([
                    'DID_START_ITEM_PROCESSING',
                    'DID_REQUEST_ITEM_PROCESSING',
                    'DID_UPDATE_ITEM_PROCESS_PROGRESS',
                    'DID_THROW_ITEM_PROCESSING_ERROR',
                ].forEach((key) => {
                    StyleMap[key].status.translateY =
                        calculateFileVerticalCenterOffset
                }),
                (StyleMap.DID_THROW_ITEM_PROCESSING_ERROR.status.translateX =
                    calculateButtonWidth)),
            alignRemoveItemButton && allowRevert)
        ) {
            LocalButtons.RevertItemProcessing.align =
                'BUTTON_REMOVE_ITEM_POSITION'
            let map2 = StyleMap.DID_COMPLETE_ITEM_PROCESSING
            ;(map2.info.translateX = calculateFileInfoOffset),
                (map2.status.translateY = calculateFileVerticalCenterOffset),
                (map2.processingCompleteIndicator = {
                    opacity: 1,
                    scaleX: 1,
                    scaleY: 1,
                })
        }
        allowRemove || (LocalButtons.RemoveItem.disabled = !0),
            forin(LocalButtons, (key, definition) => {
                let buttonView = root2.createChildView(fileActionButton, {
                    label: root2.query(definition.label),
                    icon: root2.query(definition.icon),
                    opacity: 0,
                })
                enabledButtons.includes(key) &&
                    root2.appendChildView(buttonView),
                    definition.disabled &&
                        (buttonView.element.setAttribute(
                            'disabled',
                            'disabled',
                        ),
                        buttonView.element.setAttribute('hidden', 'hidden')),
                    (buttonView.element.dataset.align = root2.query(
                        `GET_STYLE_${definition.align}`,
                    )),
                    buttonView.element.classList.add(definition.className),
                    buttonView.on('click', (e) => {
                        e.stopPropagation(),
                            !definition.disabled &&
                                root2.dispatch(definition.action, { query: id })
                    }),
                    (root2.ref[`button${key}`] = buttonView)
            }),
            (root2.ref.processingCompleteIndicator = root2.appendChildView(
                root2.createChildView(processingCompleteIndicatorView),
            )),
            (root2.ref.processingCompleteIndicator.element.dataset.align =
                root2.query('GET_STYLE_BUTTON_PROCESS_ITEM_POSITION')),
            (root2.ref.info = root2.appendChildView(
                root2.createChildView(fileInfo, { id }),
            )),
            (root2.ref.status = root2.appendChildView(
                root2.createChildView(fileStatus, { id }),
            ))
        let loadIndicatorView = root2.appendChildView(
            root2.createChildView(progressIndicator, {
                opacity: 0,
                align: root2.query('GET_STYLE_LOAD_INDICATOR_POSITION'),
            }),
        )
        loadIndicatorView.element.classList.add('filepond--load-indicator'),
            (root2.ref.loadProgressIndicator = loadIndicatorView)
        let progressIndicatorView = root2.appendChildView(
            root2.createChildView(progressIndicator, {
                opacity: 0,
                align: root2.query('GET_STYLE_PROGRESS_INDICATOR_POSITION'),
            }),
        )
        progressIndicatorView.element.classList.add(
            'filepond--process-indicator',
        ),
            (root2.ref.processProgressIndicator = progressIndicatorView),
            (root2.ref.activeStyles = [])
    },
    write$2 = ({ root: root2, actions: actions2, props }) => {
        route({ root: root2, actions: actions2, props })
        let action = actions2
            .concat()
            .filter((action2) => /^DID_/.test(action2.type))
            .reverse()
            .find((action2) => StyleMap[action2.type])
        if (action) {
            root2.ref.activeStyles = []
            let stylesToApply = StyleMap[action.type]
            forin(DefaultStyle, (name2, defaultStyles) => {
                let control = root2.ref[name2]
                forin(defaultStyles, (key, defaultValue) => {
                    let value =
                        stylesToApply[name2] &&
                        typeof stylesToApply[name2][key] != 'undefined'
                            ? stylesToApply[name2][key]
                            : defaultValue
                    root2.ref.activeStyles.push({ control, key, value })
                })
            })
        }
        root2.ref.activeStyles.forEach(({ control, key, value }) => {
            control[key] = typeof value == 'function' ? value(root2) : value
        })
    },
    route = createRoute({
        DID_SET_LABEL_BUTTON_ABORT_ITEM_PROCESSING: ({
            root: root2,
            action,
        }) => {
            root2.ref.buttonAbortItemProcessing.label = action.value
        },
        DID_SET_LABEL_BUTTON_ABORT_ITEM_LOAD: ({ root: root2, action }) => {
            root2.ref.buttonAbortItemLoad.label = action.value
        },
        DID_SET_LABEL_BUTTON_ABORT_ITEM_REMOVAL: ({ root: root2, action }) => {
            root2.ref.buttonAbortItemRemoval.label = action.value
        },
        DID_REQUEST_ITEM_PROCESSING: ({ root: root2 }) => {
            ;(root2.ref.processProgressIndicator.spin = !0),
                (root2.ref.processProgressIndicator.progress = 0)
        },
        DID_START_ITEM_LOAD: ({ root: root2 }) => {
            ;(root2.ref.loadProgressIndicator.spin = !0),
                (root2.ref.loadProgressIndicator.progress = 0)
        },
        DID_START_ITEM_REMOVE: ({ root: root2 }) => {
            ;(root2.ref.processProgressIndicator.spin = !0),
                (root2.ref.processProgressIndicator.progress = 0)
        },
        DID_UPDATE_ITEM_LOAD_PROGRESS: ({ root: root2, action }) => {
            ;(root2.ref.loadProgressIndicator.spin = !1),
                (root2.ref.loadProgressIndicator.progress = action.progress)
        },
        DID_UPDATE_ITEM_PROCESS_PROGRESS: ({ root: root2, action }) => {
            ;(root2.ref.processProgressIndicator.spin = !1),
                (root2.ref.processProgressIndicator.progress = action.progress)
        },
    }),
    file = createView({
        create: create$4,
        write: write$2,
        didCreateView: (root2) => {
            applyFilters('CREATE_VIEW', { ...root2, view: root2 })
        },
        name: 'file',
    }),
    create$5 = ({ root: root2, props }) => {
        ;(root2.ref.fileName = createElement$1('legend')),
            root2.appendChild(root2.ref.fileName),
            (root2.ref.file = root2.appendChildView(
                root2.createChildView(file, { id: props.id }),
            )),
            (root2.ref.data = !1)
    },
    didLoadItem = ({ root: root2, props }) => {
        text(
            root2.ref.fileName,
            formatFilename(root2.query('GET_ITEM_NAME', props.id)),
        )
    },
    fileWrapper = createView({
        create: create$5,
        ignoreRect: !0,
        write: createRoute({ DID_LOAD_ITEM: didLoadItem }),
        didCreateView: (root2) => {
            applyFilters('CREATE_VIEW', { ...root2, view: root2 })
        },
        tag: 'fieldset',
        name: 'file-wrapper',
    }),
    PANEL_SPRING_PROPS = { type: 'spring', damping: 0.6, mass: 7 },
    create$6 = ({ root: root2, props }) => {
        ;[
            { name: 'top' },
            {
                name: 'center',
                props: { translateY: null, scaleY: null },
                mixins: {
                    animations: { scaleY: PANEL_SPRING_PROPS },
                    styles: ['translateY', 'scaleY'],
                },
            },
            {
                name: 'bottom',
                props: { translateY: null },
                mixins: {
                    animations: { translateY: PANEL_SPRING_PROPS },
                    styles: ['translateY'],
                },
            },
        ].forEach((section) => {
            createSection(root2, section, props.name)
        }),
            root2.element.classList.add(`filepond--${props.name}`),
            (root2.ref.scalable = null)
    },
    createSection = (root2, section, className) => {
        let viewConstructor = createView({
                name: `panel-${section.name} filepond--${className}`,
                mixins: section.mixins,
                ignoreRectUpdate: !0,
            }),
            view = root2.createChildView(viewConstructor, section.props)
        root2.ref[section.name] = root2.appendChildView(view)
    },
    write$3 = ({ root: root2, props }) => {
        if (
            ((root2.ref.scalable === null ||
                props.scalable !== root2.ref.scalable) &&
                ((root2.ref.scalable = isBoolean(props.scalable)
                    ? props.scalable
                    : !0),
                (root2.element.dataset.scalable = root2.ref.scalable)),
            !props.height)
        )
            return
        let topRect = root2.ref.top.rect.element,
            bottomRect = root2.ref.bottom.rect.element,
            height = Math.max(topRect.height + bottomRect.height, props.height)
        ;(root2.ref.center.translateY = topRect.height),
            (root2.ref.center.scaleY =
                (height - topRect.height - bottomRect.height) / 100),
            (root2.ref.bottom.translateY = height - bottomRect.height)
    },
    panel = createView({
        name: 'panel',
        read: ({ root: root2, props }) =>
            (props.heightCurrent = root2.ref.bottom.translateY),
        write: write$3,
        create: create$6,
        ignoreRect: !0,
        mixins: { apis: ['height', 'heightCurrent', 'scalable'] },
    }),
    createDragHelper = (items) => {
        let itemIds = items.map((item2) => item2.id),
            prevIndex
        return {
            setIndex: (index) => {
                prevIndex = index
            },
            getIndex: () => prevIndex,
            getItemIndex: (item2) => itemIds.indexOf(item2.id),
        }
    },
    ITEM_TRANSLATE_SPRING = {
        type: 'spring',
        stiffness: 0.75,
        damping: 0.45,
        mass: 10,
    },
    ITEM_SCALE_SPRING = 'spring',
    StateMap = {
        DID_START_ITEM_LOAD: 'busy',
        DID_UPDATE_ITEM_LOAD_PROGRESS: 'loading',
        DID_THROW_ITEM_INVALID: 'load-invalid',
        DID_THROW_ITEM_LOAD_ERROR: 'load-error',
        DID_LOAD_ITEM: 'idle',
        DID_THROW_ITEM_REMOVE_ERROR: 'remove-error',
        DID_START_ITEM_REMOVE: 'busy',
        DID_START_ITEM_PROCESSING: 'busy processing',
        DID_REQUEST_ITEM_PROCESSING: 'busy processing',
        DID_UPDATE_ITEM_PROCESS_PROGRESS: 'processing',
        DID_COMPLETE_ITEM_PROCESSING: 'processing-complete',
        DID_THROW_ITEM_PROCESSING_ERROR: 'processing-error',
        DID_THROW_ITEM_PROCESSING_REVERT_ERROR: 'processing-revert-error',
        DID_ABORT_ITEM_PROCESSING: 'cancelled',
        DID_REVERT_ITEM_PROCESSING: 'idle',
    },
    create$7 = ({ root: root2, props }) => {
        if (
            ((root2.ref.handleClick = (e) =>
                root2.dispatch('DID_ACTIVATE_ITEM', { id: props.id })),
            (root2.element.id = `filepond--item-${props.id}`),
            root2.element.addEventListener('click', root2.ref.handleClick),
            (root2.ref.container = root2.appendChildView(
                root2.createChildView(fileWrapper, { id: props.id }),
            )),
            (root2.ref.panel = root2.appendChildView(
                root2.createChildView(panel, { name: 'item-panel' }),
            )),
            (root2.ref.panel.height = null),
            (props.markedForRemoval = !1),
            !root2.query('GET_ALLOW_REORDER'))
        )
            return
        root2.element.dataset.dragState = 'idle'
        let grab = (e) => {
            if (!e.isPrimary) return
            let removedActivateListener = !1,
                origin = { x: e.pageX, y: e.pageY }
            ;(props.dragOrigin = { x: root2.translateX, y: root2.translateY }),
                (props.dragCenter = { x: e.offsetX, y: e.offsetY })
            let dragState = createDragHelper(root2.query('GET_ACTIVE_ITEMS'))
            root2.dispatch('DID_GRAB_ITEM', { id: props.id, dragState })
            let drag = (e2) => {
                    if (!e2.isPrimary) return
                    e2.stopPropagation(),
                        e2.preventDefault(),
                        (props.dragOffset = {
                            x: e2.pageX - origin.x,
                            y: e2.pageY - origin.y,
                        }),
                        props.dragOffset.x * props.dragOffset.x +
                            props.dragOffset.y * props.dragOffset.y >
                            16 &&
                            !removedActivateListener &&
                            ((removedActivateListener = !0),
                            root2.element.removeEventListener(
                                'click',
                                root2.ref.handleClick,
                            )),
                        root2.dispatch('DID_DRAG_ITEM', {
                            id: props.id,
                            dragState,
                        })
                },
                drop2 = (e2) => {
                    !e2.isPrimary ||
                        (document.removeEventListener('pointermove', drag),
                        document.removeEventListener('pointerup', drop2),
                        (props.dragOffset = {
                            x: e2.pageX - origin.x,
                            y: e2.pageY - origin.y,
                        }),
                        root2.dispatch('DID_DROP_ITEM', {
                            id: props.id,
                            dragState,
                        }),
                        removedActivateListener &&
                            setTimeout(
                                () =>
                                    root2.element.addEventListener(
                                        'click',
                                        root2.ref.handleClick,
                                    ),
                                0,
                            ))
                }
            document.addEventListener('pointermove', drag),
                document.addEventListener('pointerup', drop2)
        }
        root2.element.addEventListener('pointerdown', grab)
    },
    route$1 = createRoute({
        DID_UPDATE_PANEL_HEIGHT: ({ root: root2, action }) => {
            root2.height = action.height
        },
    }),
    write$4 = createRoute(
        {
            DID_GRAB_ITEM: ({ root: root2, props }) => {
                props.dragOrigin = { x: root2.translateX, y: root2.translateY }
            },
            DID_DRAG_ITEM: ({ root: root2 }) => {
                root2.element.dataset.dragState = 'drag'
            },
            DID_DROP_ITEM: ({ root: root2, props }) => {
                ;(props.dragOffset = null),
                    (props.dragOrigin = null),
                    (root2.element.dataset.dragState = 'drop')
            },
        },
        ({ root: root2, actions: actions2, props, shouldOptimize }) => {
            root2.element.dataset.dragState === 'drop' &&
                root2.scaleX <= 1 &&
                (root2.element.dataset.dragState = 'idle')
            let action = actions2
                .concat()
                .filter((action2) => /^DID_/.test(action2.type))
                .reverse()
                .find((action2) => StateMap[action2.type])
            action &&
                action.type !== props.currentState &&
                ((props.currentState = action.type),
                (root2.element.dataset.filepondItemState =
                    StateMap[props.currentState] || ''))
            let aspectRatio =
                root2.query('GET_ITEM_PANEL_ASPECT_RATIO') ||
                root2.query('GET_PANEL_ASPECT_RATIO')
            aspectRatio
                ? shouldOptimize ||
                  (root2.height = root2.rect.element.width * aspectRatio)
                : (route$1({ root: root2, actions: actions2, props }),
                  !root2.height &&
                      root2.ref.container.rect.element.height > 0 &&
                      (root2.height = root2.ref.container.rect.element.height)),
                shouldOptimize && (root2.ref.panel.height = null),
                (root2.ref.panel.height = root2.height)
        },
    ),
    item = createView({
        create: create$7,
        write: write$4,
        destroy: ({ root: root2, props }) => {
            root2.element.removeEventListener('click', root2.ref.handleClick),
                root2.dispatch('RELEASE_ITEM', { query: props.id })
        },
        tag: 'li',
        name: 'item',
        mixins: {
            apis: [
                'id',
                'interactionMethod',
                'markedForRemoval',
                'spawnDate',
                'dragCenter',
                'dragOrigin',
                'dragOffset',
            ],
            styles: [
                'translateX',
                'translateY',
                'scaleX',
                'scaleY',
                'opacity',
                'height',
            ],
            animations: {
                scaleX: ITEM_SCALE_SPRING,
                scaleY: ITEM_SCALE_SPRING,
                translateX: ITEM_TRANSLATE_SPRING,
                translateY: ITEM_TRANSLATE_SPRING,
                opacity: { type: 'tween', duration: 150 },
            },
        },
    }),
    getItemsPerRow = (horizontalSpace, itemWidth) =>
        Math.max(1, Math.floor((horizontalSpace + 1) / itemWidth)),
    getItemIndexByPosition = (view, children, positionInView) => {
        if (!positionInView) return
        let horizontalSpace = view.rect.element.width,
            l = children.length,
            last = null
        if (l === 0 || positionInView.top < children[0].rect.element.top)
            return -1
        let itemRect = children[0].rect.element,
            itemHorizontalMargin = itemRect.marginLeft + itemRect.marginRight,
            itemWidth = itemRect.width + itemHorizontalMargin,
            itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth)
        if (itemsPerRow === 1) {
            for (let index = 0; index < l; index++) {
                let child = children[index],
                    childMid =
                        child.rect.outer.top + child.rect.element.height * 0.5
                if (positionInView.top < childMid) return index
            }
            return l
        }
        let itemVerticalMargin = itemRect.marginTop + itemRect.marginBottom,
            itemHeight = itemRect.height + itemVerticalMargin
        for (let index = 0; index < l; index++) {
            let indexX = index % itemsPerRow,
                indexY = Math.floor(index / itemsPerRow),
                offsetX = indexX * itemWidth,
                offsetY = indexY * itemHeight,
                itemTop = offsetY - itemRect.marginTop,
                itemRight = offsetX + itemWidth,
                itemBottom = offsetY + itemHeight + itemRect.marginBottom
            if (
                positionInView.top < itemBottom &&
                positionInView.top > itemTop
            ) {
                if (positionInView.left < itemRight) return index
                index !== l - 1 ? (last = index) : (last = null)
            }
        }
        return last !== null ? last : l
    },
    dropAreaDimensions = {
        height: 0,
        width: 0,
        get getHeight() {
            return this.height
        },
        set setHeight(val) {
            ;(this.height === 0 || val === 0) && (this.height = val)
        },
        get getWidth() {
            return this.width
        },
        set setWidth(val) {
            ;(this.width === 0 || val === 0) && (this.width = val)
        },
        setDimensions: function (height, width) {
            ;(this.height === 0 || height === 0) && (this.height = height),
                (this.width === 0 || width === 0) && (this.width = width)
        },
    },
    create$8 = ({ root: root2 }) => {
        attr(root2.element, 'role', 'list'),
            (root2.ref.lastItemSpanwDate = Date.now())
    },
    addItemView = ({ root: root2, action }) => {
        let { id, index, interactionMethod } = action
        root2.ref.addIndex = index
        let now = Date.now(),
            spawnDate = now,
            opacity = 1
        if (interactionMethod !== InteractionMethod.NONE) {
            opacity = 0
            let cooldown = root2.query('GET_ITEM_INSERT_INTERVAL'),
                dist = now - root2.ref.lastItemSpanwDate
            spawnDate = dist < cooldown ? now + (cooldown - dist) : now
        }
        ;(root2.ref.lastItemSpanwDate = spawnDate),
            root2.appendChildView(
                root2.createChildView(item, {
                    spawnDate,
                    id,
                    opacity,
                    interactionMethod,
                }),
                index,
            )
    },
    moveItem = (item2, x, y, vx = 0, vy = 1) => {
        item2.dragOffset
            ? ((item2.translateX = null),
              (item2.translateY = null),
              (item2.translateX = item2.dragOrigin.x + item2.dragOffset.x),
              (item2.translateY = item2.dragOrigin.y + item2.dragOffset.y),
              (item2.scaleX = 1.025),
              (item2.scaleY = 1.025))
            : ((item2.translateX = x),
              (item2.translateY = y),
              Date.now() > item2.spawnDate &&
                  (item2.opacity === 0 && introItemView(item2, x, y, vx, vy),
                  (item2.scaleX = 1),
                  (item2.scaleY = 1),
                  (item2.opacity = 1)))
    },
    introItemView = (item2, x, y, vx, vy) => {
        item2.interactionMethod === InteractionMethod.NONE
            ? ((item2.translateX = null),
              (item2.translateX = x),
              (item2.translateY = null),
              (item2.translateY = y))
            : item2.interactionMethod === InteractionMethod.DROP
            ? ((item2.translateX = null),
              (item2.translateX = x - vx * 20),
              (item2.translateY = null),
              (item2.translateY = y - vy * 10),
              (item2.scaleX = 0.8),
              (item2.scaleY = 0.8))
            : item2.interactionMethod === InteractionMethod.BROWSE
            ? ((item2.translateY = null), (item2.translateY = y - 30))
            : item2.interactionMethod === InteractionMethod.API &&
              ((item2.translateX = null),
              (item2.translateX = x - 30),
              (item2.translateY = null))
    },
    removeItemView = ({ root: root2, action }) => {
        let { id } = action,
            view = root2.childViews.find((child) => child.id === id)
        !view ||
            ((view.scaleX = 0.9),
            (view.scaleY = 0.9),
            (view.opacity = 0),
            (view.markedForRemoval = !0))
    },
    getItemHeight = (child) =>
        child.rect.element.height +
        child.rect.element.marginBottom * 0.5 +
        child.rect.element.marginTop * 0.5,
    getItemWidth = (child) =>
        child.rect.element.width +
        child.rect.element.marginLeft * 0.5 +
        child.rect.element.marginRight * 0.5,
    dragItem = ({ root: root2, action }) => {
        let { id, dragState } = action,
            item2 = root2.query('GET_ITEM', { id }),
            view = root2.childViews.find((child) => child.id === id),
            numItems = root2.childViews.length,
            oldIndex = dragState.getItemIndex(item2)
        if (!view) return
        let dragPosition = {
                x: view.dragOrigin.x + view.dragOffset.x + view.dragCenter.x,
                y: view.dragOrigin.y + view.dragOffset.y + view.dragCenter.y,
            },
            dragHeight = getItemHeight(view),
            dragWidth = getItemWidth(view),
            cols = Math.floor(root2.rect.outer.width / dragWidth)
        cols > numItems && (cols = numItems)
        let rows = Math.floor(numItems / cols + 1)
        ;(dropAreaDimensions.setHeight = dragHeight * rows),
            (dropAreaDimensions.setWidth = dragWidth * cols)
        var location2 = {
            y: Math.floor(dragPosition.y / dragHeight),
            x: Math.floor(dragPosition.x / dragWidth),
            getGridIndex: function () {
                return dragPosition.y > dropAreaDimensions.getHeight ||
                    dragPosition.y < 0 ||
                    dragPosition.x > dropAreaDimensions.getWidth ||
                    dragPosition.x < 0
                    ? oldIndex
                    : this.y * cols + this.x
            },
            getColIndex: function () {
                let items = root2.query('GET_ACTIVE_ITEMS'),
                    visibleChildren = root2.childViews.filter(
                        (child) => child.rect.element.height,
                    ),
                    children = items.map((item3) =>
                        visibleChildren.find(
                            (childView) => childView.id === item3.id,
                        ),
                    ),
                    currentIndex2 = children.findIndex(
                        (child) => child === view,
                    ),
                    dragHeight2 = getItemHeight(view),
                    l = children.length,
                    idx = l,
                    childHeight = 0,
                    childBottom = 0,
                    childTop = 0
                for (let i = 0; i < l; i++)
                    if (
                        ((childHeight = getItemHeight(children[i])),
                        (childTop = childBottom),
                        (childBottom = childTop + childHeight),
                        dragPosition.y < childBottom)
                    ) {
                        if (currentIndex2 > i) {
                            if (dragPosition.y < childTop + dragHeight2) {
                                idx = i
                                break
                            }
                            continue
                        }
                        idx = i
                        break
                    }
                return idx
            },
        }
        let index =
            cols > 1 ? location2.getGridIndex() : location2.getColIndex()
        root2.dispatch('MOVE_ITEM', { query: view, index })
        let currentIndex = dragState.getIndex()
        if (currentIndex === void 0 || currentIndex !== index) {
            if ((dragState.setIndex(index), currentIndex === void 0)) return
            root2.dispatch('DID_REORDER_ITEMS', {
                items: root2.query('GET_ACTIVE_ITEMS'),
                origin: oldIndex,
                target: index,
            })
        }
    },
    route$2 = createRoute({
        DID_ADD_ITEM: addItemView,
        DID_REMOVE_ITEM: removeItemView,
        DID_DRAG_ITEM: dragItem,
    }),
    write$5 = ({ root: root2, props, actions: actions2, shouldOptimize }) => {
        route$2({ root: root2, props, actions: actions2 })
        let { dragCoordinates } = props,
            horizontalSpace = root2.rect.element.width,
            visibleChildren = root2.childViews.filter(
                (child) => child.rect.element.height,
            ),
            children = root2
                .query('GET_ACTIVE_ITEMS')
                .map((item2) =>
                    visibleChildren.find((child) => child.id === item2.id),
                )
                .filter((item2) => item2),
            dragIndex = dragCoordinates
                ? getItemIndexByPosition(root2, children, dragCoordinates)
                : null,
            addIndex = root2.ref.addIndex || null
        root2.ref.addIndex = null
        let dragIndexOffset = 0,
            removeIndexOffset = 0,
            addIndexOffset = 0
        if (children.length === 0) return
        let childRect = children[0].rect.element,
            itemVerticalMargin = childRect.marginTop + childRect.marginBottom,
            itemHorizontalMargin = childRect.marginLeft + childRect.marginRight,
            itemWidth = childRect.width + itemHorizontalMargin,
            itemHeight = childRect.height + itemVerticalMargin,
            itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth)
        if (itemsPerRow === 1) {
            let offsetY = 0,
                dragOffset = 0
            children.forEach((child, index) => {
                if (dragIndex) {
                    let dist = index - dragIndex
                    dist === -2
                        ? (dragOffset = -itemVerticalMargin * 0.25)
                        : dist === -1
                        ? (dragOffset = -itemVerticalMargin * 0.75)
                        : dist === 0
                        ? (dragOffset = itemVerticalMargin * 0.75)
                        : dist === 1
                        ? (dragOffset = itemVerticalMargin * 0.25)
                        : (dragOffset = 0)
                }
                shouldOptimize &&
                    ((child.translateX = null), (child.translateY = null)),
                    child.markedForRemoval ||
                        moveItem(child, 0, offsetY + dragOffset),
                    (offsetY +=
                        (child.rect.element.height + itemVerticalMargin) *
                        (child.markedForRemoval ? child.opacity : 1))
            })
        } else {
            let prevX = 0,
                prevY = 0
            children.forEach((child, index) => {
                index === dragIndex && (dragIndexOffset = 1),
                    index === addIndex && (addIndexOffset += 1),
                    child.markedForRemoval &&
                        child.opacity < 0.5 &&
                        (removeIndexOffset -= 1)
                let visualIndex =
                        index +
                        addIndexOffset +
                        dragIndexOffset +
                        removeIndexOffset,
                    indexX = visualIndex % itemsPerRow,
                    indexY = Math.floor(visualIndex / itemsPerRow),
                    offsetX = indexX * itemWidth,
                    offsetY = indexY * itemHeight,
                    vectorX = Math.sign(offsetX - prevX),
                    vectorY = Math.sign(offsetY - prevY)
                ;(prevX = offsetX),
                    (prevY = offsetY),
                    !child.markedForRemoval &&
                        (shouldOptimize &&
                            ((child.translateX = null),
                            (child.translateY = null)),
                        moveItem(child, offsetX, offsetY, vectorX, vectorY))
            })
        }
    },
    filterSetItemActions = (child, actions2) =>
        actions2.filter((action) =>
            action.data && action.data.id ? child.id === action.data.id : !0,
        ),
    list = createView({
        create: create$8,
        write: write$5,
        tag: 'ul',
        name: 'list',
        didWriteView: ({ root: root2 }) => {
            root2.childViews
                .filter(
                    (view) =>
                        view.markedForRemoval &&
                        view.opacity === 0 &&
                        view.resting,
                )
                .forEach((view) => {
                    view._destroy(), root2.removeChildView(view)
                })
        },
        filterFrameActionsForChild: filterSetItemActions,
        mixins: { apis: ['dragCoordinates'] },
    }),
    create$9 = ({ root: root2, props }) => {
        ;(root2.ref.list = root2.appendChildView(root2.createChildView(list))),
            (props.dragCoordinates = null),
            (props.overflowing = !1)
    },
    storeDragCoordinates = ({ root: root2, props, action }) => {
        !root2.query('GET_ITEM_INSERT_LOCATION_FREEDOM') ||
            (props.dragCoordinates = {
                left:
                    action.position.scopeLeft -
                    root2.ref.list.rect.element.left,
                top:
                    action.position.scopeTop -
                    (root2.rect.outer.top +
                        root2.rect.element.marginTop +
                        root2.rect.element.scrollTop),
            })
    },
    clearDragCoordinates = ({ props }) => {
        props.dragCoordinates = null
    },
    route$3 = createRoute({
        DID_DRAG: storeDragCoordinates,
        DID_END_DRAG: clearDragCoordinates,
    }),
    write$6 = ({ root: root2, props, actions: actions2 }) => {
        if (
            (route$3({ root: root2, props, actions: actions2 }),
            (root2.ref.list.dragCoordinates = props.dragCoordinates),
            props.overflowing &&
                !props.overflow &&
                ((props.overflowing = !1),
                (root2.element.dataset.state = ''),
                (root2.height = null)),
            props.overflow)
        ) {
            let newHeight = Math.round(props.overflow)
            newHeight !== root2.height &&
                ((props.overflowing = !0),
                (root2.element.dataset.state = 'overflow'),
                (root2.height = newHeight))
        }
    },
    listScroller = createView({
        create: create$9,
        write: write$6,
        name: 'list-scroller',
        mixins: {
            apis: ['overflow', 'dragCoordinates'],
            styles: ['height', 'translateY'],
            animations: { translateY: 'spring' },
        },
    }),
    attrToggle = (element, name2, state2, enabledValue = '') => {
        state2
            ? attr(element, name2, enabledValue)
            : element.removeAttribute(name2)
    },
    resetFileInput = (input) => {
        if (!(!input || input.value === '')) {
            try {
                input.value = ''
            } catch (err) {}
            if (input.value) {
                let form = createElement$1('form'),
                    parentNode = input.parentNode,
                    ref = input.nextSibling
                form.appendChild(input),
                    form.reset(),
                    ref
                        ? parentNode.insertBefore(input, ref)
                        : parentNode.appendChild(input)
            }
        }
    },
    create$a = ({ root: root2, props }) => {
        ;(root2.element.id = `filepond--browser-${props.id}`),
            attr(root2.element, 'name', root2.query('GET_NAME')),
            attr(
                root2.element,
                'aria-controls',
                `filepond--assistant-${props.id}`,
            ),
            attr(
                root2.element,
                'aria-labelledby',
                `filepond--drop-label-${props.id}`,
            ),
            setAcceptedFileTypes({
                root: root2,
                action: { value: root2.query('GET_ACCEPTED_FILE_TYPES') },
            }),
            toggleAllowMultiple({
                root: root2,
                action: { value: root2.query('GET_ALLOW_MULTIPLE') },
            }),
            toggleDirectoryFilter({
                root: root2,
                action: { value: root2.query('GET_ALLOW_DIRECTORIES_ONLY') },
            }),
            toggleDisabled({ root: root2 }),
            toggleRequired({
                root: root2,
                action: { value: root2.query('GET_REQUIRED') },
            }),
            setCaptureMethod({
                root: root2,
                action: { value: root2.query('GET_CAPTURE_METHOD') },
            }),
            (root2.ref.handleChange = (e) => {
                if (!root2.element.value) return
                let files = Array.from(root2.element.files).map(
                    (file2) => (
                        (file2._relativePath = file2.webkitRelativePath), file2
                    ),
                )
                setTimeout(() => {
                    props.onload(files), resetFileInput(root2.element)
                }, 250)
            }),
            root2.element.addEventListener('change', root2.ref.handleChange)
    },
    setAcceptedFileTypes = ({ root: root2, action }) => {
        !root2.query('GET_ALLOW_SYNC_ACCEPT_ATTRIBUTE') ||
            attrToggle(
                root2.element,
                'accept',
                !!action.value,
                action.value ? action.value.join(',') : '',
            )
    },
    toggleAllowMultiple = ({ root: root2, action }) => {
        attrToggle(root2.element, 'multiple', action.value)
    },
    toggleDirectoryFilter = ({ root: root2, action }) => {
        attrToggle(root2.element, 'webkitdirectory', action.value)
    },
    toggleDisabled = ({ root: root2 }) => {
        let isDisabled = root2.query('GET_DISABLED'),
            doesAllowBrowse = root2.query('GET_ALLOW_BROWSE'),
            disableField = isDisabled || !doesAllowBrowse
        attrToggle(root2.element, 'disabled', disableField)
    },
    toggleRequired = ({ root: root2, action }) => {
        action.value
            ? root2.query('GET_TOTAL_ITEMS') === 0 &&
              attrToggle(root2.element, 'required', !0)
            : attrToggle(root2.element, 'required', !1)
    },
    setCaptureMethod = ({ root: root2, action }) => {
        attrToggle(
            root2.element,
            'capture',
            !!action.value,
            action.value === !0 ? '' : action.value,
        )
    },
    updateRequiredStatus = ({ root: root2 }) => {
        let { element } = root2
        root2.query('GET_TOTAL_ITEMS') > 0
            ? (attrToggle(element, 'required', !1),
              attrToggle(element, 'name', !1))
            : (attrToggle(element, 'name', !0, root2.query('GET_NAME')),
              root2.query('GET_CHECK_VALIDITY') &&
                  element.setCustomValidity(''),
              root2.query('GET_REQUIRED') &&
                  attrToggle(element, 'required', !0))
    },
    updateFieldValidityStatus = ({ root: root2 }) => {
        !root2.query('GET_CHECK_VALIDITY') ||
            root2.element.setCustomValidity(
                root2.query('GET_LABEL_INVALID_FIELD'),
            )
    },
    browser = createView({
        tag: 'input',
        name: 'browser',
        ignoreRect: !0,
        ignoreRectUpdate: !0,
        attributes: { type: 'file' },
        create: create$a,
        destroy: ({ root: root2 }) => {
            root2.element.removeEventListener('change', root2.ref.handleChange)
        },
        write: createRoute({
            DID_LOAD_ITEM: updateRequiredStatus,
            DID_REMOVE_ITEM: updateRequiredStatus,
            DID_THROW_ITEM_INVALID: updateFieldValidityStatus,
            DID_SET_DISABLED: toggleDisabled,
            DID_SET_ALLOW_BROWSE: toggleDisabled,
            DID_SET_ALLOW_DIRECTORIES_ONLY: toggleDirectoryFilter,
            DID_SET_ALLOW_MULTIPLE: toggleAllowMultiple,
            DID_SET_ACCEPTED_FILE_TYPES: setAcceptedFileTypes,
            DID_SET_CAPTURE_METHOD: setCaptureMethod,
            DID_SET_REQUIRED: toggleRequired,
        }),
    }),
    Key = { ENTER: 13, SPACE: 32 },
    create$b = ({ root: root2, props }) => {
        let label = createElement$1('label')
        attr(label, 'for', `filepond--browser-${props.id}`),
            attr(label, 'id', `filepond--drop-label-${props.id}`),
            attr(label, 'aria-hidden', 'true'),
            (root2.ref.handleKeyDown = (e) => {
                ;(e.keyCode === Key.ENTER || e.keyCode === Key.SPACE) &&
                    (e.preventDefault(), root2.ref.label.click())
            }),
            (root2.ref.handleClick = (e) => {
                e.target === label ||
                    label.contains(e.target) ||
                    root2.ref.label.click()
            }),
            label.addEventListener('keydown', root2.ref.handleKeyDown),
            root2.element.addEventListener('click', root2.ref.handleClick),
            updateLabelValue(label, props.caption),
            root2.appendChild(label),
            (root2.ref.label = label)
    },
    updateLabelValue = (label, value) => {
        label.innerHTML = value
        let clickable = label.querySelector('.filepond--label-action')
        return clickable && attr(clickable, 'tabindex', '0'), value
    },
    dropLabel = createView({
        name: 'drop-label',
        ignoreRect: !0,
        create: create$b,
        destroy: ({ root: root2 }) => {
            root2.ref.label.addEventListener(
                'keydown',
                root2.ref.handleKeyDown,
            ),
                root2.element.removeEventListener(
                    'click',
                    root2.ref.handleClick,
                )
        },
        write: createRoute({
            DID_SET_LABEL_IDLE: ({ root: root2, action }) => {
                updateLabelValue(root2.ref.label, action.value)
            },
        }),
        mixins: {
            styles: ['opacity', 'translateX', 'translateY'],
            animations: {
                opacity: { type: 'tween', duration: 150 },
                translateX: 'spring',
                translateY: 'spring',
            },
        },
    }),
    blob = createView({
        name: 'drip-blob',
        ignoreRect: !0,
        mixins: {
            styles: ['translateX', 'translateY', 'scaleX', 'scaleY', 'opacity'],
            animations: {
                scaleX: 'spring',
                scaleY: 'spring',
                translateX: 'spring',
                translateY: 'spring',
                opacity: { type: 'tween', duration: 250 },
            },
        },
    }),
    addBlob = ({ root: root2 }) => {
        let centerX = root2.rect.element.width * 0.5,
            centerY = root2.rect.element.height * 0.5
        root2.ref.blob = root2.appendChildView(
            root2.createChildView(blob, {
                opacity: 0,
                scaleX: 2.5,
                scaleY: 2.5,
                translateX: centerX,
                translateY: centerY,
            }),
        )
    },
    moveBlob = ({ root: root2, action }) => {
        if (!root2.ref.blob) {
            addBlob({ root: root2 })
            return
        }
        ;(root2.ref.blob.translateX = action.position.scopeLeft),
            (root2.ref.blob.translateY = action.position.scopeTop),
            (root2.ref.blob.scaleX = 1),
            (root2.ref.blob.scaleY = 1),
            (root2.ref.blob.opacity = 1)
    },
    hideBlob = ({ root: root2 }) => {
        !root2.ref.blob || (root2.ref.blob.opacity = 0)
    },
    explodeBlob = ({ root: root2 }) => {
        !root2.ref.blob ||
            ((root2.ref.blob.scaleX = 2.5),
            (root2.ref.blob.scaleY = 2.5),
            (root2.ref.blob.opacity = 0))
    },
    write$7 = ({ root: root2, props, actions: actions2 }) => {
        route$4({ root: root2, props, actions: actions2 })
        let { blob: blob2 } = root2.ref
        actions2.length === 0 &&
            blob2 &&
            blob2.opacity === 0 &&
            (root2.removeChildView(blob2), (root2.ref.blob = null))
    },
    route$4 = createRoute({
        DID_DRAG: moveBlob,
        DID_DROP: explodeBlob,
        DID_END_DRAG: hideBlob,
    }),
    drip = createView({
        ignoreRect: !0,
        ignoreRectUpdate: !0,
        name: 'drip',
        write: write$7,
    }),
    setInputFiles = (element, files) => {
        try {
            let dataTransfer = new DataTransfer()
            files.forEach((file2) => {
                file2 instanceof File
                    ? dataTransfer.items.add(file2)
                    : dataTransfer.items.add(
                          new File([file2], file2.name, { type: file2.type }),
                      )
            }),
                (element.files = dataTransfer.files)
        } catch (err) {
            return !1
        }
        return !0
    },
    create$c = ({ root: root2 }) => (root2.ref.fields = {}),
    getField = (root2, id) => root2.ref.fields[id],
    syncFieldPositionsWithItems = (root2) => {
        root2.query('GET_ACTIVE_ITEMS').forEach((item2) => {
            !root2.ref.fields[item2.id] ||
                root2.element.appendChild(root2.ref.fields[item2.id])
        })
    },
    didReorderItems = ({ root: root2 }) => syncFieldPositionsWithItems(root2),
    didAddItem = ({ root: root2, action }) => {
        let shouldUseFileInput =
                !(
                    root2.query('GET_ITEM', action.id).origin ===
                    FileOrigin.LOCAL
                ) && root2.query('SHOULD_UPDATE_FILE_INPUT'),
            dataContainer = createElement$1('input')
        ;(dataContainer.type = shouldUseFileInput ? 'file' : 'hidden'),
            (dataContainer.name = root2.query('GET_NAME')),
            (dataContainer.disabled = root2.query('GET_DISABLED')),
            (root2.ref.fields[action.id] = dataContainer),
            syncFieldPositionsWithItems(root2)
    },
    didLoadItem$1 = ({ root: root2, action }) => {
        let field = getField(root2, action.id)
        if (
            !field ||
            (action.serverFileReference !== null &&
                (field.value = action.serverFileReference),
            !root2.query('SHOULD_UPDATE_FILE_INPUT'))
        )
            return
        let fileItem = root2.query('GET_ITEM', action.id)
        setInputFiles(field, [fileItem.file])
    },
    didPrepareOutput = ({ root: root2, action }) => {
        !root2.query('SHOULD_UPDATE_FILE_INPUT') ||
            setTimeout(() => {
                let field = getField(root2, action.id)
                !field || setInputFiles(field, [action.file])
            }, 0)
    },
    didSetDisabled = ({ root: root2 }) => {
        root2.element.disabled = root2.query('GET_DISABLED')
    },
    didRemoveItem = ({ root: root2, action }) => {
        let field = getField(root2, action.id)
        !field ||
            (field.parentNode && field.parentNode.removeChild(field),
            delete root2.ref.fields[action.id])
    },
    didDefineValue = ({ root: root2, action }) => {
        let field = getField(root2, action.id)
        !field ||
            (action.value === null
                ? field.removeAttribute('value')
                : (field.value = action.value),
            syncFieldPositionsWithItems(root2))
    },
    write$8 = createRoute({
        DID_SET_DISABLED: didSetDisabled,
        DID_ADD_ITEM: didAddItem,
        DID_LOAD_ITEM: didLoadItem$1,
        DID_REMOVE_ITEM: didRemoveItem,
        DID_DEFINE_VALUE: didDefineValue,
        DID_PREPARE_OUTPUT: didPrepareOutput,
        DID_REORDER_ITEMS: didReorderItems,
        DID_SORT_ITEMS: didReorderItems,
    }),
    data2 = createView({
        tag: 'fieldset',
        name: 'data',
        create: create$c,
        write: write$8,
        ignoreRect: !0,
    }),
    getRootNode = (element) =>
        'getRootNode' in element ? element.getRootNode() : document,
    images = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff'],
    text$1 = ['css', 'csv', 'html', 'txt'],
    map = { zip: 'zip|compressed', epub: 'application/epub+zip' },
    guesstimateMimeType = (extension = '') => (
        (extension = extension.toLowerCase()),
        images.includes(extension)
            ? 'image/' +
              (extension === 'jpg'
                  ? 'jpeg'
                  : extension === 'svg'
                  ? 'svg+xml'
                  : extension)
            : text$1.includes(extension)
            ? 'text/' + extension
            : map[extension] || ''
    ),
    requestDataTransferItems = (dataTransfer) =>
        new Promise((resolve, reject) => {
            let links = getLinks(dataTransfer)
            if (links.length && !hasFiles(dataTransfer)) return resolve(links)
            getFiles(dataTransfer).then(resolve)
        }),
    hasFiles = (dataTransfer) =>
        dataTransfer.files ? dataTransfer.files.length > 0 : !1,
    getFiles = (dataTransfer) =>
        new Promise((resolve, reject) => {
            let promisedFiles = (
                dataTransfer.items ? Array.from(dataTransfer.items) : []
            )
                .filter((item2) => isFileSystemItem(item2))
                .map((item2) => getFilesFromItem(item2))
            if (!promisedFiles.length) {
                resolve(
                    dataTransfer.files ? Array.from(dataTransfer.files) : [],
                )
                return
            }
            Promise.all(promisedFiles)
                .then((returnedFileGroups) => {
                    let files = []
                    returnedFileGroups.forEach((group) => {
                        files.push.apply(files, group)
                    }),
                        resolve(
                            files
                                .filter((file2) => file2)
                                .map(
                                    (file2) => (
                                        file2._relativePath ||
                                            (file2._relativePath =
                                                file2.webkitRelativePath),
                                        file2
                                    ),
                                ),
                        )
                })
                .catch(console.error)
        }),
    isFileSystemItem = (item2) => {
        if (isEntry(item2)) {
            let entry = getAsEntry(item2)
            if (entry) return entry.isFile || entry.isDirectory
        }
        return item2.kind === 'file'
    },
    getFilesFromItem = (item2) =>
        new Promise((resolve, reject) => {
            if (isDirectoryEntry(item2)) {
                getFilesInDirectory(getAsEntry(item2))
                    .then(resolve)
                    .catch(reject)
                return
            }
            resolve([item2.getAsFile()])
        }),
    getFilesInDirectory = (entry) =>
        new Promise((resolve, reject) => {
            let files = [],
                dirCounter = 0,
                fileCounter = 0,
                resolveIfDone = () => {
                    fileCounter === 0 && dirCounter === 0 && resolve(files)
                },
                readEntries = (dirEntry) => {
                    dirCounter++
                    let directoryReader = dirEntry.createReader(),
                        readBatch = () => {
                            directoryReader.readEntries((entries) => {
                                if (entries.length === 0) {
                                    dirCounter--, resolveIfDone()
                                    return
                                }
                                entries.forEach((entry2) => {
                                    entry2.isDirectory
                                        ? readEntries(entry2)
                                        : (fileCounter++,
                                          entry2.file((file2) => {
                                              let correctedFile =
                                                  correctMissingFileType(file2)
                                              entry2.fullPath &&
                                                  (correctedFile._relativePath =
                                                      entry2.fullPath),
                                                  files.push(correctedFile),
                                                  fileCounter--,
                                                  resolveIfDone()
                                          }))
                                }),
                                    readBatch()
                            }, reject)
                        }
                    readBatch()
                }
            readEntries(entry)
        }),
    correctMissingFileType = (file2) => {
        if (file2.type.length) return file2
        let date = file2.lastModifiedDate,
            name2 = file2.name,
            type = guesstimateMimeType(getExtensionFromFilename(file2.name))
        return (
            type.length &&
                ((file2 = file2.slice(0, file2.size, type)),
                (file2.name = name2),
                (file2.lastModifiedDate = date)),
            file2
        )
    },
    isDirectoryEntry = (item2) =>
        isEntry(item2) && (getAsEntry(item2) || {}).isDirectory,
    isEntry = (item2) => 'webkitGetAsEntry' in item2,
    getAsEntry = (item2) => item2.webkitGetAsEntry(),
    getLinks = (dataTransfer) => {
        let links = []
        try {
            if (
                ((links = getLinksFromTransferMetaData(dataTransfer)),
                links.length)
            )
                return links
            links = getLinksFromTransferURLData(dataTransfer)
        } catch (e) {}
        return links
    },
    getLinksFromTransferURLData = (dataTransfer) => {
        let data3 = dataTransfer.getData('url')
        return typeof data3 == 'string' && data3.length ? [data3] : []
    },
    getLinksFromTransferMetaData = (dataTransfer) => {
        let data3 = dataTransfer.getData('text/html')
        if (typeof data3 == 'string' && data3.length) {
            let matches = data3.match(/src\s*=\s*"(.+?)"/)
            if (matches) return [matches[1]]
        }
        return []
    },
    dragNDropObservers = [],
    eventPosition = (e) => ({
        pageLeft: e.pageX,
        pageTop: e.pageY,
        scopeLeft: e.offsetX || e.layerX,
        scopeTop: e.offsetY || e.layerY,
    }),
    createDragNDropClient = (element, scopeToObserve, filterElement) => {
        let observer = getDragNDropObserver(scopeToObserve),
            client = {
                element,
                filterElement,
                state: null,
                ondrop: () => {},
                onenter: () => {},
                ondrag: () => {},
                onexit: () => {},
                onload: () => {},
                allowdrop: () => {},
            }
        return (client.destroy = observer.addListener(client)), client
    },
    getDragNDropObserver = (element) => {
        let observer = dragNDropObservers.find(
            (item2) => item2.element === element,
        )
        if (observer) return observer
        let newObserver = createDragNDropObserver(element)
        return dragNDropObservers.push(newObserver), newObserver
    },
    createDragNDropObserver = (element) => {
        let clients = [],
            routes = { dragenter, dragover, dragleave, drop },
            handlers = {}
        forin(routes, (event, createHandler) => {
            ;(handlers[event] = createHandler(element, clients)),
                element.addEventListener(event, handlers[event], !1)
        })
        let observer = {
            element,
            addListener: (client) => (
                clients.push(client),
                () => {
                    clients.splice(clients.indexOf(client), 1),
                        clients.length === 0 &&
                            (dragNDropObservers.splice(
                                dragNDropObservers.indexOf(observer),
                                1,
                            ),
                            forin(routes, (event) => {
                                element.removeEventListener(
                                    event,
                                    handlers[event],
                                    !1,
                                )
                            }))
                }
            ),
        }
        return observer
    },
    elementFromPoint = (root2, point) => (
        'elementFromPoint' in root2 || (root2 = document),
        root2.elementFromPoint(point.x, point.y)
    ),
    isEventTarget = (e, target) => {
        let root2 = getRootNode(target),
            elementAtPosition = elementFromPoint(root2, {
                x: e.pageX - window.pageXOffset,
                y: e.pageY - window.pageYOffset,
            })
        return (
            elementAtPosition === target || target.contains(elementAtPosition)
        )
    },
    initialTarget = null,
    setDropEffect = (dataTransfer, effect) => {
        try {
            dataTransfer.dropEffect = effect
        } catch (e) {}
    },
    dragenter = (root2, clients) => (e) => {
        e.preventDefault(),
            (initialTarget = e.target),
            clients.forEach((client) => {
                let { element, onenter } = client
                isEventTarget(e, element) &&
                    ((client.state = 'enter'), onenter(eventPosition(e)))
            })
    },
    dragover = (root2, clients) => (e) => {
        e.preventDefault()
        let dataTransfer = e.dataTransfer
        requestDataTransferItems(dataTransfer).then((items) => {
            let overDropTarget = !1
            clients.some((client) => {
                let {
                    filterElement,
                    element,
                    onenter,
                    onexit,
                    ondrag,
                    allowdrop,
                } = client
                setDropEffect(dataTransfer, 'copy')
                let allowsTransfer = allowdrop(items)
                if (!allowsTransfer) {
                    setDropEffect(dataTransfer, 'none')
                    return
                }
                if (isEventTarget(e, element)) {
                    if (((overDropTarget = !0), client.state === null)) {
                        ;(client.state = 'enter'), onenter(eventPosition(e))
                        return
                    }
                    if (
                        ((client.state = 'over'),
                        filterElement && !allowsTransfer)
                    ) {
                        setDropEffect(dataTransfer, 'none')
                        return
                    }
                    ondrag(eventPosition(e))
                } else
                    filterElement &&
                        !overDropTarget &&
                        setDropEffect(dataTransfer, 'none'),
                        client.state &&
                            ((client.state = null), onexit(eventPosition(e)))
            })
        })
    },
    drop = (root2, clients) => (e) => {
        e.preventDefault()
        let dataTransfer = e.dataTransfer
        requestDataTransferItems(dataTransfer).then((items) => {
            clients.forEach((client) => {
                let { filterElement, element, ondrop, onexit, allowdrop } =
                    client
                if (
                    ((client.state = null),
                    !(filterElement && !isEventTarget(e, element)))
                ) {
                    if (!allowdrop(items)) return onexit(eventPosition(e))
                    ondrop(eventPosition(e), items)
                }
            })
        })
    },
    dragleave = (root2, clients) => (e) => {
        initialTarget === e.target &&
            clients.forEach((client) => {
                let { onexit } = client
                ;(client.state = null), onexit(eventPosition(e))
            })
    },
    createHopper = (scope, validateItems, options) => {
        scope.classList.add('filepond--hopper')
        let {
                catchesDropsOnPage,
                requiresDropOnElement,
                filterItems = (items) => items,
            } = options,
            client = createDragNDropClient(
                scope,
                catchesDropsOnPage ? document.documentElement : scope,
                requiresDropOnElement,
            ),
            lastState = '',
            currentState = ''
        ;(client.allowdrop = (items) => validateItems(filterItems(items))),
            (client.ondrop = (position, items) => {
                let filteredItems = filterItems(items)
                if (!validateItems(filteredItems)) {
                    api.ondragend(position)
                    return
                }
                ;(currentState = 'drag-drop'),
                    api.onload(filteredItems, position)
            }),
            (client.ondrag = (position) => {
                api.ondrag(position)
            }),
            (client.onenter = (position) => {
                ;(currentState = 'drag-over'), api.ondragstart(position)
            }),
            (client.onexit = (position) => {
                ;(currentState = 'drag-exit'), api.ondragend(position)
            })
        let api = {
            updateHopperState: () => {
                lastState !== currentState &&
                    ((scope.dataset.hopperState = currentState),
                    (lastState = currentState))
            },
            onload: () => {},
            ondragstart: () => {},
            ondrag: () => {},
            ondragend: () => {},
            destroy: () => {
                client.destroy()
            },
        }
        return api
    },
    listening = !1,
    listeners$1 = [],
    handlePaste = (e) => {
        let activeEl = document.activeElement
        if (activeEl && /textarea|input/i.test(activeEl.nodeName)) {
            let inScope = !1,
                element = activeEl
            for (; element !== document.body; ) {
                if (element.classList.contains('filepond--root')) {
                    inScope = !0
                    break
                }
                element = element.parentNode
            }
            if (!inScope) return
        }
        requestDataTransferItems(e.clipboardData).then((files) => {
            !files.length || listeners$1.forEach((listener) => listener(files))
        })
    },
    listen = (cb) => {
        listeners$1.includes(cb) ||
            (listeners$1.push(cb),
            !listening &&
                ((listening = !0),
                document.addEventListener('paste', handlePaste)))
    },
    unlisten = (listener) => {
        arrayRemove(listeners$1, listeners$1.indexOf(listener)),
            listeners$1.length === 0 &&
                (document.removeEventListener('paste', handlePaste),
                (listening = !1))
    },
    createPaster = () => {
        let cb = (files) => {
                api.onload(files)
            },
            api = {
                destroy: () => {
                    unlisten(cb)
                },
                onload: () => {},
            }
        return listen(cb), api
    },
    create$d = ({ root: root2, props }) => {
        ;(root2.element.id = `filepond--assistant-${props.id}`),
            attr(root2.element, 'role', 'status'),
            attr(root2.element, 'aria-live', 'polite'),
            attr(root2.element, 'aria-relevant', 'additions')
    },
    addFilesNotificationTimeout = null,
    notificationClearTimeout = null,
    filenames = [],
    assist = (root2, message) => {
        root2.element.textContent = message
    },
    clear$1 = (root2) => {
        root2.element.textContent = ''
    },
    listModified = (root2, filename, label) => {
        let total = root2.query('GET_TOTAL_ITEMS')
        assist(
            root2,
            `${label} ${filename}, ${total} ${
                total === 1
                    ? root2.query('GET_LABEL_FILE_COUNT_SINGULAR')
                    : root2.query('GET_LABEL_FILE_COUNT_PLURAL')
            }`,
        ),
            clearTimeout(notificationClearTimeout),
            (notificationClearTimeout = setTimeout(() => {
                clear$1(root2)
            }, 1500))
    },
    isUsingFilePond = (root2) =>
        root2.element.parentNode.contains(document.activeElement),
    itemAdded = ({ root: root2, action }) => {
        if (!isUsingFilePond(root2)) return
        root2.element.textContent = ''
        let item2 = root2.query('GET_ITEM', action.id)
        filenames.push(item2.filename),
            clearTimeout(addFilesNotificationTimeout),
            (addFilesNotificationTimeout = setTimeout(() => {
                listModified(
                    root2,
                    filenames.join(', '),
                    root2.query('GET_LABEL_FILE_ADDED'),
                ),
                    (filenames.length = 0)
            }, 750))
    },
    itemRemoved = ({ root: root2, action }) => {
        if (!isUsingFilePond(root2)) return
        let item2 = action.item
        listModified(
            root2,
            item2.filename,
            root2.query('GET_LABEL_FILE_REMOVED'),
        )
    },
    itemProcessed = ({ root: root2, action }) => {
        let filename = root2.query('GET_ITEM', action.id).filename,
            label = root2.query('GET_LABEL_FILE_PROCESSING_COMPLETE')
        assist(root2, `${filename} ${label}`)
    },
    itemProcessedUndo = ({ root: root2, action }) => {
        let filename = root2.query('GET_ITEM', action.id).filename,
            label = root2.query('GET_LABEL_FILE_PROCESSING_ABORTED')
        assist(root2, `${filename} ${label}`)
    },
    itemError = ({ root: root2, action }) => {
        let filename = root2.query('GET_ITEM', action.id).filename
        assist(root2, `${action.status.main} ${filename} ${action.status.sub}`)
    },
    assistant = createView({
        create: create$d,
        ignoreRect: !0,
        ignoreRectUpdate: !0,
        write: createRoute({
            DID_LOAD_ITEM: itemAdded,
            DID_REMOVE_ITEM: itemRemoved,
            DID_COMPLETE_ITEM_PROCESSING: itemProcessed,
            DID_ABORT_ITEM_PROCESSING: itemProcessedUndo,
            DID_REVERT_ITEM_PROCESSING: itemProcessedUndo,
            DID_THROW_ITEM_REMOVE_ERROR: itemError,
            DID_THROW_ITEM_LOAD_ERROR: itemError,
            DID_THROW_ITEM_INVALID: itemError,
            DID_THROW_ITEM_PROCESSING_ERROR: itemError,
        }),
        tag: 'span',
        name: 'assistant',
    }),
    toCamels = (string, separator = '-') =>
        string.replace(new RegExp(`${separator}.`, 'g'), (sub) =>
            sub.charAt(1).toUpperCase(),
        ),
    debounce = (func, interval = 16, immidiateOnly = !0) => {
        let last = Date.now(),
            timeout = null
        return (...args) => {
            clearTimeout(timeout)
            let dist = Date.now() - last,
                fn2 = () => {
                    ;(last = Date.now()), func(...args)
                }
            dist < interval
                ? immidiateOnly || (timeout = setTimeout(fn2, interval - dist))
                : fn2()
        }
    },
    MAX_FILES_LIMIT = 1e6,
    prevent = (e) => e.preventDefault(),
    create$e = ({ root: root2, props }) => {
        let id = root2.query('GET_ID')
        id && (root2.element.id = id)
        let className = root2.query('GET_CLASS_NAME')
        className &&
            className
                .split(' ')
                .filter((name2) => name2.length)
                .forEach((name2) => {
                    root2.element.classList.add(name2)
                }),
            (root2.ref.label = root2.appendChildView(
                root2.createChildView(dropLabel, {
                    ...props,
                    translateY: null,
                    caption: root2.query('GET_LABEL_IDLE'),
                }),
            )),
            (root2.ref.list = root2.appendChildView(
                root2.createChildView(listScroller, { translateY: null }),
            )),
            (root2.ref.panel = root2.appendChildView(
                root2.createChildView(panel, { name: 'panel-root' }),
            )),
            (root2.ref.assistant = root2.appendChildView(
                root2.createChildView(assistant, { ...props }),
            )),
            (root2.ref.data = root2.appendChildView(
                root2.createChildView(data2, { ...props }),
            )),
            (root2.ref.measure = createElement$1('div')),
            (root2.ref.measure.style.height = '100%'),
            root2.element.appendChild(root2.ref.measure),
            (root2.ref.bounds = null),
            root2
                .query('GET_STYLES')
                .filter((style) => !isEmpty(style.value))
                .map(({ name: name2, value }) => {
                    root2.element.dataset[name2] = value
                }),
            (root2.ref.widthPrevious = null),
            (root2.ref.widthUpdated = debounce(() => {
                ;(root2.ref.updateHistory = []),
                    root2.dispatch('DID_RESIZE_ROOT')
            }, 250)),
            (root2.ref.previousAspectRatio = null),
            (root2.ref.updateHistory = [])
        let canHover = window.matchMedia(
                '(pointer: fine) and (hover: hover)',
            ).matches,
            hasPointerEvents = 'PointerEvent' in window
        root2.query('GET_ALLOW_REORDER') &&
            hasPointerEvents &&
            !canHover &&
            (root2.element.addEventListener('touchmove', prevent, {
                passive: !1,
            }),
            root2.element.addEventListener('gesturestart', prevent))
        let credits = root2.query('GET_CREDITS')
        if (credits.length === 2) {
            let frag = document.createElement('a')
            ;(frag.className = 'filepond--credits'),
                frag.setAttribute('aria-hidden', 'true'),
                (frag.href = credits[0]),
                (frag.tabindex = -1),
                (frag.target = '_blank'),
                (frag.rel = 'noopener noreferrer'),
                (frag.textContent = credits[1]),
                root2.element.appendChild(frag),
                (root2.ref.credits = frag)
        }
    },
    write$9 = ({ root: root2, props, actions: actions2 }) => {
        if (
            (route$5({ root: root2, props, actions: actions2 }),
            actions2
                .filter((action) => /^DID_SET_STYLE_/.test(action.type))
                .filter((action) => !isEmpty(action.data.value))
                .map(({ type, data: data3 }) => {
                    let name2 = toCamels(type.substring(8).toLowerCase(), '_')
                    ;(root2.element.dataset[name2] = data3.value),
                        root2.invalidateLayout()
                }),
            root2.rect.element.hidden)
        )
            return
        root2.rect.element.width !== root2.ref.widthPrevious &&
            ((root2.ref.widthPrevious = root2.rect.element.width),
            root2.ref.widthUpdated())
        let bounds = root2.ref.bounds
        bounds ||
            ((bounds = root2.ref.bounds =
                calculateRootBoundingBoxHeight(root2)),
            root2.element.removeChild(root2.ref.measure),
            (root2.ref.measure = null))
        let { hopper, label, list: list2, panel: panel2 } = root2.ref
        hopper && hopper.updateHopperState()
        let aspectRatio = root2.query('GET_PANEL_ASPECT_RATIO'),
            isMultiItem = root2.query('GET_ALLOW_MULTIPLE'),
            totalItems = root2.query('GET_TOTAL_ITEMS'),
            maxItems = isMultiItem
                ? root2.query('GET_MAX_FILES') || MAX_FILES_LIMIT
                : 1,
            atMaxCapacity = totalItems === maxItems,
            addAction = actions2.find(
                (action) => action.type === 'DID_ADD_ITEM',
            )
        if (atMaxCapacity && addAction) {
            let interactionMethod = addAction.data.interactionMethod
            ;(label.opacity = 0),
                isMultiItem
                    ? (label.translateY = -40)
                    : interactionMethod === InteractionMethod.API
                    ? (label.translateX = 40)
                    : interactionMethod === InteractionMethod.BROWSE
                    ? (label.translateY = 40)
                    : (label.translateY = 30)
        } else
            atMaxCapacity ||
                ((label.opacity = 1),
                (label.translateX = 0),
                (label.translateY = 0))
        let listItemMargin = calculateListItemMargin(root2),
            listHeight = calculateListHeight(root2),
            labelHeight = label.rect.element.height,
            currentLabelHeight =
                !isMultiItem || atMaxCapacity ? 0 : labelHeight,
            listMarginTop = atMaxCapacity ? list2.rect.element.marginTop : 0,
            listMarginBottom =
                totalItems === 0 ? 0 : list2.rect.element.marginBottom,
            visualHeight =
                currentLabelHeight +
                listMarginTop +
                listHeight.visual +
                listMarginBottom,
            boundsHeight =
                currentLabelHeight +
                listMarginTop +
                listHeight.bounds +
                listMarginBottom
        if (
            ((list2.translateY =
                Math.max(0, currentLabelHeight - list2.rect.element.marginTop) -
                listItemMargin.top),
            aspectRatio)
        ) {
            let width = root2.rect.element.width,
                height = width * aspectRatio
            aspectRatio !== root2.ref.previousAspectRatio &&
                ((root2.ref.previousAspectRatio = aspectRatio),
                (root2.ref.updateHistory = []))
            let history = root2.ref.updateHistory
            history.push(width)
            let MAX_BOUNCES = 2
            if (history.length > MAX_BOUNCES * 2) {
                let l = history.length,
                    bottom = l - 10,
                    bounces = 0
                for (let i = l; i >= bottom; i--)
                    if (
                        (history[i] === history[i - 2] && bounces++,
                        bounces >= MAX_BOUNCES)
                    )
                        return
            }
            ;(panel2.scalable = !1), (panel2.height = height)
            let listAvailableHeight =
                height -
                currentLabelHeight -
                (listMarginBottom - listItemMargin.bottom) -
                (atMaxCapacity ? listMarginTop : 0)
            listHeight.visual > listAvailableHeight
                ? (list2.overflow = listAvailableHeight)
                : (list2.overflow = null),
                (root2.height = height)
        } else if (bounds.fixedHeight) {
            panel2.scalable = !1
            let listAvailableHeight =
                bounds.fixedHeight -
                currentLabelHeight -
                (listMarginBottom - listItemMargin.bottom) -
                (atMaxCapacity ? listMarginTop : 0)
            listHeight.visual > listAvailableHeight
                ? (list2.overflow = listAvailableHeight)
                : (list2.overflow = null)
        } else if (bounds.cappedHeight) {
            let isCappedHeight = visualHeight >= bounds.cappedHeight,
                panelHeight = Math.min(bounds.cappedHeight, visualHeight)
            ;(panel2.scalable = !0),
                (panel2.height = isCappedHeight
                    ? panelHeight
                    : panelHeight - listItemMargin.top - listItemMargin.bottom)
            let listAvailableHeight =
                panelHeight -
                currentLabelHeight -
                (listMarginBottom - listItemMargin.bottom) -
                (atMaxCapacity ? listMarginTop : 0)
            visualHeight > bounds.cappedHeight &&
            listHeight.visual > listAvailableHeight
                ? (list2.overflow = listAvailableHeight)
                : (list2.overflow = null),
                (root2.height = Math.min(
                    bounds.cappedHeight,
                    boundsHeight - listItemMargin.top - listItemMargin.bottom,
                ))
        } else {
            let itemMargin =
                totalItems > 0 ? listItemMargin.top + listItemMargin.bottom : 0
            ;(panel2.scalable = !0),
                (panel2.height = Math.max(
                    labelHeight,
                    visualHeight - itemMargin,
                )),
                (root2.height = Math.max(
                    labelHeight,
                    boundsHeight - itemMargin,
                ))
        }
        root2.ref.credits &&
            panel2.heightCurrent &&
            (root2.ref.credits.style.transform = `translateY(${panel2.heightCurrent}px)`)
    },
    calculateListItemMargin = (root2) => {
        let item2 = root2.ref.list.childViews[0].childViews[0]
        return item2
            ? {
                  top: item2.rect.element.marginTop,
                  bottom: item2.rect.element.marginBottom,
              }
            : { top: 0, bottom: 0 }
    },
    calculateListHeight = (root2) => {
        let visual = 0,
            bounds = 0,
            scrollList = root2.ref.list,
            itemList = scrollList.childViews[0],
            visibleChildren = itemList.childViews.filter(
                (child) => child.rect.element.height,
            ),
            children = root2
                .query('GET_ACTIVE_ITEMS')
                .map((item2) =>
                    visibleChildren.find((child) => child.id === item2.id),
                )
                .filter((item2) => item2)
        if (children.length === 0) return { visual, bounds }
        let horizontalSpace = itemList.rect.element.width,
            dragIndex = getItemIndexByPosition(
                itemList,
                children,
                scrollList.dragCoordinates,
            ),
            childRect = children[0].rect.element,
            itemVerticalMargin = childRect.marginTop + childRect.marginBottom,
            itemHorizontalMargin = childRect.marginLeft + childRect.marginRight,
            itemWidth = childRect.width + itemHorizontalMargin,
            itemHeight = childRect.height + itemVerticalMargin,
            newItem = typeof dragIndex != 'undefined' && dragIndex >= 0 ? 1 : 0,
            removedItem = children.find(
                (child) => child.markedForRemoval && child.opacity < 0.45,
            )
                ? -1
                : 0,
            verticalItemCount = children.length + newItem + removedItem,
            itemsPerRow = getItemsPerRow(horizontalSpace, itemWidth)
        return (
            itemsPerRow === 1
                ? children.forEach((item2) => {
                      let height =
                          item2.rect.element.height + itemVerticalMargin
                      ;(bounds += height), (visual += height * item2.opacity)
                  })
                : ((bounds =
                      Math.ceil(verticalItemCount / itemsPerRow) * itemHeight),
                  (visual = bounds)),
            { visual, bounds }
        )
    },
    calculateRootBoundingBoxHeight = (root2) => {
        let height = root2.ref.measureHeight || null
        return {
            cappedHeight: parseInt(root2.style.maxHeight, 10) || null,
            fixedHeight: height === 0 ? null : height,
        }
    },
    exceedsMaxFiles = (root2, items) => {
        let allowReplace = root2.query('GET_ALLOW_REPLACE'),
            allowMultiple = root2.query('GET_ALLOW_MULTIPLE'),
            totalItems = root2.query('GET_TOTAL_ITEMS'),
            maxItems = root2.query('GET_MAX_FILES'),
            totalBrowseItems = items.length
        return !allowMultiple && totalBrowseItems > 1
            ? (root2.dispatch('DID_THROW_MAX_FILES', {
                  source: items,
                  error: createResponse('warning', 0, 'Max files'),
              }),
              !0)
            : ((maxItems = allowMultiple ? maxItems : 1),
              !allowMultiple && allowReplace
                  ? !1
                  : isInt(maxItems) && totalItems + totalBrowseItems > maxItems
                  ? (root2.dispatch('DID_THROW_MAX_FILES', {
                        source: items,
                        error: createResponse('warning', 0, 'Max files'),
                    }),
                    !0)
                  : !1)
    },
    getDragIndex = (list2, children, position) => {
        let itemList = list2.childViews[0]
        return getItemIndexByPosition(itemList, children, {
            left: position.scopeLeft - itemList.rect.element.left,
            top:
                position.scopeTop -
                (list2.rect.outer.top +
                    list2.rect.element.marginTop +
                    list2.rect.element.scrollTop),
        })
    },
    toggleDrop = (root2) => {
        let isAllowed = root2.query('GET_ALLOW_DROP'),
            isDisabled = root2.query('GET_DISABLED'),
            enabled = isAllowed && !isDisabled
        if (enabled && !root2.ref.hopper) {
            let hopper = createHopper(
                root2.element,
                (items) => {
                    let beforeDropFile =
                        root2.query('GET_BEFORE_DROP_FILE') || (() => !0)
                    return root2.query('GET_DROP_VALIDATION')
                        ? items.every(
                              (item2) =>
                                  applyFilters('ALLOW_HOPPER_ITEM', item2, {
                                      query: root2.query,
                                  }).every((result) => result === !0) &&
                                  beforeDropFile(item2),
                          )
                        : !0
                },
                {
                    filterItems: (items) => {
                        let ignoredFiles = root2.query('GET_IGNORED_FILES')
                        return items.filter((item2) =>
                            isFile(item2)
                                ? !ignoredFiles.includes(
                                      item2.name.toLowerCase(),
                                  )
                                : !0,
                        )
                    },
                    catchesDropsOnPage: root2.query('GET_DROP_ON_PAGE'),
                    requiresDropOnElement: root2.query('GET_DROP_ON_ELEMENT'),
                },
            )
            ;(hopper.onload = (items, position) => {
                let visibleChildren =
                        root2.ref.list.childViews[0].childViews.filter(
                            (child) => child.rect.element.height,
                        ),
                    children = root2
                        .query('GET_ACTIVE_ITEMS')
                        .map((item2) =>
                            visibleChildren.find(
                                (child) => child.id === item2.id,
                            ),
                        )
                        .filter((item2) => item2)
                applyFilterChain('ADD_ITEMS', items, {
                    dispatch: root2.dispatch,
                }).then((queue) => {
                    if (exceedsMaxFiles(root2, queue)) return !1
                    root2.dispatch('ADD_ITEMS', {
                        items: queue,
                        index: getDragIndex(root2.ref.list, children, position),
                        interactionMethod: InteractionMethod.DROP,
                    })
                }),
                    root2.dispatch('DID_DROP', { position }),
                    root2.dispatch('DID_END_DRAG', { position })
            }),
                (hopper.ondragstart = (position) => {
                    root2.dispatch('DID_START_DRAG', { position })
                }),
                (hopper.ondrag = debounce((position) => {
                    root2.dispatch('DID_DRAG', { position })
                })),
                (hopper.ondragend = (position) => {
                    root2.dispatch('DID_END_DRAG', { position })
                }),
                (root2.ref.hopper = hopper),
                (root2.ref.drip = root2.appendChildView(
                    root2.createChildView(drip),
                ))
        } else
            !enabled &&
                root2.ref.hopper &&
                (root2.ref.hopper.destroy(),
                (root2.ref.hopper = null),
                root2.removeChildView(root2.ref.drip))
    },
    toggleBrowse = (root2, props) => {
        let isAllowed = root2.query('GET_ALLOW_BROWSE'),
            isDisabled = root2.query('GET_DISABLED'),
            enabled = isAllowed && !isDisabled
        enabled && !root2.ref.browser
            ? (root2.ref.browser = root2.appendChildView(
                  root2.createChildView(browser, {
                      ...props,
                      onload: (items) => {
                          applyFilterChain('ADD_ITEMS', items, {
                              dispatch: root2.dispatch,
                          }).then((queue) => {
                              if (exceedsMaxFiles(root2, queue)) return !1
                              root2.dispatch('ADD_ITEMS', {
                                  items: queue,
                                  index: -1,
                                  interactionMethod: InteractionMethod.BROWSE,
                              })
                          })
                      },
                  }),
                  0,
              ))
            : !enabled &&
              root2.ref.browser &&
              (root2.removeChildView(root2.ref.browser),
              (root2.ref.browser = null))
    },
    togglePaste = (root2) => {
        let isAllowed = root2.query('GET_ALLOW_PASTE'),
            isDisabled = root2.query('GET_DISABLED'),
            enabled = isAllowed && !isDisabled
        enabled && !root2.ref.paster
            ? ((root2.ref.paster = createPaster()),
              (root2.ref.paster.onload = (items) => {
                  applyFilterChain('ADD_ITEMS', items, {
                      dispatch: root2.dispatch,
                  }).then((queue) => {
                      if (exceedsMaxFiles(root2, queue)) return !1
                      root2.dispatch('ADD_ITEMS', {
                          items: queue,
                          index: -1,
                          interactionMethod: InteractionMethod.PASTE,
                      })
                  })
              }))
            : !enabled &&
              root2.ref.paster &&
              (root2.ref.paster.destroy(), (root2.ref.paster = null))
    },
    route$5 = createRoute({
        DID_SET_ALLOW_BROWSE: ({ root: root2, props }) => {
            toggleBrowse(root2, props)
        },
        DID_SET_ALLOW_DROP: ({ root: root2 }) => {
            toggleDrop(root2)
        },
        DID_SET_ALLOW_PASTE: ({ root: root2 }) => {
            togglePaste(root2)
        },
        DID_SET_DISABLED: ({ root: root2, props }) => {
            toggleDrop(root2),
                togglePaste(root2),
                toggleBrowse(root2, props),
                root2.query('GET_DISABLED')
                    ? (root2.element.dataset.disabled = 'disabled')
                    : root2.element.removeAttribute('data-disabled')
        },
    }),
    root = createView({
        name: 'root',
        read: ({ root: root2 }) => {
            root2.ref.measure &&
                (root2.ref.measureHeight = root2.ref.measure.offsetHeight)
        },
        create: create$e,
        write: write$9,
        destroy: ({ root: root2 }) => {
            root2.ref.paster && root2.ref.paster.destroy(),
                root2.ref.hopper && root2.ref.hopper.destroy(),
                root2.element.removeEventListener('touchmove', prevent),
                root2.element.removeEventListener('gesturestart', prevent)
        },
        mixins: { styles: ['height'] },
    }),
    createApp = (initialOptions = {}) => {
        let originalElement = null,
            defaultOptions2 = getOptions(),
            store = createStore(
                createInitialState(defaultOptions2),
                [queries, createOptionQueries(defaultOptions2)],
                [actions, createOptionActions(defaultOptions2)],
            )
        store.dispatch('SET_OPTIONS', { options: initialOptions })
        let visibilityHandler = () => {
            document.hidden || store.dispatch('KICK')
        }
        document.addEventListener('visibilitychange', visibilityHandler)
        let resizeDoneTimer = null,
            isResizing = !1,
            isResizingHorizontally = !1,
            initialWindowWidth = null,
            currentWindowWidth = null,
            resizeHandler = () => {
                isResizing || (isResizing = !0),
                    clearTimeout(resizeDoneTimer),
                    (resizeDoneTimer = setTimeout(() => {
                        ;(isResizing = !1),
                            (initialWindowWidth = null),
                            (currentWindowWidth = null),
                            isResizingHorizontally &&
                                ((isResizingHorizontally = !1),
                                store.dispatch('DID_STOP_RESIZE'))
                    }, 500))
            }
        window.addEventListener('resize', resizeHandler)
        let view = root(store, { id: getUniqueId() }),
            isResting = !1,
            isHidden = !1,
            readWriteApi = {
                _read: () => {
                    isResizing &&
                        ((currentWindowWidth = window.innerWidth),
                        initialWindowWidth ||
                            (initialWindowWidth = currentWindowWidth),
                        !isResizingHorizontally &&
                            currentWindowWidth !== initialWindowWidth &&
                            (store.dispatch('DID_START_RESIZE'),
                            (isResizingHorizontally = !0))),
                        isHidden &&
                            isResting &&
                            (isResting = view.element.offsetParent === null),
                        !isResting &&
                            (view._read(),
                            (isHidden = view.rect.element.hidden))
                },
                _write: (ts) => {
                    let actions2 = store
                        .processActionQueue()
                        .filter((action) => !/^SET_/.test(action.type))
                    ;(isResting && !actions2.length) ||
                        (routeActionsToEvents(actions2),
                        (isResting = view._write(
                            ts,
                            actions2,
                            isResizingHorizontally,
                        )),
                        removeReleasedItems(store.query('GET_ITEMS')),
                        isResting && store.processDispatchQueue())
                },
            },
            createEvent = (name2) => (data3) => {
                let event = { type: name2 }
                if (!data3) return event
                if (
                    (data3.hasOwnProperty('error') &&
                        (event.error = data3.error ? { ...data3.error } : null),
                    data3.status && (event.status = { ...data3.status }),
                    data3.file && (event.output = data3.file),
                    data3.source)
                )
                    event.file = data3.source
                else if (data3.item || data3.id) {
                    let item2 = data3.item
                        ? data3.item
                        : store.query('GET_ITEM', data3.id)
                    event.file = item2 ? createItemAPI(item2) : null
                }
                return (
                    data3.items &&
                        (event.items = data3.items.map(createItemAPI)),
                    /progress/.test(name2) && (event.progress = data3.progress),
                    data3.hasOwnProperty('origin') &&
                        data3.hasOwnProperty('target') &&
                        ((event.origin = data3.origin),
                        (event.target = data3.target)),
                    event
                )
            },
            eventRoutes = {
                DID_DESTROY: createEvent('destroy'),
                DID_INIT: createEvent('init'),
                DID_THROW_MAX_FILES: createEvent('warning'),
                DID_INIT_ITEM: createEvent('initfile'),
                DID_START_ITEM_LOAD: createEvent('addfilestart'),
                DID_UPDATE_ITEM_LOAD_PROGRESS: createEvent('addfileprogress'),
                DID_LOAD_ITEM: createEvent('addfile'),
                DID_THROW_ITEM_INVALID: [
                    createEvent('error'),
                    createEvent('addfile'),
                ],
                DID_THROW_ITEM_LOAD_ERROR: [
                    createEvent('error'),
                    createEvent('addfile'),
                ],
                DID_THROW_ITEM_REMOVE_ERROR: [
                    createEvent('error'),
                    createEvent('removefile'),
                ],
                DID_PREPARE_OUTPUT: createEvent('preparefile'),
                DID_START_ITEM_PROCESSING: createEvent('processfilestart'),
                DID_UPDATE_ITEM_PROCESS_PROGRESS: createEvent(
                    'processfileprogress',
                ),
                DID_ABORT_ITEM_PROCESSING: createEvent('processfileabort'),
                DID_COMPLETE_ITEM_PROCESSING: createEvent('processfile'),
                DID_COMPLETE_ITEM_PROCESSING_ALL: createEvent('processfiles'),
                DID_REVERT_ITEM_PROCESSING: createEvent('processfilerevert'),
                DID_THROW_ITEM_PROCESSING_ERROR: [
                    createEvent('error'),
                    createEvent('processfile'),
                ],
                DID_REMOVE_ITEM: createEvent('removefile'),
                DID_UPDATE_ITEMS: createEvent('updatefiles'),
                DID_ACTIVATE_ITEM: createEvent('activatefile'),
                DID_REORDER_ITEMS: createEvent('reorderfiles'),
            },
            exposeEvent = (event) => {
                let detail = { pond: exports, ...event }
                delete detail.type,
                    view.element.dispatchEvent(
                        new CustomEvent(`FilePond:${event.type}`, {
                            detail,
                            bubbles: !0,
                            cancelable: !0,
                            composed: !0,
                        }),
                    )
                let params = []
                event.hasOwnProperty('error') && params.push(event.error),
                    event.hasOwnProperty('file') && params.push(event.file)
                let filtered = ['type', 'error', 'file']
                Object.keys(event)
                    .filter((key) => !filtered.includes(key))
                    .forEach((key) => params.push(event[key])),
                    exports.fire(event.type, ...params)
                let handler = store.query(`GET_ON${event.type.toUpperCase()}`)
                handler && handler(...params)
            },
            routeActionsToEvents = (actions2) => {
                !actions2.length ||
                    actions2
                        .filter((action) => eventRoutes[action.type])
                        .forEach((action) => {
                            let routes = eventRoutes[action.type]
                            ;(Array.isArray(routes)
                                ? routes
                                : [routes]
                            ).forEach((route2) => {
                                action.type === 'DID_INIT_ITEM'
                                    ? exposeEvent(route2(action.data))
                                    : setTimeout(() => {
                                          exposeEvent(route2(action.data))
                                      }, 0)
                            })
                        })
            },
            setOptions2 = (options) =>
                store.dispatch('SET_OPTIONS', { options }),
            getFile = (query) => store.query('GET_ACTIVE_ITEM', query),
            prepareFile = (query) =>
                new Promise((resolve, reject) => {
                    store.dispatch('REQUEST_ITEM_PREPARE', {
                        query,
                        success: (item2) => {
                            resolve(item2)
                        },
                        failure: (error2) => {
                            reject(error2)
                        },
                    })
                }),
            addFile = (source, options = {}) =>
                new Promise((resolve, reject) => {
                    addFiles([{ source, options }], { index: options.index })
                        .then((items) => resolve(items && items[0]))
                        .catch(reject)
                }),
            isFilePondFile = (obj) => obj.file && obj.id,
            removeFile = (query, options) => (
                typeof query == 'object' &&
                    !isFilePondFile(query) &&
                    !options &&
                    ((options = query), (query = void 0)),
                store.dispatch('REMOVE_ITEM', { ...options, query }),
                store.query('GET_ACTIVE_ITEM', query) === null
            ),
            addFiles = (...args) =>
                new Promise((resolve, reject) => {
                    let sources = [],
                        options = {}
                    if (isArray(args[0]))
                        sources.push.apply(sources, args[0]),
                            Object.assign(options, args[1] || {})
                    else {
                        let lastArgument = args[args.length - 1]
                        typeof lastArgument == 'object' &&
                            !(lastArgument instanceof Blob) &&
                            Object.assign(options, args.pop()),
                            sources.push(...args)
                    }
                    store.dispatch('ADD_ITEMS', {
                        items: sources,
                        index: options.index,
                        interactionMethod: InteractionMethod.API,
                        success: resolve,
                        failure: reject,
                    })
                }),
            getFiles2 = () => store.query('GET_ACTIVE_ITEMS'),
            processFile = (query) =>
                new Promise((resolve, reject) => {
                    store.dispatch('REQUEST_ITEM_PROCESSING', {
                        query,
                        success: (item2) => {
                            resolve(item2)
                        },
                        failure: (error2) => {
                            reject(error2)
                        },
                    })
                }),
            prepareFiles = (...args) => {
                let queries2 = Array.isArray(args[0]) ? args[0] : args,
                    items = queries2.length ? queries2 : getFiles2()
                return Promise.all(items.map(prepareFile))
            },
            processFiles = (...args) => {
                let queries2 = Array.isArray(args[0]) ? args[0] : args
                if (!queries2.length) {
                    let files = getFiles2().filter(
                        (item2) =>
                            !(
                                item2.status === ItemStatus.IDLE &&
                                item2.origin === FileOrigin.LOCAL
                            ) &&
                            item2.status !== ItemStatus.PROCESSING &&
                            item2.status !== ItemStatus.PROCESSING_COMPLETE &&
                            item2.status !== ItemStatus.PROCESSING_REVERT_ERROR,
                    )
                    return Promise.all(files.map(processFile))
                }
                return Promise.all(queries2.map(processFile))
            },
            removeFiles = (...args) => {
                let queries2 = Array.isArray(args[0]) ? args[0] : args,
                    options
                typeof queries2[queries2.length - 1] == 'object'
                    ? (options = queries2.pop())
                    : Array.isArray(args[0]) && (options = args[1])
                let files = getFiles2()
                return queries2.length
                    ? queries2
                          .map((query) =>
                              isNumber(query)
                                  ? files[query]
                                      ? files[query].id
                                      : null
                                  : query,
                          )
                          .filter((query) => query)
                          .map((q) => removeFile(q, options))
                    : Promise.all(
                          files.map((file2) => removeFile(file2, options)),
                      )
            },
            exports = {
                ...on(),
                ...readWriteApi,
                ...createOptionAPI(store, defaultOptions2),
                setOptions: setOptions2,
                addFile,
                addFiles,
                getFile,
                processFile,
                prepareFile,
                removeFile,
                moveFile: (query, index) =>
                    store.dispatch('MOVE_ITEM', { query, index }),
                getFiles: getFiles2,
                processFiles,
                removeFiles,
                prepareFiles,
                sort: (compare) => store.dispatch('SORT', { compare }),
                browse: () => {
                    var input = view.element.querySelector('input[type=file]')
                    input && input.click()
                },
                destroy: () => {
                    exports.fire('destroy', view.element),
                        store.dispatch('ABORT_ALL'),
                        view._destroy(),
                        window.removeEventListener('resize', resizeHandler),
                        document.removeEventListener(
                            'visibilitychange',
                            visibilityHandler,
                        ),
                        store.dispatch('DID_DESTROY')
                },
                insertBefore: (element) => insertBefore(view.element, element),
                insertAfter: (element) => insertAfter(view.element, element),
                appendTo: (element) => element.appendChild(view.element),
                replaceElement: (element) => {
                    insertBefore(view.element, element),
                        element.parentNode.removeChild(element),
                        (originalElement = element)
                },
                restoreElement: () => {
                    !originalElement ||
                        (insertAfter(originalElement, view.element),
                        view.element.parentNode.removeChild(view.element),
                        (originalElement = null))
                },
                isAttachedTo: (element) =>
                    view.element === element || originalElement === element,
                element: { get: () => view.element },
                status: { get: () => store.query('GET_STATUS') },
            }
        return store.dispatch('DID_INIT'), createObject(exports)
    },
    createAppObject = (customOptions = {}) => {
        let defaultOptions2 = {}
        return (
            forin(getOptions(), (key, value) => {
                defaultOptions2[key] = value[0]
            }),
            createApp({ ...defaultOptions2, ...customOptions })
        )
    },
    lowerCaseFirstLetter = (string) =>
        string.charAt(0).toLowerCase() + string.slice(1),
    attributeNameToPropertyName = (attributeName) =>
        toCamels(attributeName.replace(/^data-/, '')),
    mapObject = (object, propertyMap) => {
        forin(propertyMap, (selector, mapping) => {
            forin(object, (property, value) => {
                let selectorRegExp = new RegExp(selector)
                if (
                    !selectorRegExp.test(property) ||
                    (delete object[property], mapping === !1)
                )
                    return
                if (isString(mapping)) {
                    object[mapping] = value
                    return
                }
                let group = mapping.group
                isObject(mapping) && !object[group] && (object[group] = {}),
                    (object[group][
                        lowerCaseFirstLetter(
                            property.replace(selectorRegExp, ''),
                        )
                    ] = value)
            }),
                mapping.mapping &&
                    mapObject(object[mapping.group], mapping.mapping)
        })
    },
    getAttributesAsObject = (node, attributeMapping = {}) => {
        let attributes = []
        forin(node.attributes, (index) => {
            attributes.push(node.attributes[index])
        })
        let output = attributes
            .filter((attribute) => attribute.name)
            .reduce((obj, attribute) => {
                let value = attr(node, attribute.name)
                return (
                    (obj[attributeNameToPropertyName(attribute.name)] =
                        value === attribute.name ? !0 : value),
                    obj
                )
            }, {})
        return mapObject(output, attributeMapping), output
    },
    createAppAtElement = (element, options = {}) => {
        let attributeMapping = {
            '^class$': 'className',
            '^multiple$': 'allowMultiple',
            '^capture$': 'captureMethod',
            '^webkitdirectory$': 'allowDirectoriesOnly',
            '^server': {
                group: 'server',
                mapping: {
                    '^process': { group: 'process' },
                    '^revert': { group: 'revert' },
                    '^fetch': { group: 'fetch' },
                    '^restore': { group: 'restore' },
                    '^load': { group: 'load' },
                },
            },
            '^type$': !1,
            '^files$': !1,
        }
        applyFilters('SET_ATTRIBUTE_TO_OPTION_MAP', attributeMapping)
        let mergedOptions = { ...options },
            attributeOptions = getAttributesAsObject(
                element.nodeName === 'FIELDSET'
                    ? element.querySelector('input[type=file]')
                    : element,
                attributeMapping,
            )
        Object.keys(attributeOptions).forEach((key) => {
            isObject(attributeOptions[key])
                ? (isObject(mergedOptions[key]) || (mergedOptions[key] = {}),
                  Object.assign(mergedOptions[key], attributeOptions[key]))
                : (mergedOptions[key] = attributeOptions[key])
        }),
            (mergedOptions.files = (options.files || []).concat(
                Array.from(
                    element.querySelectorAll('input:not([type=file])'),
                ).map((input) => ({
                    source: input.value,
                    options: { type: input.dataset.type },
                })),
            ))
        let app = createAppObject(mergedOptions)
        return (
            element.files &&
                Array.from(element.files).forEach((file2) => {
                    app.addFile(file2)
                }),
            app.replaceElement(element),
            app
        )
    },
    createApp$1 = (...args) =>
        isNode(args[0])
            ? createAppAtElement(...args)
            : createAppObject(...args),
    PRIVATE_METHODS = ['fire', '_read', '_write'],
    createAppAPI = (app) => {
        let api = {}
        return copyObjectPropertiesToObject(app, api, PRIVATE_METHODS), api
    },
    replaceInString = (string, replacements) =>
        string.replace(
            /(?:{([a-zA-Z]+)})/g,
            (match, group) => replacements[group],
        ),
    createWorker = (fn2) => {
        let workerBlob = new Blob(['(', fn2.toString(), ')()'], {
                type: 'application/javascript',
            }),
            workerURL = URL.createObjectURL(workerBlob),
            worker = new Worker(workerURL)
        return {
            transfer: (message, cb) => {},
            post: (message, cb, transferList) => {
                let id = getUniqueId()
                ;(worker.onmessage = (e) => {
                    e.data.id === id && cb(e.data.message)
                }),
                    worker.postMessage({ id, message }, transferList)
            },
            terminate: () => {
                worker.terminate(), URL.revokeObjectURL(workerURL)
            },
        }
    },
    loadImage = (url) =>
        new Promise((resolve, reject) => {
            let img = new Image()
            ;(img.onload = () => {
                resolve(img)
            }),
                (img.onerror = (e) => {
                    reject(e)
                }),
                (img.src = url)
        }),
    renameFile = (file2, name2) => {
        let renamedFile = file2.slice(0, file2.size, file2.type)
        return (
            (renamedFile.lastModifiedDate = file2.lastModifiedDate),
            (renamedFile.name = name2),
            renamedFile
        )
    },
    copyFile = (file2) => renameFile(file2, file2.name),
    registeredPlugins = [],
    createAppPlugin = (plugin9) => {
        if (registeredPlugins.includes(plugin9)) return
        registeredPlugins.push(plugin9)
        let pluginOutline = plugin9({
            addFilter,
            utils: {
                Type,
                forin,
                isString,
                isFile,
                toNaturalFileSize,
                replaceInString,
                getExtensionFromFilename,
                getFilenameWithoutExtension,
                guesstimateMimeType,
                getFileFromBlob,
                getFilenameFromURL,
                createRoute,
                createWorker,
                createView,
                createItemAPI,
                loadImage,
                copyFile,
                renameFile,
                createBlob,
                applyFilterChain,
                text,
                getNumericAspectRatioFromString,
            },
            views: { fileActionButton },
        })
        extendDefaultOptions(pluginOutline.options)
    },
    isOperaMini = () =>
        Object.prototype.toString.call(window.operamini) ===
        '[object OperaMini]',
    hasPromises = () => 'Promise' in window,
    hasBlobSlice = () => 'slice' in Blob.prototype,
    hasCreateObjectURL = () =>
        'URL' in window && 'createObjectURL' in window.URL,
    hasVisibility = () => 'visibilityState' in document,
    hasTiming = () => 'performance' in window,
    hasCSSSupports = () => 'supports' in (window.CSS || {}),
    isIE11 = () => /MSIE|Trident/.test(window.navigator.userAgent),
    supported = (() => {
        let isSupported =
            isBrowser() &&
            !isOperaMini() &&
            hasVisibility() &&
            hasPromises() &&
            hasBlobSlice() &&
            hasCreateObjectURL() &&
            hasTiming() &&
            (hasCSSSupports() || isIE11())
        return () => isSupported
    })(),
    state = { apps: [] },
    name = 'filepond',
    fn = () => {},
    Status$1 = {},
    FileStatus = {},
    FileOrigin$1 = {},
    OptionTypes = {},
    create$f = fn,
    destroy = fn,
    parse = fn,
    find = fn,
    registerPlugin = fn,
    getOptions$1 = fn,
    setOptions$1 = fn
if (supported()) {
    createPainter(
        () => {
            state.apps.forEach((app) => app._read())
        },
        (ts) => {
            state.apps.forEach((app) => app._write(ts))
        },
    )
    let dispatch = () => {
        document.dispatchEvent(
            new CustomEvent('FilePond:loaded', {
                detail: {
                    supported,
                    create: create$f,
                    destroy,
                    parse,
                    find,
                    registerPlugin,
                    setOptions: setOptions$1,
                },
            }),
        ),
            document.removeEventListener('DOMContentLoaded', dispatch)
    }
    document.readyState !== 'loading'
        ? setTimeout(() => dispatch(), 0)
        : document.addEventListener('DOMContentLoaded', dispatch)
    let updateOptionTypes = () =>
        forin(getOptions(), (key, value) => {
            OptionTypes[key] = value[1]
        })
    ;(Status$1 = { ...Status }),
        (FileOrigin$1 = { ...FileOrigin }),
        (FileStatus = { ...ItemStatus }),
        (OptionTypes = {}),
        updateOptionTypes(),
        (create$f = (...args) => {
            let app = createApp$1(...args)
            return (
                app.on('destroy', destroy),
                state.apps.push(app),
                createAppAPI(app)
            )
        }),
        (destroy = (hook) => {
            let indexToRemove = state.apps.findIndex((app) =>
                app.isAttachedTo(hook),
            )
            return indexToRemove >= 0
                ? (state.apps.splice(indexToRemove, 1)[0].restoreElement(), !0)
                : !1
        }),
        (parse = (context) =>
            Array.from(context.querySelectorAll(`.${name}`))
                .filter(
                    (newHook) =>
                        !state.apps.find((app) => app.isAttachedTo(newHook)),
                )
                .map((hook) => create$f(hook))),
        (find = (hook) => {
            let app = state.apps.find((app2) => app2.isAttachedTo(hook))
            return app ? createAppAPI(app) : null
        }),
        (registerPlugin = (...plugins) => {
            plugins.forEach(createAppPlugin), updateOptionTypes()
        }),
        (getOptions$1 = () => {
            let opts = {}
            return (
                forin(getOptions(), (key, value) => {
                    opts[key] = value[0]
                }),
                opts
            )
        }),
        (setOptions$1 = (opts) => (
            isObject(opts) &&
                (state.apps.forEach((app) => {
                    app.setOptions(opts)
                }),
                setOptions(opts)),
            getOptions$1()
        ))
}
var plugin = ({ addFilter: addFilter2, utils }) => {
        let {
            Type: Type2,
            replaceInString: replaceInString2,
            toNaturalFileSize: toNaturalFileSize2,
        } = utils
        return (
            addFilter2('ALLOW_HOPPER_ITEM', (file2, { query }) => {
                if (!query('GET_ALLOW_FILE_SIZE_VALIDATION')) return !0
                let sizeMax = query('GET_MAX_FILE_SIZE')
                if (sizeMax !== null && file2.size > sizeMax) return !1
                let sizeMin = query('GET_MIN_FILE_SIZE')
                return !(sizeMin !== null && file2.size < sizeMin)
            }),
            addFilter2(
                'LOAD_FILE',
                (file2, { query }) =>
                    new Promise((resolve, reject) => {
                        if (!query('GET_ALLOW_FILE_SIZE_VALIDATION'))
                            return resolve(file2)
                        let fileFilter = query('GET_FILE_VALIDATE_SIZE_FILTER')
                        if (fileFilter && !fileFilter(file2))
                            return resolve(file2)
                        let sizeMax = query('GET_MAX_FILE_SIZE')
                        if (sizeMax !== null && file2.size > sizeMax) {
                            reject({
                                status: {
                                    main: query(
                                        'GET_LABEL_MAX_FILE_SIZE_EXCEEDED',
                                    ),
                                    sub: replaceInString2(
                                        query('GET_LABEL_MAX_FILE_SIZE'),
                                        {
                                            filesize: toNaturalFileSize2(
                                                sizeMax,
                                                '.',
                                                query('GET_FILE_SIZE_BASE'),
                                                query(
                                                    'GET_FILE_SIZE_LABELS',
                                                    query,
                                                ),
                                            ),
                                        },
                                    ),
                                },
                            })
                            return
                        }
                        let sizeMin = query('GET_MIN_FILE_SIZE')
                        if (sizeMin !== null && file2.size < sizeMin) {
                            reject({
                                status: {
                                    main: query(
                                        'GET_LABEL_MIN_FILE_SIZE_EXCEEDED',
                                    ),
                                    sub: replaceInString2(
                                        query('GET_LABEL_MIN_FILE_SIZE'),
                                        {
                                            filesize: toNaturalFileSize2(
                                                sizeMin,
                                                '.',
                                                query('GET_FILE_SIZE_BASE'),
                                                query(
                                                    'GET_FILE_SIZE_LABELS',
                                                    query,
                                                ),
                                            ),
                                        },
                                    ),
                                },
                            })
                            return
                        }
                        let totalSizeMax = query('GET_MAX_TOTAL_FILE_SIZE')
                        if (
                            totalSizeMax !== null &&
                            query('GET_ACTIVE_ITEMS').reduce(
                                (total, item2) => total + item2.fileSize,
                                0,
                            ) > totalSizeMax
                        ) {
                            reject({
                                status: {
                                    main: query(
                                        'GET_LABEL_MAX_TOTAL_FILE_SIZE_EXCEEDED',
                                    ),
                                    sub: replaceInString2(
                                        query('GET_LABEL_MAX_TOTAL_FILE_SIZE'),
                                        {
                                            filesize: toNaturalFileSize2(
                                                totalSizeMax,
                                                '.',
                                                query('GET_FILE_SIZE_BASE'),
                                                query(
                                                    'GET_FILE_SIZE_LABELS',
                                                    query,
                                                ),
                                            ),
                                        },
                                    ),
                                },
                            })
                            return
                        }
                        resolve(file2)
                    }),
            ),
            {
                options: {
                    allowFileSizeValidation: [!0, Type2.BOOLEAN],
                    maxFileSize: [null, Type2.INT],
                    minFileSize: [null, Type2.INT],
                    maxTotalFileSize: [null, Type2.INT],
                    fileValidateSizeFilter: [null, Type2.FUNCTION],
                    labelMinFileSizeExceeded: [
                        'File is too small',
                        Type2.STRING,
                    ],
                    labelMinFileSize: [
                        'Minimum file size is {filesize}',
                        Type2.STRING,
                    ],
                    labelMaxFileSizeExceeded: [
                        'File is too large',
                        Type2.STRING,
                    ],
                    labelMaxFileSize: [
                        'Maximum file size is {filesize}',
                        Type2.STRING,
                    ],
                    labelMaxTotalFileSizeExceeded: [
                        'Maximum total size exceeded',
                        Type2.STRING,
                    ],
                    labelMaxTotalFileSize: [
                        'Maximum total file size is {filesize}',
                        Type2.STRING,
                    ],
                },
            }
        )
    },
    isBrowser2 =
        typeof window != 'undefined' && typeof window.document != 'undefined'
isBrowser2 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin }),
    )
var filepond_plugin_file_validate_size_esm_default = plugin
var plugin2 = ({ addFilter: addFilter2, utils }) => {
        let {
                Type: Type2,
                isString: isString2,
                replaceInString: replaceInString2,
                guesstimateMimeType: guesstimateMimeType2,
                getExtensionFromFilename: getExtensionFromFilename2,
                getFilenameFromURL: getFilenameFromURL2,
            } = utils,
            mimeTypeMatchesWildCard = (mimeType, wildcard) => {
                let mimeTypeGroup = (/^[^/]+/.exec(mimeType) || []).pop(),
                    wildcardGroup = wildcard.slice(0, -2)
                return mimeTypeGroup === wildcardGroup
            },
            isValidMimeType = (acceptedTypes, userInputType) =>
                acceptedTypes.some((acceptedType) =>
                    /\*$/.test(acceptedType)
                        ? mimeTypeMatchesWildCard(userInputType, acceptedType)
                        : acceptedType === userInputType,
                ),
            getItemType = (item2) => {
                let type = ''
                if (isString2(item2)) {
                    let filename = getFilenameFromURL2(item2),
                        extension = getExtensionFromFilename2(filename)
                    extension && (type = guesstimateMimeType2(extension))
                } else type = item2.type
                return type
            },
            validateFile = (item2, acceptedFileTypes, typeDetector) => {
                if (acceptedFileTypes.length === 0) return !0
                let type = getItemType(item2)
                return typeDetector
                    ? new Promise((resolve, reject) => {
                          typeDetector(item2, type)
                              .then((detectedType) => {
                                  isValidMimeType(
                                      acceptedFileTypes,
                                      detectedType,
                                  )
                                      ? resolve()
                                      : reject()
                              })
                              .catch(reject)
                      })
                    : isValidMimeType(acceptedFileTypes, type)
            },
            applyMimeTypeMap = (map2) => (acceptedFileType) =>
                map2[acceptedFileType] === null
                    ? !1
                    : map2[acceptedFileType] || acceptedFileType
        return (
            addFilter2('SET_ATTRIBUTE_TO_OPTION_MAP', (map2) =>
                Object.assign(map2, { accept: 'acceptedFileTypes' }),
            ),
            addFilter2('ALLOW_HOPPER_ITEM', (file2, { query }) =>
                query('GET_ALLOW_FILE_TYPE_VALIDATION')
                    ? validateFile(file2, query('GET_ACCEPTED_FILE_TYPES'))
                    : !0,
            ),
            addFilter2(
                'LOAD_FILE',
                (file2, { query }) =>
                    new Promise((resolve, reject) => {
                        if (!query('GET_ALLOW_FILE_TYPE_VALIDATION')) {
                            resolve(file2)
                            return
                        }
                        let acceptedFileTypes = query(
                                'GET_ACCEPTED_FILE_TYPES',
                            ),
                            typeDetector = query(
                                'GET_FILE_VALIDATE_TYPE_DETECT_TYPE',
                            ),
                            validationResult = validateFile(
                                file2,
                                acceptedFileTypes,
                                typeDetector,
                            ),
                            handleRejection = () => {
                                let acceptedFileTypesMapped = acceptedFileTypes
                                        .map(
                                            applyMimeTypeMap(
                                                query(
                                                    'GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES_MAP',
                                                ),
                                            ),
                                        )
                                        .filter((label) => label !== !1),
                                    acceptedFileTypesMapped_unique =
                                        acceptedFileTypesMapped.filter(
                                            function (item2, index) {
                                                return (
                                                    acceptedFileTypesMapped.indexOf(
                                                        item2,
                                                    ) === index
                                                )
                                            },
                                        )
                                reject({
                                    status: {
                                        main: query(
                                            'GET_LABEL_FILE_TYPE_NOT_ALLOWED',
                                        ),
                                        sub: replaceInString2(
                                            query(
                                                'GET_FILE_VALIDATE_TYPE_LABEL_EXPECTED_TYPES',
                                            ),
                                            {
                                                allTypes:
                                                    acceptedFileTypesMapped_unique.join(
                                                        ', ',
                                                    ),
                                                allButLastType:
                                                    acceptedFileTypesMapped_unique
                                                        .slice(0, -1)
                                                        .join(', '),
                                                lastType:
                                                    acceptedFileTypesMapped_unique[
                                                        acceptedFileTypesMapped.length -
                                                            1
                                                    ],
                                            },
                                        ),
                                    },
                                })
                            }
                        if (typeof validationResult == 'boolean')
                            return validationResult
                                ? resolve(file2)
                                : handleRejection()
                        validationResult
                            .then(() => {
                                resolve(file2)
                            })
                            .catch(handleRejection)
                    }),
            ),
            {
                options: {
                    allowFileTypeValidation: [!0, Type2.BOOLEAN],
                    acceptedFileTypes: [[], Type2.ARRAY],
                    labelFileTypeNotAllowed: [
                        'File is of invalid type',
                        Type2.STRING,
                    ],
                    fileValidateTypeLabelExpectedTypes: [
                        'Expects {allButLastType} or {lastType}',
                        Type2.STRING,
                    ],
                    fileValidateTypeLabelExpectedTypesMap: [{}, Type2.OBJECT],
                    fileValidateTypeDetectType: [null, Type2.FUNCTION],
                },
            }
        )
    },
    isBrowser3 =
        typeof window != 'undefined' && typeof window.document != 'undefined'
isBrowser3 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin2 }),
    )
var filepond_plugin_file_validate_type_esm_default = plugin2
var isImage = (file2) => /^image/.test(file2.type),
    plugin3 = ({ addFilter: addFilter2, utils }) => {
        let {
                Type: Type2,
                isFile: isFile2,
                getNumericAspectRatioFromString:
                    getNumericAspectRatioFromString2,
            } = utils,
            allowCrop = (item2, query) =>
                !(!isImage(item2.file) || !query('GET_ALLOW_IMAGE_CROP')),
            isObject2 = (value) => typeof value == 'object',
            isNumber2 = (value) => typeof value == 'number',
            updateCrop = (item2, obj) =>
                item2.setMetadata(
                    'crop',
                    Object.assign({}, item2.getMetadata('crop'), obj),
                )
        return (
            addFilter2('DID_CREATE_ITEM', (item2, { query }) => {
                item2.extend('setImageCrop', (crop) => {
                    if (!(!allowCrop(item2, query) || !isObject2(center)))
                        return item2.setMetadata('crop', crop), crop
                }),
                    item2.extend('setImageCropCenter', (center2) => {
                        if (!(!allowCrop(item2, query) || !isObject2(center2)))
                            return updateCrop(item2, { center: center2 })
                    }),
                    item2.extend('setImageCropZoom', (zoom) => {
                        if (!(!allowCrop(item2, query) || !isNumber2(zoom)))
                            return updateCrop(item2, {
                                zoom: Math.max(1, zoom),
                            })
                    }),
                    item2.extend('setImageCropRotation', (rotation) => {
                        if (!(!allowCrop(item2, query) || !isNumber2(rotation)))
                            return updateCrop(item2, { rotation })
                    }),
                    item2.extend('setImageCropFlip', (flip) => {
                        if (!(!allowCrop(item2, query) || !isObject2(flip)))
                            return updateCrop(item2, { flip })
                    }),
                    item2.extend(
                        'setImageCropAspectRatio',
                        (newAspectRatio) => {
                            if (
                                !allowCrop(item2, query) ||
                                typeof newAspectRatio == 'undefined'
                            )
                                return
                            let currentCrop = item2.getMetadata('crop'),
                                aspectRatio =
                                    getNumericAspectRatioFromString2(
                                        newAspectRatio,
                                    ),
                                newCrop = {
                                    center: { x: 0.5, y: 0.5 },
                                    flip: currentCrop
                                        ? Object.assign({}, currentCrop.flip)
                                        : { horizontal: !1, vertical: !1 },
                                    rotation: 0,
                                    zoom: 1,
                                    aspectRatio,
                                }
                            return item2.setMetadata('crop', newCrop), newCrop
                        },
                    )
            }),
            addFilter2(
                'DID_LOAD_ITEM',
                (item2, { query }) =>
                    new Promise((resolve, reject) => {
                        let file2 = item2.file
                        if (
                            !isFile2(file2) ||
                            !isImage(file2) ||
                            !query('GET_ALLOW_IMAGE_CROP') ||
                            item2.getMetadata('crop')
                        )
                            return resolve(item2)
                        let humanAspectRatio = query(
                            'GET_IMAGE_CROP_ASPECT_RATIO',
                        )
                        item2.setMetadata('crop', {
                            center: { x: 0.5, y: 0.5 },
                            flip: { horizontal: !1, vertical: !1 },
                            rotation: 0,
                            zoom: 1,
                            aspectRatio: humanAspectRatio
                                ? getNumericAspectRatioFromString2(
                                      humanAspectRatio,
                                  )
                                : null,
                        }),
                            resolve(item2)
                    }),
            ),
            {
                options: {
                    allowImageCrop: [!0, Type2.BOOLEAN],
                    imageCropAspectRatio: [null, Type2.STRING],
                },
            }
        )
    },
    isBrowser4 =
        typeof window != 'undefined' && typeof window.document != 'undefined'
isBrowser4 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin3 }),
    )
var filepond_plugin_image_crop_esm_default = plugin3
var isJPEG = (file2) => /^image\/jpeg/.test(file2.type),
    Marker = {
        JPEG: 65496,
        APP1: 65505,
        EXIF: 1165519206,
        TIFF: 18761,
        Orientation: 274,
        Unknown: 65280,
    },
    getUint16 = (view, offset, little = !1) => view.getUint16(offset, little),
    getUint32 = (view, offset, little = !1) => view.getUint32(offset, little),
    getImageOrientation = (file2) =>
        new Promise((resolve, reject) => {
            let reader = new FileReader()
            ;(reader.onload = function (e) {
                let view = new DataView(e.target.result)
                if (getUint16(view, 0) !== Marker.JPEG) {
                    resolve(-1)
                    return
                }
                let length = view.byteLength,
                    offset = 2
                for (; offset < length; ) {
                    let marker = getUint16(view, offset)
                    if (((offset += 2), marker === Marker.APP1)) {
                        if (getUint32(view, (offset += 2)) !== Marker.EXIF)
                            break
                        let little =
                            getUint16(view, (offset += 6)) === Marker.TIFF
                        offset += getUint32(view, offset + 4, little)
                        let tags = getUint16(view, offset, little)
                        offset += 2
                        for (let i = 0; i < tags; i++)
                            if (
                                getUint16(view, offset + i * 12, little) ===
                                Marker.Orientation
                            ) {
                                resolve(
                                    getUint16(
                                        view,
                                        offset + i * 12 + 8,
                                        little,
                                    ),
                                )
                                return
                            }
                    } else {
                        if ((marker & Marker.Unknown) !== Marker.Unknown) break
                        offset += getUint16(view, offset)
                    }
                }
                resolve(-1)
            }),
                reader.readAsArrayBuffer(file2.slice(0, 64 * 1024))
        }),
    IS_BROWSER2 = (() =>
        typeof window != 'undefined' &&
        typeof window.document != 'undefined')(),
    isBrowser5 = () => IS_BROWSER2,
    testSrc =
        'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QA6RXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAYAAAEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wAALCAABAAIBASIA/8QAJgABAAAAAAAAAAAAAAAAAAAAAxABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBH/9k=',
    shouldCorrect,
    testImage = isBrowser5() ? new Image() : {}
testImage.onload = () =>
    (shouldCorrect = testImage.naturalWidth > testImage.naturalHeight)
testImage.src = testSrc
var shouldCorrectImageExifOrientation = () => shouldCorrect,
    plugin4 = ({ addFilter: addFilter2, utils }) => {
        let { Type: Type2, isFile: isFile2 } = utils
        return (
            addFilter2(
                'DID_LOAD_ITEM',
                (item2, { query }) =>
                    new Promise((resolve, reject) => {
                        let file2 = item2.file
                        if (
                            !isFile2(file2) ||
                            !isJPEG(file2) ||
                            !query('GET_ALLOW_IMAGE_EXIF_ORIENTATION') ||
                            !shouldCorrectImageExifOrientation()
                        )
                            return resolve(item2)
                        getImageOrientation(file2).then((orientation) => {
                            item2.setMetadata('exif', { orientation }),
                                resolve(item2)
                        })
                    }),
            ),
            { options: { allowImageExifOrientation: [!0, Type2.BOOLEAN] } }
        )
    },
    isBrowser$1 =
        typeof window != 'undefined' && typeof window.document != 'undefined'
isBrowser$1 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin4 }),
    )
var filepond_plugin_image_exif_orientation_esm_default = plugin4
var isPreviewableImage = (file2) => /^image/.test(file2.type),
    vectorMultiply = (v, amount) => createVector(v.x * amount, v.y * amount),
    vectorAdd = (a, b) => createVector(a.x + b.x, a.y + b.y),
    vectorNormalize = (v) => {
        let l = Math.sqrt(v.x * v.x + v.y * v.y)
        return l === 0 ? { x: 0, y: 0 } : createVector(v.x / l, v.y / l)
    },
    vectorRotate = (v, radians, origin) => {
        let cos = Math.cos(radians),
            sin = Math.sin(radians),
            t = createVector(v.x - origin.x, v.y - origin.y)
        return createVector(
            origin.x + cos * t.x - sin * t.y,
            origin.y + sin * t.x + cos * t.y,
        )
    },
    createVector = (x = 0, y = 0) => ({ x, y }),
    getMarkupValue = (value, size, scalar = 1, axis) => {
        if (typeof value == 'string') return parseFloat(value) * scalar
        if (typeof value == 'number')
            return (
                value * (axis ? size[axis] : Math.min(size.width, size.height))
            )
    },
    getMarkupStyles = (markup, size, scale) => {
        let lineStyle = markup.borderStyle || markup.lineStyle || 'solid',
            fill = markup.backgroundColor || markup.fontColor || 'transparent',
            stroke = markup.borderColor || markup.lineColor || 'transparent',
            strokeWidth = getMarkupValue(
                markup.borderWidth || markup.lineWidth,
                size,
                scale,
            ),
            lineCap = markup.lineCap || 'round',
            lineJoin = markup.lineJoin || 'round',
            dashes =
                typeof lineStyle == 'string'
                    ? ''
                    : lineStyle
                          .map((v) => getMarkupValue(v, size, scale))
                          .join(','),
            opacity = markup.opacity || 1
        return {
            'stroke-linecap': lineCap,
            'stroke-linejoin': lineJoin,
            'stroke-width': strokeWidth || 0,
            'stroke-dasharray': dashes,
            stroke,
            fill,
            opacity,
        }
    },
    isDefined2 = (value) => value != null,
    getMarkupRect = (rect, size, scalar = 1) => {
        let left =
                getMarkupValue(rect.x, size, scalar, 'width') ||
                getMarkupValue(rect.left, size, scalar, 'width'),
            top =
                getMarkupValue(rect.y, size, scalar, 'height') ||
                getMarkupValue(rect.top, size, scalar, 'height'),
            width = getMarkupValue(rect.width, size, scalar, 'width'),
            height = getMarkupValue(rect.height, size, scalar, 'height'),
            right = getMarkupValue(rect.right, size, scalar, 'width'),
            bottom = getMarkupValue(rect.bottom, size, scalar, 'height')
        return (
            isDefined2(top) ||
                (isDefined2(height) && isDefined2(bottom)
                    ? (top = size.height - height - bottom)
                    : (top = bottom)),
            isDefined2(left) ||
                (isDefined2(width) && isDefined2(right)
                    ? (left = size.width - width - right)
                    : (left = right)),
            isDefined2(width) ||
                (isDefined2(left) && isDefined2(right)
                    ? (width = size.width - left - right)
                    : (width = 0)),
            isDefined2(height) ||
                (isDefined2(top) && isDefined2(bottom)
                    ? (height = size.height - top - bottom)
                    : (height = 0)),
            {
                x: left || 0,
                y: top || 0,
                width: width || 0,
                height: height || 0,
            }
        )
    },
    pointsToPathShape = (points) =>
        points
            .map(
                (point, index) =>
                    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
            )
            .join(' '),
    setAttributes = (element, attr2) =>
        Object.keys(attr2).forEach((key) =>
            element.setAttribute(key, attr2[key]),
        ),
    ns2 = 'http://www.w3.org/2000/svg',
    svg = (tag, attr2) => {
        let element = document.createElementNS(ns2, tag)
        return attr2 && setAttributes(element, attr2), element
    },
    updateRect2 = (element) =>
        setAttributes(element, { ...element.rect, ...element.styles }),
    updateEllipse = (element) => {
        let cx = element.rect.x + element.rect.width * 0.5,
            cy = element.rect.y + element.rect.height * 0.5,
            rx = element.rect.width * 0.5,
            ry = element.rect.height * 0.5
        return setAttributes(element, { cx, cy, rx, ry, ...element.styles })
    },
    IMAGE_FIT_STYLE = { contain: 'xMidYMid meet', cover: 'xMidYMid slice' },
    updateImage = (element, markup) => {
        setAttributes(element, {
            ...element.rect,
            ...element.styles,
            preserveAspectRatio: IMAGE_FIT_STYLE[markup.fit] || 'none',
        })
    },
    TEXT_ANCHOR = { left: 'start', center: 'middle', right: 'end' },
    updateText = (element, markup, size, scale) => {
        let fontSize = getMarkupValue(markup.fontSize, size, scale),
            fontFamily = markup.fontFamily || 'sans-serif',
            fontWeight = markup.fontWeight || 'normal',
            textAlign = TEXT_ANCHOR[markup.textAlign] || 'start'
        setAttributes(element, {
            ...element.rect,
            ...element.styles,
            'stroke-width': 0,
            'font-weight': fontWeight,
            'font-size': fontSize,
            'font-family': fontFamily,
            'text-anchor': textAlign,
        }),
            element.text !== markup.text &&
                ((element.text = markup.text),
                (element.textContent = markup.text.length ? markup.text : ' '))
    },
    updateLine = (element, markup, size, scale) => {
        setAttributes(element, {
            ...element.rect,
            ...element.styles,
            fill: 'none',
        })
        let line = element.childNodes[0],
            begin = element.childNodes[1],
            end = element.childNodes[2],
            origin = element.rect,
            target = {
                x: element.rect.x + element.rect.width,
                y: element.rect.y + element.rect.height,
            }
        if (
            (setAttributes(line, {
                x1: origin.x,
                y1: origin.y,
                x2: target.x,
                y2: target.y,
            }),
            !markup.lineDecoration)
        )
            return
        ;(begin.style.display = 'none'), (end.style.display = 'none')
        let v = vectorNormalize({
                x: target.x - origin.x,
                y: target.y - origin.y,
            }),
            l = getMarkupValue(0.05, size, scale)
        if (markup.lineDecoration.indexOf('arrow-begin') !== -1) {
            let arrowBeginRotationPoint = vectorMultiply(v, l),
                arrowBeginCenter = vectorAdd(origin, arrowBeginRotationPoint),
                arrowBeginA = vectorRotate(origin, 2, arrowBeginCenter),
                arrowBeginB = vectorRotate(origin, -2, arrowBeginCenter)
            setAttributes(begin, {
                style: 'display:block;',
                d: `M${arrowBeginA.x},${arrowBeginA.y} L${origin.x},${origin.y} L${arrowBeginB.x},${arrowBeginB.y}`,
            })
        }
        if (markup.lineDecoration.indexOf('arrow-end') !== -1) {
            let arrowEndRotationPoint = vectorMultiply(v, -l),
                arrowEndCenter = vectorAdd(target, arrowEndRotationPoint),
                arrowEndA = vectorRotate(target, 2, arrowEndCenter),
                arrowEndB = vectorRotate(target, -2, arrowEndCenter)
            setAttributes(end, {
                style: 'display:block;',
                d: `M${arrowEndA.x},${arrowEndA.y} L${target.x},${target.y} L${arrowEndB.x},${arrowEndB.y}`,
            })
        }
    },
    updatePath = (element, markup, size, scale) => {
        setAttributes(element, {
            ...element.styles,
            fill: 'none',
            d: pointsToPathShape(
                markup.points.map((point) => ({
                    x: getMarkupValue(point.x, size, scale, 'width'),
                    y: getMarkupValue(point.y, size, scale, 'height'),
                })),
            ),
        })
    },
    createShape = (node) => (markup) => svg(node, { id: markup.id }),
    createImage = (markup) => {
        let shape = svg('image', {
            id: markup.id,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            opacity: '0',
        })
        return (
            (shape.onload = () => {
                shape.setAttribute('opacity', markup.opacity || 1)
            }),
            shape.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'xlink:href',
                markup.src,
            ),
            shape
        )
    },
    createLine = (markup) => {
        let shape = svg('g', {
                id: markup.id,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
            line = svg('line')
        shape.appendChild(line)
        let begin = svg('path')
        shape.appendChild(begin)
        let end = svg('path')
        return shape.appendChild(end), shape
    },
    CREATE_TYPE_ROUTES = {
        image: createImage,
        rect: createShape('rect'),
        ellipse: createShape('ellipse'),
        text: createShape('text'),
        path: createShape('path'),
        line: createLine,
    },
    UPDATE_TYPE_ROUTES = {
        rect: updateRect2,
        ellipse: updateEllipse,
        image: updateImage,
        text: updateText,
        path: updatePath,
        line: updateLine,
    },
    createMarkupByType = (type, markup) => CREATE_TYPE_ROUTES[type](markup),
    updateMarkupByType = (element, type, markup, size, scale) => {
        type !== 'path' && (element.rect = getMarkupRect(markup, size, scale)),
            (element.styles = getMarkupStyles(markup, size, scale)),
            UPDATE_TYPE_ROUTES[type](element, markup, size, scale)
    },
    MARKUP_RECT = [
        'x',
        'y',
        'left',
        'top',
        'right',
        'bottom',
        'width',
        'height',
    ],
    toOptionalFraction = (value) =>
        typeof value == 'string' && /%/.test(value)
            ? parseFloat(value) / 100
            : value,
    prepareMarkup = (markup) => {
        let [type, props] = markup,
            rect = props.points
                ? {}
                : MARKUP_RECT.reduce(
                      (prev, curr) => (
                          (prev[curr] = toOptionalFraction(props[curr])), prev
                      ),
                      {},
                  )
        return [type, { zIndex: 0, ...props, ...rect }]
    },
    sortMarkupByZIndex = (a, b) =>
        a[1].zIndex > b[1].zIndex ? 1 : a[1].zIndex < b[1].zIndex ? -1 : 0,
    createMarkupView = (_) =>
        _.utils.createView({
            name: 'image-preview-markup',
            tag: 'svg',
            ignoreRect: !0,
            mixins: {
                apis: ['width', 'height', 'crop', 'markup', 'resize', 'dirty'],
            },
            write: ({ root: root2, props }) => {
                if (!props.dirty) return
                let { crop, resize, markup } = props,
                    viewWidth = props.width,
                    viewHeight = props.height,
                    cropWidth = crop.width,
                    cropHeight = crop.height
                if (resize) {
                    let { size: size2 } = resize,
                        outputWidth = size2 && size2.width,
                        outputHeight = size2 && size2.height,
                        outputFit = resize.mode,
                        outputUpscale = resize.upscale
                    outputWidth &&
                        !outputHeight &&
                        (outputHeight = outputWidth),
                        outputHeight &&
                            !outputWidth &&
                            (outputWidth = outputHeight)
                    let shouldUpscale =
                        cropWidth < outputWidth && cropHeight < outputHeight
                    if (!shouldUpscale || (shouldUpscale && outputUpscale)) {
                        let scalarWidth = outputWidth / cropWidth,
                            scalarHeight = outputHeight / cropHeight
                        if (outputFit === 'force')
                            (cropWidth = outputWidth),
                                (cropHeight = outputHeight)
                        else {
                            let scalar
                            outputFit === 'cover'
                                ? (scalar = Math.max(scalarWidth, scalarHeight))
                                : outputFit === 'contain' &&
                                  (scalar = Math.min(
                                      scalarWidth,
                                      scalarHeight,
                                  )),
                                (cropWidth = cropWidth * scalar),
                                (cropHeight = cropHeight * scalar)
                        }
                    }
                }
                let size = { width: viewWidth, height: viewHeight }
                root2.element.setAttribute('width', size.width),
                    root2.element.setAttribute('height', size.height)
                let scale = Math.min(
                    viewWidth / cropWidth,
                    viewHeight / cropHeight,
                )
                root2.element.innerHTML = ''
                let markupFilter = root2.query(
                    'GET_IMAGE_PREVIEW_MARKUP_FILTER',
                )
                markup
                    .filter(markupFilter)
                    .map(prepareMarkup)
                    .sort(sortMarkupByZIndex)
                    .forEach((markup2) => {
                        let [type, settings] = markup2,
                            element = createMarkupByType(type, settings)
                        updateMarkupByType(
                            element,
                            type,
                            settings,
                            size,
                            scale,
                        ),
                            root2.element.appendChild(element)
                    })
            },
        }),
    createVector$1 = (x, y) => ({ x, y }),
    vectorDot = (a, b) => a.x * b.x + a.y * b.y,
    vectorSubtract = (a, b) => createVector$1(a.x - b.x, a.y - b.y),
    vectorDistanceSquared = (a, b) =>
        vectorDot(vectorSubtract(a, b), vectorSubtract(a, b)),
    vectorDistance = (a, b) => Math.sqrt(vectorDistanceSquared(a, b)),
    getOffsetPointOnEdge = (length, rotation) => {
        let a = length,
            A = 1.5707963267948966,
            B = rotation,
            C = 1.5707963267948966 - rotation,
            sinA = Math.sin(A),
            sinB = Math.sin(B),
            sinC = Math.sin(C),
            cosC = Math.cos(C),
            ratio = a / sinA,
            b = ratio * sinB,
            c = ratio * sinC
        return createVector$1(cosC * b, cosC * c)
    },
    getRotatedRectSize = (rect, rotation) => {
        let w = rect.width,
            h = rect.height,
            hor = getOffsetPointOnEdge(w, rotation),
            ver = getOffsetPointOnEdge(h, rotation),
            tl = createVector$1(
                rect.x + Math.abs(hor.x),
                rect.y - Math.abs(hor.y),
            ),
            tr = createVector$1(
                rect.x + rect.width + Math.abs(ver.y),
                rect.y + Math.abs(ver.x),
            ),
            bl = createVector$1(
                rect.x - Math.abs(ver.y),
                rect.y + rect.height - Math.abs(ver.x),
            )
        return { width: vectorDistance(tl, tr), height: vectorDistance(tl, bl) }
    },
    calculateCanvasSize = (image, canvasAspectRatio, zoom = 1) => {
        let imageAspectRatio = image.height / image.width,
            canvasWidth = 1,
            canvasHeight = canvasAspectRatio,
            imgWidth = 1,
            imgHeight = imageAspectRatio
        imgHeight > canvasHeight &&
            ((imgHeight = canvasHeight),
            (imgWidth = imgHeight / imageAspectRatio))
        let scalar = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight),
            width = image.width / (zoom * scalar * imgWidth),
            height = width * canvasAspectRatio
        return { width, height }
    },
    getImageRectZoomFactor = (imageRect, cropRect, rotation, center2) => {
        let cx = center2.x > 0.5 ? 1 - center2.x : center2.x,
            cy = center2.y > 0.5 ? 1 - center2.y : center2.y,
            imageWidth = cx * 2 * imageRect.width,
            imageHeight = cy * 2 * imageRect.height,
            rotatedCropSize = getRotatedRectSize(cropRect, rotation)
        return Math.max(
            rotatedCropSize.width / imageWidth,
            rotatedCropSize.height / imageHeight,
        )
    },
    getCenteredCropRect = (container, aspectRatio) => {
        let width = container.width,
            height = width * aspectRatio
        height > container.height &&
            ((height = container.height), (width = height / aspectRatio))
        let x = (container.width - width) * 0.5,
            y = (container.height - height) * 0.5
        return { x, y, width, height }
    },
    getCurrentCropSize = (imageSize, crop = {}) => {
        let { zoom, rotation, center: center2, aspectRatio } = crop
        aspectRatio || (aspectRatio = imageSize.height / imageSize.width)
        let canvasSize = calculateCanvasSize(imageSize, aspectRatio, zoom),
            canvasCenter = {
                x: canvasSize.width * 0.5,
                y: canvasSize.height * 0.5,
            },
            stage = {
                x: 0,
                y: 0,
                width: canvasSize.width,
                height: canvasSize.height,
                center: canvasCenter,
            },
            shouldLimit =
                typeof crop.scaleToFit == 'undefined' || crop.scaleToFit,
            stageZoomFactor = getImageRectZoomFactor(
                imageSize,
                getCenteredCropRect(stage, aspectRatio),
                rotation,
                shouldLimit ? center2 : { x: 0.5, y: 0.5 },
            ),
            scale = zoom * stageZoomFactor
        return {
            widthFloat: canvasSize.width / scale,
            heightFloat: canvasSize.height / scale,
            width: Math.round(canvasSize.width / scale),
            height: Math.round(canvasSize.height / scale),
        }
    },
    IMAGE_SCALE_SPRING_PROPS = {
        type: 'spring',
        stiffness: 0.5,
        damping: 0.45,
        mass: 10,
    },
    createBitmapView = (_) =>
        _.utils.createView({
            name: 'image-bitmap',
            ignoreRect: !0,
            mixins: { styles: ['scaleX', 'scaleY'] },
            create: ({ root: root2, props }) => {
                root2.appendChild(props.image)
            },
        }),
    createImageCanvasWrapper = (_) =>
        _.utils.createView({
            name: 'image-canvas-wrapper',
            tag: 'div',
            ignoreRect: !0,
            mixins: {
                apis: ['crop', 'width', 'height'],
                styles: [
                    'originX',
                    'originY',
                    'translateX',
                    'translateY',
                    'scaleX',
                    'scaleY',
                    'rotateZ',
                ],
                animations: {
                    originX: IMAGE_SCALE_SPRING_PROPS,
                    originY: IMAGE_SCALE_SPRING_PROPS,
                    scaleX: IMAGE_SCALE_SPRING_PROPS,
                    scaleY: IMAGE_SCALE_SPRING_PROPS,
                    translateX: IMAGE_SCALE_SPRING_PROPS,
                    translateY: IMAGE_SCALE_SPRING_PROPS,
                    rotateZ: IMAGE_SCALE_SPRING_PROPS,
                },
            },
            create: ({ root: root2, props }) => {
                ;(props.width = props.image.width),
                    (props.height = props.image.height),
                    (root2.ref.bitmap = root2.appendChildView(
                        root2.createChildView(createBitmapView(_), {
                            image: props.image,
                        }),
                    ))
            },
            write: ({ root: root2, props }) => {
                let { flip } = props.crop,
                    { bitmap } = root2.ref
                ;(bitmap.scaleX = flip.horizontal ? -1 : 1),
                    (bitmap.scaleY = flip.vertical ? -1 : 1)
            },
        }),
    createClipView = (_) =>
        _.utils.createView({
            name: 'image-clip',
            tag: 'div',
            ignoreRect: !0,
            mixins: {
                apis: [
                    'crop',
                    'markup',
                    'resize',
                    'width',
                    'height',
                    'dirty',
                    'background',
                ],
                styles: ['width', 'height', 'opacity'],
                animations: { opacity: { type: 'tween', duration: 250 } },
            },
            didWriteView: function ({ root: root2, props }) {
                !props.background ||
                    (root2.element.style.backgroundColor = props.background)
            },
            create: ({ root: root2, props }) => {
                ;(root2.ref.image = root2.appendChildView(
                    root2.createChildView(
                        createImageCanvasWrapper(_),
                        Object.assign({}, props),
                    ),
                )),
                    (root2.ref.createMarkup = () => {
                        root2.ref.markup ||
                            (root2.ref.markup = root2.appendChildView(
                                root2.createChildView(
                                    createMarkupView(_),
                                    Object.assign({}, props),
                                ),
                            ))
                    }),
                    (root2.ref.destroyMarkup = () => {
                        !root2.ref.markup ||
                            (root2.removeChildView(root2.ref.markup),
                            (root2.ref.markup = null))
                    })
                let transparencyIndicator = root2.query(
                    'GET_IMAGE_PREVIEW_TRANSPARENCY_INDICATOR',
                )
                transparencyIndicator !== null &&
                    (transparencyIndicator === 'grid'
                        ? (root2.element.dataset.transparencyIndicator =
                              transparencyIndicator)
                        : (root2.element.dataset.transparencyIndicator =
                              'color'))
            },
            write: ({ root: root2, props, shouldOptimize }) => {
                let { crop, markup, resize, dirty, width, height } = props
                root2.ref.image.crop = crop
                let stage = {
                        x: 0,
                        y: 0,
                        width,
                        height,
                        center: { x: width * 0.5, y: height * 0.5 },
                    },
                    image = {
                        width: root2.ref.image.width,
                        height: root2.ref.image.height,
                    },
                    origin = {
                        x: crop.center.x * image.width,
                        y: crop.center.y * image.height,
                    },
                    translation = {
                        x: stage.center.x - image.width * crop.center.x,
                        y: stage.center.y - image.height * crop.center.y,
                    },
                    rotation = Math.PI * 2 + (crop.rotation % (Math.PI * 2)),
                    cropAspectRatio =
                        crop.aspectRatio || image.height / image.width,
                    shouldLimit =
                        typeof crop.scaleToFit == 'undefined' ||
                        crop.scaleToFit,
                    stageZoomFactor = getImageRectZoomFactor(
                        image,
                        getCenteredCropRect(stage, cropAspectRatio),
                        rotation,
                        shouldLimit ? crop.center : { x: 0.5, y: 0.5 },
                    ),
                    scale = crop.zoom * stageZoomFactor
                markup && markup.length
                    ? (root2.ref.createMarkup(),
                      (root2.ref.markup.width = width),
                      (root2.ref.markup.height = height),
                      (root2.ref.markup.resize = resize),
                      (root2.ref.markup.dirty = dirty),
                      (root2.ref.markup.markup = markup),
                      (root2.ref.markup.crop = getCurrentCropSize(image, crop)))
                    : root2.ref.markup && root2.ref.destroyMarkup()
                let imageView = root2.ref.image
                if (shouldOptimize) {
                    ;(imageView.originX = null),
                        (imageView.originY = null),
                        (imageView.translateX = null),
                        (imageView.translateY = null),
                        (imageView.rotateZ = null),
                        (imageView.scaleX = null),
                        (imageView.scaleY = null)
                    return
                }
                ;(imageView.originX = origin.x),
                    (imageView.originY = origin.y),
                    (imageView.translateX = translation.x),
                    (imageView.translateY = translation.y),
                    (imageView.rotateZ = rotation),
                    (imageView.scaleX = scale),
                    (imageView.scaleY = scale)
            },
        }),
    createImageView = (_) =>
        _.utils.createView({
            name: 'image-preview',
            tag: 'div',
            ignoreRect: !0,
            mixins: {
                apis: [
                    'image',
                    'crop',
                    'markup',
                    'resize',
                    'dirty',
                    'background',
                ],
                styles: ['translateY', 'scaleX', 'scaleY', 'opacity'],
                animations: {
                    scaleX: IMAGE_SCALE_SPRING_PROPS,
                    scaleY: IMAGE_SCALE_SPRING_PROPS,
                    translateY: IMAGE_SCALE_SPRING_PROPS,
                    opacity: { type: 'tween', duration: 400 },
                },
            },
            create: ({ root: root2, props }) => {
                root2.ref.clip = root2.appendChildView(
                    root2.createChildView(createClipView(_), {
                        id: props.id,
                        image: props.image,
                        crop: props.crop,
                        markup: props.markup,
                        resize: props.resize,
                        dirty: props.dirty,
                        background: props.background,
                    }),
                )
            },
            write: ({ root: root2, props, shouldOptimize }) => {
                let { clip } = root2.ref,
                    { image, crop, markup, resize, dirty } = props
                if (
                    ((clip.crop = crop),
                    (clip.markup = markup),
                    (clip.resize = resize),
                    (clip.dirty = dirty),
                    (clip.opacity = shouldOptimize ? 0 : 1),
                    shouldOptimize || root2.rect.element.hidden)
                )
                    return
                let imageAspectRatio = image.height / image.width,
                    aspectRatio = crop.aspectRatio || imageAspectRatio,
                    containerWidth = root2.rect.inner.width,
                    containerHeight = root2.rect.inner.height,
                    fixedPreviewHeight = root2.query(
                        'GET_IMAGE_PREVIEW_HEIGHT',
                    ),
                    minPreviewHeight = root2.query(
                        'GET_IMAGE_PREVIEW_MIN_HEIGHT',
                    ),
                    maxPreviewHeight = root2.query(
                        'GET_IMAGE_PREVIEW_MAX_HEIGHT',
                    ),
                    panelAspectRatio = root2.query('GET_PANEL_ASPECT_RATIO'),
                    allowMultiple = root2.query('GET_ALLOW_MULTIPLE')
                panelAspectRatio &&
                    !allowMultiple &&
                    ((fixedPreviewHeight = containerWidth * panelAspectRatio),
                    (aspectRatio = panelAspectRatio))
                let clipHeight =
                        fixedPreviewHeight !== null
                            ? fixedPreviewHeight
                            : Math.max(
                                  minPreviewHeight,
                                  Math.min(
                                      containerWidth * aspectRatio,
                                      maxPreviewHeight,
                                  ),
                              ),
                    clipWidth = clipHeight / aspectRatio
                clipWidth > containerWidth &&
                    ((clipWidth = containerWidth),
                    (clipHeight = clipWidth * aspectRatio)),
                    clipHeight > containerHeight &&
                        ((clipHeight = containerHeight),
                        (clipWidth = containerHeight / aspectRatio)),
                    (clip.width = clipWidth),
                    (clip.height = clipHeight)
            },
        }),
    SVG_MASK = `<svg width="500" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
    <defs>
        <radialGradient id="gradient-__UID__" cx=".5" cy="1.25" r="1.15">
            <stop offset='50%' stop-color='#000000'/>
            <stop offset='56%' stop-color='#0a0a0a'/>
            <stop offset='63%' stop-color='#262626'/>
            <stop offset='69%' stop-color='#4f4f4f'/>
            <stop offset='75%' stop-color='#808080'/>
            <stop offset='81%' stop-color='#b1b1b1'/>
            <stop offset='88%' stop-color='#dadada'/>
            <stop offset='94%' stop-color='#f6f6f6'/>
            <stop offset='100%' stop-color='#ffffff'/>
        </radialGradient>
        <mask id="mask-__UID__">
            <rect x="0" y="0" width="500" height="200" fill="url(#gradient-__UID__)"></rect>
        </mask>
    </defs>
    <rect x="0" width="500" height="200" fill="currentColor" mask="url(#mask-__UID__)"></rect>
</svg>`,
    SVGMaskUniqueId = 0,
    createImageOverlayView = (fpAPI) =>
        fpAPI.utils.createView({
            name: 'image-preview-overlay',
            tag: 'div',
            ignoreRect: !0,
            create: ({ root: root2, props }) => {
                let mask = SVG_MASK
                if (document.querySelector('base')) {
                    let url = new URL(
                        window.location.href.replace(window.location.hash, ''),
                    ).href
                    mask = mask.replace(/url\(\#/g, 'url(' + url + '#')
                }
                SVGMaskUniqueId++,
                    root2.element.classList.add(
                        `filepond--image-preview-overlay-${props.status}`,
                    ),
                    (root2.element.innerHTML = mask.replace(
                        /__UID__/g,
                        SVGMaskUniqueId,
                    ))
            },
            mixins: {
                styles: ['opacity'],
                animations: { opacity: { type: 'spring', mass: 25 } },
            },
        }),
    BitmapWorker = function () {
        self.onmessage = (e) => {
            createImageBitmap(e.data.message.file).then((bitmap) => {
                self.postMessage({ id: e.data.id, message: bitmap }, [bitmap])
            })
        }
    },
    ColorMatrixWorker = function () {
        self.onmessage = (e) => {
            let imageData = e.data.message.imageData,
                matrix = e.data.message.colorMatrix,
                data3 = imageData.data,
                l = data3.length,
                m11 = matrix[0],
                m12 = matrix[1],
                m13 = matrix[2],
                m14 = matrix[3],
                m15 = matrix[4],
                m21 = matrix[5],
                m22 = matrix[6],
                m23 = matrix[7],
                m24 = matrix[8],
                m25 = matrix[9],
                m31 = matrix[10],
                m32 = matrix[11],
                m33 = matrix[12],
                m34 = matrix[13],
                m35 = matrix[14],
                m41 = matrix[15],
                m42 = matrix[16],
                m43 = matrix[17],
                m44 = matrix[18],
                m45 = matrix[19],
                index = 0,
                r = 0,
                g = 0,
                b = 0,
                a = 0
            for (; index < l; index += 4)
                (r = data3[index] / 255),
                    (g = data3[index + 1] / 255),
                    (b = data3[index + 2] / 255),
                    (a = data3[index + 3] / 255),
                    (data3[index] = Math.max(
                        0,
                        Math.min(
                            (r * m11 + g * m12 + b * m13 + a * m14 + m15) * 255,
                            255,
                        ),
                    )),
                    (data3[index + 1] = Math.max(
                        0,
                        Math.min(
                            (r * m21 + g * m22 + b * m23 + a * m24 + m25) * 255,
                            255,
                        ),
                    )),
                    (data3[index + 2] = Math.max(
                        0,
                        Math.min(
                            (r * m31 + g * m32 + b * m33 + a * m34 + m35) * 255,
                            255,
                        ),
                    )),
                    (data3[index + 3] = Math.max(
                        0,
                        Math.min(
                            (r * m41 + g * m42 + b * m43 + a * m44 + m45) * 255,
                            255,
                        ),
                    ))
            self.postMessage({ id: e.data.id, message: imageData }, [
                imageData.data.buffer,
            ])
        }
    },
    getImageSize = (url, cb) => {
        let image = new Image()
        ;(image.onload = () => {
            let width = image.naturalWidth,
                height = image.naturalHeight
            ;(image = null), cb(width, height)
        }),
            (image.src = url)
    },
    transforms = {
        1: () => [1, 0, 0, 1, 0, 0],
        2: (width) => [-1, 0, 0, 1, width, 0],
        3: (width, height) => [-1, 0, 0, -1, width, height],
        4: (width, height) => [1, 0, 0, -1, 0, height],
        5: () => [0, 1, 1, 0, 0, 0],
        6: (width, height) => [0, 1, -1, 0, height, 0],
        7: (width, height) => [0, -1, -1, 0, height, width],
        8: (width) => [0, -1, 1, 0, 0, width],
    },
    fixImageOrientation = (ctx, width, height, orientation) => {
        orientation !== -1 &&
            ctx.transform.apply(ctx, transforms[orientation](width, height))
    },
    createPreviewImage = (data3, width, height, orientation) => {
        ;(width = Math.round(width)), (height = Math.round(height))
        let canvas = document.createElement('canvas')
        ;(canvas.width = width), (canvas.height = height)
        let ctx = canvas.getContext('2d')
        return (
            orientation >= 5 &&
                orientation <= 8 &&
                ([width, height] = [height, width]),
            fixImageOrientation(ctx, width, height, orientation),
            ctx.drawImage(data3, 0, 0, width, height),
            canvas
        )
    },
    isBitmap = (file2) => /^image/.test(file2.type) && !/svg/.test(file2.type),
    MAX_WIDTH = 10,
    MAX_HEIGHT = 10,
    calculateAverageColor = (image) => {
        let scalar = Math.min(
                MAX_WIDTH / image.width,
                MAX_HEIGHT / image.height,
            ),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d'),
            width = (canvas.width = Math.ceil(image.width * scalar)),
            height = (canvas.height = Math.ceil(image.height * scalar))
        ctx.drawImage(image, 0, 0, width, height)
        let data3 = null
        try {
            data3 = ctx.getImageData(0, 0, width, height).data
        } catch (e) {
            return null
        }
        let l = data3.length,
            r = 0,
            g = 0,
            b = 0,
            i = 0
        for (; i < l; i += 4)
            (r += data3[i] * data3[i]),
                (g += data3[i + 1] * data3[i + 1]),
                (b += data3[i + 2] * data3[i + 2])
        return (
            (r = averageColor(r, l)),
            (g = averageColor(g, l)),
            (b = averageColor(b, l)),
            { r, g, b }
        )
    },
    averageColor = (c, l) => Math.floor(Math.sqrt(c / (l / 4))),
    cloneCanvas = (origin, target) => (
        (target = target || document.createElement('canvas')),
        (target.width = origin.width),
        (target.height = origin.height),
        target.getContext('2d').drawImage(origin, 0, 0),
        target
    ),
    cloneImageData = (imageData) => {
        let id
        try {
            id = new ImageData(imageData.width, imageData.height)
        } catch (e) {
            id = document
                .createElement('canvas')
                .getContext('2d')
                .createImageData(imageData.width, imageData.height)
        }
        return id.data.set(new Uint8ClampedArray(imageData.data)), id
    },
    loadImage2 = (url) =>
        new Promise((resolve, reject) => {
            let img = new Image()
            ;(img.crossOrigin = 'Anonymous'),
                (img.onload = () => {
                    resolve(img)
                }),
                (img.onerror = (e) => {
                    reject(e)
                }),
                (img.src = url)
        }),
    createImageWrapperView = (_) => {
        let OverlayView = createImageOverlayView(_),
            ImageView = createImageView(_),
            { createWorker: createWorker3 } = _.utils,
            applyFilter = (root2, filter, target) =>
                new Promise((resolve) => {
                    root2.ref.imageData ||
                        (root2.ref.imageData = target
                            .getContext('2d')
                            .getImageData(0, 0, target.width, target.height))
                    let imageData = cloneImageData(root2.ref.imageData)
                    if (!filter || filter.length !== 20)
                        return (
                            target
                                .getContext('2d')
                                .putImageData(imageData, 0, 0),
                            resolve()
                        )
                    let worker = createWorker3(ColorMatrixWorker)
                    worker.post(
                        { imageData, colorMatrix: filter },
                        (response) => {
                            target
                                .getContext('2d')
                                .putImageData(response, 0, 0),
                                worker.terminate(),
                                resolve()
                        },
                        [imageData.data.buffer],
                    )
                }),
            removeImageView = (root2, imageView) => {
                root2.removeChildView(imageView),
                    (imageView.image.width = 1),
                    (imageView.image.height = 1),
                    imageView._destroy()
            },
            shiftImage = ({ root: root2 }) => {
                let imageView = root2.ref.images.shift()
                return (
                    (imageView.opacity = 0),
                    (imageView.translateY = -15),
                    root2.ref.imageViewBin.push(imageView),
                    imageView
                )
            },
            pushImage = ({ root: root2, props, image }) => {
                let id = props.id,
                    item2 = root2.query('GET_ITEM', { id })
                if (!item2) return
                let crop = item2.getMetadata('crop') || {
                        center: { x: 0.5, y: 0.5 },
                        flip: { horizontal: !1, vertical: !1 },
                        zoom: 1,
                        rotation: 0,
                        aspectRatio: null,
                    },
                    background = root2.query(
                        'GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR',
                    ),
                    markup,
                    resize,
                    dirty = !1
                root2.query('GET_IMAGE_PREVIEW_MARKUP_SHOW') &&
                    ((markup = item2.getMetadata('markup') || []),
                    (resize = item2.getMetadata('resize')),
                    (dirty = !0))
                let imageView = root2.appendChildView(
                    root2.createChildView(ImageView, {
                        id,
                        image,
                        crop,
                        resize,
                        markup,
                        dirty,
                        background,
                        opacity: 0,
                        scaleX: 1.15,
                        scaleY: 1.15,
                        translateY: 15,
                    }),
                    root2.childViews.length,
                )
                root2.ref.images.push(imageView),
                    (imageView.opacity = 1),
                    (imageView.scaleX = 1),
                    (imageView.scaleY = 1),
                    (imageView.translateY = 0),
                    setTimeout(() => {
                        root2.dispatch('DID_IMAGE_PREVIEW_SHOW', { id })
                    }, 250)
            },
            updateImage3 = ({ root: root2, props }) => {
                let item2 = root2.query('GET_ITEM', { id: props.id })
                if (!item2) return
                let imageView = root2.ref.images[root2.ref.images.length - 1]
                ;(imageView.crop = item2.getMetadata('crop')),
                    (imageView.background = root2.query(
                        'GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR',
                    )),
                    root2.query('GET_IMAGE_PREVIEW_MARKUP_SHOW') &&
                        ((imageView.dirty = !0),
                        (imageView.resize = item2.getMetadata('resize')),
                        (imageView.markup = item2.getMetadata('markup')))
            },
            didUpdateItemMetadata = ({ root: root2, props, action }) => {
                if (
                    !/crop|filter|markup|resize/.test(action.change.key) ||
                    !root2.ref.images.length
                )
                    return
                let item2 = root2.query('GET_ITEM', { id: props.id })
                if (!!item2) {
                    if (/filter/.test(action.change.key)) {
                        let imageView =
                            root2.ref.images[root2.ref.images.length - 1]
                        applyFilter(root2, action.change.value, imageView.image)
                        return
                    }
                    if (/crop|markup|resize/.test(action.change.key)) {
                        let crop = item2.getMetadata('crop'),
                            image =
                                root2.ref.images[root2.ref.images.length - 1]
                        if (
                            crop &&
                            crop.aspectRatio &&
                            image.crop &&
                            image.crop.aspectRatio &&
                            Math.abs(
                                crop.aspectRatio - image.crop.aspectRatio,
                            ) > 1e-5
                        ) {
                            let imageView = shiftImage({ root: root2 })
                            pushImage({
                                root: root2,
                                props,
                                image: cloneCanvas(imageView.image),
                            })
                        } else updateImage3({ root: root2, props })
                    }
                }
            },
            canCreateImageBitmap = (file2) => {
                let isFirefox =
                    window.navigator.userAgent.match(/Firefox\/([0-9]+)\./)
                return (isFirefox ? parseInt(isFirefox[1]) : null) <= 58
                    ? !1
                    : 'createImageBitmap' in window && isBitmap(file2)
            },
            didCreatePreviewContainer = ({ root: root2, props }) => {
                let { id } = props,
                    item2 = root2.query('GET_ITEM', id)
                if (!item2) return
                let fileURL = URL.createObjectURL(item2.file)
                getImageSize(fileURL, (width, height) => {
                    root2.dispatch('DID_IMAGE_PREVIEW_CALCULATE_SIZE', {
                        id,
                        width,
                        height,
                    })
                })
            },
            drawPreview = ({ root: root2, props }) => {
                let { id } = props,
                    item2 = root2.query('GET_ITEM', id)
                if (!item2) return
                let fileURL = URL.createObjectURL(item2.file),
                    loadPreviewFallback = () => {
                        loadImage2(fileURL).then(previewImageLoaded)
                    },
                    previewImageLoaded = (imageData) => {
                        URL.revokeObjectURL(fileURL)
                        let orientation =
                                (item2.getMetadata('exif') || {}).orientation ||
                                -1,
                            { width, height } = imageData
                        if (!width || !height) return
                        orientation >= 5 &&
                            orientation <= 8 &&
                            ([width, height] = [height, width])
                        let pixelDensityFactor = Math.max(
                                1,
                                window.devicePixelRatio * 0.75,
                            ),
                            scaleFactor =
                                root2.query('GET_IMAGE_PREVIEW_ZOOM_FACTOR') *
                                pixelDensityFactor,
                            previewImageRatio = height / width,
                            previewContainerWidth = root2.rect.element.width,
                            previewContainerHeight = root2.rect.element.height,
                            imageWidth = previewContainerWidth,
                            imageHeight = imageWidth * previewImageRatio
                        previewImageRatio > 1
                            ? ((imageWidth = Math.min(
                                  width,
                                  previewContainerWidth * scaleFactor,
                              )),
                              (imageHeight = imageWidth * previewImageRatio))
                            : ((imageHeight = Math.min(
                                  height,
                                  previewContainerHeight * scaleFactor,
                              )),
                              (imageWidth = imageHeight / previewImageRatio))
                        let previewImage = createPreviewImage(
                                imageData,
                                imageWidth,
                                imageHeight,
                                orientation,
                            ),
                            done = () => {
                                let averageColor2 = root2.query(
                                    'GET_IMAGE_PREVIEW_CALCULATE_AVERAGE_IMAGE_COLOR',
                                )
                                    ? calculateAverageColor(data)
                                    : null
                                item2.setMetadata('color', averageColor2, !0),
                                    'close' in imageData && imageData.close(),
                                    (root2.ref.overlayShadow.opacity = 1),
                                    pushImage({
                                        root: root2,
                                        props,
                                        image: previewImage,
                                    })
                            },
                            filter = item2.getMetadata('filter')
                        filter
                            ? applyFilter(root2, filter, previewImage).then(
                                  done,
                              )
                            : done()
                    }
                if (canCreateImageBitmap(item2.file)) {
                    let worker = createWorker3(BitmapWorker)
                    worker.post({ file: item2.file }, (imageBitmap) => {
                        if ((worker.terminate(), !imageBitmap)) {
                            loadPreviewFallback()
                            return
                        }
                        previewImageLoaded(imageBitmap)
                    })
                } else loadPreviewFallback()
            },
            didDrawPreview = ({ root: root2 }) => {
                let image = root2.ref.images[root2.ref.images.length - 1]
                ;(image.translateY = 0),
                    (image.scaleX = 1),
                    (image.scaleY = 1),
                    (image.opacity = 1)
            },
            restoreOverlay = ({ root: root2 }) => {
                ;(root2.ref.overlayShadow.opacity = 1),
                    (root2.ref.overlayError.opacity = 0),
                    (root2.ref.overlaySuccess.opacity = 0)
            },
            didThrowError = ({ root: root2 }) => {
                ;(root2.ref.overlayShadow.opacity = 0.25),
                    (root2.ref.overlayError.opacity = 1)
            },
            didCompleteProcessing = ({ root: root2 }) => {
                ;(root2.ref.overlayShadow.opacity = 0.25),
                    (root2.ref.overlaySuccess.opacity = 1)
            },
            create2 = ({ root: root2 }) => {
                ;(root2.ref.images = []),
                    (root2.ref.imageData = null),
                    (root2.ref.imageViewBin = []),
                    (root2.ref.overlayShadow = root2.appendChildView(
                        root2.createChildView(OverlayView, {
                            opacity: 0,
                            status: 'idle',
                        }),
                    )),
                    (root2.ref.overlaySuccess = root2.appendChildView(
                        root2.createChildView(OverlayView, {
                            opacity: 0,
                            status: 'success',
                        }),
                    )),
                    (root2.ref.overlayError = root2.appendChildView(
                        root2.createChildView(OverlayView, {
                            opacity: 0,
                            status: 'failure',
                        }),
                    ))
            }
        return _.utils.createView({
            name: 'image-preview-wrapper',
            create: create2,
            styles: ['height'],
            apis: ['height'],
            destroy: ({ root: root2 }) => {
                root2.ref.images.forEach((imageView) => {
                    ;(imageView.image.width = 1), (imageView.image.height = 1)
                })
            },
            didWriteView: ({ root: root2 }) => {
                root2.ref.images.forEach((imageView) => {
                    imageView.dirty = !1
                })
            },
            write: _.utils.createRoute(
                {
                    DID_IMAGE_PREVIEW_DRAW: didDrawPreview,
                    DID_IMAGE_PREVIEW_CONTAINER_CREATE:
                        didCreatePreviewContainer,
                    DID_FINISH_CALCULATE_PREVIEWSIZE: drawPreview,
                    DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata,
                    DID_THROW_ITEM_LOAD_ERROR: didThrowError,
                    DID_THROW_ITEM_PROCESSING_ERROR: didThrowError,
                    DID_THROW_ITEM_INVALID: didThrowError,
                    DID_COMPLETE_ITEM_PROCESSING: didCompleteProcessing,
                    DID_START_ITEM_PROCESSING: restoreOverlay,
                    DID_REVERT_ITEM_PROCESSING: restoreOverlay,
                },
                ({ root: root2 }) => {
                    let viewsToRemove = root2.ref.imageViewBin.filter(
                        (imageView) => imageView.opacity === 0,
                    )
                    ;(root2.ref.imageViewBin = root2.ref.imageViewBin.filter(
                        (imageView) => imageView.opacity > 0,
                    )),
                        viewsToRemove.forEach((imageView) =>
                            removeImageView(root2, imageView),
                        ),
                        (viewsToRemove.length = 0)
                },
            ),
        })
    },
    plugin5 = (fpAPI) => {
        let { addFilter: addFilter2, utils } = fpAPI,
            { Type: Type2, createRoute: createRoute2, isFile: isFile2 } = utils,
            imagePreviewView = createImageWrapperView(fpAPI)
        return (
            addFilter2('CREATE_VIEW', (viewAPI) => {
                let { is, view, query } = viewAPI
                if (!is('file') || !query('GET_ALLOW_IMAGE_PREVIEW')) return
                let didLoadItem2 = ({ root: root2, props }) => {
                        let { id } = props,
                            item2 = query('GET_ITEM', id)
                        if (!item2 || !isFile2(item2.file) || item2.archived)
                            return
                        let file2 = item2.file
                        if (
                            !isPreviewableImage(file2) ||
                            !query('GET_IMAGE_PREVIEW_FILTER_ITEM')(item2)
                        )
                            return
                        let supportsCreateImageBitmap =
                                'createImageBitmap' in (window || {}),
                            maxPreviewFileSize = query(
                                'GET_IMAGE_PREVIEW_MAX_FILE_SIZE',
                            )
                        if (
                            !supportsCreateImageBitmap &&
                            maxPreviewFileSize &&
                            file2.size > maxPreviewFileSize
                        )
                            return
                        root2.ref.imagePreview = view.appendChildView(
                            view.createChildView(imagePreviewView, { id }),
                        )
                        let fixedPreviewHeight = root2.query(
                            'GET_IMAGE_PREVIEW_HEIGHT',
                        )
                        fixedPreviewHeight &&
                            root2.dispatch('DID_UPDATE_PANEL_HEIGHT', {
                                id: item2.id,
                                height: fixedPreviewHeight,
                            })
                        let queue =
                            !supportsCreateImageBitmap &&
                            file2.size >
                                query(
                                    'GET_IMAGE_PREVIEW_MAX_INSTANT_PREVIEW_FILE_SIZE',
                                )
                        root2.dispatch(
                            'DID_IMAGE_PREVIEW_CONTAINER_CREATE',
                            { id },
                            queue,
                        )
                    },
                    rescaleItem = (root2, props) => {
                        if (!root2.ref.imagePreview) return
                        let { id } = props,
                            item2 = root2.query('GET_ITEM', { id })
                        if (!item2) return
                        let panelAspectRatio = root2.query(
                                'GET_PANEL_ASPECT_RATIO',
                            ),
                            itemPanelAspectRatio = root2.query(
                                'GET_ITEM_PANEL_ASPECT_RATIO',
                            ),
                            fixedHeight = root2.query(
                                'GET_IMAGE_PREVIEW_HEIGHT',
                            )
                        if (
                            panelAspectRatio ||
                            itemPanelAspectRatio ||
                            fixedHeight
                        )
                            return
                        let { imageWidth, imageHeight } = root2.ref
                        if (!imageWidth || !imageHeight) return
                        let minPreviewHeight = root2.query(
                                'GET_IMAGE_PREVIEW_MIN_HEIGHT',
                            ),
                            maxPreviewHeight = root2.query(
                                'GET_IMAGE_PREVIEW_MAX_HEIGHT',
                            ),
                            orientation =
                                (item2.getMetadata('exif') || {}).orientation ||
                                -1
                        if (
                            (orientation >= 5 &&
                                orientation <= 8 &&
                                ([imageWidth, imageHeight] = [
                                    imageHeight,
                                    imageWidth,
                                ]),
                            !isBitmap(item2.file) ||
                                root2.query('GET_IMAGE_PREVIEW_UPSCALE'))
                        ) {
                            let scalar = 2048 / imageWidth
                            ;(imageWidth *= scalar), (imageHeight *= scalar)
                        }
                        let imageAspectRatio = imageHeight / imageWidth,
                            previewAspectRatio =
                                (item2.getMetadata('crop') || {}).aspectRatio ||
                                imageAspectRatio,
                            previewHeightMax = Math.max(
                                minPreviewHeight,
                                Math.min(imageHeight, maxPreviewHeight),
                            ),
                            itemWidth = root2.rect.element.width,
                            previewHeight = Math.min(
                                itemWidth * previewAspectRatio,
                                previewHeightMax,
                            )
                        root2.dispatch('DID_UPDATE_PANEL_HEIGHT', {
                            id: item2.id,
                            height: previewHeight,
                        })
                    },
                    didResizeView = ({ root: root2 }) => {
                        root2.ref.shouldRescale = !0
                    },
                    didUpdateItemMetadata = ({ root: root2, action }) => {
                        action.change.key === 'crop' &&
                            (root2.ref.shouldRescale = !0)
                    },
                    didCalculatePreviewSize = ({ root: root2, action }) => {
                        ;(root2.ref.imageWidth = action.width),
                            (root2.ref.imageHeight = action.height),
                            (root2.ref.shouldRescale = !0),
                            (root2.ref.shouldDrawPreview = !0),
                            root2.dispatch('KICK')
                    }
                view.registerWriter(
                    createRoute2(
                        {
                            DID_RESIZE_ROOT: didResizeView,
                            DID_STOP_RESIZE: didResizeView,
                            DID_LOAD_ITEM: didLoadItem2,
                            DID_IMAGE_PREVIEW_CALCULATE_SIZE:
                                didCalculatePreviewSize,
                            DID_UPDATE_ITEM_METADATA: didUpdateItemMetadata,
                        },
                        ({ root: root2, props }) => {
                            !root2.ref.imagePreview ||
                                root2.rect.element.hidden ||
                                (root2.ref.shouldRescale &&
                                    (rescaleItem(root2, props),
                                    (root2.ref.shouldRescale = !1)),
                                root2.ref.shouldDrawPreview &&
                                    (requestAnimationFrame(() => {
                                        requestAnimationFrame(() => {
                                            root2.dispatch(
                                                'DID_FINISH_CALCULATE_PREVIEWSIZE',
                                                { id: props.id },
                                            )
                                        })
                                    }),
                                    (root2.ref.shouldDrawPreview = !1)))
                        },
                    ),
                )
            }),
            {
                options: {
                    allowImagePreview: [!0, Type2.BOOLEAN],
                    imagePreviewFilterItem: [() => !0, Type2.FUNCTION],
                    imagePreviewHeight: [null, Type2.INT],
                    imagePreviewMinHeight: [44, Type2.INT],
                    imagePreviewMaxHeight: [256, Type2.INT],
                    imagePreviewMaxFileSize: [null, Type2.INT],
                    imagePreviewZoomFactor: [2, Type2.INT],
                    imagePreviewUpscale: [!1, Type2.BOOLEAN],
                    imagePreviewMaxInstantPreviewFileSize: [1e6, Type2.INT],
                    imagePreviewTransparencyIndicator: [null, Type2.STRING],
                    imagePreviewCalculateAverageImageColor: [!1, Type2.BOOLEAN],
                    imagePreviewMarkupShow: [!0, Type2.BOOLEAN],
                    imagePreviewMarkupFilter: [() => !0, Type2.FUNCTION],
                },
            }
        )
    },
    isBrowser6 =
        typeof window != 'undefined' && typeof window.document != 'undefined'
isBrowser6 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin5 }),
    )
var filepond_plugin_image_preview_esm_default = plugin5
var isImage2 = (file2) => /^image/.test(file2.type),
    getImageSize2 = (url, cb) => {
        let image = new Image()
        ;(image.onload = () => {
            let width = image.naturalWidth,
                height = image.naturalHeight
            ;(image = null), cb({ width, height })
        }),
            (image.onerror = () => cb(null)),
            (image.src = url)
    },
    plugin6 = ({ addFilter: addFilter2, utils }) => {
        let { Type: Type2 } = utils
        return (
            addFilter2(
                'DID_LOAD_ITEM',
                (item2, { query }) =>
                    new Promise((resolve, reject) => {
                        let file2 = item2.file
                        if (
                            !isImage2(file2) ||
                            !query('GET_ALLOW_IMAGE_RESIZE')
                        )
                            return resolve(item2)
                        let mode = query('GET_IMAGE_RESIZE_MODE'),
                            width = query('GET_IMAGE_RESIZE_TARGET_WIDTH'),
                            height = query('GET_IMAGE_RESIZE_TARGET_HEIGHT'),
                            upscale = query('GET_IMAGE_RESIZE_UPSCALE')
                        if (width === null && height === null)
                            return resolve(item2)
                        let targetWidth = width === null ? height : width,
                            targetHeight =
                                height === null ? targetWidth : height,
                            fileURL = URL.createObjectURL(file2)
                        getImageSize2(fileURL, (size) => {
                            if ((URL.revokeObjectURL(fileURL), !size))
                                return resolve(item2)
                            let { width: imageWidth, height: imageHeight } =
                                    size,
                                orientation =
                                    (item2.getMetadata('exif') || {})
                                        .orientation || -1
                            if (
                                (orientation >= 5 &&
                                    orientation <= 8 &&
                                    ([imageWidth, imageHeight] = [
                                        imageHeight,
                                        imageWidth,
                                    ]),
                                imageWidth === targetWidth &&
                                    imageHeight === targetHeight)
                            )
                                return resolve(item2)
                            if (!upscale) {
                                if (mode === 'cover') {
                                    if (
                                        imageWidth <= targetWidth ||
                                        imageHeight <= targetHeight
                                    )
                                        return resolve(item2)
                                } else if (
                                    imageWidth <= targetWidth &&
                                    imageHeight <= targetWidth
                                )
                                    return resolve(item2)
                            }
                            item2.setMetadata('resize', {
                                mode,
                                upscale,
                                size: {
                                    width: targetWidth,
                                    height: targetHeight,
                                },
                            }),
                                resolve(item2)
                        })
                    }),
            ),
            {
                options: {
                    allowImageResize: [!0, Type2.BOOLEAN],
                    imageResizeMode: ['cover', Type2.STRING],
                    imageResizeUpscale: [!0, Type2.BOOLEAN],
                    imageResizeTargetWidth: [null, Type2.INT],
                    imageResizeTargetHeight: [null, Type2.INT],
                },
            }
        )
    },
    isBrowser7 =
        typeof window != 'undefined' && typeof window.document != 'undefined'
isBrowser7 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin6 }),
    )
var filepond_plugin_image_resize_esm_default = plugin6
var isImage3 = (file2) => /^image/.test(file2.type),
    getFilenameWithoutExtension2 = (name2) =>
        name2.substr(0, name2.lastIndexOf('.')) || name2,
    ExtensionMap = { jpeg: 'jpg', 'svg+xml': 'svg' },
    renameFileToMatchMimeType = (filename, mimeType) => {
        let name2 = getFilenameWithoutExtension2(filename),
            type = mimeType.split('/')[1],
            extension = ExtensionMap[type] || type
        return `${name2}.${extension}`
    },
    getValidOutputMimeType = (type) =>
        /jpeg|png|svg\+xml/.test(type) ? type : 'image/jpeg',
    isImage$1 = (file2) => /^image/.test(file2.type),
    MATRICES = {
        1: () => [1, 0, 0, 1, 0, 0],
        2: (width) => [-1, 0, 0, 1, width, 0],
        3: (width, height) => [-1, 0, 0, -1, width, height],
        4: (width, height) => [1, 0, 0, -1, 0, height],
        5: () => [0, 1, 1, 0, 0, 0],
        6: (width, height) => [0, 1, -1, 0, height, 0],
        7: (width, height) => [0, -1, -1, 0, height, width],
        8: (width) => [0, -1, 1, 0, 0, width],
    },
    getImageOrientationMatrix = (width, height, orientation) => (
        orientation === -1 && (orientation = 1),
        MATRICES[orientation](width, height)
    ),
    createVector2 = (x, y) => ({ x, y }),
    vectorDot2 = (a, b) => a.x * b.x + a.y * b.y,
    vectorSubtract2 = (a, b) => createVector2(a.x - b.x, a.y - b.y),
    vectorDistanceSquared2 = (a, b) =>
        vectorDot2(vectorSubtract2(a, b), vectorSubtract2(a, b)),
    vectorDistance2 = (a, b) => Math.sqrt(vectorDistanceSquared2(a, b)),
    getOffsetPointOnEdge2 = (length, rotation) => {
        let a = length,
            A = 1.5707963267948966,
            B = rotation,
            C = 1.5707963267948966 - rotation,
            sinA = Math.sin(A),
            sinB = Math.sin(B),
            sinC = Math.sin(C),
            cosC = Math.cos(C),
            ratio = a / sinA,
            b = ratio * sinB,
            c = ratio * sinC
        return createVector2(cosC * b, cosC * c)
    },
    getRotatedRectSize2 = (rect, rotation) => {
        let w = rect.width,
            h = rect.height,
            hor = getOffsetPointOnEdge2(w, rotation),
            ver = getOffsetPointOnEdge2(h, rotation),
            tl = createVector2(
                rect.x + Math.abs(hor.x),
                rect.y - Math.abs(hor.y),
            ),
            tr = createVector2(
                rect.x + rect.width + Math.abs(ver.y),
                rect.y + Math.abs(ver.x),
            ),
            bl = createVector2(
                rect.x - Math.abs(ver.y),
                rect.y + rect.height - Math.abs(ver.x),
            )
        return {
            width: vectorDistance2(tl, tr),
            height: vectorDistance2(tl, bl),
        }
    },
    getImageRectZoomFactor2 = (
        imageRect,
        cropRect,
        rotation = 0,
        center2 = { x: 0.5, y: 0.5 },
    ) => {
        let cx = center2.x > 0.5 ? 1 - center2.x : center2.x,
            cy = center2.y > 0.5 ? 1 - center2.y : center2.y,
            imageWidth = cx * 2 * imageRect.width,
            imageHeight = cy * 2 * imageRect.height,
            rotatedCropSize = getRotatedRectSize2(cropRect, rotation)
        return Math.max(
            rotatedCropSize.width / imageWidth,
            rotatedCropSize.height / imageHeight,
        )
    },
    getCenteredCropRect2 = (container, aspectRatio) => {
        let width = container.width,
            height = width * aspectRatio
        height > container.height &&
            ((height = container.height), (width = height / aspectRatio))
        let x = (container.width - width) * 0.5,
            y = (container.height - height) * 0.5
        return { x, y, width, height }
    },
    calculateCanvasSize2 = (image, canvasAspectRatio, zoom = 1) => {
        let imageAspectRatio = image.height / image.width,
            canvasWidth = 1,
            canvasHeight = canvasAspectRatio,
            imgWidth = 1,
            imgHeight = imageAspectRatio
        imgHeight > canvasHeight &&
            ((imgHeight = canvasHeight),
            (imgWidth = imgHeight / imageAspectRatio))
        let scalar = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight),
            width = image.width / (zoom * scalar * imgWidth),
            height = width * canvasAspectRatio
        return { width, height }
    },
    canvasRelease = (canvas) => {
        ;(canvas.width = 1),
            (canvas.height = 1),
            canvas.getContext('2d').clearRect(0, 0, 1, 1)
    },
    isFlipped = (flip) => flip && (flip.horizontal || flip.vertical),
    getBitmap = (image, orientation, flip) => {
        if (orientation <= 1 && !isFlipped(flip))
            return (
                (image.width = image.naturalWidth),
                (image.height = image.naturalHeight),
                image
            )
        let canvas = document.createElement('canvas'),
            width = image.naturalWidth,
            height = image.naturalHeight,
            swapped = orientation >= 5 && orientation <= 8
        swapped
            ? ((canvas.width = height), (canvas.height = width))
            : ((canvas.width = width), (canvas.height = height))
        let ctx = canvas.getContext('2d')
        if (
            (orientation &&
                ctx.transform.apply(
                    ctx,
                    getImageOrientationMatrix(width, height, orientation),
                ),
            isFlipped(flip))
        ) {
            let matrix = [1, 0, 0, 1, 0, 0]
            ;((!swapped && flip.horizontal) || swapped & flip.vertical) &&
                ((matrix[0] = -1), (matrix[4] = width)),
                ((!swapped && flip.vertical) || (swapped && flip.horizontal)) &&
                    ((matrix[3] = -1), (matrix[5] = height)),
                ctx.transform(...matrix)
        }
        return ctx.drawImage(image, 0, 0, width, height), canvas
    },
    imageToImageData = (imageElement, orientation, crop = {}, options = {}) => {
        let { canvasMemoryLimit, background = null } = options,
            zoom = crop.zoom || 1,
            bitmap = getBitmap(imageElement, orientation, crop.flip),
            imageSize = { width: bitmap.width, height: bitmap.height },
            aspectRatio =
                crop.aspectRatio || imageSize.height / imageSize.width,
            canvasSize = calculateCanvasSize2(imageSize, aspectRatio, zoom)
        if (canvasMemoryLimit) {
            let requiredMemory = canvasSize.width * canvasSize.height
            if (requiredMemory > canvasMemoryLimit) {
                let scalar =
                    Math.sqrt(canvasMemoryLimit) / Math.sqrt(requiredMemory)
                ;(imageSize.width = Math.floor(imageSize.width * scalar)),
                    (imageSize.height = Math.floor(imageSize.height * scalar)),
                    (canvasSize = calculateCanvasSize2(
                        imageSize,
                        aspectRatio,
                        zoom,
                    ))
            }
        }
        let canvas = document.createElement('canvas'),
            canvasCenter = {
                x: canvasSize.width * 0.5,
                y: canvasSize.height * 0.5,
            },
            stage = {
                x: 0,
                y: 0,
                width: canvasSize.width,
                height: canvasSize.height,
                center: canvasCenter,
            },
            shouldLimit =
                typeof crop.scaleToFit == 'undefined' || crop.scaleToFit,
            scale =
                zoom *
                getImageRectZoomFactor2(
                    imageSize,
                    getCenteredCropRect2(stage, aspectRatio),
                    crop.rotation,
                    shouldLimit ? crop.center : { x: 0.5, y: 0.5 },
                )
        ;(canvas.width = Math.round(canvasSize.width / scale)),
            (canvas.height = Math.round(canvasSize.height / scale)),
            (canvasCenter.x /= scale),
            (canvasCenter.y /= scale)
        let imageOffset = {
                x:
                    canvasCenter.x -
                    imageSize.width * (crop.center ? crop.center.x : 0.5),
                y:
                    canvasCenter.y -
                    imageSize.height * (crop.center ? crop.center.y : 0.5),
            },
            ctx = canvas.getContext('2d')
        background &&
            ((ctx.fillStyle = background),
            ctx.fillRect(0, 0, canvas.width, canvas.height)),
            ctx.translate(canvasCenter.x, canvasCenter.y),
            ctx.rotate(crop.rotation || 0),
            ctx.drawImage(
                bitmap,
                imageOffset.x - canvasCenter.x,
                imageOffset.y - canvasCenter.y,
                imageSize.width,
                imageSize.height,
            )
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        return canvasRelease(canvas), imageData
    },
    IS_BROWSER3 = (() =>
        typeof window != 'undefined' && typeof window.document != 'undefined')()
IS_BROWSER3 &&
    (HTMLCanvasElement.prototype.toBlob ||
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {
                var dataURL = this.toDataURL(type, quality).split(',')[1]
                setTimeout(function () {
                    for (
                        var binStr = atob(dataURL),
                            len = binStr.length,
                            arr = new Uint8Array(len),
                            i = 0;
                        i < len;
                        i++
                    )
                        arr[i] = binStr.charCodeAt(i)
                    callback(new Blob([arr], { type: type || 'image/png' }))
                })
            },
        }))
var canvasToBlob = (canvas, options, beforeCreateBlob = null) =>
        new Promise((resolve) => {
            let promisedImage = beforeCreateBlob
                ? beforeCreateBlob(canvas)
                : canvas
            Promise.resolve(promisedImage).then((canvas2) => {
                canvas2.toBlob(resolve, options.type, options.quality)
            })
        }),
    vectorMultiply2 = (v, amount) =>
        createVector$12(v.x * amount, v.y * amount),
    vectorAdd2 = (a, b) => createVector$12(a.x + b.x, a.y + b.y),
    vectorNormalize2 = (v) => {
        let l = Math.sqrt(v.x * v.x + v.y * v.y)
        return l === 0 ? { x: 0, y: 0 } : createVector$12(v.x / l, v.y / l)
    },
    vectorRotate2 = (v, radians, origin) => {
        let cos = Math.cos(radians),
            sin = Math.sin(radians),
            t = createVector$12(v.x - origin.x, v.y - origin.y)
        return createVector$12(
            origin.x + cos * t.x - sin * t.y,
            origin.y + sin * t.x + cos * t.y,
        )
    },
    createVector$12 = (x = 0, y = 0) => ({ x, y }),
    getMarkupValue2 = (value, size, scalar = 1, axis) => {
        if (typeof value == 'string') return parseFloat(value) * scalar
        if (typeof value == 'number')
            return (
                value * (axis ? size[axis] : Math.min(size.width, size.height))
            )
    },
    getMarkupStyles2 = (markup, size, scale) => {
        let lineStyle = markup.borderStyle || markup.lineStyle || 'solid',
            fill = markup.backgroundColor || markup.fontColor || 'transparent',
            stroke = markup.borderColor || markup.lineColor || 'transparent',
            strokeWidth = getMarkupValue2(
                markup.borderWidth || markup.lineWidth,
                size,
                scale,
            ),
            lineCap = markup.lineCap || 'round',
            lineJoin = markup.lineJoin || 'round',
            dashes =
                typeof lineStyle == 'string'
                    ? ''
                    : lineStyle
                          .map((v) => getMarkupValue2(v, size, scale))
                          .join(','),
            opacity = markup.opacity || 1
        return {
            'stroke-linecap': lineCap,
            'stroke-linejoin': lineJoin,
            'stroke-width': strokeWidth || 0,
            'stroke-dasharray': dashes,
            stroke,
            fill,
            opacity,
        }
    },
    isDefined3 = (value) => value != null,
    getMarkupRect2 = (rect, size, scalar = 1) => {
        let left =
                getMarkupValue2(rect.x, size, scalar, 'width') ||
                getMarkupValue2(rect.left, size, scalar, 'width'),
            top =
                getMarkupValue2(rect.y, size, scalar, 'height') ||
                getMarkupValue2(rect.top, size, scalar, 'height'),
            width = getMarkupValue2(rect.width, size, scalar, 'width'),
            height = getMarkupValue2(rect.height, size, scalar, 'height'),
            right = getMarkupValue2(rect.right, size, scalar, 'width'),
            bottom = getMarkupValue2(rect.bottom, size, scalar, 'height')
        return (
            isDefined3(top) ||
                (isDefined3(height) && isDefined3(bottom)
                    ? (top = size.height - height - bottom)
                    : (top = bottom)),
            isDefined3(left) ||
                (isDefined3(width) && isDefined3(right)
                    ? (left = size.width - width - right)
                    : (left = right)),
            isDefined3(width) ||
                (isDefined3(left) && isDefined3(right)
                    ? (width = size.width - left - right)
                    : (width = 0)),
            isDefined3(height) ||
                (isDefined3(top) && isDefined3(bottom)
                    ? (height = size.height - top - bottom)
                    : (height = 0)),
            {
                x: left || 0,
                y: top || 0,
                width: width || 0,
                height: height || 0,
            }
        )
    },
    pointsToPathShape2 = (points) =>
        points
            .map(
                (point, index) =>
                    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
            )
            .join(' '),
    setAttributes2 = (element, attr2) =>
        Object.keys(attr2).forEach((key) =>
            element.setAttribute(key, attr2[key]),
        ),
    ns3 = 'http://www.w3.org/2000/svg',
    svg2 = (tag, attr2) => {
        let element = document.createElementNS(ns3, tag)
        return attr2 && setAttributes2(element, attr2), element
    },
    updateRect3 = (element) =>
        setAttributes2(element, { ...element.rect, ...element.styles }),
    updateEllipse2 = (element) => {
        let cx = element.rect.x + element.rect.width * 0.5,
            cy = element.rect.y + element.rect.height * 0.5,
            rx = element.rect.width * 0.5,
            ry = element.rect.height * 0.5
        return setAttributes2(element, { cx, cy, rx, ry, ...element.styles })
    },
    IMAGE_FIT_STYLE2 = { contain: 'xMidYMid meet', cover: 'xMidYMid slice' },
    updateImage2 = (element, markup) => {
        setAttributes2(element, {
            ...element.rect,
            ...element.styles,
            preserveAspectRatio: IMAGE_FIT_STYLE2[markup.fit] || 'none',
        })
    },
    TEXT_ANCHOR2 = { left: 'start', center: 'middle', right: 'end' },
    updateText2 = (element, markup, size, scale) => {
        let fontSize = getMarkupValue2(markup.fontSize, size, scale),
            fontFamily = markup.fontFamily || 'sans-serif',
            fontWeight = markup.fontWeight || 'normal',
            textAlign = TEXT_ANCHOR2[markup.textAlign] || 'start'
        setAttributes2(element, {
            ...element.rect,
            ...element.styles,
            'stroke-width': 0,
            'font-weight': fontWeight,
            'font-size': fontSize,
            'font-family': fontFamily,
            'text-anchor': textAlign,
        }),
            element.text !== markup.text &&
                ((element.text = markup.text),
                (element.textContent = markup.text.length ? markup.text : ' '))
    },
    updateLine2 = (element, markup, size, scale) => {
        setAttributes2(element, {
            ...element.rect,
            ...element.styles,
            fill: 'none',
        })
        let line = element.childNodes[0],
            begin = element.childNodes[1],
            end = element.childNodes[2],
            origin = element.rect,
            target = {
                x: element.rect.x + element.rect.width,
                y: element.rect.y + element.rect.height,
            }
        if (
            (setAttributes2(line, {
                x1: origin.x,
                y1: origin.y,
                x2: target.x,
                y2: target.y,
            }),
            !markup.lineDecoration)
        )
            return
        ;(begin.style.display = 'none'), (end.style.display = 'none')
        let v = vectorNormalize2({
                x: target.x - origin.x,
                y: target.y - origin.y,
            }),
            l = getMarkupValue2(0.05, size, scale)
        if (markup.lineDecoration.indexOf('arrow-begin') !== -1) {
            let arrowBeginRotationPoint = vectorMultiply2(v, l),
                arrowBeginCenter = vectorAdd2(origin, arrowBeginRotationPoint),
                arrowBeginA = vectorRotate2(origin, 2, arrowBeginCenter),
                arrowBeginB = vectorRotate2(origin, -2, arrowBeginCenter)
            setAttributes2(begin, {
                style: 'display:block;',
                d: `M${arrowBeginA.x},${arrowBeginA.y} L${origin.x},${origin.y} L${arrowBeginB.x},${arrowBeginB.y}`,
            })
        }
        if (markup.lineDecoration.indexOf('arrow-end') !== -1) {
            let arrowEndRotationPoint = vectorMultiply2(v, -l),
                arrowEndCenter = vectorAdd2(target, arrowEndRotationPoint),
                arrowEndA = vectorRotate2(target, 2, arrowEndCenter),
                arrowEndB = vectorRotate2(target, -2, arrowEndCenter)
            setAttributes2(end, {
                style: 'display:block;',
                d: `M${arrowEndA.x},${arrowEndA.y} L${target.x},${target.y} L${arrowEndB.x},${arrowEndB.y}`,
            })
        }
    },
    updatePath2 = (element, markup, size, scale) => {
        setAttributes2(element, {
            ...element.styles,
            fill: 'none',
            d: pointsToPathShape2(
                markup.points.map((point) => ({
                    x: getMarkupValue2(point.x, size, scale, 'width'),
                    y: getMarkupValue2(point.y, size, scale, 'height'),
                })),
            ),
        })
    },
    createShape2 = (node) => (markup) => svg2(node, { id: markup.id }),
    createImage2 = (markup) => {
        let shape = svg2('image', {
            id: markup.id,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            opacity: '0',
        })
        return (
            (shape.onload = () => {
                shape.setAttribute('opacity', markup.opacity || 1)
            }),
            shape.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'xlink:href',
                markup.src,
            ),
            shape
        )
    },
    createLine2 = (markup) => {
        let shape = svg2('g', {
                id: markup.id,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
            }),
            line = svg2('line')
        shape.appendChild(line)
        let begin = svg2('path')
        shape.appendChild(begin)
        let end = svg2('path')
        return shape.appendChild(end), shape
    },
    CREATE_TYPE_ROUTES2 = {
        image: createImage2,
        rect: createShape2('rect'),
        ellipse: createShape2('ellipse'),
        text: createShape2('text'),
        path: createShape2('path'),
        line: createLine2,
    },
    UPDATE_TYPE_ROUTES2 = {
        rect: updateRect3,
        ellipse: updateEllipse2,
        image: updateImage2,
        text: updateText2,
        path: updatePath2,
        line: updateLine2,
    },
    createMarkupByType2 = (type, markup) => CREATE_TYPE_ROUTES2[type](markup),
    updateMarkupByType2 = (element, type, markup, size, scale) => {
        type !== 'path' && (element.rect = getMarkupRect2(markup, size, scale)),
            (element.styles = getMarkupStyles2(markup, size, scale)),
            UPDATE_TYPE_ROUTES2[type](element, markup, size, scale)
    },
    sortMarkupByZIndex2 = (a, b) =>
        a[1].zIndex > b[1].zIndex ? 1 : a[1].zIndex < b[1].zIndex ? -1 : 0,
    cropSVG = (blob2, crop = {}, markup, options) =>
        new Promise((resolve) => {
            let { background = null } = options,
                fr = new FileReader()
            ;(fr.onloadend = () => {
                let text2 = fr.result,
                    original = document.createElement('div')
                ;(original.style.cssText =
                    'position:absolute;pointer-events:none;width:0;height:0;visibility:hidden;'),
                    (original.innerHTML = text2)
                let originalNode = original.querySelector('svg')
                document.body.appendChild(original)
                let bBox = originalNode.getBBox()
                original.parentNode.removeChild(original)
                let titleNode = original.querySelector('title'),
                    viewBoxAttribute =
                        originalNode.getAttribute('viewBox') || '',
                    widthAttribute = originalNode.getAttribute('width') || '',
                    heightAttribute = originalNode.getAttribute('height') || '',
                    width = parseFloat(widthAttribute) || null,
                    height = parseFloat(heightAttribute) || null,
                    widthUnits =
                        (widthAttribute.match(/[a-z]+/) || [])[0] || '',
                    heightUnits =
                        (heightAttribute.match(/[a-z]+/) || [])[0] || '',
                    viewBoxList = viewBoxAttribute.split(' ').map(parseFloat),
                    viewBox = viewBoxList.length
                        ? {
                              x: viewBoxList[0],
                              y: viewBoxList[1],
                              width: viewBoxList[2],
                              height: viewBoxList[3],
                          }
                        : bBox,
                    imageWidth = width ?? viewBox.width,
                    imageHeight = height ?? viewBox.height
                ;(originalNode.style.overflow = 'visible'),
                    originalNode.setAttribute('width', imageWidth),
                    originalNode.setAttribute('height', imageHeight)
                let markupSVG = ''
                if (markup && markup.length) {
                    let size = { width: imageWidth, height: imageHeight }
                    ;(markupSVG = markup
                        .sort(sortMarkupByZIndex2)
                        .reduce((prev, shape) => {
                            let el = createMarkupByType2(shape[0], shape[1])
                            return (
                                updateMarkupByType2(
                                    el,
                                    shape[0],
                                    shape[1],
                                    size,
                                ),
                                el.removeAttribute('id'),
                                el.getAttribute('opacity') === 1 &&
                                    el.removeAttribute('opacity'),
                                prev +
                                    `
` +
                                    el.outerHTML +
                                    `
`
                            )
                        }, '')),
                        (markupSVG = `

<g>${markupSVG.replace(/&nbsp;/g, ' ')}</g>

`)
                }
                let aspectRatio = crop.aspectRatio || imageHeight / imageWidth,
                    canvasWidth = imageWidth,
                    canvasHeight = canvasWidth * aspectRatio,
                    shouldLimit =
                        typeof crop.scaleToFit == 'undefined' ||
                        crop.scaleToFit,
                    cropCenterX = crop.center ? crop.center.x : 0.5,
                    cropCenterY = crop.center ? crop.center.y : 0.5,
                    canvasZoomFactor = getImageRectZoomFactor2(
                        { width: imageWidth, height: imageHeight },
                        getCenteredCropRect2(
                            { width: canvasWidth, height: canvasHeight },
                            aspectRatio,
                        ),
                        crop.rotation,
                        shouldLimit
                            ? { x: cropCenterX, y: cropCenterY }
                            : { x: 0.5, y: 0.5 },
                    ),
                    scale = crop.zoom * canvasZoomFactor,
                    rotation = crop.rotation * (180 / Math.PI),
                    canvasCenter = {
                        x: canvasWidth * 0.5,
                        y: canvasHeight * 0.5,
                    },
                    imageOffset = {
                        x: canvasCenter.x - imageWidth * cropCenterX,
                        y: canvasCenter.y - imageHeight * cropCenterY,
                    },
                    cropTransforms = [
                        `rotate(${rotation} ${canvasCenter.x} ${canvasCenter.y})`,
                        `translate(${canvasCenter.x} ${canvasCenter.y})`,
                        `scale(${scale})`,
                        `translate(${-canvasCenter.x} ${-canvasCenter.y})`,
                        `translate(${imageOffset.x} ${imageOffset.y})`,
                    ],
                    cropFlipHorizontal = crop.flip && crop.flip.horizontal,
                    cropFlipVertical = crop.flip && crop.flip.vertical,
                    flipTransforms = [
                        `scale(${cropFlipHorizontal ? -1 : 1} ${
                            cropFlipVertical ? -1 : 1
                        })`,
                        `translate(${cropFlipHorizontal ? -imageWidth : 0} ${
                            cropFlipVertical ? -imageHeight : 0
                        })`,
                    ],
                    transformed = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${canvasWidth}${widthUnits}" height="${canvasHeight}${heightUnits}" 
viewBox="0 0 ${canvasWidth} ${canvasHeight}" ${
                        background
                            ? 'style="background:' + background + '" '
                            : ''
                    }
preserveAspectRatio="xMinYMin"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns="http://www.w3.org/2000/svg">
<!-- Generated by PQINA - https://pqina.nl/ -->
<title>${titleNode ? titleNode.textContent : ''}</title>
<g transform="${cropTransforms.join(' ')}">
<g transform="${flipTransforms.join(' ')}">
${originalNode.outerHTML}${markupSVG}
</g>
</g>
</svg>`
                resolve(transformed)
            }),
                fr.readAsText(blob2)
        }),
    objectToImageData = (obj) => {
        let imageData
        try {
            imageData = new ImageData(obj.width, obj.height)
        } catch (e) {
            imageData = document
                .createElement('canvas')
                .getContext('2d')
                .createImageData(obj.width, obj.height)
        }
        return imageData.data.set(obj.data), imageData
    },
    TransformWorker = () => {
        let TRANSFORMS = { resize, filter },
            applyTransforms = (transforms2, imageData) => (
                transforms2.forEach((transform2) => {
                    imageData = TRANSFORMS[transform2.type](
                        imageData,
                        transform2.data,
                    )
                }),
                imageData
            ),
            transform = (data3, cb) => {
                let transforms2 = data3.transforms,
                    filterTransform = null
                if (
                    (transforms2.forEach((transform2) => {
                        transform2.type === 'filter' &&
                            (filterTransform = transform2)
                    }),
                    filterTransform)
                ) {
                    let resizeTransform = null
                    transforms2.forEach((transform2) => {
                        transform2.type === 'resize' &&
                            (resizeTransform = transform2)
                    }),
                        resizeTransform &&
                            ((resizeTransform.data.matrix =
                                filterTransform.data),
                            (transforms2 = transforms2.filter(
                                (transform2) => transform2.type !== 'filter',
                            )))
                }
                cb(applyTransforms(transforms2, data3.imageData))
            }
        self.onmessage = (e) => {
            transform(e.data.message, (response) => {
                self.postMessage({ id: e.data.id, message: response }, [
                    response.data.buffer,
                ])
            })
        }
        let br = 1,
            bg = 1,
            bb = 1
        function applyFilterMatrix(index, data3, m) {
            let ir = data3[index] / 255,
                ig = data3[index + 1] / 255,
                ib = data3[index + 2] / 255,
                ia = data3[index + 3] / 255,
                mr = ir * m[0] + ig * m[1] + ib * m[2] + ia * m[3] + m[4],
                mg = ir * m[5] + ig * m[6] + ib * m[7] + ia * m[8] + m[9],
                mb = ir * m[10] + ig * m[11] + ib * m[12] + ia * m[13] + m[14],
                ma = ir * m[15] + ig * m[16] + ib * m[17] + ia * m[18] + m[19],
                or = Math.max(0, mr * ma) + br * (1 - ma),
                og = Math.max(0, mg * ma) + bg * (1 - ma),
                ob = Math.max(0, mb * ma) + bb * (1 - ma)
            ;(data3[index] = Math.max(0, Math.min(1, or)) * 255),
                (data3[index + 1] = Math.max(0, Math.min(1, og)) * 255),
                (data3[index + 2] = Math.max(0, Math.min(1, ob)) * 255)
        }
        let identityMatrix = self.JSON.stringify([
            1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
        ])
        function isIdentityMatrix(filter2) {
            return self.JSON.stringify(filter2 || []) === identityMatrix
        }
        function filter(imageData, matrix) {
            if (!matrix || isIdentityMatrix(matrix)) return imageData
            let data3 = imageData.data,
                l = data3.length,
                m11 = matrix[0],
                m12 = matrix[1],
                m13 = matrix[2],
                m14 = matrix[3],
                m15 = matrix[4],
                m21 = matrix[5],
                m22 = matrix[6],
                m23 = matrix[7],
                m24 = matrix[8],
                m25 = matrix[9],
                m31 = matrix[10],
                m32 = matrix[11],
                m33 = matrix[12],
                m34 = matrix[13],
                m35 = matrix[14],
                m41 = matrix[15],
                m42 = matrix[16],
                m43 = matrix[17],
                m44 = matrix[18],
                m45 = matrix[19],
                index = 0,
                r = 0,
                g = 0,
                b = 0,
                a = 0,
                mr = 0,
                mg = 0,
                mb = 0,
                ma = 0,
                or = 0,
                og = 0,
                ob = 0
            for (; index < l; index += 4)
                (r = data3[index] / 255),
                    (g = data3[index + 1] / 255),
                    (b = data3[index + 2] / 255),
                    (a = data3[index + 3] / 255),
                    (mr = r * m11 + g * m12 + b * m13 + a * m14 + m15),
                    (mg = r * m21 + g * m22 + b * m23 + a * m24 + m25),
                    (mb = r * m31 + g * m32 + b * m33 + a * m34 + m35),
                    (ma = r * m41 + g * m42 + b * m43 + a * m44 + m45),
                    (or = Math.max(0, mr * ma) + br * (1 - ma)),
                    (og = Math.max(0, mg * ma) + bg * (1 - ma)),
                    (ob = Math.max(0, mb * ma) + bb * (1 - ma)),
                    (data3[index] = Math.max(0, Math.min(1, or)) * 255),
                    (data3[index + 1] = Math.max(0, Math.min(1, og)) * 255),
                    (data3[index + 2] = Math.max(0, Math.min(1, ob)) * 255)
            return imageData
        }
        function resize(imageData, data3) {
            let {
                mode = 'contain',
                upscale = !1,
                width,
                height,
                matrix,
            } = data3
            if (
                ((matrix = !matrix || isIdentityMatrix(matrix) ? null : matrix),
                !width && !height)
            )
                return filter(imageData, matrix)
            if (
                (width === null
                    ? (width = height)
                    : height === null && (height = width),
                mode !== 'force')
            ) {
                let scalarWidth = width / imageData.width,
                    scalarHeight = height / imageData.height,
                    scalar = 1
                if (
                    (mode === 'cover'
                        ? (scalar = Math.max(scalarWidth, scalarHeight))
                        : mode === 'contain' &&
                          (scalar = Math.min(scalarWidth, scalarHeight)),
                    scalar > 1 && upscale === !1)
                )
                    return filter(imageData, matrix)
                ;(width = imageData.width * scalar),
                    (height = imageData.height * scalar)
            }
            let originWidth = imageData.width,
                originHeight = imageData.height,
                targetWidth = Math.round(width),
                targetHeight = Math.round(height),
                inputData = imageData.data,
                outputData = new Uint8ClampedArray(
                    targetWidth * targetHeight * 4,
                ),
                ratioWidth = originWidth / targetWidth,
                ratioHeight = originHeight / targetHeight,
                ratioWidthHalf = Math.ceil(ratioWidth * 0.5),
                ratioHeightHalf = Math.ceil(ratioHeight * 0.5)
            for (let j = 0; j < targetHeight; j++)
                for (let i = 0; i < targetWidth; i++) {
                    let x2 = (i + j * targetWidth) * 4,
                        weight = 0,
                        weights = 0,
                        weightsAlpha = 0,
                        r = 0,
                        g = 0,
                        b = 0,
                        a = 0,
                        centerY = (j + 0.5) * ratioHeight
                    for (
                        let yy = Math.floor(j * ratioHeight);
                        yy < (j + 1) * ratioHeight;
                        yy++
                    ) {
                        let dy =
                                Math.abs(centerY - (yy + 0.5)) /
                                ratioHeightHalf,
                            centerX = (i + 0.5) * ratioWidth,
                            w0 = dy * dy
                        for (
                            let xx = Math.floor(i * ratioWidth);
                            xx < (i + 1) * ratioWidth;
                            xx++
                        ) {
                            let dx =
                                    Math.abs(centerX - (xx + 0.5)) /
                                    ratioWidthHalf,
                                w = Math.sqrt(w0 + dx * dx)
                            if (
                                w >= -1 &&
                                w <= 1 &&
                                ((weight = 2 * w * w * w - 3 * w * w + 1),
                                weight > 0)
                            ) {
                                dx = 4 * (xx + yy * originWidth)
                                let ref = inputData[dx + 3]
                                ;(a += weight * ref),
                                    (weightsAlpha += weight),
                                    ref < 255 &&
                                        (weight = (weight * ref) / 250),
                                    (r += weight * inputData[dx]),
                                    (g += weight * inputData[dx + 1]),
                                    (b += weight * inputData[dx + 2]),
                                    (weights += weight)
                            }
                        }
                    }
                    ;(outputData[x2] = r / weights),
                        (outputData[x2 + 1] = g / weights),
                        (outputData[x2 + 2] = b / weights),
                        (outputData[x2 + 3] = a / weightsAlpha),
                        matrix && applyFilterMatrix(x2, outputData, matrix)
                }
            return {
                data: outputData,
                width: targetWidth,
                height: targetHeight,
            }
        }
    },
    correctOrientation = (view, offset) => {
        if (view.getUint32(offset + 4, !1) !== 1165519206) return
        offset += 4
        let intelByteAligned = view.getUint16((offset += 6), !1) === 18761
        offset += view.getUint32(offset + 4, intelByteAligned)
        let tags = view.getUint16(offset, intelByteAligned)
        offset += 2
        for (let i = 0; i < tags; i++)
            if (view.getUint16(offset + i * 12, intelByteAligned) === 274)
                return (
                    view.setUint16(offset + i * 12 + 8, 1, intelByteAligned), !0
                )
        return !1
    },
    readData = (data3) => {
        let view = new DataView(data3)
        if (view.getUint16(0) !== 65496) return null
        let offset = 2,
            marker,
            markerLength,
            orientationCorrected = !1
        for (
            ;
            offset < view.byteLength &&
            ((marker = view.getUint16(offset, !1)),
            (markerLength = view.getUint16(offset + 2, !1) + 2),
            !(
                !((marker >= 65504 && marker <= 65519) || marker === 65534) ||
                (orientationCorrected ||
                    (orientationCorrected = correctOrientation(
                        view,
                        offset,
                        markerLength,
                    )),
                offset + markerLength > view.byteLength)
            ));

        )
            offset += markerLength
        return data3.slice(0, offset)
    },
    getImageHead = (file2) =>
        new Promise((resolve) => {
            let reader = new FileReader()
            ;(reader.onload = () => resolve(readData(reader.result) || null)),
                reader.readAsArrayBuffer(file2.slice(0, 256 * 1024))
        }),
    getBlobBuilder2 = () =>
        (window.BlobBuilder =
            window.BlobBuilder ||
            window.WebKitBlobBuilder ||
            window.MozBlobBuilder ||
            window.MSBlobBuilder),
    createBlob2 = (arrayBuffer, mimeType) => {
        let BB = getBlobBuilder2()
        if (BB) {
            let bb = new BB()
            return bb.append(arrayBuffer), bb.getBlob(mimeType)
        }
        return new Blob([arrayBuffer], { type: mimeType })
    },
    getUniqueId2 = () => Math.random().toString(36).substr(2, 9),
    createWorker2 = (fn2) => {
        let workerBlob = new Blob(['(', fn2.toString(), ')()'], {
                type: 'application/javascript',
            }),
            workerURL = URL.createObjectURL(workerBlob),
            worker = new Worker(workerURL),
            trips = []
        return {
            transfer: () => {},
            post: (message, cb, transferList) => {
                let id = getUniqueId2()
                ;(trips[id] = cb),
                    (worker.onmessage = (e) => {
                        let cb2 = trips[e.data.id]
                        !cb2 || (cb2(e.data.message), delete trips[e.data.id])
                    }),
                    worker.postMessage({ id, message }, transferList)
            },
            terminate: () => {
                worker.terminate(), URL.revokeObjectURL(workerURL)
            },
        }
    },
    loadImage3 = (url) =>
        new Promise((resolve, reject) => {
            let img = new Image()
            ;(img.onload = () => {
                resolve(img)
            }),
                (img.onerror = (e) => {
                    reject(e)
                }),
                (img.src = url)
        }),
    chain = (funcs) =>
        funcs.reduce(
            (promise, func) =>
                promise.then((result) =>
                    func().then(Array.prototype.concat.bind(result)),
                ),
            Promise.resolve([]),
        ),
    canvasApplyMarkup = (canvas, markup) =>
        new Promise((resolve) => {
            let size = { width: canvas.width, height: canvas.height },
                ctx = canvas.getContext('2d'),
                drawers = markup.sort(sortMarkupByZIndex2).map(
                    (item2) => () =>
                        new Promise((resolve2) => {
                            TYPE_DRAW_ROUTES[item2[0]](
                                ctx,
                                size,
                                item2[1],
                                resolve2,
                            ) && resolve2()
                        }),
                )
            chain(drawers).then(() => resolve(canvas))
        }),
    applyMarkupStyles = (ctx, styles2) => {
        ctx.beginPath(),
            (ctx.lineCap = styles2['stroke-linecap']),
            (ctx.lineJoin = styles2['stroke-linejoin']),
            (ctx.lineWidth = styles2['stroke-width']),
            styles2['stroke-dasharray'].length &&
                ctx.setLineDash(styles2['stroke-dasharray'].split(',')),
            (ctx.fillStyle = styles2.fill),
            (ctx.strokeStyle = styles2.stroke),
            (ctx.globalAlpha = styles2.opacity || 1)
    },
    drawMarkupStyles = (ctx) => {
        ctx.fill(), ctx.stroke(), (ctx.globalAlpha = 1)
    },
    drawRect = (ctx, size, markup) => {
        let rect = getMarkupRect2(markup, size),
            styles2 = getMarkupStyles2(markup, size)
        return (
            applyMarkupStyles(ctx, styles2),
            ctx.rect(rect.x, rect.y, rect.width, rect.height),
            drawMarkupStyles(ctx, styles2),
            !0
        )
    },
    drawEllipse = (ctx, size, markup) => {
        let rect = getMarkupRect2(markup, size),
            styles2 = getMarkupStyles2(markup, size)
        applyMarkupStyles(ctx, styles2)
        let x = rect.x,
            y = rect.y,
            w = rect.width,
            h = rect.height,
            kappa = 0.5522848,
            ox = (w / 2) * kappa,
            oy = (h / 2) * kappa,
            xe = x + w,
            ye = y + h,
            xm = x + w / 2,
            ym = y + h / 2
        return (
            ctx.moveTo(x, ym),
            ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y),
            ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym),
            ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye),
            ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym),
            drawMarkupStyles(ctx, styles2),
            !0
        )
    },
    drawImage = (ctx, size, markup, done) => {
        let rect = getMarkupRect2(markup, size),
            styles2 = getMarkupStyles2(markup, size)
        applyMarkupStyles(ctx, styles2)
        let image = new Image()
        new URL(markup.src, window.location.href).origin !==
            window.location.origin && (image.crossOrigin = ''),
            (image.onload = () => {
                if (markup.fit === 'cover') {
                    let ar = rect.width / rect.height,
                        width = ar > 1 ? image.width : image.height * ar,
                        height = ar > 1 ? image.width / ar : image.height,
                        x = image.width * 0.5 - width * 0.5,
                        y = image.height * 0.5 - height * 0.5
                    ctx.drawImage(
                        image,
                        x,
                        y,
                        width,
                        height,
                        rect.x,
                        rect.y,
                        rect.width,
                        rect.height,
                    )
                } else if (markup.fit === 'contain') {
                    let scalar = Math.min(
                            rect.width / image.width,
                            rect.height / image.height,
                        ),
                        width = scalar * image.width,
                        height = scalar * image.height,
                        x = rect.x + rect.width * 0.5 - width * 0.5,
                        y = rect.y + rect.height * 0.5 - height * 0.5
                    ctx.drawImage(
                        image,
                        0,
                        0,
                        image.width,
                        image.height,
                        x,
                        y,
                        width,
                        height,
                    )
                } else
                    ctx.drawImage(
                        image,
                        0,
                        0,
                        image.width,
                        image.height,
                        rect.x,
                        rect.y,
                        rect.width,
                        rect.height,
                    )
                drawMarkupStyles(ctx, styles2), done()
            }),
            (image.src = markup.src)
    },
    drawText = (ctx, size, markup) => {
        let rect = getMarkupRect2(markup, size),
            styles2 = getMarkupStyles2(markup, size)
        applyMarkupStyles(ctx, styles2)
        let fontSize = getMarkupValue2(markup.fontSize, size),
            fontFamily = markup.fontFamily || 'sans-serif',
            fontWeight = markup.fontWeight || 'normal',
            textAlign = markup.textAlign || 'left'
        return (
            (ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`),
            (ctx.textAlign = textAlign),
            ctx.fillText(markup.text, rect.x, rect.y),
            drawMarkupStyles(ctx, styles2),
            !0
        )
    },
    drawPath = (ctx, size, markup) => {
        let styles2 = getMarkupStyles2(markup, size)
        applyMarkupStyles(ctx, styles2), ctx.beginPath()
        let points = markup.points.map((point) => ({
            x: getMarkupValue2(point.x, size, 1, 'width'),
            y: getMarkupValue2(point.y, size, 1, 'height'),
        }))
        ctx.moveTo(points[0].x, points[0].y)
        let l = points.length
        for (let i = 1; i < l; i++) ctx.lineTo(points[i].x, points[i].y)
        return drawMarkupStyles(ctx, styles2), !0
    },
    drawLine = (ctx, size, markup) => {
        let rect = getMarkupRect2(markup, size),
            styles2 = getMarkupStyles2(markup, size)
        applyMarkupStyles(ctx, styles2), ctx.beginPath()
        let origin = { x: rect.x, y: rect.y },
            target = { x: rect.x + rect.width, y: rect.y + rect.height }
        ctx.moveTo(origin.x, origin.y), ctx.lineTo(target.x, target.y)
        let v = vectorNormalize2({
                x: target.x - origin.x,
                y: target.y - origin.y,
            }),
            l = 0.04 * Math.min(size.width, size.height)
        if (markup.lineDecoration.indexOf('arrow-begin') !== -1) {
            let arrowBeginRotationPoint = vectorMultiply2(v, l),
                arrowBeginCenter = vectorAdd2(origin, arrowBeginRotationPoint),
                arrowBeginA = vectorRotate2(origin, 2, arrowBeginCenter),
                arrowBeginB = vectorRotate2(origin, -2, arrowBeginCenter)
            ctx.moveTo(arrowBeginA.x, arrowBeginA.y),
                ctx.lineTo(origin.x, origin.y),
                ctx.lineTo(arrowBeginB.x, arrowBeginB.y)
        }
        if (markup.lineDecoration.indexOf('arrow-end') !== -1) {
            let arrowEndRotationPoint = vectorMultiply2(v, -l),
                arrowEndCenter = vectorAdd2(target, arrowEndRotationPoint),
                arrowEndA = vectorRotate2(target, 2, arrowEndCenter),
                arrowEndB = vectorRotate2(target, -2, arrowEndCenter)
            ctx.moveTo(arrowEndA.x, arrowEndA.y),
                ctx.lineTo(target.x, target.y),
                ctx.lineTo(arrowEndB.x, arrowEndB.y)
        }
        return drawMarkupStyles(ctx, styles2), !0
    },
    TYPE_DRAW_ROUTES = {
        rect: drawRect,
        ellipse: drawEllipse,
        image: drawImage,
        text: drawText,
        line: drawLine,
        path: drawPath,
    },
    imageDataToCanvas = (imageData) => {
        let image = document.createElement('canvas')
        return (
            (image.width = imageData.width),
            (image.height = imageData.height),
            image.getContext('2d').putImageData(imageData, 0, 0),
            image
        )
    },
    transformImage = (file2, instructions, options = {}) =>
        new Promise((resolve, reject) => {
            if (!file2 || !isImage$1(file2))
                return reject({ status: 'not an image file', file: file2 })
            let {
                    stripImageHead,
                    beforeCreateBlob,
                    afterCreateBlob,
                    canvasMemoryLimit,
                } = options,
                { crop, size, filter, markup, output } = instructions,
                orientation =
                    instructions.image && instructions.image.orientation
                        ? Math.max(
                              1,
                              Math.min(8, instructions.image.orientation),
                          )
                        : null,
                qualityAsPercentage = output && output.quality,
                quality =
                    qualityAsPercentage === null
                        ? null
                        : qualityAsPercentage / 100,
                type = (output && output.type) || null,
                background = (output && output.background) || null,
                transforms2 = []
            size &&
                (typeof size.width == 'number' ||
                    typeof size.height == 'number') &&
                transforms2.push({ type: 'resize', data: size }),
                filter &&
                    filter.length === 20 &&
                    transforms2.push({ type: 'filter', data: filter })
            let resolveWithBlob = (blob2) => {
                    let promisedBlob = afterCreateBlob
                        ? afterCreateBlob(blob2)
                        : blob2
                    Promise.resolve(promisedBlob).then(resolve)
                },
                toBlob = (imageData, options2) => {
                    let canvas = imageDataToCanvas(imageData),
                        promisedCanvas = markup.length
                            ? canvasApplyMarkup(canvas, markup)
                            : canvas
                    Promise.resolve(promisedCanvas).then((canvas2) => {
                        canvasToBlob(canvas2, options2, beforeCreateBlob)
                            .then((blob2) => {
                                if ((canvasRelease(canvas2), stripImageHead))
                                    return resolveWithBlob(blob2)
                                getImageHead(file2).then((imageHead) => {
                                    imageHead !== null &&
                                        (blob2 = new Blob(
                                            [imageHead, blob2.slice(20)],
                                            { type: blob2.type },
                                        )),
                                        resolveWithBlob(blob2)
                                })
                            })
                            .catch(reject)
                    })
                }
            if (/svg/.test(file2.type) && type === null)
                return cropSVG(file2, crop, markup, { background }).then(
                    (text2) => {
                        resolve(createBlob2(text2, 'image/svg+xml'))
                    },
                )
            let url = URL.createObjectURL(file2)
            loadImage3(url)
                .then((image) => {
                    URL.revokeObjectURL(url)
                    let imageData = imageToImageData(image, orientation, crop, {
                            canvasMemoryLimit,
                            background,
                        }),
                        outputFormat = { quality, type: type || file2.type }
                    if (!transforms2.length)
                        return toBlob(imageData, outputFormat)
                    let worker = createWorker2(TransformWorker)
                    worker.post(
                        { transforms: transforms2, imageData },
                        (response) => {
                            toBlob(objectToImageData(response), outputFormat),
                                worker.terminate()
                        },
                        [imageData.data.buffer],
                    )
                })
                .catch(reject)
        }),
    MARKUP_RECT2 = [
        'x',
        'y',
        'left',
        'top',
        'right',
        'bottom',
        'width',
        'height',
    ],
    toOptionalFraction2 = (value) =>
        typeof value == 'string' && /%/.test(value)
            ? parseFloat(value) / 100
            : value,
    prepareMarkup2 = (markup) => {
        let [type, props] = markup,
            rect = props.points
                ? {}
                : MARKUP_RECT2.reduce(
                      (prev, curr) => (
                          (prev[curr] = toOptionalFraction2(props[curr])), prev
                      ),
                      {},
                  )
        return [type, { zIndex: 0, ...props, ...rect }]
    },
    getImageSize3 = (file2) =>
        new Promise((resolve, reject) => {
            let imageElement = new Image()
            imageElement.src = URL.createObjectURL(file2)
            let measure = () => {
                let width = imageElement.naturalWidth,
                    height = imageElement.naturalHeight
                !(width && height) ||
                    (URL.revokeObjectURL(imageElement.src),
                    clearInterval(intervalId),
                    resolve({ width, height }))
            }
            imageElement.onerror = (err) => {
                URL.revokeObjectURL(imageElement.src),
                    clearInterval(intervalId),
                    reject(err)
            }
            let intervalId = setInterval(measure, 1)
            measure()
        })
typeof window != 'undefined' &&
    typeof window.document != 'undefined' &&
    (HTMLCanvasElement.prototype.toBlob ||
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (cb, type, quality) {
                let canvas = this
                setTimeout(() => {
                    let dataURL = canvas.toDataURL(type, quality).split(',')[1],
                        binStr = atob(dataURL),
                        index = binStr.length,
                        data3 = new Uint8Array(index)
                    for (; index--; ) data3[index] = binStr.charCodeAt(index)
                    cb(new Blob([data3], { type: type || 'image/png' }))
                })
            },
        }))
var isBrowser8 =
        typeof window != 'undefined' && typeof window.document != 'undefined',
    isIOS =
        isBrowser8 &&
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !window.MSStream,
    plugin7 = ({ addFilter: addFilter2, utils }) => {
        let {
                Type: Type2,
                forin: forin2,
                getFileFromBlob: getFileFromBlob2,
                isFile: isFile2,
            } = utils,
            TRANSFORM_LIST = ['crop', 'resize', 'filter', 'markup', 'output'],
            createVariantCreator =
                (updateMetadata) => (transform, file2, metadata) =>
                    transform(
                        file2,
                        updateMetadata ? updateMetadata(metadata) : metadata,
                    ),
            isDefaultCrop = (crop) =>
                crop.aspectRatio === null &&
                crop.rotation === 0 &&
                crop.zoom === 1 &&
                crop.center &&
                crop.center.x === 0.5 &&
                crop.center.y === 0.5 &&
                crop.flip &&
                crop.flip.horizontal === !1 &&
                crop.flip.vertical === !1
        addFilter2(
            'SHOULD_PREPARE_OUTPUT',
            (shouldPrepareOutput, { query }) =>
                new Promise((resolve) => {
                    resolve(!query('IS_ASYNC'))
                }),
        )
        let shouldTransformFile = (query, file2, item2) =>
            new Promise((resolve) => {
                if (
                    !query('GET_ALLOW_IMAGE_TRANSFORM') ||
                    item2.archived ||
                    !isFile2(file2) ||
                    !isImage3(file2)
                )
                    return resolve(!1)
                getImageSize3(file2)
                    .then(() => {
                        let fn2 = query('GET_IMAGE_TRANSFORM_IMAGE_FILTER')
                        if (fn2) {
                            let filterResult = fn2(file2)
                            if (filterResult == null) return handleRevert(!0)
                            if (typeof filterResult == 'boolean')
                                return resolve(filterResult)
                            if (typeof filterResult.then == 'function')
                                return filterResult.then(resolve)
                        }
                        resolve(!0)
                    })
                    .catch((err) => {
                        resolve(!1)
                    })
            })
        return (
            addFilter2('DID_CREATE_ITEM', (item2, { query, dispatch }) => {
                !query('GET_ALLOW_IMAGE_TRANSFORM') ||
                    item2.extend(
                        'requestPrepare',
                        () =>
                            new Promise((resolve, reject) => {
                                dispatch(
                                    'REQUEST_PREPARE_OUTPUT',
                                    {
                                        query: item2.id,
                                        item: item2,
                                        success: resolve,
                                        failure: reject,
                                    },
                                    !0,
                                )
                            }),
                    )
            }),
            addFilter2(
                'PREPARE_OUTPUT',
                (file2, { query, item: item2 }) =>
                    new Promise((resolve) => {
                        shouldTransformFile(query, file2, item2).then(
                            (shouldTransform) => {
                                if (!shouldTransform) return resolve(file2)
                                let variants = []
                                query(
                                    'GET_IMAGE_TRANSFORM_VARIANTS_INCLUDE_ORIGINAL',
                                ) &&
                                    variants.push(
                                        () =>
                                            new Promise((resolve2) => {
                                                resolve2({
                                                    name: query(
                                                        'GET_IMAGE_TRANSFORM_VARIANTS_ORIGINAL_NAME',
                                                    ),
                                                    file: file2,
                                                })
                                            }),
                                    ),
                                    query(
                                        'GET_IMAGE_TRANSFORM_VARIANTS_INCLUDE_DEFAULT',
                                    ) &&
                                        variants.push(
                                            (transform2, file3, metadata) =>
                                                new Promise((resolve2) => {
                                                    transform2(
                                                        file3,
                                                        metadata,
                                                    ).then((file4) =>
                                                        resolve2({
                                                            name: query(
                                                                'GET_IMAGE_TRANSFORM_VARIANTS_DEFAULT_NAME',
                                                            ),
                                                            file: file4,
                                                        }),
                                                    )
                                                }),
                                        )
                                let variantsDefinition =
                                    query('GET_IMAGE_TRANSFORM_VARIANTS') || {}
                                forin2(variantsDefinition, (key, fn2) => {
                                    let createVariant =
                                        createVariantCreator(fn2)
                                    variants.push(
                                        (transform2, file3, metadata) =>
                                            new Promise((resolve2) => {
                                                createVariant(
                                                    transform2,
                                                    file3,
                                                    metadata,
                                                ).then((file4) =>
                                                    resolve2({
                                                        name: key,
                                                        file: file4,
                                                    }),
                                                )
                                            }),
                                    )
                                })
                                let qualityAsPercentage = query(
                                        'GET_IMAGE_TRANSFORM_OUTPUT_QUALITY',
                                    ),
                                    qualityMode = query(
                                        'GET_IMAGE_TRANSFORM_OUTPUT_QUALITY_MODE',
                                    ),
                                    quality =
                                        qualityAsPercentage === null
                                            ? null
                                            : qualityAsPercentage / 100,
                                    type = query(
                                        'GET_IMAGE_TRANSFORM_OUTPUT_MIME_TYPE',
                                    ),
                                    clientTransforms =
                                        query(
                                            'GET_IMAGE_TRANSFORM_CLIENT_TRANSFORMS',
                                        ) || TRANSFORM_LIST
                                item2.setMetadata(
                                    'output',
                                    { type, quality, client: clientTransforms },
                                    !0,
                                )
                                let transform = (file3, metadata) =>
                                        new Promise((resolve2, reject) => {
                                            let filteredMetadata = {
                                                ...metadata,
                                            }
                                            Object.keys(filteredMetadata)
                                                .filter(
                                                    (instruction) =>
                                                        instruction !== 'exif',
                                                )
                                                .forEach((instruction) => {
                                                    clientTransforms.indexOf(
                                                        instruction,
                                                    ) === -1 &&
                                                        delete filteredMetadata[
                                                            instruction
                                                        ]
                                                })
                                            let {
                                                    resize,
                                                    exif,
                                                    output,
                                                    crop,
                                                    filter,
                                                    markup,
                                                } = filteredMetadata,
                                                instructions = {
                                                    image: {
                                                        orientation: exif
                                                            ? exif.orientation
                                                            : null,
                                                    },
                                                    output:
                                                        output &&
                                                        (output.type ||
                                                            typeof output.quality ==
                                                                'number' ||
                                                            output.background)
                                                            ? {
                                                                  type: output.type,
                                                                  quality:
                                                                      typeof output.quality ==
                                                                      'number'
                                                                          ? output.quality *
                                                                            100
                                                                          : null,
                                                                  background:
                                                                      output.background ||
                                                                      query(
                                                                          'GET_IMAGE_TRANSFORM_CANVAS_BACKGROUND_COLOR',
                                                                      ) ||
                                                                      null,
                                                              }
                                                            : void 0,
                                                    size:
                                                        resize &&
                                                        (resize.size.width ||
                                                            resize.size.height)
                                                            ? {
                                                                  mode: resize.mode,
                                                                  upscale:
                                                                      resize.upscale,
                                                                  ...resize.size,
                                                              }
                                                            : void 0,
                                                    crop:
                                                        crop &&
                                                        !isDefaultCrop(crop)
                                                            ? { ...crop }
                                                            : void 0,
                                                    markup:
                                                        markup && markup.length
                                                            ? markup.map(
                                                                  prepareMarkup2,
                                                              )
                                                            : [],
                                                    filter,
                                                }
                                            if (instructions.output) {
                                                let willChangeType = output.type
                                                        ? output.type !==
                                                          file3.type
                                                        : !1,
                                                    canChangeQuality =
                                                        /\/jpe?g$/.test(
                                                            file3.type,
                                                        ),
                                                    willChangeQuality =
                                                        output.quality !== null
                                                            ? canChangeQuality &&
                                                              qualityMode ===
                                                                  'always'
                                                            : !1
                                                if (
                                                    !!!(
                                                        instructions.size ||
                                                        instructions.crop ||
                                                        instructions.filter ||
                                                        willChangeType ||
                                                        willChangeQuality
                                                    )
                                                )
                                                    return resolve2(file3)
                                            }
                                            let options = {
                                                beforeCreateBlob: query(
                                                    'GET_IMAGE_TRANSFORM_BEFORE_CREATE_BLOB',
                                                ),
                                                afterCreateBlob: query(
                                                    'GET_IMAGE_TRANSFORM_AFTER_CREATE_BLOB',
                                                ),
                                                canvasMemoryLimit: query(
                                                    'GET_IMAGE_TRANSFORM_CANVAS_MEMORY_LIMIT',
                                                ),
                                                stripImageHead: query(
                                                    'GET_IMAGE_TRANSFORM_OUTPUT_STRIP_IMAGE_HEAD',
                                                ),
                                            }
                                            transformImage(
                                                file3,
                                                instructions,
                                                options,
                                            )
                                                .then((blob2) => {
                                                    let out = getFileFromBlob2(
                                                        blob2,
                                                        renameFileToMatchMimeType(
                                                            file3.name,
                                                            getValidOutputMimeType(
                                                                blob2.type,
                                                            ),
                                                        ),
                                                    )
                                                    resolve2(out)
                                                })
                                                .catch(reject)
                                        }),
                                    variantPromises = variants.map((create2) =>
                                        create2(
                                            transform,
                                            file2,
                                            item2.getMetadata(),
                                        ),
                                    )
                                Promise.all(variantPromises).then((files) => {
                                    resolve(
                                        files.length === 1 &&
                                            files[0].name === null
                                            ? files[0].file
                                            : files,
                                    )
                                })
                            },
                        )
                    }),
            ),
            {
                options: {
                    allowImageTransform: [!0, Type2.BOOLEAN],
                    imageTransformImageFilter: [null, Type2.FUNCTION],
                    imageTransformOutputMimeType: [null, Type2.STRING],
                    imageTransformOutputQuality: [null, Type2.INT],
                    imageTransformOutputStripImageHead: [!0, Type2.BOOLEAN],
                    imageTransformClientTransforms: [null, Type2.ARRAY],
                    imageTransformOutputQualityMode: ['always', Type2.STRING],
                    imageTransformVariants: [null, Type2.OBJECT],
                    imageTransformVariantsIncludeDefault: [!0, Type2.BOOLEAN],
                    imageTransformVariantsDefaultName: [null, Type2.STRING],
                    imageTransformVariantsIncludeOriginal: [!1, Type2.BOOLEAN],
                    imageTransformVariantsOriginalName: [
                        'original_',
                        Type2.STRING,
                    ],
                    imageTransformBeforeCreateBlob: [null, Type2.FUNCTION],
                    imageTransformAfterCreateBlob: [null, Type2.FUNCTION],
                    imageTransformCanvasMemoryLimit: [
                        isBrowser8 && isIOS ? 4096 * 4096 : null,
                        Type2.INT,
                    ],
                    imageTransformCanvasBackgroundColor: [null, Type2.STRING],
                },
            }
        )
    }
isBrowser8 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin7 }),
    )
var filepond_plugin_image_transform_esm_default = plugin7
var isPreviewableVideo = (file2) => /^video/.test(file2.type),
    isPreviewableAudio = (file2) => /^audio/.test(file2.type),
    AudioPlayer = class {
        constructor(mediaEl, audioElems) {
            ;(this.mediaEl = mediaEl),
                (this.audioElems = audioElems),
                (this.onplayhead = !1),
                (this.duration = 0),
                (this.timelineWidth =
                    this.audioElems.timeline.offsetWidth -
                    this.audioElems.playhead.offsetWidth),
                (this.moveplayheadFn = this.moveplayhead.bind(this)),
                this.registerListeners()
        }
        registerListeners() {
            this.mediaEl.addEventListener(
                'timeupdate',
                this.timeUpdate.bind(this),
                !1,
            ),
                this.mediaEl.addEventListener(
                    'canplaythrough',
                    () => (this.duration = this.mediaEl.duration),
                    !1,
                ),
                this.audioElems.timeline.addEventListener(
                    'click',
                    this.timelineClicked.bind(this),
                    !1,
                ),
                this.audioElems.button.addEventListener(
                    'click',
                    this.play.bind(this),
                ),
                this.audioElems.playhead.addEventListener(
                    'mousedown',
                    this.mouseDown.bind(this),
                    !1,
                ),
                window.addEventListener('mouseup', this.mouseUp.bind(this), !1)
        }
        play() {
            this.mediaEl.paused ? this.mediaEl.play() : this.mediaEl.pause(),
                this.audioElems.button.classList.toggle('play'),
                this.audioElems.button.classList.toggle('pause')
        }
        timeUpdate() {
            let playPercent = (this.mediaEl.currentTime / this.duration) * 100
            ;(this.audioElems.playhead.style.marginLeft = playPercent + '%'),
                this.mediaEl.currentTime === this.duration &&
                    (this.audioElems.button.classList.toggle('play'),
                    this.audioElems.button.classList.toggle('pause'))
        }
        moveplayhead(event) {
            let newMargLeft =
                event.clientX - this.getPosition(this.audioElems.timeline)
            newMargLeft >= 0 &&
                newMargLeft <= this.timelineWidth &&
                (this.audioElems.playhead.style.marginLeft =
                    newMargLeft + 'px'),
                newMargLeft < 0 &&
                    (this.audioElems.playhead.style.marginLeft = '0px'),
                newMargLeft > this.timelineWidth &&
                    (this.audioElems.playhead.style.marginLeft =
                        this.timelineWidth - 4 + 'px')
        }
        timelineClicked(event) {
            this.moveplayhead(event),
                (this.mediaEl.currentTime =
                    this.duration * this.clickPercent(event))
        }
        mouseDown() {
            ;(this.onplayhead = !0),
                window.addEventListener('mousemove', this.moveplayheadFn, !0),
                this.mediaEl.removeEventListener(
                    'timeupdate',
                    this.timeUpdate.bind(this),
                    !1,
                )
        }
        mouseUp(event) {
            window.removeEventListener('mousemove', this.moveplayheadFn, !0),
                this.onplayhead == !0 &&
                    (this.moveplayhead(event),
                    (this.mediaEl.currentTime =
                        this.duration * this.clickPercent(event)),
                    this.mediaEl.addEventListener(
                        'timeupdate',
                        this.timeUpdate.bind(this),
                        !1,
                    )),
                (this.onplayhead = !1)
        }
        clickPercent(event) {
            return (
                (event.clientX - this.getPosition(this.audioElems.timeline)) /
                this.timelineWidth
            )
        }
        getPosition(el) {
            return el.getBoundingClientRect().left
        }
    },
    createMediaView = (_) =>
        _.utils.createView({
            name: 'media-preview',
            tag: 'div',
            ignoreRect: !0,
            create: ({ root: root2, props }) => {
                let { id } = props,
                    item2 = root2.query('GET_ITEM', { id: props.id }),
                    tagName = isPreviewableAudio(item2.file) ? 'audio' : 'video'
                if (
                    ((root2.ref.media = document.createElement(tagName)),
                    root2.ref.media.setAttribute('controls', !0),
                    root2.element.appendChild(root2.ref.media),
                    isPreviewableAudio(item2.file))
                ) {
                    let docfrag = document.createDocumentFragment()
                    ;(root2.ref.audio = []),
                        (root2.ref.audio.container =
                            document.createElement('div')),
                        (root2.ref.audio.button =
                            document.createElement('span')),
                        (root2.ref.audio.timeline =
                            document.createElement('div')),
                        (root2.ref.audio.playhead =
                            document.createElement('div')),
                        (root2.ref.audio.container.className = 'audioplayer'),
                        (root2.ref.audio.button.className =
                            'playpausebtn play'),
                        (root2.ref.audio.timeline.className = 'timeline'),
                        (root2.ref.audio.playhead.className = 'playhead'),
                        root2.ref.audio.timeline.appendChild(
                            root2.ref.audio.playhead,
                        ),
                        root2.ref.audio.container.appendChild(
                            root2.ref.audio.button,
                        ),
                        root2.ref.audio.container.appendChild(
                            root2.ref.audio.timeline,
                        ),
                        docfrag.appendChild(root2.ref.audio.container),
                        root2.element.appendChild(docfrag)
                }
            },
            write: _.utils.createRoute({
                DID_MEDIA_PREVIEW_LOAD: ({ root: root2, props }) => {
                    let { id } = props,
                        item2 = root2.query('GET_ITEM', { id: props.id })
                    if (!item2) return
                    let URL2 = window.URL || window.webkitURL,
                        blob2 = new Blob([item2.file], {
                            type: item2.file.type,
                        })
                    ;(root2.ref.media.type = item2.file.type),
                        (root2.ref.media.src =
                            (item2.file.mock && item2.file.url) ||
                            URL2.createObjectURL(blob2)),
                        isPreviewableAudio(item2.file) &&
                            new AudioPlayer(root2.ref.media, root2.ref.audio),
                        root2.ref.media.addEventListener(
                            'loadeddata',
                            () => {
                                let height = 75
                                if (isPreviewableVideo(item2.file)) {
                                    let containerWidth =
                                            root2.ref.media.offsetWidth,
                                        factor =
                                            root2.ref.media.videoWidth /
                                            containerWidth
                                    height =
                                        root2.ref.media.videoHeight / factor
                                }
                                root2.dispatch('DID_UPDATE_PANEL_HEIGHT', {
                                    id: props.id,
                                    height,
                                })
                            },
                            !1,
                        )
                },
            }),
        }),
    createMediaWrapperView = (_) => {
        let didCreatePreviewContainer = ({ root: root2, props }) => {
                let { id } = props
                !root2.query('GET_ITEM', id) ||
                    root2.dispatch('DID_MEDIA_PREVIEW_LOAD', { id })
            },
            create2 = ({ root: root2, props }) => {
                let media = createMediaView(_)
                root2.ref.media = root2.appendChildView(
                    root2.createChildView(media, { id: props.id }),
                )
            }
        return _.utils.createView({
            name: 'media-preview-wrapper',
            create: create2,
            write: _.utils.createRoute({
                DID_MEDIA_PREVIEW_CONTAINER_CREATE: didCreatePreviewContainer,
            }),
        })
    },
    plugin8 = (fpAPI) => {
        let { addFilter: addFilter2, utils } = fpAPI,
            { Type: Type2, createRoute: createRoute2 } = utils,
            mediaWrapperView = createMediaWrapperView(fpAPI)
        return (
            addFilter2('CREATE_VIEW', (viewAPI) => {
                let { is, view, query } = viewAPI
                if (!is('file')) return
                let didLoadItem2 = ({ root: root2, props }) => {
                    let { id } = props,
                        item2 = query('GET_ITEM', id),
                        allowVideoPreview = query('GET_ALLOW_VIDEO_PREVIEW'),
                        allowAudioPreview = query('GET_ALLOW_AUDIO_PREVIEW')
                    !item2 ||
                        item2.archived ||
                        ((!isPreviewableVideo(item2.file) ||
                            !allowVideoPreview) &&
                            (!isPreviewableAudio(item2.file) ||
                                !allowAudioPreview)) ||
                        ((root2.ref.mediaPreview = view.appendChildView(
                            view.createChildView(mediaWrapperView, { id }),
                        )),
                        root2.dispatch('DID_MEDIA_PREVIEW_CONTAINER_CREATE', {
                            id,
                        }))
                }
                view.registerWriter(
                    createRoute2(
                        { DID_LOAD_ITEM: didLoadItem2 },
                        ({ root: root2, props }) => {
                            let { id } = props,
                                item2 = query('GET_ITEM', id),
                                allowVideoPreview = root2.query(
                                    'GET_ALLOW_VIDEO_PREVIEW',
                                ),
                                allowAudioPreview = root2.query(
                                    'GET_ALLOW_AUDIO_PREVIEW',
                                )
                            !(
                                !item2 ||
                                ((!isPreviewableVideo(item2.file) ||
                                    !allowVideoPreview) &&
                                    (!isPreviewableAudio(item2.file) ||
                                        !allowAudioPreview)) ||
                                root2.rect.element.hidden
                            )
                        },
                    ),
                )
            }),
            {
                options: {
                    allowVideoPreview: [!0, Type2.BOOLEAN],
                    allowAudioPreview: [!0, Type2.BOOLEAN],
                },
            }
        )
    },
    isBrowser9 =
        typeof window != 'undefined' && typeof window.document != 'undefined'
isBrowser9 &&
    document.dispatchEvent(
        new CustomEvent('FilePond:pluginloaded', { detail: plugin8 }),
    )
var ar_ar_default = {
    labelIdle:
        '\u0627\u0633\u062D\u0628 \u0648 \u0627\u062F\u0631\u062C \u0645\u0644\u0641\u0627\u062A\u0643 \u0623\u0648 <span class="filepond--label-action"> \u062A\u0635\u0641\u062D </span>',
    labelInvalidField:
        '\u0627\u0644\u062D\u0642\u0644 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0645\u0644\u0641\u0627\u062A \u063A\u064A\u0631 \u0635\u0627\u0644\u062D\u0629',
    labelFileWaitingForSize:
        '\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062D\u062C\u0645',
    labelFileSizeNotAvailable:
        '\u0627\u0644\u062D\u062C\u0645 \u063A\u064A\u0631 \u0645\u062A\u0627\u062D',
    labelFileLoading: '\u0628\u0627\u0644\u0625\u0646\u062A\u0638\u0627\u0631',
    labelFileLoadError:
        '\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u062D\u0645\u064A\u0644',
    labelFileProcessing: '\u064A\u062A\u0645 \u0627\u0644\u0631\u0641\u0639',
    labelFileProcessingComplete: '\u062A\u0645 \u0627\u0644\u0631\u0641\u0639',
    labelFileProcessingAborted:
        '\u062A\u0645 \u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0631\u0641\u0639',
    labelFileProcessingError:
        '\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u0631\u0641\u0639',
    labelFileProcessingRevertError:
        '\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u0631\u0627\u062C\u0639',
    labelFileRemoveError:
        '\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062D\u0630\u0641',
    labelTapToCancel:
        '\u0627\u0646\u0642\u0631 \u0644\u0644\u0625\u0644\u063A\u0627\u0621',
    labelTapToRetry:
        '\u0627\u0646\u0642\u0631 \u0644\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629',
    labelTapToUndo:
        '\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u0631\u0627\u062C\u0639',
    labelButtonRemoveItem: '\u0645\u0633\u062D',
    labelButtonAbortItemLoad: '\u0625\u0644\u063A\u0627\u0621',
    labelButtonRetryItemLoad: '\u0625\u0639\u0627\u062F\u0629',
    labelButtonAbortItemProcessing: '\u0625\u0644\u063A\u0627\u0621',
    labelButtonUndoItemProcessing: '\u062A\u0631\u0627\u062C\u0639',
    labelButtonRetryItemProcessing: '\u0625\u0639\u0627\u062F\u0629',
    labelButtonProcessItem: '\u0631\u0641\u0639',
    labelMaxFileSizeExceeded:
        '\u0627\u0644\u0645\u0644\u0641 \u0643\u0628\u064A\u0631 \u062C\u062F\u0627',
    labelMaxFileSize:
        '\u062D\u062C\u0645 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0623\u0642\u0635\u0649: {filesize}',
    labelMaxTotalFileSizeExceeded:
        '\u062A\u0645 \u062A\u062C\u0627\u0648\u0632 \u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u062D\u062C\u0645 \u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A',
    labelMaxTotalFileSize:
        '\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u062D\u062C\u0645 \u0627\u0644\u0645\u0644\u0641: {filesize}',
    labelFileTypeNotAllowed:
        '\u0645\u0644\u0641 \u0645\u0646 \u0646\u0648\u0639 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D',
    fileValidateTypeLabelExpectedTypes:
        '\u062A\u062A\u0648\u0642\u0639 {allButLastType} \u0645\u0646 {lastType}',
    imageValidateSizeLabelFormatError:
        '\u0646\u0648\u0639 \u0627\u0644\u0635\u0648\u0631\u0629 \u063A\u064A\u0631 \u0645\u062F\u0639\u0648\u0645',
    imageValidateSizeLabelImageSizeTooSmall:
        '\u0627\u0644\u0635\u0648\u0631\u0629 \u0635\u063A\u064A\u0631 \u062C\u062F\u0627',
    imageValidateSizeLabelImageSizeTooBig:
        '\u0627\u0644\u0635\u0648\u0631\u0629 \u0643\u0628\u064A\u0631\u0629 \u062C\u062F\u0627',
    imageValidateSizeLabelExpectedMinSize:
        '\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u062F\u0646\u0649 \u0644\u0644\u0623\u0628\u0639\u0627\u062F \u0647\u0648: {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        '\u0627\u0644\u062D\u062F \u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0644\u0623\u0628\u0639\u0627\u062F \u0647\u0648: {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        '\u0627\u0644\u062F\u0642\u0629 \u0636\u0639\u064A\u0641\u0629 \u062C\u062F\u0627',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\u0627\u0644\u062F\u0642\u0629 \u0645\u0631\u062A\u0641\u0639\u0629 \u062C\u062F\u0627',
    imageValidateSizeLabelExpectedMinResolution:
        '\u0623\u0642\u0644 \u062F\u0642\u0629: {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        '\u0623\u0642\u0635\u0649 \u062F\u0642\u0629: {maxResolution}',
}
var cs_cz_default = {
    labelIdle:
        'P\u0159et\xE1hn\u011Bte soubor sem (drag&drop) nebo <span class="filepond--label-action"> Vyhledat </span>',
    labelInvalidField: 'Pole obsahuje chybn\xE9 soubory',
    labelFileWaitingForSize: 'Zji\u0161\u0165uje se velikost',
    labelFileSizeNotAvailable: 'Velikost nen\xED zn\xE1m\xE1',
    labelFileLoading: 'P\u0159en\xE1\u0161\xED se',
    labelFileLoadError: 'Chyba p\u0159i p\u0159enosu',
    labelFileProcessing: 'Prob\xEDh\xE1 upload',
    labelFileProcessingComplete: 'Upload dokon\u010Den',
    labelFileProcessingAborted: 'Upload stornov\xE1n',
    labelFileProcessingError: 'Chyba p\u0159i uploadu',
    labelFileProcessingRevertError: 'Chyba p\u0159i obnov\u011B',
    labelFileRemoveError: 'Chyba p\u0159i odstran\u011Bn\xED',
    labelTapToCancel: 'klepn\u011Bte pro storno',
    labelTapToRetry: 'klepn\u011Bte pro opakov\xE1n\xED',
    labelTapToUndo: 'klepn\u011Bte pro vr\xE1cen\xED',
    labelButtonRemoveItem: 'Odstranit',
    labelButtonAbortItemLoad: 'Storno',
    labelButtonRetryItemLoad: 'Opakovat',
    labelButtonAbortItemProcessing: 'Zp\u011Bt',
    labelButtonUndoItemProcessing: 'Vr\xE1tit',
    labelButtonRetryItemProcessing: 'Opakovat',
    labelButtonProcessItem: 'Upload',
    labelMaxFileSizeExceeded: 'Soubor je p\u0159\xEDli\u0161 velk\xFD',
    labelMaxFileSize: 'Nejv\u011Bt\u0161\xED velikost souboru je {filesize}',
    labelMaxTotalFileSizeExceeded:
        'P\u0159ekro\u010Dena maxim\xE1ln\xED celkov\xE1 velikost souboru',
    labelMaxTotalFileSize:
        'Maxim\xE1ln\xED celkov\xE1 velikost souboru je {filesize}',
    labelFileTypeNotAllowed: 'Soubor je nespr\xE1vn\xE9ho typu',
    fileValidateTypeLabelExpectedTypes:
        'O\u010Dek\xE1v\xE1 se {allButLastType} nebo {lastType}',
    imageValidateSizeLabelFormatError:
        'Obr\xE1zek tohoto typu nen\xED podporov\xE1n',
    imageValidateSizeLabelImageSizeTooSmall:
        'Obr\xE1zek je p\u0159\xEDli\u0161 mal\xFD',
    imageValidateSizeLabelImageSizeTooBig:
        'Obr\xE1zek je p\u0159\xEDli\u0161 velk\xFD',
    imageValidateSizeLabelExpectedMinSize:
        'Minim\xE1ln\xED rozm\u011Br je {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maxim\xE1ln\xED rozm\u011Br je {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'Rozli\u0161en\xED je p\u0159\xEDli\u0161 mal\xE9',
    imageValidateSizeLabelImageResolutionTooHigh:
        'Rozli\u0161en\xED je p\u0159\xEDli\u0161 velk\xE9',
    imageValidateSizeLabelExpectedMinResolution:
        'Minim\xE1ln\xED rozli\u0161en\xED je {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maxim\xE1ln\xED rozli\u0161en\xED je {maxResolution}',
}
var da_dk_default = {
    labelIdle:
        'Tr\xE6k & slip filer eller <span class = "filepond - label-action"> Gennemse </span>',
    labelInvalidField: 'Felt indeholder ugyldige filer',
    labelFileWaitingForSize: 'Venter p\xE5 st\xF8rrelse',
    labelFileSizeNotAvailable: 'St\xF8rrelse ikke tilg\xE6ngelig',
    labelFileLoading: 'Loader',
    labelFileLoadError: 'Load fejlede',
    labelFileProcessing: 'Uploader',
    labelFileProcessingComplete: 'Upload f\xE6rdig',
    labelFileProcessingAborted: 'Upload annulleret',
    labelFileProcessingError: 'Upload fejlede',
    labelFileProcessingRevertError: 'Fortryd fejlede',
    labelFileRemoveError: 'Fjern fejlede',
    labelTapToCancel: 'tryk for at annullere',
    labelTapToRetry: 'tryk for at pr\xF8ve igen',
    labelTapToUndo: 'tryk for at fortryde',
    labelButtonRemoveItem: 'Fjern',
    labelButtonAbortItemLoad: 'Annuller',
    labelButtonRetryItemLoad: 'Fors\xF8g igen',
    labelButtonAbortItemProcessing: 'Annuller',
    labelButtonUndoItemProcessing: 'Fortryd',
    labelButtonRetryItemProcessing: 'Pr\xF8v igen',
    labelButtonProcessItem: 'Upload',
    labelMaxFileSizeExceeded: 'Filen er for stor',
    labelMaxFileSize: 'Maksimal filst\xF8rrelse er {filesize}',
    labelMaxTotalFileSizeExceeded: 'Maksimal totalst\xF8rrelse overskredet',
    labelMaxTotalFileSize: 'Maksimal total filst\xF8rrelse er {filesize}',
    labelFileTypeNotAllowed: 'Ugyldig filtype',
    fileValidateTypeLabelExpectedTypes:
        'Forventer {allButLastType} eller {lastType}',
    imageValidateSizeLabelFormatError: 'Ugyldigt format',
    imageValidateSizeLabelImageSizeTooSmall: 'Billedet er for lille',
    imageValidateSizeLabelImageSizeTooBig: 'Billedet er for stort',
    imageValidateSizeLabelExpectedMinSize:
        'Minimum st\xF8rrelse er {minBredde} \xD7 {minH\xF8jde}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maksimal st\xF8rrelse er {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow: 'For lav opl\xF8sning',
    imageValidateSizeLabelImageResolutionTooHigh: 'For h\xF8j opl\xF8sning',
    imageValidateSizeLabelExpectedMinResolution:
        'Minimum opl\xF8sning er {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maksimal opl\xF8sning er {maxResolution}',
}
var de_de_default = {
    labelIdle:
        'Dateien ablegen oder <span class="filepond--label-action"> ausw\xE4hlen </span>',
    labelInvalidField: 'Feld beinhaltet ung\xFCltige Dateien',
    labelFileWaitingForSize: 'Dateigr\xF6\xDFe berechnen',
    labelFileSizeNotAvailable: 'Dateigr\xF6\xDFe nicht verf\xFCgbar',
    labelFileLoading: 'Laden',
    labelFileLoadError: 'Fehler beim Laden',
    labelFileProcessing: 'Upload l\xE4uft',
    labelFileProcessingComplete: 'Upload abgeschlossen',
    labelFileProcessingAborted: 'Upload abgebrochen',
    labelFileProcessingError: 'Fehler beim Upload',
    labelFileProcessingRevertError: 'Fehler beim Wiederherstellen',
    labelFileRemoveError: 'Fehler beim L\xF6schen',
    labelTapToCancel: 'abbrechen',
    labelTapToRetry: 'erneut versuchen',
    labelTapToUndo: 'r\xFCckg\xE4ngig',
    labelButtonRemoveItem: 'Entfernen',
    labelButtonAbortItemLoad: 'Verwerfen',
    labelButtonRetryItemLoad: 'Erneut versuchen',
    labelButtonAbortItemProcessing: 'Abbrechen',
    labelButtonUndoItemProcessing: 'R\xFCckg\xE4ngig',
    labelButtonRetryItemProcessing: 'Erneut versuchen',
    labelButtonProcessItem: 'Upload',
    labelMaxFileSizeExceeded: 'Datei ist zu gro\xDF',
    labelMaxFileSize: 'Maximale Dateigr\xF6\xDFe: {filesize}',
    labelMaxTotalFileSizeExceeded:
        'Maximale gesamte Dateigr\xF6\xDFe \xFCberschritten',
    labelMaxTotalFileSize: 'Maximale gesamte Dateigr\xF6\xDFe: {filesize}',
    labelFileTypeNotAllowed: 'Dateityp ung\xFCltig',
    fileValidateTypeLabelExpectedTypes:
        'Erwartet {allButLastType} oder {lastType}',
    imageValidateSizeLabelFormatError: 'Bildtyp nicht unterst\xFCtzt',
    imageValidateSizeLabelImageSizeTooSmall: 'Bild ist zu klein',
    imageValidateSizeLabelImageSizeTooBig: 'Bild ist zu gro\xDF',
    imageValidateSizeLabelExpectedMinSize:
        'Mindestgr\xF6\xDFe: {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maximale Gr\xF6\xDFe: {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow: 'Aufl\xF6sung ist zu niedrig',
    imageValidateSizeLabelImageResolutionTooHigh: 'Aufl\xF6sung ist zu hoch',
    imageValidateSizeLabelExpectedMinResolution:
        'Mindestaufl\xF6sung: {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maximale Aufl\xF6sung: {maxResolution}',
}
var en_en_default = {
    labelIdle:
        'Drag & Drop your files or <span class="filepond--label-action"> Browse </span>',
    labelInvalidField: 'Field contains invalid files',
    labelFileWaitingForSize: 'Waiting for size',
    labelFileSizeNotAvailable: 'Size not available',
    labelFileLoading: 'Loading',
    labelFileLoadError: 'Error during load',
    labelFileProcessing: 'Uploading',
    labelFileProcessingComplete: 'Upload complete',
    labelFileProcessingAborted: 'Upload cancelled',
    labelFileProcessingError: 'Error during upload',
    labelFileProcessingRevertError: 'Error during revert',
    labelFileRemoveError: 'Error during remove',
    labelTapToCancel: 'tap to cancel',
    labelTapToRetry: 'tap to retry',
    labelTapToUndo: 'tap to undo',
    labelButtonRemoveItem: 'Remove',
    labelButtonAbortItemLoad: 'Abort',
    labelButtonRetryItemLoad: 'Retry',
    labelButtonAbortItemProcessing: 'Cancel',
    labelButtonUndoItemProcessing: 'Undo',
    labelButtonRetryItemProcessing: 'Retry',
    labelButtonProcessItem: 'Upload',
    labelMaxFileSizeExceeded: 'File is too large',
    labelMaxFileSize: 'Maximum file size is {filesize}',
    labelMaxTotalFileSizeExceeded: 'Maximum total size exceeded',
    labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
    labelFileTypeNotAllowed: 'File of invalid type',
    fileValidateTypeLabelExpectedTypes:
        'Expects {allButLastType} or {lastType}',
    imageValidateSizeLabelFormatError: 'Image type not supported',
    imageValidateSizeLabelImageSizeTooSmall: 'Image is too small',
    imageValidateSizeLabelImageSizeTooBig: 'Image is too big',
    imageValidateSizeLabelExpectedMinSize:
        'Minimum size is {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maximum size is {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow: 'Resolution is too low',
    imageValidateSizeLabelImageResolutionTooHigh: 'Resolution is too high',
    imageValidateSizeLabelExpectedMinResolution:
        'Minimum resolution is {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maximum resolution is {maxResolution}',
}
var es_es_default = {
    labelIdle:
        'Arrastra y suelta tus archivos o <span class = "filepond--label-action"> Examinar <span>',
    labelInvalidField: 'El campo contiene archivos inv\xE1lidos',
    labelFileWaitingForSize: 'Esperando tama\xF1o',
    labelFileSizeNotAvailable: 'Tama\xF1o no disponible',
    labelFileLoading: 'Cargando',
    labelFileLoadError: 'Error durante la carga',
    labelFileProcessing: 'Cargando',
    labelFileProcessingComplete: 'Carga completa',
    labelFileProcessingAborted: 'Carga cancelada',
    labelFileProcessingError: 'Error durante la carga',
    labelFileProcessingRevertError: 'Error durante la reversi\xF3n',
    labelFileRemoveError: 'Error durante la eliminaci\xF3n',
    labelTapToCancel: 'toca para cancelar',
    labelTapToRetry: 'tocar para volver a intentar',
    labelTapToUndo: 'tocar para deshacer',
    labelButtonRemoveItem: 'Eliminar',
    labelButtonAbortItemLoad: 'Abortar',
    labelButtonRetryItemLoad: 'Reintentar',
    labelButtonAbortItemProcessing: 'Cancelar',
    labelButtonUndoItemProcessing: 'Deshacer',
    labelButtonRetryItemProcessing: 'Reintentar',
    labelButtonProcessItem: 'Cargar',
    labelMaxFileSizeExceeded: 'El archivo es demasiado grande',
    labelMaxFileSize: 'El tama\xF1o m\xE1ximo del archivo es {filesize}',
    labelMaxTotalFileSizeExceeded: 'Tama\xF1o total m\xE1ximo excedido',
    labelMaxTotalFileSize:
        'El tama\xF1o total m\xE1ximo del archivo es {filesize}',
    labelFileTypeNotAllowed: 'Archivo de tipo no v\xE1lido',
    fileValidateTypeLabelExpectedTypes: 'Espera {allButLastType} o {lastType}',
    imageValidateSizeLabelFormatError: 'Tipo de imagen no compatible',
    imageValidateSizeLabelImageSizeTooSmall:
        'La imagen es demasiado peque\xF1a',
    imageValidateSizeLabelImageSizeTooBig: 'La imagen es demasiado grande',
    imageValidateSizeLabelExpectedMinSize:
        'El tama\xF1o m\xEDnimo es {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'El tama\xF1o m\xE1ximo es {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'La resoluci\xF3n es demasiado baja',
    imageValidateSizeLabelImageResolutionTooHigh:
        'La resoluci\xF3n es demasiado alta',
    imageValidateSizeLabelExpectedMinResolution:
        'La resoluci\xF3n m\xEDnima es {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'La resoluci\xF3n m\xE1xima es {maxResolution}',
}
var fa_ir_default = {
    labelIdle:
        '\u0641\u0627\u06CC\u0644 \u0631\u0627 \u0627\u06CC\u0646\u062C\u0627 \u0628\u06A9\u0634\u06CC\u062F \u0648 \u0631\u0647\u0627 \u06A9\u0646\u06CC\u062F\u060C \u06CC\u0627 <span class="filepond--label-action"> \u062C\u0633\u062A\u062C\u0648 \u06A9\u0646\u06CC\u062F </span>',
    labelInvalidField:
        '\u0641\u06CC\u0644\u062F \u062F\u0627\u0631\u0627\u06CC \u0641\u0627\u06CC\u0644 \u0647\u0627\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A',
    labelFileWaitingForSize: 'Waiting for size',
    labelFileSizeNotAvailable:
        '\u062D\u062C\u0645 \u0641\u0627\u06CC\u0644 \u0645\u062C\u0627\u0632 \u0646\u06CC\u0633\u062A',
    labelFileLoading:
        '\u062F\u0631\u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC',
    labelFileLoadError:
        '\u062E\u0637\u0627 \u062F\u0631 \u0632\u0645\u0627\u0646 \u0627\u062C\u0631\u0627',
    labelFileProcessing:
        '\u062F\u0631\u062D\u0627\u0644 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC',
    labelFileProcessingComplete:
        '\u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u06A9\u0627\u0645\u0644 \u0634\u062F',
    labelFileProcessingAborted:
        '\u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC \u0644\u063A\u0648 \u0634\u062F',
    labelFileProcessingError:
        '\u062E\u0637\u0627 \u062F\u0631 \u0632\u0645\u0627\u0646 \u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC',
    labelFileProcessingRevertError:
        '\u062E\u0637\u0627 \u062F\u0631 \u0632\u0645\u0627\u0646 \u062D\u0630\u0641',
    labelFileRemoveError:
        '\u062E\u0637\u0627 \u062F\u0631 \u0632\u0645\u0627\u0646 \u062D\u0630\u0641',
    labelTapToCancel:
        '\u0628\u0631\u0627\u06CC \u0644\u063A\u0648 \u0636\u0631\u0628\u0647 \u0628\u0632\u0646\u06CC\u062F',
    labelTapToRetry:
        '\u0628\u0631\u0627\u06CC \u062A\u06A9\u0631\u0627\u0631 \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F',
    labelTapToUndo:
        '\u0628\u0631\u0627\u06CC \u0628\u0631\u06AF\u0634\u062A \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F',
    labelButtonRemoveItem: '\u062D\u0630\u0641',
    labelButtonAbortItemLoad: '\u0644\u063A\u0648',
    labelButtonRetryItemLoad: '\u062A\u06A9\u0631\u0627\u0631',
    labelButtonAbortItemProcessing: '\u0644\u063A\u0648',
    labelButtonUndoItemProcessing: '\u0628\u0631\u06AF\u0634\u062A',
    labelButtonRetryItemProcessing: '\u062A\u06A9\u0631\u0627\u0631',
    labelButtonProcessItem: '\u0628\u0627\u0631\u06AF\u0630\u0627\u0631\u06CC',
    labelMaxFileSizeExceeded:
        '\u0641\u0627\u06CC\u0644 \u0628\u0633\u06CC\u0627\u0631 \u062D\u062C\u06CC\u0645 \u0627\u0633\u062A',
    labelMaxFileSize:
        '\u062D\u062F\u0627\u06A9\u062B\u0631 \u0645\u062C\u0627\u0632 \u0641\u0627\u06CC\u0644 {filesize} \u0627\u0633\u062A',
    labelMaxTotalFileSizeExceeded:
        '\u0627\u0632 \u062D\u062F\u0627\u06A9\u062B\u0631 \u062D\u062C\u0645 \u0641\u0627\u06CC\u0644 \u0628\u06CC\u0634\u062A\u0631 \u0634\u062F',
    labelMaxTotalFileSize:
        '\u062D\u062F\u0627\u06A9\u062B\u0631 \u062D\u062C\u0645 \u0641\u0627\u06CC\u0644 {filesize} \u0627\u0633\u062A',
    labelFileTypeNotAllowed:
        '\u0646\u0648\u0639 \u0641\u0627\u06CC\u0644 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A',
    fileValidateTypeLabelExpectedTypes:
        '\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 {allButLastType} \u06CC\u0627 {lastType}',
    imageValidateSizeLabelFormatError:
        '\u0641\u0631\u0645\u062A \u062A\u0635\u0648\u06CC\u0631 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0646\u0645\u06CC \u0634\u0648\u062F',
    imageValidateSizeLabelImageSizeTooSmall:
        '\u062A\u0635\u0648\u06CC\u0631 \u0628\u0633\u06CC\u0627\u0631 \u06A9\u0648\u0686\u06A9 \u0627\u0633\u062A',
    imageValidateSizeLabelImageSizeTooBig:
        '\u062A\u0635\u0648\u06CC\u0631 \u0628\u0633\u06CC\u0627\u0631 \u0628\u0632\u0631\u06AF \u0627\u0633\u062A',
    imageValidateSizeLabelExpectedMinSize:
        '\u062D\u062F\u0627\u0642\u0644 \u0627\u0646\u062F\u0627\u0632\u0647 {minWidth} \xD7 {minHeight} \u0627\u0633\u062A',
    imageValidateSizeLabelExpectedMaxSize:
        '\u062D\u062F\u0627\u06A9\u062B\u0631 \u0627\u0646\u062F\u0627\u0632\u0647 {maxWidth} \xD7 {maxHeight} \u0627\u0633\u062A',
    imageValidateSizeLabelImageResolutionTooLow:
        '\u0648\u0636\u0648\u062D \u062A\u0635\u0648\u06CC\u0631 \u0628\u0633\u06CC\u0627\u0631 \u06A9\u0645 \u0627\u0633\u062A',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\u0648\u0636\u0648\u0639 \u062A\u0635\u0648\u06CC\u0631 \u0628\u0633\u06CC\u0627\u0631 \u0632\u06CC\u0627\u062F \u0627\u0633\u062A',
    imageValidateSizeLabelExpectedMinResolution:
        '\u062D\u062F\u0627\u0642\u0644 \u0648\u0636\u0648\u062D \u062A\u0635\u0648\u06CC\u0631 {minResolution} \u0627\u0633\u062A',
    imageValidateSizeLabelExpectedMaxResolution:
        '\u062D\u062F\u0627\u06A9\u062B\u0631 \u0648\u0636\u0648\u062D \u062A\u0635\u0648\u06CC\u0631 {maxResolution} \u0627\u0633\u062A',
}
var fi_fi_default = {
    labelIdle:
        'Ved\xE4 ja pudota tiedostoja tai <span class="filepond--label-action"> Selaa </span>',
    labelInvalidField: 'Kent\xE4ss\xE4 on virheellisi\xE4 tiedostoja',
    labelFileWaitingForSize: 'Odotetaan kokoa',
    labelFileSizeNotAvailable: 'Kokoa ei saatavilla',
    labelFileLoading: 'Ladataan',
    labelFileLoadError: 'Virhe latauksessa',
    labelFileProcessing: 'L\xE4hetet\xE4\xE4n',
    labelFileProcessingComplete: 'L\xE4hetys valmis',
    labelFileProcessingAborted: 'L\xE4hetys peruttu',
    labelFileProcessingError: 'Virhe l\xE4hetyksess\xE4',
    labelFileProcessingRevertError: 'Virhe palautuksessa',
    labelFileRemoveError: 'Virhe poistamisessa',
    labelTapToCancel: 'peruuta napauttamalla',
    labelTapToRetry: 'yrit\xE4 uudelleen napauttamalla',
    labelTapToUndo: 'kumoa napauttamalla',
    labelButtonRemoveItem: 'Poista',
    labelButtonAbortItemLoad: 'Keskeyt\xE4',
    labelButtonRetryItemLoad: 'Yrit\xE4 uudelleen',
    labelButtonAbortItemProcessing: 'Peruuta',
    labelButtonUndoItemProcessing: 'Kumoa',
    labelButtonRetryItemProcessing: 'Yrit\xE4 uudelleen',
    labelButtonProcessItem: 'L\xE4het\xE4',
    labelMaxFileSizeExceeded: 'Tiedoston koko on liian suuri',
    labelMaxFileSize: 'Tiedoston maksimikoko on {filesize}',
    labelMaxTotalFileSizeExceeded:
        'Tiedostojen yhdistetty maksimikoko ylitetty',
    labelMaxTotalFileSize: 'Tiedostojen yhdistetty maksimikoko on {filesize}',
    labelFileTypeNotAllowed: 'Tiedostotyyppi\xE4 ei sallita',
    fileValidateTypeLabelExpectedTypes:
        'Sallitaan {allButLastType} tai {lastType}',
    imageValidateSizeLabelFormatError: 'Kuvatyyppi\xE4 ei tueta',
    imageValidateSizeLabelImageSizeTooSmall: 'Kuva on liian pieni',
    imageValidateSizeLabelImageSizeTooBig: 'Kuva on liian suuri',
    imageValidateSizeLabelExpectedMinSize:
        'Minimikoko on {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maksimikoko on {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow: 'Resoluutio on liian pieni',
    imageValidateSizeLabelImageResolutionTooHigh: 'Resoluutio on liian suuri',
    imageValidateSizeLabelExpectedMinResolution:
        'Minimiresoluutio on {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maksimiresoluutio on {maxResolution}',
}
var fr_fr_default = {
    labelIdle:
        'Faites glisser vos fichiers ou <span class = "filepond--label-action"> Parcourir <span>',
    labelInvalidField: 'Le champ contient des fichiers invalides',
    labelFileWaitingForSize: 'En attente de taille',
    labelFileSizeNotAvailable: 'Taille non disponible',
    labelFileLoading: 'Chargement',
    labelFileLoadError: 'Erreur durant le chargement',
    labelFileProcessing: 'Traitement',
    labelFileProcessingComplete: 'Traitement effectu\xE9',
    labelFileProcessingAborted: 'Traitement interrompu',
    labelFileProcessingError: 'Erreur durant le traitement',
    labelFileProcessingRevertError: 'Erreur durant la restauration',
    labelFileRemoveError: 'Erreur durant la suppression',
    labelTapToCancel: 'appuyer pour annuler',
    labelTapToRetry: 'appuyer pour r\xE9essayer',
    labelTapToUndo: 'appuyer pour revenir en arri\xE8re',
    labelButtonRemoveItem: 'Retirer',
    labelButtonAbortItemLoad: 'Annuler',
    labelButtonRetryItemLoad: 'Recommencer',
    labelButtonAbortItemProcessing: 'Annuler',
    labelButtonUndoItemProcessing: 'Revenir en arri\xE8re',
    labelButtonRetryItemProcessing: 'Recommencer',
    labelButtonProcessItem: 'Transf\xE9rer',
    labelMaxFileSizeExceeded: 'Le fichier est trop volumineux',
    labelMaxFileSize: 'La taille maximale de fichier est {filesize}',
    labelMaxTotalFileSizeExceeded: 'Taille totale maximale d\xE9pass\xE9e',
    labelMaxTotalFileSize:
        'La taille totale maximale des fichiers est {filesize}',
    labelFileTypeNotAllowed: 'Fichier non valide',
    fileValidateTypeLabelExpectedTypes:
        'Attendu {allButLastType} ou {lastType}',
    imageValidateSizeLabelFormatError: "Type d'image non pris en charge",
    imageValidateSizeLabelImageSizeTooSmall: "L'image est trop petite",
    imageValidateSizeLabelImageSizeTooBig: "L'image est trop grande",
    imageValidateSizeLabelExpectedMinSize:
        'La taille minimale est {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'La taille maximale est {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'La r\xE9solution est trop faible',
    imageValidateSizeLabelImageResolutionTooHigh:
        'La r\xE9solution est trop \xE9lev\xE9e',
    imageValidateSizeLabelExpectedMinResolution:
        'La r\xE9solution minimale est {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'La r\xE9solution maximale est {maxResolution}',
}
var hu_hu_default = {
    labelIdle:
        'Mozgasd ide a f\xE1jlt a felt\xF6lt\xE9shez, vagy <span class="filepond--label-action"> tall\xF3z\xE1s </span>',
    labelInvalidField: 'A mez\u0151 \xE9rv\xE9nytelen f\xE1jlokat tartalmaz',
    labelFileWaitingForSize: 'F\xE1ljm\xE9ret kisz\xE1mol\xE1sa',
    labelFileSizeNotAvailable: 'A f\xE1jlm\xE9ret nem el\xE9rhet\u0151',
    labelFileLoading: 'T\xF6lt\xE9s',
    labelFileLoadError: 'Hiba a bet\xF6lt\xE9s sor\xE1n',
    labelFileProcessing: 'Felt\xF6lt\xE9s',
    labelFileProcessingComplete: 'Sikeres felt\xF6lt\xE9s',
    labelFileProcessingAborted: 'A felt\xF6lt\xE9s megszak\xEDtva',
    labelFileProcessingError: 'Hiba t\xF6rt\xE9nt a felt\xF6lt\xE9s sor\xE1n',
    labelFileProcessingRevertError: 'Hiba a vissza\xE1ll\xEDt\xE1s sor\xE1n',
    labelFileRemoveError: 'Hiba t\xF6rt\xE9nt az elt\xE1vol\xEDt\xE1s sor\xE1n',
    labelTapToCancel: 'koppints a t\xF6rl\xE9shez',
    labelTapToRetry: 'koppints az \xFAjrakezd\xE9shez',
    labelTapToUndo: 'koppints a visszavon\xE1shoz',
    labelButtonRemoveItem: 'Elt\xE1vol\xEDt\xE1s',
    labelButtonAbortItemLoad: 'Megszak\xEDt\xE1s',
    labelButtonRetryItemLoad: '\xDAjrapr\xF3b\xE1lkoz\xE1s',
    labelButtonAbortItemProcessing: 'Megszak\xEDt\xE1s',
    labelButtonUndoItemProcessing: 'Visszavon\xE1s',
    labelButtonRetryItemProcessing: '\xDAjrapr\xF3b\xE1lkoz\xE1s',
    labelButtonProcessItem: 'Felt\xF6lt\xE9s',
    labelMaxFileSizeExceeded:
        'A f\xE1jl t\xFAll\xE9pte a maxim\xE1lis m\xE9retet',
    labelMaxFileSize: 'Maxim\xE1lis f\xE1jlm\xE9ret: {filesize}',
    labelMaxTotalFileSizeExceeded:
        'T\xFAll\xE9pte a maxim\xE1lis teljes m\xE9retet',
    labelMaxTotalFileSize: 'A maxim\xE1is teljes f\xE1jlm\xE9ret: {filesize}',
    labelFileTypeNotAllowed: '\xC9rv\xE9nytelen t\xEDpus\xFA f\xE1jl',
    fileValidateTypeLabelExpectedTypes:
        'Enged\xE9lyezett t\xEDpusok {allButLastType} vagy {lastType}',
    imageValidateSizeLabelFormatError: 'A k\xE9pt\xEDpus nem t\xE1mogatott',
    imageValidateSizeLabelImageSizeTooSmall: 'A k\xE9p t\xFAl kicsi',
    imageValidateSizeLabelImageSizeTooBig: 'A k\xE9p t\xFAl nagy',
    imageValidateSizeLabelExpectedMinSize:
        'Minimum m\xE9ret: {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maximum m\xE9ret: {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'A felbont\xE1s t\xFAl alacsony',
    imageValidateSizeLabelImageResolutionTooHigh: 'A felbont\xE1s t\xFAl magas',
    imageValidateSizeLabelExpectedMinResolution:
        'Minim\xE1is felbont\xE1s: {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maxim\xE1lis felbont\xE1s: {maxResolution}',
}
var id_id_default = {
    labelIdle:
        'Seret dan Jatuhkan file Anda atau <span class="filepond--label-action">Jelajahi</span>',
    labelInvalidField: 'Field berisi file tidak valid',
    labelFileWaitingForSize: 'Menunggu ukuran',
    labelFileSizeNotAvailable: 'Ukuran tidak tersedia',
    labelFileLoading: 'Memuat',
    labelFileLoadError: 'Kesalahan saat memuat',
    labelFileProcessing: 'Mengunggah',
    labelFileProcessingComplete: 'Unggahan selesai',
    labelFileProcessingAborted: 'Unggahan dibatalkan',
    labelFileProcessingError: 'Kesalahan saat mengunggah',
    labelFileProcessingRevertError: 'Kesalahan saat pengembalian',
    labelFileRemoveError: 'Kesalahan saat menghapus',
    labelTapToCancel: 'ketuk untuk membatalkan',
    labelTapToRetry: 'ketuk untuk mencoba lagi',
    labelTapToUndo: 'ketuk untuk mengurungkan',
    labelButtonRemoveItem: 'Hapus',
    labelButtonAbortItemLoad: 'Batal',
    labelButtonRetryItemLoad: 'Coba Kembali',
    labelButtonAbortItemProcessing: 'Batal',
    labelButtonUndoItemProcessing: 'Batal',
    labelButtonRetryItemProcessing: 'Coba Kembali',
    labelButtonProcessItem: 'Unggah',
    labelMaxFileSizeExceeded: 'File terlalu besar',
    labelMaxFileSize: 'Ukuran file maksimum adalah {filesize}',
    labelMaxTotalFileSizeExceeded: 'Jumlah file maksimum terlampaui',
    labelMaxTotalFileSize: 'Jumlah file maksimum adalah {filesize}',
    labelFileTypeNotAllowed: 'Jenis file tidak valid',
    fileValidateTypeLabelExpectedTypes:
        'Mengharapkan {allButLastType} atau {lastType}',
    imageValidateSizeLabelFormatError: 'Jenis gambar tidak didukung',
    imageValidateSizeLabelImageSizeTooSmall: 'Gambar terlalu kecil',
    imageValidateSizeLabelImageSizeTooBig: 'Gambar terlalu besar',
    imageValidateSizeLabelExpectedMinSize:
        'Ukuran minimum adalah {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Ukuran maksimum adalah {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelImageResolutionTooLow: 'Resolusi terlalu rendah',
    imageValidateSizeLabelImageResolutionTooHigh: 'Resolusi terlalu tinggi',
    imageValidateSizeLabelExpectedMinResolution:
        'Resolusi minimum adalah {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Resolusi maksimum adalah {maxResolution}',
}
var it_it_default = {
    labelIdle:
        'Trascina e rilascia i tuoi file oppure <span class = "filepond--label-action"> Carica <span>',
    labelInvalidField: 'Il campo contiene dei file non validi',
    labelFileWaitingForSize: 'Aspettando le dimensioni',
    labelFileSizeNotAvailable: 'Dimensioni non disponibili',
    labelFileLoading: 'Caricamento',
    labelFileLoadError: 'Errore durante il caricamento',
    labelFileProcessing: 'Caricamento',
    labelFileProcessingComplete: 'Caricamento completato',
    labelFileProcessingAborted: 'Caricamento cancellato',
    labelFileProcessingError: 'Errore durante il caricamento',
    labelFileProcessingRevertError: 'Errore durante il ripristino',
    labelFileRemoveError: "Errore durante l'eliminazione",
    labelTapToCancel: 'tocca per cancellare',
    labelTapToRetry: 'tocca per riprovare',
    labelTapToUndo: 'tocca per ripristinare',
    labelButtonRemoveItem: 'Elimina',
    labelButtonAbortItemLoad: 'Cancella',
    labelButtonRetryItemLoad: 'Ritenta',
    labelButtonAbortItemProcessing: 'Camcella',
    labelButtonUndoItemProcessing: 'Indietro',
    labelButtonRetryItemProcessing: 'Ritenta',
    labelButtonProcessItem: 'Carica',
    labelMaxFileSizeExceeded: 'Il peso del file \xE8 eccessivo',
    labelMaxFileSize: 'Il peso massimo del file \xE8 {filesize}',
    labelMaxTotalFileSizeExceeded: 'Dimensione totale massima superata',
    labelMaxTotalFileSize:
        'La dimensione massima totale del file \xE8 {filesize}',
    labelFileTypeNotAllowed: 'File non supportato',
    fileValidateTypeLabelExpectedTypes: 'Aspetta {allButLastType} o {lastType}',
    imageValidateSizeLabelFormatError: 'Tipo di immagine non compatibile',
    imageValidateSizeLabelImageSizeTooSmall: "L'immagine \xE8 troppo piccola",
    imageValidateSizeLabelImageSizeTooBig: "L'immagine \xE8 troppo grande",
    imageValidateSizeLabelExpectedMinSize:
        'La dimensione minima \xE8 {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'La dimensione massima \xE8 {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'La risoluzione \xE8 troppo bassa',
    imageValidateSizeLabelImageResolutionTooHigh:
        'La risoluzione \xE8 troppo alta',
    imageValidateSizeLabelExpectedMinResolution:
        'La risoluzione minima \xE8 {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'La risoluzione massima \xE8 {maxResolution}',
}
var nl_nl_default = {
    labelIdle:
        'Drag & Drop je bestanden of <span class="filepond--label-action"> Bladeren </span>',
    labelInvalidField: 'Veld bevat ongeldige bestanden',
    labelFileWaitingForSize: 'Wachten op grootte',
    labelFileSizeNotAvailable: 'Grootte niet beschikbaar',
    labelFileLoading: 'Laden',
    labelFileLoadError: 'Fout tijdens laden',
    labelFileProcessing: 'Uploaden',
    labelFileProcessingComplete: 'Upload afgerond',
    labelFileProcessingAborted: 'Upload geannuleerd',
    labelFileProcessingError: 'Fout tijdens upload',
    labelFileProcessingRevertError: 'Fout bij herstellen',
    labelFileRemoveError: 'Fout bij verwijderen',
    labelTapToCancel: 'tik om te annuleren',
    labelTapToRetry: 'tik om opnieuw te proberen',
    labelTapToUndo: 'tik om ongedaan te maken',
    labelButtonRemoveItem: 'Verwijderen',
    labelButtonAbortItemLoad: 'Afbreken',
    labelButtonRetryItemLoad: 'Opnieuw proberen',
    labelButtonAbortItemProcessing: 'Annuleren',
    labelButtonUndoItemProcessing: 'Ongedaan maken',
    labelButtonRetryItemProcessing: 'Opnieuw proberen',
    labelButtonProcessItem: 'Upload',
    labelMaxFileSizeExceeded: 'Bestand is te groot',
    labelMaxFileSize: 'Maximale bestandsgrootte is {filesize}',
    labelMaxTotalFileSizeExceeded: 'Maximale totale grootte overschreden',
    labelMaxTotalFileSize: 'Maximale totale bestandsgrootte is {filesize}',
    labelFileTypeNotAllowed: 'Ongeldig bestandstype',
    fileValidateTypeLabelExpectedTypes:
        'Verwacht {allButLastType} of {lastType}',
    imageValidateSizeLabelFormatError: 'Afbeeldingstype niet ondersteund',
    imageValidateSizeLabelImageSizeTooSmall: 'Afbeelding is te klein',
    imageValidateSizeLabelImageSizeTooBig: 'Afbeelding is te groot',
    imageValidateSizeLabelExpectedMinSize:
        'Minimale afmeting is {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maximale afmeting is {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow: 'Resolutie is te laag',
    imageValidateSizeLabelImageResolutionTooHigh: 'Resolution is too high',
    imageValidateSizeLabelExpectedMinResolution:
        'Minimale resolutie is {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maximale resolutie is {maxResolution}',
}
var pl_pl_default = {
    labelIdle:
        'Przeci\u0105gnij i upu\u015B\u0107 lub <span class="filepond--label-action">wybierz</span> pliki',
    labelInvalidField: 'Nieprawid\u0142owe pliki',
    labelFileWaitingForSize: 'Pobieranie rozmiaru',
    labelFileSizeNotAvailable: 'Nieznany rozmiar',
    labelFileLoading: 'Wczytywanie',
    labelFileLoadError: 'B\u0142\u0105d wczytywania',
    labelFileProcessing: 'Przesy\u0142anie',
    labelFileProcessingComplete: 'Przes\u0142ano',
    labelFileProcessingAborted: 'Przerwano',
    labelFileProcessingError: 'Przesy\u0142anie nie powiod\u0142o si\u0119',
    labelFileProcessingRevertError: 'Co\u015B posz\u0142o nie tak',
    labelFileRemoveError: 'Nieudane usuni\u0119cie',
    labelTapToCancel: 'Anuluj',
    labelTapToRetry: 'Pon\xF3w',
    labelTapToUndo: 'Cofnij',
    labelButtonRemoveItem: 'Usu\u0144',
    labelButtonAbortItemLoad: 'Przerwij',
    labelButtonRetryItemLoad: 'Pon\xF3w',
    labelButtonAbortItemProcessing: 'Anuluj',
    labelButtonUndoItemProcessing: 'Cofnij',
    labelButtonRetryItemProcessing: 'Pon\xF3w',
    labelButtonProcessItem: 'Prze\u015Blij',
    labelMaxFileSizeExceeded: 'Plik jest zbyt du\u017Cy',
    labelMaxFileSize: 'Dopuszczalna wielko\u015B\u0107 pliku to {filesize}',
    labelMaxTotalFileSizeExceeded:
        'Przekroczono \u0142\u0105czny rozmiar plik\xF3w',
    labelMaxTotalFileSize:
        '\u0141\u0105czny rozmiar plik\xF3w nie mo\u017Ce przekroczy\u0107 {filesize}',
    labelFileTypeNotAllowed: 'Niedozwolony rodzaj pliku',
    fileValidateTypeLabelExpectedTypes:
        'Oczekiwano {allButLastType} lub {lastType}',
    imageValidateSizeLabelFormatError: 'Nieobs\u0142ugiwany format obrazu',
    imageValidateSizeLabelImageSizeTooSmall: 'Obraz jest zbyt ma\u0142y',
    imageValidateSizeLabelImageSizeTooBig: 'Obraz jest zbyt du\u017Cy',
    imageValidateSizeLabelExpectedMinSize:
        'Minimalne wymiary obrazu to {minWidth}\xD7{minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maksymalna wymiary obrazu to {maxWidth}\xD7{maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'Rozdzielczo\u015B\u0107 jest zbyt niska',
    imageValidateSizeLabelImageResolutionTooHigh:
        'Rozdzielczo\u015B\u0107 jest zbyt wysoka',
    imageValidateSizeLabelExpectedMinResolution:
        'Minimalna rozdzielczo\u015B\u0107 to {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maksymalna rozdzielczo\u015B\u0107 to {maxResolution}',
}
var pt_br_default = {
    labelIdle:
        'Arraste e solte os arquivos ou <span class="filepond--label-action"> Clique aqui </span>',
    labelInvalidField: 'Arquivos inv\xE1lidos',
    labelFileWaitingForSize: 'Calculando o tamanho do arquivo',
    labelFileSizeNotAvailable: 'Tamanho do arquivo indispon\xEDvel',
    labelFileLoading: 'Carregando',
    labelFileLoadError: 'Erro durante o carregamento',
    labelFileProcessing: 'Enviando',
    labelFileProcessingComplete: 'Envio finalizado',
    labelFileProcessingAborted: 'Envio cancelado',
    labelFileProcessingError: 'Erro durante o envio',
    labelFileProcessingRevertError: 'Erro ao reverter o envio',
    labelFileRemoveError: 'Erro ao remover o arquivo',
    labelTapToCancel: 'clique para cancelar',
    labelTapToRetry: 'clique para reenviar',
    labelTapToUndo: 'clique para desfazer',
    labelButtonRemoveItem: 'Remover',
    labelButtonAbortItemLoad: 'Abortar',
    labelButtonRetryItemLoad: 'Reenviar',
    labelButtonAbortItemProcessing: 'Cancelar',
    labelButtonUndoItemProcessing: 'Desfazer',
    labelButtonRetryItemProcessing: 'Reenviar',
    labelButtonProcessItem: 'Enviar',
    labelMaxFileSizeExceeded: 'Arquivo \xE9 muito grande',
    labelMaxFileSize: 'O tamanho m\xE1ximo permitido: {filesize}',
    labelMaxTotalFileSizeExceeded: 'Tamanho total dos arquivos excedido',
    labelMaxTotalFileSize: 'Tamanho total permitido: {filesize}',
    labelFileTypeNotAllowed: 'Tipo de arquivo inv\xE1lido',
    fileValidateTypeLabelExpectedTypes:
        'Tipos de arquivo suportados s\xE3o {allButLastType} ou {lastType}',
    imageValidateSizeLabelFormatError: 'Tipo de imagem inv\xE1lida',
    imageValidateSizeLabelImageSizeTooSmall: 'Imagem muito pequena',
    imageValidateSizeLabelImageSizeTooBig: 'Imagem muito grande',
    imageValidateSizeLabelExpectedMinSize:
        'Tamanho m\xEDnimo permitida: {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Tamanho m\xE1ximo permitido: {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow: 'Resolu\xE7\xE3o muito baixa',
    imageValidateSizeLabelImageResolutionTooHigh: 'Resolu\xE7\xE3o muito alta',
    imageValidateSizeLabelExpectedMinResolution:
        'Resolu\xE7\xE3o m\xEDnima permitida: {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Resolu\xE7\xE3o m\xE1xima permitida: {maxResolution}',
}
var ro_ro_default = {
    labelIdle:
        'Trage \u0219i plaseaz\u0103 fi\u0219iere sau <span class="filepond--label-action"> Caut\u0103-le </span>',
    labelInvalidField:
        'C\xE2mpul con\u021Bine fi\u0219iere care nu sunt valide',
    labelFileWaitingForSize: '\xCEn a\u0219teptarea dimensiunii',
    labelFileSizeNotAvailable: 'Dimensiunea nu este diponibil\u0103',
    labelFileLoading: 'Se \xEEncarc\u0103',
    labelFileLoadError: 'Eroare la \xEEnc\u0103rcare',
    labelFileProcessing: 'Se \xEEncarc\u0103',
    labelFileProcessingComplete: '\xCEnc\u0103rcare finalizat\u0103',
    labelFileProcessingAborted: '\xCEnc\u0103rcare anulat\u0103',
    labelFileProcessingError: 'Eroare la \xEEnc\u0103rcare',
    labelFileProcessingRevertError: 'Eroare la anulare',
    labelFileRemoveError: 'Eroare la \u015Ftergere',
    labelTapToCancel: 'apas\u0103 pentru a anula',
    labelTapToRetry: 'apas\u0103 pentru a re\xEEncerca',
    labelTapToUndo: 'apas\u0103 pentru a anula',
    labelButtonRemoveItem: '\u015Eterge',
    labelButtonAbortItemLoad: 'Anuleaz\u0103',
    labelButtonRetryItemLoad: 'Re\xEEncearc\u0103',
    labelButtonAbortItemProcessing: 'Anuleaz\u0103',
    labelButtonUndoItemProcessing: 'Anuleaz\u0103',
    labelButtonRetryItemProcessing: 'Re\xEEncearc\u0103',
    labelButtonProcessItem: '\xCEncarc\u0103',
    labelMaxFileSizeExceeded: 'Fi\u0219ierul este prea mare',
    labelMaxFileSize:
        'Dimensiunea maxim\u0103 a unui fi\u0219ier este de {filesize}',
    labelMaxTotalFileSizeExceeded:
        'Dimensiunea total\u0103 maxim\u0103 a fost dep\u0103\u0219it\u0103',
    labelMaxTotalFileSize:
        'Dimensiunea total\u0103 maxim\u0103 a fi\u0219ierelor este de {filesize}',
    labelFileTypeNotAllowed: 'Tipul fi\u0219ierului nu este valid',
    fileValidateTypeLabelExpectedTypes:
        'Se a\u0219teapt\u0103 {allButLastType} sau {lastType}',
    imageValidateSizeLabelFormatError: 'Formatul imaginii nu este acceptat',
    imageValidateSizeLabelImageSizeTooSmall: 'Imaginea este prea mic\u0103',
    imageValidateSizeLabelImageSizeTooBig: 'Imaginea este prea mare',
    imageValidateSizeLabelExpectedMinSize:
        'M\u0103rimea minim\u0103 este de {maxWidth} x {maxHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'M\u0103rimea maxim\u0103 este de {maxWidth} x {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'Rezolu\u021Bia este prea mic\u0103',
    imageValidateSizeLabelImageResolutionTooHigh:
        'Rezolu\u021Bia este prea mare',
    imageValidateSizeLabelExpectedMinResolution:
        'Rezolu\u021Bia minim\u0103 este de {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Rezolu\u021Bia maxim\u0103 este de {maxResolution}',
}
var ru_ru_default = {
    labelIdle:
        '\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0444\u0430\u0439\u043B\u044B \u0438\u043B\u0438 <span class="filepond--label-action"> \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 </span>',
    labelInvalidField:
        '\u041F\u043E\u043B\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0435 \u0444\u0430\u0439\u043B\u044B',
    labelFileWaitingForSize:
        '\u0423\u043A\u0430\u0436\u0438\u0442\u0435 \u0440\u0430\u0437\u043C\u0435\u0440',
    labelFileSizeNotAvailable:
        '\u0420\u0430\u0437\u043C\u0435\u0440 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F',
    labelFileLoading: '\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435',
    labelFileLoadError:
        '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0438',
    labelFileProcessing: '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430',
    labelFileProcessingComplete:
        '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430',
    labelFileProcessingAborted:
        '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043E\u0442\u043C\u0435\u043D\u0435\u043D\u0430',
    labelFileProcessingError:
        '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435',
    labelFileProcessingRevertError:
        '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0435',
    labelFileRemoveError:
        '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438',
    labelTapToCancel:
        '\u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u0434\u043B\u044F \u043E\u0442\u043C\u0435\u043D\u044B',
    labelTapToRetry:
        '\u043D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u043F\u043E\u043F\u044B\u0442\u043A\u0443',
    labelTapToUndo:
        '\u043D\u0430\u0436\u043C\u0438\u0442\u0435 \u0434\u043B\u044F \u043E\u0442\u043C\u0435\u043D\u044B \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F',
    labelButtonRemoveItem: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C',
    labelButtonAbortItemLoad:
        '\u041F\u0440\u0435\u043A\u0440\u0430\u0449\u0435\u043D\u043E',
    labelButtonRetryItemLoad:
        '\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443',
    labelButtonAbortItemProcessing: '\u041E\u0442\u043C\u0435\u043D\u0430',
    labelButtonUndoItemProcessing:
        '\u041E\u0442\u043C\u0435\u043D\u0430 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0433\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F',
    labelButtonRetryItemProcessing:
        '\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443',
    labelButtonProcessItem: '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430',
    labelMaxFileSizeExceeded:
        '\u0424\u0430\u0439\u043B \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439',
    labelMaxFileSize:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0444\u0430\u0439\u043B\u0430: {filesize}',
    labelMaxTotalFileSizeExceeded:
        '\u041F\u0440\u0435\u0432\u044B\u0448\u0435\u043D \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440',
    labelMaxTotalFileSize:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0444\u0430\u0439\u043B\u0430: {filesize}',
    labelFileTypeNotAllowed:
        '\u0424\u0430\u0439\u043B \u043D\u0435\u0432\u0435\u0440\u043D\u043E\u0433\u043E \u0442\u0438\u043F\u0430',
    fileValidateTypeLabelExpectedTypes:
        '\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F {allButLastType} \u0438\u043B\u0438 {lastType}',
    imageValidateSizeLabelFormatError:
        '\u0422\u0438\u043F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F',
    imageValidateSizeLabelImageSizeTooSmall:
        '\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435',
    imageValidateSizeLabelImageSizeTooBig:
        '\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435',
    imageValidateSizeLabelExpectedMinSize:
        '\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440: {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440: {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        '\u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043D\u0438\u0437\u043A\u043E\u0435',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\u0420\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0432\u044B\u0441\u043E\u043A\u043E\u0435',
    imageValidateSizeLabelExpectedMinResolution:
        '\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435: {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435: {maxResolution}',
}
var sv_se_default = {
    labelIdle:
        'Drag och sl\xE4pp dina filer eller <span class="filepond--label-action"> Bl\xE4ddra </span>',
    labelInvalidField: 'F\xE4ltet inneh\xE5ller felaktiga filer',
    labelFileWaitingForSize: 'V\xE4ntar p\xE5 storlek',
    labelFileSizeNotAvailable: 'Storleken finns inte tillg\xE4nglig',
    labelFileLoading: 'Laddar',
    labelFileLoadError: 'Fel under laddning',
    labelFileProcessing: 'Laddar upp',
    labelFileProcessingComplete: 'Uppladdning klar',
    labelFileProcessingAborted: 'Uppladdning avbruten',
    labelFileProcessingError: 'Fel under uppladdning',
    labelFileProcessingRevertError: 'Fel under \xE5terst\xE4llning',
    labelFileRemoveError: 'Fel under borttagning',
    labelTapToCancel: 'tryck f\xF6r att avbryta',
    labelTapToRetry: 'tryck f\xF6r att f\xF6rs\xF6ka igen',
    labelTapToUndo: 'tryck f\xF6r att \xE5ngra',
    labelButtonRemoveItem: 'Tabort',
    labelButtonAbortItemLoad: 'Avbryt',
    labelButtonRetryItemLoad: 'F\xF6rs\xF6k igen',
    labelButtonAbortItemProcessing: 'Avbryt',
    labelButtonUndoItemProcessing: '\xC5ngra',
    labelButtonRetryItemProcessing: 'F\xF6rs\xF6k igen',
    labelButtonProcessItem: 'Ladda upp',
    labelMaxFileSizeExceeded: 'Filen \xE4r f\xF6r stor',
    labelMaxFileSize: 'St\xF6rsta till\xE5tna filstorlek \xE4r {filesize}',
    labelMaxTotalFileSizeExceeded: 'Maximal uppladdningsstorlek uppn\xE5d',
    labelMaxTotalFileSize: 'Maximal uppladdningsstorlek \xE4r {filesize}',
    labelFileTypeNotAllowed: 'Felaktig filtyp',
    fileValidateTypeLabelExpectedTypes:
        'Godk\xE4nda filtyper {allButLastType} eller {lastType}',
    imageValidateSizeLabelFormatError: 'Bildtypen saknar st\xF6d',
    imageValidateSizeLabelImageSizeTooSmall: 'Bilden \xE4r f\xF6r liten',
    imageValidateSizeLabelImageSizeTooBig: 'Bilden \xE4r f\xF6r stor',
    imageValidateSizeLabelExpectedMinSize:
        'Minimal storlek \xE4r {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maximal storlek \xE4r {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        'Uppl\xF6sningen \xE4r f\xF6r l\xE5g',
    imageValidateSizeLabelImageResolutionTooHigh:
        'Uppl\xF6sningen \xE4r f\xF6r h\xF6g',
    imageValidateSizeLabelExpectedMinResolution:
        'Minsta till\xE5tna uppl\xF6sning \xE4r {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'H\xF6gsta till\xE5tna uppl\xF6sning \xE4r {maxResolution}',
}
var tr_tr_default = {
    labelIdle:
        'Dosyan\u0131z\u0131 S\xFCr\xFCkleyin & B\u0131rak\u0131n ya da <span class="filepond--label-action"> Se\xE7in </span>',
    labelInvalidField: 'Alan ge\xE7ersiz dosyalar i\xE7eriyor',
    labelFileWaitingForSize: 'Boyut hesaplan\u0131yor',
    labelFileSizeNotAvailable: 'Boyut mevcut de\u011Fil',
    labelFileLoading: 'Y\xFCkleniyor',
    labelFileLoadError: 'Y\xFCkleme s\u0131ras\u0131nda hata olu\u015Ftu',
    labelFileProcessing: 'Y\xFCkleniyor',
    labelFileProcessingComplete: 'Y\xFCkleme tamamland\u0131',
    labelFileProcessingAborted: 'Y\xFCkleme iptal edildi',
    labelFileProcessingError: 'Y\xFCklerken hata olu\u015Ftu',
    labelFileProcessingRevertError: 'Geri \xE7ekerken hata olu\u015Ftu',
    labelFileRemoveError: 'Kald\u0131r\u0131rken hata olu\u015Ftu',
    labelTapToCancel: '\u0130ptal etmek i\xE7in t\u0131klay\u0131n',
    labelTapToRetry: 'Tekrar denemek i\xE7in t\u0131klay\u0131n',
    labelTapToUndo: 'Geri almak i\xE7in t\u0131klay\u0131n',
    labelButtonRemoveItem: 'Kald\u0131r',
    labelButtonAbortItemLoad: '\u0130ptal Et',
    labelButtonRetryItemLoad: 'Tekrar dene',
    labelButtonAbortItemProcessing: '\u0130ptal et',
    labelButtonUndoItemProcessing: 'Geri Al',
    labelButtonRetryItemProcessing: 'Tekrar dene',
    labelButtonProcessItem: 'Y\xFCkle',
    labelMaxFileSizeExceeded: 'Dosya \xE7ok b\xFCy\xFCk',
    labelMaxFileSize: 'En fazla dosya boyutu: {filesize}',
    labelMaxTotalFileSizeExceeded: 'Maximum boyut a\u015F\u0131ld\u0131',
    labelMaxTotalFileSize: 'Maximum dosya boyutu :{filesize}',
    labelFileTypeNotAllowed: 'Ge\xE7ersiz dosya tipi',
    fileValidateTypeLabelExpectedTypes:
        '\u015Eu {allButLastType} ya da \u015Fu dosya olmas\u0131 gerekir: {lastType}',
    imageValidateSizeLabelFormatError: 'Resim tipi desteklenmiyor',
    imageValidateSizeLabelImageSizeTooSmall: 'Resim \xE7ok k\xFC\xE7\xFCk',
    imageValidateSizeLabelImageSizeTooBig: 'Resim \xE7ok b\xFCy\xFCk',
    imageValidateSizeLabelExpectedMinSize:
        'Minimum boyut {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'Maximum boyut {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        '\xC7\xF6z\xFCn\xFCrl\xFCk \xE7ok d\xFC\u015F\xFCk',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\xC7\xF6z\xFCn\xFCrl\xFCk \xE7ok y\xFCksek',
    imageValidateSizeLabelExpectedMinResolution:
        'Minimum \xE7\xF6z\xFCn\xFCrl\xFCk {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        'Maximum \xE7\xF6z\xFCn\xFCrl\xFCk {maxResolution}',
}
var uk_ua_default = {
    labelIdle:
        '\u041F\u0435\u0440\u0435\u0442\u044F\u0433\u043D\u0456\u0442\u044C \u0444\u0430\u0439\u043B\u0438 \u0430\u0431\u043E <span class="filepond--label-action"> \u0432\u0438\u0431\u0435\u0440\u0456\u0442\u044C </span>',
    labelInvalidField:
        '\u041F\u043E\u043B\u0435 \u043C\u0456\u0441\u0442\u0438\u0442\u044C \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0456 \u0444\u0430\u0439\u043B\u0438',
    labelFileWaitingForSize:
        '\u0412\u043A\u0430\u0436\u0456\u0442\u044C \u0440\u043E\u0437\u043C\u0456\u0440',
    labelFileSizeNotAvailable:
        '\u0420\u043E\u0437\u043C\u0456\u0440 \u043D\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439',
    labelFileLoading:
        '\u041E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F',
    labelFileLoadError:
        '\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u0456',
    labelFileProcessing:
        '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F',
    labelFileProcessingComplete:
        '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u043E',
    labelFileProcessingAborted:
        '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0441\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u043E',
    labelFileProcessingError:
        '\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u0456',
    labelFileProcessingRevertError:
        '\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0432\u0456\u0434\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0456',
    labelFileRemoveError:
        '\u041F\u043E\u043C\u0438\u043B\u043A\u0430 \u043F\u0440\u0438 \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043D\u0456',
    labelTapToCancel: '\u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438',
    labelTapToRetry:
        '\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C, \u0449\u043E\u0431 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0438 \u0441\u043F\u0440\u043E\u0431\u0443',
    labelTapToUndo:
        '\u041D\u0430\u0442\u0438\u0441\u043D\u0456\u0442\u044C, \u0449\u043E\u0431 \u0432\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438 \u043E\u0441\u0442\u0430\u043D\u043D\u044E \u0434\u0456\u044E',
    labelButtonRemoveItem: '\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438',
    labelButtonAbortItemLoad:
        '\u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438',
    labelButtonRetryItemLoad:
        '\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0438 \u0441\u043F\u0440\u043E\u0431\u0443',
    labelButtonAbortItemProcessing:
        '\u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438',
    labelButtonUndoItemProcessing:
        '\u0412\u0456\u0434\u043C\u0456\u043D\u0438\u0442\u0438 \u043E\u0441\u0442\u0430\u043D\u043D\u044E \u0434\u0456\u044E',
    labelButtonRetryItemProcessing:
        '\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0438 \u0441\u043F\u0440\u043E\u0431\u0443',
    labelButtonProcessItem:
        '\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F',
    labelMaxFileSizeExceeded:
        '\u0424\u0430\u0439\u043B \u0437\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0438\u0439',
    labelMaxFileSize:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440 \u0444\u0430\u0439\u043B\u0443: {filesize}',
    labelMaxTotalFileSizeExceeded:
        '\u041F\u0435\u0440\u0435\u0432\u0438\u0449\u0435\u043D\u043E \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0437\u0430\u0433\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440',
    labelMaxTotalFileSize:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0437\u0430\u0433\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440: {filesize}',
    labelFileTypeNotAllowed:
        '\u0424\u043E\u0440\u043C\u0430\u0442 \u0444\u0430\u0439\u043B\u0443 \u043D\u0435 \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u0454\u0442\u044C\u0441\u044F',
    fileValidateTypeLabelExpectedTypes:
        '\u041E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F {allButLastType} \u0430\u0431\u043E {lastType}',
    imageValidateSizeLabelFormatError:
        '\u0424\u043E\u0440\u043C\u0430\u0442 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u043D\u0435 \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u0454\u0442\u044C\u0441\u044F',
    imageValidateSizeLabelImageSizeTooSmall:
        '\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0435',
    imageValidateSizeLabelImageSizeTooBig:
        '\u0417\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435',
    imageValidateSizeLabelExpectedMinSize:
        '\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440: {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0438\u0439 \u0440\u043E\u0437\u043C\u0456\u0440: {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        '\u0420\u043E\u0437\u043C\u0456\u0440\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0456',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\u0420\u043E\u0437\u043C\u0456\u0440\u0438 \u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u043D\u044F \u0437\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0456',
    imageValidateSizeLabelExpectedMinResolution:
        '\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u0456 \u0440\u043E\u0437\u043C\u0456\u0440\u0438: {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        '\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0456 \u0440\u043E\u0437\u043C\u0456\u0440\u0438: {maxResolution}',
}
var vi_vi_default = {
    labelIdle:
        'K\xE9o th\u1EA3 t\u1EC7p c\u1EE7a b\u1EA1n ho\u1EB7c <span class="filepond--label-action"> T\xECm ki\u1EBFm </span>',
    labelInvalidField:
        'Tr\u01B0\u1EDDng ch\u1EE9a c\xE1c t\u1EC7p kh\xF4ng h\u1EE3p l\u1EC7',
    labelFileWaitingForSize: '\u0110ang ch\u1EDD k\xEDch th\u01B0\u1EDBc',
    labelFileSizeNotAvailable:
        'K\xEDch th\u01B0\u1EDBc kh\xF4ng c\xF3 s\u1EB5n',
    labelFileLoading: '\u0110ang t\u1EA3i',
    labelFileLoadError: 'L\u1ED7i khi t\u1EA3i',
    labelFileProcessing: '\u0110ang t\u1EA3i l\xEAn',
    labelFileProcessingComplete: 'T\u1EA3i l\xEAn th\xE0nh c\xF4ng',
    labelFileProcessingAborted: '\u0110\xE3 hu\u1EF7 t\u1EA3i l\xEAn',
    labelFileProcessingError: 'L\u1ED7i khi t\u1EA3i l\xEAn',
    labelFileProcessingRevertError: 'L\u1ED7i khi ho\xE0n nguy\xEAn',
    labelFileRemoveError: 'L\u1ED7i khi x\xF3a',
    labelTapToCancel: 'nh\u1EA5n \u0111\u1EC3 h\u1EE7y',
    labelTapToRetry: 'nh\u1EA5n \u0111\u1EC3 th\u1EED l\u1EA1i',
    labelTapToUndo: 'nh\u1EA5n \u0111\u1EC3 ho\xE0n t\xE1c',
    labelButtonRemoveItem: 'Xo\xE1',
    labelButtonAbortItemLoad: 'Hu\u1EF7 b\u1ECF',
    labelButtonRetryItemLoad: 'Th\u1EED l\u1EA1i',
    labelButtonAbortItemProcessing: 'H\u1EE7y b\u1ECF',
    labelButtonUndoItemProcessing: 'Ho\xE0n t\xE1c',
    labelButtonRetryItemProcessing: 'Th\u1EED l\u1EA1i',
    labelButtonProcessItem: 'T\u1EA3i l\xEAn',
    labelMaxFileSizeExceeded: 'T\u1EADp tin qu\xE1 l\u1EDBn',
    labelMaxFileSize:
        'K\xEDch th\u01B0\u1EDBc t\u1EC7p t\u1ED1i \u0111a l\xE0 {filesize}',
    labelMaxTotalFileSizeExceeded:
        '\u0110\xE3 v\u01B0\u1EE3t qu\xE1 t\u1ED5ng k\xEDch th\u01B0\u1EDBc t\u1ED1i \u0111a',
    labelMaxTotalFileSize:
        'T\u1ED5ng k\xEDch th\u01B0\u1EDBc t\u1EC7p t\u1ED1i \u0111a l\xE0 {filesize}',
    labelFileTypeNotAllowed:
        'T\u1EC7p thu\u1ED9c lo\u1EA1i kh\xF4ng h\u1EE3p l\u1EC7',
    fileValidateTypeLabelExpectedTypes:
        'Ki\u1EC3u t\u1EC7p h\u1EE3p l\u1EC7 l\xE0 {allButLastType} ho\u1EB7c {lastType}',
    imageValidateSizeLabelFormatError:
        'Lo\u1EA1i h\xECnh \u1EA3nh kh\xF4ng \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3',
    imageValidateSizeLabelImageSizeTooSmall: 'H\xECnh \u1EA3nh qu\xE1 nh\u1ECF',
    imageValidateSizeLabelImageSizeTooBig: 'H\xECnh \u1EA3nh qu\xE1 l\u1EDBn',
    imageValidateSizeLabelExpectedMinSize:
        'K\xEDch th\u01B0\u1EDBc t\u1ED1i thi\u1EC3u l\xE0 {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        'K\xEDch th\u01B0\u1EDBc t\u1ED1i \u0111a l\xE0 {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        '\u0110\u1ED9 ph\xE2n gi\u1EA3i qu\xE1 th\u1EA5p',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\u0110\u1ED9 ph\xE2n gi\u1EA3i qu\xE1 cao',
    imageValidateSizeLabelExpectedMinResolution:
        '\u0110\u1ED9 ph\xE2n gi\u1EA3i t\u1ED1i thi\u1EC3u l\xE0 {minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        '\u0110\u1ED9 ph\xE2n gi\u1EA3i t\u1ED1i \u0111a l\xE0 {maxResolution}',
}
var zh_cn_default = {
    labelIdle:
        '\u62D6\u653E\u6587\u4EF6\uFF0C\u6216\u8005 <span class="filepond--label-action"> \u6D4F\u89C8 </span>',
    labelInvalidField: '\u5B57\u6BB5\u5305\u542B\u65E0\u6548\u6587\u4EF6',
    labelFileWaitingForSize: '\u8BA1\u7B97\u6587\u4EF6\u5927\u5C0F',
    labelFileSizeNotAvailable: '\u6587\u4EF6\u5927\u5C0F\u4E0D\u53EF\u7528',
    labelFileLoading: '\u52A0\u8F7D',
    labelFileLoadError: '\u52A0\u8F7D\u9519\u8BEF',
    labelFileProcessing: '\u4E0A\u4F20',
    labelFileProcessingComplete: '\u5DF2\u4E0A\u4F20',
    labelFileProcessingAborted: '\u4E0A\u4F20\u5DF2\u53D6\u6D88',
    labelFileProcessingError: '\u4E0A\u4F20\u51FA\u9519',
    labelFileProcessingRevertError: '\u8FD8\u539F\u51FA\u9519',
    labelFileRemoveError: '\u5220\u9664\u51FA\u9519',
    labelTapToCancel: '\u70B9\u51FB\u53D6\u6D88',
    labelTapToRetry: '\u70B9\u51FB\u91CD\u8BD5',
    labelTapToUndo: '\u70B9\u51FB\u64A4\u6D88',
    labelButtonRemoveItem: '\u5220\u9664',
    labelButtonAbortItemLoad: '\u4E2D\u6B62',
    labelButtonRetryItemLoad: '\u91CD\u8BD5',
    labelButtonAbortItemProcessing: '\u53D6\u6D88',
    labelButtonUndoItemProcessing: '\u64A4\u6D88',
    labelButtonRetryItemProcessing: '\u91CD\u8BD5',
    labelButtonProcessItem: '\u4E0A\u4F20',
    labelMaxFileSizeExceeded: '\u6587\u4EF6\u592A\u5927',
    labelMaxFileSize: '\u6700\u5927\u503C: {filesize}',
    labelMaxTotalFileSizeExceeded:
        '\u8D85\u8FC7\u6700\u5927\u6587\u4EF6\u5927\u5C0F',
    labelMaxTotalFileSize:
        '\u6700\u5927\u6587\u4EF6\u5927\u5C0F\uFF1A{filesize}',
    labelFileTypeNotAllowed: '\u6587\u4EF6\u7C7B\u578B\u65E0\u6548',
    fileValidateTypeLabelExpectedTypes:
        '\u5E94\u4E3A {allButLastType} \u6216 {lastType}',
    imageValidateSizeLabelFormatError:
        '\u4E0D\u652F\u6301\u56FE\u50CF\u7C7B\u578B',
    imageValidateSizeLabelImageSizeTooSmall: '\u56FE\u50CF\u592A\u5C0F',
    imageValidateSizeLabelImageSizeTooBig: '\u56FE\u50CF\u592A\u5927',
    imageValidateSizeLabelExpectedMinSize:
        '\u6700\u5C0F\u503C: {minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        '\u6700\u5927\u503C: {maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        '\u5206\u8FA8\u7387\u592A\u4F4E',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\u5206\u8FA8\u7387\u592A\u9AD8',
    imageValidateSizeLabelExpectedMinResolution:
        '\u6700\u5C0F\u5206\u8FA8\u7387\uFF1A{minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        '\u6700\u5927\u5206\u8FA8\u7387\uFF1A{maxResolution}',
}
var zh_tw_default = {
    labelIdle:
        '\u62D6\u653E\u6A94\u6848\uFF0C\u6216\u8005 <span class="filepond--label-action"> \u700F\u89BD </span>',
    labelInvalidField: '\u4E0D\u652F\u63F4\u6B64\u6A94\u6848',
    labelFileWaitingForSize: '\u6B63\u5728\u8A08\u7B97\u6A94\u6848\u5927\u5C0F',
    labelFileSizeNotAvailable: '\u6A94\u6848\u5927\u5C0F\u4E0D\u7B26',
    labelFileLoading: '\u8B80\u53D6\u4E2D',
    labelFileLoadError: '\u8B80\u53D6\u932F\u8AA4',
    labelFileProcessing: '\u4E0A\u50B3',
    labelFileProcessingComplete: '\u5DF2\u4E0A\u50B3',
    labelFileProcessingAborted: '\u4E0A\u50B3\u5DF2\u53D6\u6D88',
    labelFileProcessingError: '\u4E0A\u50B3\u767C\u751F\u932F\u8AA4',
    labelFileProcessingRevertError: '\u9084\u539F\u932F\u8AA4',
    labelFileRemoveError: '\u522A\u9664\u932F\u8AA4',
    labelTapToCancel: '\u9EDE\u64CA\u53D6\u6D88',
    labelTapToRetry: '\u9EDE\u64CA\u91CD\u8A66',
    labelTapToUndo: '\u9EDE\u64CA\u9084\u539F',
    labelButtonRemoveItem: '\u522A\u9664',
    labelButtonAbortItemLoad: '\u505C\u6B62',
    labelButtonRetryItemLoad: '\u91CD\u8A66',
    labelButtonAbortItemProcessing: '\u53D6\u6D88',
    labelButtonUndoItemProcessing: '\u53D6\u6D88',
    labelButtonRetryItemProcessing: '\u91CD\u8A66',
    labelButtonProcessItem: '\u4E0A\u50B3',
    labelMaxFileSizeExceeded: '\u6A94\u6848\u904E\u5927',
    labelMaxFileSize: '\u6700\u5927\u503C\uFF1A{filesize}',
    labelMaxTotalFileSizeExceeded:
        '\u8D85\u904E\u6700\u5927\u53EF\u4E0A\u50B3\u5927\u5C0F',
    labelMaxTotalFileSize:
        '\u6700\u5927\u53EF\u4E0A\u50B3\u5927\u5C0F\uFF1A{filesize}',
    labelFileTypeNotAllowed: '\u4E0D\u652F\u63F4\u6B64\u985E\u578B\u6A94\u6848',
    fileValidateTypeLabelExpectedTypes:
        '\u61C9\u70BA {allButLastType} \u6216 {lastType}',
    imageValidateSizeLabelFormatError:
        '\u4E0D\u652F\u6301\u6B64\u985E\u5716\u7247\u985E\u578B',
    imageValidateSizeLabelImageSizeTooSmall: '\u5716\u7247\u904E\u5C0F',
    imageValidateSizeLabelImageSizeTooBig: '\u5716\u7247\u904E\u5927',
    imageValidateSizeLabelExpectedMinSize:
        '\u6700\u5C0F\u5C3A\u5BF8\uFF1A{minWidth} \xD7 {minHeight}',
    imageValidateSizeLabelExpectedMaxSize:
        '\u6700\u5927\u5C3A\u5BF8\uFF1A{maxWidth} \xD7 {maxHeight}',
    imageValidateSizeLabelImageResolutionTooLow:
        '\u89E3\u6790\u5EA6\u904E\u4F4E',
    imageValidateSizeLabelImageResolutionTooHigh:
        '\u89E3\u6790\u5EA6\u904E\u9AD8',
    imageValidateSizeLabelExpectedMinResolution:
        '\u6700\u4F4E\u89E3\u6790\u5EA6\uFF1A{minResolution}',
    imageValidateSizeLabelExpectedMaxResolution:
        '\u6700\u9AD8\u89E3\u6790\u5EA6\uFF1A{maxResolution}',
}
registerPlugin(filepond_plugin_file_validate_size_esm_default)
registerPlugin(filepond_plugin_file_validate_type_esm_default)
registerPlugin(filepond_plugin_image_crop_esm_default)
registerPlugin(filepond_plugin_image_exif_orientation_esm_default)
registerPlugin(filepond_plugin_image_preview_esm_default)
registerPlugin(filepond_plugin_image_resize_esm_default)
registerPlugin(filepond_plugin_image_transform_esm_default)
registerPlugin(plugin8)
window.FilePond = filepond_esm_exports
function fileUploadFormComponent({
    acceptedFileTypes,
    deleteUploadedFileUsing,
    getUploadedFilesUsing,
    imageCropAspectRatio,
    imagePreviewHeight,
    imageResizeMode,
    imageResizeTargetHeight,
    imageResizeTargetWidth,
    imageResizeUpscale,
    isAvatar,
    isDownloadable,
    isOpenable,
    isPreviewable,
    isReorderable,
    loadingIndicatorPosition,
    locale,
    panelAspectRatio,
    panelLayout,
    placeholder,
    maxSize,
    minSize,
    removeUploadedFileButtonPosition,
    removeUploadedFileUsing,
    reorderUploadedFilesUsing,
    shouldAppendFiles,
    shouldOrientImageFromExif,
    shouldTransformImage,
    state: state2,
    uploadButtonPosition,
    uploadProgressIndicatorPosition,
    uploadUsing,
}) {
    return {
        fileKeyIndex: {},
        pond: null,
        shouldUpdateState: !0,
        state: state2,
        lastState: null,
        uploadedFileIndex: {},
        init: async function () {
            setOptions$1(locales[locale] ?? locales.en),
                (this.pond = create$f(this.$refs.input, {
                    acceptedFileTypes,
                    allowImageExifOrientation: shouldOrientImageFromExif,
                    allowPaste: !1,
                    allowReorder: isReorderable,
                    allowImagePreview: isPreviewable,
                    allowVideoPreview: isPreviewable,
                    allowAudioPreview: isPreviewable,
                    allowImageTransform: shouldTransformImage,
                    credits: !1,
                    files: await this.getFiles(),
                    imageCropAspectRatio,
                    imagePreviewHeight,
                    imageResizeTargetHeight,
                    imageResizeTargetWidth,
                    imageResizeMode,
                    imageResizeUpscale,
                    itemInsertLocation: shouldAppendFiles ? 'after' : 'before',
                    ...(placeholder && { labelIdle: placeholder }),
                    maxFileSize: maxSize,
                    minFileSize: minSize,
                    styleButtonProcessItemPosition: uploadButtonPosition,
                    styleButtonRemoveItemPosition:
                        removeUploadedFileButtonPosition,
                    styleLoadIndicatorPosition: loadingIndicatorPosition,
                    stylePanelAspectRatio: panelAspectRatio,
                    stylePanelLayout: panelLayout,
                    styleProgressIndicatorPosition:
                        uploadProgressIndicatorPosition,
                    server: {
                        load: async (source, load) => {
                            let blob2 = await (await fetch(source)).blob()
                            load(blob2)
                        },
                        process: (
                            fieldName,
                            file2,
                            metadata,
                            load,
                            error2,
                            progress,
                        ) => {
                            this.shouldUpdateState = !1
                            let fileKey = (
                                [1e7] +
                                -1e3 +
                                -4e3 +
                                -8e3 +
                                -1e11
                            ).replace(/[018]/g, (c) =>
                                (
                                    c ^
                                    (crypto.getRandomValues(
                                        new Uint8Array(1),
                                    )[0] &
                                        (15 >> (c / 4)))
                                ).toString(16),
                            )
                            uploadUsing(
                                fileKey,
                                file2,
                                (fileKey2) => {
                                    ;(this.shouldUpdateState = !0),
                                        load(fileKey2)
                                },
                                error2,
                                progress,
                            )
                        },
                        remove: async (source, load) => {
                            let fileKey = this.uploadedFileIndex[source] ?? null
                            !fileKey ||
                                (await deleteUploadedFileUsing(fileKey), load())
                        },
                        revert: async (uniqueFileId, load) => {
                            await removeUploadedFileUsing(uniqueFileId), load()
                        },
                    },
                })),
                this.$watch('state', async () => {
                    if (!!this.shouldUpdateState) {
                        if (
                            this.state !== null &&
                            Object.values(this.state).filter((file2) =>
                                file2.startsWith('livewire-file:'),
                            ).length
                        ) {
                            this.lastState = null
                            return
                        }
                        JSON.stringify(this.state) !== this.lastState &&
                            ((this.lastState = JSON.stringify(this.state)),
                            (this.pond.files = await this.getFiles()))
                    }
                }),
                this.pond.on('reorderfiles', async (files) => {
                    let orderedFileKeys = files
                        .map((file2) =>
                            file2.source instanceof File
                                ? file2.serverId
                                : this.uploadedFileIndex[file2.source] ?? null,
                        )
                        .filter((fileKey) => fileKey)
                    await reorderUploadedFilesUsing(
                        shouldAppendFiles
                            ? orderedFileKeys
                            : orderedFileKeys.reverse(),
                    )
                }),
                this.pond.on('initfile', async (fileItem) => {
                    !isDownloadable ||
                        isAvatar ||
                        this.insertDownloadLink(fileItem)
                }),
                this.pond.on('initfile', async (fileItem) => {
                    !isOpenable || isAvatar || this.insertOpenLink(fileItem)
                }),
                this.pond.on('processfilestart', async () => {
                    this.dispatchFormEvent('file-upload-started')
                }),
                this.pond.on('processfileprogress', async () => {
                    this.dispatchFormEvent('file-upload-started')
                }),
                this.pond.on('processfile', async () => {
                    this.dispatchFormEvent('file-upload-finished')
                }),
                this.pond.on('processfiles', async () => {
                    this.dispatchFormEvent('file-upload-finished')
                }),
                this.pond.on('processfileabort', async () => {
                    this.dispatchFormEvent('file-upload-finished')
                }),
                this.pond.on('processfilerevert', async () => {
                    this.dispatchFormEvent('file-upload-finished')
                })
        },
        dispatchFormEvent: function (name2) {
            this.$el
                .closest('form')
                ?.dispatchEvent(
                    new CustomEvent(name2, { composed: !0, cancelable: !0 }),
                )
        },
        getUploadedFiles: async function () {
            let uploadedFiles = await getUploadedFilesUsing()
            ;(this.fileKeyIndex = uploadedFiles ?? {}),
                (this.uploadedFileIndex = Object.entries(this.fileKeyIndex)
                    .filter(([key, value]) => value?.url)
                    .reduce(
                        (obj, [key, value]) => ((obj[value.url] = key), obj),
                        {},
                    ))
        },
        getFiles: async function () {
            await this.getUploadedFiles()
            let files = []
            for (let uploadedFile of Object.values(this.fileKeyIndex))
                !uploadedFile ||
                    files.push({
                        source: uploadedFile.url,
                        options: {
                            type: 'local',
                            ...(/^image/.test(uploadedFile.type)
                                ? {}
                                : {
                                      file: {
                                          name: uploadedFile.name,
                                          size: uploadedFile.size,
                                          type: uploadedFile.type,
                                      },
                                  }),
                        },
                    })
            return shouldAppendFiles ? files : files.reverse()
        },
        insertDownloadLink: function (file2) {
            if (file2.origin !== FileOrigin$1.LOCAL) return
            let anchor = this.getDownloadLink(file2)
            !anchor ||
                document
                    .getElementById(`filepond--item-${file2.id}`)
                    .querySelector('.filepond--file-info-main')
                    .prepend(anchor)
        },
        insertOpenLink: function (file2) {
            if (file2.origin !== FileOrigin$1.LOCAL) return
            let anchor = this.getOpenLink(file2)
            !anchor ||
                document
                    .getElementById(`filepond--item-${file2.id}`)
                    .querySelector('.filepond--file-info-main')
                    .prepend(anchor)
        },
        getDownloadLink: function (file2) {
            let fileSource = file2.source
            if (!fileSource) return
            let anchor = document.createElement('a')
            return (
                (anchor.className = 'filepond--download-icon'),
                (anchor.href = fileSource),
                (anchor.download = file2.file.name),
                anchor
            )
        },
        getOpenLink: function (file2) {
            let fileSource = file2.source
            if (!fileSource) return
            let anchor = document.createElement('a')
            return (
                (anchor.className = 'filepond--open-icon'),
                (anchor.href = fileSource),
                (anchor.target = '_blank'),
                anchor
            )
        },
    }
}
var locales = {
    ar: ar_ar_default,
    cs: cs_cz_default,
    da: da_dk_default,
    de: de_de_default,
    en: en_en_default,
    es: es_es_default,
    fa: fa_ir_default,
    fi: fi_fi_default,
    fr: fr_fr_default,
    hu: hu_hu_default,
    id: id_id_default,
    it: it_it_default,
    nl: nl_nl_default,
    pl: pl_pl_default,
    pt_BR: pt_br_default,
    pt_PT: pt_br_default,
    ro: ro_ro_default,
    ru: ru_ru_default,
    sv: sv_se_default,
    tr: tr_tr_default,
    uk: uk_ua_default,
    vi: vi_vi_default,
    zh_CN: zh_cn_default,
    zh_TW: zh_tw_default,
}
export { fileUploadFormComponent as default }
/*!
 * FilePond 4.30.4
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginFileValidateSize 2.2.8
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginFileValidateType 1.2.8
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginImageCrop 2.0.6
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginImageExifOrientation 1.0.11
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginImagePreview 4.6.11
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginImageResize 2.0.10
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginImageTransform 3.8.7
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://pqina.nl/filepond/ for details.
 */
/*!
 * FilePondPluginMediaPreview 1.0.11
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit undefined for details.
 */
