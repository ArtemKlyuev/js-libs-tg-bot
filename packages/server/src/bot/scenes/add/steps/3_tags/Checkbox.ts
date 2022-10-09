import { Markup } from 'telegraf';

export class Checkbox {
  readonly #label: string;
  readonly #value: string;
  readonly #checked: boolean;

  constructor(label: string, value: string, checked: boolean) {
    this.#label = label;
    this.#value = value;
    this.#checked = checked;
  }

  render() {
    const finalText = this.#checked ? `✅ ${this.#label}` : this.#label;

    return Markup.button.callback(finalText, this.#value);
  }
}
