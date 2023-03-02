# Electron-React-TypeScript-Webpack (ERTW) Boilerplate

- Ready to use [Electron] project template with [React], [Webpack] and [TypeScript] seamlessly integrated.
- [ESLint] set up with TypeScript, Airbnb's rules, and [Jest] support.
- [Jest] integrated and configured.
- [`electron-builder`] for app packaging, with basic build config for Windows macOS included.
- Clean, easy to read and alter config files. No config file is hidden behind yet another script!
- Monthly maintenance to keep things up to date!

*This boilerplate is tested on the latest macOS and Windows. If anything doesn't work, please [file an issue].*

# Trello
https://trello.com/w/residentmanager3

## Getting started

3. `npm install` to install the dependencies.

Done! Now run `npm run dev` to start the Webpack in development and watch mode. It's time to start working on your project.

Be aware that starting Webpack will only compile your files to `dist` folder but won't start the Electron app. Use `npm start` command to start your Electron app once the files are compiled.

## Build your Electron app package
Different from the official [Electron quick start guide], this boilerplate uses [`electron-builder`] instead of [Electron Forge] to package your Electron app.

By default, the build configuration in `package.json` is configured to build the mac universal package (for Apple Silicon & Intel based machines) and Windows `exe` installer (both 32 & 64 bit). You should not need to change anything in the build script other than supplying the app icon unless you need to sign your code/package or build for Linux.

For code signing and notarization, or to build for Linux, please read [`electron-builder`'s document] for configuring the build script.

To package your Electron app, run `npm run prod` to get your code compiled in `production` mode, then use `npm run  build:(win|mac)` to build the package.

## Known issues
- [`electron-builder`] packages the file into Electron's `asar` archive format by default. Based on past experiences with old Electron & `electron-builder` versions, this might lead to runtime error on Windows while launching the installed Electron app. 

  One way to verify this issue is to build the mac package and see if your app runs fine on mac. If it's the case, you can override the `asar` archive option in the build configuration in `package.json` by adding `asar: false` in `win` section.
  
  This solution isn't ideal but since `asar` archiving is meant to improve performance of reading files if bundler like Webpack is not being used. The app packaging workflow defined in this boilerplate already uses Webpack to minify your code in `production` builds, so there shouldn't be any significant performance difference with `asar` archiving disabled.

## Project folders & files
- `.github/` - GitHub repo config & GitHub Actions workflows
- `dist/` - [Webpack] output location

  __Contents will be flushed automatically on execution of `npm run <dev|prod>` script.__

- `out/` - [`electron-builder`] output location

- `public/` - Global static assets.
  - `index.html` - Template for `HTML Webpack Plugin`

    Update the value of `<title>` tag to change the default window title.

  - `style.css` - `CSS` file location sample

    Not much defined in this file. You can either put your `CSS` settings here or use any other tools you prefer.

- `src/` - Folder for all your source code
  - `main/` - For modules which run on the `main` process.
    - `main.ts` - [Electron] `main` process entry point

  - `preload` - Preload scripts go here
    - `ipc-api.ts` - APIs for IPC between `main` & `renderer`

      Consider convert this module into a collection of submodules if you have many APIs for IPC. See example as below:
      ```ts
      // ipc-api/index.ts
      import submoduleA from './submodule-a';
      import submoduleB from './submodule-b';

      export default { ...submoduleA, ...submoduleB };

      // ipc-api/submodule-a.ts 
      import { ipcRenderer } from 'electron';

      function a { ipcRenderer.send('a'); }

      export default { a };

      // ipc-api/submodule-b.ts
      import { ipcRenderer } from 'electron';

      function b { ipcRenderer.send('b'); }

      export default { b };
      ```

    - `preload.ts` - [Electron] preload script entry point

      There should be no need to modify this file unless you want to use other key(s) for your IPC APIs. By default, all APIs defined in `ipc-api` module are exposed under key `ipcApi` in `contextBridge`.

  - `renderer/` - Where the frontend scripts stay
    - `App.tsx` - Root [React] component
    - `renderer.tsx` - [Electron] `renderer` process entry point

      *`public/style.css` imported here. Change it if you want.*

  - `types/` - Home for self-defined `.d.ts` files
    - `global.d.ts` - Extends global scope interfaces

      This file includes ambient declaration for calling the IPC APIs defined in `preload/ipc-api` from the `renderer`. Remember __NOT__ to remove this part, otherwise TypeScript will tell you `type not exist`. However, if you've opted to use a different key other than `ipcAPI` in the preload script, __DO__ remember to update this file to match your own settings.

  - `utils/` - Place to store the helper scripts
    - `node-env.ts` - Shortcut to determine `NODE` environment

- `tests/` - Unit testing files location
  
  To avoid test files mixing up with the source code, [Jest] is configured to look for test file(s) within this folder only.
  
  File name of the test files can either be `[filename].test.tsx` or `[filename].spec.ts(x)`. `js(x)` can also be used for test files, but I assume you'd use TypeScript if you're using this boilerplate.

  - `main/main.spec.ts` - Sample test file for `src/main/main`
  - `utils/node-env.spec.ts` - Unit test for `src/utils/node-env`
  - `tsconfig.json` - TypeScript config file for `tests` module
- `.eslintignore` - [ESLint] ignore file
- `.eslintrc.cjs` - [ESLint] config file

  Configured to use Airbnb's rules with [TypeScript] supported, and rules for [Jest] applied.

- `.gitignore` - Git ignore file
- `CHANGELOG_PRE_V4.md` - Changelog of this boilerplate prior to `v4.0.0`
- `CHANGELOG_V4+.md` - Changelog of this boilerplate from `v4.0.0` onwards
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md` - Contribution guide
- `jest.config.ci.mjs` - [Jest] config file for GitHub Actions
- `jest.config.mjs` - [Jest] config file
- `LICENSE` - MIT license
- `package-lock.json`
- `package.json`

  Includes basic build config for `electron-builder`. It's likely that you'll have to personalise the build config when it comes to the time you're about to release your app. Please read [`electron-builder`'s document] for the build config setup guides.

- `README.md`
- `tsconfig.eslint.json` - [TypeScript] config file consume by [ESLint].
- `tsconfig.json` - [TypeScript] config file

  Module path aliases are configured here. [Jest] & [Webpack] will pick up the alias settings here to config their own. No need to manually config in Jest & Webpack again.

- `webpack.config.json` - [Webpack] config file

  Includes configurations targetting `electron-main`, `electron-preload`, and `electron-renderer` respectively.

## Author
[Wing Chau](https://github.com/iamWing) [@Devtography](https://github.com/Devtography)

## License
Electron React TypeScript Webpack Boilerplate is open source software 
[licensed as MIT](LICENSE).

[Electron]: https://www.electronjs.org
[React]: https://reactjs.org
[Webpack]: https://webpack.js.org
[TypeScript]: https://www.typescriptlang.org
[ESLint]: http://eslint.org
[Jest]: https://jestjs.io
[`electron-builder`]: https://github.com/electron-userland/electron-builder
[file an issue]: https://www.electronjs.org
[new pull request]: https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/compare
[Spectron]: https://github.com/electron-userland/spectron
[ts-jest]: https://github.com/kulshekhar/ts-jest
[Playwright]: https://playwright.dev
[WebdriverIO]: https://webdriver.io
[Spectron Deprecation Notice]: https://www.electronjs.org/blog/spectron-deprecation-notice
[`Use this template`]: https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/generate
[`tsconfig-paths`]: https://github.com/dividab/tsconfig-paths
[`tsconfig-paths-webpack-plugin`]: https://github.com/dividab/tsconfig-paths-webpack-plugin
[Electron quick start guide]: https://www.electronjs.org/docs/latest/tutorial/quick-start
[Electron Forge]: https://github.com/electron-userland/electron-forge
[`electron-builder`'s document]: https://www.electron.build
[GitHub Sponsors]: https://github.com/sponsors/iamWing
[PayPal]: https://paypal.me/iamWing0w0

[`v3.0.0`]: https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/releases/tag/v3.0.0
[`v4.0.0`]: https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/releases/tag/v4.0.0
[`v4.1.0`]: https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/releases/tag/v4.1.0
[`v4.1.2`]: https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/releases/tag/v4.1.2
[`v4.1.3`]: https://github.com/Devtography/electron-react-typescript-webpack-boilerplate/releases/tag/v4.1.3
