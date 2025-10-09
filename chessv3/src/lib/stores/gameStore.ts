import { writable } from 'svelte/store';
import { Chess } from 'chess.js';

export interface GameState {
  game: Chess;
  fen: string;
  pgn: string;
  turn: 'w' | 'b';
  isGameOver: boolean;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  lastMove: string | null;
  moveHistory: string[];
}

function createGameStore() {
  const game = new Chess();
  
  const initialState: GameState = {
    game,
    fen: game.fen(),
    pgn: game.pgn(),
    turn: game.turn(),
    isGameOver: false,
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    lastMove: null,
    moveHistory: []
  };

  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    makeMove: (move: string | { from: string; to: string; promotion?: string }) => {
      update(state => {
        try {
          const moveResult = state.game.move(move);
          if (moveResult) {
            return {
              ...state,
              fen: state.game.fen(),
              pgn: state.game.pgn(),
              turn: state.game.turn(),
              isGameOver: state.game.isGameOver(),
              isCheck: state.game.inCheck(),
              isCheckmate: state.game.isCheckmate(),
              isStalemate: state.game.isStalemate(),
              isDraw: state.game.isDraw(),
              lastMove: moveResult.san,
              moveHistory: state.game.history()
            };
          }
          return state;
        } catch (error) {
          console.warn('Invalid move:', move, error);
          return state;
        }
      });
    },

    reset: () => {
      const newGame = new Chess();
      set({
        game: newGame,
        fen: newGame.fen(),
        pgn: newGame.pgn(),
        turn: newGame.turn(),
        isGameOver: false,
        isCheck: false,
        isCheckmate: false,
        isStalemate: false,
        isDraw: false,
        lastMove: null,
        moveHistory: []
      });
    },

    loadFen: (fen: string) => {
      update(state => {
        try {
          const newGame = new Chess(fen);
          return {
            ...state,
            game: newGame,
            fen: newGame.fen(),
            pgn: newGame.pgn(),
            turn: newGame.turn(),
            isGameOver: newGame.isGameOver(),
            isCheck: newGame.inCheck(),
            isCheckmate: newGame.isCheckmate(),
            isStalemate: newGame.isStalemate(),
            isDraw: newGame.isDraw(),
            moveHistory: newGame.history()
          };
        } catch (error) {
          console.warn('Invalid FEN:', fen, error);
          return state;
        }
      });
    }
  };
}

export const gameStore = createGameStore();