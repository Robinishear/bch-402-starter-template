import Swal from 'sweetalert2';

export const showSuccessAlert = (message: string) => {
  Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
    draggable: true,
    confirmButtonText: "OK"
  });
};

export const showErrorAlert = (message: string) => {
  Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
    confirmButtonText: "Try Again"
  });
};