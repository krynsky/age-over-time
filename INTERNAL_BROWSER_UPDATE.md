# Pinokio Internal Browser Fix

## The Solution

Changed from `start.json` (JSON format) to `start.js` (JavaScript format) to properly open the app in Pinokio's internal browser window.

## Key Changes

### 1. Created `start.js` (NEW)
Uses the same pattern as other Pinokio apps like `dia.git`:

```javascript
module.exports = {
  daemon: true,  // Keeps the app running as a daemon
  run: [
    {
      method: "shell.run",
      params: {
        venv: "venv",
        message: ["uvicorn main:app --reload --port 8000"],
        on: [{
          "event": "/http:\\/\\/\\S+/",  // Captures the server URL from output
          "done": true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}/static/index.html"  // Sets URL for Pinokio to open
      }
    }
  ]
}
```

### 2. Updated `pinokio.js`
Changed the Start menu item to reference `start.js` instead of `start.json`:

```javascript
href: "start.js?fullscreen=true&run=true"  // Was: start.json
```

## How It Works

1. **`daemon: true`** - Tells Pinokio to run this as a background daemon
2. **Event capture** - The regex `/http:\\/\\/\\S+/` captures the server URL from uvicorn's output
3. **`local.set`** - Sets the `url` parameter with the captured URL + `/static/index.html`
4. **Automatic browser opening** - Pinokio automatically opens the URL in its internal browser when `local.set` sets a `url` parameter

## Why This Works

The previous approach using `browser.open` in JSON format wasn't opening in the internal browser correctly. The JavaScript format with `local.set` is the **standard Pinokio pattern** for opening URLs in the internal browser, as used by other Pinokio apps.

## Files

- ✅ **Created**: `start.js` - New JavaScript-based launcher
- ✅ **Modified**: `pinokio.js` - Updated to reference start.js
- ⚠️ **Deprecated**: `start.json` - No longer used (can be removed)

## Result

The app now properly opens in **Pinokio's internal browser window** when launched! 🎉
