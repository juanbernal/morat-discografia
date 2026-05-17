const ANALYTICS_URL = "https://script.google.com/macros/s/AKfycbwNX-T5wawLrYaTnJ0PcN_xA8sp0LIXThDA3jqkDhR3IdjSlnqRif8rUEx_e9e1xSsd3Q/exec";

export const trackEvent = (event: string, data: any) => {
    const payload = {
        action: "trackEvent",
        event: event,
        data: data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    fetch(ANALYTICS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
    }).catch(e => {
        console.log("Analytics Error:", e);
    });
};
