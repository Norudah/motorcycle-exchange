import { useEffect, useState } from "react";

const Home = () => {
  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const events = new EventSource("http://localhost:3000/events");
    if (!listening) {
      events.onmessage = (event) => {
        console.log("SSE Event : ", event.data);
      };
      setListening(true);
    }
  }, [listening, facts]);

  // useEffect(() => {
  //   const url = "http://localhost:3000/stream";

  //   if ("EventSource" in window) {
  //     let source = new EventSource(url, { withCredentials: true });
  //   }

  //   source.addEventListener(
  //     "message",
  //     function (e) {
  //       console.log(e.data);
  //     },
  //     false
  //   );

  //   source.addEventListener(
  //     "open",
  //     function (e) {
  //       // successful connection.
  //     },
  //     false
  //   );

  //   source.addEventListener(
  //     "error",
  //     function (e) {
  //       // error occurred
  //     },
  //     false
  //   );
  // }, []);

  // useEffect(() => {
  //   // const eventSource = new EventSource("http://localhost:3000/notification", {
  //   //   headers: {
  //   //     Method: "POST",
  //   //   },
  //   // });

  //   const eventSource = new EventSource("http://localhost:3000/notifications");

  //   eventSource.onmessage = (event) => {
  //     console.log("Ici la future notification");
  //     console.log(event.data);
  //     // Affichez la notification à l'utilisateur
  //   };

  //   return () => eventSource.close();
  // }, []);

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
