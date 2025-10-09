<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Chess } from 'chess.js';
  import { Chessground } from 'chessground';
  import type { Api } from 'chessground/api';
  import type { Config } from 'chessground/config';
  import { gameStore } from '$lib/stores/gameStore';
  import { soundManager } from '$lib/sound/soundManager';
  import { toChessgroundMove, getMoveSound, getCheckSquare, playMoveSound } from '$lib/utils/chessUtils';

  export let orientation: 'white' | 'black' = 'white';
  export let disabled: boolean = false;
  export let showCoordinates: boolean = true;

  let boardElement: HTMLElement;
  let chessgroundApi: Api | null = null;
  let gameState = gameStore;

  // Subscribe to game store updates
  let unsubscribe: (() => void) | null = null;

  onMount(() => {
    if (!boardElement) return;

    // Initialize chessground
    try {
      const config: Config = {
        fen: $gameState.fen,
        orientation,
        turnColor: $gameState.turn === 'w' ? 'white' : 'black',
        coordinates: showCoordinates,
        animation: {
          enabled: true,
          duration: 200
        },
        highlight: {
          lastMove: true,
          check: true
        },
        movable: {
          free: false,
          color: disabled ? undefined : ($gameState.turn === 'w' ? 'white' : 'black'),
          dests: getLegalDestinations()
        },
        events: {
          move: handleMove
        }
      };

      chessgroundApi = Chessground(boardElement, config);
      
      // Subscribe to game state changes
      unsubscribe = gameState.subscribe(updateBoard);
    } catch (error) {
      console.error('Failed to initialize chessground:', error);
    }
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
    if (chessgroundApi) {
      chessgroundApi.destroy?.();
    }
  });

  function getLegalDestinations(): Map<any, any[]> {
    const dests = new Map();
    
    try {
      const moves = $gameState.game.moves({ verbose: true });
      
      for (const move of moves) {
        const from = move.from;
        const to = move.to;
        
        if (!dests.has(from)) {
          dests.set(from, []);
        }
        dests.get(from)?.push(to);
      }
    } catch (error) {
      console.warn('Failed to get legal destinations:', error);
    }
    
    return dests;
  }

  function handleMove(orig: string, dest: string): void {
    try {
      // Create a temporary game instance to test the move
      const tempGame = new Chess($gameState.fen);
      const testMove = tempGame.move({
        from: orig,
        to: dest,
        promotion: 'q' // Auto-promote to queen for now
      });
      
      if (testMove) {
        // Move is valid, update the store
        gameStore.makeMove({
          from: orig,
          to: dest,
          promotion: 'q'
        });
        
        // Play sound
        playMoveSound(testMove, tempGame, soundManager);
        
        // Dispatch move event for clock management
        const moveEvent = new CustomEvent('chessmove', {
          detail: { 
            move: testMove,
            gameState: $gameState
          }
        });
        document.dispatchEvent(moveEvent);
      } else {
        // Invalid move - reset piece position
        console.warn('Invalid move attempted:', orig, dest);
        if (chessgroundApi) {
          chessgroundApi.set({
            fen: $gameState.fen
          });
        }
      }
    } catch (error) {
      console.warn('Error handling move:', orig, dest, error);
      if (chessgroundApi) {
        chessgroundApi.set({
          fen: $gameState.fen
        });
      }
    }
  }

  function updateBoard(state: typeof $gameState): void {
    if (!chessgroundApi) return;

    try {
      chessgroundApi.set({
        fen: state.fen,
        turnColor: state.turn === 'w' ? 'white' : 'black',
        movable: {
          color: disabled ? undefined : (state.turn === 'w' ? 'white' : 'black'),
          dests: getLegalDestinations()
        },
        check: state.isCheck
      });

      // Highlight last move
      if (state.lastMove) {
        const history = state.game.history({ verbose: true });
        const lastMove = history[history.length - 1];
        if (lastMove) {
          chessgroundApi.set({
            lastMove: [lastMove.from, lastMove.to]
          });
        }
      }
    } catch (error) {
      console.warn('Failed to update board:', error);
    }
  }

  // React to prop changes
  $: if (chessgroundApi) {
    chessgroundApi.set({
      orientation,
      coordinates: showCoordinates
    });
  }

  $: if (chessgroundApi && disabled !== undefined) {
    chessgroundApi.set({
      movable: {
        color: disabled ? undefined : ($gameState.turn === 'w' ? 'white' : 'black')
      }
    });
  }

  // Export methods for parent components
  export function flip(): void {
    if (chessgroundApi) {
      chessgroundApi.toggleOrientation();
    }
  }

  export function resetBoard(): void {
    gameStore.reset();
  }
</script>

<div class="chessboard-container">
  <div 
    bind:this={boardElement} 
    class="chessboard"
    class:disabled
  ></div>
</div>

<style>
  .chessboard-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 32rem;
    margin: 0 auto;
  }

  .chessboard {
    width: 100%;
    aspect-ratio: 1;
    max-width: 600px;
    max-height: 600px;
    border: 2px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .chessboard.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  /* Chessground theme styles */
  :global(.cg-wrap) {
    width: 100% !important;
    height: 100% !important;
  }

  :global(.cg-board-wrap) {
    width: 100% !important;
    height: 100% !important;
  }

  :global(.cg-board) {
    width: 100% !important;
    height: 100% !important;
  }

  /* Custom chess square colors using CSS variables */
  :global(.cg-board square.light) {
    background-color: var(--chess-light-square) !important;
  }

  :global(.cg-board square.dark) {
    background-color: var(--chess-dark-square) !important;
  }

  /* Last move highlight */
  :global(.cg-board square.last-move) {
    background-color: var(--chess-last-move) !important;
  }

  /* Selected square */
  :global(.cg-board square.selected) {
    background-color: var(--chess-selected) !important;
  }

  /* Check highlight */
  :global(.cg-board square.check) {
    background-color: rgba(255, 0, 0, 0.3) !important;
  }

  /* Move destinations */
  :global(.cg-board square.move-dest) {
    background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 20%, transparent 20%) !important;
  }

  /* Coordinates styling */
  :global(.cg-board coords) {
    color: var(--chess-text-secondary) !important;
    font-weight: 600 !important;
  }
</style>