import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { useMatch, useNavigate } from "react-router-dom";

import styled from "styled-components";
import { getNowPlaying, IGetMoviesResult } from "../api";

import { NowPlaying, Popular, Upcoming } from "../Components/Slider";
import { makeImgPath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 7%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: xx-large;
  margin-bottom: 15px;
`;

const OverView = styled.p`
  font-size: medium;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  // const { scrollY } = useScroll(); 스크롤을 구해서 bigmovie를 화면 가운데로 보내려고 했음 이렇게 하는 것 보다 position fixed를 이용하는 것이 최적화 측면에서 더 좋다.
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getNowPlaying
  );

  const overlayClick = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId!);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading..</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImgPath(data?.results[11].backdrop_path || "")}>
            <Title>{data?.results[11].title}</Title>
            <OverView>{data?.results[11].overview}</OverView>
          </Banner>

          <NowPlaying />

          <Popular />
          <Upcoming />
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={overlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  // style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImgPath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
