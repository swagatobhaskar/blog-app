// This makes your toast logic reusable whether you're using sonner, react-toastify, notistack, etc.
type ToastFn = (message: string) => void;

type ActionOptions<T> = {
    onSuccess?: (result: T) => void;
    onError?: (error: unknown) => void;
    setLoading?: (isLoading: boolean) => void;
    showToast?: boolean;    // use sonner or react-hot-toast or any other
    successMessage?: string;
    errorMessage?: string;
    toastSuccessFn?: ToastFn;
    toastErrorFn?: ToastFn;
};

type ActionResult<T> = {
    data?: T;
    error?: unknown;
    success: boolean;
}

export default async function HandleAction<T>(
    action: () => Promise<T>,
    options?: ActionOptions<T>
): Promise<ActionResult<T>> {
    const {
        onSuccess,
        onError,
        setLoading,
        showToast = false,
        successMessage,
        errorMessage
    } = options || {};

    try {
        setLoading?.(true);
        const result = await action();
        onSuccess?.(result);
        // if ( showToast && successMessage && toastSuccessFn) {
        // toastSuccessFn(successMessage);
        // }
        return {data: result, success: true};
    } catch (err) {
        onError?.(err);
        console.error('[HandleAction Error]', err);
        // console.error('[HandleAction Error]', {
        //     error: err,
        //     context: {
        //         successMessage,
        //         errorMessage
        //     }
        // });

        // if ( showToast && errorMessage && toastErrorFn ) {
        // toastErrorFn(errorMessage || 'Something went wrong...');
        // }
        return {error: err, success: false};
    } finally {
        setLoading?.(false);
    }
}
