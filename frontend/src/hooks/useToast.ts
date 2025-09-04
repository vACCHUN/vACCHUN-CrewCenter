import { toast, ToastOptions } from "react-toastify";

function useToast() {
  const toastConfig: ToastOptions = {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const sendError = (err = "Something went wrong") => {
    toast.error(err, toastConfig);
  };

  const sendInfo = (info: string) => {
    toast.info(info, toastConfig);
  };

  return { sendError, sendInfo };
}

export default useToast;
