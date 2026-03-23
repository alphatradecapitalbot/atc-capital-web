export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ message: "API temporarily disabled for build" });
}
