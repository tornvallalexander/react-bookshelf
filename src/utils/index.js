const pipe = (...fns) => (args) => fns.reduce((acc, curr) => curr(acc), args);
const pipeWithPromise = (...fns) => input => fns.reduce((chain, func) => chain.then(func), Promise.resolve(input));

export {
  pipe,
  pipeWithPromise,
};