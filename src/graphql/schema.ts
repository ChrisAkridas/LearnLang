export const typeDefs = `#graphql
type User {
  id: ID!
  first_name: String!
  last_name: String!
  email: String!
  country: String
  bio: String
}

type Lesson {
  id: ID!
  title: String!
  lessonNumber: Int!
  createdAt: String
  updatedAt: String
  vocabulary: [Vocabulary!]!
}

type Vocabulary {
  id: ID!
  english: String
  greek: String
  greeklist: String
}

type Query {
  lessons: [Lesson]
  lesson(id: ID!): Lesson

  words: [Vocabulary]
  word(id: ID!): Vocabulary
  
  users: [User]
  user(id: ID!): User
}

type Mutation {
  deleteUser(id: ID!): User
}
`;
