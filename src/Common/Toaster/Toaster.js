import { toast } from 'react-toastify';

function useToaster() {
    // const toast = useToast();

    function showSuccessMessage(message,title = '', time = 4000) {
        toast(message
            // description: message,
            // status: "success",
            // duration: time,
            // isClosable: true,
            // position: "top-right",
        );
    }

    function showErrorMessage(message,title = '', time = 4000) {
        toast(message);
    }

    function showWarnMessage(message,title = '', time = 4000) {
        toast(message);
    }

    function showInfoMessage(message, status = '', time = 4000) {
        toast(message);
    }

    function clearToastr() {
        toast.closeAll();
    }

    return {
        showSuccessMessage,
        showErrorMessage,
        showWarnMessage,
        showInfoMessage,
        clearToastr,
    };
}

export default useToaster;
