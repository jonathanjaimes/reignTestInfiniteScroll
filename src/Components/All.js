import React from "react";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import { CircularProgress } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

const All = (props) => {
  const refTotalPages = React.useRef();
  const [totalPages, setTotalPages] = React.useState();
  const refActualPage = React.useRef();
  const [actualPage, setActualPage] = React.useState(1);
  const refNews = React.useRef();
  const [news, setNews] = React.useState();
  const refSaved = React.useRef([]);
  const [flagShowHeart, setFlagShowHeart] = React.useState(false);
  const refLoading = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const refPrueba = React.useRef([]);

  const [pagina, setPagina] = React.useState(0);

  function peticion(tech) {
    // console.log(pagina, "pagina")
    // setLoading(true);
    fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${tech}&page=${pagina}&hitsPerPage=8`
    )
      .then((response) => response.json())
      .then((data) => {
        refPrueba.current = [...refPrueba.current, ...data.hits];

        console.log(refPrueba.current, "prueba");
        refTotalPages.current = data.nbPages;
        setTotalPages(refTotalPages.current);

        // refNews.current = data.hits;
        setNews(refPrueba.current);
        // refLoading.current = false;
        // setLoading(refLoading.current);
      });
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
    peticion(props.techSelected, 1);
    refActualPage.current = 1;
    setActualPage(refActualPage.current);

    if (!(JSON.parse(localStorage.getItem("newsSelected")) == null)) {
      refSaved.current = JSON.parse(localStorage.getItem("newsSelected"));
    }
  }, [props.techSelected]);

  React.useEffect(() => {}, [flagShowHeart]);

  return (
    <>
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
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              padding: "0 5% 0 5%",
            }}
          >
            <InfiniteScroll
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
                      maxWidth: "30.375rem",
                      minHeight: "5.625rem",
                      height: "auto",
                      margin:
                        props.widthScreen < 920
                          ? "2.375rem 0"
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
          {/* <Pagination
            variant="outlined"
            shape="rounded"
            count={totalPages}
            page={actualPage}
            onChange={(e, value) => {
              window.scrollTo(0, 0);
              setActualPage(value);
              peticion(props.techSelected, value);
            }}
          /> */}
        </div>
      )}
    </>
  );
};

export default All;
