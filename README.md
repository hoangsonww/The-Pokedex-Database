# Pokédex App 🏆✨

_A beautifully designed, feature-rich Pokédex built with Next.js (React), Tailwind CSS, React Query, and PokeAPI._

<p align="center">
  <img src="images/pokedex-app.png" alt="Pokédex App" width="100%">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Heroicons-0EA5E9?style=for-the-badge&logo=heroicons&logoColor=white" alt="Heroicons" />
  <img src="https://img.shields.io/badge/PokeAPI-FFCB05?style=for-the-badge&logo=pokeapi&logoColor=white" alt="PokeAPI" />
  <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
</p>

**Live Web App: [https://pokedex-db.vercel.app/](https://pokedex-db.vercel.app/).** 

Feel free to explore the app and its features! 

---

## 🚀 Features

- **Pokémon List**  
  - Displays all Pokémon in a responsive grid (48 per page).  
  - Client-side pagination with next/previous controls.  
  - Instant search with 200 ms debounce to filter by name.  
- **Items List**  
  - Displays all game items in a similar paginated grid.  
  - Search bar with debounce for item names.  
- **Favorites**  
  - Click the ★ icon on any Pokémon card to toggle favorite.  
  - Favorites are persisted in `localStorage`.  
  - Separate “Favorite Pokémon” section that supports search and pagination.  
- **Animated Transitions**  
  - `framer-motion` layout animations for smooth grid reflows.  
- **Accessible UI**  
  - Keyboard event handlers: Enter to submit, Backspace to delete, letter keys to type.  
  - Heroicons search icon, focus rings, and high-contrast text.  
- **Offline-Friendly**  
  - Core data (all 100 000+ Pokémon & items) is fetched once and cached via React Query.
- **and more!**

---

## 🧰 Tech Stack

- **Next.js** (React + file-based routing)  
- **TypeScript**, **React Query** (`@tanstack/react-query`)  
- **Tailwind CSS** for utility-first styling  
- **Framer Motion** for animations  
- **Heroicons** for SVG icons  
- **PokeAPI** (public REST API for Pokémon data)

---

## 📦 Installation & Local Development

1. **Clone the repo**  
  ```bash
  git clone git@github.com:hoangsonww/The-Pokedex-Database.git
  cd The-Pokedex-Database
  ```

2. **Install dependencies**

  ```bash
  npm install
  # or
  yarn install
  ```
3. **Run the development server**

  ```bash
  npm run dev
  # or
  yarn dev
  ```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## ⚙️ Configuration

*No environment variables are required.*
All data is fetched directly from the PokeAPI.

---

## 📑 API Reference

This app consumes the following PokeAPI endpoints:

### Pokémon

| Method | Endpoint                            | Description                            |
| ------ | ----------------------------------- | -------------------------------------- |
| GET    | `/pokemon?limit=48&offset=<offset>` | Paginated list of Pokémon              |
| GET    | `/pokemon?limit=100000&offset=0`    | Full list (for search/favorites cache) |

### Items

| Method | Endpoint                         | Description                         |
| ------ | -------------------------------- | ----------------------------------- |
| GET    | `/item?limit=48&offset=<offset>` | Paginated list of items             |
| GET    | `/item?limit=100000&offset=0`    | Full item list (for search caching) |

*All responses conform to the PokeAPI schema: count, next, previous, results.*

---

## 📂 Folder Structure

```
/
├── components/
│   ├── PokemonCard.tsx
│   ├── ItemCard.tsx
│   └── Pagination.tsx
├── data/
│   └── models/          # TypeScript interfaces (Pokedex, ItemList)
├── pages/
│   └── index.tsx        # Home page (Pokémon, Items, Favorites)
├── styles/
│   └── globals.css      # Tailwind base styles
├── public/              # Favicons, manifest, images
├── README.md
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 🤝 Contributing

Contributions welcome! Feel free to open issues or submit pull requests.

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.
