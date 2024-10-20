// import { gql } from "@apollo/client";

// export const GET_NOVELS = `
//   query Novels {
//     novels {
//       id
//       title
//       image
//       createdAt
//       author {
//         id
//         name
//         novelId
//       }
//     }
//   }
// `;

// export const GET_NOVEL = gql`
//   query Novel($id: ID!) {
//     novel(id: $id) {
//       id
//       title
//       image
//       createAt
//       author {
//         id
//         name
//         novelId
//       }
//     }
//   }
// `;

export const GET_LESSONS = `
  query Lessons {
    lessons {
      id
      title
      lessonNumber
    }
  }
`;

export const GET_LESSON = `
query Lessons($id: ID!) {
    lesson(id: $id) {
      id
      title
      lessonNumber
      vocabulary {
        english
        greek
        greeklish
      }
    }
  }
`;
