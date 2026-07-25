import http from 'node:http';

const baseUrl = new URL(process.env.PERF_BASE_URL || 'http://127.0.0.1:3000');
const budgets = {
  homeRawBytes: 80 * 1024,
  homeCompressedBytes: 25 * 1024,
  aboutRawBytes: 80 * 1024,
  cwvRawBytes: 135 * 1024,
};
const failures = [];

function request(pathname, acceptEncoding = 'identity') {
  return new Promise((resolve, reject) => {
    const url = new URL(pathname, baseUrl);
    const pendingRequest = http.get(
      url,
      { headers: { 'accept-encoding': acceptEncoding } },
      response => {
        const chunks = [];
        response.on('data', chunk => chunks.push(chunk));
        response.on('end', () => {
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: Buffer.concat(chunks),
          });
        });
      }
    );
    pendingRequest.on('error', reject);
  });
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function extractTags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'g')) ?? [];
}

function extractAttribute(tag, attribute) {
  return tag.match(new RegExp(`\\b${attribute}="([^"]+)"`, 'i'))?.[1];
}

async function measurePage(label, pathname) {
  const [identityResponse, compressedResponse] = await Promise.all([
    request(pathname),
    request(pathname, 'gzip'),
  ]);
  assert(identityResponse.status === 200, `${pathname}: HTTP ${identityResponse.status}`);
  assert(compressedResponse.status === 200, `${pathname}: gzip HTTP ${compressedResponse.status}`);

  const html = identityResponse.body.toString('utf8');
  const imageTags = extractTags(html, 'img');
  const scriptTags = extractTags(html, 'script');
  const scriptSources = [
    ...new Set(scriptTags.map(tag => extractAttribute(tag, 'src')).filter(Boolean)),
  ];
  const scriptResponses = await Promise.all(scriptSources.map(source => request(source)));
  const initialJsBytes = scriptResponses.reduce(
    (total, response) => total + response.body.length,
    0
  );

  return {
    label,
    pathname,
    html,
    head: html.split('</head>')[0] ?? '',
    rawBytes: identityResponse.body.length,
    compressedBytes: compressedResponse.body.length,
    contentEncoding: compressedResponse.headers['content-encoding'] || 'identity',
    imageTags,
    scriptSources,
    initialJsBytes,
    initialJs: Buffer.concat(scriptResponses.map(response => response.body)).toString('utf8'),
  };
}

const pages = await Promise.all([
  measurePage('Home', '/'),
  measurePage('About', '/about'),
  measurePage('Zsh', '/posts/zsh-setup'),
  measurePage('React architecture', '/posts/react-project-architecture-evolution'),
  measurePage('CWV', '/posts/20_cwv-fonts-images-scripts'),
]);

const [home, about, zsh, , cwv] = pages;
assert(home.rawBytes <= budgets.homeRawBytes, `홈 raw ${home.rawBytes}B > 80KB`);
assert(
  home.compressedBytes <= budgets.homeCompressedBytes,
  `홈 압축 ${home.compressedBytes}B > 25KB`
);
assert(about.rawBytes <= budgets.aboutRawBytes, `About raw ${about.rawBytes}B > 80KB`);
assert(cwv.rawBytes <= budgets.cwvRawBytes, `CWV raw ${cwv.rawBytes}B > 135KB`);

assert(
  !home.html.includes('저는 약 8개월 동안 리액트 개발 환경을 공부하면서'),
  '홈 응답에 포스트 본문 문장이 포함되어 있습니다.'
);
assert(!home.html.includes('/data/search-index.json'), '홈이 검색 인덱스 URL을 초기화합니다.');
assert(
  !home.initialJs.includes('검색어를 입력하여 블로그 포스트를 찾아보세요'),
  '검색 모달 구현이 초기 JS 청크에 포함되어 있습니다.'
);

const homePostImages = home.imageTags.filter(tag => tag.includes('썸네일'));
assert(
  homePostImages.length === 10,
  `홈 카드 이미지 수가 10개가 아닙니다: ${homePostImages.length}`
);
assert(
  homePostImages[0]?.includes('loading="eager"') &&
    homePostImages[0]?.includes('fetchPriority="high"'),
  '홈 첫 카드 이미지가 eager/high priority가 아닙니다.'
);
assert(
  homePostImages.slice(1).every(tag => tag.includes('loading="lazy"')),
  '홈의 두 번째 이후 카드 중 lazy가 아닌 이미지가 있습니다.'
);

const zshImages = zsh.imageTags.filter(tag => tag.includes('zsh_install'));
assert(zshImages.length === 7, `Zsh 본문 이미지 수가 7개가 아닙니다: ${zshImages.length}`);
assert(
  zshImages.every(
    tag => tag.includes('loading="lazy"') && /\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag)
  ),
  'Zsh 이미지 중 lazy 또는 고유 width/height가 빠진 항목이 있습니다.'
);
assert(!/zsh_install[1-7]/.test(zsh.head), 'Zsh 본문 이미지가 <head>에서 preload됩니다.');

const fontPreloads = extractTags(home.head, 'link').filter(
  tag => tag.includes('rel="preload"') && tag.includes('IBMPlexSansKR')
);
assert(fontPreloads.length === 2, `IBM 폰트 preload 수가 2개가 아닙니다: ${fontPreloads.length}`);

const postsResponse = await request('/data/posts.json');
const postsPayload = JSON.parse(postsResponse.body.toString('utf8'));
assert(Array.isArray(postsPayload.items), '/data/posts.json items가 배열이 아닙니다.');
assert(
  postsPayload.items.every(item => !('content' in item) && !('fullPath' in item)),
  '/data/posts.json이 content 또는 fullPath를 노출합니다.'
);

const searchResponse = await request('/data/search-index.json');
const searchPayload = JSON.parse(searchResponse.body.toString('utf8'));
assert(Array.isArray(searchPayload), '/data/search-index.json 응답이 배열이 아닙니다.');
assert(
  searchPayload.every(item => !('content' in item) && !('fullPath' in item) && 'title' in item),
  '/data/search-index.json 계약에 불필요한 본문 필드가 포함되어 있습니다.'
);

console.table(
  pages.map(page => ({
    page: page.label,
    rawKB: (page.rawBytes / 1024).toFixed(1),
    compressedKB: (page.compressedBytes / 1024).toFixed(1),
    encoding: page.contentEncoding,
    initialJsKB: (page.initialJsBytes / 1024).toFixed(1),
    scripts: page.scriptSources.length,
    images: page.imageTags.length,
  }))
);
console.log(
  JSON.stringify(
    {
      homeFontPreloads: fontPreloads.length,
      homePostImages: homePostImages.length,
      zshLazyImages: zshImages.length,
      searchIndexItems: searchPayload.length,
      postApiItems: postsPayload.items.length,
    },
    null,
    2
  )
);

if (failures.length > 0) {
  console.error(failures.map(failure => `- ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Performance contract verification passed.');
}
