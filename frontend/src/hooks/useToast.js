import { toast } from "react-toastify";

function useToast() {
  const toastConfig = {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const sendError = (err) => {
    toast.error(err, toastConfig);
  };

  const sendInfo = (info) => {
    toast.info(info, toastConfig);
  };

  return { sendError, sendInfo };
}

export default useToast;
