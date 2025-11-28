/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
  const { language, scheme, isMobile } = locals

  return {
    language,
    scheme,
    isMobile,
  }
}
