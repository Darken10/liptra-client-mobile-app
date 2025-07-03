const AuthService = {
  login: async (email: string, password: string) => {
    // Simuler un appel API
    return new Promise((resolve) =>
      setTimeout(() => resolve({ token: 'fake-token', user: { email, name: 'John Doe' } }), 500)
    );
  },
  register: async (data: { email: string; password: string; name: string }) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ token: 'fake-token', user: { email: data.email, name: data.name } }), 500)
    );
  },
  forgotPassword: async (email: string) => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  editProfile: async (data: { name?: string; email?: string }) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ ...data }), 500)
    );
  },
  showProfile: async (token: string) => {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ email: 'john@example.com', name: 'John Doe' }), 500)
    );
  },
};

export default AuthService;
