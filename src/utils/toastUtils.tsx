import toast from 'react-hot-toast';
import { IconAlertOctagonFilled, IconInfoOctagonFilled } from '@tabler/icons-react';

export enum ToastType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  PROMISE = 'promise',
}

const toastSuccess = (message: string) => {
  toast.success(message);
};

const toastInfo = (message: string) => {
  toast(message, {
    icon: <IconInfoOctagonFilled color="#74c0fc" />,
  });
};

const toastWarning = (message: string) => {
  toast(message, {
    icon: <IconAlertOctagonFilled color="#ffa94d" />,
  });
};

const toastError = (message: string) => {
  toast.error(message);
};

const toastPromise = <T,>(promise: Promise<T>) => {
  return toast.promise(promise, {
    loading: 'Loading...',
    success: (result: T) => (typeof result === 'string' ? result : 'Success'),
    error: (err: { message: string }) => (err?.message ? err.message : 'An error occurred'),
  });
};

export const showToast = <T,>(message: string, type: ToastType, promise?: Promise<T>) => {
  switch (type) {
    case ToastType.SUCCESS:
      toastSuccess(message);
      break;
    case ToastType.INFO:
      toastInfo(message);
      break;
    case ToastType.WARNING:
      toastWarning(message);
      break;
    case ToastType.ERROR:
      toastError(message);
      break;
    case ToastType.PROMISE:
      if (promise) {
        toastPromise(promise);
      }
      break;
    default:
      toastSuccess(message);
  }
};
