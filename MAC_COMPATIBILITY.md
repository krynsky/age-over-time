# Mac/Linux Compatibility Fixes

## Summary
This application has been updated to work cross-platform on **Mac, Windows, and Linux**. The previous version used Windows-specific path structures that prevented it from running on Mac and Linux systems.

## Changes Made

### 1. **install.json** - Fixed pip installation
**Before (Windows-only):**
```json
{
  "method": "shell.run",
  "params": {
    "message": "venv\\Scripts\\pip install -r requirements.txt"
  }
}
```

**After (Cross-platform):**
```json
{
  "method": "shell.run",
  "params": {
    "venv": "venv",
    "message": "pip install -r requirements.txt"
  }
}
```

**Why:** The Windows-specific path `venv\Scripts\pip` doesn't exist on Mac/Linux (which use `venv/bin/pip`). Using Pinokio's `venv` parameter automatically handles virtual environment activation on all platforms.

---

### 2. **start.json** - Fixed uvicorn startup
**Before (Windows-only):**
```json
{
  "method": "shell.start",
  "params": {
    "path": ".",
    "message": "venv\\Scripts\\uvicorn main:app --reload --port 8000",
    ...
  }
}
```

**After (Cross-platform):**
```json
{
  "method": "shell.start",
  "params": {
    "path": ".",
    "venv": "venv",
    "message": "uvicorn main:app --reload --port 8000",
    ...
  }
}
```

**Why:** Same issue - `venv\Scripts\uvicorn` is Windows-specific. The `venv` parameter tells Pinokio to activate the virtual environment before running the command.

---

### 3. **uninstall.json** - Fixed directory removal
**Before (Windows-only):**
```json
{
  "method": "shell.run",
  "params": {
    "message": "rmdir /s /q venv"
  }
}
```

**After (Cross-platform):**
```json
{
  "method": "fs.rm",
  "params": {
    "path": "venv"
  }
}
```

**Why:** The Windows command `rmdir /s /q` doesn't work on Mac/Linux (which use `rm -rf`). Pinokio's `fs.rm` method works on all platforms.

---

## How Pinokio's Cross-Platform Support Works

According to the [Pinokio documentation](https://pinokio.co/docs/):

1. **Virtual Environment Activation:** When you specify `"venv": "venv"` in a `shell.run` or `shell.start` command, Pinokio automatically:
   - On **Windows**: Runs `venv\Scripts\activate`
   - On **Mac/Linux**: Runs `source venv/bin/activate`

2. **File System Methods:** Using Pinokio's built-in methods like `fs.rm` instead of OS-specific shell commands ensures compatibility across all platforms.

3. **Path Resolution:** Pinokio uses Node.js's `path.resolve()` internally to handle path differences between operating systems.

## Testing

The application should now work identically on:
- ✅ **Windows** (as before)
- ✅ **macOS** (now fixed)
- ✅ **Linux** (now fixed)

## Additional Resources

- [Pinokio Documentation](https://pinokio.co/docs/)
- [Pinokio shell.run API](https://github.com/pinokiocomputer)
