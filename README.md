# 📊 YouTube Known Issues Tracker

> Automated tracker for YouTube platform issues, bugs, and official updates

This project automatically crawls and aggregates YouTube known issues from multiple official sources and displays them in an easy-to-read format on GitHub.

## 🌟 Features

- ✅ **Multi-Source Aggregation:** Combines data from YouTube Community, Creator Insider, and Google Issue Tracker
- ✅ **Automatic Updates:** GitHub Actions runs every 6 hours to fetch latest issues
- ✅ **Deduplication:** Smart filtering to remove duplicate issues
- ✅ **Code Protection:** Obfuscated source code to protect crawling logic
- ✅ **Markdown Output:** Clean, readable issue list with status badges

## 📋 Current Issues

See [YOUTUBE_ISSUES.md](YOUTUBE_ISSUES.md) for the latest tracked issues.

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/youtube-issues-tracker.git
cd youtube-issues-tracker

# Install dependencies
npm install

# Build obfuscated version
npm run build
```

## 🚀 Usage

### Run Locally (Development)

```bash
# Run with readable source code
npm run dev
```

### Run with Obfuscated Code (Production)

```bash
# Build first
npm run build

# Run obfuscated version
npm start
```

### Manual Update

```bash
# Update issues manually
npm run update
```

## 📁 Project Structure

```
youtube-issues-tracker/
├── src/                    # Source code (readable)
│   ├── index.js           # Main entry point
│   ├── crawler.js         # Issue crawling logic
│   └── formatter.js       # Markdown generation
├── dist/                  # Obfuscated code (production)
│   ├── index.js
│   ├── crawler.js
│   └── formatter.js
├── .github/
│   └── workflows/
│       └── update-issues.yml  # GitHub Actions workflow
├── cache/                 # Cached results
├── YOUTUBE_ISSUES.md      # Generated issues file
├── build.js               # Obfuscation script
└── package.json
```

## 🔒 Code Protection

The source code is obfuscated using `javascript-obfuscator` with advanced options:

- ✅ Control flow flattening
- ✅ Dead code injection
- ✅ String array encoding (base64)
- ✅ Self-defending code
- ✅ Identifier name mangling
- ✅ String splitting and rotation

**Note:** The `src/` directory contains readable source code for development. The `dist/` directory contains obfuscated code for production use.

## 🔄 Automatic Updates

GitHub Actions automatically runs the crawler every 6 hours and commits changes if new issues are found.

### Workflow Configuration

See [.github/workflows/update-issues.yml](.github/workflows/update-issues.yml)

**Schedule:** `0 */6 * * *` (every 6 hours)

**Manual Trigger:** Go to Actions → Update YouTube Issues → Run workflow

## 📊 Data Sources

1. **YouTube Community Forum**
   - URL: https://support.google.com/youtube/threads?thread_filter=(purpose%3Aknown_issue)
   - Type: Official known issues

2. **Creator Insider Channel**
   - URL: https://www.youtube.com/@creatorinsider
   - Type: Official YouTube updates

3. **Google Issue Tracker**
   - URL: https://issuetracker.google.com/issues?q=componentid:187190
   - Type: Public API issues

## 🛠️ Development

### Build Obfuscated Version

```bash
npm run build
```

This will:
1. Read all files from `src/`
2. Apply obfuscation
3. Output to `dist/`

### Test Obfuscated Version

```bash
npm start
```

### Add Custom Sources

Edit `src/crawler.js` and add your custom crawling logic:

```javascript
async function crawlCustomSource() {
  // Your crawling logic here
}

// Add to crawlAllIssues()
export async function crawlAllIssues() {
  // ... existing code

  const customIssues = await crawlCustomSource();
  allIssues.push(...customIssues);

  // ... rest of code
}
```

## ⚙️ Configuration

### Change Update Frequency

Edit `.github/workflows/update-issues.yml`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Change this line
```

Examples:
- Every hour: `'0 * * * *'`
- Every 12 hours: `'0 */12 * * *'`
- Daily at midnight: `'0 0 * * *'`

### Change Output File

Edit `src/index.js`:

```javascript
const OUTPUT_FILE = 'YOUTUBE_ISSUES.md';  // Change this
```

## 🐛 Error Handling

The crawler includes comprehensive error handling:

- ✅ Fallback responses for blocked requests
- ✅ Graceful degradation if sources are unavailable
- ✅ Timeout protection (30 seconds per source)
- ✅ Detailed error logging

## 📝 License

MIT License with Attribution

Copyright (c) 2025 Defischerrocktes.de

**Attribution Required:** If you use this code, you must credit "Defischerrocktes.de" in your README, documentation, or application credits.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

**Note:** Only modify files in `src/` directory. The `dist/` directory is auto-generated.

## 📞 Support

For issues or questions:

1. Check [existing issues](https://github.com/YOUR_USERNAME/youtube-issues-tracker/issues)
2. Open a new issue if needed
3. Provide detailed error messages and logs

## 🎯 Roadmap

- [ ] Add webhook notifications for new issues
- [ ] Discord/Slack integration
- [ ] Email notifications
- [ ] Historical data tracking
- [ ] Charts and visualizations
- [ ] Filter by severity/priority
- [ ] Search functionality

---

**Last Updated:** 2025-11-26
**Status:** Active
**Maintained by:** [Your Name]
