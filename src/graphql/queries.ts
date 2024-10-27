export const GET_LESSONS = `
  query GetLessons {
    lessons {
      id
      title
      lessonNumber
    }
  }
`;

export const GET_LESSON = `
  query GetLesson($id: ID!) {
    lesson(id: $id) {
      id
      title
      lessonNumber
      vocabulary {
        id
        english
        greek
        greeklish
      }
    }
  }
`;
