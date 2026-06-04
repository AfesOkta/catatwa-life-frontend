import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { LoginDto, RegisterDto } from "@/types/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (data) => {
      setToken(data.access_token);
      toast.success("Login berhasil");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login gagal");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: () => {
      toast.success("Registrasi berhasil, silakan login");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registrasi gagal");
    },
  });
};

export const useAuth = () => {
  const { isAuthenticated, logout } = useAuthStore();
  return { isAuthenticated, logout };
};
