// View Transitions API TypeScript declarations
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition?(callback: () => void | Promise<void>): ViewTransition;
}

interface CSSStyleDeclaration {
  viewTransitionName?: string;
}
