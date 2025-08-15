const ErrorComponent = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-background text-center p-8 rounded-lg w-full">
      <div className="text-6xl mb-4">💥</div>

      <h1 className="text-2xl font-bold mb-2">Well, that is awkward.</h1>

      <p className="text-muted-foreground  max-w-md">
        Something went wrong while loading this page.
      </p>
      {message ? (
        <p className="font-semibold text-indigo-400">{message}</p>
      ) : (
        <p className="text-muted-foreground">
          Don’t worry — it’s probably not your fault
        </p>
      )}
    </div>
  );
};

export default ErrorComponent;
