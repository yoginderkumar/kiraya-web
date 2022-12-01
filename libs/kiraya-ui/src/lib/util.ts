/**
 * Convert a file to base64 string
 */
export async function convertFileToBase64(file: Blob): Promise<string> {
  const imageAsBase64UrlString = await readFileAsDataURL(file);
  if (typeof imageAsBase64UrlString === 'string') {
    return convertDataURLtoBase64(imageAsBase64UrlString);
  }
  throw new Error('Can not convert file to base64');
}

/**
 * Read a file a Data URl
 * e.g. "data:image/png;base64,iVBORw0KGgoAA..."
 */
export async function readFileAsDataURL(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', function loadedFileInReader(e) {
      resolve(e.target?.result);
    });
    reader.addEventListener('error', function loadedFileInReader(e) {
      reject(e.target?.result);
    });
    reader.readAsDataURL(file);
  });
}

export function convertDataURLtoBase64(dataURL: string) {
  return dataURL.split(';base64,')[1];
}

/**
 * Check for a file size (KB)
 */
export function checkFileSize(max: number) {
  return function checkFilesForSize(files?: unknown | File | [File]): boolean {
    let valid = true;
    if (files) {
      if (!Array.isArray(files)) {
        files = [files];
      }
      if (Array.isArray(files)) {
        files.every((file) => {
          const size = file.size / 1024;
          if (size > max) {
            valid = false;
          }
          return valid;
        });
      }
    }
    return valid;
  };
}

export function checkFileTypes(types: Array<string>) {
  return function checkTypesForFiles(files?: unknown | File | [File]): boolean {
    let valid = true;
    if (files) {
      if (!Array.isArray(files)) {
        files = [files];
      }
      if (Array.isArray(files)) {
        files.every((file) => {
          if (!types.includes(file.type)) {
            valid = false;
          }
          return valid;
        });
      }
    }
    return valid;
  };
}
