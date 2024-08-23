import React, { useState, useEffect } from "react";
import axiosClient from "../../axios";
import { useStateContext } from "../../contexts/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";

Modal.setAppElement("#root");

const CoursePage = () => {
  const { user, setUser } = useStateContext({});
  const [wallet, setWallet] = useState({ amount: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const [payment, setPayment] = useState([]);
  const [lesson, setLesson] = useState([]);
  const [course, setCourse] = useState({
    id: null,
    teacher_id: null,
    name: "",
    description: "",
    category: "",
    imagedata: "",
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [randomString, setRandomString] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get("/user");
        setUser(data);

        try {
          const walletResponse = await axiosClient.get("/wallet", {
            params: { id: data.id },
          });
          setWallet(walletResponse.data.amount);
        } catch (walletError) {
          if (walletError.response && walletError.response.status === 404) {
            console.warn("Wallet not found for user");
            setWallet({ amount: 0 });
          } else {
            console.error("Error fetching wallet data:", walletError);
          }
        }

        if (location.state.courseId) {
          const courseResponse = await axiosClient.get(
            `/courses/${location.state.courseId}`
          );
          const fetchedCourse = courseResponse?.data?.[0]?.[0];
          if (fetchedCourse) {
            setCourse({
              id: fetchedCourse.id,
              teacher_id: fetchedCourse.user_id,
              name: fetchedCourse.name,
              description: fetchedCourse.description,
              category: fetchedCourse.category,
              imagedata: fetchedCourse.image_path,
            });
          }

          const lessonResponse = await axiosClient.get(`/instructor_Lessons`, {
            params: { id: location.state.courseId },
          });
          setLesson(lessonResponse.data.lessons);

          const paymentResponse = await axiosClient.get("/payment", {
            params: {
              user_id: data.id,
              course_id: location.state.courseId,
            },
          });
          setPayment(paymentResponse.data.payments);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.state.courseId, setUser]);

  const checkQuizCompletion = (lessonId) => {
    const currentLesson = lesson.find((l) => l.id === lessonId);
    if (!currentLesson) return false;

    const previousLesson = lesson.find(
      (l) => l.id === currentLesson.previous_lesson_id
    );
    if (
      previousLesson &&
      previousLesson.grades &&
      previousLesson.grades.length === 0
    ) {
      return false;
    }

    return true;
  };

  const handleBuyNowClick = (lesson) => {
    if (checkQuizCompletion(lesson.id)) {
      setSelectedLesson(lesson);
      setIsPopoverOpen(true);
    } else {
      setAlertMessage(
        "You must complete the quiz for the previous lesson before purchasing this lesson."
      );
      setShowAlert(true);
    }
  };

  const openModal = (lesson) => {
    setSelectedLesson(lesson);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedLesson(null);
    setModalIsOpen(false);
    setRandomString("");
  };

  const handleRandomStringPayment = async () => {
    try {
      if (!selectedLesson) {
        console.error("No lesson selected for payment.");
        return;
      }

      const response = await axiosClient.post("/useRandomString", {
        random_string: randomString,
        usedFrom: user.id,
        lessonId: selectedLesson.id,
        user_id: user.id,
        course_id: location.state.courseId,
        teacher_id: course.teacher_id,
        cost: selectedLesson.price,
      });

      if (response.status === 200) {
        console.log("Random string payment successful:", response.data);
        closeModal();
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error with random string payment:", error);
    }
  };

  const handleWalletPayment = () => {
    if (selectedLesson) {
      handlePayment(selectedLesson.id, selectedLesson.price);
    } else {
      console.error("No lesson selected for payment.");
    }
    closeModal();
  };

  const handlePayment = async (lessonId, cost) => {
    try {
      if (wallet.amount < cost) {
        alert(
          "Insufficient balance in your wallet. Please top up your balance to proceed."
        );
        return;
      }

      const response = await axiosClient.post("/payment", {
        teacher_id: course.teacher_id,
        user_id: user.id,
        course_id: parseInt(location.state.courseId, 10),
        lesson_id: lessonId,
        cost: cost,
      });
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const toggleLesson = (lessonId) => {
    setActiveLesson(activeLesson === lessonId ? null : lessonId);
  };

  const handlePopoverOpen = (event, lesson) => {
    setAnchorEl(event.currentTarget);
    setSelectedLesson(lesson);
    setIsPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setIsPopoverOpen(false);
  };

  const calculateProgress = () => {
    const totalLessons = lesson.length;
    const purchasedLessons = payment.length;
    return (purchasedLessons / totalLessons) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto mt-6 flex flex-col lg:flex-row">
        <section className="lg:w-3/4 bg-white shadow-lg rounded-lg p-6 mb-6 lg:mb-0">
          <h2 className="text-3xl font-bold mb-2">{course.name}</h2>
          <img
            className="w-full h-auto rounded-lg mb-4"
            src={`http://localhost:8000/uploads/${course.imagedata}`}
            alt="Course Image"
          />

          <div className="mb-4">
            <p className="text-gray-700">You are enrolled in this course</p>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 h-4 rounded-full">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <span className="ml-2 text-gray-700">
                {calculateProgress().toFixed(2)}% COMPLETE
              </span>
            </div>
            <p className="text-gray-500">Last activity on May 3, 2019</p>
          </div>
          <h3 className="text-2xl font-semibold mb-4">Course Description</h3>
          <p className="text-gray-700 mb-4">{course.description}</p>
          <ul className="list-disc list-inside mb-4">
            <li className="text-gray-700">Accepted media files</li>
            <li className="text-gray-700">Example quiz questions</li>
            <li className="text-gray-700">Timer demonstration</li>
            <li className="text-gray-700">Badges & Points demonstration</li>
            <li className="text-gray-700">Available shortcodes</li>
          </ul>

          <div className="border rounded-lg overflow-hidden">
            {lesson.map((x) => (
              <div
                key={x.id}
                className={`p-4 border-b ${
                  activeLesson === x.id ? "bg-blue-100" : "hover:bg-blue-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <button
                    className={`w-full text-left flex justify-between items-center transition-colors hover:bg-blue-100 duration-300 focus:outline-none`}
                    onClick={() => toggleLesson(x.id)}
                  >
                    <span className="font-medium">{x.name}</span>
                    <span className="text-gray-800 text-lg mr-5">
                      {x.price} $
                    </span>
                  </button>
                  {payment.some((payment) => payment.lesson_id === x.id) ? (
                    <button
                      onClick={() => {
                        navigate("/instructor/course/lesson", {
                          state: { lessonId: x.id },
                        });
                      }}
                      className="ml-4 w-32 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Start Now
                    </button>
                  ) : (
                    <Button
                      className="ml-4 w-32"
                      variant="contained"
                      onClick={() => handleBuyNowClick(x)}
                    >
                      Buy Now
                    </Button>
                  )}
                </div>
                <div
                  className={`overflow-hidden transition-max-height duration-300 ${
                    activeLesson === x.id ? "max-h-screen" : "max-h-0"
                  }`}
                >
                  <div className="mt-2 pl-4">
                    <p className="text-gray-700">{x.description}</p>
                    <p className="text-gray-700">3 Topics | 1 Quiz</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="lg:w-1/4 lg:ml-6">
          <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-4">Course Overview</h3>
            <p className="text-gray-700 mb-4">
              This course includes media demonstrations. Lessons do not contain
              example quizzes, so any quiz elements you see on this site are for
              demo purposes only. There are no assignments included in this
              course.
            </p>
            <p className="text-gray-700 mb-4">
              If you would like to explore additional features of LearnDash,
              please{" "}
              <a href="#" className="text-blue-500">
                contact us
              </a>{" "}
              for more information.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">User Wallet</h3>
            <p className="text-gray-700">
              Wallet Amount:{" "}
              <span className="font-semibold">{wallet.amount} $</span>
            </p>
          </div>
        </aside>
      </main>

      <Popover
        id="popover"
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Purchase Lesson</h2>
          <p className="mb-4">Choose a payment method:</p>
          <Button
            className="mb-2 w-full"
            variant="contained"
            onClick={handleRandomStringPayment}
          >
            Pay with Random String
          </Button>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter random string"
              value={randomString}
              onChange={(e) => setRandomString(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <Button
            className="w-full"
            variant="contained"
            onClick={handleWalletPayment}
          >
            Pay with Wallet
          </Button>
        </div>
      </Popover>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Purchase Lesson"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-2xl font-bold mb-4">Purchase Lesson</h2>
        <p className="mb-4">Choose a payment method:</p>
        <Button
          className="mb-2 w-full"
          variant="contained"
          onClick={handleRandomStringPayment}
        >
          Pay with Random String
        </Button>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter random string"
            value={randomString}
            onChange={(e) => setRandomString(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <Button
          className="w-full"
          variant="contained"
          onClick={handleWalletPayment}
        >
          Pay with Wallet
        </Button>
      </Modal>

      {showAlert && (
        <Modal
          isOpen={showAlert}
          onRequestClose={() => setShowAlert(false)}
          contentLabel="Alert"
          className="modal"
          overlayClassName="overlay"
        >
          <h2 className="text-2xl font-bold mb-4">Alert</h2>
          <p>{alertMessage}</p>
          <Button
            className="w-full mt-4"
            variant="contained"
            onClick={() => setShowAlert(false)}
          >
            OK
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default CoursePage;
