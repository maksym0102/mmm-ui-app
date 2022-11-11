export const throttle = (func, ms = 200) => {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments);

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

export const debounce = (func, ms = 100) => {
  let context, savedArgs, timer = null;
  
  return function(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    context = this;
    savedArgs = args;

    timer = setTimeout(() => {
      func.apply(context, savedArgs);
      timer = null;
    }, ms);
  }
}
