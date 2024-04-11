import { PropsWithChildren, ReactNode, Suspense } from "react";

type SuspenserProps<T> = PropsWithChildren<{
  fetch: () => Promise<T>;
  renderElement?: (data: T) => ReactNode;
  renderErrorElement: (error: unknown) => ReactNode;
  result: (data: T) => void;
}>;

class PromiseResolver<T> {
  public state: "pending" | "error" | "success" = "pending";
  public data: T;
  public promise?: Promise<T>;
  public error: unknown;
  constructor(data: T) {
    this.data = data;
    this.promise = undefined;
  }

  bindPromise(promise: Promise<T>) {
    if (!this.promise) {
      this.promise = promise;
      promise
        .then((data) => {
          if (data) {
            this.state = "success";
            this.data = data;
          }
        })
        .catch((error) => {
          console.log(error, "error in resolver");
          this.state = "error";
          this.error = error;
        });

      return this.promise;
    }
  }
}

export function createPromiseResolver<T>(data: T) {
  const newPromiseResolve = new PromiseResolver({
    ...data,
  });
  function Suspenser(props: SuspenserProps<T>) {
    return (
      <Suspense fallback={<p>loading</p>}>
        <PromiseIntorplater {...props} />
      </Suspense>
    );
  }

  function PromiseIntorplater({
    children,
    fetch,
    renderElement,
    renderErrorElement,
    result,
  }: SuspenserProps<T>) {
    if (newPromiseResolve.state === "pending" && !newPromiseResolve.promise) {
      newPromiseResolve.bindPromise(fetch());
      throw newPromiseResolve.promise;
    }
    if (newPromiseResolve.data && newPromiseResolve.state === "success") {
      if (result) result(newPromiseResolve.data);

      if (renderElement) return renderElement(newPromiseResolve.data);
      return children;
    }
    if (newPromiseResolve.state === "error") {
      return renderErrorElement(newPromiseResolve.error);
    }
  }
  return Suspenser;
}
