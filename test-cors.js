const url1 = 'http://gather.fandalism.com/8585920--01953C67-C0F0-4996-896BFCD28E8E18E6--0--1961330--ChatGPTImage5mar2026011235a.m..png';
const url2 = 'https://s3.amazonaws.com/gather.fandalism.com/8585920%2D%2DAC52BCFA%2DE94B%2D4090%2D805CAD64A89658A4%2D%2D0%2D%2D2214848%2D%2DChatGPTImage4mar2026124218a.m..png';

const proxies = [
    { name: 'google', url: u => `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?url=${encodeURIComponent(u)}&container=focus&refresh=2592000` }
];

async function test(targetUrl) {
    console.log(`\nTesting URL: ${targetUrl.substring(0, 30)}...`);
    for (const proxy of proxies) {
        try {
            const res = await fetch(proxy.url(targetUrl), { headers: { 'Origin': 'http://localhost:3000' } });
            const corsMatch = res.headers.get('access-control-allow-origin');
            console.log(`${proxy.name.padEnd(15)} -> Status: ${res.status}, CORS: ${corsMatch}`);
        } catch (e) {
            console.log(`${proxy.name.padEnd(15)} -> Error: ${e.message}`);
        }
    }
}
async function run() {
    await test(url1);
    await test(url2);
}
run();
