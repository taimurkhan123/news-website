export default async (req) => {
    try {
        const url = new URL(req.url);

        const endpoint = url.searchParams.get("endpoint") || "latest-news";
        const keywords = url.searchParams.get("keywords");

        let apiUrl =
            `https://api.currentsapi.services/v1/${endpoint}?apiKey=${process.env.NEWS_API_KEY}&language=en`;

        if (keywords) {
            apiUrl += `&keywords=${encodeURIComponent(keywords)}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {

        return new Response(
            JSON.stringify({
                error: "Failed to fetch news"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
};