var loggingEnabled = true;

function log(...args) {
  if (!loggingEnabled) {
    return;
  }

  console.log.apply(console, args);
}
