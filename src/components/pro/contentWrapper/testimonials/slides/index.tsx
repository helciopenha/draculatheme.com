"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { wrap } from "@popmotion/popcorn";

type Review = {
  id: string;
  github: string;
  name: string;
  country: string;
  date: Date | string;
  body: string;
};

const xOffset = 100;
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? xOffset : -xOffset,
    opacity: 0,
  }),
  active: {
    x: 0,
    opacity: 1,
    transition: { delay: 0.2 },
  },
  exit: (direction) => ({
    x: direction > 0 ? -xOffset : xOffset,
    opacity: 0,
  }),
};

const Slides = ({ reviews, pages, currentPage, setPage, direction }) => {
  const hasPaginated = useRef(false);

  const startIndex = currentPage * 3;
  const endIndex = startIndex + 3;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const detectPaginationGesture = (e, { offset }) => {
    if (hasPaginated.current) return;
    let newPage = currentPage;
    const threshold = xOffset / 2;

    if (offset.x < -threshold) {
      newPage = currentPage + 1;
    } else if (offset.x > threshold) {
      newPage = currentPage - 1;
    }

    if (newPage !== currentPage) {
      hasPaginated.current = true;
      newPage = wrap(0, pages.length, newPage);
      setPage(newPage, offset.x < 0 ? 1 : -1);
    }
  };

  const relativeTime = (date: Date | string): string => {
    const now = new Date();
    const diffInSeconds = (now.getTime() - new Date(date).getTime()) / 1000;
    const diffInMinutes = diffInSeconds / 60;
    const diffInHours = diffInMinutes / 60;
    const diffInDays = diffInHours / 24;

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(diffInDays) > 1) {
      return rtf.format(Math.round(-diffInDays), "day");
    } else if (Math.abs(diffInHours) > 1) {
      return rtf.format(Math.round(-diffInHours), "hour");
    } else if (Math.abs(diffInMinutes) > 1) {
      return rtf.format(Math.round(-diffInMinutes), "minute");
    } else {
      return rtf.format(Math.round(-diffInSeconds), "second");
    }
  };

  return (
    <AnimatePresence initial={false} custom={direction}>
      <LayoutGroup id="slider-layout-group">
        <div className="slider-container">
          <motion.div
            key={currentPage}
            className="slide"
            data-page={currentPage}
            variants={variants}
            initial="enter"
            animate="active"
            exit="exit"
            drag="x"
            onDrag={detectPaginationGesture}
            onDragStart={() => (hasPaginated.current = false)}
            onDragEnd={() => (hasPaginated.current = true)}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            custom={direction}
          >
            {currentReviews.map((reviewValue: Review, index) => (
              <div
                key={index}
                id={`review-${reviewValue.github}`}
                className="review"
              >
                <div className="text">
                  <div dangerouslySetInnerHTML={{ __html: reviewValue.body }} />
                </div>
                <Link
                  href={`#review-${reviewValue.github}`}
                  target="_blank"
                  className="info"
                >
                  <div className="avatar">
                    <Image
                      src={`https://github.com/${reviewValue.github}.png?size=140`}
                      width={100}
                      height={100}
                      alt={reviewValue.name}
                    />
                  </div>
                  <div className="col wrapper">
                    <p className="name">{reviewValue.name}</p>
                    <div className="country">
                      <Image
                        src={`/images/flags/${reviewValue.country}.svg`}
                        width={50}
                        height={50}
                        alt={reviewValue.country}
                      />
                    </div>
                  </div>
                </Link>
                <span className="date">{relativeTime(reviewValue.date)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </LayoutGroup>
    </AnimatePresence>
  );
};

export default Slides;