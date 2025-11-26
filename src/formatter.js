/**
 * Generate markdown file from issues
 */
export function generateMarkdown(issues) {
  const now = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let md = `# YouTube Known Issues Tracker

> Automatically updated tracker for YouTube platform issues and updates

**Last Update:** ${dateStr}
**Total Issues:** ${issues.length}

---

## 📊 Summary by Source

`;

  // Count by source
  const sources = {};
  issues.forEach(issue => {
    sources[issue.source] = (sources[issue.source] || 0) + 1;
  });

  Object.entries(sources).forEach(([source, count]) => {
    md += `- **${source}:** ${count} ${count === 1 ? 'issue' : 'issues'}\n`;
  });

  md += `\n---\n\n`;

  // Group by source
  const grouped = {};
  issues.forEach(issue => {
    if (!grouped[issue.source]) {
      grouped[issue.source] = [];
    }
    grouped[issue.source].push(issue);
  });

  // Output each source
  Object.entries(grouped).forEach(([source, sourceIssues]) => {
    md += `## ${getSourceEmoji(source)} ${source}\n\n`;

    sourceIssues.forEach((issue, idx) => {
      const statusBadge = getStatusBadge(issue.status);
      const typeBadge = getTypeBadge(issue.type);

      md += `### ${idx + 1}. ${issue.title}\n\n`;
      md += `${statusBadge} ${typeBadge}\n\n`;

      if (issue.description && issue.description !== "No description available") {
        md += `**Description:**  \n${issue.description}\n\n`;
      }

      md += `**Link:** [View Issue](${issue.url})\n\n`;

      if (issue.publishedAt && issue.publishedAt !== new Date().toISOString().split('T')[0]) {
        const date = new Date(issue.publishedAt).toLocaleDateString('de-DE');
        md += `**Date:** ${date}\n\n`;
      }

      md += `---\n\n`;
    });
  });

  // Footer
  md += `## ℹ️ About

This tracker automatically crawls YouTube Known Issues from multiple sources:

- **YouTube Community:** Official known issues forum
- **Creator Insider:** YouTube's official creator updates channel
- **Google Issue Tracker:** Public YouTube API issues

**Update Frequency:** This file is updated automatically via GitHub Actions.

**Sources:**
- [YouTube Community Known Issues](https://support.google.com/youtube/threads?thread_filter=(purpose%3Aknown_issue))
- [Creator Insider Channel](https://www.youtube.com/@creatorinsider)
- [Google Issue Tracker - YouTube](https://issuetracker.google.com/issues?q=componentid:187190%20status:open)

---

**Generated:** ${now}
**Created by:** [Defischerrocktes.de](https://defischerrocktes.de) | [GitHub](https://github.com/defischerrocktes)
**Repository:** [youtube-issues-tracker](https://github.com/defischerrocktes/youtube-issues-tracker)
`;

  return md;
}

function getSourceEmoji(source) {
  const emojis = {
    'YouTube Community': '💬',
    'Creator Insider': '📺',
    'Google Issue Tracker': '🐛'
  };
  return emojis[source] || '📌';
}

function getStatusBadge(status) {
  const badges = {
    'reported': '🟡 **Status:** Reported',
    'official': '🟢 **Status:** Official',
    'open': '🔴 **Status:** Open',
    'monitoring': '🔵 **Status:** Monitoring',
    'error': '⚠️ **Status:** Error',
    'access_restricted': '🔒 **Status:** Access Restricted'
  };
  return badges[status] || '⚪ **Status:** Unknown';
}

function getTypeBadge(type) {
  const badges = {
    'Known Issue': '`Known Issue`',
    'Official Update': '`Official Update`',
    'API Issue': '`API Issue`'
  };
  return badges[type] || '`Issue`';
}
