import fs from 'fs';
import path from 'path';

const listPath = 'Final_Problem_List_FIXED.txt';
const roadmapPath = 'public/data/roadmap.json';

const listContent = fs.readFileSync(listPath, 'utf8');
const roadmapContent = fs.readFileSync(roadmapPath, 'utf8');

const titleMap = {};
// Example line: Task 1  | Multiples               | https://codeforces.com/group/MWSDmqGsZm/contest/219158/problem/J
for (let line of listContent.split('\n')) {
  if (line.includes('|')) {
    const parts = line.split('|');
    if (parts.length >= 3) {
      const title = parts[1].trim();
      const linkMatch = parts[2].match(/https?:\/\/[^\s]+/);
      if (linkMatch) {
         let link = linkMatch[0].trim();
         // Some strings might have weird trailing chars or the user fixed them.
         titleMap[link] = title;
         // Handle trailing slash mismatches possibly
         titleMap[link.replace(/\/$/, '')] = title;
         titleMap[link + '/'] = title;
      }
    }
  }
}

const roadmap = JSON.parse(roadmapContent);

let updatedCount = 0;
let missedCount = 0;

roadmap.levels.forEach(level => {
  level.weeks.forEach(week => {
    week.topics.forEach(topic => {
      topic.problems.forEach(problem => {
         let matchLink = problem.link.trim();
         if (titleMap[matchLink]) {
            problem.title = titleMap[matchLink];
            updatedCount++;
         } else if (titleMap[matchLink.replace(/\/$/, '')]) {
            problem.title = titleMap[matchLink.replace(/\/$/, '')];
            updatedCount++;
         } else {
            console.log("No match found for link:", matchLink, "- current title is", problem.title);
            missedCount++;
         }
      });
    });
  });
});

fs.writeFileSync(roadmapPath, JSON.stringify(roadmap, null, 2));

console.log(`Successfully updated ${updatedCount} problem names.`);
if (missedCount > 0) {
  console.log(`Missed ${missedCount} problems.`);
}
