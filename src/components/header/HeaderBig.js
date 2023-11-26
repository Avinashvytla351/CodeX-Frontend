import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCard from "./HeaderCard";
import HeadLogo from "../../images/try logo.png";
const HeaderBig = ({ imgUsername }) => {
  const navigate = useNavigate();

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isScrolled = scrollY > 5;

  //Screen Size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Create a function to update window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSmallScreen = windowWidth < 570;

  return (
    <section className="chapter-navigation">
      <div className="nav-chapter-logo2">
        <img src={HeadLogo} alt="" />
      </div>
      {!isSmallScreen ? (
        <div className="chapter-nav-btn">
          <button className="nav-btn" onClick={() => navigate("/")}>
            Home
          </button>
          {imgUsername && (
            <>
              <button
                className="nav-btn"
                onClick={() => navigate("/experiments")}
              >
                Experiments
              </button>
              <button
                className="nav-btn"
                onClick={() => navigate("/challenges")}
              >
                Challenges
              </button>
            </>
          )}
          {imgUsername && (
            <HeaderCard
              imgUsername={imgUsername}
              data={{
                Profile: `/profile/${imgUsername}`,
              }}
              logout={true}
            />
          )}
          {!imgUsername && (
            <button className="nav-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      ) : (
        <div className="chapter-nav-btn">
          {imgUsername ? (
            <HeaderCard
              imgUsername={imgUsername}
              data={{
                Home: "/",
                Experiments: "/experiments",
                Challenges: "/challenges",
                Profile: `/profile/${imgUsername}`,
              }}
              logout={true}
            />
          ) : (
            <HeaderCard
              data={{
                Home: "/",
                Login: "/login",
              }}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default HeaderBig;
