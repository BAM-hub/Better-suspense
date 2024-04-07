import { PropsWithChildren, ReactNode, Suspense } from "react";

class PromiseResolver {
  public data: any;
  public promise: Promise<{ data: string } | undefined>;
  constructor() {}

  bindPromise(promise: Promise<any>) {
    this.promise = promise;
    promise
      .then((data) => {
        this.data = data;
      })
      .catch((err) => {
        throw new Error();
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
}: PropsWithChildren<{
  setData: (data: any) => void;
  fetch: Promise<any>;
  renderElement?: (data: any, index: number) => ReactNode;
}>) => {
  PromiseResolve.bindPromise(fetch);
  if (PromiseResolve.data) {
    // setData(PromiseResolve.data);
    if (renderElement) return renderElement(PromiseResolve.data);
    return children;
  }
  throw PromiseResolve.promise;
};

const Suspenser = ({
  setData,
  fetch,
  renderElement,
}: PropsWithChildren<{
  setData: (data: any) => void;
  fetch: Promise<any>;
  renderElement?: (data: any, index: number) => ReactNode;
}>) => {
  return (
    <Suspense fallback={<p>loading</p>}>
      <PromiseIntorplater
        renderElement={renderElement}
        fetch={fetch}
        setData={setData}
      />
    </Suspense>
  );
};
export default Suspenser;
