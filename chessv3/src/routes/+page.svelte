<script lang="ts">
  import { onMount } from 'svelte';
  import ChessBoard from '$lib/board/ChessBoard.svelte';
  import Clock from '$lib/clocks/Clock.svelte';
  import { gameStore } from '$lib/stores/gameStore';
  import { CHESS_DEFAULTS } from '$lib/utils/chessUtils';
  // Using simple SVG icons instead of lucide-svelte
  import { soundManager } from '$lib/sound/soundManager';

  let boardRef: ChessBoard;
  let whiteClockRef: Clock;
  let blackClockRef: Clock;
  
  let currentPlayer: 'white' | 'black' = 'white';
  let gameStarted = false;
  let soundEnabled = true;

  // Game settings
  let timeControl = CHESS_DEFAULTS.timeControl;
  let increment = CHESS_DEFAULTS.increment;
  let whitePlayerName = CHESS_DEFAULTS.playerNames.white;
  let blackPlayerName = CHESS_DEFAULTS.playerNames.black;

  $: gameState = $gameStore;
  $: isWhiteTurn = gameState.turn === 'w';
  
  onMount(() => {
    // Listen for chess moves to switch clocks
    const handleChessMove = (event: CustomEvent) => {
      if (!gameStarted) return;
      
      const { gameState } = event.detail;
      currentPlayer = gameState.turn === 'w' ? 'white' : 'black';
    };

    // Listen for time-up events
    const handleTimeUp = (event: CustomEvent) => {
      const { player } = event.detail;
      gameStarted = false;
      alert(`${player === 'white' ? whitePlayerName : blackPlayerName} ran out of time!`);
    };

    document.addEventListener('chessmove', handleChessMove as EventListener);
    document.addEventListener('timeup', handleTimeUp as EventListener);

    return () => {
      document.removeEventListener('chessmove', handleChessMove as EventListener);
      document.removeEventListener('timeup', handleTimeUp as EventListener);
    };
  });

  function startNewGame(): void {
    try {
      gameStore.reset();
      whiteClockRef?.reset();
      blackClockRef?.reset();
      currentPlayer = 'white';
      gameStarted = true;
    } catch (error) {
      console.error('Failed to start new game:', error);
    }
  }

  function flipBoard(): void {
    try {
      boardRef?.flip();
    } catch (error) {
      console.error('Failed to flip board:', error);
    }
  }

  function toggleSound(): void {
    soundEnabled = !soundEnabled;
    soundManager.setEnabled(soundEnabled);
  }

  // Handle game end states
  $: if (gameState.isGameOver && gameStarted) {
    gameStarted = false;
    
    let message = '';
    if (gameState.isCheckmate) {
      const winner = gameState.turn === 'w' ? blackPlayerName : whitePlayerName;
      message = `Checkmate! ${winner} wins!`;
    } else if (gameState.isStalemate) {
      message = 'Stalemate! The game is a draw.';
    } else if (gameState.isDraw) {
      message = 'The game is a draw.';
    }
    
    if (message) {
      setTimeout(() => alert(message), 100);
      soundManager.play('gameEnd');
    }
  }
</script>

<svelte:head>
  <title>ChessV3 - Modern Chess Game</title>
  <meta name="description" content="A modern chess game built with SvelteKit, chess.js, and chessground" />
</svelte:head>

<main class="min-h-screen py-8 px-4 bg-chess-bg">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <header class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 text-chess-accent">
        ChessV3
      </h1>
      <p class="text-lg opacity-80 text-chess-text-secondary">
        Modern Chess Experience
      </p>
    </header>

    <!-- Game Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <!-- Left Panel - Black Player & Controls -->
      <div class="order-2 lg:order-1 space-y-6">
        
        <!-- Black Clock -->
        <div class="flex justify-center">
          <Clock 
            bind:this={blackClockRef}
            initialTime={timeControl}
            {increment}
            isActive={gameStarted && currentPlayer === 'black'}
            playerName={blackPlayerName}
            isWhite={false}
          />
        </div>

        <!-- Game Controls -->
        <div class="flex flex-col items-center space-y-4 bg-chess-card p-6 rounded-lg">
          
          <div class="flex gap-4">
            <button 
              on:click={startNewGame}
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-chess-primary text-white"
              class:opacity-50={gameStarted}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5,3 19,12 5,21 5,3"/>
              </svg>
              New Game
            </button>

            <button 
              on:click={flipBoard}
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-chess-dark text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1,4 1,10 7,10"/>
                <path d="m3,4 a9 9 0 1 1 2.3 6.6"/>
              </svg>
              Flip
            </button>

            <button 
              on:click={toggleSound}
              class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors bg-chess-card text-chess-text-secondary"
            >
              {#if soundEnabled}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>
                  <path d="m19.07,4.93 a10 10 0 0 1 0 14.14M15.54,8.46 a5 5 0 0 1 0 7.07"/>
                </svg>
              {:else}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              {/if}
            </button>
          </div>

          <!-- Sound Test Controls -->
          <div class="flex flex-wrap gap-2 justify-center">
            <button 
              on:click={() => soundManager.play('move')}
              class="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Move
            </button>
            <button 
              on:click={() => soundManager.play('capture')}
              class="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
            >
              Capture
            </button>
            <button 
              on:click={() => soundManager.play('check')}
              class="px-3 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Check
            </button>
            <button 
              on:click={() => soundManager.play('castle')}
              class="px-3 py-1 text-sm rounded bg-green-500 text-white hover:bg-green-600"
            >
              Castle
            </button>
            <button 
              on:click={() => soundManager.play('gameEnd')}
              class="px-3 py-1 text-sm rounded bg-purple-500 text-white hover:bg-purple-600"
            >
              Game End
            </button>
          </div>

          <!-- Game Status -->
          <div class="text-center">
            <div class="text-lg font-medium mb-2 text-chess-accent">
              {#if !gameStarted}
                Ready to Play
              {:else if gameState.isCheck}
                Check!
              {:else}
                {isWhiteTurn ? whitePlayerName : blackPlayerName} to move
              {/if}
            </div>
            
            {#if gameState.moveHistory.length > 0}
              <div class="text-sm opacity-70 text-chess-text-secondary">
                Move {Math.ceil(gameState.moveHistory.length / 2)}
                {#if gameState.lastMove}
                  • Last: {gameState.lastMove}
                {/if}
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Center - Chess Board -->
      <div class="order-1 lg:order-2">
        <ChessBoard 
          bind:this={boardRef}
          orientation="white"
          disabled={!gameStarted || gameState.isGameOver}
          showCoordinates={true}
        />
      </div>

      <!-- Right Panel - White Player & Game Info -->
      <div class="order-3 space-y-6">
        
        <!-- White Clock -->
        <div class="flex justify-center">
          <Clock 
            bind:this={whiteClockRef}
            initialTime={timeControl}
            {increment}
            isActive={gameStarted && currentPlayer === 'white'}
            playerName={whitePlayerName}
            isWhite={true}
          />
        </div>

        <!-- Move History -->
        <div class="p-4 rounded-lg bg-chess-card">
          <h3 class="text-lg font-semibold mb-3 text-chess-accent">
            Move History
          </h3>
          
          <div class="max-h-64 overflow-y-auto">
            {#if gameState.moveHistory.length === 0}
              <p class="text-sm opacity-70 text-chess-text-secondary">
                No moves yet
              </p>
            {:else}
              <div class="space-y-1">
                {#each Array.from({length: Math.ceil(gameState.moveHistory.length / 2)}) as _, i}
                  {@const whiteMove = gameState.moveHistory[i * 2]}
                  {@const blackMove = gameState.moveHistory[i * 2 + 1]}
                  
                  <div class="flex text-sm">
                    <span class="w-8 opacity-70 text-chess-text-secondary">
                      {i + 1}.
                    </span>
                    <span class="w-16 font-mono text-white">
                      {whiteMove ?? ''}
                    </span>
                    <span class="w-16 font-mono text-white">
                      {blackMove ?? ''}
                    </span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="text-center mt-12 pt-8 border-t border-chess-text-secondary border-opacity-20 text-chess-text-secondary">
      <p class="text-sm opacity-70">
        Built with SvelteKit • chess.js • chessground • Tailwind CSS
      </p>
      <p class="text-sm opacity-60 mt-2 text-center">
        By Mansour W. Ahmed
      </p>
    </footer>
  </div>
</main>
