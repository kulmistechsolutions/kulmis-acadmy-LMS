export type EnrichedCourse = {
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl: string | null;
  accessType: string;
  host: string;
  totalLessons: number;
  totalDuration: string | null;
  totalWatchHours: number;
  completionRate: number;
  certificatesIssued: number;
  studentsEnrolled: number;
  createdDate: string | null;
  createdAt: string | null; // ISO for sorting
};
