import { PropsWithChildren, ReactNode, Suspense } from "react";

class PromiseResolver {
  public state: "pending" | "error" | "success" = "pending";
  public data: any;
  public promise: Promise<{ data: string } | undefined>;
  constructor() {}

  bindPromise(promise: Promise<any>) {
    this.promise = promise;
    promise
      .then((data) => {
        if (data) {
          this.state = "success";
          this.data = data;
        }
      })
      .catch(() => {
        console.log("error");
      });

    return this.promise;
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
  PromiseResolve.bindPromise(fetch);
  console.log(PromiseResolve.state);
  if (PromiseResolve.data && PromiseResolve.state === "success") {
    // setData(PromiseResolve.data);
    if (renderElement) return renderElement(PromiseResolve.data);
    return children;
  } else if (PromiseResolve.state === "error") {
    return renderErrorElement();
  }

  throw PromiseResolve.promise;
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
