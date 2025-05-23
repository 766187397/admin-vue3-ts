import iconInfo from "./iconfont.json";
const font_family = iconInfo.font_family;
const prefix = iconInfo.css_prefix_text;
export const customIcons: string[] = iconInfo.glyphs.map((item) => `${font_family} ${prefix}${item.font_class}`);
console.log("customIcons", customIcons);
