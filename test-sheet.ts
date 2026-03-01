import { getCatalogFromSheet } from './src/services/catalogService.ts';

async function test() {
    const data = await getCatalogFromSheet();
    console.log("Sheet Tracks Count:", data.length);
    if (data.length > 0) {
        console.log("First item:", data[0].name);
    }
}

test();
