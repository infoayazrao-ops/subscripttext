/**
 * Subscript Text Generator - Conversion Engine
 * Uses Unicode TRUE subscript characters (U+2080 to U+209C and related).
 * Output remains subscript after copy paste (Word, Gmail, WhatsApp, etc.).
 */

(function () {
  'use strict';

  // ─── Unicode subscript character maps ─────────────────────────────────────
  const SUBSCRIPT_DIGITS = {
    '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
    '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
  };

  // Only letters with widely-supported Unicode subscript (U+2090 to U+209C). Others left
  // unchanged so they don't render as boxes in fonts that lack modifier/small-cap glyphs.
  const SUBSCRIPT_LETTERS = {
    'a': '\u2090', 'e': '\u2091', 'o': '\u2092', 'x': '\u2093', '\u0259': '\u2094',
    'h': '\u2095', 'k': '\u2096', 'l': '\u2097', 'm': '\u2098', 'n': '\u2099',
    'p': '\u209A', 's': '\u209B', 't': '\u209C'
  };

  const SUBSCRIPT_SYMBOLS = {
    '+': '\u208A', '-': '\u208B', '=': '\u208C',
    '(': '\u208D', ')': '\u208E'
  };

  const SUPERSCRIPT_DIGITS = {
    '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
    '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079'
  };

  // Full superscript: modifier/superscript letters (same style as small text; q has no mapping).
  const SUPERSCRIPT_LETTERS = {
    'a': '\u1D43', 'b': '\u1D47', 'c': '\u1D9C', 'd': '\u1D48', 'e': '\u1D49',
    'f': '\u1DA0', 'g': '\u1D4D', 'h': '\u02B0', 'i': '\u2071', 'j': '\u02B2',
    'k': '\u1D4F', 'l': '\u02E1', 'm': '\u1D50', 'n': '\u207F', 'o': '\u1D52',
    'p': '\u1D56', 'r': '\u02B3', 's': '\u02E2', 't': '\u1D57', 'u': '\u1D58',
    'v': '\u1D5B', 'w': '\u02B7', 'x': '\u02E3', 'y': '\u02B8', 'z': '\u1DBB'
  };

  // Small text: single map (modifier letters / superscript Latin). Full text conversion only.
  const SMALL_TEXT_MAP = {
    '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
    '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079',
    'a': '\u1D43', 'b': '\u1D47', 'c': '\u1D9C', 'd': '\u1D48', 'e': '\u1D49',
    'f': '\u1DA0', 'g': '\u1D4D', 'h': '\u02B0', 'i': '\u2071', 'j': '\u02B2',
    'k': '\u1D4F', 'l': '\u02E1', 'm': '\u1D50', 'n': '\u207F', 'o': '\u1D52',
    'p': '\u1D56', 'r': '\u02B3', 's': '\u02E2', 't': '\u1D57', 'u': '\u1D58',
    'v': '\u1D5B', 'w': '\u02B7', 'x': '\u02E3', 'y': '\u02B8', 'z': '\u1DBB'
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function getIgnoreSet() {
    var el = document.getElementById('ignoreChars');
    if (!el || !el.value || typeof el.value !== 'string') return null;
    var raw = el.value.split(',');
    var set = new Set();
    for (var i = 0; i < raw.length; i++) {
      var ch = raw[i].trim();
      if (ch.length > 0) {
        set.add(ch.charAt(0));
        set.add(ch.charAt(0).toLowerCase());
      }
    }
    return set.size ? set : null;
  }

  function isIgnored(char, opts) {
    if (!opts.ignore) return false;
    return opts.ignore.has(char) || opts.ignore.has(char.toLowerCase());
  }

  function convertCharFull(char, opts) {
    if (isIgnored(char, opts)) return char;
    const lower = char.toLowerCase();
    if (opts.numbers && SUBSCRIPT_DIGITS[char] !== undefined) return SUBSCRIPT_DIGITS[char];
    if (opts.letters && SUBSCRIPT_LETTERS[lower] !== undefined) return SUBSCRIPT_LETTERS[lower];
    if (opts.symbols && SUBSCRIPT_SYMBOLS[char] !== undefined) return SUBSCRIPT_SYMBOLS[char];
    return char;
  }

  /** Convert a string of digits to subscript (for formula mode). */
  function digitsToSubscript(str, opts) {
    var out = '';
    var ignore = opts && opts.ignore;
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      if (ignore && ignore.has(c)) out += c;
      else out += SUBSCRIPT_DIGITS[c] !== undefined ? SUBSCRIPT_DIGITS[c] : c;
    }
    return out;
  }

  /**
   * Formula / Scientific (Smart) mode.
   * Converts ONLY numbers that immediately follow letters (chemical/math subscript).
   * Does NOT convert: years (2024), phone numbers, or standalone digits.
   *
   * Pattern: one or more letters followed by one or more digits.
   * Examples: H2O -> H₂O, CO2 -> CO₂, C6H12O6 -> C₆H₁₂O₆, x2 -> x₂, a1b2 -> a₁b₂.
   */
  function convertSmart(text, opts) {
    if (!text) return '';
    if (!opts.numbers) return text;
    var out = '';
    var i = 0;
    var len = text.length;
    while (i < len) {
      var letterStart = i;
      while (i < len && /[A-Za-z]/.test(text[i])) i++;
      if (i > letterStart) {
        var digitStart = i;
        while (i < len && /\d/.test(text[i])) i++;
        if (i > digitStart) {
          out += text.slice(letterStart, digitStart) + digitsToSubscript(text.slice(digitStart, i), opts);
          continue;
        }
        out += text.slice(letterStart, i);
        continue;
      }
      out += text[i];
      i++;
    }
    return out;
  }

  /**
   * Normal (Full Text) mode:
   * - Convert entire input to subscript where Unicode supports it.
   */
  function convertFull(text, opts) {
    if (!text) return '';
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      out += convertCharFull(c, opts);
    }
    return out;
  }

  function digitsToSuperscript(str, opts) {
    var out = '';
    var ignore = opts && opts.ignore;
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      if (ignore && ignore.has(c)) out += c;
      else out += SUPERSCRIPT_DIGITS[c] !== undefined ? SUPERSCRIPT_DIGITS[c] : c;
    }
    return out;
  }

  function convertCharFullSuperscript(char, opts) {
    if (isIgnored(char, opts)) return char;
    if (opts.numbers && SUPERSCRIPT_DIGITS[char] !== undefined) return SUPERSCRIPT_DIGITS[char];
    var lower = char.toLowerCase();
    if (opts.letters && SUPERSCRIPT_LETTERS[lower] !== undefined) return SUPERSCRIPT_LETTERS[lower];
    return char;
  }

  function convertFullSuperscript(text, opts) {
    if (!text) return '';
    var out = '';
    for (var i = 0; i < text.length; i++) {
      out += convertCharFullSuperscript(text[i], opts);
    }
    return out;
  }

  function convertSmartSuperscript(text, opts) {
    if (!text || !opts.numbers) return text;
    var out = '';
    var i = 0;
    var len = text.length;
    while (i < len) {
      var letterStart = i;
      while (i < len && /[A-Za-z]/.test(text[i])) i++;
      if (i > letterStart) {
        var digitStart = i;
        while (i < len && /\d/.test(text[i])) i++;
        if (i > digitStart) {
          out += text.slice(letterStart, digitStart) + digitsToSuperscript(text.slice(digitStart, i), opts);
          continue;
        }
        out += text.slice(letterStart, i);
        continue;
      }
      out += text[i];
      i++;
    }
    return out;
  }

  // ─── Unicode Mathematical Bold/Italic (paste as bold/italic in .txt, WhatsApp, everywhere) ───
  function convertCharBold(ch, opts) {
    if (isIgnored(ch, opts)) return ch;
    var code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + code - 97);
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + code - 48);
    return ch;
  }
  function convertCharItalic(ch, opts) {
    if (isIgnored(ch, opts)) return ch;
    var code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D434 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D44E + code - 97);
    return ch;
  }
  function convertCharBoldItalic(ch, opts) {
    if (isIgnored(ch, opts)) return ch;
    var code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D468 + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D482 + code - 97);
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + code - 48);
    return ch;
  }
  function convertFullBold(text, opts) {
    if (!text) return '';
    var out = '';
    for (var i = 0; i < text.length; i++) out += convertCharBold(text[i], opts);
    return out;
  }
  function convertFullItalic(text, opts) {
    if (!text) return '';
    var out = '';
    for (var i = 0; i < text.length; i++) out += convertCharItalic(text[i], opts);
    return out;
  }
  function convertFullBoldItalic(text, opts) {
    if (!text) return '';
    var out = '';
    for (var i = 0; i < text.length; i++) out += convertCharBoldItalic(text[i], opts);
    return out;
  }

  /** Small text: convert entire text using SMALL_TEXT_MAP. Ignores Formula mode and Numbers Only. */
  function convertSmallText(text, opts) {
    if (!text) return '';
    var out = '';
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (isIgnored(c, opts)) { out += c; continue; }
      var key = c.toLowerCase();
      if (SMALL_TEXT_MAP[c] !== undefined) out += SMALL_TEXT_MAP[c];
      else if (SMALL_TEXT_MAP[key] !== undefined) out += SMALL_TEXT_MAP[key];
      else out += c;
    }
    return out;
  }

  function runConversion(inputValue, mode, opts) {
    var ctype = getConversionType();
    if (ctype === 'small') {
      return convertSmallText(inputValue, opts);
    }
    if (ctype === 'superscript') {
      return mode === 'smart' ? convertSmartSuperscript(inputValue, opts) : convertFullSuperscript(inputValue, opts);
    }
    return mode === 'smart' ? convertSmart(inputValue, opts) : convertFull(inputValue, opts);
  }

  // ─── DOM & state ──────────────────────────────────────────────────────────
  let inputEl, outputEl, modeRadios, optNumbers, optLetters, optSymbols, styleSelect;
  let optNumbersOnly, optAuto;
  let copyBtn, downloadBtn, clearBtn, convertSelectionBtn;
  let inputCharsEl, inputSizeEl, outputCharsEl, outputSizeEl, inputWordsEl, outputWordsEl;

  function byteSize(str) {
    if (typeof str !== 'string') return 0;
    return new Blob([str]).size;
  }

  function wordCount(str) {
    if (typeof str !== 'string' || !str.trim()) return 0;
    return str.trim().split(/\s+/).length;
  }

  function updateStats() {
    var inText = inputEl ? inputEl.value : '';
    var outText = outputEl ? outputEl.value : '';
    var inLen = inText.length;
    var outLen = outText.length;
    var inWords = wordCount(inText);
    var outWords = wordCount(outText);
    var inBytes = byteSize(inText);
    var outBytes = byteSize(outText);
    if (inputCharsEl) inputCharsEl.textContent = inLen + ' chars';
    if (inputWordsEl) inputWordsEl.textContent = inWords + ' words';
    if (inputSizeEl) inputSizeEl.textContent = 'Size: ' + inBytes + ' B';
    if (outputCharsEl) outputCharsEl.textContent = outLen + ' chars';
    if (outputWordsEl) outputWordsEl.textContent = outWords + ' words';
    if (outputSizeEl) outputSizeEl.textContent = outBytes + ' B';
  }

  function getOptions() {
    var numbersOnly = optNumbersOnly && optNumbersOnly.checked;
    var ignore = getIgnoreSet();
    var base = {
      numbers: true,
      letters: true,
      symbols: true,
      ignore: ignore
    };
    if (numbersOnly) {
      base.letters = false;
      base.symbols = false;
      return base;
    }
    var n = optNumbers ? optNumbers.checked : true;
    var l = optLetters ? optLetters.checked : true;
    var s = optSymbols ? optSymbols.checked : true;
    var any = n || l || s;
    base.numbers = any ? n : true;
    base.letters = any ? l : true;
    base.symbols = any ? s : true;
    return base;
  }

  function getMode() {
    var checked = document.querySelector('input[name="conversionMode"]:checked');
    if (checked) return checked.value;
    return 'normal';
  }

  function getAuto() {
    return optAuto ? optAuto.checked : true;
  }

  function getConversionType() {
    var btn = document.querySelector('.conv-btn.active');
    if (btn && btn.getAttribute('data-type')) return btn.getAttribute('data-type');
    return 'subscript';
  }

  function getBoldChecked() {
    var el = document.getElementById('optBold');
    return el ? el.checked : false;
  }
  function getItalicChecked() {
    var el = document.getElementById('optItalic');
    return el ? el.checked : false;
  }
  function getStyle() {
    var bold = getBoldChecked();
    var italic = getItalicChecked();
    if (bold && italic) return 'bold-italic';
    if (bold) return 'bold';
    if (italic) return 'italic';
    return 'normal';
  }

  /**
   * Selection-based conversion: if user has a selection in input, convert ONLY
   * that part in the output; rest of output is plain text. If no selection,
   * convert full input. Preserves cursor/selection (we only change output).
   */
  function updateOutput() {
    if (!inputEl || !outputEl) return;
    var text = inputEl.value;
    var mode = getMode();
    var opts = getOptions();
    var start = inputEl.selectionStart;
    var end = inputEl.selectionEnd;
    var hasSelection = typeof start === 'number' && typeof end === 'number' && start < end;
    if (hasSelection) {
      outputEl.value = text.slice(0, start) + runConversion(text.slice(start, end), mode, opts) + text.slice(end);
    } else {
      outputEl.value = runConversion(text, mode, opts);
    }
    applyOutputStyle(getStyle());
    updateCopyButtonState();
    updateStats();
  }

  function updateCopyButtonState() {
    if (copyBtn) copyBtn.disabled = !outputEl || !outputEl.value.length;
  }

  function applyOutputStyle(style) {
    if (!outputEl) return;
    outputEl.classList.remove('style-normal', 'style-bold', 'style-italic', 'style-bold-italic');
    outputEl.classList.add('style-' + (style || 'normal'));
  }

  function bindLiveConversion() {
    function maybeUpdateOutput() {
      if (getAuto()) updateOutput();
    }
    if (inputEl) {
      inputEl.addEventListener('input', maybeUpdateOutput);
      inputEl.addEventListener('change', maybeUpdateOutput);
      inputEl.addEventListener('select', maybeUpdateOutput);
      inputEl.addEventListener('mouseup', maybeUpdateOutput);
      inputEl.addEventListener('keyup', maybeUpdateOutput);
    }
    if (modeRadios && modeRadios.length) {
      modeRadios.forEach(function (r) {
        r.addEventListener('change', updateOutput);
      });
    }
    [optNumbers, optLetters, optSymbols].forEach(function (node) {
      if (node) node.addEventListener('change', updateOutput);
    });
    if (optNumbersOnly) {
      optNumbersOnly.addEventListener('change', function () {
        var lbl = document.getElementById('optNumbersOnlyLabel');
        if (lbl) lbl.textContent = optNumbersOnly.checked ? 'On' : 'Off';
        updateOutput();
      });
    }
    if (optAuto) {
      optAuto.addEventListener('change', function () {
        var lbl = document.getElementById('optAutoLabel');
        if (lbl) lbl.textContent = optAuto.checked ? 'On' : 'Off';
        if (optAuto.checked) updateOutput();
      });
    }
    if (styleSelect) {
      styleSelect.addEventListener('change', function () { applyOutputStyle(getStyle()); });
    }
    document.querySelectorAll('.conv-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.conv-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        updateOutput();
        applyOutputStyle(getStyle());
      });
    });
    var optBoldEl = document.getElementById('optBold');
    var optItalicEl = document.getElementById('optItalic');
    if (optBoldEl) {
      optBoldEl.addEventListener('change', function () {
        updateOutput();
        applyOutputStyle(getStyle());
      });
    }
    if (optItalicEl) {
      optItalicEl.addEventListener('change', function () {
        updateOutput();
        applyOutputStyle(getStyle());
      });
    }
    var ignoreEl = document.getElementById('ignoreChars');
    if (ignoreEl) {
      ignoreEl.addEventListener('input', maybeUpdateOutput);
      ignoreEl.addEventListener('change', maybeUpdateOutput);
    }
  }

  function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function buildCopyHtml(text) {
    var bold = getBoldChecked();
    var italic = getItalicChecked();
    var inner = escapeHtml(text).replace(/\n/g, '<br>');
    if (italic) inner = '<i><em>' + inner + '</em></i>';
    if (bold) inner = '<b><strong>' + inner + '</strong></b>';
    // Don't wrap in <sub>/<sup>: output already has Unicode subscript/superscript (₂₃…)
    // so letters stay normal size and only numbers look subscript when pasted.
    return inner;
  }
  /** Build CF_HTML format string for Word/Windows clipboard (byte offsets in header). */
  function buildCfHtml(innerHtml) {
    var body = '<html><body><!--StartFragment-->' + innerHtml + '<!--EndFragment--></body></html>';
    var header = 'Version:0.9\r\nStartHTML:0000000000\r\nEndHTML:0000000000\r\nStartFragment:0000000000\r\nEndFragment:0000000000\r\n\r\n';
    var full = header + body;
    var enc = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;
    function byteLen(s) {
      if (enc) return enc.encode(s).length;
      return s.length;
    }
    var startHTML = byteLen(header);
    var endHTML = byteLen(full);
    var startFragment = byteLen(header + '<html><body><!--StartFragment-->');
    var endFragment = byteLen(header + '<html><body><!--StartFragment-->' + innerHtml);
    var pad = function (n) { return String(n).padStart(10, '0'); };
    header = 'Version:0.9\r\nStartHTML:' + pad(startHTML) + '\r\nEndHTML:' + pad(endHTML) +
      '\r\nStartFragment:' + pad(startFragment) + '\r\nEndFragment:' + pad(endFragment) + '\r\n\r\n';
    return header + body;
  }
  /** Plain HTML for clipboard (no CF_HTML header so Word doesn't show header text). */
  function buildClipboardHtml(innerFragment) {
    return '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>' + innerFragment + '</body></html>';
  }
  /**
   * Rich copy via 'copy' event: we set clipboardData directly so Word/Docs get
   * exact HTML (no header, only body so nothing extra appears when pasting).
   */
  function copyRichViaCopyEvent(text, showCopied) {
    var inner = buildCopyHtml(text);
    var htmlOnly = buildClipboardHtml(inner);
    var div = document.createElement('div');
    var handler = function (e) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', text);
      e.clipboardData.setData('text/html', htmlOnly);
      document.removeEventListener('copy', handler);
      showCopied();
    };
    document.addEventListener('copy', handler);
    div.contentEditable = 'true';
    div.style.cssText = 'position:fixed;left:-9999px;top:0;min-width:200px;min-height:40px;padding:8px;overflow:hidden;white-space:pre-wrap;';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = inner;
    document.body.appendChild(div);
    try {
      div.focus();
      var range = document.createRange();
      range.selectNodeContents(div);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      var ok = document.execCommand('copy');
      sel.removeAllRanges();
      document.removeEventListener('copy', handler);
      try { document.body.removeChild(div); } catch (e2) {}
      return ok;
    } catch (e) {
      document.removeEventListener('copy', handler);
      try { document.body.removeChild(div); } catch (e2) {}
      return false;
    }
  }
  /** Fallback: copy from contenteditable (browser may sanitize HTML). */
  function copyRichViaExecCommand(text, showCopied) {
    var div = document.createElement('div');
    div.contentEditable = 'true';
    div.style.cssText = 'position:fixed;left:-9999px;top:0;min-width:200px;min-height:40px;padding:8px;overflow:hidden;white-space:pre-wrap;';
    div.setAttribute('aria-hidden', 'true');
    div.innerHTML = buildCopyHtml(text);
    document.body.appendChild(div);
    try {
      div.focus();
      var range = document.createRange();
      range.selectNodeContents(div);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      var ok = document.execCommand('copy');
      sel.removeAllRanges();
      document.body.removeChild(div);
      if (ok) showCopied();
      return ok;
    } catch (e) {
      try { document.body.removeChild(div); } catch (e2) {}
      return false;
    }
  }
  /** Clipboard API with plain HTML (no CF_HTML header). */
  function copyRichViaClipboardApi(text, showCopied) {
    var inner = buildCopyHtml(text);
    var htmlOnly = buildClipboardHtml(inner);
    var plainBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var htmlBlob = new Blob([htmlOnly], { type: 'text/html;charset=utf-8' });
    return navigator.clipboard.write([
      new ClipboardItem({ 'text/plain': plainBlob, 'text/html': htmlBlob })
    ]).then(function () { showCopied(); return true; }).catch(function () { return false; });
  }
  function showClipboardHint() {
    var el = document.getElementById('clipboardHint');
    if (el) el.removeAttribute('hidden');
  }
  function hideClipboardHint() {
    var el = document.getElementById('clipboardHint');
    if (el) el.setAttribute('hidden', '');
  }
  function doCopyOutput(feedbackEl, defaultLabel) {
    if (!outputEl || !outputEl.value.length) return;
    var text = outputEl.value;
    function showCopied() {
      hideClipboardHint();
      if (feedbackEl) {
        feedbackEl.textContent = 'Copied \u2713';
        feedbackEl.classList.add('copy-feedback');
        setTimeout(function () {
          feedbackEl.textContent = defaultLabel;
          feedbackEl.classList.remove('copy-feedback');
        }, 1500);
      }
    }
    var ctype = getConversionType();
    var boldNow = getBoldChecked();
    var italicNow = getItalicChecked();
    var useRich = (boldNow || italicNow) && (ctype === 'subscript' || ctype === 'superscript');
    if (useRich) {
      var done = copyRichViaCopyEvent(text, showCopied);
      if (!done && navigator.clipboard && navigator.clipboard.write) {
        copyRichViaClipboardApi(text, showCopied).then(function (ok) {
          if (!ok) copyRichViaExecCommand(text, showCopied);
        }).catch(function () {
          if (!copyRichViaExecCommand(text, showCopied)) {
            outputEl.select();
            outputEl.setSelectionRange(0, 99999);
            try {
              document.execCommand('copy');
              showCopied();
            } catch (e2) {
              showClipboardHint();
            }
          }
        });
        return;
      }
      if (!done) {
        done = copyRichViaExecCommand(text, showCopied);
      }
      if (!done) {
        outputEl.select();
        outputEl.setSelectionRange(0, 99999);
        try {
          document.execCommand('copy');
          showCopied();
        } catch (e) {
          try {
            navigator.clipboard.writeText(text);
            showCopied();
          } catch (e2) {
            showClipboardHint();
          }
        }
      }
      return;
    }
    // Plain copy: write only text so pasted content is never bold/italic when checkboxes are unchecked
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        showCopied();
      } else {
        outputEl.select();
        outputEl.setSelectionRange(0, 99999);
        document.execCommand('copy');
        showCopied();
      }
    } catch (e) {
      outputEl.select();
      outputEl.setSelectionRange(0, 99999);
      try {
        document.execCommand('copy');
        showCopied();
      } catch (e2) {
        showClipboardHint();
      }
    }
  }
  function copyToClipboard() {
    doCopyOutput(copyBtn, 'Copy to Clipboard');
  }

  function downloadTxt() {
    if (!outputEl) return;
    const text = outputEl.value;
    if (!text) {
      alert('Nothing to download.');
      return;
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscript-output.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  function clearAll() {
    if (inputEl) inputEl.value = '';
    if (outputEl) outputEl.value = '';
    updateOutput();
    updateCopyButtonState();
    updateStats();
  }

  function handleFileUpload(file) {
    if (!file || !inputEl) return;
    var reader = new FileReader();
    reader.onload = function () {
      inputEl.value = typeof reader.result === 'string' ? reader.result : '';
      updateOutput();
      updateCopyButtonState();
      updateStats();
    };
    reader.readAsText(file, 'UTF-8');
  }

  function convertSelectionOnly() {
    if (!inputEl) return;
    var start = inputEl.selectionStart;
    var end = inputEl.selectionEnd;
    if (start === end) {
      if (convertSelectionBtn) {
        var prev = convertSelectionBtn.textContent;
        convertSelectionBtn.textContent = 'Select text first';
        setTimeout(function () { convertSelectionBtn.textContent = prev; }, 1500);
      }
      return;
    }
    var selected = inputEl.value.substring(start, end);
    var mode = getMode();
    var opts = getOptions();
    var converted = runConversion(selected, mode, opts);
    var before = inputEl.value.substring(0, start);
    var after = inputEl.value.substring(end);
    inputEl.value = before + converted + after;
    inputEl.focus();
    inputEl.setSelectionRange(start, start + converted.length);
    updateOutput();
  }

  var THEME_KEY = 'subscript-generator-theme';

  function getTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return 'dark';
  }

  function setTheme(theme) {
    var b = document.body;
    if (theme === 'light') {
      b.classList.remove('dark');
      b.classList.add('light');
      try { localStorage.setItem(THEME_KEY, 'light'); } catch (e) {}
    } else {
      b.classList.add('dark');
      b.classList.remove('light');
      try { localStorage.setItem(THEME_KEY, 'dark'); } catch (e) {}
    }
    var label = document.getElementById('themeLabel');
    if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }

  function init() {
    var savedTheme = getTheme();
    setTheme(savedTheme);
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        var isLight = document.body.classList.contains('light');
        setTheme(isLight ? 'dark' : 'light');
      });
    }

    // Simple header dropdowns for "Legal" / other groups
    var dropdownToggles = document.querySelectorAll('.topbar-dropdown-toggle');
    if (dropdownToggles && dropdownToggles.length) {
      dropdownToggles.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          var parent = btn.closest('.topbar-dropdown');
          if (!parent) return;
          var isOpen = parent.classList.contains('open');
          document.querySelectorAll('.topbar-dropdown.open').forEach(function (d) {
            if (d !== parent) d.classList.remove('open');
          });
          if (!isOpen) parent.classList.add('open');
          else parent.classList.remove('open');
        });
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.topbar-dropdown')) {
          document.querySelectorAll('.topbar-dropdown.open').forEach(function (d) {
            d.classList.remove('open');
          });
        }
      });
    }

    inputEl = document.getElementById('inputText');
    outputEl = document.getElementById('outputText');
    modeRadios = document.querySelectorAll('input[name="conversionMode"]');
    optNumbers = document.getElementById('optNumbers');
    optLetters = document.getElementById('optLetters');
    optSymbols = document.getElementById('optSymbols');
    styleSelect = document.getElementById('styleSelect');
    optNumbersOnly = document.getElementById('optNumbersOnly');
    optAuto = document.getElementById('optAuto');
    copyBtn = document.getElementById('btnCopy');
    downloadBtn = document.getElementById('btnDownload');
    clearBtn = document.getElementById('btnClear');
    convertSelectionBtn = document.getElementById('btnConvertSelection');
    inputCharsEl = document.getElementById('inputChars');
    inputSizeEl = document.getElementById('inputSize');
    inputWordsEl = document.getElementById('inputWords');
    outputCharsEl = document.getElementById('outputChars');
    outputSizeEl = document.getElementById('outputSize');
    outputWordsEl = document.getElementById('outputWords');

    var uploadFileInput = document.getElementById('uploadFile');
    var btnUpload = document.getElementById('btnUpload');
    if (uploadFileInput) {
      uploadFileInput.addEventListener('change', function () {
        var file = uploadFileInput.files && uploadFileInput.files[0];
        handleFileUpload(file);
        uploadFileInput.value = '';
      });
    }
    if (btnUpload && uploadFileInput) {
      btnUpload.addEventListener('click', function () { uploadFileInput.click(); });
    }

    if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadTxt);
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    if (convertSelectionBtn) convertSelectionBtn.addEventListener('click', convertSelectionOnly);
    var clipboardHintDismiss = document.getElementById('clipboardHintDismiss');
    if (clipboardHintDismiss) clipboardHintDismiss.addEventListener('click', hideClipboardHint);

    var btnCopyInput = document.getElementById('btnCopyInput');
    var btnClearInput = document.getElementById('btnClearInput');
    var btnCopyOutput = document.getElementById('btnCopyOutput');
    var btnDownloadOutput = document.getElementById('btnDownloadOutput');
    var btnGenerate = document.getElementById('btnGenerate');
    var btnSample = document.getElementById('btnSample');
    if (btnCopyInput && inputEl) {
      btnCopyInput.addEventListener('click', function () {
        if (!inputEl.value) return;
        try {
          navigator.clipboard.writeText(inputEl.value);
        } catch (e) {
          try { document.execCommand('copy'); } catch (e2) { return; }
        }
        btnCopyInput.textContent = 'Copied \u2713';
        btnCopyInput.classList.add('copy-feedback');
        setTimeout(function () {
          btnCopyInput.textContent = 'Copy';
          btnCopyInput.classList.remove('copy-feedback');
        }, 1200);
      });
    }
    if (btnClearInput && inputEl) {
      btnClearInput.addEventListener('click', function () {
        inputEl.value = '';
        updateOutput();
        updateCopyButtonState();
        updateStats();
      });
    }
    if (btnCopyOutput && outputEl) {
      btnCopyOutput.addEventListener('click', function () {
        doCopyOutput(btnCopyOutput, 'Copy');
      });
    }
    if (btnDownloadOutput && outputEl) {
      btnDownloadOutput.addEventListener('click', downloadTxt);
    }
    if (btnGenerate) btnGenerate.addEventListener('click', updateOutput);
    if (btnSample && inputEl) {
      btnSample.addEventListener('click', function () {
        inputEl.value = 'H2O';
        inputEl.focus();
        updateOutput();
        updateCopyButtonState();
        updateStats();
      });
    }

    document.querySelectorAll('.example-chip[data-example]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var example = btn.getAttribute('data-example');
        var type = btn.getAttribute('data-type');
        if (type) {
          var typeBtn = document.querySelector('.conv-btn[data-type="' + type + '"]');
          if (typeBtn) typeBtn.click();
        }
        if (inputEl && example != null) {
          inputEl.value = example;
          inputEl.focus();
          updateOutput();
          updateCopyButtonState();
          updateStats();
        }
      });
    });

    bindLiveConversion();
    updateOutput();
    updateCopyButtonState();
    updateStats();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
