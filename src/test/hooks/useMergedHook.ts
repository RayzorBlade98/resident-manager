function useMergedHook<H1, H2>(hook1: () => H1, hook2: () => H2): H1 & H2 {
  const hookResult1 = hook1();
  const hookResult2 = hook2();

  return { ...hookResult1, ...hookResult2 };
}

export default useMergedHook;
