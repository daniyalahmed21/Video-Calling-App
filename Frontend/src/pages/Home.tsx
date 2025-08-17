import { useCreateRoom } from '../hooks/useCreateRoom';

const Home = () => {
  const { createRoom } = useCreateRoom();
  return (
    <button onClick={createRoom}>Create a new room</button>
  );
};

export default Home;