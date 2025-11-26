import fs from 'fs';
import path from 'path';
import { crawlAllIssues } from './crawler.js';
import { generateMarkdown } from './formatter.js';

const OUTPUT_FILE = 'YOUTUBE_ISSUES.md';
const CACHE_DIR = 'cache';
const CACHE_FILE = path.join(CACHE_DIR, 'issues-cache.json');

async function main() {
  console.log('🔍 Crawling YouTube Known Issues...\n');

  try {
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // Crawl all issues
    const issues = await crawlAllIssues();

    console.log(`\n✅ Found ${issues.length} issues\n`);

    // Generate markdown
    const markdown = generateMarkdown(issues);

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, markdown, 'utf-8');

    console.log(`✅ Issues written to ${OUTPUT_FILE}`);

    // Cache the results
    const cache = {
      timestamp: new Date().toISOString(),
      count: issues.length,
      issues: issues
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');

    console.log(`✅ Cache updated at ${cache.timestamp}\n`);

    // Show summary
    const sources = {};
    issues.forEach(issue => {
      sources[issue.source] = (sources[issue.source] || 0) + 1;
    });

    console.log('📊 Summary by source:');
    Object.entries(sources).forEach(([source, count]) => {
      console.log(`   ${source}: ${count} issues`);
    });

    console.log('\n✨ Done!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
