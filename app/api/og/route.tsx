import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "Artist Portfolio";

    // ?description=<description>
    const hasDescription = searchParams.has("description");
    const description = hasDescription
      ? searchParams.get("description")?.slice(0, 200)
      : "Electronic Music Producer & Sound Designer";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#020617",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #334155 2%, transparent 0%), radial-gradient(circle at 75px 75px, #334155 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            color: "white",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(2, 6, 23, 0.8)",
              padding: "40px 80px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "#38bdf8",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: "4px",
              }}
            >
              ARTIST NAME
            </div>
            <div
              style={{
                fontSize: 70,
                fontWeight: "bold",
                background: "linear-gradient(to bottom right, #fff, #94a3b8)",
                backgroundClip: "text",
                color: "transparent",
                lineHeight: 1.1,
                textAlign: "center",
                marginBottom: 20,
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 30,
                color: "#94a3b8",
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              {description}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
