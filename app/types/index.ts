// ── User ──────────────────────────────────────────────
export interface IAvatar {
  public_id: string;
  url: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: IAvatar;
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  createdAt: string;
  updatedAt: string;
}

// ── Course ────────────────────────────────────────────
export interface ILink {
  _id?: string;
  title: string;
  url: string;
}

export interface IComment {
  _id: string;
  user: IUser;
  question: string;
  questionReplies?: IComment[];
  createdAt: string;
  comment?: string;
  answer?: string;
}

export interface IReview {
  _id: string;
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
  createdAt: string;
}

export interface ICourseData {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail?: { public_id: string; url: string };
  videoSection: string;
  videoLength: string;
  videoPlayer?: string;
  links: ILink[];
  suggestion?: string;
  questions?: IComment[];
}

export interface ICourse {
  _id: string;
  name: string;
  description: string;
  categories: string;
  price: number;
  estimatedPrice?: number;
  thumbnail?: { public_id: string; url: string };
  tags: string;
  level: string;
  demoUrl: string;
  benefits: Array<{ title: string }>;
  prerequisites: Array<{ title: string }>;
  reviews?: IReview[];
  courseData?: ICourseData[];
  rating: number;
  purchased: number;
  createdAt: string;
  updatedAt: string;
}

// ── Order ─────────────────────────────────────────────
export interface IOrder {
  _id: string;
  courseId: string;
  userId: string;
  payment_info?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ── Notification ──────────────────────────────────────
export interface INotification {
  _id: string;
  title: string;
  message: string;
  status: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Layout ────────────────────────────────────────────
export interface IFaqItem {
  _id?: string;
  question: string;
  answer: string;
}

export interface ICategory {
  _id?: string;
  title: string;
}

export interface IBannerImage {
  public_id: string;
  url: string;
}

export interface ILayout {
  _id?: string;
  type: string;
  faq?: IFaqItem[];
  categories?: ICategory[];
  banner?: { image: IBannerImage; title: string; subtitle: string };
}

// ── Analytics ─────────────────────────────────────────
export interface IMonthData {
  month: string;
  count: number;
}

// ── Course Info Form (frontend state) ─────────────────
export interface ICourseInfo {
  name: string;
  description: string;
  categories: string;
  price: string;
  estimatedPrice: string;
  tags: string;
  level: string;
  demoUrl: string;
  thumbnail: string;
}

// ── Course Content Form (frontend state) ──────────────
export interface ICourseContentItem {
  videoUrl: string;
  title: string;
  description: string;
  videoSection: string;
  videoLength: string;
  links: ILink[];
  suggestion: string;
}
