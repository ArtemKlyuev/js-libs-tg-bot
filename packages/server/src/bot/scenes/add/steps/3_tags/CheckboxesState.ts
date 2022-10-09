export class CheckboxesState {
  readonly #checkboxes: Map<string, boolean> = new Map();

  constructor(checkboxes: string[]) {
    checkboxes.forEach((checkbox) => {
      this.#checkboxes.set(checkbox, false);
    });
  }

  toggleCheckbox(name: string): void {
    const hasCheckbox = this.#checkboxes.has(name);

    if (!hasCheckbox) {
      return;
    }

    const state = this.#checkboxes.get(name)!;

    this.#checkboxes.set(name, !state);
  }

  getCheckboxState(name: string): boolean {
    const state = this.#checkboxes.get(name);

    return Boolean(state);
  }

  get hasCheckedCheckboxes(): boolean {
    const checkedCheckboxes = this.checkedCheckboxes;

    return checkedCheckboxes.length > 0;
  }

  get checkedCheckboxes(): string[] {
    const result: string[] = [];

    for (let [tag, checked] of this.#checkboxes) {
      if (checked) {
        result.push(tag);
      }
    }

    return result;
  }
}
