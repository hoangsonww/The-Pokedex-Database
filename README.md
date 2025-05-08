# **Pokédex App** 🏆✨

_A beautifully designed, feature-rich Pokédex built with Next.js, Tailwind CSS, React Query, and PokeAPI for COMP-426 A05 project._

Built by **[David Nguyen](https://github.com/hoangsonww)** with ❤️ for the **COMP-426 A05 Assignment** at **UNC Chapel Hill**.

Live on Vercel: [**https://a05-pokedex-david-nguyen.vercel.app/**](https://a05-pokedex-david-nguyen.vercel.app/)

<p align="center">
  <img src="images/pokedex-app.png" alt="Pokédex App" width="100%">
</p>

## **Base Functionalities**

### Home Page

- **Home Page** – A list of pokemons with pagination. Accessible at root route `/`.
- **List of Pokemons** – A list of pokemons with their names and sprite icons. Paginated with < 50 (48) pokemons per page.
- **Client-Side Data Fetching** – Data fetched from PokeAPI using React Query, on the client side.

### Pokemon Details Page

- **Pokemon Details Page** – Details of a pokemon. Accessible at `/pokemon/[name]`. Clicking on a pokemon card will take you to its details page.
- **Pokemon Details** – Details of a pokemon including its name, sprite, abilities, types, stats, moves, description, and evolves-from pokemon(s).
- **Server-Side Data Fetching** – Pokemon details fetched from PokeAPI using `getServerSideProps` in Next.js.
- **Error Handling** – Error handling for failed data fetching.
- **Back Button** – A back button to go back to the previous page.
- **Navigate to Move Details** – Clicking on a move will take you to its details page.

### Move Details Page

- **Move Details Page** – Details of a move. Accessible at `/move/[name]`.
- **Move Details** – Details of a move including its name, type, power, accuracy, pp, and description.
- **Server-Side Data Fetching** – Move details fetched from PokeAPI using `getServerSideProps` in Next.js.
- **Error Handling** – Error handling for failed data fetching.
- **Back Button** – A back button to go back to the previous page.

### Styling

- **TailwindCSS** – A utility-first CSS framework for styling the app. No custom CSS used. All styles are done with TailwindCSS.

## **How I Enhanced the App**

Well, in addition to aiming to achieve the extra credits, I also enhanced the app to support a better UI/UX. Here are some of the features I added:

- **Sprite Icons** – Beautiful sprite icons for each pokemon and item.
- **Dark Mode** – A toggle switch to switch between light and dark themes.
  - Dark mode preference is also saved in local storage for future visits.
- **Local Favorites Storage** – Allows users to favorite pokemons locally.
  - Favorites are saved in local storage and are persistent across visits.
- **Favorites List** – A list of favorited pokemons with their names and sprite icons.
  - Clicking on a favorited pokemon will take you to its details page.
- **Items List** – A list of items that can be used in game, together with item details pages.
- **Search by Name** – A search bar to search for pokemons or items by name.
- **Loading Spinner** – A loading spinner to indicate when data is being fetched.
  - Together with error messages for failed data fetching (just in case).
- **Custom 404 Page** – A custom 404 page for invalid routes - to be consistent with the app's design.
- **Image Error Handling** – Error handling for failed image loading (extra check for broken image links).
- **Animations & Transitions** – Smooth animations and transitions with `framer-motion` library.
- **Using Poppins Font** – A beautiful Google font for the app.
- **Heroicons for Navigation** – Beautiful icons for buttons & actions.
- **Responsive Design** – Fully responsive design for mobile, tablet, and desktop.
- **Code Formatting** – Code formatting with Prettier and ESLint.
  - I added `Prettier` with `npm run format` script to format the code automatically.
- **Progressive Web App (PWA)** – A PWA version of the app (just for fun -- it might not always work).
  - I added a `manifest.json` file and followed `next-pwa` documentation to enable PWA features.

Although I had some prior experiences with Next.js and TailwindCSS, it really took me a very long time (**two full snow days**) to build this app and
implement all the features (including non-required ones). But the result is really worth it.

I really enjoyed the entire process of building this app from scratch and I'm proud of what I've accomplished!!! Thank you for the great idea and the opportunity to work on this project!

**🚀 I hope you enjoy using this app as much as I enjoyed building it!**

---

_If given more time, I would love to add more features to the app... Features I would love to add include creating a backend so we can save user favorites on the server and allow users to create their profiles and share their favorites with others..._
