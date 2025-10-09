<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { formatTime } from '$lib/utils/chessUtils';

  export let initialTime: number = 600; // 10 minutes default
  export let increment: number = 0;
  export let isActive: boolean = false;
  export let playerName: string = 'Player';
  export let isWhite: boolean = true;

  let timeRemaining: number = initialTime;
  let intervalId: NodeJS.Timeout | null = null;
  let lastTickTime: number = Date.now();

  $: timeDisplay = formatTime(timeRemaining);
  $: isLowTime = timeRemaining <= 60; // Less than 1 minute
  $: isCriticalTime = timeRemaining <= 10; // Less than 10 seconds

  function startClock(): void {
    if (intervalId) return;
    
    lastTickTime = Date.now();
    intervalId = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - lastTickTime) / 1000);
      
      if (elapsed >= 1) {
        timeRemaining = Math.max(0, timeRemaining - elapsed);
        lastTickTime = now;
        
        if (timeRemaining === 0) {
          stopClock();
          // Dispatch time-up event
          const event = new CustomEvent('timeup', {
            detail: { player: isWhite ? 'white' : 'black' }
          });
          document.dispatchEvent(event);
        }
      }
    }, 100);
  }

  function stopClock(): void {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function addIncrement(): void {
    if (increment > 0) {
      timeRemaining += increment;
    }
  }

  // React to isActive changes
  $: {
    if (isActive) {
      startClock();
    } else {
      stopClock();
      if (timeRemaining > 0) {
        addIncrement();
      }
    }
  }

  // Reset time when initialTime changes
  $: {
    if (initialTime !== undefined) {
      timeRemaining = initialTime;
    }
  }

  onMount(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });

  onDestroy(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });

  export function reset(): void {
    stopClock();
    timeRemaining = initialTime;
  }

  export function getTimeRemaining(): number {
    return timeRemaining;
  }
</script>

<div 
  class="clock-container {isWhite ? 'white-clock' : 'black-clock'}"
  class:active={isActive}
  class:low-time={isLowTime}
  class:critical-time={isCriticalTime}
>
  <div class="player-name">
    {playerName}
  </div>
  
  <div class="time-display">
    {timeDisplay}
  </div>
  
  {#if increment > 0}
    <div class="increment-info">
      +{increment}s
    </div>
  {/if}
</div>

<style>
  .clock-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 2px solid transparent;
    background-color: #1f2937;
    color: white;
    transition: all 0.2s;
    min-width: 160px;
    min-height: 100px;
  }

  .white-clock {
    background-color: #f3f4f6;
    color: #111827;
  }

  .black-clock {
    background-color: #111827;
    color: white;
  }

  .clock-container.active {
    border-color: #3b82f6;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transform: scale(1.05);
  }

  .white-clock.active {
    border-color: #60a5fa;
  }

  .black-clock.active {
    border-color: #2563eb;
  }

  .clock-container.low-time {
    border-color: #eab308;
  }

  .clock-container.critical-time {
    border-color: #ef4444;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .player-name {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  .time-display {
    font-size: 1.5rem;
    font-weight: bold;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    letter-spacing: 0.05em;
  }

  .increment-info {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 0.25rem;
  }

  .critical-time .time-display {
    color: #ef4444;
  }

  .low-time .time-display {
    color: #eab308;
  }

  .white-clock .time-display {
    color: #111827;
  }

  .white-clock.critical-time .time-display {
    color: #dc2626;
  }

  .white-clock.low-time .time-display {
    color: #d97706;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
    }
  }
</style>