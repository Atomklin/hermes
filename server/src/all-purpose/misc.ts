export function handleAsyncFunction<T>(
  asyncFunction: () => Promise<T>,
  onSuccess: (result: T | undefined) => void,
  onFailure?: () => void
) {
  asyncFunction()
    .then(onSuccess)
    .catch(() => {
      onFailure != null 
        ? onFailure() 
        : onSuccess(undefined);
    });
}