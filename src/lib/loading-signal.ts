// The boot screen covers the page for a couple of seconds. Without this handoff
// the hero's entrance animation plays behind it and nobody ever sees it.
let loaded = false;
const listeners = new Set<() => void>();

export function markLoaded() {
  if (loaded) {
    return;
  }

  loaded = true;
  for (const listener of listeners) {
    listener();
  }
  listeners.clear();
}

export function hasLoaded() {
  return loaded;
}

export function onLoaded(listener: () => void) {
  if (loaded) {
    listener();
    return () => {};
  }

  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
