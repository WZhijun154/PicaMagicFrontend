import Swal from "sweetalert2";

export const showSuccessNotification = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
    showConfirmButton: false,
    timer: 1500,
    position: "top",
  });
};

export const showErrorNotification = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error!",
    text: message,
  });
};
