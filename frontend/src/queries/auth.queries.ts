import { AuthApi } from "@/api/auth-api";
import { useMutation } from "@tanstack/react-query";

export function useSignInMutation(options: {
  onSuccess: (res: AuthApi.SignInRes) => void;
  onError?: (e: any) => void;
}) {
  const mutation = useMutation({
    mutationFn: AuthApi.signIn,
    onSuccess(res) {
      options.onSuccess(res);
    },
    onError(e) {
      options.onError?.(e);
    },
  });
  return mutation;
}

export function useSignUpMutation(options: {
  onSuccess: (res: AuthApi.SignUpRes) => void;
  onError?: (e: any) => void;
}) {
  const mutation = useMutation({
    mutationFn: AuthApi.signUp,
    onSuccess(res) {
      options.onSuccess(res);
    },
    onError(e) {
      options.onError?.(e);
    },
  });
  return mutation;
}
