# HSL Color Calc on Vue + Vite + Typescript

## What is this

Color Calc Vue is a web app for visualizing and calculating color differences in HSL (Hue, Saturation, Lightness) space. It provides interactive tools to compare colors, see their HSL components, and understand how color adjustments affect design systems.

### Features

- Visualize HSL color differences and adjustments
- Compare two colors and see their hue, saturation, and lightness differences
- Interactive UI for color selection and comparison
- Built with Vue 3 and Vite for fast development
- Includes Sass functions for color calculations (see below)
- Reference implementation for design system research

### Origin & References

- Original CodePen: [Twintails/pen/JrGEwx](https://codepen.io/Twintails/pen/JrGEwx)
- HSL calculation details: [docs/HSL_CALCULATION.md](docs/HSL_CALCULATION.md)

#### Comments

Original functionality was in Sass CSS preprocessor code c. Sept. 18, 2017 and published to Twintails' CodePen Portfolio.

This was for a bit of design research for a style-guide which turned into a Design System project.

The Sass file included is for reference of origin, and:

- **Sass is not used** in this codebase
- contains functions and variables for color calculations in HSL

## Running the app

1. Install dependencies:

   ```sh
   npm install
   ```

2. Start the development server:

   ```sh
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Building the app

To build for production:

```sh
npm run build
```

The output will be in the `dist/` folder.

---

## License

This project license is under the terms described in [LICENSE.md](LICENSE.md).
