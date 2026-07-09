const https = require('https');
const urls = [
  '7LFHJBPXmCE',
  'bays4eTXeBI',
  'eVSr5eJTTRY',
  'tyEndeEV6z0',
  'ba1pGuUe8Ro',
  '-dtN0c5EhyM',
  'AGbuGV1uAP4',
  'lPA1FBlPUCg',
  'jh5euMKEoug',
  'QCJCfxZ6ARo'
];

async function fetchInfo(id) {
  return new Promise((resolve, reject) => {
    https.get('https://www.youtube.com/watch?v=' + id, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let titleMatch = data.match(/<title>(.*?)<\/title>/);
        let dateMatch = data.match(/<meta itemprop="datePublished" content="(.*?)">/);
        let title = titleMatch ? titleMatch[1].replace(' - YouTube', '') : 'Unknown Title';
        let date = dateMatch ? dateMatch[1] : '2023-01-01';
        resolve({ id, title, date });
      });
    }).on('error', reject);
  });
}

async function run() {
  let results = [];
  for (let id of urls) {
    try {
      let info = await fetchInfo(id);
      results.push(info);
    } catch(e) {
      console.log('Error for', id);
    }
  }
  // Sort descending (newest first)
  results.sort((a,b) => new Date(b.date) - new Date(a.date));
  console.log(JSON.stringify(results, null, 2));
}

run();
