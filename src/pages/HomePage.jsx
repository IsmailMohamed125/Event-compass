const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to Events Compass
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Discover and join amazing community events in your area
      </p>
      <div className="space-x-4">
        <a
          href="/events"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Browse Events
        </a>
        <a
          href="/login"
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Sign In
        </a>
      </div>
    </div>
  );
};

export default HomePage;
