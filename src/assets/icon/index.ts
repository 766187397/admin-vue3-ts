import baseIcons from "./base/iconfont.json";
const font_family = baseIcons.font_family;
const prefix = baseIcons.css_prefix_text;
/** 处理 baseIcons */
export const baseIconsList: string[] = baseIcons.glyphs.map((item) => `${font_family} ${prefix}${item.font_class}`);
