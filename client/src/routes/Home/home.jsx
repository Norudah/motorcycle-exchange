import { useEffect } from "react";

const Home = () => {
  console.log("pouet");

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/notification");

    eventSource.onmessage = (event) => {
      console.log(event.data);
      // Affichez la notification à l'utilisateur
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="main">
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Home</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Welcome to the home page.</p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">This is the home page. </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
