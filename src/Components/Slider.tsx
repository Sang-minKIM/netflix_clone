import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import {
  getNowPlaying,
  getPopular,
  getUpcoming,
  IGetMoviesResult,
} from "../api";
import { indexState, leavingState } from "../atom";
import { makeImgPath } from "../utils";

const SliderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SliderBtn = styled.button`
  height: 18vh;
  width: 4vw;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.4);
  border: none;
  color: ${(props) => props.theme.white.darker};
  font-size: 5vh;
`;
const LeftBtn = styled(SliderBtn)``;

const RightBtn = styled(SliderBtn)``;

const SliderNow = styled.div`
  position: relative;
  top: -200px;
  width: 100%;
  margin: auto;
`;
const SliderPop = styled.div`
  position: relative;
  top: -50px;
  width: 90%;
  margin: auto;
`;

const SliderUp = styled.div`
  position: relative;
  top: 100px;
  width: 90%;
  margin: auto;
  margin-bottom: 10px;
`;

const Title = styled.h2``;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  margin: auto;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  left: 5vw;
  width: 90%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 18vh;
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  transform-origin: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 15px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
  }
`;

const rowVariants = {
  initial: {
    x: window.outerWidth + 5,
  },
  animate: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.3,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const offset = 6;

export function NowPlaying() {
  const navigate = useNavigate();
  const [back, setBack] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((curr) => !curr);
  const { data } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getNowPlaying
  );
  console.log(data);

  const rowVariants = {
    initial: (back: boolean) => ({
      x: back ? -window.outerWidth - 5 : window.outerWidth + 5,
    }),
    animate: {
      x: 0,
    },
    exit: (back: boolean) => ({
      x: back ? window.outerWidth + 5 : -window.outerWidth - 5,
    }),
  };
  const plusIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(false);
      const totalMovies = data.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      console.log(index + "plus");
    }
  };
  const minusIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setBack(true);
      setIndex((prev) => (prev === 0 ? 0 : prev - 1));
    }
    console.log(index + "minus");
  };
  const onBoxClick = (movieId: number) => navigate(`/movies/${movieId}`);
  return (
    <SliderNow>
      <Title>새로 올라온 콘텐츠</Title>
      <SliderWrapper>
        <LeftBtn onClick={minusIndex}>&lt;</LeftBtn>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            key={index}
            variants={rowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "tween", duration: 0.5 }}
          >
            {data?.results
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  onClick={() => onBoxClick(movie.id)}
                  transition={{ type: "tween", duration: 0.3 }}
                  variants={boxVariants}
                  initial="initial"
                  whileHover="hover"
                  key={movie.id}
                  bgphoto={makeImgPath(movie.backdrop_path, "w500")}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
        <RightBtn onClick={plusIndex}>&gt;</RightBtn>
      </SliderWrapper>
    </SliderNow>
  );
}

export function Popular() {
  const navigate = useNavigate();
  const index = useRecoilValue(indexState);
  const setLeaving = useSetRecoilState(leavingState);
  const toggleLeaving = () => setLeaving((curr) => !curr);
  const { data } = useQuery<IGetMoviesResult>(
    ["movies", "popular"],
    getPopular
  );

  const onBoxClick = (movieId: number) => navigate(`/movies/${movieId}`);
  return (
    <SliderPop>
      <Title>지금 뜨는 콘텐츠</Title>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          key={index}
          variants={rowVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
        >
          {data?.results
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                onClick={() => onBoxClick(movie.id)}
                transition={{ type: "tween", duration: 0.3 }}
                variants={boxVariants}
                initial="initial"
                whileHover="hover"
                key={movie.id}
                bgphoto={makeImgPath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </SliderPop>
  );
}
export function Upcoming() {
  const navigate = useNavigate();
  const index = useRecoilValue(indexState);
  const setLeaving = useSetRecoilState(leavingState);
  const toggleLeaving = () => setLeaving((curr) => !curr);
  const { data } = useQuery<IGetMoviesResult>(
    ["movies", "upcoming"],
    getUpcoming
  );

  const onBoxClick = (movieId: number) => navigate(`/movies/${movieId}`);
  return (
    <SliderUp>
      <Title>개봉예정 콘텐츠</Title>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          key={index}
          variants={rowVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
        >
          {data?.results
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                onClick={() => onBoxClick(movie.id)}
                transition={{ type: "tween", duration: 0.3 }}
                variants={boxVariants}
                initial="initial"
                whileHover="hover"
                key={movie.id}
                bgphoto={makeImgPath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{movie.title}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </SliderUp>
  );
}
