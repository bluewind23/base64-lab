class AdvancedBase64Tool {
  constructor() {
    this.settings = this.loadSettings();
    this.currentOutputFormat = 'text';
    this.debounceTimer = null;
    this.translations = {}; // 번역 데이터를 저장할 객체

    // DOM이 준비된 후 초기화 실행
    document.addEventListener('DOMContentLoaded', () => {
      this.initialize();
    });
  }

  async initialize() {
    const translationsLoaded = await this.loadLanguageResources(); // 번역 리소스를 먼저 로드
    
    if (!translationsLoaded) {
      // 번역 파일 로딩 실패 시 기본 동작으로 진행하지만 언어 변경 기능은 비활성화
      console.warn('⚠️ Running without translations - language switching will be disabled');
      this.disableLanguageSelector();
    }
    
    this.initializeElements();
    this.setupEventListeners();
    this.initializeTheme();
    
    if (translationsLoaded) {
      this.initializeLanguage();
    }
    
    this.setupTabs();
    this.applySettings();
    this.toggleOutputWrap();
  }

  async loadLanguageResources() {
    // lang_all.json 파일에서만 번역 데이터 로드
    this.translations = {};
    
    try {
      const response = await fetch('./lang_all.json');
      if (response.ok) {
        this.translations = await response.json();
        console.log('✅ Translations loaded successfully from lang_all.json');
        return true;
      } else {
        console.error('❌ Failed to load lang_all.json:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Error loading lang_all.json:', error);
      return false;
    }
  }


  initializeElements() {
    this.body = document.body;
    this.languageSelector = document.getElementById('languageSelector');

    // Text tab elements
    this.inputText = document.getElementById('inputText');
    this.outputText = document.getElementById('outputText');
    this.encodeBtn = document.getElementById('encodeBtn');
    this.decodeBtn = document.getElementById('decodeBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.copyBtn = document.getElementById('copyBtn');
    this.downloadBtn = document.getElementById('downloadBtn');
    this.swapBtn = document.getElementById('swapBtn');
    this.pasteBtn = document.getElementById('pasteBtn');
    this.charCount = document.getElementById('charCount');
    this.liveMode = document.getElementById('liveMode');
    this.wrapOutput = document.getElementById('wrapOutput');
    this.showImagePreview = document.getElementById('showImagePreview');
    this.decompressGzip = document.getElementById('decompressGzip');
    this.base64Format = document.getElementById('base64Format');

    // Image preview elements
    this.imagePreview = document.getElementById('imagePreview');
    this.previewImage = document.getElementById('previewImage');

    // Output tabs and views
    this.outputTabs = document.querySelectorAll('.output-tab');
    this.outputViews = {
      text: document.getElementById('outputText'),
      hex: document.querySelector('#outputHex textarea'),
      binary: document.querySelector('#outputBinary textarea'),
      utf16: document.querySelector('#outputUtf16 textarea'),
      analysis: document.getElementById('outputAnalysis')
    };

    // Analysis elements
    this.analysisLength = document.getElementById('analysisLength');
    this.analysisSize = document.getElementById('analysisSize');
    this.analysisEncoding = document.getElementById('analysisEncoding');
    this.analysisCharset = document.getElementById('analysisCharset');
    this.analysisLineBreaks = document.getElementById('analysisLineBreaks');

    // File Encode tab elements
    this.fileDropZone = document.getElementById('fileDropZone');
    this.fileInput = document.getElementById('fileInput');
    this.fileSelectBtn = document.getElementById('fileSelectBtn');
    this.fileInfo = document.getElementById('fileInfo');
    this.fileOutput = document.getElementById('fileOutput');
    this.fileOutputText = document.getElementById('fileOutputText');
    this.copyFileBtn = document.getElementById('copyFileBtn');

    // File Decode tab elements
    this.base64ToFileInput = document.getElementById('base64ToFileInput');
    this.decodeFileBtn = document.getElementById('decodeFileBtn');

    // URL tab elements
    this.urlInput = document.getElementById('urlInput');
    this.urlOutput = document.getElementById('urlOutput');
    this.urlEncodeBtn = document.getElementById('urlEncodeBtn');
    this.urlDecodeBtn = document.getElementById('urlDecodeBtn');
    this.copyUrlBtn = document.getElementById('copyUrlBtn');

    // URL Encoding tab elements
    this.urlEncodeInput = document.getElementById('urlEncodeInput');
    this.urlEncodeOutput = document.getElementById('urlEncodeOutput');
    this.urlPercentEncodeBtn = document.getElementById('urlPercentEncodeBtn');
    this.urlPercentDecodeBtn = document.getElementById('urlPercentDecodeBtn');
    this.copyUrlEncodeBtn = document.getElementById('copyUrlEncodeBtn');

    // URL sub-tabs
    this.urlTabs = document.querySelectorAll('.url-tab');
    this.urlTabContents = document.querySelectorAll('.url-tab-content');

    // File options
    this.generateDataUri = document.getElementById('generateDataUri');
    this.compressGzip = document.getElementById('compressGzip');

    // Hash tab elements
    this.hashInput = document.getElementById('hashInput');
    this.hashOutput = document.getElementById('hashOutput');
    this.hashAlgorithm = document.getElementById('hashAlgorithm');
    this.generateHashBtn = document.getElementById('generateHashBtn');
    this.clearHashBtn = document.getElementById('clearHashBtn');
    this.copyHashBtn = document.getElementById('copyHashBtn');

    // Header elements
    this.themeToggle = document.getElementById('themeToggle');
    this.settingsBtn = document.getElementById('settingsBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');
    this.shortcutsBtn = document.getElementById('shortcutsBtn');

    // Settings panel
    this.settingsPanel = document.getElementById('settingsPanel');
    this.overlay = document.getElementById('overlay');
    this.closeSettings = document.getElementById('closeSettings');
    this.saveSettings = document.getElementById('saveSettings');
    this.resetSettings = document.getElementById('resetSettings');

    // Settings elements
    this.autoDetect = document.getElementById('autoDetect');
    this.rememberInput = document.getElementById('rememberInput');
    this.showNotifications = document.getElementById('showNotifications');
    this.fontSize = document.getElementById('fontSize');
    this.wordWrap = document.getElementById('wordWrap');
    this.defaultBase64Format = document.getElementById('defaultBase64Format');

    // Shortcuts Modal
    this.shortcutsModal = document.getElementById('shortcutsModal');
    this.closeShortcuts = document.getElementById('closeShortcuts');

    // Tab navigation
    this.tabs = document.querySelectorAll('.tab');
    this.tabContents = document.querySelectorAll('.tab-content');
  }

  setupEventListeners() {
    // Language
    this.languageSelector.addEventListener('change', (e) => this.setLanguage(e.target.value));

    // Text tab events
    this.encodeBtn.addEventListener('click', () => this.encodeText());
    this.decodeBtn.addEventListener('click', () => this.decodeText());
    this.clearBtn.addEventListener('click', () => this.clearAll());
    this.copyBtn.addEventListener('click', () => this.copyCurrentOutput());
    this.downloadBtn.addEventListener('click', () => this.downloadOutput());
    this.swapBtn.addEventListener('click', () => this.swapInputOutput());
    this.pasteBtn.addEventListener('click', () => this.pasteFromClipboard());

    // Input events
    this.inputText.addEventListener('input', () => {
      this.updateCharCount();
      if (this.liveMode.checked) {
        this.handleDebouncedInput();
      }
      if (this.settings.rememberInput) {
        this.saveInputToStorage();
      }
    });

    this.base64Format.addEventListener('change', () => {
      if (this.inputText.value) {
        this.autoDetectAndConvert();
      }
    });

    this.wrapOutput.addEventListener('change', () => this.toggleOutputWrap());
    this.showImagePreview.addEventListener('change', () => this.toggleImagePreview());

    // Output tab events
    this.outputTabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchOutputFormat(tab.dataset.format));
    });

    // File Encode tab events
    this.fileSelectBtn.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files[0]));
    this.copyFileBtn.addEventListener('click', () => this.copyToClipboard(this.fileOutputText));

    // File Decode tab events
    this.decodeFileBtn.addEventListener('click', () => this.decodeBase64ToFile());

    // Drag and drop
    this.fileDropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
    this.fileDropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
    this.fileDropZone.addEventListener('drop', (e) => this.handleFileDrop(e));

    // URL tab events
    this.urlEncodeBtn.addEventListener('click', () => this.encodeUrlSafe());
    this.urlDecodeBtn.addEventListener('click', () => this.decodeUrlSafe());
    this.copyUrlBtn.addEventListener('click', () => this.copyToClipboard(this.urlOutput));

    // URL Encoding tab events
    this.urlPercentEncodeBtn.addEventListener('click', () => this.encodeUrlPercent());
    this.urlPercentDecodeBtn.addEventListener('click', () => this.decodeUrlPercent());
    this.copyUrlEncodeBtn.addEventListener('click', () => this.copyToClipboard(this.urlEncodeOutput));

    // URL sub-tab navigation
    this.urlTabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchUrlTab(tab.dataset.urlTab));
    });

    // Hash tab events
    this.generateHashBtn.addEventListener('click', () => this.generateHash());
    this.clearHashBtn.addEventListener('click', () => this.clearHash());
    this.copyHashBtn.addEventListener('click', () => this.copyToClipboard(this.hashOutput));

    // Header events
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.settingsBtn.addEventListener('click', () => this.openSettings());
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    this.shortcutsBtn.addEventListener('click', () => this.openShortcutsModal());

    // Settings events
    this.closeSettings.addEventListener('click', () => this.closeSettingsPanel());
    this.overlay.addEventListener('click', () => {
      this.closeSettingsPanel();
      this.closeShortcutsModal();
    });
    this.saveSettings.addEventListener('click', () => this.saveSettingsToStorage());
    this.resetSettings.addEventListener('click', () => this.resetSettingsToDefault());

    // Shortcuts Modal events
    this.closeShortcuts.addEventListener('click', () => this.closeShortcutsModal());

    // Tab navigation
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  }

  setupTabs() {
    this.switchTab('text'); // Default to text tab
    this.switchOutputFormat('text'); // Default output format
    this.switchUrlTab('url-safe'); // Default URL sub-tab
  }

  // Language management
  disableLanguageSelector() {
    if (this.languageSelector) {
      this.languageSelector.disabled = true;
      this.languageSelector.title = 'Language switching disabled - translation file not loaded';
    }
  }

  initializeLanguage() {
    if (!this.translations || Object.keys(this.translations).length === 0) {
      console.warn('⚠️ No translations available');
      return;
    }

    const savedLang = localStorage.getItem('base64-lang') || navigator.language.split('-')[0] || 'en';
    const availableLangs = Object.keys(this.translations);
    const langToSet = availableLangs.includes(savedLang) ? savedLang : 'en';
    
    // 언어 선택기가 존재하고 해당 언어가 사용 가능한 경우에만 설정
    if (this.languageSelector && availableLangs.includes(langToSet)) {
      this.languageSelector.value = langToSet;
      this.setLanguage(langToSet);
    } else {
      console.warn(`⚠️ Language "${langToSet}" not available. Available languages:`, availableLangs);
    }
  }

  setLanguage(lang) {
    console.log(`🌐 Setting language to: ${lang}`);
    
    // 번역 데이터가 없으면 중단
    if (!this.translations || Object.keys(this.translations).length === 0) {
      console.error('❌ No translations available');
      return;
    }

    // 요청된 언어가 없으면 영어로 대체
    const langSet = this.translations[lang];
    if (!langSet) {
      console.warn(`⚠️ Language "${lang}" not found. Available languages:`, Object.keys(this.translations));
      if (this.translations['en']) {
        console.log('🔄 Falling back to English');
        this.setLanguage('en');
        return;
      } else {
        console.error('❌ English fallback not available');
        return;
      }
    }

    localStorage.setItem('base64-lang', lang);
    document.documentElement.lang = lang;

    // 모든 번역 키 적용
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.dataset.langKey;
      const translation = langSet[key];

      if (translation === undefined) {
        console.warn(`⚠️ Translation key "${key}" not found for language "${lang}"`);
        return;
      }

      if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type !== 'checkbox')) {
        el.placeholder = translation;
      } else if (el.dataset.baseText) {
        // charCount와 같이 기본 텍스트와 조합되는 경우
        this.updateCharCount();
      } else if (el.tagName === 'META' && el.name === 'description') {
        el.content = translation;
      } else {
        // innerHTML을 사용하여 링크 등이 포함된 텍스트를 렌더링
        if (translation.includes('<a')) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    console.log(`✅ Language successfully set to: ${lang}`);
  }

  switchTab(tabName) {
    this.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    this.tabContents.forEach(content => {
      const tabId = content.id.replace('-tab', '');
      content.classList.toggle('active', tabId === tabName);
    });
  }

  switchOutputFormat(format) {
    this.currentOutputFormat = format;

    this.outputTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.format === format);
    });

    Object.values(this.outputViews).forEach(view => {
      const parent = view.parentElement.classList.contains('output-view') ? view.parentElement : view;
      parent.classList.add('hidden');
    });

    let activeView = this.outputViews[format];
    if (activeView) {
      const parentToShow = activeView.parentElement.classList.contains('output-view') ? activeView.parentElement : activeView;
      parentToShow.classList.remove('hidden');
    }

    this.updateOutputViews();
  }

  // Theme management
  initializeTheme() {
    const savedTheme = localStorage.getItem('base64-theme') || 'light';
    this.setTheme(savedTheme);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('base64-theme', theme);
  }

  // Settings management
  loadSettings() {
    const defaultSettings = {
      autoDetect: true,
      rememberInput: false,
      showNotifications: true,
      fontSize: 'medium',
      wordWrap: true,
      defaultBase64Format: 'standard'
    };

    const saved = localStorage.getItem('base64-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }

  applySettings() {
    this.autoDetect.checked = this.settings.autoDetect;
    this.rememberInput.checked = this.settings.rememberInput;
    this.showNotifications.checked = this.settings.showNotifications;
    this.fontSize.value = this.settings.fontSize;
    this.wordWrap.checked = this.settings.wordWrap;
    this.defaultBase64Format.value = this.settings.defaultBase64Format;
    this.wrapOutput.checked = this.settings.wordWrap;
    this.toggleOutputWrap();

    const fontSizes = { small: '0.8rem', medium: '0.9rem', large: '1.1rem' };
    document.documentElement.style.setProperty('--font-size-base', fontSizes[this.settings.fontSize] || '0.9rem');

    this.base64Format.value = this.settings.defaultBase64Format;

    if (this.settings.rememberInput) {
      const savedInput = localStorage.getItem('base64-remembered-input');
      if (savedInput) {
        this.inputText.value = savedInput;
        this.updateCharCount();
      }
    }
  }

  openSettings() {
    this.settingsPanel.classList.add('active');
    this.overlay.classList.add('active');
  }

  closeSettingsPanel() {
    this.settingsPanel.classList.remove('active');
    if (!this.shortcutsModal.classList.contains('active')) {
      this.overlay.classList.remove('active');
    }
  }

  saveSettingsToStorage() {
    this.settings = {
      autoDetect: this.autoDetect.checked,
      rememberInput: this.rememberInput.checked,
      showNotifications: this.showNotifications.checked,
      fontSize: this.fontSize.value,
      wordWrap: this.wordWrap.checked,
      defaultBase64Format: this.defaultBase64Format.value
    };

    localStorage.setItem('base64-settings', JSON.stringify(this.settings));
    this.applySettings();
    this.closeSettingsPanel();
    this.showSuccess('Settings saved successfully!');
  }

  resetSettingsToDefault() {
    if (confirm('Are you sure you want to reset all settings to their default values?')) {
      localStorage.removeItem('base64-settings');
      this.settings = this.loadSettings();
      this.applySettings();
      this.showSuccess('Settings have been reset to default.');
    }
  }

  saveInputToStorage() {
    localStorage.setItem('base64-remembered-input', this.inputText.value);
  }

  // Live Mode Debouncing
  handleDebouncedInput() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.autoDetectAndConvert();
    }, 250); // 250ms delay
  }

  // Enhanced Base64 encoding/decoding
  encodeText() {
    try {
      const input = this.inputText.value;
      if (!input) {
        this.showError('Please enter some text to encode.');
        return;
      }

      let encoded = this.encodeWithFormat(input, this.base64Format.value);
      this.outputText.value = encoded;
      this.updateOutputViews();

      if (this.settings.showNotifications) {
        this.showSuccess('Text encoded successfully!');
      }
    } catch (error) {
      this.showError('Encoding failed: ' + error.message);
    }
  }

  decodeText() {
    try {
      const input = this.inputText.value.trim();
      if (!input) {
        this.showError('Please enter Base64 text to decode.');
        return;
      }

      if (!this.isValidBase64(input, this.base64Format.value)) {
        this.showError('Invalid Base64 string. Please check your input and the selected format.');
        return;
      }

      const decoded = this.decodeWithFormat(input, this.base64Format.value);
      this.outputText.value = decoded;
      this.updateOutputViews();
      this.checkAndShowImagePreview(input);

      if (this.settings.showNotifications) {
        this.showSuccess('Text decoded successfully!');
      }
    } catch (error) {
      this.showError('Decoding failed: ' + error.message);
    }
  }

  encodeWithFormat(input, format) {
    const utf8Bytes = new TextEncoder().encode(input);
    const binaryString = String.fromCharCode(...utf8Bytes);
    const standard = btoa(binaryString);

    switch (format) {
      case 'url-safe':
        return standard
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
      case 'mime':
        return standard.match(/.{1,76}/g) ?.join('\n') || '';
      default: // standard
        return standard;
    }
  }

  decodeWithFormat(input, format) {
    let processedInput = input;
    if (format === 'url-safe') {
      processedInput = input.replace(/-/g, '+').replace(/_/g, '/');
      while (processedInput.length % 4) {
        processedInput += '=';
      }
    } else { // standard and mime
      processedInput = input.replace(/\s/g, '');
    }

    const binaryString = atob(processedInput);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Gzip 자동 압축 해제 시도
    if (this.decompressGzip && this.decompressGzip.checked && typeof pako !== 'undefined') {
      try {
        const decompressed = pako.inflate(bytes, { to: 'string' });
        return decompressed;
      } catch (gzipError) {
        // Gzip 압축이 아닌 경우 일반 디코딩으로 계속 진행
        console.log('Not gzip compressed data, proceeding with normal decoding');
      }
    }

    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    } catch (e) {
      // Fallback for non-UTF8 content
      return new TextDecoder('latin1').decode(bytes);
    }
  }

  autoDetectAndConvert() {
    if (!this.settings.autoDetect) return;

    const input = this.inputText.value.trim();
    if (!input) {
      this.outputText.value = '';
      this.updateOutputViews();
      return;
    }

    if (this.isValidBase64(input, this.base64Format.value)) {
      this.decodeText();
    } else {
      this.encodeText();
    }
  }

  isValidBase64(str, format) {
    str = str.trim();
    if (format !== 'mime' && /\s/.test(str)) return false;

    let regex;
    switch (format) {
      case 'url-safe':
        regex = /^[A-Za-z0-9_-]*$/;
        break;
      case 'mime':
        // A bit loose to allow for variations, main check is atob
        regex = /^[A-Za-z0-9+/=\s]*$/;
        break;
      default: // standard
        regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (str.length % 4 !== 0) return false;
    }

    if (!regex.test(str)) return false;

    try {
      this.decodeWithFormat(str, format);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Enhanced output views
  updateOutputViews() {
    const text = this.outputText.value;
    if (!text) {
      this.clearOutputViews();
      return;
    }

    this.outputViews.hex.value = this.textToHex(text);
    this.outputViews.binary.value = this.textToBinary(text);
    this.outputViews.utf16.value = this.textToUtf16(text);
    this.updateAnalysis(text);
  }

  clearOutputViews() {
    this.outputViews.hex.value = '';
    this.outputViews.binary.value = '';
    this.outputViews.utf16.value = '';
    this.updateAnalysis('');
    this.hideImagePreview();
  }

  textToHex(text) {
    return Array.from(new TextEncoder().encode(text))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join(' ');
  }

  textToBinary(text) {
    return Array.from(new TextEncoder().encode(text))
      .map(byte => byte.toString(2).padStart(8, '0'))
      .join(' ');
  }

  textToUtf16(text) {
    return Array.from(text)
      .map(char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'))
      .join('');
  }

  updateAnalysis(text) {
    if (!text) {
      this.analysisLength.textContent = '0';
      this.analysisSize.textContent = '0 bytes';
      this.analysisEncoding.textContent = 'N/A';
      this.analysisCharset.textContent = 'N/A';
      this.analysisLineBreaks.textContent = '0';
      return;
    }

    const bytes = new TextEncoder().encode(text);
    const lineBreaks = (text.match(/\n/g) || []).length;
    const hasNonAscii = /[^\x00-\x7F]/.test(text);

    this.analysisLength.textContent = text.length.toLocaleString();
    this.analysisSize.textContent = `${bytes.length.toLocaleString()} bytes`;
    this.analysisEncoding.textContent = this.detectInputEncoding(this.inputText.value);
    this.analysisCharset.textContent = hasNonAscii ? 'UTF-8' : 'ASCII';
    this.analysisLineBreaks.textContent = lineBreaks.toLocaleString();
  }

  checkAndShowImagePreview(base64Input) {
    if (!this.showImagePreview.checked) {
      this.hideImagePreview();
      return;
    }

    try {
      // Check if it's a Data URI or plain Base64 that could be an image
      let dataUri = base64Input.trim();
      
      if (dataUri.startsWith('data:')) {
        // Already a Data URI
        this.showImagePreview(dataUri);
      } else {
        // Try to detect if it's an image by checking the decoded bytes
        const cleanBase64 = dataUri.replace(/\s/g, '');
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const imageType = this.detectImageType(bytes);
        if (imageType) {
          dataUri = `data:${imageType};base64,${cleanBase64}`;
          this.showImagePreview(dataUri);
        } else {
          this.hideImagePreview();
        }
      }
    } catch (error) {
      this.hideImagePreview();
    }
  }

  detectImageType(bytes) {
    // Check file signatures for common image types
    const signatures = {
      'image/jpeg': [0xFF, 0xD8, 0xFF],
      'image/png': [0x89, 0x50, 0x4E, 0x47],
      'image/gif': [0x47, 0x49, 0x46, 0x38],
      'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header, need to check further
      'image/bmp': [0x42, 0x4D],
      'image/tiff': [0x49, 0x49, 0x2A, 0x00] // Little endian TIFF
    };

    for (const [mimeType, signature] of Object.entries(signatures)) {
      if (signature.every((byte, index) => bytes[index] === byte)) {
        // Special case for WebP - need to check WEBP signature at offset 8
        if (mimeType === 'image/webp') {
          const webpSig = [0x57, 0x45, 0x42, 0x50]; // "WEBP"
          if (bytes.length >= 12 && webpSig.every((byte, index) => bytes[8 + index] === byte)) {
            return mimeType;
          }
        } else {
          return mimeType;
        }
      }
    }

    // Check for TIFF big endian
    if (bytes.length >= 4 && bytes[0] === 0x4D && bytes[1] === 0x4D && bytes[2] === 0x00 && bytes[3] === 0x2A) {
      return 'image/tiff';
    }

    return null;
  }

  showImagePreview(dataUri) {
    this.previewImage.src = dataUri;
    this.imagePreview.classList.remove('hidden');
    
    // Handle image load errors
    this.previewImage.onerror = () => {
      this.hideImagePreview();
    };
  }

  hideImagePreview() {
    this.imagePreview.classList.add('hidden');
    this.previewImage.src = '';
  }

  toggleImagePreview() {
    if (!this.showImagePreview.checked) {
      this.hideImagePreview();
    } else {
      // Re-check current input for images
      const input = this.inputText.value.trim();
      if (input && this.isValidBase64(input, this.base64Format.value)) {
        this.checkAndShowImagePreview(input);
      }
    }
  }

  // Hash generation functions
  async generateHash() {
    try {
      const input = this.hashInput.value;
      if (!input) {
        this.showError('Please enter some text to hash.');
        return;
      }

      const algorithm = this.hashAlgorithm.value;
      const hash = await this.computeHash(algorithm, input);
      this.hashOutput.value = hash;
      
      if (this.settings.showNotifications) {
        this.showSuccess(`${algorithm} hash generated successfully!`);
      }
    } catch (error) {
      this.showError('Hash generation failed: ' + error.message);
    }
  }

  async computeHash(algorithm, data) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest(algorithm, encodedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  clearHash() {
    this.hashInput.value = '';
    this.hashOutput.value = '';
  }

  detectInputEncoding(text) {
    if (this.isValidBase64(text, 'standard')) return 'Base64';
    if (this.isValidBase64(text, 'url-safe')) return 'URL-Safe Base64';
    if (/^[0-9a-fA-F\s]+$/.test(text) && !/[^0-9a-fA-F\s]/.test(text)) return 'Hex';
    if (/^[01\s]+$/.test(text) && !/[^01\s]/.test(text)) return 'Binary';
    return 'Plain Text';
  }

  // Enhanced copy functionality
  copyCurrentOutput() {
    const format = this.currentOutputFormat;
    let textToCopy = '';

    if (format === 'analysis') {
      textToCopy = this.getAnalysisText();
    } else {
      textToCopy = this.outputViews[format] ?.value || '';
    }

    this.copyToClipboard({ value: textToCopy });
  }

  getAnalysisText() {
    return `Length: ${this.analysisLength.textContent}\nSize: ${this.analysisSize.textContent}\nDetected Encoding: ${this.analysisEncoding.textContent}\nCharacter Set: ${this.analysisCharset.textContent}\nLine Breaks: ${this.analysisLineBreaks.textContent}`;
  }

  // URL-safe encoding/decoding
  encodeUrlSafe() {
    try {
      const input = this.urlInput.value;
      if (!input) {
        this.showError('Please enter some text to encode.');
        return;
      }
      this.urlOutput.value = this.encodeWithFormat(input, 'url-safe');
      if (this.settings.showNotifications) this.showSuccess('Text encoded as URL-safe Base64!');
    } catch (error) {
      this.showError('URL-safe encoding failed: ' + error.message);
    }
  }

  decodeUrlSafe() {
    try {
      const input = this.urlInput.value.trim();
      if (!input) {
        this.showError('Please enter URL-safe Base64 text to decode.');
        return;
      }
      this.urlOutput.value = this.decodeWithFormat(input, 'url-safe');
      if (this.settings.showNotifications) this.showSuccess('URL-safe Base64 decoded successfully!');
    } catch (error) {
      this.showError('URL-safe decoding failed: Invalid format.');
    }
  }

  switchUrlTab(tabName) {
    this.urlTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.urlTab === tabName);
    });

    this.urlTabContents.forEach(content => {
      const contentId = content.id.replace('-content', '');
      content.classList.toggle('active', contentId === tabName);
    });
  }

  // URL Percent Encoding/Decoding
  encodeUrlPercent() {
    try {
      const input = this.urlEncodeInput.value;
      if (!input) {
        this.showError('Please enter some text to URL encode.');
        return;
      }
      this.urlEncodeOutput.value = encodeURIComponent(input);
      if (this.settings.showNotifications) this.showSuccess('Text URL encoded successfully!');
    } catch (error) {
      this.showError('URL encoding failed: ' + error.message);
    }
  }

  decodeUrlPercent() {
    try {
      const input = this.urlEncodeInput.value.trim();
      if (!input) {
        this.showError('Please enter URL encoded text to decode.');
        return;
      }
      this.urlEncodeOutput.value = decodeURIComponent(input);
      if (this.settings.showNotifications) this.showSuccess('URL encoded text decoded successfully!');
    } catch (error) {
      this.showError('URL decoding failed: Invalid URL encoding.');
    }
  }

  // File handling
  handleFileSelect(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      this.showError('File size must be less than 10MB.');
      return;
    }
    this.processFile(file);
  }

  handleDragOver(e) {
    e.preventDefault();
    this.fileDropZone.classList.add('drag-over');
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.fileDropZone.classList.remove('drag-over');
  }

  handleFileDrop(e) {
    e.preventDefault();
    this.fileDropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) this.handleFileSelect(files[0]);
  }

  processFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        let result = e.target.result;
        let base64 = result.split(',')[1];
        
        // Gzip 압축 옵션이 선택된 경우
        if (this.compressGzip && this.compressGzip.checked && typeof pako !== 'undefined') {
          try {
            // Base64를 바이너리로 변환
            const binaryString = atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Gzip 압축
            const compressed = pako.gzip(bytes);
            base64 = btoa(String.fromCharCode(...compressed));
            
            if (this.settings.showNotifications) {
              this.showSuccess(`File compressed and encoded! Original: ${file.size} bytes, Compressed: ${compressed.length} bytes`);
            }
          } catch (compressionError) {
            console.error('Compression failed:', compressionError);
            this.showError('Compression failed, using uncompressed data.');
          }
        }
        
        // Data URI 생성 옵션이 선택된 경우
        if (this.generateDataUri && this.generateDataUri.checked) {
          const mimeType = file.type || 'application/octet-stream';
          base64 = `data:${mimeType};base64,${base64}`;
        }
        
        this.showFileInfo(file);
        this.fileOutputText.value = base64;
        this.fileOutput.classList.remove('hidden');
        
        if (this.settings.showNotifications && !this.compressGzip.checked) {
          this.showSuccess(`File "${file.name}" encoded successfully!`);
        }
      } catch (error) {
        this.showError('File processing failed: ' + error.message);
      }
    };
    reader.onerror = () => this.showError('Failed to read file.');
    reader.readAsDataURL(file);
  }

  detectMimeTypeAndExtension(uint8Array) {
    const signatures = {
      // Images
      'FFD8FFE0': { mime: 'image/jpeg', ext: 'jpg' },
      '89504E47': { mime: 'image/png', ext: 'png' },
      '47494638': { mime: 'image/gif', ext: 'gif' },
      '52494646': { mime: 'image/webp', ext: 'webp' },
      '49492A00': { mime: 'image/tiff', ext: 'tif' },
      '4D4D002A': { mime: 'image/tiff', ext: 'tif' },
      '424D': { mime: 'image/bmp', ext: 'bmp' },

      // Documents
      '25504446': { mime: 'application/pdf', ext: 'pdf' },
      '504B0304': { mime: 'application/zip', ext: 'zip' }, // Also for docx, xlsx etc.

      // Audio/Video
      '494433': { mime: 'audio/mpeg', ext: 'mp3' },
      '664C6143': { mime: 'audio/flac', ext: 'flac' },
    };

    const hex = Array.from(uint8Array.slice(0, 4))
      .map(byte => byte.toString(16).toUpperCase().padStart(2, '0'))
      .join('');

    for (const sig in signatures) {
      if (hex.startsWith(sig)) {
        return signatures[sig];
      }
    }

    if (hex.startsWith('504B0304')) {
      return { mime: 'application/zip', ext: 'zip' };
    }

    try {
      new TextDecoder('utf-8', { fatal: true }).decode(uint8Array.slice(0, 1024));
      return { mime: 'text/plain', ext: 'txt' };
    } catch (e) {
      // Not valid UTF-8
    }

    return { mime: 'application/octet-stream', ext: 'bin' }; // Default
  }

  decodeBase64ToFile() {
    const base64 = this.base64ToFileInput.value.trim();
    if (!base64) {
      this.showError('Please paste a Base64 string to decode.');
      return;
    }

    try {
      const binaryString = atob(base64.replace(/\s/g, ''));
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const fileInfo = this.detectMimeTypeAndExtension(bytes);
      const suggestedFilename = `decoded-file-${Date.now()}.${fileInfo.ext}`;
      const blob = new Blob([bytes], { type: fileInfo.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = prompt("Please enter a filename for the download:", suggestedFilename);

      if (filename) {
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showSuccess('File decoded and download started!');
      }
    } catch (error) {
      this.showError('Decoding failed. The input is not a valid Base64 string.');
    }
  }

  showFileInfo(file) {
    const sizeInKB = (file.size / 1024).toFixed(2);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const displaySize = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;

    // [보안 수정] innerHTML 대신 textContent와 DOM API를 사용하여 XSS 위험 제거
    this.fileInfo.innerHTML = '<h4>File Information</h4>'; // 제목은 정적이므로 그대로 둠

    const createInfoP = (label, value) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = `${label}: `;
      p.appendChild(strong);
      p.appendChild(document.createTextNode(value));
      return p;
    };

    this.fileInfo.appendChild(createInfoP('Name', file.name));
    this.fileInfo.appendChild(createInfoP('Size', displaySize));
    this.fileInfo.appendChild(createInfoP('Type', file.type || 'Unknown'));
    this.fileInfo.appendChild(createInfoP('Last Modified', new Date(file.lastModified).toLocaleString()));

    this.fileInfo.classList.remove('hidden');
  }

  // Utility functions
  clearAll() {
    this.inputText.value = '';
    this.outputText.value = '';
    this.clearOutputViews();
    this.updateCharCount();
    this.hideImagePreview();
  }

  swapInputOutput() {
    const temp = this.inputText.value;
    this.inputText.value = this.outputText.value;
    this.outputText.value = temp;
    this.inputText.dispatchEvent(new Event('input')); // Explicitly trigger event for updates
  }

  updateCharCount() {
    const count = this.inputText.value.length;
    const lang = this.languageSelector.value;
    const langSet = this.translations[lang] || this.translations['en'];
    const charCountSuffix = langSet.char_count || ' characters';

    this.charCount.textContent = `${count.toLocaleString()}${charCountSuffix}`;
  }


  toggleOutputWrap() {
    const shouldWrap = this.wrapOutput.checked;
    const textareas = [this.outputText, ...Object.values(this.outputViews).filter(v => v.tagName === 'TEXTAREA')];

    textareas.forEach(textarea => {
      textarea.style.whiteSpace = shouldWrap ? 'pre-wrap' : 'pre';
      textarea.style.wordBreak = shouldWrap ? 'break-all' : 'normal';
    });
  }

  toggleFullscreen() {
    this.body.classList.toggle('fullscreen');
  }

  async copyToClipboard(element) {
    try {
      const text = element.value;
      if (!text) {
        this.showError('Nothing to copy.');
        return;
      }
      await navigator.clipboard.writeText(text);
      if (this.settings.showNotifications) this.showSuccess('Copied to clipboard!');
    } catch (error) {
      element.select();
      document.execCommand('copy');
      if (this.settings.showNotifications) this.showSuccess('Copied to clipboard!');
    }
  }

  async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      this.inputText.value = text;
      this.inputText.dispatchEvent(new Event('input'));
      if (this.settings.showNotifications) this.showSuccess('Pasted from clipboard!');
    } catch (error) {
      this.showError('Failed to read from clipboard. Please paste manually.');
    }
  }

  downloadOutput() {
    const text = this.outputText.value;
    if (!text) {
      this.showError('Nothing to download.');
      return;
    }
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-output-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (this.settings.showNotifications) this.showSuccess('File downloaded successfully!');
  }

  openShortcutsModal() {
    this.shortcutsModal.classList.add('active');
    this.overlay.classList.add('active');
  }

  closeShortcutsModal() {
    this.shortcutsModal.classList.remove('active');
    if (!this.settingsPanel.classList.contains('active')) {
      this.overlay.classList.remove('active');
    }
  }

  handleKeyboardShortcuts(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (this.body.classList.contains('fullscreen')) {
        this.toggleFullscreen();
      }
      this.closeSettingsPanel();
      this.closeShortcutsModal();
      return;
    }

    if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      this.openShortcutsModal();
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'enter':
          e.preventDefault();
          e.shiftKey ? this.decodeText() : this.encodeText();
          break;
        case 'k':
          e.preventDefault(); this.clearAll(); break;
        case ',':
          e.preventDefault(); this.openSettings(); break;
        case 's':
          if (e.shiftKey) {
            e.preventDefault();
            this.swapInputOutput();
          }
          break;
      }
    }
  }

  // Notification system
  showSuccess(message) {
    if (!this.settings.showNotifications) return;
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const colors = { success: 'var(--success-color)', error: 'var(--danger-color)', info: 'var(--primary-color)' };
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px;
      background: ${colors[type]};
      color: white; padding: 1rem 1.5rem; border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg); z-index: 2000;
      transform: translateX(120%); transition: transform 0.3s ease;
      max-width: 300px; word-wrap: break-word;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
      notification.style.transform = 'translateX(120%)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// 클래스 인스턴스 생성
new AdvancedBase64Tool();