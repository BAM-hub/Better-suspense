import { Fragment } from "react";
import "./App.css";
import { createPromiseResolver } from "./components/Suspenser";

type Response = {
  name: string;
  email: string;
}[];

type SecondResponse = {
  name: string;
};

function App() {
  const Suspenser = createPromiseResolver<[Response, SecondResponse]>([
    [],
    { name: "" },
  ]);
  return (
    <Suspenser
      fetch={() =>
        Promise.all([
          new Promise<Response>((res, rej) => {
            setTimeout(() => {
              res([
                {
                  name: "data",
                  email: "bam@shits.com",
                },
              ]);
            }, 3000);
            setTimeout(() => {
              rej("err");
            }, 3000);
          }),
          new Promise<SecondResponse>((res, rej) => {
            // setTimeout(() => {
            //   res({
            //     name: "data",
            //   });
            // }, 3000);
            setTimeout(() => {
              rej("err");
            }, 3000);
          }),
        ])
      }
      result={(data) => {
        console.log("res", data);
      }}
      renderErrorElement={(e) => {
        console.log("propegated the error", e);
        return <>somthing went wrong</>;
      }}
      renderElement={(data) => {
        return (
          <>
            {data[0].map((item, index) => (
              <Fragment key={index}>
                {item.name} {item.email}
              </Fragment>
            ))}
          </>
        );
      }}
    ></Suspenser>
  );
}
export default App;
