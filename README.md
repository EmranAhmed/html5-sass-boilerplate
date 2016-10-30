# Simple HTML5 Sass Boilerplate with Bootstrap, owlCarousel and FontAwesome

## Start
- `yarn install` or `yarn install --production`
- `yarn run dev`
- `yarn run build` to build or ready for demo
- Check [Yarn Usage](https://yarnpkg.com/en/docs/usage)
- Check [Yarn Documentation](https://yarnpkg.com/en/docs/cli/)

## Add package

- `yarn add [package] --dev` or `yarn add [package]`
- `yarn upgrade` - updates all dependencies to their latest version based on the version range specified in the `package.json` file

## Using Boilerplate

- Create html files on `templates` directory like `index.html`, `about-us.html`
- Create templates parts on `template-parts` directory
- Use `@import "[template-part-file].html"` to include template parts file.
- Use `styles.scss` to import all style files.
- Put vendor scss / sass directory on `src/sass/vendor` directory
- Use `src/sass/themes` directory for your own templates sass code
- Import js on `src/js/scripts.js` it support babel es2015, so you can write code as es6 styles
- Use `gulp copy-assets` task to copy necessary vendor files. Edit this task to add your one. It task run only on first installation.
If you wish to re-run it just use `gulp copy-assets`. I use copy-assets task for only copy images and font files.