import { Chess } from 'chess.js';
import type { Square } from 'chess.js';

/**
 * Safely parses a chess move and returns the result
 */
export function parseMove(game: Chess, move: string): any | null {
  try {
    return game.move(move);
  } catch (error) {
    console.warn('Failed to parse move:', move, error);
    return null;
  }
}

/**
 * Converts chess.js square format to chessground format
 */
export function toChessgroundMove(move: any): { from: string; to: string } | null {
  if (!move?.from || !move?.to) return null;
  
  return {
    from: move.from,
    to: move.to
  };
}

/**
 * Gets all legal moves for the current position
 */
export function getLegalMoves(game: Chess): string[] {
  try {
    return game.moves();
  } catch (error) {
    console.warn('Failed to get legal moves:', error);
    return [];
  }
}

/**
 * Gets legal moves for a specific square
 */
export function getLegalMovesForSquare(game: Chess, square: string): string[] {
  try {
    return game.moves({ square: square as Square, verbose: false }) as string[];
  } catch (error) {
    console.warn('Failed to get moves for square:', square, error);
    return [];
  }
}

/**
 * Validates a FEN string
 */
export function isValidFen(fen: string): boolean {
  try {
    new Chess(fen);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Gets the square under check (if any)
 */
export function getCheckSquare(game: Chess): string | null {
  try {
    if (!game.inCheck()) return null;
    
    const turn = game.turn();
    const king = turn === 'w' ? 'K' : 'k';
    
    // Find the king's position
    const board = game.board();
    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank]?.[file];
        if (piece?.type === 'k' && piece.color === turn) {
          const files = 'abcdefgh';
          return `${files[file]}${8 - rank}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to get check square:', error);
    return null;
  }
}

/**
 * Determines the sound to play based on move properties
 */
export function getMoveSound(move: any, game: Chess): string {
  if (!move) return 'move';
  
  try {
    if (game.inCheck()) return 'check';
    if (move.captured) return 'capture';
    if (move.flags?.includes('k') || move.flags?.includes('q')) return 'castle';
    return 'move';
  } catch (error) {
    console.warn('Failed to determine move sound:', error);
    return 'move';
  }
}

/**
 * Gets the piece type from a move for sound effects
 */
export function getMovePieceType(move: any): string {
  if (!move || !move.piece) return 'p';
  return move.piece;
}

/**
 * Play sound for a chess move with piece-specific sounds
 */
export function playMoveSound(move: any, game: Chess, soundManager: any): void {
  try {
    const soundType = getMoveSound(move, game);
    soundManager.play(soundType);
  } catch (error) {
    console.warn('Failed to play move sound:', error);
  }
}

/**
 * Formats time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Default values for common chess properties
 */
export const CHESS_DEFAULTS = {
  startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  timeControl: 600, // 10 minutes in seconds
  increment: 0,
  playerNames: {
    white: 'White',
    black: 'Black'
  }
} as const;