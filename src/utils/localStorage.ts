/* eslint-disable @typescript-eslint/no-explicit-any */

export const getLocalStorageItem = <T>(itemName: string): T | null => {
  try {
    const item = localStorage.getItem(itemName);
    if (item && (item.startsWith('{') || item.startsWith('['))) {
      return JSON.parse(item);
    }
    return item ? (item as T) : null;
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin từ localStorage cho item ${itemName}:`, error);
    return null;
  }
};

export const updateFieldInLocalStorage = <T extends Record<string, any>>(
  fieldName: string,
  fieldKey: keyof T,
  newValue: any,
): void => {
  try {
    const storedData = getLocalStorageItem<T>(fieldName);

    if (!storedData || typeof storedData !== 'object' || !(fieldKey in storedData)) {
      console.error(`Đối tượng "${fieldName}" không hợp lệ hoặc thiếu trường "${String(fieldKey)}".`);
      return;
    }

    // Cập nhật giá trị và lưu lại vào localStorage
    storedData[fieldKey] = newValue;
    localStorage.setItem(fieldName, JSON.stringify(storedData));
  } catch (error) {
    console.error(`Lỗi khi cập nhật trường "${String(fieldKey)}" của "${fieldName}" trong localStorage:`, error);
  }
};

export const addOrUpdateFieldInLocalStorage = <T extends Record<string, any>>(
  fieldName: string | null,
  fieldKey: keyof T | string | symbol | null,
  newValue: any,
): void => {
  try {
    if (fieldName) {
      const storedData = getLocalStorageItem<T>(fieldName) || ({} as T);

      if (fieldKey) {
        storedData[fieldKey as keyof T] = newValue;
        localStorage.setItem(fieldName, JSON.stringify(storedData));
      } else {
        console.error(`Tên trường không hợp lệ: "${String(fieldKey)}".`);
      }
    } else if (fieldKey) {
      // Tạo mới item nếu không có `fieldName`
      localStorage.setItem(String(fieldKey), JSON.stringify(newValue));
    } else {
      console.error('Không thể thêm hoặc cập nhật, cả fieldName và fieldKey đều null.');
    }
  } catch (error) {
    console.error(`Lỗi khi thêm hoặc cập nhật trường trong localStorage:`, error);
  }
};
