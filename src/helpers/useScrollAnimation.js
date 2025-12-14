import { useEffect } from "react";

const useScrollAnimation = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

export default useScrollAnimation;

// import { useEffect } from "react";

// const useScrollAnimation = () => {
//   useEffect(() => {
//     const elements = document.querySelectorAll(".animate");

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("active");
//           } else {
//             entry.target.classList.remove("active");
//           }
//         });
//       },
//       {
//         threshold: 0.2,
//       }
//     );

//     elements.forEach((el) => observer.observe(el));

//     return () => observer.disconnect();
//   }, []);
// };

// export default useScrollAnimation;
