export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Utility function to handle concurrency
export async function runWithConcurrencyLimit<T>(
  limit: number,
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  const results: Promise<T>[] = [];
  const executing: Promise<T>[] = [];

  for (const task of tasks) {
    const promise = task().then((result) => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    results.push(promise);
    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

export class TaskPool<T> {
  private limit: number;
  private taskQueue: (() => Promise<T>)[] = [];
  private executing: Promise<T>[] = [];
  private paused: boolean = false;
  private running: boolean = true;

  constructor(limit: number) {
    this.limit = limit;
    this.run(); // Start the infinite loop when the pool is created
  }

  // Add a task to the queue
  addTask(task: () => Promise<T>): void {
    this.taskQueue.push(task);
    if (!this.paused && this.executing.length < this.limit) {
      this.runNextTask();
    }
  }

  // Function to run the next task in the queue
  private async runNextTask() {
    if (
      this.taskQueue.length === 0 ||
      this.paused ||
      this.executing.length >= this.limit
    ) {
      return;
    }

    const task = this.taskQueue.shift();
    if (task) {
      const promise = task().then((result) => {
        this.executing.splice(this.executing.indexOf(promise), 1);
        this.runNextTask(); // Run the next task after this one completes
        return result;
      });
      this.executing.push(promise);
    }
  }

  // Main loop to continuously run tasks
  private async run() {
    while (this.running) {
      if (
        !this.paused &&
        this.taskQueue.length > 0 &&
        this.executing.length < this.limit
      ) {
        this.runNextTask();
      }
      await new Promise((resolve) => setTimeout(resolve, 500)); // Idle when there's nothing to do
    }
  }

  // Pause the execution of tasks
  pause(): void {
    this.paused = true;
  }

  // Resume the execution of tasks
  resume(): void {
    this.paused = false;
    this.runNextTask(); // Immediately try to run the next task
  }

  // Stop the task pool entirely
  stop(): void {
    this.running = false;
    this.paused = true;
    this.taskQueue = [];
    this.executing = [];
  }

  // Check if the pool is currently paused
  isPaused(): boolean {
    return this.paused;
  }
}
