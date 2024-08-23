import { useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../axios";
import { useEffect } from "react";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser, setToken, token } = useStateContext({});
  const [menuOpen, setMenuOpen] = useState(false); // State to manage the main menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to manage the dropdown menu
  const [errors, setErrors] = useState(null);
  const [fileimage, setPhoto] = useState("");
  const [showButtons, setShowButtons] = useState({
    courses: false,
    instructors: false,
  });

  useEffect(() => {
    const updateButtonsVisibility = () => {
      const coursesContainer = document.getElementById("courses-container");
      const courses = coursesContainer?.querySelectorAll(".course-item") || [];
      const instructorsContainer = document.getElementById(
        "instructors-container"
      );
      const instructors =
        instructorsContainer?.querySelectorAll(".instructor-item") || [];
      const screenWidth = window.innerWidth;

      const shouldShowButtons =
        screenWidth >= 768 && (courses.length > 4 || instructors.length > 4);

      setShowButtons({
        courses: shouldShowButtons && courses.length > 4,
        instructors: shouldShowButtons && instructors.length > 4,
      });
    };

    // Initial check
    updateButtonsVisibility();

    // Add resize event listener
    window.addEventListener("resize", updateButtonsVisibility);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updateButtonsVisibility);
  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const subjects = [
    { icon: "🔬", name: "Chemistry", link: "#chemistry" },
    { icon: "🔢", name: "Math", link: "#math" },
    { icon: "🧪", name: "Physics", link: "#physics" },
    { icon: "📐", name: "English", link: "#english" },
    { icon: "🧬", name: "Biology", link: "#biology" },
    { icon: "🇫🇷", name: "French", link: "#french" },
    { icon: "🇩🇪", name: "German", link: "#german" },
    { icon: "🇮🇹", name: "Italian", link: "#italian" },
    { icon: "📚", name: "تاريخ", link: "#history" },
    { icon: "🌍", name: "جغرافيا", link: "#geography" },
    { icon: "🧭", name: "جيولوجيا", link: "#geology" },
    { icon: "🔬", name: "كيمياء", link: "#arabic-chemistry" },
    { icon: "🧪", name: "فيزياء", link: "#arabic-physics" },
    { icon: "🧬", name: "أحياء", link: "#arabic-biology" },
    { icon: "📖", name: "لغة عربية", link: "#arabic" },
    { icon: "🧠", name: "علم نفس و اجتماع", link: "#psychology-sociology" },
    { icon: "💡", name: "فلسفة و منطق", link: "#philosophy-logic" },
  ];
  if (user) {
    useEffect(() => {
      const fetchData = async () => {
        try {
          axiosClient.get("/user").then(({ data }) => {
            setUser(data);
          });
          const response = await axiosClient.get("/instructor", {
            params: {
              id: user.id,
            },
          });

          const data = response.data;
          if (
            typeof data === "object" &&
            data !== null &&
            Array.isArray(data.instructors)
          ) {
            setPhoto(data.instructors[0].image_path);
            // console.log(data);
          } else {
            console.error(
              "Data is not an object or does not have instructors property:"
            );
          }
          // if (response1.data.length > 0) {
          //   setUser(data);
          // }
        } catch (error) {
          console.error("Error fetching categories", error);
        }
      };

      fetchData();
    }, [user.id]);
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="w-auto top-0 z-50 antialiased bg-gray-100 m-4 rounded dark:bg-gray-700 relative">
          <div className="w-full text-gray-700 bg-white dark:text-gray-200 dark:bg-gray-700 rounded-md">
            <div className="flex flex-col max-w-screen-xl px-4 mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
              <div className="flex flex-row items-center justify-between p-4">
                <a
                  href="#"
                  className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark:text-white focus:outline-none focus:shadow-outline"
                >
                  Flowtrail UI
                </a>
                <button
                  onClick={toggleMenu}
                  className="rounded-lg md:hidden focus:outline-none focus:shadow-outline"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="w-6 h-6"
                  >
                    {menuOpen ? (
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </button>
              </div>
              <nav
                className={`${
                  menuOpen ? "block" : "hidden"
                } md:flex md:items-center md:space-x-4 transition-all duration-300 ease-in-out`}
              >
                {!token && (
                  <ul className="block w-full px-4 py-2 mt-2 space-y-2 md:flex md:items-center md:space-y-0 md:space-x-2 md:mt-0 md:flex">
                    <li>
                      <Link
                        aria-label="Sign in"
                        title="Sign in"
                        className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark:bg-transparent dark:hover:bg-gray-600 dark:focus:bg-gray-600 dark:focus:text-white dark:hover:text-white dark:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
                        to="/login"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-deep-purple-accent-400 rounded-lg shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                        aria-label="Sign up"
                        title="Sign up"
                        to="/signup"
                      >
                        Sign up
                      </Link>
                    </li>
                  </ul>
                )}

                {token && (
                  <ul className="block w-full px-4 py-2 mt-2 space-y-2 md:flex md:items-center md:space-y-0 md:space-x-2 md:mt-0">
                    {user.type === "student" && (
                      <>
                        <li>
                          <Link
                            className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-deep-purple-accent-400 rounded-lg shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                            aria-label="Profile"
                            title="Profile"
                            to="/profile"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-deep-purple-accent-400 rounded-lg shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                            aria-label="Instructor"
                            title="Instructor"
                            to="/instructor"
                          >
                            Instructor
                          </Link>
                        </li>
                      </>
                    )}
                    {user.type === "admin" && (
                      <li>
                        <Link
                          className="block w-full px-4 py-2 mt-2 text-sm font-semibold text-white bg-deep-purple-accent-400 rounded-lg shadow-md hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
                          aria-label="Dashboard"
                          title="Dashboard"
                          to="/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <button className="Btn" onClick={onLogout}>
                      <div className="sign">
                        <LogoutIcon></LogoutIcon>
                      </div>

                      <div className="text">Logout</div>
                    </button>
                  </ul>
                )}
              </nav>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="text-gray py-20 relative overflow-hidden">
          <div className="flex items-center">
            {/* Text Section */}
            <div className="w-full ml-4 md:w-1/2 px-4 text-center md:text-left relative z-10">
              <h2 className="text-5xl font-bold">
                Ready to stand out from the crowd?
              </h2>
              <p className="mt-4 text-lg">
                Join our platform and enhance your skills with top-notch
                courses.
              </p>
              <div className="mt-8">
                {/* <button>
                  <div className="svg-wrapper-1">
                    <div className="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="currentColor"
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span>Send</span>
                </button> */}
                {!token && (
                  <button className="cssbuttons-io-button">
                    Get started
                    <div className="icon">
                      <svg
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path
                          d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Background Image Section */}
            <div
              className="hidden md:block absolute inset-0 bg-no-repeat bg-cover opacity-100 z-0"
              style={{
                backgroundImage:
                  "https://storyset.com/illustration/education/bro",
              }}
            ></div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="container mx-auto px-4 py-8 relative">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">
            Popular Courses
          </h3>

          <div className="relative">
            {showButtons.courses && (
              <button
                className="b1 absolute -left-10 top-1/2 transform -translate-y-1/2 border border-gray-400 text-gray p-2 rounded-full shadow-md hover:bg-gray-400"
                onClick={() =>
                  document
                    .getElementById("courses-container")
                    .scrollBy({ left: -600, behavior: "smooth" })
                }
              >
                &lt;
              </button>
            )}

            <div
              id="courses-container"
              className="flex overflow-x-auto space-x-8 scrollbar-hidden"
            >
              <div className="bg-white p-4 rounded-lg shadow-md flex-none w-80 course-item">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Course"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h4 className="mt-2 text-xl font-semibold">Web Development</h4>
                <p className="mt-1 text-gray-600">John Doe</p>
                <a
                  href="#"
                  className="block mt-4 bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600"
                >
                  View Course
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-none w-80 course-item">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Course"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h4 className="mt-2 text-xl font-semibold">Web Development</h4>
                <p className="mt-1 text-gray-600">John Doe</p>
                <a
                  href="#"
                  className="block mt-4 bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600"
                >
                  View Course
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-none w-80 course-item">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Course"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h4 className="mt-2 text-xl font-semibold">Web Development</h4>
                <p className="mt-1 text-gray-600">John Doe</p>
                <a
                  href="#"
                  className="block mt-4 bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600"
                >
                  View Course
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-none w-80 course-item">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Course"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h4 className="mt-2 text-xl font-semibold">Web Development</h4>
                <p className="mt-1 text-gray-600">John Doe</p>
                <a
                  href="#"
                  className="block mt-4 bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600"
                >
                  View Course
                </a>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex-none w-80 course-item">
                <img
                  src="https://via.placeholder.com/400x300"
                  alt="Course"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h4 className="mt-2 text-xl font-semibold">Web Development</h4>
                <p className="mt-1 text-gray-600">John Doe</p>
                <a
                  href="#"
                  className="block mt-4 bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600"
                >
                  View Course
                </a>
              </div>
            </div>

            {showButtons.courses && (
              <button
                className="b1 absolute -right-10 top-1/2 transform -translate-y-1/2 border border-gray-400 text-gray p-2 rounded-full shadow-md hover:bg-gray-400"
                onClick={() =>
                  document
                    .getElementById("courses-container")
                    .scrollBy({ left: 600, behavior: "smooth" })
                }
              >
                &gt;
              </button>
            )}
          </div>
        </section>

        {/* Featured Instructors Section */}

        <section className="container mx-auto px-4 py-16 relative">
          <h3 className="text-3xl font-bold text-gray-800 mb-8">
            Courses Taught by Top Instructors
          </h3>

          <div className="relative">
            {showButtons.instructors && (
              <button
                className="b1 absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white border border-gray-500 text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100"
                onClick={() =>
                  document
                    .getElementById("instructors-container")
                    .scrollBy({ left: -400, behavior: "smooth" })
                }
              >
                &lt;
              </button>
            )}

            <div
              id="instructors-container"
              className="flex overflow-x-auto space-x-8 scrollbar-hidden"
            >
              <a
                href="#"
                className="bg-white p-4 rounded-lg shadow-md text-center flex-none w-64 cursor-pointer hover:bg-gray-100 instructor-item"
                onClick={() => openInstructorModal("John Doe")}
              >
                <img
                  src="https://via.placeholder.com/150x150"
                  alt="Instructor"
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
                <h4 className="mt-2 text-xl font-semibold">John Doe</h4>
                <p className="mt-1 text-gray-600">Web Development</p>
              </a>
              <a
                href="#"
                className="bg-white p-4 rounded-lg shadow-md text-center flex-none w-64 cursor-pointer hover:bg-gray-100 instructor-item"
                onClick={() => openInstructorModal("John Doe")}
              >
                <img
                  src="https://via.placeholder.com/150x150"
                  alt="Instructor"
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
                <h4 className="mt-2 text-xl font-semibold">John Doe</h4>
                <p className="mt-1 text-gray-600">Web Development</p>
              </a>
              <a
                href="#"
                className="bg-white p-4 rounded-lg shadow-md text-center flex-none w-64 cursor-pointer hover:bg-gray-100 instructor-item"
                onClick={() => openInstructorModal("John Doe")}
              >
                <img
                  src="https://via.placeholder.com/150x150"
                  alt="Instructor"
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
                <h4 className="mt-2 text-xl font-semibold">John Doe</h4>
                <p className="mt-1 text-gray-600">Web Development</p>
              </a>
              <a
                href="#"
                className="bg-white p-4 rounded-lg shadow-md text-center flex-none w-64 cursor-pointer hover:bg-gray-100 instructor-item"
                onClick={() => openInstructorModal("John Doe")}
              >
                <img
                  src="https://via.placeholder.com/150x150"
                  alt="Instructor"
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
                <h4 className="mt-2 text-xl font-semibold">John Doe</h4>
                <p className="mt-1 text-gray-600">Web Development</p>
              </a>
              <a
                href="#"
                className="bg-white p-4 rounded-lg shadow-md text-center flex-none w-64 cursor-pointer hover:bg-gray-100 instructor-item"
                onClick={() => openInstructorModal("John Doe")}
              >
                <img
                  src="https://via.placeholder.com/150x150"
                  alt="Instructor"
                  className="w-24 h-24 object-cover rounded-full mx-auto"
                />
                <h4 className="mt-2 text-xl font-semibold">John Doe</h4>
                <p className="mt-1 text-gray-600">Web Development</p>
              </a>
            </div>

            {showButtons.instructors && (
              <button
                className="b1 absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white border border-gray-500 text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100"
                onClick={() =>
                  document
                    .getElementById("instructors-container")
                    .scrollBy({ left: 400, behavior: "smooth" })
                }
              >
                &gt;
              </button>
            )}
          </div>
        </section>
        {/* Achievements Section */}
        <section className="py-10 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              We offer a variety of <span className="font-black">Subjects</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject, index) => (
                <a
                  key={index}
                  href={subject.link}
                  className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition"
                >
                  <span className="text-2xl">{subject.icon}</span>
                  <span className="text-lg font-medium">{subject.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        {/* <section className="px-8 py-10 lg:py-28">
          <div className="container mx-auto">
            <h2 className="mb-4 text-2xl lg:text-4xl text-blue-gray">
              The heartfelt testimonials of our community
            </h2>
            <p className="max-w-3xl text-gray-500 mb-10 lg:mb-20">
              From life-enhancing gadgets to unparalleled customer support, and
              transformative learning opportunities.
            </p>
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
              <div className="bg-gray-100 rounded-2xl p-6 shadow-md">
                <div className="mb-4 text-2xl font-bold text-blue-gray">
                  "The team went above and beyond to ensure my issue was
                  resolved quickly and efficiently. Truly outstanding!"
                </div>
                <div className="flex flex-wrap-reverse gap-6 justify-between items-center">
                  <div>
                    <div className="text-lg text-blue-gray">Jessica Devis</div>
                    <div className="text-gray-500">
                      Full Stack Developer @Netflix
                    </div>
                  </div>
                  <img
                    src="https://www.material-tailwind.com/image/netflix.svg"
                    className="max-w-32"
                    alt="Jessica Devis"
                  />
                </div>
              </div>
              <div className="bg-gray-100 rounded-2xl p-6 shadow-md">
                <div className="mb-4 text-2xl font-bold text-blue-gray">
                  "It has broadened my horizons and helped me advance my career.
                  The community is incredibly supportive."
                </div>
                <div className="flex flex-wrap-reverse gap-6 justify-between items-center">
                  <div>
                    <div className="text-lg text-blue-gray">Marcell Glock</div>
                    <div className="text-gray-500">
                      Graphic Designer @Coinbase
                    </div>
                  </div>
                  <img
                    src="https://www.material-tailwind.com/image/Logo-coinbase.svg"
                    className="max-w-32"
                    alt="Marcell Glock"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 bg-gray-100 text-center rounded-2xl p-6 shadow-md">
              <div className="mb-4 text-2xl lg:text-3xl text-blue-gray font-bold max-w-4xl mx-auto">
                "Its intuitive design and powerful features make it
                indispensable. I can't imagine going back to life before it!"
              </div>
              <div className="items-center mx-auto py-2">
                <img
                  src="https://www.material-tailwind.com/image/spotify.svg"
                  className="max-w-32 mx-auto grayscale"
                  alt="spotify"
                />
                <div className="text-lg text-blue-gray">Emma Roberts</div>
                <div className="text-gray-500">Chief Executive @Spotify</div>
              </div>
            </div>
          </div>
        </section> */}
        {/* Footer */}
      </div>

      {/* Start Footer */}

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 E-Learning Platform. All rights reserved.</p>
        </div>
      </footer>

      {/* End Footer */}
    </div>
  );
}
