import { OnVisualizing } from '../type';
const artTemplate = require('art-template');

export const Visualizing = (onVisualizing: OnVisualizing, template, data) => {
  try {
    const html = artTemplate.render(template, data);
    onVisualizing(true, null, html);
  } catch (err) {
    onVisualizing(false, err, null);
  }
};
