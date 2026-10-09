# Podman.io Website README

This website is built using [Docusaurus 2](https://docusaurus.io/).

### Build Locally

Follow these steps to test the site with either a local development server, or by statically generating the site.

- [_make sure yarn is installed_](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable)
- Install packages
  - `$ yarn`
- Run a local development server
  - `$ yarn start`
- Generate static content (this is how the site is built for production)
  - `$ yarn build`
    - After this you can test the local build with:
      - `yarn serve`

To test with the `https`, follow the following steps:

- Generate the localhost self-signed certificate and install it (uses `mkcert` tool):
  - `$ mkcert localhost`
  - `$ mkcert -install`
- Start the local development server with HTTPS enabled:
  - `$ HTTPS=true SSL_CERT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem yarn start`


#### Testing on your Virtual Machine

If you're doing development on a VM there are a few steps to take to test your changes:

- Set your firewall of your VM to allow access to port `3000`. These commands only have to be run once for the lifetime of the VM, or until you reconfigure your firewall settings.
  - `# firewall-cmd --permanent --add-port=3000/tcp`
  - `# firewall-cmd --reload`
- As noted above, build and start your web server after your proposed changes are complete:
  - `$ yarn build`
  - `$ yarn serve`
- On the host machine of your VM, open a web browser and connect to the IP of your VM:
  - `http://#.#.#.#:3000`
  - Note, `http` and NOT `https`, and `#.#.#.#` is your VM's TCP/IP address, such as `10.0.0.1`

### Deployment

- The site is set to automatically deploy when code is pushed to the main branch
  - See `.github/workflows/static.yml`
- **Important**: prior to merging to main, run `yarn build` locally

---

## How to Update the Podman.io Website

### Page Content

_Text and Images_

- Most page data is stored in `static/data/<page-name>`
  - It is set up so that you can use markdown in the strings for much of the content.
    - _If the markdown syntax renders, it needs to be passed into the `Markdown` component (in `components/utilities/`)_
- files like `static/data/global.ts`, `static/data/testimonials.ts`, and `static/data/meetings.ts` are meant to make it easier for people with limited coding experience to be able to quickly update specific and regularly changing content.
  - **note**: the `papaparse` library has been added for switching to `.csv` files in the future.

### Page Style and Structure

#### Pages Pattern

- Fat arrow notation for sections that only appear on the particular page
  - These sections are organized in an exported function at the end of the file
- Large sections
  - some content takes up a lot of space and may be useful elsewhere or temporary, they can be found in `src/components/content/`
    - Components in this directory should be self sufficient for data (but it's not necessary of course)

#### Components

- `src/components/content`: Self-sufficient components, large page content components, temporary components
- `src/components/layout`: Headers, grids, and any other sections that organize content
- `src/components/shapes`: SVG components such as the wave border
- `src/components/ui`: Reusable components, little to no data by default, presentational
- `src/components/utilities`: Buttons, links, and other small reusable elements

### Typescript

- a bunch of base types are found in `types.d.ts`
  - these are primarily for props. Kept minimal by design and then extended when needed (primarily with style props)

### Assets

#### CSS

- Podman and Podman Desktop color themes are added in `tailwind.config.js`
- A custom radial gradient has also been added to `tailwind.config.js` (it uses the same breakpoints as other tailwind gradients)
- changes to the default styles are in `src/assets/css/main.css` in the following order:
  - imports
  - docusaurus root colors
  - docusaurus component style changes
  - font configuration
- default fonts are set inside `@layer base{}` in `main.css` using tailwind's **@apply** syntax

---

## Configuration Information

### How to Update Docusaurus

- Run the following command to upgrade docusaurus
  - `yarn up @docusaurus/core@latest @docusaurus/preset-classic@latest`
- _note that the docusaurus site says to use `upgrade` but it's actually `up` when using yarn_
- to upgrade tailwind or other packages, similarly use the command:
  - `yarn up <package-name>`

### Plugins and Libraries

- Icon Library: [Iconify](https://iconify.design/)
  - [Icones](https://icones.js.org/) for web based icon library overview
  - [Iconify Intellisense vscode extension](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)
- CSS Framework: [Tailwind](https://tailwindcss.com/) (see `tailwind.config.js`, `assets/css/main.css`)
- Code Formatting: [Prettier](https://prettier.io/) (see `.prettierrc`, `.prettierignore`)
- Linting: [Eslint](https://eslint.org/) (see `.eslintrc`, `.eslintignore`)
- Rendering markdown from js strings: [react markdown parser](https://github.com/remarkjs/react-markdown)
  - Use the custom `<Markdown text="..." styles="..." /> component for any markdown strings
    - This component wraps the markdown parser and handles the import, reducing the amount of code needed on each instance. It renders during the static build, so the text ends up in the generated HTML.
- Rendering html from wordpress: [html-react-parser](https://www.npmjs.com/package/html-react-parser)
  - Use this to render any injected html to avoid XSS
