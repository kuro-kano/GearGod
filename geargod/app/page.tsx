export default function Home() {
  return (
    <main>
      {/* Parallax Section */}
      <div
        className="
          relative 
          h-screen
          bg-fixed 
          bg-center 
          bg-cover 
          bg-no-repeat
          flex 
          items-center 
          justify-center
          text-white
          /* Replace the URL below with your own image path */
          bg-[url('https://gamersnexus.net/u/2024-06/vlcsnap-2024-06-24-12h36m17s731.jpg')]
        "
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Text content over the parallax */}
        <h1 className="z-10 text-4xl md:text-6xl font-bold">Welcome to GearGod</h1>
      </div>

      {/* Normal Content Section */}
      <div className="p-8 bg-gray-100 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Content Section</h2>
        <p className="mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nibh id venenatis laoreet, urna neque aliquet enim, 
          in varius magna turpis in sapien.
        </p>
        <p>
          Scroll up and down to see the parallax effect in action. The background image remains fixed in place while the content scrolls.
        </p>
      </div>
    </main>
  );
}
