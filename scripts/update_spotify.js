
const fs = require('fs');
const path = require('path');

async function updateSpotify() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const artistIds = ["2mEoedcjDJ7x6SCVLMI4Do", "0vEKa5AOcBkQVXNfGb2FNh"];
    const mainArtistId = artistIds[0];

    if (!clientId || !clientSecret) {
        console.error("Missing Spotify credentials");
        process.exit(1);
    }

    try {
        console.log("Getting access token...");
        const authRes = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSecret).toString('base64'),
            },
            body: "grant_type=client_credentials",
        });
        const { access_token } = await authRes.json();

        const fetchSpotify = (url) => fetch(url, {
            headers: { "Authorization": `Bearer ${access_token}` }
        }).then(r => r.json());

        console.log("Fetching artist details...");
        const artist = await fetchSpotify(`https://api.spotify.com/v1/artists/${mainArtistId}`);

        console.log("Fetching top tracks...");
        const topTracksRes = await fetchSpotify(`https://api.spotify.com/v1/artists/${mainArtistId}/top-tracks?market=US`);
        const topTracks = topTracksRes.tracks;

        console.log("Fetching albums...");
        let allAlbums = [];
        for (const id of artistIds) {
            let url = `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single,compilation&limit=50`;
            while (url) {
                const data = await fetchSpotify(url);
                allAlbums = allAlbums.concat(data.items);
                url = data.next;
            }
        }

        // Remove duplicates and sort
        const uniqueAlbums = Array.from(new Map(allAlbums.map(a => [a.id, a])).values())
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        // Fetch tracks for the most recent 30 albums to keep JSON size reasonable
        console.log("Fetching tracks for recent albums...");
        const albumTracks = {};
        for (const album of uniqueAlbums.slice(0, 30)) {
            console.log(`  - Fetching tracks for: ${album.name}`);
            const tracksData = await fetchSpotify(`https://api.spotify.com/v1/albums/${album.id}/tracks?limit=50`);
            albumTracks[album.id] = tracksData.items;
        }

        const finalData = {
            artist,
            topTracks,
            albums: uniqueAlbums,
            albumTracks,
            lastUpdated: new Date().toISOString()
        };

        const outputPath = path.join(process.cwd(), 'public', 'spotify_data.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));

        console.log(`Success! Data saved to ${outputPath}`);
    } catch (error) {
        console.error("Error updating Spotify data:", error);
        process.exit(1);
    }
}

updateSpotify();
