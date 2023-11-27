import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Message from "./components/message/Message";
import Verify from "./pages/Auth/Verify/Verify";
const Contest = React.lazy(() => import("./pages/Contest/Contest"));
const Login = React.lazy(() => import("./pages/Auth/Login/Login"));
const ContestPage = React.lazy(() =>
  import("./pages/Contest/ContestPage/ContestPage")
);
const ContestAdd = React.lazy(() =>
  import("./pages/Admin/Contest/ContestAdd/ContestAdd")
);
const ContestEdit = React.lazy(() =>
  import("./pages/Admin/Contest/ContestEdit/ContestEdit")
);
const ContestDelete = React.lazy(() =>
  import("./pages/Admin/Contest/ContestDelete/ContestDelete")
);
const ExtendTime = React.lazy(() =>
  import("./pages/Admin/Contest/ExtendTime/ExtendTime")
);
const QuestionAdd = React.lazy(() =>
  import("./pages/Admin/Question/QuestionAdd/QuestionAdd")
);
const QuestionEdit = React.lazy(() =>
  import("./pages/Admin/Question/QuestionEdit/QuestionEdit")
);
const QuestionDelete = React.lazy(() =>
  import("./pages/Admin/Question/QuestionDelete/QuestionDelete")
);
const QuestionsView = React.lazy(() =>
  import("./pages/Admin/Question/QuestionsView/QuestionsView")
);
const ManageUsers = React.lazy(() => import("./pages/Admin/users/manageUsers"));
const ContestLeaderboard = React.lazy(() =>
  import("./pages/Leaderboards/ContestLeaderboard/ContestLeaderboard")
);
const MCQAdd = React.lazy(() => import("./pages/Admin/MCQ/MCQAdd/MCQAdd"));
const MCQContestAdd = React.lazy(() =>
  import("./pages/Admin/MCQ/MCQContest/MCQContestAdd/MCQContestAdd")
);
const MCQContest = React.lazy(() => import("./pages/MCQContest/MCQContest"));
const MCQContestPage = React.lazy(() =>
  import("./pages/MCQContest/MCQContestPage/MCQContestPage")
);

const serverRoute = "http://localhost:5000";
const clientRoute = "http://localhost:4000";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <React.Suspense fallback="">
              <Login serverRoute={serverRoute} clientRoute={clientRoute} />
            </React.Suspense>
          }
        />
        <Route
          path="/"
          element={<Home serverRoute={serverRoute} clientRoute={clientRoute} />}
        />

        <Route path="/message" element={<Message />} />
        <Route path="/verify" element={<Verify serverRoute={serverRoute} />} />
        <Route
          path="/experiments"
          element={
            <React.Suspense fallback="">
              <Contest serverRoute={serverRoute} />
            </React.Suspense>
          }
        />
        <Route
          path="/experiments/:contestId"
          element={
            <React.Suspense fallback="">
              <ContestPage serverRoute={serverRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/leaderboard/:contestId"
          element={
            <React.Suspense fallback="">
              <ContestLeaderboard serverRoute={serverRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/challenges"
          element={
            <React.Suspense fallback="">
              <MCQContest serverRoute={serverRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/challenges/:contestId"
          element={
            <React.Suspense fallback="">
              <MCQContestPage serverRoute={serverRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/admin"
          element={
            <React.Suspense fallback="">
              <ContestAdd serverRoute={serverRoute} clientRoute={clientRoute} />
            </React.Suspense>
          }
        />
        <Route
          path="/admin/add/contest"
          element={
            <React.Suspense fallback="">
              <ContestAdd serverRoute={serverRoute} clientRoute={clientRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/edit/contest"
          element={
            <React.Suspense fallback="">
              <ContestEdit
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/delete/contest"
          element={
            <React.Suspense fallback="">
              <ContestDelete
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/ExtendTime/contest"
          element={
            <React.Suspense fallback="">
              <ExtendTime serverRoute={serverRoute} clientRoute={clientRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/add/question"
          element={
            <React.Suspense fallback="">
              <QuestionAdd
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/edit/question"
          element={
            <React.Suspense fallback="">
              <QuestionEdit
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/delete/question"
          element={
            <React.Suspense fallback="">
              <QuestionDelete
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/view/question"
          element={
            <React.Suspense fallback="">
              <QuestionsView
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/manageUsers"
          element={
            <React.Suspense fallback="">
              <ManageUsers
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/add/mcq"
          element={
            <React.Suspense fallback="">
              <MCQAdd serverRoute={serverRoute} clientRoute={clientRoute} />
            </React.Suspense>
          }
        />

        <Route
          path="/admin/add/mcqContest"
          element={
            <React.Suspense fallback="">
              <MCQContestAdd
                serverRoute={serverRoute}
                clientRoute={clientRoute}
              />
            </React.Suspense>
          }
        />

        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
