/** @type {import('next').NextConfig} */
// next.config.mjs
const config = {
  // tell Next.js to do a static export
  output: 'export',

  // if your site is at https://<user>.github.io/my-nextjs-app,
  // uncomment the next line so all asset URLs get prefixed correctly:
  basePath: '/my-nextjs-app',

  // optional: add trailing slashes if you want URLs like /about/ instead of /about
  // trailingSlash: true,
};

export default config;

