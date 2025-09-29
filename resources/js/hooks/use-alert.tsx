import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useFlashMessages } from './use-flash-messages';

export const useAlert = () => {
    const { success, error, info, warning, message } = useFlashMessages();

    useEffect(() => {
        const showAlert = () => {
            if (success) {
                Swal.fire(success, "", "success");
            }
            if (error) {
                Swal.fire(error, "", "error");
            }
            if (info) {
                Swal.fire(info, "", "info");
            }
            if (warning) {
                Swal.fire(warning, "", "warning");
            }
            if (message) {
                Swal.fire(message, "", "info");
            }
        };

        showAlert();
    }, [success, error, info, warning, message]);
};

// Utilisation dans un composant :
// import { useAlert } from './useAlert';
// useAlert();