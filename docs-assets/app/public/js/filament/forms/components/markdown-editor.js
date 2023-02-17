var Attachment = class {
    constructor(file, directory) {
        ;(this.file = file),
            (this.directory = directory),
            (this.state = 'pending'),
            (this.id = null),
            (this.href = null),
            (this.name = null),
            (this.percent = 0)
    }
    static traverse(transfer, directory) {
        return transferredFiles(transfer, directory)
    }
    static from(files) {
        let result = []
        for (let file of files)
            if (file instanceof File) result.push(new Attachment(file))
            else if (file instanceof Attachment) result.push(file)
            else throw new Error('Unexpected type')
        return result
    }
    get fullPath() {
        return this.directory
            ? `${this.directory}/${this.file.name}`
            : this.file.name
    }
    isImage() {
        return (
            ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'].indexOf(
                this.file.type,
            ) > -1
        )
    }
    saving(percent) {
        if (this.state !== 'pending' && this.state !== 'saving')
            throw new Error(
                `Unexpected transition from ${this.state} to saving`,
            )
        ;(this.state = 'saving'), (this.percent = percent)
    }
    saved(attributes) {
        var _a, _b, _c
        if (this.state !== 'pending' && this.state !== 'saving')
            throw new Error(`Unexpected transition from ${this.state} to saved`)
        ;(this.state = 'saved'),
            (this.id =
                (_a = attributes == null ? void 0 : attributes.id) !== null &&
                _a !== void 0
                    ? _a
                    : null),
            (this.href =
                (_b = attributes == null ? void 0 : attributes.href) !== null &&
                _b !== void 0
                    ? _b
                    : null),
            (this.name =
                (_c = attributes == null ? void 0 : attributes.name) !== null &&
                _c !== void 0
                    ? _c
                    : null)
    }
    isPending() {
        return this.state === 'pending'
    }
    isSaving() {
        return this.state === 'saving'
    }
    isSaved() {
        return this.state === 'saved'
    }
}
function transferredFiles(transfer, directory) {
    return directory && isDirectory(transfer)
        ? traverse('', roots(transfer))
        : Promise.resolve(
              visible(Array.from(transfer.files || [])).map(
                  (f) => new Attachment(f),
              ),
          )
}
function hidden(file) {
    return file.name.startsWith('.')
}
function visible(files) {
    return Array.from(files).filter((file) => !hidden(file))
}
function getFile(entry) {
    return new Promise(function (resolve, reject) {
        entry.file(resolve, reject)
    })
}
function getEntries(entry) {
    return new Promise(function (resolve, reject) {
        let result = [],
            reader = entry.createReader(),
            read = () => {
                reader.readEntries((entries) => {
                    entries.length > 0
                        ? (result.push(...entries), read())
                        : resolve(result)
                }, reject)
            }
        read()
    })
}
async function traverse(path, entries) {
    let results = []
    for (let entry of visible(entries))
        if (entry.isDirectory)
            results.push(
                ...(await traverse(entry.fullPath, await getEntries(entry))),
            )
        else {
            let file = await getFile(entry)
            results.push(new Attachment(file, path))
        }
    return results
}
function isDirectory(transfer) {
    return (
        transfer.items &&
        Array.from(transfer.items).some((item) => {
            let entry = item.webkitGetAsEntry && item.webkitGetAsEntry()
            return entry && entry.isDirectory
        })
    )
}
function roots(transfer) {
    return Array.from(transfer.items)
        .map((item) => item.webkitGetAsEntry())
        .filter((entry) => entry != null)
}
var FileAttachmentElement = class extends HTMLElement {
    connectedCallback() {
        this.addEventListener('dragenter', onDragenter),
            this.addEventListener('dragover', onDragenter),
            this.addEventListener('dragleave', onDragleave),
            this.addEventListener('drop', onDrop),
            this.addEventListener('paste', onPaste),
            this.addEventListener('change', onChange)
    }
    disconnectedCallback() {
        this.removeEventListener('dragenter', onDragenter),
            this.removeEventListener('dragover', onDragenter),
            this.removeEventListener('dragleave', onDragleave),
            this.removeEventListener('drop', onDrop),
            this.removeEventListener('paste', onPaste),
            this.removeEventListener('change', onChange)
    }
    get directory() {
        return this.hasAttribute('directory')
    }
    set directory(value) {
        value
            ? this.setAttribute('directory', '')
            : this.removeAttribute('directory')
    }
    async attach(transferred) {
        let attachments =
            transferred instanceof DataTransfer
                ? await Attachment.traverse(transferred, this.directory)
                : Attachment.from(transferred)
        this.dispatchEvent(
            new CustomEvent('file-attachment-accept', {
                bubbles: !0,
                cancelable: !0,
                detail: { attachments },
            }),
        ) &&
            attachments.length &&
            this.dispatchEvent(
                new CustomEvent('file-attachment-accepted', {
                    bubbles: !0,
                    detail: { attachments },
                }),
            )
    }
}
function hasFile(transfer) {
    return Array.from(transfer.types).indexOf('Files') >= 0
}
var dragging = null
function onDragenter(event) {
    let target = event.currentTarget
    dragging && clearTimeout(dragging),
        (dragging = window.setTimeout(
            () => target.removeAttribute('hover'),
            200,
        ))
    let transfer = event.dataTransfer
    !transfer ||
        !hasFile(transfer) ||
        ((transfer.dropEffect = 'copy'),
        target.setAttribute('hover', ''),
        event.stopPropagation(),
        event.preventDefault())
}
function onDragleave(event) {
    event.dataTransfer && (event.dataTransfer.dropEffect = 'none'),
        event.currentTarget.removeAttribute('hover'),
        event.stopPropagation(),
        event.preventDefault()
}
function onDrop(event) {
    let container = event.currentTarget
    if (!(container instanceof FileAttachmentElement)) return
    container.removeAttribute('hover')
    let transfer = event.dataTransfer
    !transfer ||
        !hasFile(transfer) ||
        (container.attach(transfer),
        event.stopPropagation(),
        event.preventDefault())
}
var images = /^image\/(gif|png|jpeg)$/
function pastedFile(items) {
    for (let item of items) if (images.test(item.type)) return item.getAsFile()
    return null
}
function onPaste(event) {
    if (!event.clipboardData || !event.clipboardData.items) return
    let container = event.currentTarget
    if (!(container instanceof FileAttachmentElement)) return
    let file = pastedFile(event.clipboardData.items)
    if (!file) return
    let files = [file]
    container.attach(files), event.preventDefault()
}
function onChange(event) {
    let container = event.currentTarget
    if (!(container instanceof FileAttachmentElement)) return
    let input = event.target
    if (!(input instanceof HTMLInputElement)) return
    let id = container.getAttribute('input')
    if (id && input.id !== id) return
    let files = input.files
    !files ||
        files.length === 0 ||
        (container.attach(files), (input.value = ''))
}
window.customElements.get('file-attachment') ||
    ((window.FileAttachmentElement = FileAttachmentElement),
    window.customElements.define('file-attachment', FileAttachmentElement))
var buttonSelectors = [
    '[data-md-button]',
    'md-header',
    'md-bold',
    'md-italic',
    'md-quote',
    'md-code',
    'md-link',
    'md-image',
    'md-unordered-list',
    'md-ordered-list',
    'md-task-list',
    'md-mention',
    'md-ref',
    'md-strikethrough',
]
function getButtons(toolbar) {
    let els = []
    for (let button of toolbar.querySelectorAll(buttonSelectors.join(', ')))
        button.hidden ||
            (button.offsetWidth <= 0 && button.offsetHeight <= 0) ||
            (button.closest('markdown-toolbar') === toolbar && els.push(button))
    return els
}
function keydown(fn) {
    return function (event) {
        ;(event.key === ' ' || event.key === 'Enter') &&
            (event.preventDefault(), fn(event))
    }
}
var styles = new WeakMap(),
    MarkdownButtonElement = class extends HTMLElement {
        constructor() {
            super()
            let apply2 = () => {
                let style = styles.get(this)
                !style || applyStyle(this, style)
            }
            this.addEventListener('keydown', keydown(apply2)),
                this.addEventListener('click', apply2)
        }
        connectedCallback() {
            this.hasAttribute('role') || this.setAttribute('role', 'button')
        }
        click() {
            let style = styles.get(this)
            !style || applyStyle(this, style)
        }
    },
    MarkdownHeaderButtonElement = class extends MarkdownButtonElement {
        constructor() {
            super()
            let level = parseInt(this.getAttribute('level') || '3', 10)
            if (level < 1 || level > 6) return
            let prefix = `${'#'.repeat(level)} `
            styles.set(this, { prefix })
        }
    }
window.customElements.get('md-header') ||
    ((window.MarkdownHeaderButtonElement = MarkdownHeaderButtonElement),
    window.customElements.define('md-header', MarkdownHeaderButtonElement))
var MarkdownBoldButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, { prefix: '**', suffix: '**', trimFirst: !0 })
    }
    connectedCallback() {
        super.connectedCallback(), this.setAttribute('hotkey', 'b')
    }
}
window.customElements.get('md-bold') ||
    ((window.MarkdownBoldButtonElement = MarkdownBoldButtonElement),
    window.customElements.define('md-bold', MarkdownBoldButtonElement))
var MarkdownItalicButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, { prefix: '_', suffix: '_', trimFirst: !0 })
    }
    connectedCallback() {
        super.connectedCallback(), this.setAttribute('hotkey', 'i')
    }
}
window.customElements.get('md-italic') ||
    ((window.MarkdownItalicButtonElement = MarkdownItalicButtonElement),
    window.customElements.define('md-italic', MarkdownItalicButtonElement))
var MarkdownQuoteButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, {
            prefix: '> ',
            multiline: !0,
            surroundWithNewlines: !0,
        })
    }
    connectedCallback() {
        super.connectedCallback(),
            this.setAttribute('hotkey', '.'),
            this.setAttribute('hotkey-requires-shift', 'true')
    }
}
window.customElements.get('md-quote') ||
    ((window.MarkdownQuoteButtonElement = MarkdownQuoteButtonElement),
    window.customElements.define('md-quote', MarkdownQuoteButtonElement))
var MarkdownCodeButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, {
            prefix: '`',
            suffix: '`',
            blockPrefix: '```',
            blockSuffix: '```',
        })
    }
    connectedCallback() {
        super.connectedCallback(), this.setAttribute('hotkey', 'e')
    }
}
window.customElements.get('md-code') ||
    ((window.MarkdownCodeButtonElement = MarkdownCodeButtonElement),
    window.customElements.define('md-code', MarkdownCodeButtonElement))
var MarkdownLinkButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, {
            prefix: '[',
            suffix: '](url)',
            replaceNext: 'url',
            scanFor: 'https?://',
        })
    }
    connectedCallback() {
        super.connectedCallback(), this.setAttribute('hotkey', 'k')
    }
}
window.customElements.get('md-link') ||
    ((window.MarkdownLinkButtonElement = MarkdownLinkButtonElement),
    window.customElements.define('md-link', MarkdownLinkButtonElement))
var MarkdownImageButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, {
            prefix: '![',
            suffix: '](url)',
            replaceNext: 'url',
            scanFor: 'https?://',
        })
    }
}
window.customElements.get('md-image') ||
    ((window.MarkdownImageButtonElement = MarkdownImageButtonElement),
    window.customElements.define('md-image', MarkdownImageButtonElement))
var MarkdownUnorderedListButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, {
            prefix: '- ',
            multiline: !0,
            surroundWithNewlines: !0,
        })
    }
    connectedCallback() {
        super.connectedCallback(),
            this.setAttribute('hotkey', '8'),
            this.setAttribute('hotkey-requires-shift', 'true')
    }
}
window.customElements.get('md-unordered-list') ||
    ((window.MarkdownUnorderedListButtonElement =
        MarkdownUnorderedListButtonElement),
    window.customElements.define(
        'md-unordered-list',
        MarkdownUnorderedListButtonElement,
    ))
var MarkdownOrderedListButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, { prefix: '1. ', multiline: !0, orderedList: !0 })
    }
    connectedCallback() {
        super.connectedCallback(),
            this.setAttribute('hotkey', '7'),
            this.setAttribute('hotkey-requires-shift', 'true')
    }
}
window.customElements.get('md-ordered-list') ||
    ((window.MarkdownOrderedListButtonElement =
        MarkdownOrderedListButtonElement),
    window.customElements.define(
        'md-ordered-list',
        MarkdownOrderedListButtonElement,
    ))
var MarkdownTaskListButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, {
            prefix: '- [ ] ',
            multiline: !0,
            surroundWithNewlines: !0,
        })
    }
    connectedCallback() {
        super.connectedCallback(), this.setAttribute('hotkey', 'L')
    }
}
window.customElements.get('md-task-list') ||
    ((window.MarkdownTaskListButtonElement = MarkdownTaskListButtonElement),
    window.customElements.define('md-task-list', MarkdownTaskListButtonElement))
var MarkdownMentionButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, { prefix: '@', prefixSpace: !0 })
    }
}
window.customElements.get('md-mention') ||
    ((window.MarkdownMentionButtonElement = MarkdownMentionButtonElement),
    window.customElements.define('md-mention', MarkdownMentionButtonElement))
var MarkdownRefButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, { prefix: '#', prefixSpace: !0 })
    }
}
window.customElements.get('md-ref') ||
    ((window.MarkdownRefButtonElement = MarkdownRefButtonElement),
    window.customElements.define('md-ref', MarkdownRefButtonElement))
var MarkdownStrikethroughButtonElement = class extends MarkdownButtonElement {
    constructor() {
        super()
        styles.set(this, { prefix: '~~', suffix: '~~', trimFirst: !0 })
    }
}
window.customElements.get('md-strikethrough') ||
    ((window.MarkdownStrikethroughButtonElement =
        MarkdownStrikethroughButtonElement),
    window.customElements.define(
        'md-strikethrough',
        MarkdownStrikethroughButtonElement,
    ))
var modifierKey = navigator.userAgent.match(/Macintosh/) ? 'Meta' : 'Control',
    MarkdownToolbarElement = class extends HTMLElement {
        constructor() {
            super()
        }
        connectedCallback() {
            this.hasAttribute('role') || this.setAttribute('role', 'toolbar'),
                this.addEventListener('keydown', focusKeydown)
            let fn = shortcut.bind(null, this)
            this.field &&
                (this.field.addEventListener('keydown', fn),
                shortcutListeners.set(this, fn)),
                this.setAttribute('tabindex', '0'),
                this.addEventListener('focus', onToolbarFocus, { once: !0 })
        }
        disconnectedCallback() {
            let fn = shortcutListeners.get(this)
            fn &&
                this.field &&
                (this.field.removeEventListener('keydown', fn),
                shortcutListeners.delete(this)),
                this.removeEventListener('keydown', focusKeydown)
        }
        get field() {
            let id = this.getAttribute('for')
            if (!id) return null
            let root = 'getRootNode' in this ? this.getRootNode() : document,
                field
            return (
                (root instanceof Document || root instanceof ShadowRoot) &&
                    (field = root.getElementById(id)),
                field instanceof HTMLTextAreaElement ? field : null
            )
        }
    }
function onToolbarFocus({ target }) {
    if (!(target instanceof Element)) return
    target.removeAttribute('tabindex')
    let tabindex = '0'
    for (let button of getButtons(target))
        button.setAttribute('tabindex', tabindex),
            tabindex === '0' && (button.focus(), (tabindex = '-1'))
}
function focusKeydown(event) {
    let key = event.key
    if (
        key !== 'ArrowRight' &&
        key !== 'ArrowLeft' &&
        key !== 'Home' &&
        key !== 'End'
    )
        return
    let toolbar = event.currentTarget
    if (!(toolbar instanceof HTMLElement)) return
    let buttons = getButtons(toolbar),
        index = buttons.indexOf(event.target),
        length = buttons.length
    if (index === -1) return
    let n2 = 0
    key === 'ArrowLeft' && (n2 = index - 1),
        key === 'ArrowRight' && (n2 = index + 1),
        key === 'End' && (n2 = length - 1),
        n2 < 0 && (n2 = length - 1),
        n2 > length - 1 && (n2 = 0)
    for (let i = 0; i < length; i += 1)
        buttons[i].setAttribute('tabindex', i === n2 ? '0' : '-1')
    event.preventDefault(), buttons[n2].focus()
}
var shortcutListeners = new WeakMap()
function elementHotkeyRequiresShift(element) {
    return (
        element.hasAttribute('hotkey-requires-shift') &&
        element.getAttribute('hotkey-requires-shift') !== 'false'
    )
}
function findHotkey(toolbar, key, shiftPressed) {
    for (let el of toolbar.querySelectorAll('[hotkey]'))
        if (
            el.getAttribute('hotkey') === key &&
            (!elementHotkeyRequiresShift(el) || shiftPressed)
        )
            return el
    return null
}
function shortcut(toolbar, event) {
    if (
        (event.metaKey && modifierKey === 'Meta') ||
        (event.ctrlKey && modifierKey === 'Control')
    ) {
        let key = event.shiftKey ? event.key.toUpperCase() : event.key,
            button = findHotkey(toolbar, key, event.shiftKey)
        button && (button.click(), event.preventDefault())
    }
}
window.customElements.get('markdown-toolbar') ||
    ((window.MarkdownToolbarElement = MarkdownToolbarElement),
    window.customElements.define('markdown-toolbar', MarkdownToolbarElement))
function isMultipleLines(string) {
    return (
        string.trim().split(`
`).length > 1
    )
}
function repeat(string, n2) {
    return Array(n2 + 1).join(string)
}
function wordSelectionStart(text2, i) {
    let index = i
    for (
        ;
        text2[index] &&
        text2[index - 1] != null &&
        !text2[index - 1].match(/\s/);

    )
        index--
    return index
}
function wordSelectionEnd(text2, i, multiline) {
    let index = i,
        breakpoint = multiline ? /\n/ : /\s/
    for (; text2[index] && !text2[index].match(breakpoint); ) index++
    return index
}
var canInsertText = null
function insertText(textarea, { text: text2, selectionStart, selectionEnd }) {
    let originalSelectionStart = textarea.selectionStart,
        before = textarea.value.slice(0, originalSelectionStart),
        after = textarea.value.slice(textarea.selectionEnd)
    if (canInsertText === null || canInsertText === !0) {
        textarea.contentEditable = 'true'
        try {
            canInsertText = document.execCommand('insertText', !1, text2)
        } catch (error) {
            canInsertText = !1
        }
        textarea.contentEditable = 'false'
    }
    if (
        (canInsertText &&
            !textarea.value.slice(0, textarea.selectionStart).endsWith(text2) &&
            (canInsertText = !1),
        !canInsertText)
    ) {
        try {
            document.execCommand('ms-beginUndoUnit')
        } catch (e2) {}
        textarea.value = before + text2 + after
        try {
            document.execCommand('ms-endUndoUnit')
        } catch (e2) {}
        textarea.dispatchEvent(
            new CustomEvent('input', { bubbles: !0, cancelable: !0 }),
        )
    }
    selectionStart != null && selectionEnd != null
        ? textarea.setSelectionRange(selectionStart, selectionEnd)
        : textarea.setSelectionRange(
              originalSelectionStart,
              textarea.selectionEnd,
          )
}
function styleSelectedText(textarea, styleArgs) {
    let text2 = textarea.value.slice(
            textarea.selectionStart,
            textarea.selectionEnd,
        ),
        result
    styleArgs.orderedList
        ? (result = orderedList(textarea))
        : styleArgs.multiline && isMultipleLines(text2)
        ? (result = multilineStyle(textarea, styleArgs))
        : (result = blockStyle(textarea, styleArgs)),
        insertText(textarea, result)
}
function expandSelectedText(
    textarea,
    prefixToUse,
    suffixToUse,
    multiline = !1,
) {
    if (textarea.selectionStart === textarea.selectionEnd)
        (textarea.selectionStart = wordSelectionStart(
            textarea.value,
            textarea.selectionStart,
        )),
            (textarea.selectionEnd = wordSelectionEnd(
                textarea.value,
                textarea.selectionEnd,
                multiline,
            ))
    else {
        let expandedSelectionStart =
                textarea.selectionStart - prefixToUse.length,
            expandedSelectionEnd = textarea.selectionEnd + suffixToUse.length,
            beginsWithPrefix =
                textarea.value.slice(
                    expandedSelectionStart,
                    textarea.selectionStart,
                ) === prefixToUse,
            endsWithSuffix =
                textarea.value.slice(
                    textarea.selectionEnd,
                    expandedSelectionEnd,
                ) === suffixToUse
        beginsWithPrefix &&
            endsWithSuffix &&
            ((textarea.selectionStart = expandedSelectionStart),
            (textarea.selectionEnd = expandedSelectionEnd))
    }
    return textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)
}
function newlinesToSurroundSelectedText(textarea) {
    let beforeSelection = textarea.value.slice(0, textarea.selectionStart),
        afterSelection = textarea.value.slice(textarea.selectionEnd),
        breaksBefore = beforeSelection.match(/\n*$/),
        breaksAfter = afterSelection.match(/^\n*/),
        newlinesBeforeSelection = breaksBefore ? breaksBefore[0].length : 0,
        newlinesAfterSelection = breaksAfter ? breaksAfter[0].length : 0,
        newlinesToAppend,
        newlinesToPrepend
    return (
        beforeSelection.match(/\S/) &&
            newlinesBeforeSelection < 2 &&
            (newlinesToAppend = repeat(
                `
`,
                2 - newlinesBeforeSelection,
            )),
        afterSelection.match(/\S/) &&
            newlinesAfterSelection < 2 &&
            (newlinesToPrepend = repeat(
                `
`,
                2 - newlinesAfterSelection,
            )),
        newlinesToAppend == null && (newlinesToAppend = ''),
        newlinesToPrepend == null && (newlinesToPrepend = ''),
        { newlinesToAppend, newlinesToPrepend }
    )
}
function blockStyle(textarea, arg) {
    let newlinesToAppend,
        newlinesToPrepend,
        {
            prefix,
            suffix,
            blockPrefix,
            blockSuffix,
            replaceNext,
            prefixSpace,
            scanFor,
            surroundWithNewlines,
        } = arg,
        originalSelectionStart = textarea.selectionStart,
        originalSelectionEnd = textarea.selectionEnd,
        selectedText = textarea.value.slice(
            textarea.selectionStart,
            textarea.selectionEnd,
        ),
        prefixToUse =
            isMultipleLines(selectedText) && blockPrefix.length > 0
                ? `${blockPrefix}
`
                : prefix,
        suffixToUse =
            isMultipleLines(selectedText) && blockSuffix.length > 0
                ? `
${blockSuffix}`
                : suffix
    if (prefixSpace) {
        let beforeSelection = textarea.value[textarea.selectionStart - 1]
        textarea.selectionStart !== 0 &&
            beforeSelection != null &&
            !beforeSelection.match(/\s/) &&
            (prefixToUse = ` ${prefixToUse}`)
    }
    selectedText = expandSelectedText(
        textarea,
        prefixToUse,
        suffixToUse,
        arg.multiline,
    )
    let selectionStart = textarea.selectionStart,
        selectionEnd = textarea.selectionEnd,
        hasReplaceNext =
            replaceNext.length > 0 &&
            suffixToUse.indexOf(replaceNext) > -1 &&
            selectedText.length > 0
    if (surroundWithNewlines) {
        let ref = newlinesToSurroundSelectedText(textarea)
        ;(newlinesToAppend = ref.newlinesToAppend),
            (newlinesToPrepend = ref.newlinesToPrepend),
            (prefixToUse = newlinesToAppend + prefix),
            (suffixToUse += newlinesToPrepend)
    }
    if (
        selectedText.startsWith(prefixToUse) &&
        selectedText.endsWith(suffixToUse)
    ) {
        let replacementText = selectedText.slice(
            prefixToUse.length,
            selectedText.length - suffixToUse.length,
        )
        if (originalSelectionStart === originalSelectionEnd) {
            let position = originalSelectionStart - prefixToUse.length
            ;(position = Math.max(position, selectionStart)),
                (position = Math.min(
                    position,
                    selectionStart + replacementText.length,
                )),
                (selectionStart = selectionEnd = position)
        } else selectionEnd = selectionStart + replacementText.length
        return { text: replacementText, selectionStart, selectionEnd }
    } else if (hasReplaceNext)
        if (scanFor.length > 0 && selectedText.match(scanFor)) {
            suffixToUse = suffixToUse.replace(replaceNext, selectedText)
            let replacementText = prefixToUse + suffixToUse
            return (
                (selectionStart = selectionEnd =
                    selectionStart + prefixToUse.length),
                { text: replacementText, selectionStart, selectionEnd }
            )
        } else {
            let replacementText = prefixToUse + selectedText + suffixToUse
            return (
                (selectionStart =
                    selectionStart +
                    prefixToUse.length +
                    selectedText.length +
                    suffixToUse.indexOf(replaceNext)),
                (selectionEnd = selectionStart + replaceNext.length),
                { text: replacementText, selectionStart, selectionEnd }
            )
        }
    else {
        let replacementText = prefixToUse + selectedText + suffixToUse
        ;(selectionStart = originalSelectionStart + prefixToUse.length),
            (selectionEnd = originalSelectionEnd + prefixToUse.length)
        let whitespaceEdges = selectedText.match(/^\s*|\s*$/g)
        if (arg.trimFirst && whitespaceEdges) {
            let leadingWhitespace = whitespaceEdges[0] || '',
                trailingWhitespace = whitespaceEdges[1] || ''
            ;(replacementText =
                leadingWhitespace +
                prefixToUse +
                selectedText.trim() +
                suffixToUse +
                trailingWhitespace),
                (selectionStart += leadingWhitespace.length),
                (selectionEnd -= trailingWhitespace.length)
        }
        return { text: replacementText, selectionStart, selectionEnd }
    }
}
function multilineStyle(textarea, arg) {
    let { prefix, suffix, surroundWithNewlines } = arg,
        text2 = textarea.value.slice(
            textarea.selectionStart,
            textarea.selectionEnd,
        ),
        selectionStart = textarea.selectionStart,
        selectionEnd = textarea.selectionEnd,
        lines = text2.split(`
`)
    if (lines.every((line) => line.startsWith(prefix) && line.endsWith(suffix)))
        (text2 = lines.map((line) =>
            line.slice(prefix.length, line.length - suffix.length),
        ).join(`
`)),
            (selectionEnd = selectionStart + text2.length)
    else if (
        ((text2 = lines.map((line) => prefix + line + suffix).join(`
`)),
        surroundWithNewlines)
    ) {
        let { newlinesToAppend, newlinesToPrepend } =
            newlinesToSurroundSelectedText(textarea)
        ;(selectionStart += newlinesToAppend.length),
            (selectionEnd = selectionStart + text2.length),
            (text2 = newlinesToAppend + text2 + newlinesToPrepend)
    }
    return { text: text2, selectionStart, selectionEnd }
}
function orderedList(textarea) {
    let orderedListRegex = /^\d+\.\s+/,
        noInitialSelection = textarea.selectionStart === textarea.selectionEnd,
        selectionEnd,
        selectionStart,
        text2 = textarea.value.slice(
            textarea.selectionStart,
            textarea.selectionEnd,
        ),
        textToUnstyle = text2,
        lines = text2.split(`
`),
        startOfLine,
        endOfLine
    if (noInitialSelection) {
        let linesBefore = textarea.value
            .slice(0, textarea.selectionStart)
            .split(/\n/)
        ;(startOfLine =
            textarea.selectionStart -
            linesBefore[linesBefore.length - 1].length),
            (endOfLine = wordSelectionEnd(
                textarea.value,
                textarea.selectionStart,
                !0,
            )),
            (textToUnstyle = textarea.value.slice(startOfLine, endOfLine))
    }
    let linesToUnstyle = textToUnstyle.split(`
`)
    if (linesToUnstyle.every((line) => orderedListRegex.test(line))) {
        if (
            ((lines = linesToUnstyle.map((line) =>
                line.replace(orderedListRegex, ''),
            )),
            (text2 = lines.join(`
`)),
            noInitialSelection && startOfLine && endOfLine)
        ) {
            let lengthDiff = linesToUnstyle[0].length - lines[0].length
            ;(selectionStart = selectionEnd =
                textarea.selectionStart - lengthDiff),
                (textarea.selectionStart = startOfLine),
                (textarea.selectionEnd = endOfLine)
        }
    } else {
        ;(lines = numberedLines(lines)),
            (text2 = lines.join(`
`))
        let { newlinesToAppend, newlinesToPrepend } =
            newlinesToSurroundSelectedText(textarea)
        ;(selectionStart = textarea.selectionStart + newlinesToAppend.length),
            (selectionEnd = selectionStart + text2.length),
            noInitialSelection && (selectionStart = selectionEnd),
            (text2 = newlinesToAppend + text2 + newlinesToPrepend)
    }
    return { text: text2, selectionStart, selectionEnd }
}
function numberedLines(lines) {
    let i,
        len,
        index,
        results = []
    for (index = i = 0, len = lines.length; i < len; index = ++i) {
        let line = lines[index]
        results.push(`${index + 1}. ${line}`)
    }
    return results
}
function applyStyle(button, stylesToApply) {
    let toolbar = button.closest('markdown-toolbar')
    if (!(toolbar instanceof MarkdownToolbarElement)) return
    let style = Object.assign(
            Object.assign(
                {},
                {
                    prefix: '',
                    suffix: '',
                    blockPrefix: '',
                    blockSuffix: '',
                    multiline: !1,
                    replaceNext: '',
                    prefixSpace: !1,
                    scanFor: '',
                    surroundWithNewlines: !1,
                    orderedList: !1,
                    trimFirst: !1,
                },
            ),
            stylesToApply,
        ),
        field = toolbar.field
    field && (field.focus(), styleSelectedText(field, style))
}
function _typeof(obj) {
    return (
        (_typeof =
            typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol'
                ? function (obj2) {
                      return typeof obj2
                  }
                : function (obj2) {
                      return obj2 &&
                          typeof Symbol == 'function' &&
                          obj2.constructor === Symbol &&
                          obj2 !== Symbol.prototype
                          ? 'symbol'
                          : typeof obj2
                  }),
        _typeof(obj)
    )
}
function _setPrototypeOf(o2, p2) {
    return (
        (_setPrototypeOf =
            Object.setPrototypeOf ||
            function (o3, p3) {
                return (o3.__proto__ = p3), o3
            }),
        _setPrototypeOf(o2, p2)
    )
}
function _isNativeReflectConstruct() {
    if (
        typeof Reflect == 'undefined' ||
        !Reflect.construct ||
        Reflect.construct.sham
    )
        return !1
    if (typeof Proxy == 'function') return !0
    try {
        return (
            Boolean.prototype.valueOf.call(
                Reflect.construct(Boolean, [], function () {}),
            ),
            !0
        )
    } catch (e2) {
        return !1
    }
}
function _construct(Parent, args, Class) {
    return (
        _isNativeReflectConstruct()
            ? (_construct = Reflect.construct)
            : (_construct = function (Parent2, args2, Class2) {
                  var a2 = [null]
                  a2.push.apply(a2, args2)
                  var Constructor = Function.bind.apply(Parent2, a2),
                      instance = new Constructor()
                  return (
                      Class2 && _setPrototypeOf(instance, Class2.prototype),
                      instance
                  )
              }),
        _construct.apply(null, arguments)
    )
}
function _toConsumableArray(arr) {
    return (
        _arrayWithoutHoles(arr) ||
        _iterableToArray(arr) ||
        _unsupportedIterableToArray(arr) ||
        _nonIterableSpread()
    )
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr)
}
function _iterableToArray(iter) {
    if (
        (typeof Symbol != 'undefined' && iter[Symbol.iterator] != null) ||
        iter['@@iterator'] != null
    )
        return Array.from(iter)
}
function _unsupportedIterableToArray(o2, minLen) {
    if (!!o2) {
        if (typeof o2 == 'string') return _arrayLikeToArray(o2, minLen)
        var n2 = Object.prototype.toString.call(o2).slice(8, -1)
        if (
            (n2 === 'Object' && o2.constructor && (n2 = o2.constructor.name),
            n2 === 'Map' || n2 === 'Set')
        )
            return Array.from(o2)
        if (
            n2 === 'Arguments' ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n2)
        )
            return _arrayLikeToArray(o2, minLen)
    }
}
function _arrayLikeToArray(arr, len) {
    ;(len == null || len > arr.length) && (len = arr.length)
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]
    return arr2
}
function _nonIterableSpread() {
    throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)
}
var hasOwnProperty = Object.hasOwnProperty,
    setPrototypeOf = Object.setPrototypeOf,
    isFrozen = Object.isFrozen,
    getPrototypeOf = Object.getPrototypeOf,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    freeze = Object.freeze,
    seal = Object.seal,
    create = Object.create,
    _ref = typeof Reflect != 'undefined' && Reflect,
    apply = _ref.apply,
    construct = _ref.construct
apply ||
    (apply = function (fun, thisValue, args) {
        return fun.apply(thisValue, args)
    })
freeze ||
    (freeze = function (x) {
        return x
    })
seal ||
    (seal = function (x) {
        return x
    })
construct ||
    (construct = function (Func, args) {
        return _construct(Func, _toConsumableArray(args))
    })
var arrayForEach = unapply(Array.prototype.forEach),
    arrayPop = unapply(Array.prototype.pop),
    arrayPush = unapply(Array.prototype.push),
    stringToLowerCase = unapply(String.prototype.toLowerCase),
    stringToString = unapply(String.prototype.toString),
    stringMatch = unapply(String.prototype.match),
    stringReplace = unapply(String.prototype.replace),
    stringIndexOf = unapply(String.prototype.indexOf),
    stringTrim = unapply(String.prototype.trim),
    regExpTest = unapply(RegExp.prototype.test),
    typeErrorCreate = unconstruct(TypeError)
function unapply(func) {
    return function (thisArg) {
        for (
            var _len = arguments.length,
                args = new Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
            _key < _len;
            _key++
        )
            args[_key - 1] = arguments[_key]
        return apply(func, thisArg, args)
    }
}
function unconstruct(func) {
    return function () {
        for (
            var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
            _key2 < _len2;
            _key2++
        )
            args[_key2] = arguments[_key2]
        return construct(func, args)
    }
}
function addToSet(set, array, transformCaseFunc) {
    ;(transformCaseFunc = transformCaseFunc || stringToLowerCase),
        setPrototypeOf && setPrototypeOf(set, null)
    for (var l = array.length; l--; ) {
        var element = array[l]
        if (typeof element == 'string') {
            var lcElement = transformCaseFunc(element)
            lcElement !== element &&
                (isFrozen(array) || (array[l] = lcElement),
                (element = lcElement))
        }
        set[element] = !0
    }
    return set
}
function clone(object) {
    var newObject = create(null),
        property
    for (property in object)
        apply(hasOwnProperty, object, [property]) === !0 &&
            (newObject[property] = object[property])
    return newObject
}
function lookupGetter(object, prop) {
    for (; object !== null; ) {
        var desc = getOwnPropertyDescriptor(object, prop)
        if (desc) {
            if (desc.get) return unapply(desc.get)
            if (typeof desc.value == 'function') return unapply(desc.value)
        }
        object = getPrototypeOf(object)
    }
    function fallbackValue(element) {
        return console.warn('fallback value for', element), null
    }
    return fallbackValue
}
var html$1 = freeze([
        'a',
        'abbr',
        'acronym',
        'address',
        'area',
        'article',
        'aside',
        'audio',
        'b',
        'bdi',
        'bdo',
        'big',
        'blink',
        'blockquote',
        'body',
        'br',
        'button',
        'canvas',
        'caption',
        'center',
        'cite',
        'code',
        'col',
        'colgroup',
        'content',
        'data',
        'datalist',
        'dd',
        'decorator',
        'del',
        'details',
        'dfn',
        'dialog',
        'dir',
        'div',
        'dl',
        'dt',
        'element',
        'em',
        'fieldset',
        'figcaption',
        'figure',
        'font',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'head',
        'header',
        'hgroup',
        'hr',
        'html',
        'i',
        'img',
        'input',
        'ins',
        'kbd',
        'label',
        'legend',
        'li',
        'main',
        'map',
        'mark',
        'marquee',
        'menu',
        'menuitem',
        'meter',
        'nav',
        'nobr',
        'ol',
        'optgroup',
        'option',
        'output',
        'p',
        'picture',
        'pre',
        'progress',
        'q',
        'rp',
        'rt',
        'ruby',
        's',
        'samp',
        'section',
        'select',
        'shadow',
        'small',
        'source',
        'spacer',
        'span',
        'strike',
        'strong',
        'style',
        'sub',
        'summary',
        'sup',
        'table',
        'tbody',
        'td',
        'template',
        'textarea',
        'tfoot',
        'th',
        'thead',
        'time',
        'tr',
        'track',
        'tt',
        'u',
        'ul',
        'var',
        'video',
        'wbr',
    ]),
    svg$1 = freeze([
        'svg',
        'a',
        'altglyph',
        'altglyphdef',
        'altglyphitem',
        'animatecolor',
        'animatemotion',
        'animatetransform',
        'circle',
        'clippath',
        'defs',
        'desc',
        'ellipse',
        'filter',
        'font',
        'g',
        'glyph',
        'glyphref',
        'hkern',
        'image',
        'line',
        'lineargradient',
        'marker',
        'mask',
        'metadata',
        'mpath',
        'path',
        'pattern',
        'polygon',
        'polyline',
        'radialgradient',
        'rect',
        'stop',
        'style',
        'switch',
        'symbol',
        'text',
        'textpath',
        'title',
        'tref',
        'tspan',
        'view',
        'vkern',
    ]),
    svgFilters = freeze([
        'feBlend',
        'feColorMatrix',
        'feComponentTransfer',
        'feComposite',
        'feConvolveMatrix',
        'feDiffuseLighting',
        'feDisplacementMap',
        'feDistantLight',
        'feFlood',
        'feFuncA',
        'feFuncB',
        'feFuncG',
        'feFuncR',
        'feGaussianBlur',
        'feImage',
        'feMerge',
        'feMergeNode',
        'feMorphology',
        'feOffset',
        'fePointLight',
        'feSpecularLighting',
        'feSpotLight',
        'feTile',
        'feTurbulence',
    ]),
    svgDisallowed = freeze([
        'animate',
        'color-profile',
        'cursor',
        'discard',
        'fedropshadow',
        'font-face',
        'font-face-format',
        'font-face-name',
        'font-face-src',
        'font-face-uri',
        'foreignobject',
        'hatch',
        'hatchpath',
        'mesh',
        'meshgradient',
        'meshpatch',
        'meshrow',
        'missing-glyph',
        'script',
        'set',
        'solidcolor',
        'unknown',
        'use',
    ]),
    mathMl$1 = freeze([
        'math',
        'menclose',
        'merror',
        'mfenced',
        'mfrac',
        'mglyph',
        'mi',
        'mlabeledtr',
        'mmultiscripts',
        'mn',
        'mo',
        'mover',
        'mpadded',
        'mphantom',
        'mroot',
        'mrow',
        'ms',
        'mspace',
        'msqrt',
        'mstyle',
        'msub',
        'msup',
        'msubsup',
        'mtable',
        'mtd',
        'mtext',
        'mtr',
        'munder',
        'munderover',
    ]),
    mathMlDisallowed = freeze([
        'maction',
        'maligngroup',
        'malignmark',
        'mlongdiv',
        'mscarries',
        'mscarry',
        'msgroup',
        'mstack',
        'msline',
        'msrow',
        'semantics',
        'annotation',
        'annotation-xml',
        'mprescripts',
        'none',
    ]),
    text = freeze(['#text']),
    html = freeze([
        'accept',
        'action',
        'align',
        'alt',
        'autocapitalize',
        'autocomplete',
        'autopictureinpicture',
        'autoplay',
        'background',
        'bgcolor',
        'border',
        'capture',
        'cellpadding',
        'cellspacing',
        'checked',
        'cite',
        'class',
        'clear',
        'color',
        'cols',
        'colspan',
        'controls',
        'controlslist',
        'coords',
        'crossorigin',
        'datetime',
        'decoding',
        'default',
        'dir',
        'disabled',
        'disablepictureinpicture',
        'disableremoteplayback',
        'download',
        'draggable',
        'enctype',
        'enterkeyhint',
        'face',
        'for',
        'headers',
        'height',
        'hidden',
        'high',
        'href',
        'hreflang',
        'id',
        'inputmode',
        'integrity',
        'ismap',
        'kind',
        'label',
        'lang',
        'list',
        'loading',
        'loop',
        'low',
        'max',
        'maxlength',
        'media',
        'method',
        'min',
        'minlength',
        'multiple',
        'muted',
        'name',
        'nonce',
        'noshade',
        'novalidate',
        'nowrap',
        'open',
        'optimum',
        'pattern',
        'placeholder',
        'playsinline',
        'poster',
        'preload',
        'pubdate',
        'radiogroup',
        'readonly',
        'rel',
        'required',
        'rev',
        'reversed',
        'role',
        'rows',
        'rowspan',
        'spellcheck',
        'scope',
        'selected',
        'shape',
        'size',
        'sizes',
        'span',
        'srclang',
        'start',
        'src',
        'srcset',
        'step',
        'style',
        'summary',
        'tabindex',
        'title',
        'translate',
        'type',
        'usemap',
        'valign',
        'value',
        'width',
        'xmlns',
        'slot',
    ]),
    svg = freeze([
        'accent-height',
        'accumulate',
        'additive',
        'alignment-baseline',
        'ascent',
        'attributename',
        'attributetype',
        'azimuth',
        'basefrequency',
        'baseline-shift',
        'begin',
        'bias',
        'by',
        'class',
        'clip',
        'clippathunits',
        'clip-path',
        'clip-rule',
        'color',
        'color-interpolation',
        'color-interpolation-filters',
        'color-profile',
        'color-rendering',
        'cx',
        'cy',
        'd',
        'dx',
        'dy',
        'diffuseconstant',
        'direction',
        'display',
        'divisor',
        'dur',
        'edgemode',
        'elevation',
        'end',
        'fill',
        'fill-opacity',
        'fill-rule',
        'filter',
        'filterunits',
        'flood-color',
        'flood-opacity',
        'font-family',
        'font-size',
        'font-size-adjust',
        'font-stretch',
        'font-style',
        'font-variant',
        'font-weight',
        'fx',
        'fy',
        'g1',
        'g2',
        'glyph-name',
        'glyphref',
        'gradientunits',
        'gradienttransform',
        'height',
        'href',
        'id',
        'image-rendering',
        'in',
        'in2',
        'k',
        'k1',
        'k2',
        'k3',
        'k4',
        'kerning',
        'keypoints',
        'keysplines',
        'keytimes',
        'lang',
        'lengthadjust',
        'letter-spacing',
        'kernelmatrix',
        'kernelunitlength',
        'lighting-color',
        'local',
        'marker-end',
        'marker-mid',
        'marker-start',
        'markerheight',
        'markerunits',
        'markerwidth',
        'maskcontentunits',
        'maskunits',
        'max',
        'mask',
        'media',
        'method',
        'mode',
        'min',
        'name',
        'numoctaves',
        'offset',
        'operator',
        'opacity',
        'order',
        'orient',
        'orientation',
        'origin',
        'overflow',
        'paint-order',
        'path',
        'pathlength',
        'patterncontentunits',
        'patterntransform',
        'patternunits',
        'points',
        'preservealpha',
        'preserveaspectratio',
        'primitiveunits',
        'r',
        'rx',
        'ry',
        'radius',
        'refx',
        'refy',
        'repeatcount',
        'repeatdur',
        'restart',
        'result',
        'rotate',
        'scale',
        'seed',
        'shape-rendering',
        'specularconstant',
        'specularexponent',
        'spreadmethod',
        'startoffset',
        'stddeviation',
        'stitchtiles',
        'stop-color',
        'stop-opacity',
        'stroke-dasharray',
        'stroke-dashoffset',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-miterlimit',
        'stroke-opacity',
        'stroke',
        'stroke-width',
        'style',
        'surfacescale',
        'systemlanguage',
        'tabindex',
        'targetx',
        'targety',
        'transform',
        'transform-origin',
        'text-anchor',
        'text-decoration',
        'text-rendering',
        'textlength',
        'type',
        'u1',
        'u2',
        'unicode',
        'values',
        'viewbox',
        'visibility',
        'version',
        'vert-adv-y',
        'vert-origin-x',
        'vert-origin-y',
        'width',
        'word-spacing',
        'wrap',
        'writing-mode',
        'xchannelselector',
        'ychannelselector',
        'x',
        'x1',
        'x2',
        'xmlns',
        'y',
        'y1',
        'y2',
        'z',
        'zoomandpan',
    ]),
    mathMl = freeze([
        'accent',
        'accentunder',
        'align',
        'bevelled',
        'close',
        'columnsalign',
        'columnlines',
        'columnspan',
        'denomalign',
        'depth',
        'dir',
        'display',
        'displaystyle',
        'encoding',
        'fence',
        'frame',
        'height',
        'href',
        'id',
        'largeop',
        'length',
        'linethickness',
        'lspace',
        'lquote',
        'mathbackground',
        'mathcolor',
        'mathsize',
        'mathvariant',
        'maxsize',
        'minsize',
        'movablelimits',
        'notation',
        'numalign',
        'open',
        'rowalign',
        'rowlines',
        'rowspacing',
        'rowspan',
        'rspace',
        'rquote',
        'scriptlevel',
        'scriptminsize',
        'scriptsizemultiplier',
        'selection',
        'separator',
        'separators',
        'stretchy',
        'subscriptshift',
        'supscriptshift',
        'symmetric',
        'voffset',
        'width',
        'xmlns',
    ]),
    xml = freeze([
        'xlink:href',
        'xml:id',
        'xlink:title',
        'xml:space',
        'xmlns:xlink',
    ]),
    MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
    ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm),
    TMPLIT_EXPR = seal(/\${[\w\W]*}/gm),
    DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/),
    ARIA_ATTR = seal(/^aria-[\-\w]+$/),
    IS_ALLOWED_URI = seal(
        /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ),
    IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i),
    ATTR_WHITESPACE = seal(
        /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g,
    ),
    DOCTYPE_NAME = seal(/^html$/i),
    getGlobal = function () {
        return typeof window == 'undefined' ? null : window
    },
    _createTrustedTypesPolicy = function (trustedTypes, document2) {
        if (
            _typeof(trustedTypes) !== 'object' ||
            typeof trustedTypes.createPolicy != 'function'
        )
            return null
        var suffix = null,
            ATTR_NAME = 'data-tt-policy-suffix'
        document2.currentScript &&
            document2.currentScript.hasAttribute(ATTR_NAME) &&
            (suffix = document2.currentScript.getAttribute(ATTR_NAME))
        var policyName = 'dompurify' + (suffix ? '#' + suffix : '')
        try {
            return trustedTypes.createPolicy(policyName, {
                createHTML: function (html2) {
                    return html2
                },
                createScriptURL: function (scriptUrl) {
                    return scriptUrl
                },
            })
        } catch (_) {
            return (
                console.warn(
                    'TrustedTypes policy ' +
                        policyName +
                        ' could not be created.',
                ),
                null
            )
        }
    }
function createDOMPurify() {
    var window2 =
            arguments.length > 0 && arguments[0] !== void 0
                ? arguments[0]
                : getGlobal(),
        DOMPurify = function (root) {
            return createDOMPurify(root)
        }
    if (
        ((DOMPurify.version = '2.4.4'),
        (DOMPurify.removed = []),
        !window2 || !window2.document || window2.document.nodeType !== 9)
    )
        return (DOMPurify.isSupported = !1), DOMPurify
    var originalDocument = window2.document,
        document2 = window2.document,
        DocumentFragment = window2.DocumentFragment,
        HTMLTemplateElement = window2.HTMLTemplateElement,
        Node = window2.Node,
        Element2 = window2.Element,
        NodeFilter = window2.NodeFilter,
        _window$NamedNodeMap = window2.NamedNodeMap,
        NamedNodeMap =
            _window$NamedNodeMap === void 0
                ? window2.NamedNodeMap || window2.MozNamedAttrMap
                : _window$NamedNodeMap,
        HTMLFormElement = window2.HTMLFormElement,
        DOMParser = window2.DOMParser,
        trustedTypes = window2.trustedTypes,
        ElementPrototype = Element2.prototype,
        cloneNode = lookupGetter(ElementPrototype, 'cloneNode'),
        getNextSibling = lookupGetter(ElementPrototype, 'nextSibling'),
        getChildNodes = lookupGetter(ElementPrototype, 'childNodes'),
        getParentNode = lookupGetter(ElementPrototype, 'parentNode')
    if (typeof HTMLTemplateElement == 'function') {
        var template = document2.createElement('template')
        template.content &&
            template.content.ownerDocument &&
            (document2 = template.content.ownerDocument)
    }
    var trustedTypesPolicy = _createTrustedTypesPolicy(
            trustedTypes,
            originalDocument,
        ),
        emptyHTML = trustedTypesPolicy ? trustedTypesPolicy.createHTML('') : '',
        _document = document2,
        implementation = _document.implementation,
        createNodeIterator = _document.createNodeIterator,
        createDocumentFragment = _document.createDocumentFragment,
        getElementsByTagName = _document.getElementsByTagName,
        importNode = originalDocument.importNode,
        documentMode = {}
    try {
        documentMode = clone(document2).documentMode
            ? document2.documentMode
            : {}
    } catch (_) {}
    var hooks = {}
    DOMPurify.isSupported =
        typeof getParentNode == 'function' &&
        implementation &&
        typeof implementation.createHTMLDocument != 'undefined' &&
        documentMode !== 9
    var MUSTACHE_EXPR$1 = MUSTACHE_EXPR,
        ERB_EXPR$1 = ERB_EXPR,
        TMPLIT_EXPR$1 = TMPLIT_EXPR,
        DATA_ATTR$1 = DATA_ATTR,
        ARIA_ATTR$1 = ARIA_ATTR,
        IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA,
        ATTR_WHITESPACE$1 = ATTR_WHITESPACE,
        IS_ALLOWED_URI$1 = IS_ALLOWED_URI,
        ALLOWED_TAGS = null,
        DEFAULT_ALLOWED_TAGS = addToSet(
            {},
            [].concat(
                _toConsumableArray(html$1),
                _toConsumableArray(svg$1),
                _toConsumableArray(svgFilters),
                _toConsumableArray(mathMl$1),
                _toConsumableArray(text),
            ),
        ),
        ALLOWED_ATTR = null,
        DEFAULT_ALLOWED_ATTR = addToSet(
            {},
            [].concat(
                _toConsumableArray(html),
                _toConsumableArray(svg),
                _toConsumableArray(mathMl),
                _toConsumableArray(xml),
            ),
        ),
        CUSTOM_ELEMENT_HANDLING = Object.seal(
            Object.create(null, {
                tagNameCheck: {
                    writable: !0,
                    configurable: !1,
                    enumerable: !0,
                    value: null,
                },
                attributeNameCheck: {
                    writable: !0,
                    configurable: !1,
                    enumerable: !0,
                    value: null,
                },
                allowCustomizedBuiltInElements: {
                    writable: !0,
                    configurable: !1,
                    enumerable: !0,
                    value: !1,
                },
            }),
        ),
        FORBID_TAGS = null,
        FORBID_ATTR = null,
        ALLOW_ARIA_ATTR = !0,
        ALLOW_DATA_ATTR = !0,
        ALLOW_UNKNOWN_PROTOCOLS = !1,
        ALLOW_SELF_CLOSE_IN_ATTR = !0,
        SAFE_FOR_TEMPLATES = !1,
        WHOLE_DOCUMENT = !1,
        SET_CONFIG = !1,
        FORCE_BODY = !1,
        RETURN_DOM = !1,
        RETURN_DOM_FRAGMENT = !1,
        RETURN_TRUSTED_TYPE = !1,
        SANITIZE_DOM = !0,
        SANITIZE_NAMED_PROPS = !1,
        SANITIZE_NAMED_PROPS_PREFIX = 'user-content-',
        KEEP_CONTENT = !0,
        IN_PLACE = !1,
        USE_PROFILES = {},
        FORBID_CONTENTS = null,
        DEFAULT_FORBID_CONTENTS = addToSet({}, [
            'annotation-xml',
            'audio',
            'colgroup',
            'desc',
            'foreignobject',
            'head',
            'iframe',
            'math',
            'mi',
            'mn',
            'mo',
            'ms',
            'mtext',
            'noembed',
            'noframes',
            'noscript',
            'plaintext',
            'script',
            'style',
            'svg',
            'template',
            'thead',
            'title',
            'video',
            'xmp',
        ]),
        DATA_URI_TAGS = null,
        DEFAULT_DATA_URI_TAGS = addToSet({}, [
            'audio',
            'video',
            'img',
            'source',
            'image',
            'track',
        ]),
        URI_SAFE_ATTRIBUTES = null,
        DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
            'alt',
            'class',
            'for',
            'id',
            'label',
            'name',
            'pattern',
            'placeholder',
            'role',
            'summary',
            'title',
            'value',
            'style',
            'xmlns',
        ]),
        MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML',
        SVG_NAMESPACE = 'http://www.w3.org/2000/svg',
        HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml',
        NAMESPACE = HTML_NAMESPACE,
        IS_EMPTY_INPUT = !1,
        ALLOWED_NAMESPACES = null,
        DEFAULT_ALLOWED_NAMESPACES = addToSet(
            {},
            [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE],
            stringToString,
        ),
        PARSER_MEDIA_TYPE,
        SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'],
        DEFAULT_PARSER_MEDIA_TYPE = 'text/html',
        transformCaseFunc,
        CONFIG = null,
        formElement = document2.createElement('form'),
        isRegexOrFunction = function (testValue) {
            return testValue instanceof RegExp || testValue instanceof Function
        },
        _parseConfig = function (cfg) {
            ;(CONFIG && CONFIG === cfg) ||
                ((!cfg || _typeof(cfg) !== 'object') && (cfg = {}),
                (cfg = clone(cfg)),
                (PARSER_MEDIA_TYPE =
                    SUPPORTED_PARSER_MEDIA_TYPES.indexOf(
                        cfg.PARSER_MEDIA_TYPE,
                    ) === -1
                        ? (PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE)
                        : (PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE)),
                (transformCaseFunc =
                    PARSER_MEDIA_TYPE === 'application/xhtml+xml'
                        ? stringToString
                        : stringToLowerCase),
                (ALLOWED_TAGS =
                    'ALLOWED_TAGS' in cfg
                        ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc)
                        : DEFAULT_ALLOWED_TAGS),
                (ALLOWED_ATTR =
                    'ALLOWED_ATTR' in cfg
                        ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc)
                        : DEFAULT_ALLOWED_ATTR),
                (ALLOWED_NAMESPACES =
                    'ALLOWED_NAMESPACES' in cfg
                        ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString)
                        : DEFAULT_ALLOWED_NAMESPACES),
                (URI_SAFE_ATTRIBUTES =
                    'ADD_URI_SAFE_ATTR' in cfg
                        ? addToSet(
                              clone(DEFAULT_URI_SAFE_ATTRIBUTES),
                              cfg.ADD_URI_SAFE_ATTR,
                              transformCaseFunc,
                          )
                        : DEFAULT_URI_SAFE_ATTRIBUTES),
                (DATA_URI_TAGS =
                    'ADD_DATA_URI_TAGS' in cfg
                        ? addToSet(
                              clone(DEFAULT_DATA_URI_TAGS),
                              cfg.ADD_DATA_URI_TAGS,
                              transformCaseFunc,
                          )
                        : DEFAULT_DATA_URI_TAGS),
                (FORBID_CONTENTS =
                    'FORBID_CONTENTS' in cfg
                        ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc)
                        : DEFAULT_FORBID_CONTENTS),
                (FORBID_TAGS =
                    'FORBID_TAGS' in cfg
                        ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc)
                        : {}),
                (FORBID_ATTR =
                    'FORBID_ATTR' in cfg
                        ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc)
                        : {}),
                (USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : !1),
                (ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== !1),
                (ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== !1),
                (ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || !1),
                (ALLOW_SELF_CLOSE_IN_ATTR =
                    cfg.ALLOW_SELF_CLOSE_IN_ATTR !== !1),
                (SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || !1),
                (WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || !1),
                (RETURN_DOM = cfg.RETURN_DOM || !1),
                (RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || !1),
                (RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || !1),
                (FORCE_BODY = cfg.FORCE_BODY || !1),
                (SANITIZE_DOM = cfg.SANITIZE_DOM !== !1),
                (SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || !1),
                (KEEP_CONTENT = cfg.KEEP_CONTENT !== !1),
                (IN_PLACE = cfg.IN_PLACE || !1),
                (IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$1),
                (NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE),
                cfg.CUSTOM_ELEMENT_HANDLING &&
                    isRegexOrFunction(
                        cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck,
                    ) &&
                    (CUSTOM_ELEMENT_HANDLING.tagNameCheck =
                        cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
                cfg.CUSTOM_ELEMENT_HANDLING &&
                    isRegexOrFunction(
                        cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck,
                    ) &&
                    (CUSTOM_ELEMENT_HANDLING.attributeNameCheck =
                        cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
                cfg.CUSTOM_ELEMENT_HANDLING &&
                    typeof cfg.CUSTOM_ELEMENT_HANDLING
                        .allowCustomizedBuiltInElements == 'boolean' &&
                    (CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements =
                        cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
                SAFE_FOR_TEMPLATES && (ALLOW_DATA_ATTR = !1),
                RETURN_DOM_FRAGMENT && (RETURN_DOM = !0),
                USE_PROFILES &&
                    ((ALLOWED_TAGS = addToSet({}, _toConsumableArray(text))),
                    (ALLOWED_ATTR = []),
                    USE_PROFILES.html === !0 &&
                        (addToSet(ALLOWED_TAGS, html$1),
                        addToSet(ALLOWED_ATTR, html)),
                    USE_PROFILES.svg === !0 &&
                        (addToSet(ALLOWED_TAGS, svg$1),
                        addToSet(ALLOWED_ATTR, svg),
                        addToSet(ALLOWED_ATTR, xml)),
                    USE_PROFILES.svgFilters === !0 &&
                        (addToSet(ALLOWED_TAGS, svgFilters),
                        addToSet(ALLOWED_ATTR, svg),
                        addToSet(ALLOWED_ATTR, xml)),
                    USE_PROFILES.mathMl === !0 &&
                        (addToSet(ALLOWED_TAGS, mathMl$1),
                        addToSet(ALLOWED_ATTR, mathMl),
                        addToSet(ALLOWED_ATTR, xml))),
                cfg.ADD_TAGS &&
                    (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS &&
                        (ALLOWED_TAGS = clone(ALLOWED_TAGS)),
                    addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc)),
                cfg.ADD_ATTR &&
                    (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR &&
                        (ALLOWED_ATTR = clone(ALLOWED_ATTR)),
                    addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc)),
                cfg.ADD_URI_SAFE_ATTR &&
                    addToSet(
                        URI_SAFE_ATTRIBUTES,
                        cfg.ADD_URI_SAFE_ATTR,
                        transformCaseFunc,
                    ),
                cfg.FORBID_CONTENTS &&
                    (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS &&
                        (FORBID_CONTENTS = clone(FORBID_CONTENTS)),
                    addToSet(
                        FORBID_CONTENTS,
                        cfg.FORBID_CONTENTS,
                        transformCaseFunc,
                    )),
                KEEP_CONTENT && (ALLOWED_TAGS['#text'] = !0),
                WHOLE_DOCUMENT &&
                    addToSet(ALLOWED_TAGS, ['html', 'head', 'body']),
                ALLOWED_TAGS.table &&
                    (addToSet(ALLOWED_TAGS, ['tbody']),
                    delete FORBID_TAGS.tbody),
                freeze && freeze(cfg),
                (CONFIG = cfg))
        },
        MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, [
            'mi',
            'mo',
            'mn',
            'ms',
            'mtext',
        ]),
        HTML_INTEGRATION_POINTS = addToSet({}, [
            'foreignobject',
            'desc',
            'title',
            'annotation-xml',
        ]),
        COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
            'title',
            'style',
            'font',
            'a',
            'script',
        ]),
        ALL_SVG_TAGS = addToSet({}, svg$1)
    addToSet(ALL_SVG_TAGS, svgFilters), addToSet(ALL_SVG_TAGS, svgDisallowed)
    var ALL_MATHML_TAGS = addToSet({}, mathMl$1)
    addToSet(ALL_MATHML_TAGS, mathMlDisallowed)
    var _checkValidNamespace = function (element) {
            var parent = getParentNode(element)
            ;(!parent || !parent.tagName) &&
                (parent = { namespaceURI: NAMESPACE, tagName: 'template' })
            var tagName = stringToLowerCase(element.tagName),
                parentTagName = stringToLowerCase(parent.tagName)
            return ALLOWED_NAMESPACES[element.namespaceURI]
                ? element.namespaceURI === SVG_NAMESPACE
                    ? parent.namespaceURI === HTML_NAMESPACE
                        ? tagName === 'svg'
                        : parent.namespaceURI === MATHML_NAMESPACE
                        ? tagName === 'svg' &&
                          (parentTagName === 'annotation-xml' ||
                              MATHML_TEXT_INTEGRATION_POINTS[parentTagName])
                        : Boolean(ALL_SVG_TAGS[tagName])
                    : element.namespaceURI === MATHML_NAMESPACE
                    ? parent.namespaceURI === HTML_NAMESPACE
                        ? tagName === 'math'
                        : parent.namespaceURI === SVG_NAMESPACE
                        ? tagName === 'math' &&
                          HTML_INTEGRATION_POINTS[parentTagName]
                        : Boolean(ALL_MATHML_TAGS[tagName])
                    : element.namespaceURI === HTML_NAMESPACE
                    ? (parent.namespaceURI === SVG_NAMESPACE &&
                          !HTML_INTEGRATION_POINTS[parentTagName]) ||
                      (parent.namespaceURI === MATHML_NAMESPACE &&
                          !MATHML_TEXT_INTEGRATION_POINTS[parentTagName])
                        ? !1
                        : !ALL_MATHML_TAGS[tagName] &&
                          (COMMON_SVG_AND_HTML_ELEMENTS[tagName] ||
                              !ALL_SVG_TAGS[tagName])
                    : !!(
                          PARSER_MEDIA_TYPE === 'application/xhtml+xml' &&
                          ALLOWED_NAMESPACES[element.namespaceURI]
                      )
                : !1
        },
        _forceRemove = function (node) {
            arrayPush(DOMPurify.removed, { element: node })
            try {
                node.parentNode.removeChild(node)
            } catch (_) {
                try {
                    node.outerHTML = emptyHTML
                } catch (_2) {
                    node.remove()
                }
            }
        },
        _removeAttribute = function (name, node) {
            try {
                arrayPush(DOMPurify.removed, {
                    attribute: node.getAttributeNode(name),
                    from: node,
                })
            } catch (_) {
                arrayPush(DOMPurify.removed, { attribute: null, from: node })
            }
            if (
                (node.removeAttribute(name),
                name === 'is' && !ALLOWED_ATTR[name])
            )
                if (RETURN_DOM || RETURN_DOM_FRAGMENT)
                    try {
                        _forceRemove(node)
                    } catch (_) {}
                else
                    try {
                        node.setAttribute(name, '')
                    } catch (_) {}
        },
        _initDocument = function (dirty) {
            var doc, leadingWhitespace
            if (FORCE_BODY) dirty = '<remove></remove>' + dirty
            else {
                var matches = stringMatch(dirty, /^[\r\n\t ]+/)
                leadingWhitespace = matches && matches[0]
            }
            PARSER_MEDIA_TYPE === 'application/xhtml+xml' &&
                NAMESPACE === HTML_NAMESPACE &&
                (dirty =
                    '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' +
                    dirty +
                    '</body></html>')
            var dirtyPayload = trustedTypesPolicy
                ? trustedTypesPolicy.createHTML(dirty)
                : dirty
            if (NAMESPACE === HTML_NAMESPACE)
                try {
                    doc = new DOMParser().parseFromString(
                        dirtyPayload,
                        PARSER_MEDIA_TYPE,
                    )
                } catch (_) {}
            if (!doc || !doc.documentElement) {
                doc = implementation.createDocument(NAMESPACE, 'template', null)
                try {
                    doc.documentElement.innerHTML = IS_EMPTY_INPUT
                        ? emptyHTML
                        : dirtyPayload
                } catch (_) {}
            }
            var body = doc.body || doc.documentElement
            return (
                dirty &&
                    leadingWhitespace &&
                    body.insertBefore(
                        document2.createTextNode(leadingWhitespace),
                        body.childNodes[0] || null,
                    ),
                NAMESPACE === HTML_NAMESPACE
                    ? getElementsByTagName.call(
                          doc,
                          WHOLE_DOCUMENT ? 'html' : 'body',
                      )[0]
                    : WHOLE_DOCUMENT
                    ? doc.documentElement
                    : body
            )
        },
        _createIterator = function (root) {
            return createNodeIterator.call(
                root.ownerDocument || root,
                root,
                NodeFilter.SHOW_ELEMENT |
                    NodeFilter.SHOW_COMMENT |
                    NodeFilter.SHOW_TEXT,
                null,
                !1,
            )
        },
        _isClobbered = function (elm) {
            return (
                elm instanceof HTMLFormElement &&
                (typeof elm.nodeName != 'string' ||
                    typeof elm.textContent != 'string' ||
                    typeof elm.removeChild != 'function' ||
                    !(elm.attributes instanceof NamedNodeMap) ||
                    typeof elm.removeAttribute != 'function' ||
                    typeof elm.setAttribute != 'function' ||
                    typeof elm.namespaceURI != 'string' ||
                    typeof elm.insertBefore != 'function' ||
                    typeof elm.hasChildNodes != 'function')
            )
        },
        _isNode = function (object) {
            return _typeof(Node) === 'object'
                ? object instanceof Node
                : object &&
                      _typeof(object) === 'object' &&
                      typeof object.nodeType == 'number' &&
                      typeof object.nodeName == 'string'
        },
        _executeHook = function (entryPoint, currentNode, data) {
            !hooks[entryPoint] ||
                arrayForEach(hooks[entryPoint], function (hook) {
                    hook.call(DOMPurify, currentNode, data, CONFIG)
                })
        },
        _sanitizeElements = function (currentNode) {
            var content
            if (
                (_executeHook('beforeSanitizeElements', currentNode, null),
                _isClobbered(currentNode) ||
                    regExpTest(/[\u0080-\uFFFF]/, currentNode.nodeName))
            )
                return _forceRemove(currentNode), !0
            var tagName = transformCaseFunc(currentNode.nodeName)
            if (
                (_executeHook('uponSanitizeElement', currentNode, {
                    tagName,
                    allowedTags: ALLOWED_TAGS,
                }),
                (currentNode.hasChildNodes() &&
                    !_isNode(currentNode.firstElementChild) &&
                    (!_isNode(currentNode.content) ||
                        !_isNode(currentNode.content.firstElementChild)) &&
                    regExpTest(/<[/\w]/g, currentNode.innerHTML) &&
                    regExpTest(/<[/\w]/g, currentNode.textContent)) ||
                    (tagName === 'select' &&
                        regExpTest(/<template/i, currentNode.innerHTML)))
            )
                return _forceRemove(currentNode), !0
            if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                if (
                    !FORBID_TAGS[tagName] &&
                    _basicCustomElementTest(tagName) &&
                    ((CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp &&
                        regExpTest(
                            CUSTOM_ELEMENT_HANDLING.tagNameCheck,
                            tagName,
                        )) ||
                        (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof
                            Function &&
                            CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)))
                )
                    return !1
                if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
                    var parentNode =
                            getParentNode(currentNode) ||
                            currentNode.parentNode,
                        childNodes =
                            getChildNodes(currentNode) || currentNode.childNodes
                    if (childNodes && parentNode)
                        for (
                            var childCount = childNodes.length,
                                i = childCount - 1;
                            i >= 0;
                            --i
                        )
                            parentNode.insertBefore(
                                cloneNode(childNodes[i], !0),
                                getNextSibling(currentNode),
                            )
                }
                return _forceRemove(currentNode), !0
            }
            return (currentNode instanceof Element2 &&
                !_checkValidNamespace(currentNode)) ||
                ((tagName === 'noscript' || tagName === 'noembed') &&
                    regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML))
                ? (_forceRemove(currentNode), !0)
                : (SAFE_FOR_TEMPLATES &&
                      currentNode.nodeType === 3 &&
                      ((content = currentNode.textContent),
                      (content = stringReplace(content, MUSTACHE_EXPR$1, ' ')),
                      (content = stringReplace(content, ERB_EXPR$1, ' ')),
                      (content = stringReplace(content, TMPLIT_EXPR$1, ' ')),
                      currentNode.textContent !== content &&
                          (arrayPush(DOMPurify.removed, {
                              element: currentNode.cloneNode(),
                          }),
                          (currentNode.textContent = content))),
                  _executeHook('afterSanitizeElements', currentNode, null),
                  !1)
        },
        _isValidAttribute = function (lcTag, lcName, value) {
            if (
                SANITIZE_DOM &&
                (lcName === 'id' || lcName === 'name') &&
                (value in document2 || value in formElement)
            )
                return !1
            if (
                !(
                    ALLOW_DATA_ATTR &&
                    !FORBID_ATTR[lcName] &&
                    regExpTest(DATA_ATTR$1, lcName)
                )
            ) {
                if (!(ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName))) {
                    if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
                        if (
                            !(
                                (_basicCustomElementTest(lcTag) &&
                                    ((CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof
                                        RegExp &&
                                        regExpTest(
                                            CUSTOM_ELEMENT_HANDLING.tagNameCheck,
                                            lcTag,
                                        )) ||
                                        (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof
                                            Function &&
                                            CUSTOM_ELEMENT_HANDLING.tagNameCheck(
                                                lcTag,
                                            ))) &&
                                    ((CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof
                                        RegExp &&
                                        regExpTest(
                                            CUSTOM_ELEMENT_HANDLING.attributeNameCheck,
                                            lcName,
                                        )) ||
                                        (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof
                                            Function &&
                                            CUSTOM_ELEMENT_HANDLING.attributeNameCheck(
                                                lcName,
                                            )))) ||
                                (lcName === 'is' &&
                                    CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements &&
                                    ((CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof
                                        RegExp &&
                                        regExpTest(
                                            CUSTOM_ELEMENT_HANDLING.tagNameCheck,
                                            value,
                                        )) ||
                                        (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof
                                            Function &&
                                            CUSTOM_ELEMENT_HANDLING.tagNameCheck(
                                                value,
                                            ))))
                            )
                        )
                            return !1
                    } else if (!URI_SAFE_ATTRIBUTES[lcName]) {
                        if (
                            !regExpTest(
                                IS_ALLOWED_URI$1,
                                stringReplace(value, ATTR_WHITESPACE$1, ''),
                            )
                        ) {
                            if (
                                !(
                                    (lcName === 'src' ||
                                        lcName === 'xlink:href' ||
                                        lcName === 'href') &&
                                    lcTag !== 'script' &&
                                    stringIndexOf(value, 'data:') === 0 &&
                                    DATA_URI_TAGS[lcTag]
                                )
                            ) {
                                if (
                                    !(
                                        ALLOW_UNKNOWN_PROTOCOLS &&
                                        !regExpTest(
                                            IS_SCRIPT_OR_DATA$1,
                                            stringReplace(
                                                value,
                                                ATTR_WHITESPACE$1,
                                                '',
                                            ),
                                        )
                                    )
                                ) {
                                    if (value) return !1
                                }
                            }
                        }
                    }
                }
            }
            return !0
        },
        _basicCustomElementTest = function (tagName) {
            return tagName.indexOf('-') > 0
        },
        _sanitizeAttributes = function (currentNode) {
            var attr, value, lcName, l
            _executeHook('beforeSanitizeAttributes', currentNode, null)
            var attributes = currentNode.attributes
            if (!!attributes) {
                var hookEvent = {
                    attrName: '',
                    attrValue: '',
                    keepAttr: !0,
                    allowedAttributes: ALLOWED_ATTR,
                }
                for (l = attributes.length; l--; ) {
                    attr = attributes[l]
                    var _attr = attr,
                        name = _attr.name,
                        namespaceURI = _attr.namespaceURI
                    if (
                        ((value =
                            name === 'value'
                                ? attr.value
                                : stringTrim(attr.value)),
                        (lcName = transformCaseFunc(name)),
                        (hookEvent.attrName = lcName),
                        (hookEvent.attrValue = value),
                        (hookEvent.keepAttr = !0),
                        (hookEvent.forceKeepAttr = void 0),
                        _executeHook(
                            'uponSanitizeAttribute',
                            currentNode,
                            hookEvent,
                        ),
                        (value = hookEvent.attrValue),
                        !hookEvent.forceKeepAttr &&
                            (_removeAttribute(name, currentNode),
                            !!hookEvent.keepAttr))
                    ) {
                        if (
                            !ALLOW_SELF_CLOSE_IN_ATTR &&
                            regExpTest(/\/>/i, value)
                        ) {
                            _removeAttribute(name, currentNode)
                            continue
                        }
                        SAFE_FOR_TEMPLATES &&
                            ((value = stringReplace(
                                value,
                                MUSTACHE_EXPR$1,
                                ' ',
                            )),
                            (value = stringReplace(value, ERB_EXPR$1, ' ')),
                            (value = stringReplace(value, TMPLIT_EXPR$1, ' ')))
                        var lcTag = transformCaseFunc(currentNode.nodeName)
                        if (!!_isValidAttribute(lcTag, lcName, value)) {
                            if (
                                (SANITIZE_NAMED_PROPS &&
                                    (lcName === 'id' || lcName === 'name') &&
                                    (_removeAttribute(name, currentNode),
                                    (value =
                                        SANITIZE_NAMED_PROPS_PREFIX + value)),
                                trustedTypesPolicy &&
                                    _typeof(trustedTypes) === 'object' &&
                                    typeof trustedTypes.getAttributeType ==
                                        'function' &&
                                    !namespaceURI)
                            )
                                switch (
                                    trustedTypes.getAttributeType(lcTag, lcName)
                                ) {
                                    case 'TrustedHTML':
                                        value =
                                            trustedTypesPolicy.createHTML(value)
                                        break
                                    case 'TrustedScriptURL':
                                        value =
                                            trustedTypesPolicy.createScriptURL(
                                                value,
                                            )
                                        break
                                }
                            try {
                                namespaceURI
                                    ? currentNode.setAttributeNS(
                                          namespaceURI,
                                          name,
                                          value,
                                      )
                                    : currentNode.setAttribute(name, value),
                                    arrayPop(DOMPurify.removed)
                            } catch (_) {}
                        }
                    }
                }
                _executeHook('afterSanitizeAttributes', currentNode, null)
            }
        },
        _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
            var shadowNode,
                shadowIterator = _createIterator(fragment)
            for (
                _executeHook('beforeSanitizeShadowDOM', fragment, null);
                (shadowNode = shadowIterator.nextNode());

            )
                _executeHook('uponSanitizeShadowNode', shadowNode, null),
                    !_sanitizeElements(shadowNode) &&
                        (shadowNode.content instanceof DocumentFragment &&
                            _sanitizeShadowDOM2(shadowNode.content),
                        _sanitizeAttributes(shadowNode))
            _executeHook('afterSanitizeShadowDOM', fragment, null)
        }
    return (
        (DOMPurify.sanitize = function (dirty) {
            var cfg =
                    arguments.length > 1 && arguments[1] !== void 0
                        ? arguments[1]
                        : {},
                body,
                importedNode,
                currentNode,
                oldNode,
                returnNode
            if (
                ((IS_EMPTY_INPUT = !dirty),
                IS_EMPTY_INPUT && (dirty = '<!-->'),
                typeof dirty != 'string' && !_isNode(dirty))
            ) {
                if (typeof dirty.toString != 'function')
                    throw typeErrorCreate('toString is not a function')
                if (((dirty = dirty.toString()), typeof dirty != 'string'))
                    throw typeErrorCreate('dirty is not a string, aborting')
            }
            if (!DOMPurify.isSupported) {
                if (
                    _typeof(window2.toStaticHTML) === 'object' ||
                    typeof window2.toStaticHTML == 'function'
                ) {
                    if (typeof dirty == 'string')
                        return window2.toStaticHTML(dirty)
                    if (_isNode(dirty))
                        return window2.toStaticHTML(dirty.outerHTML)
                }
                return dirty
            }
            if (
                (SET_CONFIG || _parseConfig(cfg),
                (DOMPurify.removed = []),
                typeof dirty == 'string' && (IN_PLACE = !1),
                IN_PLACE)
            ) {
                if (dirty.nodeName) {
                    var tagName = transformCaseFunc(dirty.nodeName)
                    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])
                        throw typeErrorCreate(
                            'root node is forbidden and cannot be sanitized in-place',
                        )
                }
            } else if (dirty instanceof Node)
                (body = _initDocument('<!---->')),
                    (importedNode = body.ownerDocument.importNode(dirty, !0)),
                    (importedNode.nodeType === 1 &&
                        importedNode.nodeName === 'BODY') ||
                    importedNode.nodeName === 'HTML'
                        ? (body = importedNode)
                        : body.appendChild(importedNode)
            else {
                if (
                    !RETURN_DOM &&
                    !SAFE_FOR_TEMPLATES &&
                    !WHOLE_DOCUMENT &&
                    dirty.indexOf('<') === -1
                )
                    return trustedTypesPolicy && RETURN_TRUSTED_TYPE
                        ? trustedTypesPolicy.createHTML(dirty)
                        : dirty
                if (((body = _initDocument(dirty)), !body))
                    return RETURN_DOM
                        ? null
                        : RETURN_TRUSTED_TYPE
                        ? emptyHTML
                        : ''
            }
            body && FORCE_BODY && _forceRemove(body.firstChild)
            for (
                var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
                (currentNode = nodeIterator.nextNode());

            )
                (currentNode.nodeType === 3 && currentNode === oldNode) ||
                    _sanitizeElements(currentNode) ||
                    (currentNode.content instanceof DocumentFragment &&
                        _sanitizeShadowDOM(currentNode.content),
                    _sanitizeAttributes(currentNode),
                    (oldNode = currentNode))
            if (((oldNode = null), IN_PLACE)) return dirty
            if (RETURN_DOM) {
                if (RETURN_DOM_FRAGMENT)
                    for (
                        returnNode = createDocumentFragment.call(
                            body.ownerDocument,
                        );
                        body.firstChild;

                    )
                        returnNode.appendChild(body.firstChild)
                else returnNode = body
                return (
                    (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmod) &&
                        (returnNode = importNode.call(
                            originalDocument,
                            returnNode,
                            !0,
                        )),
                    returnNode
                )
            }
            var serializedHTML = WHOLE_DOCUMENT
                ? body.outerHTML
                : body.innerHTML
            return (
                WHOLE_DOCUMENT &&
                    ALLOWED_TAGS['!doctype'] &&
                    body.ownerDocument &&
                    body.ownerDocument.doctype &&
                    body.ownerDocument.doctype.name &&
                    regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name) &&
                    (serializedHTML =
                        '<!DOCTYPE ' +
                        body.ownerDocument.doctype.name +
                        `>
` +
                        serializedHTML),
                SAFE_FOR_TEMPLATES &&
                    ((serializedHTML = stringReplace(
                        serializedHTML,
                        MUSTACHE_EXPR$1,
                        ' ',
                    )),
                    (serializedHTML = stringReplace(
                        serializedHTML,
                        ERB_EXPR$1,
                        ' ',
                    )),
                    (serializedHTML = stringReplace(
                        serializedHTML,
                        TMPLIT_EXPR$1,
                        ' ',
                    ))),
                trustedTypesPolicy && RETURN_TRUSTED_TYPE
                    ? trustedTypesPolicy.createHTML(serializedHTML)
                    : serializedHTML
            )
        }),
        (DOMPurify.setConfig = function (cfg) {
            _parseConfig(cfg), (SET_CONFIG = !0)
        }),
        (DOMPurify.clearConfig = function () {
            ;(CONFIG = null), (SET_CONFIG = !1)
        }),
        (DOMPurify.isValidAttribute = function (tag, attr, value) {
            CONFIG || _parseConfig({})
            var lcTag = transformCaseFunc(tag),
                lcName = transformCaseFunc(attr)
            return _isValidAttribute(lcTag, lcName, value)
        }),
        (DOMPurify.addHook = function (entryPoint, hookFunction) {
            typeof hookFunction == 'function' &&
                ((hooks[entryPoint] = hooks[entryPoint] || []),
                arrayPush(hooks[entryPoint], hookFunction))
        }),
        (DOMPurify.removeHook = function (entryPoint) {
            if (hooks[entryPoint]) return arrayPop(hooks[entryPoint])
        }),
        (DOMPurify.removeHooks = function (entryPoint) {
            hooks[entryPoint] && (hooks[entryPoint] = [])
        }),
        (DOMPurify.removeAllHooks = function () {
            hooks = {}
        }),
        DOMPurify
    )
}
var purify = createDOMPurify()
function getDefaults() {
    return {
        async: !1,
        baseUrl: null,
        breaks: !1,
        extensions: null,
        gfm: !0,
        headerIds: !0,
        headerPrefix: '',
        highlight: null,
        langPrefix: 'language-',
        mangle: !0,
        pedantic: !1,
        renderer: null,
        sanitize: !1,
        sanitizer: null,
        silent: !1,
        smartypants: !1,
        tokenizer: null,
        walkTokens: null,
        xhtml: !1,
    }
}
var defaults = getDefaults()
function changeDefaults(newDefaults) {
    defaults = newDefaults
}
var escapeTest = /[&<>"']/,
    escapeReplace = new RegExp(escapeTest.source, 'g'),
    escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
    escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g'),
    escapeReplacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    },
    getEscapeReplacement = (ch) => escapeReplacements[ch]
function escape(html2, encode) {
    if (encode) {
        if (escapeTest.test(html2))
            return html2.replace(escapeReplace, getEscapeReplacement)
    } else if (escapeTestNoEncode.test(html2))
        return html2.replace(escapeReplaceNoEncode, getEscapeReplacement)
    return html2
}
var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi
function unescape(html2) {
    return html2.replace(
        unescapeTest,
        (_, n2) => (
            (n2 = n2.toLowerCase()),
            n2 === 'colon'
                ? ':'
                : n2.charAt(0) === '#'
                ? n2.charAt(1) === 'x'
                    ? String.fromCharCode(parseInt(n2.substring(2), 16))
                    : String.fromCharCode(+n2.substring(1))
                : ''
        ),
    )
}
var caret = /(^|[^\[])\^/g
function edit(regex, opt) {
    ;(regex = typeof regex == 'string' ? regex : regex.source),
        (opt = opt || '')
    let obj = {
        replace: (name, val) => (
            (val = val.source || val),
            (val = val.replace(caret, '$1')),
            (regex = regex.replace(name, val)),
            obj
        ),
        getRegex: () => new RegExp(regex, opt),
    }
    return obj
}
var nonWordAndColonTest = /[^\w:]/g,
    originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i
function cleanUrl(sanitize, base, href) {
    if (sanitize) {
        let prot
        try {
            prot = decodeURIComponent(unescape(href))
                .replace(nonWordAndColonTest, '')
                .toLowerCase()
        } catch (e2) {
            return null
        }
        if (
            prot.indexOf('javascript:') === 0 ||
            prot.indexOf('vbscript:') === 0 ||
            prot.indexOf('data:') === 0
        )
            return null
    }
    base && !originIndependentUrl.test(href) && (href = resolveUrl(base, href))
    try {
        href = encodeURI(href).replace(/%25/g, '%')
    } catch (e2) {
        return null
    }
    return href
}
var baseUrls = {},
    justDomain = /^[^:]+:\/*[^/]*$/,
    protocol = /^([^:]+:)[\s\S]*$/,
    domain = /^([^:]+:\/*[^/]*)[\s\S]*$/
function resolveUrl(base, href) {
    baseUrls[' ' + base] ||
        (justDomain.test(base)
            ? (baseUrls[' ' + base] = base + '/')
            : (baseUrls[' ' + base] = rtrim(base, '/', !0))),
        (base = baseUrls[' ' + base])
    let relativeBase = base.indexOf(':') === -1
    return href.substring(0, 2) === '//'
        ? relativeBase
            ? href
            : base.replace(protocol, '$1') + href
        : href.charAt(0) === '/'
        ? relativeBase
            ? href
            : base.replace(domain, '$1') + href
        : base + href
}
var noopTest = { exec: function () {} }
function merge(obj) {
    let i = 1,
        target,
        key
    for (; i < arguments.length; i++) {
        target = arguments[i]
        for (key in target)
            Object.prototype.hasOwnProperty.call(target, key) &&
                (obj[key] = target[key])
    }
    return obj
}
function splitCells(tableRow, count) {
    let row = tableRow.replace(/\|/g, (match, offset, str) => {
            let escaped = !1,
                curr = offset
            for (; --curr >= 0 && str[curr] === '\\'; ) escaped = !escaped
            return escaped ? '|' : ' |'
        }),
        cells = row.split(/ \|/),
        i = 0
    if (
        (cells[0].trim() || cells.shift(),
        cells.length > 0 && !cells[cells.length - 1].trim() && cells.pop(),
        cells.length > count)
    )
        cells.splice(count)
    else for (; cells.length < count; ) cells.push('')
    for (; i < cells.length; i++)
        cells[i] = cells[i].trim().replace(/\\\|/g, '|')
    return cells
}
function rtrim(str, c2, invert) {
    let l = str.length
    if (l === 0) return ''
    let suffLen = 0
    for (; suffLen < l; ) {
        let currChar = str.charAt(l - suffLen - 1)
        if (currChar === c2 && !invert) suffLen++
        else if (currChar !== c2 && invert) suffLen++
        else break
    }
    return str.slice(0, l - suffLen)
}
function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) return -1
    let l = str.length,
        level = 0,
        i = 0
    for (; i < l; i++)
        if (str[i] === '\\') i++
        else if (str[i] === b[0]) level++
        else if (str[i] === b[1] && (level--, level < 0)) return i
    return -1
}
function checkSanitizeDeprecation(opt) {
    opt &&
        opt.sanitize &&
        !opt.silent &&
        console.warn(
            'marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options',
        )
}
function repeatString(pattern, count) {
    if (count < 1) return ''
    let result = ''
    for (; count > 1; )
        count & 1 && (result += pattern), (count >>= 1), (pattern += pattern)
    return result + pattern
}
function outputLink(cap, link, raw, lexer2) {
    let href = link.href,
        title = link.title ? escape(link.title) : null,
        text2 = cap[1].replace(/\\([\[\]])/g, '$1')
    if (cap[0].charAt(0) !== '!') {
        lexer2.state.inLink = !0
        let token = {
            type: 'link',
            raw,
            href,
            title,
            text: text2,
            tokens: lexer2.inlineTokens(text2),
        }
        return (lexer2.state.inLink = !1), token
    }
    return { type: 'image', raw, href, title, text: escape(text2) }
}
function indentCodeCompensation(raw, text2) {
    let matchIndentToCode = raw.match(/^(\s+)(?:```)/)
    if (matchIndentToCode === null) return text2
    let indentToCode = matchIndentToCode[1]
    return text2
        .split(
            `
`,
        )
        .map((node) => {
            let matchIndentInNode = node.match(/^\s+/)
            if (matchIndentInNode === null) return node
            let [indentInNode] = matchIndentInNode
            return indentInNode.length >= indentToCode.length
                ? node.slice(indentToCode.length)
                : node
        }).join(`
`)
}
var Tokenizer = class {
        constructor(options2) {
            this.options = options2 || defaults
        }
        space(src) {
            let cap = this.rules.block.newline.exec(src)
            if (cap && cap[0].length > 0) return { type: 'space', raw: cap[0] }
        }
        code(src) {
            let cap = this.rules.block.code.exec(src)
            if (cap) {
                let text2 = cap[0].replace(/^ {1,4}/gm, '')
                return {
                    type: 'code',
                    raw: cap[0],
                    codeBlockStyle: 'indented',
                    text: this.options.pedantic
                        ? text2
                        : rtrim(
                              text2,
                              `
`,
                          ),
                }
            }
        }
        fences(src) {
            let cap = this.rules.block.fences.exec(src)
            if (cap) {
                let raw = cap[0],
                    text2 = indentCodeCompensation(raw, cap[3] || '')
                return {
                    type: 'code',
                    raw,
                    lang: cap[2]
                        ? cap[2]
                              .trim()
                              .replace(this.rules.inline._escapes, '$1')
                        : cap[2],
                    text: text2,
                }
            }
        }
        heading(src) {
            let cap = this.rules.block.heading.exec(src)
            if (cap) {
                let text2 = cap[2].trim()
                if (/#$/.test(text2)) {
                    let trimmed = rtrim(text2, '#')
                    ;(this.options.pedantic ||
                        !trimmed ||
                        / $/.test(trimmed)) &&
                        (text2 = trimmed.trim())
                }
                return {
                    type: 'heading',
                    raw: cap[0],
                    depth: cap[1].length,
                    text: text2,
                    tokens: this.lexer.inline(text2),
                }
            }
        }
        hr(src) {
            let cap = this.rules.block.hr.exec(src)
            if (cap) return { type: 'hr', raw: cap[0] }
        }
        blockquote(src) {
            let cap = this.rules.block.blockquote.exec(src)
            if (cap) {
                let text2 = cap[0].replace(/^ *>[ \t]?/gm, ''),
                    top = this.lexer.state.top
                this.lexer.state.top = !0
                let tokens = this.lexer.blockTokens(text2)
                return (
                    (this.lexer.state.top = top),
                    { type: 'blockquote', raw: cap[0], tokens, text: text2 }
                )
            }
        }
        list(src) {
            let cap = this.rules.block.list.exec(src)
            if (cap) {
                let raw,
                    istask,
                    ischecked,
                    indent,
                    i,
                    blankLine,
                    endsWithBlankLine,
                    line,
                    nextLine,
                    rawLine,
                    itemContents,
                    endEarly,
                    bull = cap[1].trim(),
                    isordered = bull.length > 1,
                    list = {
                        type: 'list',
                        raw: '',
                        ordered: isordered,
                        start: isordered ? +bull.slice(0, -1) : '',
                        loose: !1,
                        items: [],
                    }
                ;(bull = isordered
                    ? `\\d{1,9}\\${bull.slice(-1)}`
                    : `\\${bull}`),
                    this.options.pedantic && (bull = isordered ? bull : '[*+-]')
                let itemRegex = new RegExp(
                    `^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`,
                )
                for (
                    ;
                    src &&
                    ((endEarly = !1),
                    !(
                        !(cap = itemRegex.exec(src)) ||
                        this.rules.block.hr.test(src)
                    ));

                ) {
                    if (
                        ((raw = cap[0]),
                        (src = src.substring(raw.length)),
                        (line = cap[2]
                            .split(
                                `
`,
                                1,
                            )[0]
                            .replace(/^\t+/, (t2) =>
                                ' '.repeat(3 * t2.length),
                            )),
                        (nextLine = src.split(
                            `
`,
                            1,
                        )[0]),
                        this.options.pedantic
                            ? ((indent = 2), (itemContents = line.trimLeft()))
                            : ((indent = cap[2].search(/[^ ]/)),
                              (indent = indent > 4 ? 1 : indent),
                              (itemContents = line.slice(indent)),
                              (indent += cap[1].length)),
                        (blankLine = !1),
                        !line &&
                            /^ *$/.test(nextLine) &&
                            ((raw +=
                                nextLine +
                                `
`),
                            (src = src.substring(nextLine.length + 1)),
                            (endEarly = !0)),
                        !endEarly)
                    ) {
                        let nextBulletRegex = new RegExp(
                                `^ {0,${Math.min(
                                    3,
                                    indent - 1,
                                )}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`,
                            ),
                            hrRegex = new RegExp(
                                `^ {0,${Math.min(
                                    3,
                                    indent - 1,
                                )}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`,
                            ),
                            fencesBeginRegex = new RegExp(
                                `^ {0,${Math.min(
                                    3,
                                    indent - 1,
                                )}}(?:\`\`\`|~~~)`,
                            ),
                            headingBeginRegex = new RegExp(
                                `^ {0,${Math.min(3, indent - 1)}}#`,
                            )
                        for (
                            ;
                            src &&
                            ((rawLine = src.split(
                                `
`,
                                1,
                            )[0]),
                            (nextLine = rawLine),
                            this.options.pedantic &&
                                (nextLine = nextLine.replace(
                                    /^ {1,4}(?=( {4})*[^ ])/g,
                                    '  ',
                                )),
                            !(
                                fencesBeginRegex.test(nextLine) ||
                                headingBeginRegex.test(nextLine) ||
                                nextBulletRegex.test(nextLine) ||
                                hrRegex.test(src)
                            ));

                        ) {
                            if (
                                nextLine.search(/[^ ]/) >= indent ||
                                !nextLine.trim()
                            )
                                itemContents +=
                                    `
` + nextLine.slice(indent)
                            else {
                                if (
                                    blankLine ||
                                    line.search(/[^ ]/) >= 4 ||
                                    fencesBeginRegex.test(line) ||
                                    headingBeginRegex.test(line) ||
                                    hrRegex.test(line)
                                )
                                    break
                                itemContents +=
                                    `
` + nextLine
                            }
                            !blankLine && !nextLine.trim() && (blankLine = !0),
                                (raw +=
                                    rawLine +
                                    `
`),
                                (src = src.substring(rawLine.length + 1)),
                                (line = nextLine.slice(indent))
                        }
                    }
                    list.loose ||
                        (endsWithBlankLine
                            ? (list.loose = !0)
                            : /\n *\n *$/.test(raw) &&
                              (endsWithBlankLine = !0)),
                        this.options.gfm &&
                            ((istask = /^\[[ xX]\] /.exec(itemContents)),
                            istask &&
                                ((ischecked = istask[0] !== '[ ] '),
                                (itemContents = itemContents.replace(
                                    /^\[[ xX]\] +/,
                                    '',
                                )))),
                        list.items.push({
                            type: 'list_item',
                            raw,
                            task: !!istask,
                            checked: ischecked,
                            loose: !1,
                            text: itemContents,
                        }),
                        (list.raw += raw)
                }
                ;(list.items[list.items.length - 1].raw = raw.trimRight()),
                    (list.items[list.items.length - 1].text =
                        itemContents.trimRight()),
                    (list.raw = list.raw.trimRight())
                let l = list.items.length
                for (i = 0; i < l; i++)
                    if (
                        ((this.lexer.state.top = !1),
                        (list.items[i].tokens = this.lexer.blockTokens(
                            list.items[i].text,
                            [],
                        )),
                        !list.loose)
                    ) {
                        let spacers = list.items[i].tokens.filter(
                                (t2) => t2.type === 'space',
                            ),
                            hasMultipleLineBreaks =
                                spacers.length > 0 &&
                                spacers.some((t2) => /\n.*\n/.test(t2.raw))
                        list.loose = hasMultipleLineBreaks
                    }
                if (list.loose) for (i = 0; i < l; i++) list.items[i].loose = !0
                return list
            }
        }
        html(src) {
            let cap = this.rules.block.html.exec(src)
            if (cap) {
                let token = {
                    type: 'html',
                    raw: cap[0],
                    pre:
                        !this.options.sanitizer &&
                        (cap[1] === 'pre' ||
                            cap[1] === 'script' ||
                            cap[1] === 'style'),
                    text: cap[0],
                }
                if (this.options.sanitize) {
                    let text2 = this.options.sanitizer
                        ? this.options.sanitizer(cap[0])
                        : escape(cap[0])
                    ;(token.type = 'paragraph'),
                        (token.text = text2),
                        (token.tokens = this.lexer.inline(text2))
                }
                return token
            }
        }
        def(src) {
            let cap = this.rules.block.def.exec(src)
            if (cap) {
                let tag = cap[1].toLowerCase().replace(/\s+/g, ' '),
                    href = cap[2]
                        ? cap[2]
                              .replace(/^<(.*)>$/, '$1')
                              .replace(this.rules.inline._escapes, '$1')
                        : '',
                    title = cap[3]
                        ? cap[3]
                              .substring(1, cap[3].length - 1)
                              .replace(this.rules.inline._escapes, '$1')
                        : cap[3]
                return { type: 'def', tag, raw: cap[0], href, title }
            }
        }
        table(src) {
            let cap = this.rules.block.table.exec(src)
            if (cap) {
                let item = {
                    type: 'table',
                    header: splitCells(cap[1]).map((c2) => ({ text: c2 })),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    rows:
                        cap[3] && cap[3].trim()
                            ? cap[3].replace(/\n[ \t]*$/, '').split(`
`)
                            : [],
                }
                if (item.header.length === item.align.length) {
                    item.raw = cap[0]
                    let l = item.align.length,
                        i,
                        j,
                        k,
                        row
                    for (i = 0; i < l; i++)
                        /^ *-+: *$/.test(item.align[i])
                            ? (item.align[i] = 'right')
                            : /^ *:-+: *$/.test(item.align[i])
                            ? (item.align[i] = 'center')
                            : /^ *:-+ *$/.test(item.align[i])
                            ? (item.align[i] = 'left')
                            : (item.align[i] = null)
                    for (l = item.rows.length, i = 0; i < l; i++)
                        item.rows[i] = splitCells(
                            item.rows[i],
                            item.header.length,
                        ).map((c2) => ({ text: c2 }))
                    for (l = item.header.length, j = 0; j < l; j++)
                        item.header[j].tokens = this.lexer.inline(
                            item.header[j].text,
                        )
                    for (l = item.rows.length, j = 0; j < l; j++)
                        for (row = item.rows[j], k = 0; k < row.length; k++)
                            row[k].tokens = this.lexer.inline(row[k].text)
                    return item
                }
            }
        }
        lheading(src) {
            let cap = this.rules.block.lheading.exec(src)
            if (cap)
                return {
                    type: 'heading',
                    raw: cap[0],
                    depth: cap[2].charAt(0) === '=' ? 1 : 2,
                    text: cap[1],
                    tokens: this.lexer.inline(cap[1]),
                }
        }
        paragraph(src) {
            let cap = this.rules.block.paragraph.exec(src)
            if (cap) {
                let text2 =
                    cap[1].charAt(cap[1].length - 1) ===
                    `
`
                        ? cap[1].slice(0, -1)
                        : cap[1]
                return {
                    type: 'paragraph',
                    raw: cap[0],
                    text: text2,
                    tokens: this.lexer.inline(text2),
                }
            }
        }
        text(src) {
            let cap = this.rules.block.text.exec(src)
            if (cap)
                return {
                    type: 'text',
                    raw: cap[0],
                    text: cap[0],
                    tokens: this.lexer.inline(cap[0]),
                }
        }
        escape(src) {
            let cap = this.rules.inline.escape.exec(src)
            if (cap)
                return { type: 'escape', raw: cap[0], text: escape(cap[1]) }
        }
        tag(src) {
            let cap = this.rules.inline.tag.exec(src)
            if (cap)
                return (
                    !this.lexer.state.inLink && /^<a /i.test(cap[0])
                        ? (this.lexer.state.inLink = !0)
                        : this.lexer.state.inLink &&
                          /^<\/a>/i.test(cap[0]) &&
                          (this.lexer.state.inLink = !1),
                    !this.lexer.state.inRawBlock &&
                    /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])
                        ? (this.lexer.state.inRawBlock = !0)
                        : this.lexer.state.inRawBlock &&
                          /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0]) &&
                          (this.lexer.state.inRawBlock = !1),
                    {
                        type: this.options.sanitize ? 'text' : 'html',
                        raw: cap[0],
                        inLink: this.lexer.state.inLink,
                        inRawBlock: this.lexer.state.inRawBlock,
                        text: this.options.sanitize
                            ? this.options.sanitizer
                                ? this.options.sanitizer(cap[0])
                                : escape(cap[0])
                            : cap[0],
                    }
                )
        }
        link(src) {
            let cap = this.rules.inline.link.exec(src)
            if (cap) {
                let trimmedUrl = cap[2].trim()
                if (!this.options.pedantic && /^</.test(trimmedUrl)) {
                    if (!/>$/.test(trimmedUrl)) return
                    let rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\')
                    if ((trimmedUrl.length - rtrimSlash.length) % 2 == 0) return
                } else {
                    let lastParenIndex = findClosingBracket(cap[2], '()')
                    if (lastParenIndex > -1) {
                        let linkLen =
                            (cap[0].indexOf('!') === 0 ? 5 : 4) +
                            cap[1].length +
                            lastParenIndex
                        ;(cap[2] = cap[2].substring(0, lastParenIndex)),
                            (cap[0] = cap[0].substring(0, linkLen).trim()),
                            (cap[3] = '')
                    }
                }
                let href = cap[2],
                    title = ''
                if (this.options.pedantic) {
                    let link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href)
                    link && ((href = link[1]), (title = link[3]))
                } else title = cap[3] ? cap[3].slice(1, -1) : ''
                return (
                    (href = href.trim()),
                    /^</.test(href) &&
                        (this.options.pedantic && !/>$/.test(trimmedUrl)
                            ? (href = href.slice(1))
                            : (href = href.slice(1, -1))),
                    outputLink(
                        cap,
                        {
                            href:
                                href &&
                                href.replace(this.rules.inline._escapes, '$1'),
                            title:
                                title &&
                                title.replace(this.rules.inline._escapes, '$1'),
                        },
                        cap[0],
                        this.lexer,
                    )
                )
            }
        }
        reflink(src, links) {
            let cap
            if (
                (cap = this.rules.inline.reflink.exec(src)) ||
                (cap = this.rules.inline.nolink.exec(src))
            ) {
                let link = (cap[2] || cap[1]).replace(/\s+/g, ' ')
                if (((link = links[link.toLowerCase()]), !link)) {
                    let text2 = cap[0].charAt(0)
                    return { type: 'text', raw: text2, text: text2 }
                }
                return outputLink(cap, link, cap[0], this.lexer)
            }
        }
        emStrong(src, maskedSrc, prevChar = '') {
            let match = this.rules.inline.emStrong.lDelim.exec(src)
            if (!match || (match[3] && prevChar.match(/[\p{L}\p{N}]/u))) return
            let nextChar = match[1] || match[2] || ''
            if (
                !nextChar ||
                (nextChar &&
                    (prevChar === '' ||
                        this.rules.inline.punctuation.exec(prevChar)))
            ) {
                let lLength = match[0].length - 1,
                    rDelim,
                    rLength,
                    delimTotal = lLength,
                    midDelimTotal = 0,
                    endReg =
                        match[0][0] === '*'
                            ? this.rules.inline.emStrong.rDelimAst
                            : this.rules.inline.emStrong.rDelimUnd
                for (
                    endReg.lastIndex = 0,
                        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
                    (match = endReg.exec(maskedSrc)) != null;

                ) {
                    if (
                        ((rDelim =
                            match[1] ||
                            match[2] ||
                            match[3] ||
                            match[4] ||
                            match[5] ||
                            match[6]),
                        !rDelim)
                    )
                        continue
                    if (((rLength = rDelim.length), match[3] || match[4])) {
                        delimTotal += rLength
                        continue
                    } else if (
                        (match[5] || match[6]) &&
                        lLength % 3 &&
                        !((lLength + rLength) % 3)
                    ) {
                        midDelimTotal += rLength
                        continue
                    }
                    if (((delimTotal -= rLength), delimTotal > 0)) continue
                    rLength = Math.min(
                        rLength,
                        rLength + delimTotal + midDelimTotal,
                    )
                    let raw = src.slice(
                        0,
                        lLength +
                            match.index +
                            (match[0].length - rDelim.length) +
                            rLength,
                    )
                    if (Math.min(lLength, rLength) % 2) {
                        let text3 = raw.slice(1, -1)
                        return {
                            type: 'em',
                            raw,
                            text: text3,
                            tokens: this.lexer.inlineTokens(text3),
                        }
                    }
                    let text2 = raw.slice(2, -2)
                    return {
                        type: 'strong',
                        raw,
                        text: text2,
                        tokens: this.lexer.inlineTokens(text2),
                    }
                }
            }
        }
        codespan(src) {
            let cap = this.rules.inline.code.exec(src)
            if (cap) {
                let text2 = cap[2].replace(/\n/g, ' '),
                    hasNonSpaceChars = /[^ ]/.test(text2),
                    hasSpaceCharsOnBothEnds =
                        /^ /.test(text2) && / $/.test(text2)
                return (
                    hasNonSpaceChars &&
                        hasSpaceCharsOnBothEnds &&
                        (text2 = text2.substring(1, text2.length - 1)),
                    (text2 = escape(text2, !0)),
                    { type: 'codespan', raw: cap[0], text: text2 }
                )
            }
        }
        br(src) {
            let cap = this.rules.inline.br.exec(src)
            if (cap) return { type: 'br', raw: cap[0] }
        }
        del(src) {
            let cap = this.rules.inline.del.exec(src)
            if (cap)
                return {
                    type: 'del',
                    raw: cap[0],
                    text: cap[2],
                    tokens: this.lexer.inlineTokens(cap[2]),
                }
        }
        autolink(src, mangle2) {
            let cap = this.rules.inline.autolink.exec(src)
            if (cap) {
                let text2, href
                return (
                    cap[2] === '@'
                        ? ((text2 = escape(
                              this.options.mangle ? mangle2(cap[1]) : cap[1],
                          )),
                          (href = 'mailto:' + text2))
                        : ((text2 = escape(cap[1])), (href = text2)),
                    {
                        type: 'link',
                        raw: cap[0],
                        text: text2,
                        href,
                        tokens: [{ type: 'text', raw: text2, text: text2 }],
                    }
                )
            }
        }
        url(src, mangle2) {
            let cap
            if ((cap = this.rules.inline.url.exec(src))) {
                let text2, href
                if (cap[2] === '@')
                    (text2 = escape(
                        this.options.mangle ? mangle2(cap[0]) : cap[0],
                    )),
                        (href = 'mailto:' + text2)
                else {
                    let prevCapZero
                    do
                        (prevCapZero = cap[0]),
                            (cap[0] = this.rules.inline._backpedal.exec(
                                cap[0],
                            )[0])
                    while (prevCapZero !== cap[0])
                    ;(text2 = escape(cap[0])),
                        cap[1] === 'www.'
                            ? (href = 'http://' + cap[0])
                            : (href = cap[0])
                }
                return {
                    type: 'link',
                    raw: cap[0],
                    text: text2,
                    href,
                    tokens: [{ type: 'text', raw: text2, text: text2 }],
                }
            }
        }
        inlineText(src, smartypants2) {
            let cap = this.rules.inline.text.exec(src)
            if (cap) {
                let text2
                return (
                    this.lexer.state.inRawBlock
                        ? (text2 = this.options.sanitize
                              ? this.options.sanitizer
                                  ? this.options.sanitizer(cap[0])
                                  : escape(cap[0])
                              : cap[0])
                        : (text2 = escape(
                              this.options.smartypants
                                  ? smartypants2(cap[0])
                                  : cap[0],
                          )),
                    { type: 'text', raw: cap[0], text: text2 }
                )
            }
        }
    },
    block = {
        newline: /^(?: *(?:\n|$))+/,
        code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
        fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
        hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
        list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
        html: '^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))',
        def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
        table: noopTest,
        lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        _paragraph:
            /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
        text: /^[^\n]+/,
    }
block._label = /(?!\s*\])(?:\\.|[^\[\]\\])+/
block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/
block.def = edit(block.def)
    .replace('label', block._label)
    .replace('title', block._title)
    .getRegex()
block.bullet = /(?:[*+-]|\d{1,9}[.)])/
block.listItemStart = edit(/^( *)(bull) */)
    .replace('bull', block.bullet)
    .getRegex()
block.list = edit(block.list)
    .replace(/bull/g, block.bullet)
    .replace(
        'hr',
        '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))',
    )
    .replace('def', '\\n+(?=' + block.def.source + ')')
    .getRegex()
block._tag =
    'address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul'
block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/
block.html = edit(block.html, 'i')
    .replace('comment', block._comment)
    .replace('tag', block._tag)
    .replace(
        'attribute',
        / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/,
    )
    .getRegex()
block.paragraph = edit(block._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' {0,3}#{1,6} ')
    .replace('|lheading', '')
    .replace('|table', '')
    .replace('blockquote', ' {0,3}>')
    .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
    .replace(
        'html',
        '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)',
    )
    .replace('tag', block._tag)
    .getRegex()
block.blockquote = edit(block.blockquote)
    .replace('paragraph', block.paragraph)
    .getRegex()
block.normal = merge({}, block)
block.gfm = merge({}, block.normal, {
    table: '^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
})
block.gfm.table = edit(block.gfm.table)
    .replace('hr', block.hr)
    .replace('heading', ' {0,3}#{1,6} ')
    .replace('blockquote', ' {0,3}>')
    .replace('code', ' {4}[^\\n]')
    .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
    .replace(
        'html',
        '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)',
    )
    .replace('tag', block._tag)
    .getRegex()
block.gfm.paragraph = edit(block._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' {0,3}#{1,6} ')
    .replace('|lheading', '')
    .replace('table', block.gfm.table)
    .replace('blockquote', ' {0,3}>')
    .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
    .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
    .replace(
        'html',
        '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)',
    )
    .replace('tag', block._tag)
    .getRegex()
block.pedantic = merge({}, block.normal, {
    html: edit(
        `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`,
    )
        .replace('comment', block._comment)
        .replace(
            /tag/g,
            '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b',
        )
        .getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    paragraph: edit(block.normal._paragraph)
        .replace('hr', block.hr)
        .replace(
            'heading',
            ` *#{1,6} *[^
]`,
        )
        .replace('lheading', block.lheading)
        .replace('blockquote', ' {0,3}>')
        .replace('|fences', '')
        .replace('|list', '')
        .replace('|html', '')
        .getRegex(),
})
var inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noopTest,
    tag: '^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(ref)\]/,
    nolink: /^!?\[(ref)\](?:\[\])?/,
    reflinkSearch: 'reflink|nolink(?!\\()',
    emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        rDelimAst:
            /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
        rDelimUnd:
            /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/,
    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noopTest,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\spunctuation])/,
}
inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~'
inline.punctuation = edit(inline.punctuation)
    .replace(/punctuation/g, inline._punctuation)
    .getRegex()
inline.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g
inline.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g
inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex()
inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
    .replace(/punct/g, inline._punctuation)
    .getRegex()
inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
    .replace(/punct/g, inline._punctuation)
    .getRegex()
inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
    .replace(/punct/g, inline._punctuation)
    .getRegex()
inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g
inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/
inline._email =
    /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
inline.autolink = edit(inline.autolink)
    .replace('scheme', inline._scheme)
    .replace('email', inline._email)
    .getRegex()
inline._attribute =
    /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/
inline.tag = edit(inline.tag)
    .replace('comment', inline._comment)
    .replace('attribute', inline._attribute)
    .getRegex()
inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/
inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/
inline.link = edit(inline.link)
    .replace('label', inline._label)
    .replace('href', inline._href)
    .replace('title', inline._title)
    .getRegex()
inline.reflink = edit(inline.reflink)
    .replace('label', inline._label)
    .replace('ref', block._label)
    .getRegex()
inline.nolink = edit(inline.nolink).replace('ref', block._label).getRegex()
inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
    .replace('reflink', inline.reflink)
    .replace('nolink', inline.nolink)
    .getRegex()
inline.normal = merge({}, inline)
inline.pedantic = merge({}, inline.normal, {
    strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g,
    },
    em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g,
    },
    link: edit(/^!?\[(label)\]\((.*?)\)/)
        .replace('label', inline._label)
        .getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
        .replace('label', inline._label)
        .getRegex(),
})
inline.gfm = merge({}, inline.normal, {
    escape: edit(inline.escape).replace('])', '~|])').getRegex(),
    _extended_email:
        /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal:
        /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
})
inline.gfm.url = edit(inline.gfm.url, 'i')
    .replace('email', inline.gfm._extended_email)
    .getRegex()
inline.breaks = merge({}, inline.gfm, {
    br: edit(inline.br).replace('{2,}', '*').getRegex(),
    text: edit(inline.gfm.text)
        .replace('\\b_', '\\b_| {2,}\\n')
        .replace(/\{2,\}/g, '*')
        .getRegex(),
})
function smartypants(text2) {
    return text2
        .replace(/---/g, '\u2014')
        .replace(/--/g, '\u2013')
        .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
        .replace(/'/g, '\u2019')
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201C')
        .replace(/"/g, '\u201D')
        .replace(/\.{3}/g, '\u2026')
}
function mangle(text2) {
    let out = '',
        i,
        ch,
        l = text2.length
    for (i = 0; i < l; i++)
        (ch = text2.charCodeAt(i)),
            Math.random() > 0.5 && (ch = 'x' + ch.toString(16)),
            (out += '&#' + ch + ';')
    return out
}
var Lexer = class {
        constructor(options2) {
            ;(this.tokens = []),
                (this.tokens.links = Object.create(null)),
                (this.options = options2 || defaults),
                (this.options.tokenizer =
                    this.options.tokenizer || new Tokenizer()),
                (this.tokenizer = this.options.tokenizer),
                (this.tokenizer.options = this.options),
                (this.tokenizer.lexer = this),
                (this.inlineQueue = []),
                (this.state = { inLink: !1, inRawBlock: !1, top: !0 })
            let rules = { block: block.normal, inline: inline.normal }
            this.options.pedantic
                ? ((rules.block = block.pedantic),
                  (rules.inline = inline.pedantic))
                : this.options.gfm &&
                  ((rules.block = block.gfm),
                  this.options.breaks
                      ? (rules.inline = inline.breaks)
                      : (rules.inline = inline.gfm)),
                (this.tokenizer.rules = rules)
        }
        static get rules() {
            return { block, inline }
        }
        static lex(src, options2) {
            return new Lexer(options2).lex(src)
        }
        static lexInline(src, options2) {
            return new Lexer(options2).inlineTokens(src)
        }
        lex(src) {
            ;(src = src.replace(
                /\r\n|\r/g,
                `
`,
            )),
                this.blockTokens(src, this.tokens)
            let next
            for (; (next = this.inlineQueue.shift()); )
                this.inlineTokens(next.src, next.tokens)
            return this.tokens
        }
        blockTokens(src, tokens = []) {
            this.options.pedantic
                ? (src = src.replace(/\t/g, '    ').replace(/^ +$/gm, ''))
                : (src = src.replace(
                      /^( *)(\t+)/gm,
                      (_, leading, tabs) =>
                          leading + '    '.repeat(tabs.length),
                  ))
            let token, lastToken, cutSrc, lastParagraphClipped
            for (; src; )
                if (
                    !(
                        this.options.extensions &&
                        this.options.extensions.block &&
                        this.options.extensions.block.some((extTokenizer) =>
                            (token = extTokenizer.call(
                                { lexer: this },
                                src,
                                tokens,
                            ))
                                ? ((src = src.substring(token.raw.length)),
                                  tokens.push(token),
                                  !0)
                                : !1,
                        )
                    )
                ) {
                    if ((token = this.tokenizer.space(src))) {
                        ;(src = src.substring(token.raw.length)),
                            token.raw.length === 1 && tokens.length > 0
                                ? (tokens[tokens.length - 1].raw += `
`)
                                : tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.code(src))) {
                        ;(src = src.substring(token.raw.length)),
                            (lastToken = tokens[tokens.length - 1]),
                            lastToken &&
                            (lastToken.type === 'paragraph' ||
                                lastToken.type === 'text')
                                ? ((lastToken.raw +=
                                      `
` + token.raw),
                                  (lastToken.text +=
                                      `
` + token.text),
                                  (this.inlineQueue[
                                      this.inlineQueue.length - 1
                                  ].src = lastToken.text))
                                : tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.fences(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.heading(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.hr(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.blockquote(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.list(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.html(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.def(src))) {
                        ;(src = src.substring(token.raw.length)),
                            (lastToken = tokens[tokens.length - 1]),
                            lastToken &&
                            (lastToken.type === 'paragraph' ||
                                lastToken.type === 'text')
                                ? ((lastToken.raw +=
                                      `
` + token.raw),
                                  (lastToken.text +=
                                      `
` + token.raw),
                                  (this.inlineQueue[
                                      this.inlineQueue.length - 1
                                  ].src = lastToken.text))
                                : this.tokens.links[token.tag] ||
                                  (this.tokens.links[token.tag] = {
                                      href: token.href,
                                      title: token.title,
                                  })
                        continue
                    }
                    if ((token = this.tokenizer.table(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.lheading(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if (
                        ((cutSrc = src),
                        this.options.extensions &&
                            this.options.extensions.startBlock)
                    ) {
                        let startIndex = Infinity,
                            tempSrc = src.slice(1),
                            tempStart
                        this.options.extensions.startBlock.forEach(function (
                            getStartIndex,
                        ) {
                            ;(tempStart = getStartIndex.call(
                                { lexer: this },
                                tempSrc,
                            )),
                                typeof tempStart == 'number' &&
                                    tempStart >= 0 &&
                                    (startIndex = Math.min(
                                        startIndex,
                                        tempStart,
                                    ))
                        }),
                            startIndex < Infinity &&
                                startIndex >= 0 &&
                                (cutSrc = src.substring(0, startIndex + 1))
                    }
                    if (
                        this.state.top &&
                        (token = this.tokenizer.paragraph(cutSrc))
                    ) {
                        ;(lastToken = tokens[tokens.length - 1]),
                            lastParagraphClipped &&
                            lastToken.type === 'paragraph'
                                ? ((lastToken.raw +=
                                      `
` + token.raw),
                                  (lastToken.text +=
                                      `
` + token.text),
                                  this.inlineQueue.pop(),
                                  (this.inlineQueue[
                                      this.inlineQueue.length - 1
                                  ].src = lastToken.text))
                                : tokens.push(token),
                            (lastParagraphClipped =
                                cutSrc.length !== src.length),
                            (src = src.substring(token.raw.length))
                        continue
                    }
                    if ((token = this.tokenizer.text(src))) {
                        ;(src = src.substring(token.raw.length)),
                            (lastToken = tokens[tokens.length - 1]),
                            lastToken && lastToken.type === 'text'
                                ? ((lastToken.raw +=
                                      `
` + token.raw),
                                  (lastToken.text +=
                                      `
` + token.text),
                                  this.inlineQueue.pop(),
                                  (this.inlineQueue[
                                      this.inlineQueue.length - 1
                                  ].src = lastToken.text))
                                : tokens.push(token)
                        continue
                    }
                    if (src) {
                        let errMsg =
                            'Infinite loop on byte: ' + src.charCodeAt(0)
                        if (this.options.silent) {
                            console.error(errMsg)
                            break
                        } else throw new Error(errMsg)
                    }
                }
            return (this.state.top = !0), tokens
        }
        inline(src, tokens = []) {
            return this.inlineQueue.push({ src, tokens }), tokens
        }
        inlineTokens(src, tokens = []) {
            let token,
                lastToken,
                cutSrc,
                maskedSrc = src,
                match,
                keepPrevChar,
                prevChar
            if (this.tokens.links) {
                let links = Object.keys(this.tokens.links)
                if (links.length > 0)
                    for (
                        ;
                        (match =
                            this.tokenizer.rules.inline.reflinkSearch.exec(
                                maskedSrc,
                            )) != null;

                    )
                        links.includes(
                            match[0].slice(match[0].lastIndexOf('[') + 1, -1),
                        ) &&
                            (maskedSrc =
                                maskedSrc.slice(0, match.index) +
                                '[' +
                                repeatString('a', match[0].length - 2) +
                                ']' +
                                maskedSrc.slice(
                                    this.tokenizer.rules.inline.reflinkSearch
                                        .lastIndex,
                                ))
            }
            for (
                ;
                (match =
                    this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) !=
                null;

            )
                maskedSrc =
                    maskedSrc.slice(0, match.index) +
                    '[' +
                    repeatString('a', match[0].length - 2) +
                    ']' +
                    maskedSrc.slice(
                        this.tokenizer.rules.inline.blockSkip.lastIndex,
                    )
            for (
                ;
                (match =
                    this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) !=
                null;

            )
                (maskedSrc =
                    maskedSrc.slice(0, match.index + match[0].length - 2) +
                    '++' +
                    maskedSrc.slice(
                        this.tokenizer.rules.inline.escapedEmSt.lastIndex,
                    )),
                    this.tokenizer.rules.inline.escapedEmSt.lastIndex--
            for (; src; )
                if (
                    (keepPrevChar || (prevChar = ''),
                    (keepPrevChar = !1),
                    !(
                        this.options.extensions &&
                        this.options.extensions.inline &&
                        this.options.extensions.inline.some((extTokenizer) =>
                            (token = extTokenizer.call(
                                { lexer: this },
                                src,
                                tokens,
                            ))
                                ? ((src = src.substring(token.raw.length)),
                                  tokens.push(token),
                                  !0)
                                : !1,
                        )
                    ))
                ) {
                    if ((token = this.tokenizer.escape(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.tag(src))) {
                        ;(src = src.substring(token.raw.length)),
                            (lastToken = tokens[tokens.length - 1]),
                            lastToken &&
                            token.type === 'text' &&
                            lastToken.type === 'text'
                                ? ((lastToken.raw += token.raw),
                                  (lastToken.text += token.text))
                                : tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.link(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if (
                        (token = this.tokenizer.reflink(src, this.tokens.links))
                    ) {
                        ;(src = src.substring(token.raw.length)),
                            (lastToken = tokens[tokens.length - 1]),
                            lastToken &&
                            token.type === 'text' &&
                            lastToken.type === 'text'
                                ? ((lastToken.raw += token.raw),
                                  (lastToken.text += token.text))
                                : tokens.push(token)
                        continue
                    }
                    if (
                        (token = this.tokenizer.emStrong(
                            src,
                            maskedSrc,
                            prevChar,
                        ))
                    ) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.codespan(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.br(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.del(src))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if ((token = this.tokenizer.autolink(src, mangle))) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if (
                        !this.state.inLink &&
                        (token = this.tokenizer.url(src, mangle))
                    ) {
                        ;(src = src.substring(token.raw.length)),
                            tokens.push(token)
                        continue
                    }
                    if (
                        ((cutSrc = src),
                        this.options.extensions &&
                            this.options.extensions.startInline)
                    ) {
                        let startIndex = Infinity,
                            tempSrc = src.slice(1),
                            tempStart
                        this.options.extensions.startInline.forEach(function (
                            getStartIndex,
                        ) {
                            ;(tempStart = getStartIndex.call(
                                { lexer: this },
                                tempSrc,
                            )),
                                typeof tempStart == 'number' &&
                                    tempStart >= 0 &&
                                    (startIndex = Math.min(
                                        startIndex,
                                        tempStart,
                                    ))
                        }),
                            startIndex < Infinity &&
                                startIndex >= 0 &&
                                (cutSrc = src.substring(0, startIndex + 1))
                    }
                    if (
                        (token = this.tokenizer.inlineText(cutSrc, smartypants))
                    ) {
                        ;(src = src.substring(token.raw.length)),
                            token.raw.slice(-1) !== '_' &&
                                (prevChar = token.raw.slice(-1)),
                            (keepPrevChar = !0),
                            (lastToken = tokens[tokens.length - 1]),
                            lastToken && lastToken.type === 'text'
                                ? ((lastToken.raw += token.raw),
                                  (lastToken.text += token.text))
                                : tokens.push(token)
                        continue
                    }
                    if (src) {
                        let errMsg =
                            'Infinite loop on byte: ' + src.charCodeAt(0)
                        if (this.options.silent) {
                            console.error(errMsg)
                            break
                        } else throw new Error(errMsg)
                    }
                }
            return tokens
        }
    },
    Renderer = class {
        constructor(options2) {
            this.options = options2 || defaults
        }
        code(code, infostring, escaped) {
            let lang = (infostring || '').match(/\S*/)[0]
            if (this.options.highlight) {
                let out = this.options.highlight(code, lang)
                out != null && out !== code && ((escaped = !0), (code = out))
            }
            return (
                (code =
                    code.replace(/\n$/, '') +
                    `
`),
                lang
                    ? '<pre><code class="' +
                      this.options.langPrefix +
                      escape(lang) +
                      '">' +
                      (escaped ? code : escape(code, !0)) +
                      `</code></pre>
`
                    : '<pre><code>' +
                      (escaped ? code : escape(code, !0)) +
                      `</code></pre>
`
            )
        }
        blockquote(quote) {
            return `<blockquote>
${quote}</blockquote>
`
        }
        html(html2) {
            return html2
        }
        heading(text2, level, raw, slugger) {
            if (this.options.headerIds) {
                let id = this.options.headerPrefix + slugger.slug(raw)
                return `<h${level} id="${id}">${text2}</h${level}>
`
            }
            return `<h${level}>${text2}</h${level}>
`
        }
        hr() {
            return this.options.xhtml
                ? `<hr/>
`
                : `<hr>
`
        }
        list(body, ordered, start) {
            let type = ordered ? 'ol' : 'ul',
                startatt =
                    ordered && start !== 1 ? ' start="' + start + '"' : ''
            return (
                '<' +
                type +
                startatt +
                `>
` +
                body +
                '</' +
                type +
                `>
`
            )
        }
        listitem(text2) {
            return `<li>${text2}</li>
`
        }
        checkbox(checked) {
            return (
                '<input ' +
                (checked ? 'checked="" ' : '') +
                'disabled="" type="checkbox"' +
                (this.options.xhtml ? ' /' : '') +
                '> '
            )
        }
        paragraph(text2) {
            return `<p>${text2}</p>
`
        }
        table(header, body) {
            return (
                body && (body = `<tbody>${body}</tbody>`),
                `<table>
<thead>
` +
                    header +
                    `</thead>
` +
                    body +
                    `</table>
`
            )
        }
        tablerow(content) {
            return `<tr>
${content}</tr>
`
        }
        tablecell(content, flags) {
            let type = flags.header ? 'th' : 'td'
            return (
                (flags.align
                    ? `<${type} align="${flags.align}">`
                    : `<${type}>`) +
                content +
                `</${type}>
`
            )
        }
        strong(text2) {
            return `<strong>${text2}</strong>`
        }
        em(text2) {
            return `<em>${text2}</em>`
        }
        codespan(text2) {
            return `<code>${text2}</code>`
        }
        br() {
            return this.options.xhtml ? '<br/>' : '<br>'
        }
        del(text2) {
            return `<del>${text2}</del>`
        }
        link(href, title, text2) {
            if (
                ((href = cleanUrl(
                    this.options.sanitize,
                    this.options.baseUrl,
                    href,
                )),
                href === null)
            )
                return text2
            let out = '<a href="' + href + '"'
            return (
                title && (out += ' title="' + title + '"'),
                (out += '>' + text2 + '</a>'),
                out
            )
        }
        image(href, title, text2) {
            if (
                ((href = cleanUrl(
                    this.options.sanitize,
                    this.options.baseUrl,
                    href,
                )),
                href === null)
            )
                return text2
            let out = `<img src="${href}" alt="${text2}"`
            return (
                title && (out += ` title="${title}"`),
                (out += this.options.xhtml ? '/>' : '>'),
                out
            )
        }
        text(text2) {
            return text2
        }
    },
    TextRenderer = class {
        strong(text2) {
            return text2
        }
        em(text2) {
            return text2
        }
        codespan(text2) {
            return text2
        }
        del(text2) {
            return text2
        }
        html(text2) {
            return text2
        }
        text(text2) {
            return text2
        }
        link(href, title, text2) {
            return '' + text2
        }
        image(href, title, text2) {
            return '' + text2
        }
        br() {
            return ''
        }
    },
    Slugger = class {
        constructor() {
            this.seen = {}
        }
        serialize(value) {
            return value
                .toLowerCase()
                .trim()
                .replace(/<[!\/a-z].*?>/gi, '')
                .replace(
                    /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,
                    '',
                )
                .replace(/\s/g, '-')
        }
        getNextSafeSlug(originalSlug, isDryRun) {
            let slug = originalSlug,
                occurenceAccumulator = 0
            if (this.seen.hasOwnProperty(slug)) {
                occurenceAccumulator = this.seen[originalSlug]
                do
                    occurenceAccumulator++,
                        (slug = originalSlug + '-' + occurenceAccumulator)
                while (this.seen.hasOwnProperty(slug))
            }
            return (
                isDryRun ||
                    ((this.seen[originalSlug] = occurenceAccumulator),
                    (this.seen[slug] = 0)),
                slug
            )
        }
        slug(value, options2 = {}) {
            let slug = this.serialize(value)
            return this.getNextSafeSlug(slug, options2.dryrun)
        }
    },
    Parser = class {
        constructor(options2) {
            ;(this.options = options2 || defaults),
                (this.options.renderer =
                    this.options.renderer || new Renderer()),
                (this.renderer = this.options.renderer),
                (this.renderer.options = this.options),
                (this.textRenderer = new TextRenderer()),
                (this.slugger = new Slugger())
        }
        static parse(tokens, options2) {
            return new Parser(options2).parse(tokens)
        }
        static parseInline(tokens, options2) {
            return new Parser(options2).parseInline(tokens)
        }
        parse(tokens, top = !0) {
            let out = '',
                i,
                j,
                k,
                l2,
                l3,
                row,
                cell,
                header,
                body,
                token,
                ordered,
                start,
                loose,
                itemBody,
                item,
                checked,
                task,
                checkbox,
                ret,
                l = tokens.length
            for (i = 0; i < l; i++) {
                if (
                    ((token = tokens[i]),
                    this.options.extensions &&
                        this.options.extensions.renderers &&
                        this.options.extensions.renderers[token.type] &&
                        ((ret = this.options.extensions.renderers[
                            token.type
                        ].call({ parser: this }, token)),
                        ret !== !1 ||
                            ![
                                'space',
                                'hr',
                                'heading',
                                'code',
                                'table',
                                'blockquote',
                                'list',
                                'html',
                                'paragraph',
                                'text',
                            ].includes(token.type)))
                ) {
                    out += ret || ''
                    continue
                }
                switch (token.type) {
                    case 'space':
                        continue
                    case 'hr': {
                        out += this.renderer.hr()
                        continue
                    }
                    case 'heading': {
                        out += this.renderer.heading(
                            this.parseInline(token.tokens),
                            token.depth,
                            unescape(
                                this.parseInline(
                                    token.tokens,
                                    this.textRenderer,
                                ),
                            ),
                            this.slugger,
                        )
                        continue
                    }
                    case 'code': {
                        out += this.renderer.code(
                            token.text,
                            token.lang,
                            token.escaped,
                        )
                        continue
                    }
                    case 'table': {
                        for (
                            header = '',
                                cell = '',
                                l2 = token.header.length,
                                j = 0;
                            j < l2;
                            j++
                        )
                            cell += this.renderer.tablecell(
                                this.parseInline(token.header[j].tokens),
                                { header: !0, align: token.align[j] },
                            )
                        for (
                            header += this.renderer.tablerow(cell),
                                body = '',
                                l2 = token.rows.length,
                                j = 0;
                            j < l2;
                            j++
                        ) {
                            for (
                                row = token.rows[j],
                                    cell = '',
                                    l3 = row.length,
                                    k = 0;
                                k < l3;
                                k++
                            )
                                cell += this.renderer.tablecell(
                                    this.parseInline(row[k].tokens),
                                    { header: !1, align: token.align[k] },
                                )
                            body += this.renderer.tablerow(cell)
                        }
                        out += this.renderer.table(header, body)
                        continue
                    }
                    case 'blockquote': {
                        ;(body = this.parse(token.tokens)),
                            (out += this.renderer.blockquote(body))
                        continue
                    }
                    case 'list': {
                        for (
                            ordered = token.ordered,
                                start = token.start,
                                loose = token.loose,
                                l2 = token.items.length,
                                body = '',
                                j = 0;
                            j < l2;
                            j++
                        )
                            (item = token.items[j]),
                                (checked = item.checked),
                                (task = item.task),
                                (itemBody = ''),
                                item.task &&
                                    ((checkbox =
                                        this.renderer.checkbox(checked)),
                                    loose
                                        ? item.tokens.length > 0 &&
                                          item.tokens[0].type === 'paragraph'
                                            ? ((item.tokens[0].text =
                                                  checkbox +
                                                  ' ' +
                                                  item.tokens[0].text),
                                              item.tokens[0].tokens &&
                                                  item.tokens[0].tokens.length >
                                                      0 &&
                                                  item.tokens[0].tokens[0]
                                                      .type === 'text' &&
                                                  (item.tokens[0].tokens[0].text =
                                                      checkbox +
                                                      ' ' +
                                                      item.tokens[0].tokens[0]
                                                          .text))
                                            : item.tokens.unshift({
                                                  type: 'text',
                                                  text: checkbox,
                                              })
                                        : (itemBody += checkbox)),
                                (itemBody += this.parse(item.tokens, loose)),
                                (body += this.renderer.listitem(
                                    itemBody,
                                    task,
                                    checked,
                                ))
                        out += this.renderer.list(body, ordered, start)
                        continue
                    }
                    case 'html': {
                        out += this.renderer.html(token.text)
                        continue
                    }
                    case 'paragraph': {
                        out += this.renderer.paragraph(
                            this.parseInline(token.tokens),
                        )
                        continue
                    }
                    case 'text': {
                        for (
                            body = token.tokens
                                ? this.parseInline(token.tokens)
                                : token.text;
                            i + 1 < l && tokens[i + 1].type === 'text';

                        )
                            (token = tokens[++i]),
                                (body +=
                                    `
` + (token.tokens ? this.parseInline(token.tokens) : token.text))
                        out += top ? this.renderer.paragraph(body) : body
                        continue
                    }
                    default: {
                        let errMsg =
                            'Token with "' +
                            token.type +
                            '" type was not found.'
                        if (this.options.silent) {
                            console.error(errMsg)
                            return
                        } else throw new Error(errMsg)
                    }
                }
            }
            return out
        }
        parseInline(tokens, renderer) {
            renderer = renderer || this.renderer
            let out = '',
                i,
                token,
                ret,
                l = tokens.length
            for (i = 0; i < l; i++) {
                if (
                    ((token = tokens[i]),
                    this.options.extensions &&
                        this.options.extensions.renderers &&
                        this.options.extensions.renderers[token.type] &&
                        ((ret = this.options.extensions.renderers[
                            token.type
                        ].call({ parser: this }, token)),
                        ret !== !1 ||
                            ![
                                'escape',
                                'html',
                                'link',
                                'image',
                                'strong',
                                'em',
                                'codespan',
                                'br',
                                'del',
                                'text',
                            ].includes(token.type)))
                ) {
                    out += ret || ''
                    continue
                }
                switch (token.type) {
                    case 'escape': {
                        out += renderer.text(token.text)
                        break
                    }
                    case 'html': {
                        out += renderer.html(token.text)
                        break
                    }
                    case 'link': {
                        out += renderer.link(
                            token.href,
                            token.title,
                            this.parseInline(token.tokens, renderer),
                        )
                        break
                    }
                    case 'image': {
                        out += renderer.image(
                            token.href,
                            token.title,
                            token.text,
                        )
                        break
                    }
                    case 'strong': {
                        out += renderer.strong(
                            this.parseInline(token.tokens, renderer),
                        )
                        break
                    }
                    case 'em': {
                        out += renderer.em(
                            this.parseInline(token.tokens, renderer),
                        )
                        break
                    }
                    case 'codespan': {
                        out += renderer.codespan(token.text)
                        break
                    }
                    case 'br': {
                        out += renderer.br()
                        break
                    }
                    case 'del': {
                        out += renderer.del(
                            this.parseInline(token.tokens, renderer),
                        )
                        break
                    }
                    case 'text': {
                        out += renderer.text(token.text)
                        break
                    }
                    default: {
                        let errMsg =
                            'Token with "' +
                            token.type +
                            '" type was not found.'
                        if (this.options.silent) {
                            console.error(errMsg)
                            return
                        } else throw new Error(errMsg)
                    }
                }
            }
            return out
        }
    }
function marked(src, opt, callback) {
    if (typeof src == 'undefined' || src === null)
        throw new Error('marked(): input parameter is undefined or null')
    if (typeof src != 'string')
        throw new Error(
            'marked(): input parameter is of type ' +
                Object.prototype.toString.call(src) +
                ', string expected',
        )
    if (
        (typeof opt == 'function' && ((callback = opt), (opt = null)),
        (opt = merge({}, marked.defaults, opt || {})),
        checkSanitizeDeprecation(opt),
        callback)
    ) {
        let highlight = opt.highlight,
            tokens
        try {
            tokens = Lexer.lex(src, opt)
        } catch (e2) {
            return callback(e2)
        }
        let done = function (err) {
            let out
            if (!err)
                try {
                    opt.walkTokens && marked.walkTokens(tokens, opt.walkTokens),
                        (out = Parser.parse(tokens, opt))
                } catch (e2) {
                    err = e2
                }
            return (
                (opt.highlight = highlight),
                err ? callback(err) : callback(null, out)
            )
        }
        if (
            !highlight ||
            highlight.length < 3 ||
            (delete opt.highlight, !tokens.length)
        )
            return done()
        let pending = 0
        marked.walkTokens(tokens, function (token) {
            token.type === 'code' &&
                (pending++,
                setTimeout(() => {
                    highlight(token.text, token.lang, function (err, code) {
                        if (err) return done(err)
                        code != null &&
                            code !== token.text &&
                            ((token.text = code), (token.escaped = !0)),
                            pending--,
                            pending === 0 && done()
                    })
                }, 0))
        }),
            pending === 0 && done()
        return
    }
    function onError(e2) {
        if (
            ((e2.message += `
Please report this to https://github.com/markedjs/marked.`),
            opt.silent)
        )
            return (
                '<p>An error occurred:</p><pre>' +
                escape(e2.message + '', !0) +
                '</pre>'
            )
        throw e2
    }
    try {
        let tokens = Lexer.lex(src, opt)
        if (opt.walkTokens) {
            if (opt.async)
                return Promise.all(marked.walkTokens(tokens, opt.walkTokens))
                    .then(() => Parser.parse(tokens, opt))
                    .catch(onError)
            marked.walkTokens(tokens, opt.walkTokens)
        }
        return Parser.parse(tokens, opt)
    } catch (e2) {
        onError(e2)
    }
}
marked.options = marked.setOptions = function (opt) {
    return merge(marked.defaults, opt), changeDefaults(marked.defaults), marked
}
marked.getDefaults = getDefaults
marked.defaults = defaults
marked.use = function (...args) {
    let extensions = marked.defaults.extensions || {
        renderers: {},
        childTokens: {},
    }
    args.forEach((pack) => {
        let opts = merge({}, pack)
        if (
            ((opts.async = marked.defaults.async || opts.async),
            pack.extensions &&
                (pack.extensions.forEach((ext) => {
                    if (!ext.name) throw new Error('extension name required')
                    if (ext.renderer) {
                        let prevRenderer = extensions.renderers[ext.name]
                        prevRenderer
                            ? (extensions.renderers[ext.name] = function (
                                  ...args2
                              ) {
                                  let ret = ext.renderer.apply(this, args2)
                                  return (
                                      ret === !1 &&
                                          (ret = prevRenderer.apply(
                                              this,
                                              args2,
                                          )),
                                      ret
                                  )
                              })
                            : (extensions.renderers[ext.name] = ext.renderer)
                    }
                    if (ext.tokenizer) {
                        if (
                            !ext.level ||
                            (ext.level !== 'block' && ext.level !== 'inline')
                        )
                            throw new Error(
                                "extension level must be 'block' or 'inline'",
                            )
                        extensions[ext.level]
                            ? extensions[ext.level].unshift(ext.tokenizer)
                            : (extensions[ext.level] = [ext.tokenizer]),
                            ext.start &&
                                (ext.level === 'block'
                                    ? extensions.startBlock
                                        ? extensions.startBlock.push(ext.start)
                                        : (extensions.startBlock = [ext.start])
                                    : ext.level === 'inline' &&
                                      (extensions.startInline
                                          ? extensions.startInline.push(
                                                ext.start,
                                            )
                                          : (extensions.startInline = [
                                                ext.start,
                                            ])))
                    }
                    ext.childTokens &&
                        (extensions.childTokens[ext.name] = ext.childTokens)
                }),
                (opts.extensions = extensions)),
            pack.renderer)
        ) {
            let renderer = marked.defaults.renderer || new Renderer()
            for (let prop in pack.renderer) {
                let prevRenderer = renderer[prop]
                renderer[prop] = (...args2) => {
                    let ret = pack.renderer[prop].apply(renderer, args2)
                    return (
                        ret === !1 &&
                            (ret = prevRenderer.apply(renderer, args2)),
                        ret
                    )
                }
            }
            opts.renderer = renderer
        }
        if (pack.tokenizer) {
            let tokenizer = marked.defaults.tokenizer || new Tokenizer()
            for (let prop in pack.tokenizer) {
                let prevTokenizer = tokenizer[prop]
                tokenizer[prop] = (...args2) => {
                    let ret = pack.tokenizer[prop].apply(tokenizer, args2)
                    return (
                        ret === !1 &&
                            (ret = prevTokenizer.apply(tokenizer, args2)),
                        ret
                    )
                }
            }
            opts.tokenizer = tokenizer
        }
        if (pack.walkTokens) {
            let walkTokens2 = marked.defaults.walkTokens
            opts.walkTokens = function (token) {
                let values = []
                return (
                    values.push(pack.walkTokens.call(this, token)),
                    walkTokens2 &&
                        (values = values.concat(walkTokens2.call(this, token))),
                    values
                )
            }
        }
        marked.setOptions(opts)
    })
}
marked.walkTokens = function (tokens, callback) {
    let values = []
    for (let token of tokens)
        switch (
            ((values = values.concat(callback.call(marked, token))), token.type)
        ) {
            case 'table': {
                for (let cell of token.header)
                    values = values.concat(
                        marked.walkTokens(cell.tokens, callback),
                    )
                for (let row of token.rows)
                    for (let cell of row)
                        values = values.concat(
                            marked.walkTokens(cell.tokens, callback),
                        )
                break
            }
            case 'list': {
                values = values.concat(marked.walkTokens(token.items, callback))
                break
            }
            default:
                marked.defaults.extensions &&
                marked.defaults.extensions.childTokens &&
                marked.defaults.extensions.childTokens[token.type]
                    ? marked.defaults.extensions.childTokens[
                          token.type
                      ].forEach(function (childTokens) {
                          values = values.concat(
                              marked.walkTokens(token[childTokens], callback),
                          )
                      })
                    : token.tokens &&
                      (values = values.concat(
                          marked.walkTokens(token.tokens, callback),
                      ))
        }
    return values
}
marked.parseInline = function (src, opt) {
    if (typeof src == 'undefined' || src === null)
        throw new Error(
            'marked.parseInline(): input parameter is undefined or null',
        )
    if (typeof src != 'string')
        throw new Error(
            'marked.parseInline(): input parameter is of type ' +
                Object.prototype.toString.call(src) +
                ', string expected',
        )
    ;(opt = merge({}, marked.defaults, opt || {})),
        checkSanitizeDeprecation(opt)
    try {
        let tokens = Lexer.lexInline(src, opt)
        return (
            opt.walkTokens && marked.walkTokens(tokens, opt.walkTokens),
            Parser.parseInline(tokens, opt)
        )
    } catch (e2) {
        if (
            ((e2.message += `
Please report this to https://github.com/markedjs/marked.`),
            opt.silent)
        )
            return (
                '<p>An error occurred:</p><pre>' +
                escape(e2.message + '', !0) +
                '</pre>'
            )
        throw e2
    }
}
marked.Parser = Parser
marked.parser = Parser.parse
marked.Renderer = Renderer
marked.TextRenderer = TextRenderer
marked.Lexer = Lexer
marked.lexer = Lexer.lex
marked.Tokenizer = Tokenizer
marked.Slugger = Slugger
marked.parse = marked
var options = marked.options,
    setOptions = marked.setOptions,
    use = marked.use,
    walkTokens = marked.walkTokens,
    parseInline = marked.parseInline
var parser = Parser.parse,
    lexer = Lexer.lex
function e(e2) {
    return e2
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}
var n = {
        space: /^\n+/,
        blockCode: /^( {4}[^\n]+\n*)+/,
        fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)(\n)(|[\s\S]*?\n)( {0,3}\1[~`]* *(?:\n+|$)|$)/,
        heading: /^#{1,6} [^\n]+(\n|$)/,
        lheading: /^[^\n]+\n {0,3}(=+|-+) *(\n+|$)/,
        hr: /^(([-_*]) *){3,}(\n+|$)/,
        list: /^( {0})((?:[*+-]|\d{1,9}\.)) [\s\S]+?(?:\n+(?! )(?!\1(?:[*+-]|\d{1,9}\.) )\n*|\s*$)/,
        blockquote: /^( {0,3}> ?([^\n]*)(?:\n|$))+/,
        html: /^ {0,3}(?:<(script|pre|style)[\s>][\s\S]*?(?:<\/\1>[^\n]*\n+|$)|<!--(?!-?>)[\s\S]*?-->[^\n]*(\n+|$)|<\/?(\w+)(?: +|\n|\/?>)[\s\S]*?(?:\n{2,}|$))/,
        paragraph: /^[^\n]+/,
    },
    t = {
        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
        inlineCode: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        link: /^!?\[([\s\S]+)\]\(\s*([\s\S]+)(?:\s+([\s\S]+))?\s*\)/,
        text: /^(`+|[^`])(?:[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/,
    },
    r = (e2, n2, t2) => `<${e2} class="mdhl-${t2}">${n2}</${e2}>`,
    s = {
        codeInFences: (n2, t2) => r('span', e(n2), 'codeInFences'),
        heading: (e2, n2, t2) => r('b', t2(e2.text, n2), e2.type),
        lheading: (e2, n2, t2) => r('b', t2(e2.text, n2), 'heading'),
        paragraph: (e2, n2, t2) => r('span', t2(e2.text, n2), e2.type),
        list: (e2, n2, t2) => {
            let s2 = e2.text
                .split(
                    `
`,
                )
                .map((e3) => {
                    let s3 = e3.substr(0, 1),
                        c2 = e3.substr(1),
                        o2 = t2(c2, n2)
                    return `${r('span', s3, 'bullet')}${o2}`
                }).join(`
`)
            return r('span', s2, 'list')
        },
        fences: (n2, t2) => {
            let [, r2, s2, c2, o2, p2] = n2.cap,
                a2 = t2.codeInFences(o2, s2)
            return `${r2}${e(s2)}${c2}${a2}${p2}`
        },
        space: (e2) => e2.text,
        text: (e2) => e2.text,
        em: (e2) => r('i', e2.text, e2.type),
        strong: (e2) => r('b', e2.text, e2.type),
        defaultInlineRenderer: (e2) => r('span', e2.text, e2.type),
        defaultBlockRenderer: (n2) => r('span', e(n2.text), n2.type),
    }
function c(n2, r2) {
    let s2 = ''
    for (; n2; )
        if (
            !Object.keys(t).some((o2) => {
                let p2 = t[o2].exec(n2)
                if (p2) {
                    let t2 = p2[0]
                    n2 = n2.substring(t2.length)
                    let a2 = e(t2)
                    return (
                        (s2 += (r2[o2] || r2.defaultInlineRenderer)(
                            { type: o2, text: a2, cap: p2 },
                            r2,
                            c,
                        )),
                        !0
                    )
                }
                return !1
            })
        )
            throw new Error('Infinite loop on byte: ' + n2.charCodeAt(0))
    return s2
}
function o(e2) {
    let t2 = []
    for (e2 = e2.replace(/^ +$/gm, ''); e2; )
        if (
            !Object.keys(n).some((r2) => {
                let s2 = n[r2].exec(e2)
                if (s2) {
                    let n2 = s2[0]
                    return (
                        (e2 = e2.substring(n2.length)),
                        t2.push({ text: n2, type: r2, cap: s2 }),
                        !0
                    )
                }
                return !1
            })
        )
            throw new Error('Infinite loop on byte: ' + e2.charCodeAt(0))
    return t2
}
function p(e2, n2) {
    return e2
        .map((e3) => (n2[e3.type] || n2.defaultBlockRenderer)(e3, n2, c))
        .join('')
        .replace(/\n/g, '<br/>')
}
function a(e2, n2 = s) {
    return p(o(e2), n2)
}
function markdownEditorFormComponent({ state, tab }) {
    return {
        attachment: null,
        overlay: null,
        preview: '',
        state,
        tab,
        init: function () {
            this.state !== null &&
                this.$nextTick(() => {
                    this.render()
                }),
                this.$watch('state', (value) => {
                    value === null && (this.state = ''), this.render()
                })
        },
        render: function () {
            ;(this.$refs.textarea?.scrollHeight ?? 0) > 0 &&
                ((this.$refs.overlay.style.height = '150px'),
                (this.$refs.overlay.style.height =
                    this.$refs.textarea.scrollHeight + 'px')),
                (this.state = this.state.replace(
                    `\r
`,
                    `
`,
                )),
                (this.overlay = null),
                (this.overlay = a(this.state)),
                (this.preview = null),
                (this.preview = purify.sanitize(marked(this.state)))
        },
        checkForAutoInsertion: function () {
            let lines = this.$refs.textarea.value.split(`
`),
                currentLine = this.$refs.textarea.value.substring(
                    0,
                    this.$refs.textarea.value.selectionStart,
                ).split(`
`).length,
                previousLine = lines[currentLine - 2]
            if (!!previousLine.match(/^(\*\s|-\s)|^(\d)+\./)) {
                if (previousLine.match(/^(\*\s)/))
                    previousLine.trim().length > 1
                        ? (lines[currentLine - 1] = '* ')
                        : delete lines[currentLine - 2]
                else if (previousLine.match(/^(-\s)/))
                    previousLine.trim().length > 1
                        ? (lines[currentLine - 1] = '- ')
                        : delete lines[currentLine - 2]
                else {
                    let number = previousLine.match(/^(\d)+/)[0]
                    previousLine.trim().length > number.length + 2
                        ? (lines[currentLine - 1] = `${parseInt(number) + 1}. `)
                        : delete lines[currentLine - 2]
                }
                ;(this.state = lines.join(`
`)),
                    this.render()
            }
        },
    }
}
export { markdownEditorFormComponent as default }
/*! @license DOMPurify 2.4.4 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.4.4/LICENSE */
