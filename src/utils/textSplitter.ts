export interface TextSplitterOptions {
  type?: string;
  linesClass?: string;
}

export class TextSplitter {
  chars: HTMLElement[] = [];
  words: HTMLElement[] = [];
  lines: HTMLElement[] = [];
  elements: HTMLElement[] = [];
  private originalHTML = new Map<HTMLElement, string>();

  constructor(
    target: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
    options?: TextSplitterOptions
  ) {
    const type = options?.type || "chars,words,lines";
    const linesClass = options?.linesClass || "split-line";

    let elements: HTMLElement[] = [];
    if (typeof target === "string") {
      elements = Array.from(document.querySelectorAll<HTMLElement>(target));
    } else if (target instanceof NodeList) {
      elements = Array.from(target);
    } else if (Array.isArray(target)) {
      elements = target;
    } else if (target) {
      elements = [target];
    }

    this.elements = elements;

    elements.forEach((el) => {
      this.originalHTML.set(el, el.innerHTML);
      if (type.includes("chars") && type.includes("words")) {
        this.splitWords(el);
        this.splitCharsFromWords(el);
      } else if (type.includes("chars")) {
        this.splitChars(el);
      } else if (type.includes("words")) {
        this.splitWords(el);
      }
      if (type.includes("lines")) {
        this.splitLines(el, linesClass);
      }
    });
  }

  private splitChars(el: HTMLElement) {
    const chars = (el.textContent || "").split("");
    el.innerHTML = chars
      .map((c) =>
        c === " "
          ? '<span class="split-char"> </span>'
          : c === "\n"
          ? "<br>"
          : `<span class="split-char">${c}</span>`
      )
      .join("");
    this.chars.push(...Array.from(el.querySelectorAll<HTMLElement>(".split-char")));
  }

  private splitWords(el: HTMLElement) {
    const words = (el.textContent || "").split(/(\s+)/);
    el.innerHTML = words
      .map((w) =>
        w.trim().length === 0 ? w : `<span class="split-word">${w}</span>`
      )
      .join("");
    this.words.push(...Array.from(el.querySelectorAll<HTMLElement>(".split-word")));
  }

  private splitCharsFromWords(el: HTMLElement) {
    el.querySelectorAll<HTMLElement>(".split-word").forEach((word) => {
      const chars = (word.textContent || "").split("");
      word.innerHTML = chars
        .map((c) => `<span class="split-char">${c}</span>`)
        .join("");
      this.chars.push(
        ...Array.from(word.querySelectorAll<HTMLElement>(".split-char"))
      );
    });
  }

  private splitLines(el: HTMLElement, linesClass: string) {
    const items = el.querySelectorAll<HTMLElement>(".split-word, .split-char");
    if (items.length === 0) return;

    let currentLine: HTMLElement[] = [];
    const lines: HTMLElement[][] = [];
    let currentTop = 0;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (currentTop === 0) currentTop = rect.top;
      if (Math.abs(rect.top - currentTop) > 5) {
        if (currentLine.length > 0) lines.push([...currentLine]);
        currentLine = [item];
        currentTop = rect.top;
      } else {
        currentLine.push(item);
      }
    });

    if (currentLine.length > 0) lines.push(currentLine);

    lines.forEach((line) => {
      if (line.length === 0) return;
      const wrapper = document.createElement("span");
      wrapper.className = linesClass;
      wrapper.style.display = "block";
      const first = line[0];
      first.parentNode?.insertBefore(wrapper, first);
      line.forEach((node) => {
        if (node.parentNode === wrapper.parentNode) {
          wrapper.appendChild(node);
        }
      });
    });

    this.lines.push(
      ...Array.from(el.querySelectorAll<HTMLElement>(`.${linesClass}`))
    );
  }

  revert() {
    this.elements.forEach((el) => {
      const original = this.originalHTML.get(el);
      if (original !== undefined) {
        el.innerHTML = original;
      }
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.originalHTML.clear();
  }
}
