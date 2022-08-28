import React from "react";
import Pagination from "@mui/material/Pagination";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import moment from "moment";

const MyFaves = (props) => {
  const refActualFaves = React.useRef([]);
  const [newsFaves, setNewsFaves] = React.useState([]);
  const [maxPage, setMaxPage] = React.useState();
  const [actualPage, setActualPage] = React.useState(1);
  const [infLim, setInfLim] = React.useState(0);
  const [supLim, setSupLim] = React.useState(8);

  function deleteNewsStorage(ind) {
    refActualFaves.current = newsFaves.filter((elem, index) => {
      return index != ind;
    });
    setNewsFaves(refActualFaves.current);
    localStorage.setItem(
      "newsSelected",
      JSON.stringify(refActualFaves.current)
    );
  }

  React.useEffect(() => {
    if (JSON.parse(localStorage.getItem("newsSelected")) != null) {
      let arrayNews = JSON.parse(localStorage.getItem("newsSelected"));
      let arrayInvert = arrayNews.reverse();
      setNewsFaves(arrayInvert);
      setMaxPage(Math.ceil(newsFaves?.length / 8));
    }
  }, []);

  React.useEffect(() => {
    setMaxPage(Math.ceil(newsFaves?.length / 8));
  }, [newsFaves]);

  return (
    <>
      {newsFaves.length < 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", margin: "50px 0 20px 0" }}>
            <SentimentVeryDissatisfiedIcon
              sx={{ fontSize: "100px", color: "#ededed" }}
            />
          </div>
          <p style={{ textAlign: "center", margin: "0", color: "#969696" }}>
            You have not added news to your favorites section yet.
          </p>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: "0 5% 0 5%",
        }}
      >
        {newsFaves?.slice(infLim, supLim).map((notice, index) => {
          return (
            <div
              key={index}
              style={{
                width: "90%",
                maxWidth: "30.375rem",
                minHeight: "5.625rem",
                height: "auto",
                margin:
                  props.widthScreen < 920
                    ? "2.375rem 0 1.875rem 0"
                    : "2.375rem 1rem 1.875rem 1rem",
                padding: "0 0 0 1.625rem",
                opacity: "0.8",
                borderRadius: "6px",
                border: "solid 1px #979797",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  wordBreak: "break-word",
                  width: "30.125rem",
                  padding: "1.5rem 0",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "Roboto",
                    fontSize: "11px",
                    fontWeight: "normal",
                    fontStretch: "normal",
                    fontStyle: "normal",
                    lineHeight: "normal",
                    letterSpacing: "normal",
                    color: "#767676",
                  }}
                >
                  {moment(notice.created_at).fromNow()}
                </span>
                <span
                  style={{
                    display: "block",
                    padding: "0.7rem 0 0 0",
                    fontFamily: "Roboto",
                    fontSize: "14px",
                    fontWeight: "500",
                    fontStretch: "normal",
                    fontStyle: "normal",
                    lineHeight: "1.43",
                    letterSpacing: "0.25px",
                    color: "#6b6b6b",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open(notice.story_url);
                  }}
                >
                  {notice.story_title}
                </span>
              </div>
              <div
                style={{
                  width: "4.25rem",

                  margin: "0 0 0 1rem",
                  padding: "2.188rem 1.375rem 2.063rem",
                  borderRadius: "6px",
                  border: "solid 1px #f2f2f2",
                  backgroundColor: "#f2f2f2",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    deleteNewsStorage(index);
                  }}
                  src="img/trash.png"
                />
              </div>
            </div>
          );
        })}
      </div>
      {newsFaves?.length > 0 && (
        <Pagination
          variant="outlined"
          shape="rounded"
          count={maxPage}
          page={actualPage}
          onChange={(e, value) => {
            window.scrollTo(0, 0);
            setActualPage(value);
            setInfLim((value - 1) * 8);
            setSupLim((value + 1) * 8 - 8);
          }}
        />
      )}
    </>
  );
};

export default MyFaves;
