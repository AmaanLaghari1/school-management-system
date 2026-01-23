import Swal from 'sweetalert2';

const AlertConfirm = async ({ title = 'Are you sure?', text = 'You won\'t be able to revert this!', confirmBtnText=null, cancelBtnText=null }) => {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmBtnText??'Yes',
        cancelButtonText: cancelBtnText??'Cancel',
        allowOutsideClick: false
    });
    return result.isConfirmed;
};

export default AlertConfirm;
