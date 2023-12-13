import React, { useEffect } from "react";
import MainLayout from "../../components/layout/mainLayout/MainLayout";
import HeroLayoutCenter from "../../components/layout/heroLayoutCenter/HeroLayoutCenter";
import Cookies from "js-cookie";
import "./Home.css";
import languageImg from "../../images/Python.png";
import Ad from "./Ad";
import AdImg1 from "../../images/code.png";
import AdImg2 from "../../images/graph.png";
import AdImg3 from "../../images/code2.svg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const imgUsername = Cookies.get("username");
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Home | KLHCode";
  }, []);
  return (
    <div className="HOME">
      <MainLayout>
        <HeroLayoutCenter>
          <section className="main-space" id="parallax">
            <div className="lsideup">
              <span className="material-icons-round">science</span>
            </div>
            <div className="lside">
              <span className="material-icons-round">send</span>
            </div>
            <div className="content">
              <div className="small">Welcome To</div>
              <div className="big">klh</div>
            </div>
            <div className="rside">
              <span className="material-icons-round">data_object</span>
            </div>
            <div className="line-circle">
              <div className="lines"></div>
              <div className="circle"></div>
              <div className="lines"></div>
            </div>
            {!imgUsername ? (
              <button id="start" onClick={() => navigate("/login")}>
                Get Started
              </button>
            ) : (
              <button id="start" onClick={() => navigate("/experiments")}>
                Get Started
              </button>
            )}
          </section>
        </HeroLayoutCenter>
        <HeroLayoutCenter>
          <section className="langs">
            <div className="lang-img">
              <img src={languageImg} alt="" />
            </div>
            <div className="lang-content">
              <div className="lang-title">
                <span className="material-icons-outlined">science</span>
                Experiments
              </div>
              <div className="lang-body">
                Choose the right programming language
              </div>
              <div className="lang-body-small">
                KLHCode provides you to choose your language of choice which
                brings out the best programmer in you
              </div>
            </div>
          </section>
        </HeroLayoutCenter>
        <HeroLayoutCenter>
          <section className="ads">
            <Ad
              title="Tutorials"
              body="Practice coding challenges"
              imageSrc={AdImg1}
              backgroundColor="rgb(255, 228, 118)"
              icon={
                <span className="material-icons-outlined">fitness_center</span>
              }
            />

            <Ad
              title="Leaderboard"
              body="Review your performance"
              imageSrc={AdImg2}
              backgroundColor="rgb(186, 218, 255)"
              icon={
                <span className="material-icons-outlined">leaderboard</span>
              }
            />

            <Ad
              title="Dashboard"
              body="Review your performance"
              imageSrc={AdImg3}
              backgroundColor="rgb(183,243,151)"
              icon={
                <span className="material-icons-outlined">leaderboard</span>
              }
            />
          </section>
        </HeroLayoutCenter>
      </MainLayout>
    </div>
  );
};

export default Home;
