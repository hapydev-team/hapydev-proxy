const getCachePath = () => {
  let cache_path = process.env['TMPDIR'];
  if (!cache_path) {
    cache_path = process.env['LOCALAPPDATA'];
  }
  if (!cache_path) {
    cache_path = process.env['HOME'];
  }
  if (!cache_path) {
    cache_path = process.env['PWD'];
  }
  return cache_path;
};

export default getCachePath;
