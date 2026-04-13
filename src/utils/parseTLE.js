import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '..', 'TLE_ALL.txt');
const outputPath = path.join(__dirname, '..', '..', 'public', 'data', 'roadmap.json');

// ──────────────────────────────────────────────
// 1. Fetch Codeforces problem titles via their API
// ──────────────────────────────────────────────
let cfProblemsMap = null; // { "4A": "Watermelon", ... }

async function loadCodeforcesProblems() {
  console.log('[CF] Fetching Codeforces problem database...');
  try {
    const res = await fetch('https://codeforces.com/api/problemset.problems');
    const json = await res.json();
    if (json.status !== 'OK') throw new Error('CF API returned non-OK');
    cfProblemsMap = {};
    for (const p of json.result.problems) {
      const key = `${p.contestId}${p.index}`;
      cfProblemsMap[key] = p.name;
      // Also store with slash for lookup
      cfProblemsMap[`${p.contestId}/${p.index}`] = p.name;
    }
    console.log(`[CF] Loaded ${Object.keys(cfProblemsMap).length / 2} problems from Codeforces API`);
  } catch (e) {
    console.error('[CF] Failed to fetch CF problems:', e.message);
    cfProblemsMap = {};
  }
}

// ──────────────────────────────────────────────
// 2. Fetch title from CSES by scraping <title>
// ──────────────────────────────────────────────
async function fetchCSESTitle(taskId) {
  try {
    const res = await fetch(`https://cses.fi/problemset/task/${taskId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const match = html.match(/<title>\s*CSES\s*-\s*(.*?)\s*<\/title>/i);
    if (match) return match[1].trim();
  } catch (e) { /* ignore */ }
  return null;
}

// ──────────────────────────────────────────────
// 3. Fetch title from LeetCode (from slug)
// ──────────────────────────────────────────────
async function fetchLeetCodeTitle(slug) {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({
        query: `query { question(titleSlug: "${slug}") { title } }`,
      }),
    });
    const json = await res.json();
    if (json?.data?.question?.title) return json.data.question.title;
  } catch (e) { /* ignore */ }
  return null;
}

// ──────────────────────────────────────────────
// 4. Generic title fetch via <title> tag
// ──────────────────────────────────────────────
async function fetchGenericTitle(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();
    const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
    if (match) {
      let t = match[1].trim()
        .replace(/\s*\|.*$/, '')
        .replace(/\s*-\s*(GeeksforGeeks|SPOJ|HackerRank|AtCoder|CodeChef|Practice).*$/i, '')
        .trim();
      if (t && t.length > 1 && !t.toLowerCase().includes('just a moment')) return t;
    }
  } catch (e) { /* ignore */ }
  return null;
}

// ──────────────────────────────────────────────
// Parse URL into platform, fallback title, and id
// ──────────────────────────────────────────────
function parsePlatformAndTitle(url) {
  let platform = 'Unknown';
  let title = 'Problem';
  let difficulty = 'Medium';
  let id = url;
  let cfKey = null;     // for CF API lookup
  let csesTaskId = null; // for CSES scrape
  let lcSlug = null;     // for LeetCode GraphQL

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');
    const pathname = urlObj.pathname;

    if (hostname.includes('codeforces')) {
      platform = 'Codeforces';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.includes('problemset') && parts.includes('problem')) {
        const idx = parts.indexOf('problem');
        cfKey = `${parts[idx+1]}${parts[idx+2] || ''}`;
        title = cfKey;
      } else if (parts.includes('contest') && parts.includes('problem')) {
        const cdx = parts.indexOf('contest');
        const pdx = parts.indexOf('problem');
        cfKey = `${parts[cdx+1]}${parts[pdx+1] || ''}`;
        title = cfKey;
      } else {
        title = parts[parts.length - 1];
      }
      id = `cf-${cfKey || title}`;

    } else if (hostname.includes('leetcode.com')) {
      platform = 'LeetCode';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.includes('problems')) {
        const idx = parts.indexOf('problems');
        lcSlug = parts[idx+1];
        title = lcSlug ? lcSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'LeetCode Problem';
        id = `lc-${lcSlug}`;
      }

    } else if (hostname.includes('cses.fi')) {
      platform = 'CSES';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.includes('task')) {
        csesTaskId = parts[parts.indexOf('task')+1];
        title = `CSES Task ${csesTaskId}`;
        id = `cses-${csesTaskId}`;
      }

    } else if (hostname.includes('codechef.com')) {
      platform = 'CodeChef';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.includes('problems')) {
        title = parts[parts.indexOf('problems')+1];
        id = `cc-${title}`;
      }

    } else if (hostname.includes('geeksforgeeks.org')) {
      platform = 'GeeksforGeeks';
      const parts = pathname.split('/').filter(Boolean);
      const raw = parts.includes('problems') ? parts[parts.indexOf('problems')+1] : parts[parts.length-1];
      title = raw ? raw.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'GFG Problem';
      id = `gfg-${raw || url}`;

    } else if (hostname.includes('spoj.com')) {
      platform = 'SPOJ';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.includes('problems')) {
        title = parts[parts.indexOf('problems')+1];
        id = `spoj-${title}`;
      }

    } else if (hostname.includes('atcoder.jp')) {
      platform = 'AtCoder';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.includes('tasks')) {
        title = parts[parts.indexOf('tasks')+1];
        id = `atc-${title}`;
      }

    } else if (hostname.includes('hackerrank.com')) {
      platform = 'HackerRank';
      const parts = pathname.split('/').filter(Boolean);
      if (parts.includes('challenges')) {
        const slug = parts[parts.indexOf('challenges')+1];
        title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        id = `hr-${slug}`;
      }

    } else if (hostname.includes('codingninjas.com')) {
      platform = 'CodingNinjas';
      title = 'CodingNinjas Problem';
      id = `cn-${url}`;

    } else {
      title = pathname.split('/').filter(Boolean).pop() || url;
    }
  } catch(e) { /* ignore */ }

  return { title, platform, difficulty, id, cfKey, csesTaskId, lcSlug };
}

const cfPrivateGroupsMap = {
  "219158A": "Say Hello With C++", "219158B": "Basic Data Types", "219158C": "Simple Calculator", "219158D": "Difference", "219158E": "Area of a Circle", "219158F": "Digits Summation", "219158G": "Summation from 1 to N", "219158H": "Two numbers", "219158I": "Welcome for you with Conditions", "219158J": "Multiples", "219158K": "Max and Min", "219158L": "The Brothers", "219158M": "Capital or Small or Digit", "219158N": "Char", "219158O": "Calculator", "219158P": "First digit !", "219158Q": "Coordinates of a Point", "219158R": "Age in Days", "219158S": "Interval", "219158T": "Sort Numbers", "219158U": "Float or int", "219158V": "Comparison", "219158W": "Mathematical Expression", "219158X": "Two intervals", "219158Y": "The last 2 digits", "219158Z": "Hard Compare",
  "219432A": "1 to N", "219432B": "Even Numbers", "219432C": "Even, Odd, Positive and Negative", "219432D": "Fixed Password", "219432E": "Max", "219432F": "Multiplication table", "219432G": "Factorial", "219432H": "One Prime", "219432I": "Palindrome", "219432J": "Primes from 1 to n", "219432K": "Divisors", "219432L": "GCD", "219432M": "Lucky Numbers", "219432N": "Numbers Histogram", "219432O": "Pyramid", "219432P": "Shape1", "219432Q": "Digits", "219432R": "Sequence of Numbers and Sum", "219432S": "Sum of Consecutive Odd Numbers", "219432T": "Shape2", "219432U": "Some Sums", "219432V": "PUM", "219432W": "Shape3", "219432X": "Convert To Decimal 2", "219432Y": "Easy Fibonacci", "219432Z": "Three Numbers",
  "219774O": "Sort String",
  "326907D": "Strings",
  "329103G": "Even Hate Odd",
  "223339V": "Creating Expression1",
  "950C": "Zebras",
  "782B": "The Meeting Place Cannot Be Changed",
  "669E": "Little Artem and Time Machine"
};

// ──────────────────────────────────────────────
// Resolve actual titles for all problems
// ──────────────────────────────────────────────
async function resolveTitle(problem, meta) {
  // Codeforces: use pre-loaded API data, private maps, or formatter
  if (meta.cfKey) {
    if (cfProblemsMap && cfProblemsMap[meta.cfKey]) {
      problem.title = cfProblemsMap[meta.cfKey];
      return;
    }
    
    // Check our manual dictionary for group sheets and Div1/Div2 mismatches
    if (cfPrivateGroupsMap[meta.cfKey]) {
      problem.title = cfPrivateGroupsMap[meta.cfKey];
      return;
    }
    
    // Fallback: If it's a random numeric string like 262795B, format it nicely
    const numericMatch = meta.cfKey.match(/^(\d+)([A-Z\d]*)$/);
    if (numericMatch) {
      problem.title = `Contest ${numericMatch[1]} Problem ${numericMatch[2]}`;
      return;
    }
  }

  // CSES: scrape title from page
  if (meta.csesTaskId) {
    const realName = await fetchCSESTitle(meta.csesTaskId);
    if (realName) {
      problem.title = realName;
      return;
    }
  }

  // LeetCode: use GraphQL
  if (meta.lcSlug) {
    const realName = await fetchLeetCodeTitle(meta.lcSlug);
    if (realName) {
      problem.title = realName;
      return;
    }
  }

  // For SPOJ, GFG, HackerRank, AtCoder: try generic <title> scrape
  if (['SPOJ', 'GeeksforGeeks', 'HackerRank', 'AtCoder', 'CodeChef'].includes(problem.platform)) {
    const realName = await fetchGenericTitle(problem.link);
    if (realName) {
      problem.title = realName;
    }
  }
}

// Small helper to rate-limit requests
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ──────────────────────────────────────────────
// Main parser
// ──────────────────────────────────────────────
async function parseTLE() {
  // Pre-load Codeforces database
  await loadCodeforcesProblems();

  const fileContent = fs.readFileSync(inputPath, 'utf8');
  const lines = fileContent.split('\n').map(l => l.trimRight());
  
  const levels = [];
  let currentLevel = null;
  let currentWeek = null;
  let currentSection = null;
  
  let sectionIndexMap = {};
  const allProblems = []; // collect { problem, meta } for async resolution

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect Level
    const levelMatch = line.match(/Level\s*-\s*(\d+)/i);
    if (levelMatch) {
      currentLevel = {
        level: parseInt(levelMatch[1]),
        title: `Level ${levelMatch[1]}`,
        weeks: []
      };
      levels.push(currentLevel);
      currentWeek = null;
      currentSection = null;
      sectionIndexMap = {};
      continue;
    }

    // Detect Week
    const weekMatch = line.match(/WEEK\s*-\s*(\d+):\s*(.*)/i);
    if (weekMatch && currentLevel) {
      currentWeek = {
        week: parseInt(weekMatch[1]),
        title: weekMatch[2].trim(),
        topics: []
      };
      currentLevel.weeks.push(currentWeek);
      continue;
    }

    // Detect Section
    const sectionMatch = line.match(/Section:\s*(.*)/i);
    if (sectionMatch && currentLevel) {
      const sectionTitle = sectionMatch[1].trim();
      currentSection = {
        title: sectionTitle,
        resources: [],
        problems: []
      };
      
      sectionIndexMap[sectionTitle.toLowerCase()] = currentSection;
      
      let foundWeek = false;
      const sTitle = sectionTitle.toLowerCase();
      for (const w of currentLevel.weeks) {
         const wTitle = w.title.toLowerCase();
         if (wTitle.includes(sTitle) || sTitle.includes(wTitle) || 
            (wTitle.includes("c++ basics 2") && sTitle.includes("c++ basics 2")) ||
            (wTitle.includes("recursion & memoization") && sTitle.includes("recursion + memoization"))) {
              w.topics.push(currentSection);
              foundWeek = true;
              break;
         }
      }
      
      if (!foundWeek && currentLevel.weeks.length > 0) {
         let potentialMatch = null;
         for(const w of currentLevel.weeks) {
            const splitted = sTitle.split(' ').filter(x => x.length > 2);
            for(let word of splitted) {
               if(w.title.toLowerCase().includes(word)) {
                   potentialMatch = w;
                   break;
               }
            }
            if(potentialMatch) break;
         }
         if (potentialMatch) {
             potentialMatch.topics.push(currentSection);
         } else {
             currentLevel.weeks[currentLevel.weeks.length - 1].topics.push(currentSection);
         }
      }
      continue;
    }

    // Skip resource headers
    if (line.includes('Resources:')) continue;

    // Detect Resources
    const resourceMatch = line.match(/\s*-\s*(.*):\s*(https?:\/\/[^\s]+)/i);
    if (resourceMatch && currentSection && !line.toLowerCase().includes('task')) {
      currentSection.resources.push({
        title: resourceMatch[1].trim(),
        link: resourceMatch[2].trim()
      });
      continue;
    }

    // Detect Tasks/Problems
    const taskMatch = line.match(/\s*-\s*Task\s*\d+:\s*(https?:\/\/[^\s]+)/i);
    if (taskMatch && currentSection) {
      const url = taskMatch[1].trim();
      const meta = parsePlatformAndTitle(url);
      
      const problem = {
        id: meta.id,
        title: meta.title,
        link: url,
        platform: meta.platform,
        difficulty: meta.difficulty
      };
      currentSection.problems.push(problem);
      allProblems.push({ problem, meta });
      continue;
    }
    
    // Bare link under Tasks section
    if (currentSection && line.match(/\s*-\s*(https?:\/\/[^\s]+)/i) && !line.toLowerCase().includes('feedback') && !line.toLowerCase().includes('lecture')) {
      const linkMatch = line.match(/\s*-\s*(https?:\/\/[^\s]+)/i);
      if (linkMatch) {
        const url = linkMatch[1].trim();
        const meta = parsePlatformAndTitle(url);
        const problem = {
          id: meta.id,
          title: meta.title,
          link: url,
          platform: meta.platform,
          difficulty: meta.difficulty
        };
        currentSection.problems.push(problem);
        allProblems.push({ problem, meta });
      }
    }
  }

  // ──────────────────────────────────────────────
  // Resolve real titles asynchronously
  // ──────────────────────────────────────────────
  console.log(`\n[Titles] Resolving real names for ${allProblems.length} problems...`);

  // Step 1: Instantly resolve all Codeforces (from pre-loaded map)
  let cfResolved = 0;
  for (const { problem, meta } of allProblems) {
    if (meta.cfKey && cfProblemsMap) {
      const realName = cfProblemsMap[meta.cfKey];
      if (realName) {
        problem.title = realName;
        cfResolved++;
      }
    }
  }
  console.log(`[CF] Resolved ${cfResolved} Codeforces titles instantly from API`);

  // Step 2: Resolve CSES titles (rate-limited)
  const csesProblems = allProblems.filter(p => p.meta.csesTaskId);
  console.log(`[CSES] Fetching ${csesProblems.length} CSES titles...`);
  for (const { problem, meta } of csesProblems) {
    const realName = await fetchCSESTitle(meta.csesTaskId);
    if (realName) problem.title = realName;
    await delay(200); // rate limit
  }

  // Step 3: Resolve LeetCode titles
  const lcProblems = allProblems.filter(p => p.meta.lcSlug);
  console.log(`[LC] Fetching ${lcProblems.length} LeetCode titles...`);
  for (const { problem, meta } of lcProblems) {
    const realName = await fetchLeetCodeTitle(meta.lcSlug);
    if (realName) problem.title = realName;
    await delay(300);
  }

  // Step 4: Resolve remaining platforms via generic scrape
  const otherProblems = allProblems.filter(p =>
    !p.meta.cfKey && !p.meta.csesTaskId && !p.meta.lcSlug &&
    ['SPOJ', 'GeeksforGeeks', 'HackerRank', 'AtCoder', 'CodeChef'].includes(p.problem.platform)
  );
  console.log(`[Other] Fetching ${otherProblems.length} titles from other platforms...`);
  for (const { problem } of otherProblems) {
    const realName = await fetchGenericTitle(problem.link);
    if (realName) problem.title = realName;
    await delay(300);
  }

  // ──────────────────────────────────────────────
  // Cleanup: remove topics without problems, weeks without topics
  // ──────────────────────────────────────────────
  levels.forEach(level => {
    level.weeks.forEach(week => {
      week.topics = week.topics.filter(t => t.problems && t.problems.length > 0);
    });
    // Remove weeks with zero topics remaining
    level.weeks = level.weeks.filter(w => w.topics.length > 0);
  });

  // ──────────────────────────────────────────────
  // Write output
  // ──────────────────────────────────────────────
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify({ levels }, null, 2));
  console.log('\n✅ Saved to public/data/roadmap.json with', levels.length, 'levels.');
  
  let totalTasks = 0;
  levels.forEach(l => {
     let ltasks = 0;
     l.weeks.forEach(w => {
         w.topics.forEach(t => {
             ltasks += t.problems.length;
         })
     });
     console.log(l.title, "-", l.weeks.length, "weeks -", ltasks, "tasks");
     totalTasks += ltasks;
  })
  console.log("Total Problems:", totalTasks);
}

parseTLE();
