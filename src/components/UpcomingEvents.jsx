import { useState, useEffect } from "react";
import Basketball from "../assets/try.avif";
import { GiBasketballBall } from "react-icons/gi";
import { Link } from "react-router-dom";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTicketOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const UpcomingEvents = () => {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [upcomingTournamnets, setUpcomingTournamnets] = useState([]);

  useEffect(() => {
    axios
      .get("https://athle-track-backend-ecru.vercel.app/api/tournaments/")
      .then((response) => {
        // console.log(response.data.allTournaments);
        setUpcomingTournamnets(response.data.allTournaments);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={Basketball || "/placeholder.svg"}
          alt="Basketball Background"
          className="object-cover h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-orange-400 drop-shadow-lg">
              Upcoming Events
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join us for exciting basketball tournaments and events. Register
              now to secure your spot!
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
            </div>
          ) : (
            <>
              {/* Events Grid */}
              <AnimatePresence>
                {upcomingTournamnets.length > 0 ? (
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
                    {upcomingTournamnets.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden border border-orange-500/30 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/20 hover:shadow-lg group"
                      >
                        <div className="relative">
                          <img
                            src={`https://athle-track-backend-ecru.vercel.app/public/${event.posterImage
                              .split("\\")
                              .pop()}`}
                            alt={event.eventName}
                            className="object-cover w-full h-52 transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                          <div className="absolute bottom-3 left-3 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-md uppercase">
                            {event.category || "Tournament"}
                          </div>
                          {event.featured && (
                            <div className="absolute top-3 right-3 bg-orange-600/90 text-white text-xs font-bold px-2 py-1 rounded-md uppercase animate-pulse-slow">
                              Featured
                            </div>
                          )}
                        </div>

                        <div className="p-5 space-y-4">
                          <h3 className="text-xl font-bold text-orange-400 line-clamp-1">
                            {event.eventName}
                          </h3>

                          <div className="space-y-2 text-gray-300">
                            <div className="flex items-center gap-2">
                              <IoCalendarOutline className="text-orange-500 flex-shrink-0" />
                              <span className="text-sm">
                                {event.startDate.split("T")[0]}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <IoLocationOutline className="text-orange-500 flex-shrink-0" />
                              <span className="text-sm line-clamp-1">
                                {event.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <IoTrophyOutline className="text-orange-500 flex-shrink-0" />
                              <span className="text-sm font-semibold">
                                {Number(event.prizePool.firstPrize) +
                                  Number(event.prizePool.secondPrize) +
                                  Number(event.prizePool.thirdPrize) +
                                  Number(event.prizePool.mvp)}{" "}
                                NPR
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <IoTicketOutline className="text-orange-500 flex-shrink-0" />
                              <span className="text-sm">
                                {event.prizePool.entryFee}
                              </span>
                            </div>
                          </div>
                          <Link to={`/registerteam/${event._id}`} >
                            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:from-orange-500 hover:to-orange-400 transition-all duration-300 transform hover:translate-y-[-2px] focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 hover:cursor-pointer">
                              Register Now
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-700">
                    <GiBasketballBall className="mx-auto text-5xl text-gray-600 mb-4" />
                    <p className="text-xl text-gray-400">No events found.</p>
                  </div>
                )}
              </AnimatePresence>

              {/* Show More/Less Button */}
              <div className="flex justify-center mt-8 mb-12">
                <button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  className="group relative overflow-hidden bg-gray-800 text-white px-8 py-3 rounded-full border border-orange-500/50 shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {showAllEvents ? "Show Less" : "Show More Events"}
                    <span
                      className={`transition-transform duration-300 ${
                        showAllEvents ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ↓
                    </span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Basketball decoration */}
      <div className="fixed -bottom-20 -left-20 opacity-10 pointer-events-none">
        <GiBasketballBall className="text-orange-500" size={200} />
      </div>
      <div className="fixed -top-20 -right-20 opacity-10 pointer-events-none">
        <GiBasketballBall className="text-orange-500" size={200} />
      </div>
    </div>
  );
};

export default UpcomingEvents;
