`async/await` simplifies promise-based code, but its true power lies in advanced orchestration patterns that can handle complex asynchronous workflows. Let's explore sophisticated techniques that go beyond simple `await` statements.

## 1. Parallel vs Sequential Execution

Understanding when to run operations in parallel versus sequentially is crucial for performance optimization.

### Parallel Execution
```javascript
// All operations start simultaneously
const [user, posts, comments] = await Promise.all([
  getUser(userId),
  getPosts(userId),
  getComments(userId)
]);

// With error handling
const results = await Promise.allSettled([
  fetchUserData(),
  fetchPostData(),
  fetchCommentData()
]);

// Filter successful results
const successfulResults = results
  .filter(result => result.status === 'fulfilled')
  .map(result => result.value);
```

### Sequential Execution
```javascript
// Operations depend on each other
const user = await getUser(userId);
const posts = await getPosts(user.id);
const comments = await getComments(posts[0].id);

// With error handling and fallbacks
let user;
try {
  user = await getUser(userId);
} catch (error) {
  user = await getFallbackUser();
}

const posts = await getPosts(user.id);
```

### Hybrid Approach
```javascript
// Some operations in parallel, others sequential
const user = await getUser(userId);
const [posts, profile] = await Promise.all([
  getPosts(user.id),
  getProfile(user.id)
]);
```

## 2. Timeout and Race Conditions

Implementing timeouts and handling race conditions is essential for robust applications.

### Basic Timeout Pattern
```javascript
function withTimeout(promise, ms = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// Usage
try {
  const data = await withTimeout(fetchData(), 3000);
} catch (error) {
  if (error.message.includes('timed out')) {
    console.log('Request timed out, using cached data');
    return getCachedData();
  }
  throw error;
}
```

### Advanced Race Pattern
```javascript
async function raceWithFallback(primary, fallback, timeout = 5000) {
  try {
    return await withTimeout(primary(), timeout);
  } catch (error) {
    console.log('Primary failed, trying fallback');
    return await fallback();
  }
}

// Usage
const data = await raceWithFallback(
  () => fetchFromAPI(),
  () => fetchFromCache(),
  2000
);
```

### Cancellable Operations
```javascript
class CancellablePromise {
  constructor(executor) {
    this.isCancelled = false;
    this.promise = new Promise((resolve, reject) => {
      executor(
        (value) => !this.isCancelled && resolve(value),
        (error) => !this.isCancelled && reject(error)
      );
    });
  }

  cancel() {
    this.isCancelled = true;
  }

  then(onFulfilled, onRejected) {
    return this.promise.then(onFulfilled, onRejected);
  }
}

// Usage
const cancellableFetch = new CancellablePromise((resolve, reject) => {
  fetch('/api/data')
    .then(resolve)
    .catch(reject);
});

// Cancel if needed
setTimeout(() => cancellableFetch.cancel(), 5000);
```

## 3. Async Generators and Iterators

Async generators provide powerful streaming and processing capabilities.

### Basic Async Generator
```javascript
async function* streamData(urls) {
  for (const url of urls) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      yield data;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error);
      yield null;
    }
  }
}

// Usage
const urls = ['/api/users', '/api/posts', '/api/comments'];
for await (const data of streamData(urls)) {
  if (data) {
    processData(data);
  }
}
```

### Advanced Streaming with Backpressure
```javascript
async function* processLargeFile(filePath, batchSize = 1000) {
  const fileStream = createReadStream(filePath);
  const lineReader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let batch = [];
  for await (const line of lineReader) {
    batch.push(parseLine(line));

    if (batch.length >= batchSize) {
      yield batch;
      batch = [];
    }
  }

  if (batch.length > 0) {
    yield batch;
  }
}

// Usage with backpressure control
for await (const batch of processLargeFile('large-data.csv')) {
  await processBatch(batch);
  // Natural backpressure - next batch won't be yielded until this completes
}
```

### Async Iterator with Error Handling
```javascript
async function* resilientStream(iterable, retries = 3) {
  for (const item of iterable) {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await processItem(item);
        yield result;
        break; // Success, move to next item
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await delay(1000 * attempt); // Exponential backoff
        }
      }
    }

    if (lastError) {
      yield { error: lastError, item };
    }
  }
}
```

## 4. Advanced Error Handling Patterns

### Error Boundary Pattern
```javascript
async function withErrorBoundary(operation, fallback) {
  try {
    return await operation();
  } catch (error) {
    console.error('Operation failed:', error);
    return fallback(error);
  }
}

// Usage
const user = await withErrorBoundary(
  () => getUser(userId),
  (error) => ({ id: userId, name: 'Unknown User', error: error.message })
);
```

### Retry with Exponential Backoff
```javascript
async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const data = await retryWithBackoff(
  () => fetchUnreliableAPI(),
  5,
  1000
);
```

### Circuit Breaker Pattern
```javascript
class CircuitBreaker {
  constructor(failureThreshold = 5, resetTimeout = 60000) {
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}

// Usage
const breaker = new CircuitBreaker();
const result = await breaker.execute(() => fetchUnreliableService());
```

## 5. Advanced Orchestration Patterns

### Pipeline Pattern
```javascript
async function pipeline(...functions) {
  return functions.reduce(
    async (result, fn) => fn(await result),
    Promise.resolve()
  );
}

// Usage
const processedData = await pipeline(
  fetchData,
  validateData,
  transformData,
  saveData
);
```

### Fan-out/Fan-in Pattern
```javascript
async function fanOutFanIn(items, processor, concurrency = 5) {
  // Fan out: process items in parallel with limited concurrency
  const chunks = [];
  for (let i = 0; i < items.length; i += concurrency) {
    chunks.push(items.slice(i, i + concurrency));
  }

  const results = [];
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(item => processor(item))
    );
    results.push(...chunkResults);
  }

  return results;
}

// Usage
const processedItems = await fanOutFanIn(
  largeDataSet,
  async (item) => {
    const result = await processItem(item);
    return { ...item, processed: result };
  },
  10
);
```

### Async Queue Pattern
```javascript
class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// Usage
const queue = new AsyncQueue(3);
const results = await Promise.all([
  queue.add(() => fetchData(1)),
  queue.add(() => fetchData(2)),
  queue.add(() => fetchData(3)),
  queue.add(() => fetchData(4)),
  queue.add(() => fetchData(5))
]);
```

## Best Practices and Common Pitfalls

### 1. Always Handle Errors
```javascript
// ❌ Bad - unhandled promise rejection
const data = await fetchData();

// ✅ Good - proper error handling
try {
  const data = await fetchData();
} catch (error) {
  console.error('Failed to fetch data:', error);
  // Handle error appropriately
}
```

### 2. Avoid Mixing Promise and Async/Await
```javascript
// ❌ Bad - mixing patterns
async function badExample() {
  return fetchData().then(data => {
    return processData(data);
  });
}

// ✅ Good - consistent async/await
async function goodExample() {
  const data = await fetchData();
  return await processData(data);
}
```

### 3. Use Promise.allSettled for Independent Operations
```javascript
// ✅ Good - handles partial failures
const results = await Promise.allSettled([
  fetchUserData(),
  fetchPostData(),
  fetchCommentData()
]);

const successful = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);
```

### 4. Consider Memory Usage with Large Datasets
```javascript
// ❌ Bad - loads everything into memory
const allData = await Promise.all(
  largeArray.map(item => processItem(item))
);

// ✅ Good - processes in batches
async function* processInBatches(items, batchSize = 100) {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(item => processItem(item))
    );
    yield results;
  }
}
```

---

_Last updated: 2025‑06‑19_
