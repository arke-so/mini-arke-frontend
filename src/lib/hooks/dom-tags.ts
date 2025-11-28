/** @type {import("@sveltejs/kit").Handle} */
export async function domTags({ event, resolve }: { event: any; resolve: any }) {
  const { scheme } = event.locals

  return resolve(event, {
    transformPageChunk: ({ html }: { html: string }) => html.replace('%app.scheme%', scheme),
  })
}
