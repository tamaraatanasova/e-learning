const initPlayer = async () => {
  if (typeof window !== "undefined") {
    const Plyr = (await import("plyr")).default;
    await import("plyr/dist/plyr.css");

    return Array.from(document.querySelectorAll(".player")).map((element) => {
      return new Plyr(element);
    });
  }
  return [];
};

export default initPlayer;
