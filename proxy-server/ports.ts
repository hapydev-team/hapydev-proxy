const cProcess = require('child_process');

export const DEFAULT_PORT = 30001;

export const clearUsedPort = function (port) {
  const exec = `lsof -i:${port}  | tail -1 | tr -s ' ' | cut -d ' ' -f 2`;
  return new Promise((resolve, reject) => {
    try {
      cProcess.exec(exec, (error, stdout) => {
        if (stdout === '') {
          resolve(true);
        } else {
          cProcess.exec(`kill -9 ${stdout}`, (kerr, kstdout) => {
            if (!kerr) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }
      });
    } catch (e) {
      // logger('clearUsedPort', String(e));
      resolve(true);
    }
  });
};
