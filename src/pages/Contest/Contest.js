import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import MainLayout from "../../components/layout/mainLayout/MainLayout";
import FlexLayoutEven from "../../components/layout/flexLayoutEven/FlexLayoutEven";
import AreaRight from "../../components/layout/areaRight/AreaRight";
import AreaLeft from "../../components/layout/areaLeft/AreaLeft";
import CodeImage from "../../images/code.png";
import axios from "axios";
import Doodle from "../../components/doodle/Doodle";
import "./Contest.css";
import Search from "../../components/search/Search";
import { useNavigate } from "react-router-dom";
const ContestCard = React.lazy(() =>
  import("../../components/contestCard/ContestCard")
);

const Contest = (data) => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeContests, setActiveContests] = useState([]);
  const [inactiveContests, setInactiveContests] = useState([]);
  const [filter, setFilter] = useState("");
  const handleSearch = (query) => {
    setFilter(query);
  };
  useEffect(() => {
    document.title = "Experiments | KLHCode";
  }, []);

  useEffect(() => {
    // Make an Axios GET request to fetch contest data
    axios
      .get(data.serverRoute + "/contests", {
        headers: {
          authorization: token,
        },
        params: {
          mcq: false,
        },
      })
      .then((response) => {
        splitContests(response.data);
        setLoading(false);
        if (response.data.success === false) {
          navigate("/message", {
            state: { type: false, message: response.data.message },
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching contest data:", error);
      });
  }, []);

  //Active and Inactive contests
  const splitContests = (data) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const activeContestsArray = [];
    const inactiveContestsArray = [];

    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].contestDate === currentDate && data[i].visibility) {
        activeContestsArray.push(data[i]);
      } else {
        inactiveContestsArray.push(data[i]);
      }
    }

    setActiveContests(activeContestsArray);
    setInactiveContests(inactiveContestsArray);
  };

  return (
    <div className="EXPERIMENTS">
      <MainLayout>
        <FlexLayoutEven>
          <AreaRight
            titleText={"KLHCode"}
            subTitleText={"Experiments"}
            descSmall={"Explore various contests"}
            search={true}
            color={"rgb(52,168,83)"}
          >
            <Search onSearch={handleSearch} />
          </AreaRight>
          <AreaLeft image={CodeImage} />
        </FlexLayoutEven>
        {!loading && (
          <section className="contests">
            <Doodle background={"rgb(239,247,207)"} />
            <div className="contests-container">
              <div className="contests-title">Active Contests</div>
              <div className="row">
                {activeContests
                  .filter((item) => {
                    return filter.toLowerCase() === ""
                      ? item
                      : item.contestName.toLowerCase().includes(filter);
                  })
                  .map((contest, index) => (
                    <React.Suspense fallback="" key={index}>
                      <ContestCard data={contest} active={true} />
                    </React.Suspense>
                  ))}
              </div>
            </div>
            <div className="contests-container">
              <div className="contests-title">Inactive Contests</div>
              <div className="row">
                {inactiveContests
                  .filter((item) => {
                    return filter.toLowerCase() === ""
                      ? item
                      : item.contestName.toLowerCase().includes(filter);
                  })
                  .map((contest, index) => (
                    <React.Suspense fallback="" key={index}>
                      <ContestCard data={contest} />
                    </React.Suspense>
                  ))}
              </div>
            </div>
          </section>
        )}
      </MainLayout>
    </div>
  );
};

export default Contest;
