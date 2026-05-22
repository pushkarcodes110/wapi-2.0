export const enqueueCampaignJobWithFallback = async ({
  queue,
  name,
  data,
  options,
  processJob,
  onFallback
}) => {
  if (!queue || queue.inlineFallback || typeof queue.add !== 'function') {
    const result = await processJob(data);
    return { mode: 'inline', result };
  }

  try {
    const job = await queue.add(name, data, options);
    return { mode: 'queued', job };
  } catch (error) {
    if (typeof onFallback === 'function') {
      await onFallback(error);
    }

    const result = await processJob(data);
    return { mode: 'inline', result, error };
  }
};
