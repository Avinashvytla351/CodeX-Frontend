import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import MainLayout from "../../components/layout/mainLayout/MainLayout";
import FlexLayoutEven from "../../components/layout/flexLayoutEven/FlexLayoutEven";
import AreaRight from "../../components/layout/areaRight/AreaRight";
import AreaLeft from "../../components/layout/areaLeft/AreaLeft";
import CodeImage from "../../images/code2.svg";
import axios from "axios";
import Doodle from "../../components/doodle/Doodle";
import "./MCQContest.css";
import Search from "../../components/search/Search";
import { useNavigate } from "react-router-dom";
const ContestCard = React.lazy(() =>
  import("../../components/contestCard/ContestCard")
);

const MCQContest = (data) => {
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
    document.title = "Challenges | KLHCode";
  }, []);

  useEffect(() => {
    // Make an Axios GET request to fetch contest data
    axios
      .get(data.serverRoute + "/contests/mcq", {
        headers: {
          authorization: token,
        },
        params: {
          mcq: false,
        },
      })
      .then((response) => {
        splitContests(response.data.data);
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
    <div className="CHALLENGES">
      <MainLayout>
        <FlexLayoutEven>
          <AreaRight
            titleText={"KLHCode"}
            subTitleText={"Challenges"}
            descSmall={"Explore various challenges"}
            search={true}
            color={"rgb(26, 115, 232)"}
          >
            <Search onSearch={handleSearch} />
          </AreaRight>
          <AreaLeft image={CodeImage} />
        </FlexLayoutEven>
        {!loading && (
          <section className="contests">
            <Doodle background={"rgb(99, 236, 152)"} />
            <div className="contests-container">
              <div className="contests-title">Active Contests</div>
              <div className="row">
                {activeContests
                  .filter((item) => {
                    return filter.toLowerCase() === ""
                      ? item
                      : item.contestName
                          .toLowerCase()
                          .includes(filter.toLowerCase());
                  })
                  .map((contest, index) => (
                    <React.Suspense fallback="" key={index}>
                      <ContestCard
                        data={contest}
                        active={true}
                        beforeColor={"rgb(227, 238, 254)"}
                        detailsColor={"rgb(100, 162, 255)"}
                        buttonColor={"rgb(146, 190, 255)"}
                        tagColor={"rgb(26, 115, 232)"}
                        route={`challenges/${contest.contestId}`}
                      />
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
                      : item.contestName
                          .toLowerCase()
                          .includes(filter.toLowerCase());
                  })
                  .map((contest, index) => (
                    <React.Suspense fallback="" key={index}>
                      <ContestCard
                        data={contest}
                        beforeColor={"rgb(227, 238, 254)"}
                        detailsColor={"rgb(100, 162, 255)"}
                        buttonColor={"rgb(146, 190, 255)"}
                        tagColor={"rgb(26, 115, 232)"}
                        route={`challenges/${contest.contestId}`}
                      />
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

export default MCQContest;
