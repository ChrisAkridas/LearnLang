export type Vocabulary = {
  id: string;
  english: string;
  greek: string;
  greeklish: string;
};

export type Lesson = {
  id: string;
  title: string;
  lessonNumber: number;
  createdAt: string;
  updatedAt: string;
  vocabulary: Vocabulary[];
};
