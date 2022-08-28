import React from "react";
import { Modal } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import moment from "moment";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import Button from "@mui/material/Button";

const MyFaves = (props) => {
  const refActualFaves = React.useRef([]);
  const [newsFaves, setNewsFaves] = React.useState([]);
  const [maxPage, setMaxPage] = React.useState();
  const [actualPage, setActualPage] = React.useState(1);
  const [infLim, setInfLim] = React.useState(0);
  const [supLim, setSupLim] = React.useState(8);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      <Modal open={open} onClose={handleClose}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            backgroundColor: "#fff",
            boxShadow: "24px",
            padding: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <ReportGmailerrorredIcon
              sx={{ fontSize: "50px", color: "#ff0000" }}
            />
          </div>
          <p style={{ textAlign: "center" }}>
            Oops... Sorry, the page you are trying to access does not exist.
          </p>
          <div style={{ textAlign: "center" }}>
            <Button onClick={handleClose} variant="outlined">
              Close
            </Button>
          </div>
        </div>
      </Modal>

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
          padding: "0 5% 50px 5%",
        }}
      >
        {newsFaves?.slice(infLim, supLim).map((notice, index) => {
          console.log(notice.story_url, "URL");
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
                    if (!(notice.story_url == null)) {
                      window.open(notice.story_url);
                    } else {
                      handleOpen();
                    }
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
