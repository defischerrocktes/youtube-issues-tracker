import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const MAX_RESULTS = 50;

/**
 * Crawl all YouTube known issues from multiple sources
 */
export async function crawlAllIssues() {
  const allIssues = [];

  console.log('📡 Fetching from YouTube Community...');
  const communityIssues = await crawlCommunityKnownIssues();
  allIssues.push(...communityIssues);
  console.log(`   Found ${communityIssues.length} issues`);

  // Creator Insider removed - tracks wrong videos (Xbox etc.)
  // console.log('📡 Fetching from Creator Insider...');
  // const creatorInsiderIssues = await fetchCreatorInsiderUpdates();
  // allIssues.push(...creatorInsiderIssues);
  // console.log(`   Found ${creatorInsiderIssues.length} updates`);

  console.log('📡 Fetching from Google Issue Tracker...');
  const issueTrackerIssues = await crawlIssueTracker();
  allIssues.push(...issueTrackerIssues);
  console.log(`   Found ${issueTrackerIssues.length} issues`);

  // Sort by date (most recent first)
  allIssues.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Deduplicate
  const deduped = deduplicateIssues(allIssues);

  return deduped.slice(0, MAX_RESULTS);
}

/**
 * Crawl YouTube Community Help Forum for Known Issues
 */
async function crawlCommunityKnownIssues() {
  const url = 'https://support.google.com/youtube/threads?thread_filter=(purpose%3Aknown_issue)&sjid=16700061819352132796-EU';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 30000
    });

    if (response.status === 401 || response.status === 403) {
      console.warn('   ⚠️  Community crawler blocked. Using fallback.');
      return [{
        source: "YouTube Community",
        type: "Known Issue",
        title: "YouTube Community Known Issues (Access Restricted)",
        description: "Direct crawling is currently blocked. Visit the link manually for the latest updates.",
        url: "https://support.google.com/youtube/threads?thread_filter=(purpose%3Aknown_issue)",
        publishedAt: new Date().toISOString(),
        status: "access_restricted"
      }];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const issues = [];

    // Try to parse threads
    $('.thread-item, .issue-card, .known-issue-item').each((i, el) => {
      const $el = $(el);
      const title = $el.find('.thread-title, .title, h3, h2').first().text().trim();
      const description = $el.find('.thread-description, .description, .summary, p').first().text().trim();
      const link = $el.find('a').first().attr('href');
      const dateStr = $el.find('.date, .timestamp, time').first().text().trim();

      if (title) {
        issues.push({
          source: "YouTube Community",
          type: "Known Issue",
          title: title.substring(0, 200),
          description: description.substring(0, 500) || "No description available",
          url: link ? `https://support.google.com${link}` : url,
          publishedAt: dateStr || new Date().toISOString(),
          status: "reported"
        });
      }
    });

    // If no issues found, add a placeholder
    if (issues.length === 0) {
      return [{
        source: "YouTube Community",
        type: "Known Issue",
        title: "YouTube Community (No Recent Known Issues)",
        description: "No known issues detected at this time, or the page structure has changed.",
        url: url,
        publishedAt: new Date().toISOString(),
        status: "monitoring"
      }];
    }

    return issues;
  } catch (error) {
    console.error('   ❌ Community crawler error:', error.message);
    return [{
      source: "YouTube Community",
      type: "Known Issue",
      title: "YouTube Community (Crawler Error)",
      description: `Error fetching data: ${error.message}`,
      url: "https://support.google.com/youtube/threads?thread_filter=(purpose%3Aknown_issue)",
      publishedAt: new Date().toISOString(),
      status: "error"
    }];
  }
}

/**
 * Fetch Creator Insider updates (YouTube's official updates channel)
 */
async function fetchCreatorInsiderUpdates() {
  // Creator Insider channel RSS/feed or recent videos
  const url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCjBp_7RuDBUYbd1LegWEJ8g';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 30000
    });

    const xml = await response.text();
    const $ = cheerio.load(xml, { xmlMode: true });

    const issues = [];

    $('entry').slice(0, 10).each((i, el) => {
      const $el = $(el);
      const title = $el.find('title').text().trim();
      const link = $el.find('link').attr('href');
      const published = $el.find('published').text().trim();
      const description = $el.find('media\\:description').text().trim() ||
                         $el.find('description').text().trim();

      // Filter for issue-related content
      const isIssueRelated = /issue|bug|problem|fix|update|change/i.test(title);

      if (isIssueRelated) {
        issues.push({
          source: "Creator Insider",
          type: "Official Update",
          title: title.substring(0, 200),
          description: description.substring(0, 500) || "YouTube official update",
          url: link || 'https://www.youtube.com/@creatorinsider',
          publishedAt: published || new Date().toISOString(),
          status: "official"
        });
      }
    });

    if (issues.length === 0) {
      return [{
        source: "Creator Insider",
        type: "Official Update",
        title: "Creator Insider (No Recent Updates)",
        description: "No issue-related updates in recent videos",
        url: 'https://www.youtube.com/@creatorinsider',
        publishedAt: new Date().toISOString(),
        status: "monitoring"
      }];
    }

    return issues;
  } catch (error) {
    console.error('   ❌ Creator Insider error:', error.message);
    return [{
      source: "Creator Insider",
      type: "Official Update",
      title: "Creator Insider (Crawler Error)",
      description: `Error fetching data: ${error.message}`,
      url: 'https://www.youtube.com/@creatorinsider',
      publishedAt: new Date().toISOString(),
      status: "error"
    }];
  }
}

/**
 * Crawl Google Issue Tracker for YouTube API issues
 */
async function crawlIssueTracker() {
  const url = 'https://issuetracker.google.com/issues?q=componentid:187190%20status:open';

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 30000
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const issues = [];

    // Try to parse issue items
    $('.issue-row, .issue-item, [data-issue-id]').slice(0, 15).each((i, el) => {
      const $el = $(el);
      const title = $el.find('.issue-title, .title, [data-title]').first().text().trim();
      const issueId = $el.attr('data-issue-id') || $el.find('[data-issue-id]').attr('data-issue-id');
      const status = $el.find('.status, .issue-status').first().text().trim();

      if (title && issueId) {
        issues.push({
          source: "Google Issue Tracker",
          type: "API Issue",
          title: `[#${issueId}] ${title}`.substring(0, 200),
          description: `Status: ${status || 'Open'}`,
          url: `https://issuetracker.google.com/issues/${issueId}`,
          publishedAt: new Date().toISOString(),
          status: status.toLowerCase() || "open"
        });
      }
    });

    if (issues.length === 0) {
      return [{
        source: "Google Issue Tracker",
        type: "API Issue",
        title: "Google Issue Tracker (No Open Issues)",
        description: "No open YouTube API issues found, or page structure changed",
        url: url,
        publishedAt: new Date().toISOString(),
        status: "monitoring"
      }];
    }

    return issues;
  } catch (error) {
    console.error('   ❌ Issue Tracker error:', error.message);
    return [{
      source: "Google Issue Tracker",
      type: "API Issue",
      title: "Google Issue Tracker (Crawler Error)",
      description: `Error fetching data: ${error.message}`,
      url: url,
      publishedAt: new Date().toISOString(),
      status: "error"
    }];
  }
}

/**
 * Remove duplicate issues based on title similarity
 */
function deduplicateIssues(issues) {
  const seen = new Set();
  const unique = [];

  for (const issue of issues) {
    // Create a normalized key from title
    const normalizedTitle = issue.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 50);

    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle);
      unique.push(issue);
    }
  }

  return unique;
}
