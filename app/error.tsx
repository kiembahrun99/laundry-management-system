"use client";
export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }){ return <div className="d-flex align-items-center justify-content-center p-5"><div className="text-center"><h4>Something went wrong</h4><p className="text-muted">{error.message}</p><button className="btn btn-primary" onClick={reset}>Retry</button></div></div>; }
