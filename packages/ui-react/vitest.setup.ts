import '@testing-library/jest-dom';

// happy-dom doesn't implement Element.getAnimations(); Base UI's ScrollArea
// viewport calls it on a deferred timeout, throwing an uncaught error after the
// test completes. Stub it to an empty animation list.
if (typeof Element !== 'undefined' && !Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}
