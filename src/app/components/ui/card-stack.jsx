"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

let interval;

export const CardStack = ({ items, offset, scaleFactor }) => {
  const CARD_OFFSET = offset || 18;
  const SCALE_FACTOR = scaleFactor || 0.1;
  const [cards, setCards] = useState(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop());
        return newArray;
      });
    }, 5000);
  };

  return (
    // Wrapper scales up: 24rem × 24rem on small, 30rem × 30rem on md+
    <div className="relative h-96 w-96 md:h-[30rem] md:w-[30rem]">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="
            absolute 
            bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 
            h-96 w-96 md:h-[30rem] md:w-[30rem] 
            rounded-3xl p-8 
            border border-neutral-200 dark:border-neutral-600 
            shadow-2xl dark:shadow-xl 
            flex flex-col justify-between
          "
          style={{ transformOrigin: "top center" }}
          animate={{
            top: index * -CARD_OFFSET,
            scale: 1 - index * SCALE_FACTOR,
            zIndex: cards.length - index,
          }}
        >
          <div className="font-normal text-neutral-800 dark:text-neutral-200 text-xl">
            {card.content}
          </div>
          <div>
            <p className="text-neutral-700 dark:text-neutral-100 font-bold text-2xl">
              {card.name}
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg">
              {card.designation}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
