/// <reference types="react" />
/// <reference types="dayjs" />
/// <reference types="@mui/system"/>

type Currency = "USD" | "EUR" | "GBP";
type Frequency = "daily" | "weekly" | "monthly" | "yearly";
type Status = "Active" | "Canceled" | "Expired" | "Paused";
type Category =
  | "Sports"
  | "News"
  | "Entertainment"
  | "Lifestyle"
  | "Technology"
  | "Finance"
  | "Politics"
  | "Business"
  | "Other";

interface ExtraPaperProps {
  background: 'light' | 'main' | 'dark';
  padding?: boolean;
}

interface RequireAuthProps {
  children: React.ReactElement; 
}

interface FormButtonProps {
  disabled?: boolean;
  mounted?: boolean;
}

interface User {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

interface SubscriptionInput {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  status: Status;
  startDate: Dayjs;
  renewalDate: Dayjs;
}

interface Subscription {
  _id: string;
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  startDate: Dayjs;
  renewalDate: Dayjs;
  status?: Status;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  [key: string]: string;
}

interface SubscriptionInputProps {
  name: string;
  price: number;
  currency: Currency; 
  frequency: Frequency;
  category: Category; 
  paymentMethod: string;
  startDate: Dayjs; 
  renewalDate: Dayjs; 
  status?: Status;
}

interface SubscriptionInput {
  name: string;
  price: number;
  currency: Currency;
  frequency: Frequency;
  category: Category;
  paymentMethod: string;
  status: Status;
  startDate: Dayjs;
  renewalDate: Dayjs;
}

interface SubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  subscriptionInput: SubscriptionInput;
  formErrors: Record<string, string>;
  onSubscriptionChange: (updatedSubscription: SubscriptionInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

interface FormFeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean;
  success?: boolean;
  sx?: SxProps<Theme>;
}

interface FormButtonProps {
  disabled?: boolean;
  mounted?: boolean;
}

interface ExtraPaperProps {
  background: 'light' | 'main' | 'dark';
  padding?: boolean;
}

interface RequireAuthProps {
  children: React.ReactElement; 
}