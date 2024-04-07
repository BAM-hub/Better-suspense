import { PropsWithChildren, ReactNode, Suspense } from "react";

class PromiseResolver {
  public state: "pending" | "error" | "success" = "pending";
  public data: any;
  public promise: Promise<{ data: string } | undefined>;
  constructor() {}

  bindPromise(promise: Promise<any>) {
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
  getState() {
    return this.state;
  }
}

const PromiseResolve = new PromiseResolver();

const PromiseIntorplater = ({
  setData,
  children,
  fetch,
  renderElement,
  renderErrorElement,
}: PropsWithChildren<{
  setData: (data: any) => void;
  fetch: Promise<any>;
  renderElement?: (data: any, index: number) => ReactNode;
  renderErrorElement: () => ReactNode;
}>) => {
  console.log("rerenderd");
  //   console.log("state", PromiseResolve.getState());
  //   console.log(PromiseResolve.state === "pending" && !PromiseResolve.promise, {
  //     state: PromiseResolve.state,
  //     promise: !PromiseResolve.promise,
  //   });
  //   return null;
  if (PromiseResolve.state === "pending" && !PromiseResolve.promise) {
    PromiseResolve.bindPromise(fetch);
    console.log("promise bind");
    throw PromiseResolve.promise;
  }
  if (PromiseResolve.data && PromiseResolve.state === "success") {
    // setData(PromiseResolve.data);
    if (renderElement) return renderElement(PromiseResolve.data);
    return children;
  }
  if (PromiseResolve.state === "error") {
    console.log("errior component");
    return renderErrorElement();
  }
};

const Suspenser = ({
  setData,
  fetch,
  renderElement,
  renderErrorElement,
}: PropsWithChildren<{
  setData: (data: any) => void;
  fetch: Promise<any>;
  renderElement?: (data: any, index: number) => ReactNode;
  renderErrorElement: () => ReactNode;
}>) => {
  return (
    <Suspense fallback={<p>loading</p>}>
      <PromiseIntorplater
        renderErrorElement={renderErrorElement}
        renderElement={renderElement}
        fetch={fetch}
        setData={setData}
      />
    </Suspense>
  );
};
export default Suspenser;
