// Cross-component signals for things that live far apart in the tree (the
// command palette in the navbar, the project browser in Works). Window events
// keep them decoupled without hoisting state into a context for two callers.
export const OPEN_PALETTE_EVENT = "kr:open-palette";
export const SELECT_PROJECT_EVENT = "kr:select-project";

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

export function showProjectInWorks(title: string) {
  window.dispatchEvent(new CustomEvent<string>(SELECT_PROJECT_EVENT, { detail: title }));
}

export function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}
