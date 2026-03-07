const url2 = 'https://distrokid.imgix.net/http%3A%2F%2Fgather.fandalism.com%2F8585920--01953C67-C0F0-4996-896BFCD28E8E18E6--0--1961330--ChatGPTImage5mar2026011235a.m..png?fm=jpg&q=75&w=800&s=1aae90738e3996bf19a861714ac99af7';

const proxies = [
    { name: 'wsrv', url: u => `https://wsrv.nl/?url=${encodeURIComponent(u)}` }
];

async function test() {
    for (const proxy of proxies) {
        console.log('Testing proxy: ' + proxy.name);
        try {
            const res = await fetch(proxy.url(url2));
            console.log(proxy.name + ' -> status: ' + res.status);
        } catch (e) {
            console.log(proxy.name + ' -> error: ' + e.message);
        }
    }
}
test();
