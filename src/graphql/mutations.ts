// import { gql } from "@apollo/client";

// export const ADD_NOVEL = gql`
//   mutation AddNovel($title: String, $image: String) {
//     addNovel(title: $title, image: $image) {
//       id
//       title
//       image
//       createdAt
//       # author {
//       #   id
//       #   name
//       #   novelId
//       # }
//     }
//   }
// `;

// export const UPDATE_NOVEL = gql`
//   mutation UpdateNovel($id: ID!, $image: String, $title: String) {
//     updateNovel(id: $id, image: $image, title: $title) {
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

// export const DELETE_NOVEL = gql`
//   mutation DeleteNovel($id: ID!) {
//     deleteNovel(id: $id) {
//       id
//       title
//       image
//       author {
//         id
//         name
//       }
//     }
//   }
// `;

// export const ADD_AUTHOR = gql`
//   mutation AddAuthor($novelId: ID!, $name: String) {
//     addAuthor(id: $id, name: $name) {
//       id
//       name
//     }
//   }
// `;

// export const DELETE_AUTHOR = gql`
//   mutation DeleteAuthor($id: ID!) {
//     deleteAuthor(id: $id) {
//       id
//       name
//     }
//   }
// `;
