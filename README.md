# App currently in progress 🚧

This application is currently under development. New features and improvements are being added regularly.

# 📺 Movie & TV Show Recommendation App

## Description

**Movie & TV Show Recommendation App** allows you to explore popular TV shows and movies, discover new releases, and get personalized random recommendations for TV shows or movies. The app uses The Movie Database (TMDb) API to provide detailed information on movies, TV shows, actors, genres, and more.

## Features

- 📽 **Random Recommendations**: Get random movie or TV show recommendations with a single click.
- 🔍 **Advanced Search**: Search for your favorite movies or TV shows using our TMDb integration.
- 🌟 **Popular Movies**: Discover trending movies or find out what's playing in theaters.
- 📅 **Popular TV Shows**: Access the most-watched TV shows or what's currently on air.
- 🎬 **Detailed Information**: View comprehensive details for each movie or show, such as genres, seasons, episodes, and reviews.
- 🧑‍🤝‍🧑 **Actor Profiles**: Explore information about actors and their latest projects.

## Tech Stack

- **Frontend**: 
  - React
  - TypeScript
  - Tailwind CSS
  - React Router
  - Axios
  - Vite
  
- **State Management**: 
  - Redux
  
- **API**: 
  - [The Movie Database (TMDb)](https://www.themoviedb.org/documentation/api)
  
## Installation & Setup

Follow these steps to run the app on your local environment:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/movie-tv-app.git
    cd movie-tv-app
    ```

2. **Install dependencies**:

    Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed, then run:

    ```bash
    npm install
    ```

3. **Set up TMDb API**:

   You will need an API key from [The Movie Database (TMDb)](https://www.themoviedb.org/documentation/api). Create a `.env` file in the root of the project and add your API key:

    ```bash
    VITE_TMDB_API_KEY=your_api_key_here
    ```

4. **Run the development server**:

    ```bash
    npm run dev
    ```

5. **Open the app**:

    Navigate to `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Create a production build.
- `npm run preview`: Preview the optimized build.
- `npm run lint`: Run lint checks and fix code issues.

## Project Structure

```bash
src/
├── assets/               # Static files
├── components/           # Reusable components
├── hooks/                # Custom hooks
├── pages/                # Main app pages
├── services/             # TMDb API calls
├── store/                # Global state with Redux
├── App.tsx               # Root component
├── main.tsx              # App entry point
└── index.css             # Global styles
```
## API Used

This app uses the TMDb API to fetch information about movies and TV shows. For more details, visit [TMDb API Documentation](https://developers.themoviedb.org/3).

## Future Improvements

- 💾 **Favorites Functionality**: Allow users to save their favorite movies or TV shows.
- 📱 **Enhanced Mobile Responsiveness**: Further optimize the experience on mobile devices.
- 💬 **Commenting System**: Add a system for users to comment and leave reviews.

## Contributions

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

## Author

Developed by [Iván](https://github.com/IvanDuarte1501199).