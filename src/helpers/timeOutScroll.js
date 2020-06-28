const timeOutScroll = () => {
  setTimeout(() => {
    window.location.reload();
    window.scrollTo(0, document.querySelector('.App').scrollHeight);
  }, 1000);
};

export default timeOutScroll;
