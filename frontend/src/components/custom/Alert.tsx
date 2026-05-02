// src/components/custom/Alert.tsx
import Swal from 'sweetalert2';

interface AlertProps {
    status: boolean;
    text: string;
}

const Alert: React.FC<AlertProps> = ({ status, text }) => {
    Swal.fire({
        icon: status ? 'success' : 'error', // Correct way to set icon
        title: status ? 'Success!' : 'Error!',
        text: text,
        showConfirmButton: false,
        timer: 3000, // Auto-close after 3 seconds
        didOpen: (popup) => {
            popup.style.zIndex = '99999';
        },
    });

    return null; // No need to return JSX
};

export default Alert;
