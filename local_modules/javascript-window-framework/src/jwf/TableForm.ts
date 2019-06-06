/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Window, WINDOW_PARAMS, WINDOW_EVENT_MAP } from "./Window";
import { CalendarView } from "./CalendarView";
import "./scss/TableForm.scss";

export interface ITEM_OPTION {
  label?: string;
  type?: "date" | "string" | "number" | "checkbox" | "select" | "submit";
  name?: string;
  value?: string | number | boolean | Date;
  link?: string;
  image?: string;
  image_width?: string;
  events?: { [key: string]: () => void };
  options?: {
    name: string;
    value: string | number;
  }[];
}
export interface TableFormViewMap extends WINDOW_EVENT_MAP {
  itemChange: FormInputElement;
}

export type FormInputElement = (HTMLInputElement | HTMLSelectElement) & {
  type2?: string;
  value2?: Date | undefined;
};

/**
 *入力用ウインドウ
 *
 * @export
 * @class TableFormView
 * @extends {Window}
 */
export class TableFormView extends Window {
  private items: HTMLDivElement;
  private footer: HTMLDivElement;
  public constructor(params?: WINDOW_PARAMS) {
    super(params);
    this.setJwfStyle("TableFormView");
    const table = document.createElement("div");
    this.getClient().appendChild(table);

    const items = document.createElement("div");
    this.items = items;
    table.appendChild(items);

    const footer = document.createElement("div");
    this.footer = footer;
    this.getClient().appendChild(footer);
  }
  public addEventListener<K extends keyof TableFormViewMap>(
    type: K|string,
    listener: (this: Window, ev: TableFormViewMap[K]) => unknown
  ): void {
    super.addEventListener(type, listener as (e: unknown) => unknown);
  }
  public addItem(params: ITEM_OPTION | ITEM_OPTION[]): HTMLElement | null {
    //配列ならば分解し再入力
    if (Array.isArray(params)) {
      for (const item of params) this.addItem(item);
      return null;
    }

    if (params.type === "submit") {
      const button = document.createElement("button");
      if (params.label) button.textContent = params.label;
      if (params.name) button.name = params.name;
      this.footer.appendChild(button);
      if (params.events) {
        const events = params.events;
        for (const key in events) {
          button.addEventListener(key, events[key]);
        }
      }
      return button;
    } else {
      const that = this;
      const row = document.createElement(
        params.type === "checkbox" ? "label" : "div"
      );

      const label = document.createElement("div");
      row.appendChild(label);
      if (params.label) label.innerText = params.label;
      const data = document.createElement("div");
      row.appendChild(data);

      let input: FormInputElement;
      let tag: HTMLDivElement | HTMLAnchorElement;
      let date: Date;
      switch (params.type) {
        case "date":
          input = document.createElement("input");
          input.type2 = params.type;
          input.readOnly = true;
          input.type = "text";
          input.size = 14;
          input.name = params.name || "";
          date = new Date(params.value as string);
          input.value = params.value ? date.toLocaleDateString() : "-";
          input.value2 = date;
          data.appendChild(input);
          input.addEventListener(
            "click",
            (): void => {
              const calendar = new CalendarView({ frame: true });
              calendar.setPos();
              if (input instanceof HTMLInputElement && input.value2)
                calendar.setSelect(input.value2, true);
              calendar.addEventListener(
                "date",
                (e): void => {
                  input.value = e.date.toLocaleDateString();
                  if (input instanceof HTMLInputElement) input.value2 = e.date;
                  calendar.close();
                  this.callEvent("itemChange", input);
                }
              );
            }
          );
          break;
        case "number":
          input = document.createElement("input");
          input.type2 = params.type;
          input.type = "number";
          input.name = params.name || "";
          input.value = params.value
            ? (parseInt(params.value.toString()).toString() as string)
            : "";
          data.appendChild(input);
          break;
        case "string":
          input = document.createElement("input");
          input.type2 = params.type;
          input.type = "text";
          input.name = params.name || "";
          input.value = (params.value as string) || "";
          data.appendChild(input);
          break;
        case "checkbox":
          input = document.createElement("input");
          input.type2 = params.type;
          input.type = "checkbox";
          input.name = params.name || "";
          input.checked = params.value == true;
          data.appendChild(input);
          break;
        case "select":
          input = document.createElement("select");
          input.type2 = params.type;
          input.name = params.name || "";
          input.addEventListener("change", function(): void {
            that.callEvent("itemChange", this);
          });

          if (params.options) {
            for (const o of params.options) {
              const option = document.createElement("option");
              option.textContent = o.name;
              option.value = o.value as string;
              input.appendChild(option);
            }
          }
          data.appendChild(input);

          break;
        default:
          if (params.link) {
            tag = document.createElement("a");
            tag.target = "_blank";
            tag.href = params.link;
          } else {
            tag = document.createElement("div");
          }
          if (params.image) {
            const image = document.createElement("img");
            image.src = params.image;
            if (params.image_width) image.style.width = params.image_width;
            tag.appendChild(image);
          } else {
            tag.innerText = params.value as string;
          }
          data.appendChild(tag);
          break;
      }

      this.items.appendChild(row);
      return row;
    }
  }
  public getItem(name: string): HTMLElement | null {
    const node = this.getClient().querySelector(
      `[name="${name}"]`
    ) as HTMLElement | null;
    return node;
  }
  public getParams(): { [key: string]: string | number | boolean | undefined } {
    const values: { [key: string]: string | number | boolean | undefined } = {};
    const nodes = this.items.querySelectorAll("select,input");
    for (let length = nodes.length, i = 0; i < length; ++i) {
      const v = nodes[i] as FormInputElement;
      if (v instanceof HTMLSelectElement) {
        const name = v.name;
        const value = v.value;
        values[name] = value;
      } else if (v instanceof HTMLInputElement) {
        const vnode = v as HTMLInputElement & { value2?: typeof values[0] };
        const name = v.name;
        let value;
        switch (v.type2) {
          case "checkbox":
            value = v.checked;
            break;
          case "number":
            value = parseInt(v.value);
            break;
          case "date":
            if (v.value2) value = new Date(v.value2).toDateString();
            break;
          default:
            value = vnode.value2 ? vnode.value2 : v.value;
            break;
        }
        values[name] = value;
      }
    }
    return values;
  }
  public setParams(params: { [key: string]: string | number | boolean }): void {
    const nodes = this.items.querySelectorAll("select,input");
    for (let length = nodes.length, i = 0; i < length; ++i) {
      const v = nodes[i] as (HTMLInputElement | HTMLSelectElement) & {
        type2?: string;
        value2?: Date | undefined;
      };
      if (v instanceof HTMLSelectElement) {
        const value = params[v.name];
        if (value != null) v.value = value.toString();
      } else if (v instanceof HTMLInputElement) {
        const value = params[v.name];
        if (value != null) {
          switch (v.type2) {
            case "checkbox":
              v.checked = value as boolean;
              break;
            case "number":
              v.value = parseInt(value as string).toString();
              break;
            case "date":
              v.value = new Date(value.toString()).toLocaleDateString();
              v.value2 = new Date(value.toString());
              break;
            default:
              v.value = value.toString();
              break;
          }
        }
      }
    }
  }
}