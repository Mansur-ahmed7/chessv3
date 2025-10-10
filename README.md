# ChessV3 - Modern Chess Game

A modern, interactive chess game built with SvelteKit, featuring professional sound effects, timers, and an elegant interface.

## 🎮 Features

- **Interactive Chess Board** with drag-and-drop pieces using Chessground
- **Chess.com Style Sound Effects** - realistic audio feedback for moves, captures, checks
- **Timer/Clock System** - configurable time controls for competitive play
- **Move History Tracking** - complete game notation and move list
- **Professional UI** - clean, modern design with Tailwind CSS
- **Game State Management** - robust state handling with Svelte stores
- **Move Validation** - powered by chess.js for accurate game logic

## 🚀 Live Demo

Play the game online: [ChessV3 on Vercel](https://chessv3-orcin.vercel.app)

## 🛠️ Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **Chess Logic**: chess.js library
- **Chess Board**: Chessground (lichess.org's board component)
- **Styling**: Tailwind CSS with custom chess theme
- **Sound**: Web Audio API for chess.com style effects
- **State Management**: Svelte stores
- **Build Tool**: Vite
- **Deployment**: Vercel

## 🏃‍♂️ Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mansur-ahmed7/chessv3.git
   cd chessv3
   ```

2. **Navigate to the app directory**
   ```bash
   cd chessv3
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📦 Building for Production

```bash
cd chessv3
npm run build
```

## 🎵 Sound Effects

The game features chess.com style sound effects:
- **Move Sound**: Sharp, percussive click for regular moves
- **Capture Sound**: More aggressive tone with filter sweep
- **Check Sound**: Distinctive warning tone
- **Castle Sound**: Two-part sequence for castling moves
- **Game End**: Musical chord progression

## 🎨 Customization

The game uses a custom chess color palette defined in Tailwind CSS:
- Custom chess piece colors
- Professional board styling
- Elegant UI components

## 📱 Responsive Design

Fully responsive design that works on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

Feel free to fork this repository and submit pull requests for improvements!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Mansour Wirya Ahmed**
- GitHub: [@Mansur-ahmed7](https://github.com/Mansur-ahmed7)
- Email: etai08m240479@epu.edu.iq

---

Built with ❤️ using SvelteKit and modern web technologies.