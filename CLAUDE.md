# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an advanced Base64 encoding/decoding web tool built with modern vanilla JavaScript, HTML, and CSS. The application provides a comprehensive, client-side interface for converting text and files to Base64 and vice versa, designed for international users with multiple encoding formats and enhanced user experience features.

## Development Commands

### Local Development
```bash
# Open the project directly in a browser (no build process required)
open index.html

# Or use a simple HTTP server for better development experience (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Alternative with Node.js
npx serve .

# Or use PHP's built-in server
php -S localhost:8000
```

### Testing
- No automated tests currently - manual testing in browser
- Test across different browsers for compatibility
- Test file upload functionality with various file types and sizes

## Code Architecture

### Application Structure
- **Pure Client-Side**: No server-side processing, all operations happen in the browser
- **No Build Process**: Direct HTML/CSS/JS files without any bundling or transpilation
- **Modern Web APIs**: Uses modern clipboard, file handling, and local storage APIs
- **International Design**: English interface optimized for global users

### Core Components

#### HTML Structure (`index.html`)
- **Multi-tab Interface**: Three main tabs (Text, File, URL-Safe encoding)
- **Modern Header**: Sticky header with theme toggle and branding
- **Responsive Design**: Mobile-first approach with flexible layout
- **Accessibility**: Proper ARIA labels, semantic HTML, and keyboard navigation
- **SEO Optimized**: Meta descriptions, structured content, and semantic markup

#### JavaScript Architecture (`script.js`)
- **Class-Based Structure**: Modern ES6+ class architecture with modular methods
- **Event-Driven**: Comprehensive event handling for all user interactions
- **Advanced Features**:
  - Live mode with auto-detection of Base64 vs plain text
  - File drag-and-drop with progress indication
  - URL-safe Base64 encoding/decoding
  - Keyboard shortcuts for power users
  - Theme persistence using localStorage
  - Comprehensive error handling and user feedback

#### Styling System (`style.css`)
- **CSS Custom Properties**: Theme system with light/dark mode support
- **Modern Design System**: Consistent spacing, typography, and color schemes
- **Responsive Layout**: Mobile-first design with breakpoints at 768px and 480px
- **Animation System**: Smooth transitions and micro-interactions
- **Accessibility**: Focus management, color contrast, and screen reader support

### Key Features

#### Multi-Format Support
- **Standard Base64**: Traditional text encoding/decoding
- **URL-Safe Base64**: Web-safe encoding for use in URLs and APIs
- **File Encoding**: Direct file upload and encoding up to 10MB
- **Unicode Support**: Proper handling of international characters

#### Advanced User Experience
- **Live Mode**: Real-time conversion as you type
- **Auto-Detection**: Automatically determines if input is Base64 or plain text
- **Smart Clipboard**: One-click copy/paste with visual feedback
- **File Drag & Drop**: Intuitive file handling with visual feedback
- **Download Output**: Save encoded results as text files
- **Input/Output Swap**: Quick reversal of input and output content

#### Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Encode text
- `Ctrl/Cmd + Shift + Enter`: Decode text
- `Ctrl/Cmd + K`: Clear all fields
- `Ctrl/Cmd + Shift + S`: Swap input and output

#### Theme System
- **Dark/Light Mode**: Persistent theme preference
- **System Integration**: Respects user's system theme preference
- **Smooth Transitions**: Animated theme switching

#### Error Handling & Notifications
- **Smart Validation**: Base64 format validation with helpful error messages
- **Toast Notifications**: Non-intrusive success/error feedback
- **File Size Validation**: Prevents oversized file uploads
- **Graceful Degradation**: Fallbacks for older browser APIs

## Technical Implementation

### Modern Web APIs Used
- **Clipboard API**: Modern copy/paste functionality with fallback
- **File API**: File reading and drag-and-drop handling
- **Local Storage**: Theme preference persistence
- **Blob API**: File download functionality
- **CSS Custom Properties**: Dynamic theming system

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Progressive Enhancement**: Core functionality works in older browsers
- **Polyfill Strategy**: Graceful degradation for unsupported features

### Performance Optimizations
- **Efficient DOM Manipulation**: Minimal reflows and repaints
- **Memory Management**: Proper cleanup of blob URLs and event listeners
- **Lazy Loading**: Features loaded only when needed
- **File Size Limits**: 10MB limit to prevent browser crashes

## Security Considerations

### Privacy-First Architecture
- **Client-Side Only**: No data ever sent to external servers
- **No Analytics**: No tracking or data collection
- **Local Processing**: All encryption/decryption happens in browser memory
- **Secure File Handling**: Files processed in memory without persistent storage

### Content Security
- **Input Validation**: Comprehensive validation of all user inputs
- **File Type Checking**: Basic file type validation for security
- **XSS Prevention**: Proper HTML escaping and sanitization
- **Memory Cleanup**: Proper disposal of sensitive data after processing

## Internationalization

### Global User Focus
- **English Interface**: Clear, professional English throughout
- **Unicode Support**: Proper handling of international characters
- **Cultural Considerations**: Design patterns familiar to international users
- **Accessibility**: WCAG 2.1 AA compliance for global accessibility standards