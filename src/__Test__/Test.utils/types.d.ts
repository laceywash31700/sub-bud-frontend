interface ApiResponse<T = any> {
  success: boolean;
  data: T;
}

interface AuthResponseData {
  user: {
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}