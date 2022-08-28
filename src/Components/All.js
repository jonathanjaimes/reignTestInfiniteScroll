import React from "react";
import moment from "moment";
import { CircularProgress, Modal } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import Button from "@mui/material/Button";

const All = (props) => {
  const [news, setNews] = React.useState();
  const refSaved = React.useRef([]);
  const [flagShowHeart, setFlagShowHeart] = React.useState(false);
  const refLoading = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const refPrueba = React.useRef([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [pagina, setPagina] = React.useState(0);

  function peticion(tech) {
    fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${tech}&page=${pagina}&hitsPerPage=4`
    )
      .then((response) => response.json())
      .then((data) => {
        refPrueba.current = [...refPrueba.current, ...data.hits];

        setNews(refPrueba.current);
      })
      .catch(e=>console.log(e))
    setPagina(pagina + 1);
  }

  function saveNewsStorage(createdAt, storyTitle, storyUrl, commentText) {
    let indexSelected = undefined;

    let existe = refSaved.current?.find((el, index) => {
      indexSelected = index;
      return el.story_title == storyTitle && el.comment_text == commentText;
    });
    if (existe == undefined) {
      refSaved.current?.push({
        created_at: createdAt,
        story_title: storyTitle,
        story_url: storyUrl,
        comment_text: commentText,
      });
      localStorage.setItem("newsSelected", JSON.stringify(refSaved.current));
    } else {
      refSaved.current = refSaved.current.filter(
        (elem, index) => index != indexSelected
      );
      localStorage.setItem("newsSelected", JSON.stringify(refSaved.current));
    }
  }

  React.useEffect(() => {
    setPagina(0);
    refPrueba.current = [];
    peticion(props.techSelected, pagina);

    if (!(JSON.parse(localStorage.getItem("newsSelected")) == null)) {
      refSaved.current = JSON.parse(localStorage.getItem("newsSelected"));
    }
  }, [props.techSelected]);

  React.useEffect(() => {}, [flagShowHeart]);

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

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "40px 0",
          }}
        >
          <CircularProgress />
        </div>
      )}

      {!loading && news && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "95%",
            }}
          >
            <InfiniteScroll
              loader={<h4>Loading...</h4>}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
              dataLength={news.length}
              next={() => peticion(props.techSelected)}
              hasMore={true}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
            >
              {news?.map((notice, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      width: "90%",
                      minHeight: "5.625rem",
                      height: "auto",
                      margin:
                        props.widthScreen < 920
                          ? "2.375rem 0"
                          : "2.375rem 0 1.875rem 0",
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
                        {notice.story_title || notice.title}
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
                      {refSaved.current.find(
                        (el) =>
                          el.story_title ==
                            (notice.story_title || notice.title) &&
                          el.comment_text == notice.comment_text
                      ) == undefined ? (
                        <img
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFlagShowHeart(!flagShowHeart);
                            saveNewsStorage(
                              notice.created_at,
                              notice.story_title || notice.title,
                              notice.story_url,
                              notice.comment_text
                            );
                          }}
                          src="img/favoriteOff.png"
                        />
                      ) : (
                        <img
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setFlagShowHeart(!flagShowHeart);
                            saveNewsStorage(
                              notice.created_at,
                              notice.story_title || notice.title,
                              notice.story_url,
                              notice.comment_text
                            );
                          }}
                          src="img/favoriteOn.png"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>
      )}
    </>
  );
};

export default All;
