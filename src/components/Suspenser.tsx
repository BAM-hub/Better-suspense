import { PropsWithChildren, ReactNode, Suspense } from "react";

class PromiseResolver<T> {
  public state: "pending" | "error" | "success" = "pending";
  public data: T;
  public promise?: Promise<T>;
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
        .catch(() => {
          this.state = "error";
          console.log("error in resolver");
        });

      return this.promise;
    }
  }
}

export function createPromiseResolver<T>(data: T) {
  const newPromiseResolve = new PromiseResolver({
    ...data,
  });
  function Suspenser(
    props: PropsWithChildren<{
      fetch: Promise<T>;
      renderElement?: (data: T) => ReactNode;
      renderErrorElement: () => ReactNode;
    }>
  ) {
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
  }: PropsWithChildren<{
    fetch: Promise<T>;
    renderElement?: (data: T) => ReactNode;
    renderErrorElement: () => ReactNode;
  }>) {
    console.log("rerenderd");
    console.log(newPromiseResolve);
    if (newPromiseResolve.state === "pending" && !newPromiseResolve.promise) {
      newPromiseResolve.bindPromise(fetch);
      throw newPromiseResolve.promise;
    }
    if (newPromiseResolve.data && newPromiseResolve.state === "success") {
      if (renderElement) return renderElement(newPromiseResolve.data);
      return children;
    }
    if (newPromiseResolve.state === "error") {
      return renderErrorElement();
    }
  }
  return Suspenser;
}
