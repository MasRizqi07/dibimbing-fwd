export interface ProjectItem {
  id: string;
  title: string;
  type: string;
  result: string;
  imagePath: string | null;
  className: string | null;
  order: number;
}

export interface SubmissionItem {
  id: string;
  name: string;
  email: string;
  message: string;
  emailSent: boolean;
  status: string;
  notificationStatus: string;
  createdAt: Date;
}
