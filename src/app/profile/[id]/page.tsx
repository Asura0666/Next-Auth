const UserProfile = ({ params }: any) => {
  return (
    <div className=" min-h-screen flex justify-center items-center bg-gray-900">
      <h1 className="text-2xl text-white">Profile Page {params?.id}</h1>
    </div>
  );
};

export default UserProfile;
