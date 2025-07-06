import api from "@/src/config/api/axios.api";
import { AuthResponse, User } from "@/src/types/auth";

const AuthService = {
  login: async (email: string, password: string) => {
    return api.post<AuthResponse>('/auth/login', { email, password })
    .then(response => response.data);
  },
  register: async (data: { email: string; password: string; name: string }) => {
    return api.post<AuthResponse>('/auth/register', data)
    .then(response => response.data);
  },
  forgotPassword: async (email: string) => {
    return api.post<AuthResponse>('/auth/forgot-password', { email })
    .then(response => response.data);
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    return api.post<AuthResponse>('/auth/change-password', { oldPassword, newPassword })
    .then(response => response.data);
  },
  editProfile: async (data: { name?: string; email?: string }) => {
    return api.post<User>('/auth/edit-profile', data)
    .then(response => response.data);
  },
  showProfile: async () : Promise<User> => {
    return api.get<User>('/user/profile').then(response => response.data);
  },
};

export default AuthService;
