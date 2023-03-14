import { Meetup } from "@/types";
import { connectDB } from "@/utils/mongodb";

// Define the components props
interface HomePageProps {
  children?: React.ReactNode;
  meetups: Meetup[]
}

// define the page component
const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <div>
      <h1>Home Page</h1>
      <h2>{props.meetups[2].title}</h2>
    </div>
  );
};

// GET PROPS FOR SERVER SIDE RENDERING
export async function getServerSideProps() {
  // get todo data from API
  const { client, db, collection } = await connectDB("test", "meetups");
  const findResults = await collection.find({}).toArray();
  const meetups = findResults.map((el) => ({
    id: el._id.toString(),
    title: el.title,
    image: el.image,
    address: el.address,
    description: el.description,
  }));

  console.log("filtered data", meetups);
  client.close();
  // return props
  return {
    props: {
      meetups: meetups
    },
  };
}

export default HomePage;
