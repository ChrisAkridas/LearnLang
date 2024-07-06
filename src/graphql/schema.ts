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
  vocabulary: [Vocabulary]!
}

type Vocabulary {
  id: ID!
  english: String
  greek: String
  greeklist: String
}

# type Author {
#   id: ID!
#   name: String
# }

# type Query {
#   novel(id: ID!): Novel
#   novels: [Novel]
# }

# type Mutation {
#   addNovel(title: String, image: String): Novel
#   updateNovel(id: ID!, image: String, title: String): Novel
#   deleteNovel(id:ID!): Novel
#   addAuthor(novelId: ID!, name: String): Author
#   deleteAuthor(id: ID!): Author
# }
`;
