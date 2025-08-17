export async function onRequest(context: any) {
  try {
    return await context.next();
  } catch {
    // Return index.html for any 404s (SPA routing)
    return context.env.ASSETS.fetch(context.request.url.replace(/\/[^\/]*$/, '/'));
  }
}